import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { deskStructure } from "./structure";

export default defineConfig({
  name: "default",
  title: "Golden Era Integra",
  projectId: "4dgncr6u",
  dataset: "production",
  schema: {
    types: schemaTypes,
  },
  plugins: [structureTool({ structure: deskStructure }), visionTool()],
});
