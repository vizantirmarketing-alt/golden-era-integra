import { defineField, defineType } from "sanity";

export default defineType({
  name: "codeBlock",
  type: "object",
  title: "Code",
  fields: [
    defineField({ name: "filename", type: "string", title: "File name" }),
    defineField({
      name: "language",
      type: "string",
      options: {
        list: [
          { title: "TypeScript", value: "typescript" },
          { title: "JavaScript", value: "javascript" },
          { title: "JSON", value: "json" },
          { title: "Bash", value: "bash" },
          { title: "CSS", value: "css" },
          { title: "GROQ", value: "groq" },
        ],
      },
    }),
    defineField({ name: "code", type: "text", title: "Code", rows: 12 }),
  ],
  preview: { select: { t: "filename" }, prepare: ({ t }) => ({ title: t || "Code block" }) },
});
