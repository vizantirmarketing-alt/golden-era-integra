import { defineQuery } from "next-sanity";

export const specCategoriesQuery = defineQuery(`
*[_type == "specCategory"] | order(order asc) {
  _id,
  _type,
  title,
  kanji,
  order,
  items
}
`);

export const galleryImagesQuery = defineQuery(`
*[_type == "galleryImage"] | order(order asc) {
  _id,
  _type,
  image {
    asset,
    alt,
    hotspot,
    crop,
    "metadata": asset->metadata
  },
  caption,
  location,
  shotOn,
  capturedAt,
  order,
  phase,
  gridSpan,
  aspectRatio
}
`);

export const heritageShotsQuery = defineQuery(`
*[_type == "heritageShot"] | order(order asc) {
  _id,
  _type,
  image { asset, alt, hotspot, crop },
  caption,
  kanji,
  kanjiRomaji,
  subjects,
  location,
  capturedAt,
  order
}
`);

export const photoSessionsQuery = defineQuery(`
*[_type == "photoSession"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  kanji,
  kanjiRomaji,
  location,
  capturedAt,
  intro,
  order,
  "coverImage": photos[0]
}
`);

export const photoSessionBySlugQuery = defineQuery(`
*[_type == "photoSession" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  kanji,
  kanjiRomaji,
  location,
  capturedAt,
  intro,
  order,
  photos,
  seoTitle,
  seoDescription,
  ogImage
}
`);

export const filmEpisodesQuery = defineQuery(`
*[_type == "filmEpisode"] | order(episodeNumber desc) {
  _id,
  _type,
  title,
  episodeNumber,
  description,
  videoUrl,
  duration,
  location,
  publishedAt,
  thumbnail { asset, hotspot, crop }
}
`);

export const partsListQuery = defineQuery(`
*[_type == "part"] {
  _id,
  _createdAt,
  featured,
  title,
  "slug": slug.current,
  category,
  condition,
  price,
  status,
  "photos": photos[0]{ asset, alt, hotspot, crop },
  partNumber
}
`);

export const partBySlugQuery = defineQuery(`
*[_type == "part" && slug.current == $slug][0] {
  _id,
  _createdAt,
  title,
  "slug": slug.current,
  category,
  condition,
  partNumber,
  fitment,
  description,
  photos[]{ asset, alt, hotspot, crop },
  price,
  shippingNotes,
  status,
  featured,
  soldDate,
  seoTitle,
  seoDescription
}
`);

export const partsCategoriesQuery = defineQuery(`
array::unique(*[_type == "part" && status == "available"].category)
`);

export const partsSitemapSlugsQuery = defineQuery(`
*[_type == "part" && status in ["available", "pending"]]{
  "slug": slug.current
}
`);

export const partsAllSlugsQuery = defineQuery(`
*[_type == "part"]{
  "slug": slug.current
}
`);
