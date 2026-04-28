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

/** Index list: no body. Sort: newest first, then `_createdAt` tiebreaker. */
export const journalEntriesListQuery = defineQuery(`
*[_type == "journalEntry"] | order(publishedAt desc, _createdAt desc) {
  _id,
  _type,
  title,
  slug,
  tag,
  excerpt,
  publishedAt,
  _createdAt
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
  _createdAt,
  coverImage { asset, alt, hotspot, crop },
  body
}
`);

/**
 * Older entry (listed below current on /journal): lower `publishedAt` sort key,
 * `_createdAt` tiebreaker. `$sortAt` = `coalesce(publishedAt, _createdAt)` for the current doc.
 */
export const journalEntryPrevQuery = defineQuery(`
*[_type == "journalEntry" && slug.current != $slug && (
  dateTime(coalesce(publishedAt, _createdAt)) < dateTime($sortAt)
  || (
    dateTime(coalesce(publishedAt, _createdAt)) == dateTime($sortAt)
    && _createdAt < $docCreatedAt
  )
)] | order(dateTime(coalesce(publishedAt, _createdAt)) desc, _createdAt desc)[0] {
  _id,
  title,
  slug
}
`);

/** Newer entry (listed above current): higher sort key, closest first. */
export const journalEntryNextQuery = defineQuery(`
*[_type == "journalEntry" && slug.current != $slug && (
  dateTime(coalesce(publishedAt, _createdAt)) > dateTime($sortAt)
  || (
    dateTime(coalesce(publishedAt, _createdAt)) == dateTime($sortAt)
    && _createdAt > $docCreatedAt
  )
)] | order(dateTime(coalesce(publishedAt, _createdAt)) asc, _createdAt asc)[0] {
  _id,
  title,
  slug
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
