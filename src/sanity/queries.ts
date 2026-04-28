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
  phase,
  gridSpan
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
