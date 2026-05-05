import { defineField, defineType } from "sanity";

export default defineType({
  name: "photoSession",
  title: "Photo Session",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Display title for the session (e.g., 'Gas Station Night').",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL slug for this session (e.g., 'gas-station-night').",
      group: "content",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kanji",
      title: "Kanji label",
      type: "string",
      description: "Optional Japanese label (e.g., 夜).",
      group: "content",
    }),
    defineField({
      name: "kanjiRomaji",
      title: "Kanji romaji",
      type: "string",
      description: "Romaji for the kanji label (e.g., Yoru).",
      group: "content",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "capturedAt",
      title: "Captured at",
      type: "date",
      description: "Optional date of the shoot.",
      group: "content",
    }),
    defineField({
      name: "intro",
      title: "Intro caption",
      type: "text",
      rows: 2,
      description: "Optional 1–2 sentence intro for the session.",
      group: "content",
    }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      group: "content",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Display order on the sessions index page.",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description:
        "Optional. Used for the browser tab and search results. If empty, falls back to the session title. Aim for 50–60 characters.",
      group: "seo",
      validation: (rule) =>
        rule.max(60).warning("Keep under 60 characters for best display in search results."),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      description:
        "Optional. Used as the meta description in search results and link previews. If empty, falls back to the intro caption. Aim for 140–160 characters.",
      group: "seo",
      validation: (rule) =>
        rule.max(160).warning("Keep under 160 characters for best display in search results."),
    }),
    defineField({
      name: "ogImage",
      title: "Social Share Image",
      type: "image",
      description: "Optional. Used for link previews on social media. If empty, falls back to the cover photo.",
      options: { hotspot: true },
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "location",
      media: "photos.0",
    },
  },
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
