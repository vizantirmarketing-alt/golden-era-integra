/**
 * Bulk-import gallery images into Sanity as `galleryImage` documents.
 * Loads `.env.local` from repo root when present. Write token: `SANITY_AUTH_TOKEN` or
 * `SANITY_API_TOKEN`. Optional: SANITY_PROJECT_ID, SANITY_DATASET (defaults match sanity/sanity.config.ts).
 */
import { getSanityWriteToken } from "./load-env-local";
import * as fs from "node:fs";
import * as path from "node:path";
import { createRequire } from "node:module";

/** Run via `npm run import-gallery` from the repo root so cwd matches the project. */
const repoRoot = process.cwd();
const uploadsDir = path.join(repoRoot, "gallery-uploads");
const manifestPath = path.join(repoRoot, "scripts", "gallery-photos.json");

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

type GridSpan = "g1" | "g2" | "g3" | "g4" | "g5" | "g6" | "g7" | "g8" | "g9";
type ShotOn = "Film 35mm" | "Digital" | "Medium Format";
type GalleryPhase =
  | "before"
  | "disassembly"
  | "body-prep"
  | "fitting"
  | "paint"
  | "assembly"
  | "engine"
  | "finished";

type GalleryPhotoEntry = {
  /** Filename inside gallery-uploads/ (or under a subfolder). Alias: `filename`. */
  file?: string;
  filename?: string;
  /**
   * Subfolder under `gallery-uploads/` (e.g. `before`, `paint`, or a custom path).
   * When set, the file is read from `gallery-uploads/{folder}/{filename}` and overrides
   * the phase-based default path.
   */
  folder?: string;
  alt: string;
  caption?: string;
  location?: string;
  shotOn?: ShotOn;
  /** ISO date string YYYY-MM-DD */
  capturedAt?: string;
  order?: number;
  gridSpan?: GridSpan;
  /** Build phase; omitted entries default to `"before"`. Also used as default subfolder when `folder` is omitted. */
  phase?: GalleryPhase;
};

const DEFAULT_PROJECT_ID = "4dgncr6u";
const DEFAULT_DATASET = "production";

const SHOT_ON_VALUES: readonly ShotOn[] = ["Film 35mm", "Digital", "Medium Format"] as const;
const GRID_SPAN_VALUES: readonly GridSpan[] = ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9"] as const;
const PHASE_VALUES: readonly GalleryPhase[] = [
  "before",
  "disassembly",
  "body-prep",
  "fitting",
  "paint",
  "assembly",
  "engine",
  "finished",
] as const;

function isShotOn(v: unknown): v is ShotOn {
  return typeof v === "string" && (SHOT_ON_VALUES as readonly string[]).includes(v);
}

function isGridSpan(v: unknown): v is GridSpan {
  return typeof v === "string" && (GRID_SPAN_VALUES as readonly string[]).includes(v);
}

function isPhase(v: unknown): v is GalleryPhase {
  return typeof v === "string" && (PHASE_VALUES as readonly string[]).includes(v);
}

function entryFilename(entry: GalleryPhotoEntry): string | undefined {
  if (typeof entry.file === "string" && entry.file.length > 0) return entry.file;
  if (typeof entry.filename === "string" && entry.filename.length > 0) return entry.filename;
  return undefined;
}

/** Deterministic document `_id` from image basename (stable across re-imports). */
const idFromFilename = (filename: string) =>
  "gallery-" +
  path
    .basename(filename)
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9-]/gi, "-")
    .toLowerCase();

/** Non-empty trimmed `folder`, or undefined if absent / blank. */
function entryFolder(entry: GalleryPhotoEntry): string | undefined {
  if (typeof entry.folder !== "string") {
    return undefined;
  }
  const t = entry.folder.trim();
  return t.length > 0 ? t : undefined;
}

/**
 * Where to read the file from under `gallery-uploads/`:
 * 1. `folder` → `gallery-uploads/{folder}/{filename}`
 * 2. else valid `phase` → `gallery-uploads/{phase}/{filename}`
 * 3. else → `gallery-uploads/{filename}`
 */
