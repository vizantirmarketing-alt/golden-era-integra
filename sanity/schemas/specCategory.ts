import { defineField, defineType } from "sanity";

export default defineType({
  name: "specCategory",
  title: "Spec category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (q) => q.required() }),
    defineField({ name: "kanji", type: "string", title: "Kanji" }),
    defineField({ name: "order", type: "number", validation: (q) => q.required().min(0) }),
    defineField({
      name: "items",
      type: "array",
      of: [
        {
          type: "object",
          name: "specItem",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "value", type: "string" }),
            defineField({
              name: "isMilano",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
            prepare({ title, subtitle }) {
              return { title, subtitle: subtitle as string | undefined };
            },
          },
        },
      ],
    }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { t: "title" }, prepare: ({ t }) => ({ title: t as string }) },
});
