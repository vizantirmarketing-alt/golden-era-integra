import type { PortableTextBlock } from "@portabletext/types";
import { client } from "@/sanity/client";
import {
  partBySlugQuery,
  partsAllSlugsQuery,
  partsCategoriesQuery,
  partsListQuery,
  partsSitemapSlugsQuery,
} from "@/sanity/queries";
import type { PartCategory, PartCondition, PartStatus } from "@/lib/parts/constants";
import { isPartCategory } from "@/lib/parts/constants";
import type { SanityImageField } from "@/sanity/types";

/** Cover image for list cards — always non-null with asset after normalization. */
export type PartCoverImage = Exclude<SanityImageField, null>;

/** Grid / list projection from `partsListQuery`. */
export type PartListItem = {
  _id: string;
  _createdAt: string;
  featured: boolean;
  title: string;
  slug: string;
  category: PartCategory;
  condition: PartCondition;
  price: number;
  status: PartStatus;
  photos: PartCoverImage;
  partNumber?: string | null;
};

/** Full document projection from `partBySlugQuery`. */
export type Part = {
  _id: string;
  _createdAt: string;
  title: string;
  slug: string;
  category: PartCategory;
  condition: PartCondition;
  partNumber?: string | null;
  fitment?: string[] | null;
  description: PortableTextBlock[] | null;
  photos: SanityImageField[] | null;
  price: number;
  shippingNotes?: string | null;
  status: PartStatus;
  featured: boolean;
  soldDate?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

const STATUS_ORDER: Record<PartStatus, number> = {
  available: 0,
  pending: 1,
  sold: 2,
};

function normalizeListRow(raw: Record<string, unknown>): PartListItem | null {
  const slug = typeof raw.slug === "string" ? raw.slug : "";
  const title = typeof raw.title === "string" ? raw.title : "";
  const _id = typeof raw._id === "string" ? raw._id : "";
  const _createdAt = typeof raw._createdAt === "string" ? raw._createdAt : "";
  const category = typeof raw.category === "string" && isPartCategory(raw.category) ? raw.category : null;
  const condition = raw.condition;
  const status = raw.status;
  const price = typeof raw.price === "number" && Number.isFinite(raw.price) ? raw.price : null;

  const okCondition =
    condition === "new-old-stock" ||
    condition === "used-excellent" ||
    condition === "used-good" ||
    condition === "used-fair" ||
    condition === "for-parts";
  const okStatus = status === "available" || status === "pending" || status === "sold";

  if (!slug || !title || !_id || !category || !okCondition || !okStatus || price === null) {
    return null;
  }

  const photosRaw = (raw.photos ?? null) as SanityImageField;
  if (!photosRaw?.asset?._ref) {
    return null;
  }
  const photos = photosRaw as PartCoverImage;

  return {
    _id,
    _createdAt,
    featured: Boolean(raw.featured),
    title,
    slug,
    category,
    condition: condition as PartCondition,
    price,
    status: status as PartStatus,
    photos,
    partNumber: typeof raw.partNumber === "string" ? raw.partNumber : undefined,
  };
}

function normalizePart(raw: Record<string, unknown> | null): Part | null {
  if (!raw) {
    return null;
  }
  const slug = typeof raw.slug === "string" ? raw.slug : "";
  const title = typeof raw.title === "string" ? raw.title : "";
  const _id = typeof raw._id === "string" ? raw._id : "";
  const _createdAt = typeof raw._createdAt === "string" ? raw._createdAt : "";
  const category = typeof raw.category === "string" && isPartCategory(raw.category) ? raw.category : null;
  const condition = raw.condition;
  const status = raw.status;
  const price = typeof raw.price === "number" && Number.isFinite(raw.price) ? raw.price : null;

  const okCondition =
    condition === "new-old-stock" ||
    condition === "used-excellent" ||
    condition === "used-good" ||
    condition === "used-fair" ||
    condition === "for-parts";
  const okStatus = status === "available" || status === "pending" || status === "sold";

  if (!slug || !title || !_id || !category || !okCondition || !okStatus || price === null) {
    return null;
  }

  const description = Array.isArray(raw.description) ? (raw.description as PortableTextBlock[]) : null;
  if (!description?.length) {
    return null;
  }

  const photosArr = Array.isArray(raw.photos) ? (raw.photos as SanityImageField[]) : [];
  const photos = photosArr.filter((p) => p?.asset?._ref);
  if (photos.length === 0) {
    return null;
  }

  const fitmentRaw = raw.fitment;
  const fitment =
    Array.isArray(fitmentRaw) && fitmentRaw.every((x) => typeof x === "string")
      ? (fitmentRaw as string[])
      : undefined;

  return {
    _id,
    _createdAt,
    featured: Boolean(raw.featured),
    title,
    slug,
    category,
    condition: condition as PartCondition,
    price,
    status: status as PartStatus,
    photos,
    description,
    fitment,
    partNumber: typeof raw.partNumber === "string" ? raw.partNumber : undefined,
    shippingNotes: typeof raw.shippingNotes === "string" ? raw.shippingNotes : undefined,
    soldDate: typeof raw.soldDate === "string" ? raw.soldDate : undefined,
    seoTitle: typeof raw.seoTitle === "string" ? raw.seoTitle : undefined,
    seoDescription: typeof raw.seoDescription === "string" ? raw.seoDescription : undefined,
  };
}

export function sortPartsForListing(items: PartListItem[]): PartListItem[] {
  return [...items].sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    const sa = STATUS_ORDER[a.status];
    const sb = STATUS_ORDER[b.status];
    if (sa !== sb) {
      return sa - sb;
    }
    return b._createdAt.localeCompare(a._createdAt);
  });
}

export async function fetchPartsList(): Promise<PartListItem[]> {
  const rows = await client.fetch<Record<string, unknown>[]>(partsListQuery, {}, { next: { revalidate: 300 } });
  const parsed = (rows ?? []).map(normalizeListRow).filter((x): x is PartListItem => x !== null);
  return sortPartsForListing(parsed);
}

export async function fetchPartCategories(): Promise<PartCategory[]> {
  const raw = await client.fetch<unknown>(partsCategoriesQuery, {}, { next: { revalidate: 300 } });
  if (!Array.isArray(raw)) {
    return [];
  }
  const cats = raw.filter((c): c is PartCategory => typeof c === "string" && isPartCategory(c));
  return cats.sort((a, b) => a.localeCompare(b));
}

export async function fetchPartBySlug(slug: string): Promise<Part | null> {
  const row = await client.fetch<Record<string, unknown> | null>(
    partBySlugQuery,
    { slug },
    { next: { revalidate: 300 } },
  );
  return normalizePart(row);
}

export async function fetchAllPartSlugs(): Promise<string[]> {
  const rows = await client.fetch<{ slug: string | null }[]>(partsAllSlugsQuery, {}, { next: { revalidate: 300 } });
  return (rows ?? [])
    .map((r) => (typeof r.slug === "string" ? r.slug : null))
    .filter((s): s is string => Boolean(s));
}

export async function fetchSitemapPartSlugs(): Promise<string[]> {
  const rows = await client.fetch<{ slug: string | null }[]>(
    partsSitemapSlugsQuery,
    {},
    { next: { revalidate: 300 } },
  );
  return (rows ?? [])
    .map((r) => (typeof r.slug === "string" ? r.slug : null))
    .filter((s): s is string => Boolean(s));
}