function resolveGallerySourceFile(
  entry: GalleryPhotoEntry,
  photoFile: string,
  uploadsRoot: string,
): { absolute: string; displayRelative: string } {
  const folder = entryFolder(entry);
  let segments: string[];
  if (folder !== undefined) {
    segments = [folder, photoFile];
  } else if (isPhase(entry.phase)) {
    segments = [entry.phase!, photoFile];
  } else {
    segments = [photoFile];
  }
  const absolute = path.join(uploadsRoot, ...segments);
  const displayRelative = path.join("gallery-uploads", ...segments).replace(/\\/g, "/");
  return { absolute, displayRelative };
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

function readManifest(): GalleryPhotoEntry[] {
  const raw = fs.readFileSync(manifestPath, "utf8");
  const data = JSON.parse(raw) as unknown;
  if (!Array.isArray(data)) {
    throw new Error(`${manifestPath} must be a JSON array of photo entries.`);
  }
  return data as GalleryPhotoEntry[];
}

async function main(): Promise<void> {
  const entries = readManifest();

  if (entries.length === 0) {
    console.log("No entries in gallery-photos.json; nothing to import.");
    return;
  }

  const client = getClient();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const photoFile = entryFilename(entry);
    const label = `[${i + 1}/${entries.length}] ${photoFile ?? "(missing file)"}`;

    if (!photoFile) {
      console.error(`${label}: each entry needs a "filename" or "file" string.`);
      process.exit(1);
    }
    if (!entry.alt || typeof entry.alt !== "string") {
      console.error(`${label}: "alt" is required (nested on image in Sanity).`);
      process.exit(1);
    }

    if (entry.shotOn !== undefined && !isShotOn(entry.shotOn)) {
      console.error(`${label}: invalid shotOn "${String(entry.shotOn)}". Use one of: ${SHOT_ON_VALUES.join(", ")}`);
      process.exit(1);
    }
    if (entry.gridSpan !== undefined && !isGridSpan(entry.gridSpan)) {
      console.error(`${label}: invalid gridSpan "${String(entry.gridSpan)}". Use one of: ${GRID_SPAN_VALUES.join(", ")}`);
      process.exit(1);
    }
    if (entry.phase !== undefined && !isPhase(entry.phase)) {
      console.error(`${label}: invalid phase "${String(entry.phase)}". Use one of: ${PHASE_VALUES.join(", ")}`);
      process.exit(1);
    }
    if (entry.folder !== undefined) {
      if (typeof entry.folder !== "string") {
        console.error(`${label}: "folder" must be a string when provided. Skipping entry.`);
        continue;
      }
      const trimmedFolder = entry.folder.trim();
      if (trimmedFolder.length === 0) {
        console.error(`${label}: "folder" must be non-empty when provided. Skipping entry.`);
        continue;
      }
      if (trimmedFolder.includes("..")) {
        console.error(`${label}: "folder" must not contain "..". Skipping entry.`);
        continue;
      }
    }

    const { absolute: filePath, displayRelative } = resolveGallerySourceFile(entry, photoFile, uploadsDir);
    if (!fs.existsSync(filePath)) {
      console.error(
        `${label}: file not found at resolved path.\n  Tried: ${filePath}\n  (manifest-relative: ${displayRelative})`,
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
          _type: "galleryImage",
          image: {
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
            alt: entry.alt,
          },
          caption: entry.caption ?? "",
          location: entry.location ?? "",
          shotOn: entry.shotOn,
          capturedAt: entry.capturedAt,
          order: entry.order ?? i,
          gridSpan: entry.gridSpan,
          phase: isPhase(entry.phase) ? entry.phase : "before",
        }),
      photoFile,
    );

    console.log(`${label}: createOrReplace galleryImage ${docId} with asset ${asset._id}`);
  }

  console.log("Import finished.");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
