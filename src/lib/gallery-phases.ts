import type { GalleryImage, GalleryPhase } from "@/sanity/types";

export const GALLERY_PHASE_ORDER: readonly GalleryPhase[] = [
  "before",
  "disassembly",
  "paint",
  "engine",
  "assembly",
  "finished",
] as const;

const PHASE_SET = new Set<string>(GALLERY_PHASE_ORDER);

export function normalizeGalleryPhase(value: unknown): GalleryPhase {
  if (typeof value === "string" && PHASE_SET.has(value)) {
    return value as GalleryPhase;
  }
  return "before";
}

export function sortImagesByOrder(images: GalleryImage[]): GalleryImage[] {
  return [...images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** Earliest ISO `capturedAt` year (YYYY), or null if none. */
export function earliestCapturedYear(images: GalleryImage[]): string | null {
  const dates = images
    .map((im) => im.capturedAt)
    .filter((d): d is string => typeof d === "string" && /^\d{4}/.test(d));
  if (dates.length === 0) {
    return null;
  }
  dates.sort();
  return dates[0]!.slice(0, 4);
}

export type GalleryPhaseGroup = {
  phase: GalleryPhase;
  images: GalleryImage[];
};

/**
 * Non-empty phases only, in fixed build order. Images in each group sorted by `order` asc.
 */
export function groupGalleryImagesByPhase(images: GalleryImage[]): GalleryPhaseGroup[] {
  const byPhase = new Map<GalleryPhase, GalleryImage[]>();
  for (const p of GALLERY_PHASE_ORDER) {
    byPhase.set(p, []);
  }
  for (const img of images) {
    const p = normalizeGalleryPhase(img.phase);
    byPhase.get(p)!.push(img);
  }
  const out: GalleryPhaseGroup[] = [];
  for (const phase of GALLERY_PHASE_ORDER) {
    const raw = byPhase.get(phase)!;
    if (raw.length === 0) {
      continue;
    }
    out.push({ phase, images: sortImagesByOrder(raw) });
  }
  return out;
}
