import { defineField, defineType } from "sanity";

export default defineType({
  name: "photoSession",
  title: "Photo Session",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Display title for the session (e.g., 'Gas Station Night').",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL slug for this session (e.g., 'gas-station-night').",
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
    }),
    defineField({
      name: "kanjiRomaji",
      title: "Kanji romaji",
      type: "string",
      description: "Romaji for the kanji label (e.g., Yoru).",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "capturedAt",
      title: "Captured at",
      type: "date",
      description: "Optional date of the shoot.",
    }),
    defineField({
      name: "intro",
      title: "Intro caption",
      type: "text",
      rows: 2,
      description: "Optional 1–2 sentence intro for the session.",
    }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
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
      validation: (rule) => rule.required(),
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
