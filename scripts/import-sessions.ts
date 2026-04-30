/**
 * Bulk-import photo sessions into Sanity as `photoSession` documents.
 * Loads `.env.local` from repo root when present. Write token: `SANITY_AUTH_TOKEN` or
 * `SANITY_API_TOKEN`. Optional: SANITY_PROJECT_ID, SANITY_DATASET (defaults match sanity/sanity.config.ts).
 */
import { getSanityWriteToken } from "./load-env-local";
import * as fs from "node:fs";
import * as path from "node:path";
import { createRequire } from "node:module";

/** Run via `npm run import-sessions` from the repo root so cwd matches the project. */
const repoRoot = process.cwd();
const uploadsDir = path.join(repoRoot, "session-uploads");
const manifestPath = path.join(repoRoot, "scripts", "photo-sessions.json");

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

type PhotoSessionEntry = {
  slug: string;
  title: string;
  kanji?: string;
  kanjiRomaji?: string;
  location?: string;
  capturedAt?: string;
  intro?: string;
  order: number;
  folder: string;
  photos: string[];
};

const DEFAULT_PROJECT_ID = "4dgncr6u";
const DEFAULT_DATASET = "production";

/** Deterministic document `_id` from session slug (stable across re-imports). */
const idFromSlug = (slug: string) => `session-${slug}`;

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

function readManifest(): PhotoSessionEntry[] {
  const raw = fs.readFileSync(manifestPath, "utf8");
  const data = JSON.parse(raw) as unknown;
  if (!Array.isArray(data)) {
    throw new Error(`${manifestPath} must be a JSON array of photo session entries.`);
  }
  return data as PhotoSessionEntry[];
}

async function main(): Promise<void> {
  const entries = readManifest();

  if (entries.length === 0) {
    console.log("No entries in photo-sessions.json; nothing to import.");
    return;
  }

  const client = getClient();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]!;
    const sessionLabel = `[${i + 1}/${entries.length}] ${entry.slug || "(missing slug)"}`;
    console.log(`${sessionLabel}: importing session "${entry.title ?? "(missing title)"}"`);

    if (!entry.slug || typeof entry.slug !== "string") {
      console.error(`${sessionLabel}: "slug" is required.`);
      process.exit(1);
    }
    if (!entry.title || typeof entry.title !== "string") {
      console.error(`${sessionLabel}: "title" is required.`);
      process.exit(1);
    }
    if (entry.order === undefined || typeof entry.order !== "number") {
      console.error(`${sessionLabel}: "order" is required (number).`);
      process.exit(1);
    }
    if (!entry.folder || typeof entry.folder !== "string") {
      console.error(`${sessionLabel}: "folder" is required (string).`);
      process.exit(1);
    }
    if (!Array.isArray(entry.photos) || entry.photos.length === 0) {
      console.error(`${sessionLabel}: "photos" is required (non-empty array).`);
      process.exit(1);
    }

    const photos = [];
    for (let j = 0; j < entry.photos.length; j++) {
      const filename = entry.photos[j]!;
      const photoLabel = `${sessionLabel} photo [${j + 1}/${entry.photos.length}] ${filename}`;
      if (!filename || typeof filename !== "string") {
        console.error(`${photoLabel}: invalid filename.`);
        process.exit(1);
      }

      const filePath = path.join(uploadsDir, entry.folder, filename);
      if (!fs.existsSync(filePath)) {
        console.error(`${photoLabel}: file not found at ${filePath}`);
        process.exit(1);
      }

      console.log(`${photoLabel}: uploading`);
      const asset = await withRetry(
        () =>
          client.assets.upload("image", fs.createReadStream(filePath), {
            filename: path.basename(filename),
          }),
        `${entry.slug}/${filename}`,
      );

      photos.push({
        _key: `${j}-${path.basename(filename, path.extname(filename)).replace(/[^a-z0-9-]/gi, "-").toLowerCase()}`,
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      });
      console.log(`${photoLabel}: uploaded asset ${asset._id}`);
    }

    const docId = idFromSlug(entry.slug);
    const doc: Record<string, unknown> = {
      _id: docId,
      _type: "photoSession",
      title: entry.title,
      slug: { _type: "slug", current: entry.slug },
      kanji: entry.kanji,
      kanjiRomaji: entry.kanjiRomaji,
      location: entry.location,
      order: entry.order,
      photos,
    };
    if (entry.capturedAt) {
      doc.capturedAt = entry.capturedAt;
    }
    if (entry.intro) {
      doc.intro = entry.intro;
    }

    await withRetry(() => client.createOrReplace(doc), entry.slug);
    console.log(`${sessionLabel}: createOrReplace photoSession ${docId} with ${photos.length} photos`);
  }

  console.log("Session import finished.");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
