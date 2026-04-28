import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import { getSiteUrl } from "@/lib/site";
import { journalSitemapQuery } from "@/sanity/queries";

type JournalSitemapRow = {
  slug: string;
  publishedAt?: string | null;
  _updatedAt?: string | null;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  const journalRows = await client.fetch<JournalSitemapRow[]>(
    journalSitemapQuery,
    {},
    { next: { revalidate: 3600 } }
  );

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/build`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/gallery`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/journal`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/guestbook`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${base}/film`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];

  const journalRoutes: MetadataRoute.Sitemap = (journalRows ?? []).map(
    (row) => ({
      url: `${base}/journal/${encodeURIComponent(row.slug)}`,
      lastModified: row.publishedAt
        ? new Date(row.publishedAt)
        : row._updatedAt
          ? new Date(row._updatedAt)
          : now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  return [...staticRoutes, ...journalRoutes];
}
