/**
 * Verify duplicate Town Square photoSession docs, optionally delete the duplicate.
 *
 * Usage:
 *   tsx scripts/verify-town-square-sessions.ts           # verify only (default)
 *   tsx scripts/verify-town-square-sessions.ts --confirm # delete session-town-square-day
 *
 * Deletes only the photoSession document body — image assets stay in the dataset.
 */
import { getSanityWriteToken } from "./load-env-local";
import * as path from "node:path";
import { createRequire } from "node:module";

const repoRoot = process.cwd();

type SanityClient = {
  fetch: <T>(query: string, params?: Record<string, unknown>) => Promise<T>;
  delete: (id: string) => Promise<unknown>;
};

const requireSanity = createRequire(path.join(repoRoot, "package.json"));
const { createClient } = requireSanity("@sanity/client") as {
  createClient: (config: Record<string, unknown>) => SanityClient;
};

const DEFAULT_PROJECT_ID = "4dgncr6u";
const DEFAULT_DATASET = "production";

const KEEP_ID = "session-town-square";
const DELETE_ID = "session-town-square-day";

function getClient(): SanityClient {
  const token = getSanityWriteToken();
  if (!token) {
    console.error(
      "Missing Sanity token: set SANITY_AUTH_TOKEN or SANITY_API_TOKEN (e.g. in .env.local at repo root).",
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

type ImageBlock = { _type?: string; asset?: { _ref?: string } };

function photoAssetRefs(photos: unknown): string[] {
  if (!Array.isArray(photos)) {
    return [];
  }
  return photos.map((p: ImageBlock) => p?.asset?._ref ?? "").filter(Boolean);
}

async function main(): Promise<void> {
  const confirm = process.argv.includes("--confirm");
  const client = getClient();

  const query = `*[_id in $ids]{ _id, _type, title, slug, photos }`;
  const docs = await client.fetch<
    Array<{
      _id: string;
      _type: string;
      title?: string;
      slug?: { current?: string };
      photos?: unknown;
    }>
  >(query, { ids: [KEEP_ID, DELETE_ID] });

  const byId = new Map(docs.map((d) => [d._id, d]));
  const keep = byId.get(KEEP_ID);
  const dup = byId.get(DELETE_ID);

  console.log("--- Verification ---");
  console.log(`Project: ${process.env.SANITY_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? DEFAULT_PROJECT_ID}`);
  console.log(`Dataset: ${process.env.SANITY_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET ?? DEFAULT_DATASET}`);
  console.log("");

  if (!keep) {
    console.error(`FAIL: Document "${KEEP_ID}" not found.`);
    process.exit(1);
  }
  if (!dup) {
    console.error(`FAIL: Document "${DELETE_ID}" not found.`);
    process.exit(1);
  }

  const keepRefs = photoAssetRefs(keep.photos);
  const dupRefs = photoAssetRefs(dup.photos);

  console.log(`[${KEEP_ID}]`);
  console.log(`  _type: ${keep._type}`);
  console.log(`  title: ${keep.title ?? "(none)"}`);
  console.log(`  slug: ${keep.slug?.current ?? "(none)"}`);
  console.log(`  photo count: ${keepRefs.length}`);
  console.log(`  asset _refs (order):`);
  keepRefs.forEach((ref, i) => console.log(`    ${i + 1}. ${ref}`));

  console.log("");
  console.log(`[${DELETE_ID}]`);
  console.log(`  _type: ${dup._type}`);
  console.log(`  title: ${dup.title ?? "(none)"}`);
  console.log(`  slug: ${dup.slug?.current ?? "(none)"}`);
  console.log(`  photo count: ${dupRefs.length}`);
  console.log(`  asset _refs (order):`);
  dupRefs.forEach((ref, i) => console.log(`    ${i + 1}. ${ref}`));

  console.log("");
  const sixOk = keepRefs.length === 6 && dupRefs.length === 6;
  const sameRefs =
    keepRefs.length === dupRefs.length && keepRefs.every((r, i) => r === dupRefs[i]);
  const bothPhotoSession = keep._type === "photoSession" && dup._type === "photoSession";

  console.log(`Checks:`);
  console.log(`  session-town-square has exactly 6 photos: ${sixOk ? "PASS" : "FAIL"}`);
  console.log(`  session-town-square-day has same count as session-town-square: ${keepRefs.length === dupRefs.length ? "PASS" : "FAIL"}`);
  console.log(`  Same 6 asset _refs in same order: ${sameRefs ? "PASS" : "FAIL"}`);
  console.log(`  Both documents are type photoSession: ${bothPhotoSession ? "PASS" : "FAIL"}`);

  if (!sixOk || !sameRefs || !bothPhotoSession) {
    console.error("\nAborting: verification did not pass; no delete will run.");
    process.exit(1);
  }

  console.log("\n--- Delete plan ---");
  console.log(`Action: client.delete("${DELETE_ID}")`);
  console.log(`Effect: Removes only the photoSession document; image assets (${dupRefs.length} refs) remain unless deleted separately (they will not be).`);
  console.log(`Keep: "${KEEP_ID}" unchanged.`);

  if (!confirm) {
    console.log("\nDry run complete. Re-run with --confirm after you approve to perform the delete.");
    return;
  }

  await client.delete(DELETE_ID);
  console.log(`\nDeleted document "${DELETE_ID}".`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
