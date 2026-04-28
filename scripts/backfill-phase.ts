/**
 * One-time (or repeat-safe) patch: set `phase: "before"` on all galleryImage
 * documents whose `_id` matches the prefix `gallery-`.
 *
 * Requires: SANITY_AUTH_TOKEN. Optional: SANITY_PROJECT_ID, SANITY_DATASET.
 *
 * Do not run from CI unless intended — this mutates production content.
 */
import * as path from "node:path";
import { createRequire } from "node:module";

const repoRoot = process.cwd();

type SanityWriteClient = {
  fetch: <T>(query: string) => Promise<T>;
  patch: (id: string) => {
    set: (doc: Record<string, unknown>) => { commit: () => Promise<unknown> };
  };
};

const requireSanity = createRequire(path.join(repoRoot, "package.json"));
const { createClient } = requireSanity("@sanity/client") as {
  createClient: (config: Record<string, unknown>) => SanityWriteClient;
};

const DEFAULT_PROJECT_ID = "4dgncr6u";
const DEFAULT_DATASET = "production";

function getClient(): SanityWriteClient {
  const token = process.env.SANITY_AUTH_TOKEN;
  if (!token) {
    console.error("Missing SANITY_AUTH_TOKEN (Sanity write token).");
    process.exit(1);
  }
  const projectId =
    process.env.SANITY_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? DEFAULT_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET ?? DEFAULT_DATASET;

  return createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: false,
    token,
  });
}

async function main(): Promise<void> {
  const client = getClient();
  const ids = await client.fetch<string[]>(
    `*[_type == "galleryImage" && _id match "gallery-*"]._id`
  );

  if (!ids.length) {
    console.log('No documents matched *[_type == "galleryImage" && _id match "gallery-*"].');
    return;
  }

  for (const id of ids) {
    await client.patch(id).set({ phase: "before" }).commit();
    console.log(`Patched ${id} → phase: "before"`);
  }

  console.log(`Done. Updated ${ids.length} document(s).`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
