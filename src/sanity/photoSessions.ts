import { client } from "@/sanity/client";
import { photoSessionBySlugQuery, photoSessionsQuery } from "@/sanity/queries";
import type { SanityImageField } from "@/sanity/types";

export type PhotoSessionListItem = {
  _id: string;
  title: string;
  slug: string;
  kanji?: string;
  kanjiRomaji?: string;
  location?: string;
  capturedAt?: string;
  intro?: string;
  order?: number;
  coverImage?: SanityImageField;
};

export type PhotoSessionDetail = {
  _id: string;
  title: string;
  slug: string;
  kanji?: string;
  kanjiRomaji?: string;
  location?: string;
  capturedAt?: string;
  intro?: string;
  order?: number;
  photos?: SanityImageField[] | null;
};

export async function fetchPhotoSessions(): Promise<PhotoSessionListItem[]> {
  const rows = await client.fetch<PhotoSessionListItem[]>(
    photoSessionsQuery,
    {},
    { next: { revalidate: 300 } }
  );
  return rows ?? [];
}

export async function fetchPhotoSessionBySlug(slug: string): Promise<PhotoSessionDetail | null> {
  const row = await client.fetch<PhotoSessionDetail | null>(
    photoSessionBySlugQuery,
    { slug },
    { next: { revalidate: 300 } }
  );
  return row ?? null;
}
