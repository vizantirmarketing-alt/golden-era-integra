/**
 * Import Parts-phase gallery images from `gallery-uploads/parts/` into Sanity as `galleryImage`
 * (phase: `parts`, shown as the last segment of /archive when images exist).
 *
 * Dry run by default. Pass `--confirm` to upload assets and create/replace documents.
 *
 * Env: same as `import-gallery.ts` — SANITY_AUTH_TOKEN / SANITY_API_TOKEN, optional SANITY_PROJECT_ID / SANITY_DATASET.
 *
 * Run (from repo root):
 *   npm run import-parts
 *   npm run import-parts -- --confirm
 */
import { getSanityWriteToken } from "./load-env-local";
import { PARTS_IMPORT_ENTRIES } from "../src/lib/parts-gallery";
import * as fs from "node:fs";
import * as path from "node:path";
import { createRequire } from "node:module";

const repoRoot = process.cwd();
const partsDir = path.join(repoRoot, "gallery-uploads", "parts");

type SanityClient = {
  assets: {
    upload: (
      type: string,
      body: fs.ReadStream,
      options: { filename: string },
    ) => Promise<{ _id: string }>;
  };
  createOrReplace: (doc: Record<string, unknown>) => Promise<unknown>;
};

const requireSanity = createRequire(path.join(repoRoot, "package.json"));
const { createClient } = requireSanity("@sanity/client") as {
  createClient: (config: Record<string, unknown>) => SanityClient;
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

const RETRY_MAX_ATTEMPTS = 5;
const RETRY_BACKOFF_MS = [1000, 2000, 4000, 8000] as const;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getErrorDetails(error: unknown): { statusCode?: number; code?: string; message: string } {
  if (error && typeof error === "object") {
    const o = error as Record<string, unknown>;
    const statusCode = typeof o.statusCode === "number" ? o.statusCode : undefined;
    const code = typeof o.code === "string" ? o.code : undefined;
    const message = typeof o.message === "string" ? o.message : String(error);
    return { statusCode, code, message };
  }
  return { message: String(error) };
}

function isRetryableError(error: unknown): boolean {
  const { statusCode, code, message } = getErrorDetails(error);
  if (statusCode !== undefined) {
    if (statusCode >= 400 && statusCode < 500) {
      return false;
    }
    if ([502, 503, 504].includes(statusCode)) {
      return true;
    }
  }
  if (code === "ECONNRESET" || code === "ETIMEDOUT" || code === "ENOTFOUND") {
    return true;
  }
  const m = message.toLowerCase();
  if (m.includes("fetch failed") || m.includes("network")) {
    return true;
  }
  return false;
}

async function withRetry<T>(operation: () => Promise<T>, label: string): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= RETRY_MAX_ATTEMPTS; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const { statusCode, code, message } = getErrorDetails(error);
      const detail =
        statusCode !== undefined ? `status ${statusCode}` : code !== undefined ? `code ${code}` : message;

      if (attempt === RETRY_MAX_ATTEMPTS || !isRetryableError(error)) {
        throw error;
      }

      const waitMs = RETRY_BACKOFF_MS[attempt - 1]!;
      console.log(
        `[retry] ${label} attempt ${attempt}/${RETRY_MAX_ATTEMPTS} failed (${detail}). Waiting ${waitMs}ms…`,
      );
      await sleep(waitMs);
    }
  }
  throw lastError;
}

function getClient(): SanityClient {
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

  const dirExists = fs.existsSync(partsDir);

  if (confirm && !dirExists) {
    console.error(`Missing folder: ${partsDir}\nCreate it and add the parts JPEGs before running with --confirm.`);
    process.exit(1);
  }

  const missing: string[] = [];
  if (dirExists) {
    for (const entry of PARTS_IMPORT_ENTRIES) {
      const filePath = path.join(partsDir, entry.file);
      if (!fs.existsSync(filePath)) {
        missing.push(entry.file);
      }
    }
  } else {
    for (const entry of PARTS_IMPORT_ENTRIES) {
      missing.push(entry.file);
    }
  }

  console.log(
    confirm
      ? "Running Parts import with --confirm (upload + createOrReplace)."
      : "Dry run: no uploads. Pass --confirm to import to Sanity.",
  );
  console.log(`Entries: ${PARTS_IMPORT_ENTRIES.length}`);

  if (!confirm) {
    for (const entry of PARTS_IMPORT_ENTRIES) {
      const ok = fs.existsSync(path.join(partsDir, entry.file));
      console.log(
        `  [order ${entry.order}] ${entry.file}  gridSpan=${entry.gridSpan}  → ${idFromPartsFile(entry.file)}${ok ? "" : "  (file missing)"}`,
      );
    }
    if (missing.length > 0) {
      console.log(`\n${missing.length} file(s) missing — add them before running with --confirm.`);
    } else {
      console.log("\nRe-run with: npm run import-parts -- --confirm");
    }
    return;
  }

  if (missing.length > 0) {
    console.error("Missing files in gallery-uploads/parts/ (required with --confirm):");
    for (const f of missing) {
      console.error(`  - ${f}`);
    }
    process.exit(1);
  }

  const client = getClient();

  for (let i = 0; i < PARTS_IMPORT_ENTRIES.length; i++) {
    const entry = PARTS_IMPORT_ENTRIES[i]!;
    const label = `[${i + 1}/${PARTS_IMPORT_ENTRIES.length}] ${entry.file}`;
    const filePath = path.join(partsDir, entry.file);

    const asset = await withRetry(
      () =>
        client.assets.upload("image", fs.createReadStream(filePath), {
          filename: path.basename(entry.file),
        }),
      entry.file,
    );

    const docId = idFromPartsFile(entry.file);
    await withRetry(
      () =>
        client.createOrReplace({
          _id: docId,
          _type: "galleryImage",
          image: {
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
            alt: entry.alt,
          },
          caption: entry.caption,
          location: "Las Vegas, NV",
          shotOn: "Digital",
          order: entry.order,
          gridSpan: entry.gridSpan,
          phase: "parts",
          aspectRatio: entry.aspectRatio ?? "landscape",
        }),
      entry.file,
    );

    console.log(`${label}: createOrReplace galleryImage ${docId} with asset ${asset._id}`);
  }

  console.log("Parts import finished.");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
