import { defineField, defineType } from "sanity";

const CATEGORIES = [
  { title: "Body", value: "body" },
  { title: "Paint", value: "paint" },
  { title: "Engine", value: "engine" },
  { title: "Engine bay", value: "engine-bay" },
  { title: "Drivetrain", value: "drivetrain" },
  { title: "Suspension", value: "suspension" },
  { title: "Brakes", value: "brakes" },
  { title: "Wheels", value: "wheels" },
  { title: "Interior", value: "interior" },
  { title: "Glass & trim", value: "glass-trim" },
  { title: "Misc", value: "misc" },
] as const;

const CONDITIONS = [
  { title: "New old stock", value: "new-old-stock" },
  { title: "Used — excellent", value: "used-excellent" },
  { title: "Used — good", value: "used-good" },
  { title: "Used — fair", value: "used-fair" },
  { title: "For parts / as-is", value: "for-parts" },
] as const;

const STATUSES = [
  { title: "Available", value: "available" },
  { title: "Pending", value: "pending" },
  { title: "Sold", value: "sold" },
] as const;

export default defineType({
  name: "part",
  title: "Garage sale part",
  type: "document",
  groups: [
    { name: "core", title: "Core", default: true },
    { name: "media", title: "Media" },
    { name: "commerce", title: "Commerce" },
    { name: "meta", title: "Meta" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "core",
      description: 'e.g. "JDM 98-00 One-Piece Headlight"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "core",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "core",
      options: { list: [...CATEGORIES], layout: "dropdown" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "condition",
      title: "Condition",
      type: "string",
      group: "core",
      options: { list: [...CONDITIONS], layout: "dropdown" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "partNumber",
      title: "Part number",
      type: "string",
      group: "core",
      description: "Honda OEM part number if applicable",
    }),
    defineField({
      name: "fitment",
      title: "Fitment",
      type: "array",
      group: "core",
      of: [{ type: "string" }],
      description: 'e.g. "94-97 USDM Integra"',
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      group: "core",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
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
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alt text",
              validation: (r) => r.required(),
            }),
          ],
        },
      ],
      validation: (rule) => rule.required().min(1).max(6),
    }),
    defineField({
      name: "price",
      title: "Price (USD)",
      type: "number",
      group: "commerce",
      description: "Whole dollars only (no cents)",
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "shippingNotes",
      title: "Shipping notes",
      type: "text",
      rows: 3,
      group: "commerce",
      description: 'e.g. "Local Vegas pickup preferred…"',
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "commerce",
      options: { list: [...STATUSES], layout: "radio" },
      initialValue: "available",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "commerce",
      description: "Pin to top of the garage sale grid",
      initialValue: false,
    }),
    defineField({
      name: "soldDate",
      title: "Sold date",
      type: "date",
      group: "commerce",
      description: "Set when status is Sold",
      hidden: ({ document }) => document?.status !== "sold",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      group: "meta",
      validation: (rule) => rule.max(60).warning("Keep under ~60 characters"),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 3,
      group: "meta",
      validation: (rule) => rule.max(160).warning("Keep under ~160 characters"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      price: "price",
      media: "photos.0",
    },
    prepare({ title, status, price, media }) {
      return {
        title: title as string,
        subtitle: [status, price != null ? `$${price}` : null].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
