import { defineField, defineType } from "sanity";

export default defineType({
  name: "heritageShot",
  title: "Heritage Shot",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      rows: 2,
      description: "1–2 sentences, first-person, editorial. No invented details.",
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: "kanji",
      title: "Kanji label",
      type: "string",
      description: "Optional Japanese label (e.g., 系譜, 仲間).",
    }),
    defineField({
      name: "kanjiRomaji",
      title: "Kanji romaji",
      type: "string",
      description: "Romaji for the kanji label (e.g., Keifu, Nakama).",
    }),
    defineField({
      name: "subjects",
      title: "Subjects",
      type: "string",
      description: "Short description of what's in the frame (e.g., '1995 GS-R · 2025 Integra').",
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
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "subjects",
      subtitle: "caption",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Heritage shot",
        subtitle: subtitle?.slice(0, 60),
        media,
      };
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
