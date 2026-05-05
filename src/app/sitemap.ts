import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { fetchPhotoSessions } from "@/sanity/photoSessions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  // Static routes — known at build time
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/story`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/build`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/archive`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/sessions`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Dynamic routes — fetched from Sanity at request time
  let sessionRoutes: MetadataRoute.Sitemap = [];
  try {
    const sessions = await fetchPhotoSessions();
    sessionRoutes = sessions.map((session) => ({
      url: `${base}/sessions/${session.slug}`,
      lastModified: now, // PhotoSessionListItem doesn't expose _updatedAt yet — using now
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    // If Sanity fetch fails, sitemap still returns static routes
    console.error("Sitemap: failed to fetch sessions from Sanity", error);
  }

  return [...staticRoutes, ...sessionRoutes];
}
