import type { Metadata } from "next";
import { ChapterHeader } from "@/components/ChapterHeader";
import { GradHeading } from "@/components/GradHeading";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { GalleryPhaseDivider } from "@/components/gallery/GalleryPhaseDivider";
import { client } from "@/sanity/client";
import {
  earliestCapturedYear,
  groupGalleryImagesByPhase,
  PHASE_LABELS,
} from "@/lib/gallery-phases";
import { seo } from "@/lib/seo";
import { galleryImagesQuery } from "@/sanity/queries";
import type { GalleryImage } from "@/sanity/types";

export const metadata: Metadata = {
  title: "The Archive",
  description: seo.gallery.description,
  openGraph: {
    title: `The Archive · ${seo.siteName}`,
    description: seo.gallery.description,
  },
  twitter: {
    title: `The Archive · ${seo.siteName}`,
    description: seo.gallery.description,
  },
};

export default async function GalleryPage() {
  const images = await client.fetch<GalleryImage[]>(
    galleryImagesQuery,
    {},
    { next: { revalidate: 300 } }
  );

  const list = (images ?? []).filter((im) => im.phase !== "parts");
  const phaseGroups = groupGalleryImagesByPhase(list);

  return (
    <div className="gesi-chapter text-ink">
      <div className="gesi-container">
        <div className="gesi-grid-12 mb-16">
          <div className="gesi-col-side">
            <div className="gesi-sticky">
              <ChapterHeader
                chapterLabel="Chapter 03"
                number="03"
                label="The Archive"
                kanji="記録"
              />
            </div>
          </div>
          <div className="gesi-col-main">
            <GradHeading as="h1" className="!mb-8 !text-balance sm:!pr-4">
              THE
              <br />
              <span className="grad">THE ARCHIVE.</span>
            </GradHeading>
            <p className="body-copy max-w-[36rem]">
              Four years of work, in chronological order. Before, during, and
              after.
            </p>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="gesi-gallery-empty">
            <p className="body-copy max-w-md">
              Gallery images will appear here once they are published in Sanity
              Studio.
            </p>
          </div>
        ) : (
          <>
            <nav className="gesi-phasenav" aria-label="Gallery phases">
              <ul className="gesi-phasenav__list">
                {phaseGroups.map(({ phase }) => (
                  <li key={phase} className="gesi-phasenav__item">
                    <a href={`#phase-${phase}`} className="gesi-phasenav__link">
                      <span className="gesi-phasenav__kanji">{PHASE_LABELS[phase].kanji}</span>
                      <span className="gesi-phasenav__romaji">{PHASE_LABELS[phase].romaji}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            {phaseGroups.map(({ phase, images }, idx) => (
              <div
                key={phase}
                id={`phase-${phase}`}
                className="gesi-gallery-phase-block"
              >
                <GalleryPhaseDivider
                  chapterNumber={idx + 2}
                  phase={phase}
                  year={earliestCapturedYear(images)}
                />
                <GalleryGrid images={images} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
