/**
 * Bulk-import gallery images into Sanity as `galleryImage` documents.
 * Requires: SANITY_AUTH_TOKEN (write token). Optional overrides:
 * SANITY_PROJECT_ID, SANITY_DATASET (defaults match sanity/sanity.config.ts).
 */
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
  create: (doc: Record<string, unknown>) => Promise<unknown>;
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
  | "paint"
  | "engine"
  | "assembly"
  | "finished";

type GalleryPhotoEntry = {
  /** Filename inside gallery-uploads/ (e.g. my-shot.jpg). Alias: `filename`. */
  file?: string;
  filename?: string;
  alt: string;
  caption?: string;
  location?: string;
  shotOn?: ShotOn;
  /** ISO date string YYYY-MM-DD */
  capturedAt?: string;
  order?: number;
  gridSpan?: GridSpan;
  /** Build phase; omitted entries default to `"before"`. */
  phase?: GalleryPhase;
};

const DEFAULT_PROJECT_ID = "4dgncr6u";
const DEFAULT_DATASET = "production";

const SHOT_ON_VALUES: readonly ShotOn[] = ["Film 35mm", "Digital", "Medium Format"] as const;
const GRID_SPAN_VALUES: readonly GridSpan[] = ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9"] as const;
const PHASE_VALUES: readonly GalleryPhase[] = [
  "before",
  "disassembly",
  "paint",
  "engine",
  "assembly",
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

function getClient(): SanityClient {
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

    const filePath = path.join(uploadsDir, photoFile);
    if (!fs.existsSync(filePath)) {
      console.error(`${label}: file not found: ${filePath}`);
      process.exit(1);
    }

    const body = fs.createReadStream(filePath);
    const asset = await client.assets.upload("image", body, {
      filename: path.basename(photoFile),
    });

    await client.create({
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
    });

    console.log(`${label}: created galleryImage with asset ${asset._id}`);
  }

  console.log("Import finished.");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
