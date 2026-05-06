import type { Metadata } from "next";
import { BuildPageContent } from "@/app/build/BuildPageContent";
import {
  buildIntroParagraphs,
  buildOutro,
  buildSections,
} from "@/data/build-sections";
import { seo } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: seo.build.titleAbsolute },
  description: seo.build.description,
  openGraph: {
    title: seo.build.titleAbsolute,
    description: seo.build.description,
    images: ["/opengraph-image"],
  },
  twitter: {
    title: seo.build.titleAbsolute,
    description: seo.build.description,
    images: ["/opengraph-image"],
  },
};

export default function BuildPage() {
  return (
    <BuildPageContent
      sections={buildSections}
      introParagraphs={buildIntroParagraphs}
      outro={buildOutro}
    />
  );
}
