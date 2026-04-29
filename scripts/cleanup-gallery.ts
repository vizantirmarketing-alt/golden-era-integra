/**
 * Deletes every `galleryImage` document in the configured Sanity dataset.
 * Pass `--confirm` to perform deletes; without it, only lists IDs (dry run).
 */
import { getSanityWriteToken } from "./load-env-local";
import * as path from "node:path";
import { createRequire } from "node:module";

const repoRoot = process.cwd();

type SanityCleanupClient = {
  fetch: <T>(query: string) => Promise<T>;
  delete: (id: string) => Promise<unknown>;
};

const requireSanity = createRequire(path.join(repoRoot, "package.json"));
const { createClient } = requireSanity("@sanity/client") as {
  createClient: (config: Record<string, unknown>) => SanityCleanupClient;
};

const DEFAULT_PROJECT_ID = "4dgncr6u";
const DEFAULT_DATASET = "production";

function getClient(): SanityCleanupClient {
  const token = getSanityWriteToken();
  if (!token) {
    console.error(
      "Missing Sanity write token: set SANITY_AUTH_TOKEN or SANITY_API_TOKEN (e.g. in .env.local at repo root).",
    );
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
  const confirm = process.argv.includes("--confirm");
  const client = getClient();
  const ids = await client.fetch<string[]>('*[_type == "galleryImage"]._id');

  console.log(`Found ${ids.length} galleryImage document(s).`);
  if (ids.length === 0) {
    return;
  }

  for (const id of ids) {
    console.log(`  would delete: ${id}`);
  }

  if (!confirm) {
    console.log("Dry run only. Re-run with --confirm to delete these documents.");
    return;
  }

  let done = 0;
  for (const id of ids) {
    await client.delete(id);
    done += 1;
    console.log(`Deleted (${done}/${ids.length}): ${id}`);
  }

  console.log(`Done. Removed ${ids.length} document(s).`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
