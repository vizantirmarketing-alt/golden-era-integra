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
  image { asset, alt, hotspot, crop },
  caption,
  location,
  shotOn,
  capturedAt,
  order,
  gridSpan
}
`);

export const journalEntriesQuery = defineQuery(`
*[_type == "journalEntry"] | order(publishedAt desc) {
  _id,
  _type,
  title,
  slug,
  tag,
  excerpt,
  publishedAt,
  coverImage { asset, alt, hotspot, crop },
  body
}
`);

export const journalEntryBySlugQuery = defineQuery(`
*[_type == "journalEntry" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  slug,
  tag,
  excerpt,
  publishedAt,
  coverImage { asset, alt, hotspot, crop },
  body
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
