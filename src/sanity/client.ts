import { createClient, type SanityClient } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { apiVersion, dataset, projectId } from "./env";

const clientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
} as const;

/**
 * Public read client for the Next.js app (and server). Uses CDN in production.
 */
export const client: SanityClient = createClient({
  ...clientConfig,
  perspective: "published",
});

const imageBuilder = createImageUrlBuilder({
  projectId: clientConfig.projectId,
  dataset: clientConfig.dataset,
});

/**
 * `urlFor()` for Sanity image field objects (e.g. `image`, `coverImage`, `thumbnail`).
 * Example: `urlFor(doc.coverImage).width(1200).url()`
 */
export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source);
}
