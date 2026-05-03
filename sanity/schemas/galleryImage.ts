import { defineField, defineType } from "sanity";

const gridOptions = [
  { title: "G1 (span 7×3)", value: "g1" },
  { title: "G2 (span 5×2)", value: "g2" },
  { title: "G3 (span 3×2)", value: "g3" },
  { title: "G4 (span 2×1)", value: "g4" },
  { title: "G5 (span 7×2)", value: "g5" },
  { title: "G6 (span 5×2)", value: "g6" },
  { title: "G7 (span 4×2)", value: "g7" },
  { title: "G8 (span 8×3)", value: "g8" },
  { title: "G9 (span 4×2)", value: "g9" },
  { title: "G12 (full width 12 col)", value: "g12" },
] as const;

export default defineType({
  name: "galleryImage",
  title: "Gallery image",
  type: "document",
  fields: [
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text", validation: (q) => q.required() })],
      validation: (q) => q.required(),
    }),
    defineField({ name: "caption", type: "string" }),
    defineField({ name: "location", type: "string", title: "Location" }),
    defineField({
      name: "shotOn",
      type: "string",
      options: {
        list: [
          { title: "Film 35mm", value: "Film 35mm" },
          { title: "Digital", value: "Digital" },
          { title: "Medium Format", value: "Medium Format" },
        ],
        layout: "dropdown",
      },
    }),
    defineField({ name: "capturedAt", type: "date" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
    defineField({
      name: "phase",
      title: "Build phase",
      type: "string",
      options: {
        list: [
          { title: "Before", value: "before" },
          { title: "Disassembly", value: "disassembly" },
          { title: "Body Prep", value: "body-prep" },
          { title: "Fitting", value: "fitting" },
          { title: "Paint & Body", value: "paint" },
          { title: "Assembly", value: "assembly" },
          { title: "Engine Build", value: "engine" },
          { title: "Finished", value: "finished" },
          { title: "Parts (collection page only)", value: "parts" },
        ],
        layout: "dropdown",
      },
      initialValue: "before",
    }),
    defineField({
      name: "gridSpan",
      type: "string",
      options: { list: [...gridOptions] },
    }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { t: "caption", media: "image" },
    prepare: ({ t, media }) => ({ title: t || "Image", media }),
  },
});
