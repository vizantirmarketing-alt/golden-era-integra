import { defineField, defineType } from "sanity";

export default defineType({
  name: "filmEpisode",
  title: "Film episode",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (q) => q.required() }),
    defineField({ name: "episodeNumber", type: "number", validation: (q) => q.required() }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({
      name: "videoUrl",
      type: "url",
      title: "Video URL (YouTube / Vimeo)",
    }),
    defineField({ name: "duration", type: "string", title: "Duration" }),
    defineField({ name: "location", type: "string" }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "thumbnail", type: "image" }),
  ],
  orderings: [
    { title: "Episode # (desc)", name: "ep", by: [{ field: "episodeNumber", direction: "desc" }] },
  ],
  preview: { select: { t: "title", n: "episodeNumber" }, prepare: ({ t, n }) => ({ title: `${n} — ${t}` }) },
});
