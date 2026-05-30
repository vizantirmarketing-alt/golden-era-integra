import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./env";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

/**
 * Browser-safe image URL builder (no Sanity query client).
 * Example: `urlFor(doc.coverImage).width(1200).url()`
 */
export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source);
}
