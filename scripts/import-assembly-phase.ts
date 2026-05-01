/**
 * Import Assembly-phase gallery images from `gallery-uploads/assembly/` into Sanity as `galleryImage`.
 *
 * Prerequisites: place the JPEGs listed in ASSEMBLY_ENTRIES in that folder (same convention as other phase folders under `gallery-uploads/`).
 *
 * Env: same as `import-gallery.ts` — SANITY_AUTH_TOKEN / SANITY_API_TOKEN, optional SANITY_PROJECT_ID / SANITY_DATASET.
 *
 * Run (from repo root):
 *   npm run import-assembly
 */
import { getSanityWriteToken } from "./load-env-local";
import * as fs from "node:fs";
import * as path from "node:path";
import { createRequire } from "node:module";

const repoRoot = process.cwd();
const assemblyDir = path.join(repoRoot, "gallery-uploads", "assembly");

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

type AssemblyEntry = {
  file: string;
  gridSpan: GridSpan;
  order: number;
  caption: string;
  alt: string;
};

/** Deterministic document `_id` — prefix avoids clashes with other gallery imports. */
const idFromAssemblyFile = (filename: string) =>
  "gallery-assembly-" +
  path
    .basename(filename)
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9-]/gi, "-")
    .toLowerCase();

const DEFAULT_PROJECT_ID = "4dgncr6u";
const DEFAULT_DATASET = "production";

const ASSEMBLY_ENTRIES: readonly AssemblyEntry[] = [
  {
    file: "oem-stickers-door-lock.jpg",
    gridSpan: "g6",
    order: 500,
    caption:
      "All the OEM Honda stickers throughout the car — VIN, color code, interior trim, tire info — replaced to match factory placement and look. R-81. Same code as the VIN. Details matter.",
    alt: "OEM Honda door jamb stickers — VIN, color code R-81, trim and tire placards factory placement",
  },
  {
    file: "hood.jpg",
    gridSpan: "g6",
    order: 510,
    caption:
      "Underside of the OEM hood. Fresh R-81 underneath, SRS warning and vacuum hose routing stickers replaced to match factory placement. Nobody sees it. I see it.",
    alt: "Underside of OEM hood painted R-81 with SRS and vacuum routing stickers",
  },
  {
    file: "door-jam-switch.jpg",
    gridSpan: "g4",
    order: 520,
    caption: "Door jamb switch and door latch both brand new. Details matter.",
    alt: "New door jamb switch and door latch hardware installed",
  },
  {
    file: "windshield-3.jpg",
    gridSpan: "g4",
    order: 530,
    caption: "My glass guy prepping the front windshield. Tape down, seal ready.",
    alt: "Windshield installation prep with tape and sealant ready",
  },
  {
    file: "windshield-4.jpg",
    gridSpan: "g4",
    order: 540,
    caption: "Setting the windshield in. Two suction cups, careful hands, no margin for error.",
    alt: "Windshield being set with suction cup lifters",
  },
  {
    file: "windshield-1.jpg",
    gridSpan: "g4",
    order: 550,
    caption: "Windshield set. Taped to cure.",
    alt: "Front windshield installed and taped for curing",
  },
  {
    file: "windshield-5.jpg",
    gridSpan: "g6",
    order: 560,
    caption: "Front end back together. Glass in, mirrors on, hood lined up.",
    alt: "Front end assembled with windshield, mirrors, and hood aligned",
  },
  {
    file: "rear-windshield-1.jpg",
    gridSpan: "g4",
    order: 570,
    caption:
      "The rear hatch glass going back in. This is the one I bought a whole junkyard hatch for, just so my glass guy could cut it out with the weather strip intact.",
    alt: "Rear hatch glass being installed",
  },
  {
    file: "rear-windshield-2.jpg",
    gridSpan: "g4",
    order: 580,
    caption: "Rear glass in. Honda stamp, factory weather strip, exactly how it should be.",
    alt: "Rear windshield installed with Honda stamp and factory weather strip",
  },
  {
    file: "quarter-glass-1.jpg",
    gridSpan: "g3",
    order: 590,
    caption: "Driver-side quarter glass install.",
    alt: "Driver-side quarter glass installation",
  },
  {
    file: "quarter-glass-2.jpg",
    gridSpan: "g3",
    order: 600,
    caption: "Quarter glass set. Made in Japan sticker still on it — not coming off.",
    alt: "Quarter glass installed with Made in Japan decal visible",
  },
  {
    file: "sunroof.jpg",
    gridSpan: "g4",
    order: 610,
    caption: "Sunroof open. Honda glass, fresh paint underneath.",
    alt: "Sunroof open showing Honda glass and fresh paint",
  },
  {
    file: "tails-light-rear-crash-bar.jpg",
    gridSpan: "g4",
    order: 620,
    caption:
      "UKDM taillights. The clear corners are the giveaway — USDM lenses are all red. Sourced from the UK because I wanted that rear end to look right.",
    alt: "UKDM taillights with clear corner lenses and rear crash bar area",
  },
  {
    file: "trunk.jpg",
    gridSpan: "g6",
    order: 630,
    caption: "Trunk floor in R-81. Same paint as the body, top to bottom.",
    alt: "Trunk floor painted Milano Red R-81",
  },
  {
    file: "front-windshield.jpg",
    gridSpan: "g6",
    order: 640,
    caption: "Glass in, hood down, body lines lined up. Starting to look like a car again.",
    alt: "Front view with windshield set, hood closed, body lines aligned",
  },
];

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
  if (!fs.existsSync(assemblyDir)) {
    console.error(`Missing folder: ${assemblyDir}\nCreate it and add the assembly JPEGs before running.`);
    process.exit(1);
  }

  const client = getClient();

  for (let i = 0; i < ASSEMBLY_ENTRIES.length; i++) {
    const entry = ASSEMBLY_ENTRIES[i]!;
    const label = `[${i + 1}/${ASSEMBLY_ENTRIES.length}] ${entry.file}`;
    const filePath = path.join(assemblyDir, entry.file);

    if (!fs.existsSync(filePath)) {
      console.error(`${label}: file not found.\n  Expected: ${filePath}`);
      continue;
    }

    const asset = await withRetry(
      () =>
        client.assets.upload("image", fs.createReadStream(filePath), {
          filename: path.basename(entry.file),
        }),
      entry.file,
    );

    const docId = idFromAssemblyFile(entry.file);
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
          phase: "assembly",
        }),
      entry.file,
    );

    console.log(`${label}: createOrReplace galleryImage ${docId} with asset ${asset._id}`);
  }

  console.log("Assembly import finished.");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
