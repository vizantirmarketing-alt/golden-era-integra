/**
 * Patch existing `galleryImage` parts-phase docs with `aspectRatio` from `src/lib/parts-gallery.ts`
 * (matches deterministic `_id` from `import-parts-phase.ts`). Does not upload assets or create docs.
 *
 * Dry run by default. Pass `--confirm` to apply patches.
 *
 * Run:
 *   npm run backfill-parts-aspect-ratio
 *   npm run backfill-parts-aspect-ratio -- --confirm
 */
import { getSanityWriteToken } from "./load-env-local";
import { PARTS_IMPORT_ENTRIES } from "../src/lib/parts-gallery";
import * as path from "node:path";
import { createRequire } from "node:module";

const repoRoot = process.cwd();

const requireSanity = createRequire(path.join(repoRoot, "package.json"));
const { createClient } = requireSanity("@sanity/client") as {
  createClient: (config: Record<string, unknown>) => {
    patch: (id: string) => {
      set: (attrs: Record<string, unknown>) => { commit: () => Promise<unknown> };
    };
  };
};

const idFromPartsFile = (filename: string) =>
  "gallery-parts-" +
  path
    .basename(filename)
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9-]/gi, "-")
    .toLowerCase();

const DEFAULT_PROJECT_ID = "4dgncr6u";
const DEFAULT_DATASET = "production";

function getClient() {
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

  console.log(
    confirm
      ? "Applying aspectRatio patches with --confirm."
      : "Dry run: no patches. Pass --confirm to write to Sanity.",
  );

  const client = confirm ? getClient() : null;

  for (const entry of PARTS_IMPORT_ENTRIES) {
    const docId = idFromPartsFile(entry.file);
    const aspectRatio = entry.aspectRatio ?? "landscape";

    if (!confirm) {
      console.log(`  would patch ${docId}  aspectRatio=${aspectRatio}  (${entry.file})`);
      continue;
    }

    await client!.patch(docId).set({ aspectRatio }).commit();
    console.log(`  patched ${docId}  aspectRatio=${aspectRatio}`);
  }

  if (!confirm) {
    console.log("\nRe-run with: npm run backfill-parts-aspect-ratio -- --confirm");
  } else {
    console.log("Backfill finished.");
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
