import { defineField, defineType } from "sanity";

export default defineType({
  name: "callout",
  type: "object",
  title: "Callout",
  fields: [
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({ name: "body", type: "text", title: "Body", rows: 3 }),
  ],
  preview: {
    select: { t: "title" },
    prepare: ({ t }) => ({ title: t ? `Callout: ${t}` : "Callout" }),
  },
});
