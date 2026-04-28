import { defineField, defineType } from "sanity";

const tags = [
  { title: "Acquisition", value: "Acquisition" },
  { title: "Restoration", value: "Restoration" },
  { title: "Engine", value: "Engine" },
  { title: "Drive", value: "Drive" },
  { title: "Detail", value: "Detail" },
  { title: "Other", value: "Other" },
] as const;

export default defineType({
  name: "journalEntry",
  title: "Journal entry",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (q) => q.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (q) => q.required(),
    }),
    defineField({
      name: "tag",
      type: "string",
      options: { list: [...tags], layout: "dropdown" },
    }),
    defineField({
      name: "excerpt",
      type: "string",
      title: "Excerpt",
      validation: (q) => q.max(180),
    }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({
      name: "coverImage",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "body",
      type: "array",
      title: "Body",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Number", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "URL",
                fields: [{ name: "href", type: "url" }],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", type: "string", title: "Alt" }),
            defineField({ name: "caption", type: "string" }),
          ],
        },
        { type: "callout" },
        { type: "codeBlock" },
      ],
    }),
  ],
  orderings: [
    { title: "Published (newest)", name: "published", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { t: "title", d: "publishedAt" },
    prepare: ({ t, d }) => ({
      title: t as string,
      subtitle: d ? new Date(d as string).toLocaleDateString() : "Draft",
    }),
  },
});
