/**
 * Update specific galleryImage gridSpan values in Sanity.
 *
 * Targets:
 * 1) phase: "before", filename: "driver-side-profile.jpg", gridSpan: g1 -> g6
 * 2) phase: "disassembly", filename: "door-cards-remove.jpg", gridSpan: g1 -> g4
 *
 * Run:
 *   tsx scripts/update-gallery-gridspan.ts
 */
import { getSanityWriteToken } from "./load-env-local";
import { createRequire } from "node:module";

type GridSpan = "g1" | "g2" | "g3" | "g4" | "g5" | "g6" | "g7" | "g8" | "g9";
type Phase =
  | "before"
  | "disassembly"
  | "body-prep"
  | "fitting"
  | "paint"
  | "engine"
  | "assembly"
  | "finished";

type TargetUpdate = {
  filename: string;
  phase: Phase;
  fromGridSpan: GridSpan;
  toGridSpan: GridSpan;
};

type GalleryImageDoc = {
  _id: string;
  phase?: Phase;
  gridSpan?: GridSpan;
  filename?: string;
};

type SanityClient = {
  fetch: <T>(query: string, params?: Record<string, unknown>) => Promise<T>;
  patch: (id: string) => {
    set: (patch: Record<string, unknown>) => { commit: () => Promise<unknown> };
  };
};

const DEFAULT_PROJECT_ID = "4dgncr6u";
const DEFAULT_DATASET = "production";

const TARGETS: readonly TargetUpdate[] = [
  {
    filename: "driver-side-profile.jpg",
    phase: "before",
    fromGridSpan: "g1",
    toGridSpan: "g6",
  },
  {
    filename: "door-cards-remove.jpg",
    phase: "disassembly",
    fromGridSpan: "g1",
    toGridSpan: "g4",
  },
];

function getClient(): SanityClient {
  const token = getSanityWriteToken();
  if (!token) {
    console.error("Missing SANITY_AUTH_TOKEN or SANITY_API_TOKEN in environment/.env.local");
    process.exit(1);
  }

  const projectId =
    process.env.SANITY_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? DEFAULT_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET ?? DEFAULT_DATASET;

  const requireSanity = createRequire(process.cwd() + "/package.json");
  const { createClient } = requireSanity("@sanity/client") as {
    createClient: (config: Record<string, unknown>) => SanityClient;
  };

  return createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: false,
    token,
  });
}

async function findDoc(client: SanityClient, target: TargetUpdate): Promise<GalleryImageDoc | null> {
  const query = `*[
    _type == "galleryImage" &&
    phase == $phase &&
    image.asset->originalFilename == $filename
  ][0]{
    _id,
    phase,
    gridSpan,
    "filename": image.asset->originalFilename
  }`;

  return client.fetch<GalleryImageDoc | null>(query, {
    phase: target.phase,
    filename: target.filename,
  });
}

async function main(): Promise<void> {
  const client = getClient();
  let updatedCount = 0;

  for (const target of TARGETS) {
    const doc = await findDoc(client, target);

    if (!doc) {
      console.error(`Not found: phase="${target.phase}" filename="${target.filename}"`);
      continue;
    }

    const label = `${doc._id} (${target.phase}/${target.filename})`;

    if (doc.gridSpan !== target.fromGridSpan) {
      console.error(
        `Skipped ${label}: expected current gridSpan "${target.fromGridSpan}", found "${String(doc.gridSpan)}"`,
      );
      continue;
    }

    await client.patch(doc._id).set({ gridSpan: target.toGridSpan }).commit();
    updatedCount += 1;
    console.log(`Updated ${label}: ${target.fromGridSpan} -> ${target.toGridSpan}`);
  }

  console.log(`Done. Updated ${updatedCount}/${TARGETS.length} target documents.`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
