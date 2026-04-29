import type { PortableTextBlock } from "@portabletext/types";

/**
 * `specItem` is embedded on `specCategory.items` (see `sanity/schemas/specCategory.ts`).
 */
export type SpecItem = {
  _key: string;
  _type: "specItem";
  label?: string;
  value?: string;
  isMilano?: boolean;
};

export type SpecCategory = {
  _id: string;
  _type: "specCategory";
  _createdAt?: string;
  _updatedAt?: string;
  title?: string;
  kanji?: string;
  order?: number;
  items?: SpecItem[] | null;
};

export type ShotOn = "Film 35mm" | "Digital" | "Medium Format";
export type GridSpan = "g1" | "g2" | "g3" | "g4" | "g5" | "g6" | "g7" | "g8" | "g9";

/** `galleryImage.phase` — see `sanity/schemas/galleryImage.ts`. */
export type GalleryPhase =
  | "before"
  | "disassembly"
  | "body-prep"
  | "fitting"
  | "paint"
  | "engine"
  | "assembly"
  | "finished";

/**
 * Aligned to `defineField` on `image` in `sanity/schemas/galleryImage.ts`.
 */
export type SanityImageField = {
  _type: "image";
  alt?: string;
  asset?: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
} | null;

export type GalleryImage = {
  _id: string;
  _type: "galleryImage";
  image?: SanityImageField;
  caption?: string;
  location?: string;
  shotOn?: ShotOn;
  capturedAt?: string;
  order?: number;
  phase?: GalleryPhase;
  gridSpan?: GridSpan;
};

export type JournalTag =
  | "Acquisition"
  | "Restoration"
  | "Engine"
  | "Drive"
  | "Detail"
  | "Other";

/**
 * Rich body from Studio (blocks, inline images, callout, codeBlock).
 * Full serializers are handled in a later route when content is rendered.
 */
export type JournalEntry = {
  _id: string;
  _type: "journalEntry";
  _createdAt?: string;
  title?: string;
  slug?: { current: string };
  tag?: JournalTag;
  excerpt?: string;
  publishedAt?: string;
  coverImage?: SanityImageField;
  /** Portable Text: blocks, images, callout, codeBlock (see Studio schemas). */
  body?: PortableTextBlock[] | null;
};

/** Neighbor row for prev/next navigation if journal routes return. */
export type JournalEntryNav = {
  _id?: string;
  title?: string;
  slug?: { current?: string };
} | null;

export type FilmEpisode = {
  _id: string;
  _type: "filmEpisode";
  title?: string;
  episodeNumber?: number;
  description?: string;
  videoUrl?: string;
  duration?: string;
  location?: string;
  publishedAt?: string;
  thumbnail?: SanityImageField;
};
