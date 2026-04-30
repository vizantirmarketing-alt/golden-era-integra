/**
 * Bulk-import heritage shots into Sanity as `heritageShot` documents.
 * Loads `.env.local` from repo root when present. Write token: `SANITY_AUTH_TOKEN` or
 * `SANITY_API_TOKEN`. Optional: SANITY_PROJECT_ID, SANITY_DATASET (defaults match sanity/sanity.config.ts).
 */
import { getSanityWriteToken } from "./load-env-local";
import * as fs from "node:fs";
import * as path from "node:path";
import { createRequire } from "node:module";

/** Run via `npm run import-heritage` from the repo root so cwd matches the project. */
const repoRoot = process.cwd();
const uploadsDir = path.join(repoRoot, "lineage-uploads");
const manifestPath = path.join(repoRoot, "scripts", "heritage-shots.json");

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

type HeritageShotEntry = {
  filename: string;
  caption: string;
  kanji?: string;
  kanjiRomaji?: string;
  subjects?: string;
  location?: string;
  capturedAt?: string;
  order: number;
};

const DEFAULT_PROJECT_ID = "4dgncr6u";
const DEFAULT_DATASET = "production";

/** Deterministic document `_id` from image basename (stable across re-imports). */
const idFromFilename = (filename: string) =>
  "heritage-" +
  path
    .basename(filename)
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9-]/gi, "-")
    .toLowerCase();

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

/** Max 5 attempts per operation; waits 1s, 2s, 4s, 8s after failures 1–4 (a fifth 16s wait would require a 6th attempt). */
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

/** Retries transient Sanity / network failures with exponential backoff. Does not retry other 4xx/5xx (only 502–503–504 and network cases above). */
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

function readManifest(): HeritageShotEntry[] {
  const raw = fs.readFileSync(manifestPath, "utf8");
  const data = JSON.parse(raw) as unknown;
  if (!Array.isArray(data)) {
    throw new Error(`${manifestPath} must be a JSON array of heritage shot entries.`);
  }
  return data as HeritageShotEntry[];
}

async function main(): Promise<void> {
  const entries = readManifest();

  if (entries.length === 0) {
    console.log("No entries in heritage-shots.json; nothing to import.");
    return;
  }

  const client = getClient();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]!;
    const photoFile = entry.filename;
    const label = `[${i + 1}/${entries.length}] ${photoFile}`;

    if (!photoFile || typeof photoFile !== "string") {
      console.error(`${label}: each entry needs a "filename" string.`);
      process.exit(1);
    }
    if (!entry.caption || typeof entry.caption !== "string") {
      console.error(`${label}: "caption" is required.`);
      process.exit(1);
    }
    if (entry.order === undefined || typeof entry.order !== "number") {
      console.error(`${label}: "order" is required (number).`);
      process.exit(1);
    }

    const filePath = path.join(uploadsDir, photoFile);
    if (!fs.existsSync(filePath)) {
      console.error(
        `${label}: file not found at ${filePath}\n  (expected under lineage-uploads/ at repo root)`,
      );
      continue;
    }

    const asset = await withRetry(
      () =>
        client.assets.upload("image", fs.createReadStream(filePath), {
          filename: path.basename(photoFile),
        }),
      photoFile,
    );

    const docId = idFromFilename(photoFile);
    await withRetry(
      () =>
        client.createOrReplace({
          _id: docId,
          _type: "heritageShot",
          image: {
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
          },
          caption: entry.caption,
          kanji: entry.kanji,
          kanjiRomaji: entry.kanjiRomaji,
          subjects: entry.subjects,
          location: entry.location,
          capturedAt: entry.capturedAt,
          order: entry.order,
        }),
      photoFile,
    );

    console.log(`${label}: createOrReplace heritageShot ${docId} with asset ${asset._id}`);
  }

  console.log("Import finished.");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
