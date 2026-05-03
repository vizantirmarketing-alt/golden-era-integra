import type { Metadata } from "next";
import { ChapterHeader } from "@/components/ChapterHeader";
import { GradHeading } from "@/components/GradHeading";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import {
  galleryImagesForPartsSection,
  PARTS_SECTIONS,
} from "@/lib/parts-gallery";
import { seo } from "@/lib/seo";
import { client } from "@/sanity/client";
import { galleryPartsImagesQuery } from "@/sanity/queries";
import type { GalleryImage } from "@/sanity/types";

export const metadata: Metadata = {
  title: { absolute: seo.parts.titleAbsolute },
  description: seo.parts.description,
  openGraph: {
    title: seo.parts.titleAbsolute,
    description: seo.parts.description,
    images: [{ url: seo.parts.ogImage }],
  },
  twitter: {
    title: seo.parts.titleAbsolute,
    description: seo.parts.description,
    images: [seo.parts.ogImage],
  },
};

export default async function PartsPage() {
  const images = await client.fetch<GalleryImage[]>(
    galleryPartsImagesQuery,
    {},
    { next: { revalidate: 300 } },
  );

  const list = images ?? [];

  return (
    <div className="gesi-chapter text-ink">
      <div className="gesi-container">
        <div className="gesi-grid-12 mb-16">
          <div className="gesi-col-side">
            <div className="gesi-sticky">
              <ChapterHeader
                chapterLabel="Chapter 06"
                number="06"
                label="Parts"
                kanji="部品"
              />
            </div>
          </div>
          <div className="gesi-col-main">
            <GradHeading as="h1" className="!mb-4 !text-balance sm:!pr-4">
              PARTS
            </GradHeading>
            <p className="gesi-parts-section-sub__kanji mb-1" lang="ja">
              部品
            </p>
            <p className="mb-6 font-mono text-[10px] tracking-[0.14em] text-ink-soft uppercase">
              Buhin / The Collection
            </p>
            <p className="body-copy max-w-[42rem]">
              Four years of hunting parts. Some made it onto the car. Some are stored, waiting for the
              right moment. Some came and went. This is the collection.
            </p>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="gesi-gallery-empty">
            <p className="body-copy max-w-md">
              Parts photos will appear here after import from <code className="font-mono text-xs">gallery-uploads/parts</code>{" "}
              (run <code className="font-mono text-xs">npm run import-parts -- --confirm</code>).
            </p>
          </div>
        ) : (
          <div className="space-y-20">
            {PARTS_SECTIONS.map((section) => {
              const sectionImages = galleryImagesForPartsSection(
                list,
                section.photos.map((p) => p.order),
              );
              return (
                <section key={section.titleEnglish} className="max-w-[var(--container)]">
                  <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[0.95] uppercase">
                    {section.titleEnglish}
                  </h2>
                  <div className="gesi-parts-section-sub">
                    <span className="gesi-parts-section-sub__kanji" lang="ja">
                      {section.kanji}
                    </span>
                    <span className="gesi-parts-section-sub__romaji">{section.romaji}</span>
                  </div>
                  {section.intro ? <p className="body-copy mt-4 max-w-[42rem]">{section.intro}</p> : null}
                  <div className="mt-8">
                    <GalleryGrid images={sectionImages} />
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
