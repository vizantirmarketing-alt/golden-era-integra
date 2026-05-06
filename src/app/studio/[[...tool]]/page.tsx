"use client";

import { NextStudio } from "next-sanity/studio/client-component";
import type { Config } from "sanity";
import studioConfig from "../../../../sanity/sanity.config";

const config: Config = {
  ...studioConfig,
  basePath: "/studio",
};

export default function StudioPage() {
  return <NextStudio config={config} />;
}
