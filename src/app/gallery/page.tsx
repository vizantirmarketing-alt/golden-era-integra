import type { Metadata } from "next";
import { ChapterHeader } from "@/components/ChapterHeader";
import { GradHeading } from "@/components/GradHeading";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { client } from "@/sanity/client";
import { seo } from "@/lib/seo";
import { galleryImagesQuery } from "@/sanity/queries";
import type { GalleryImage } from "@/sanity/types";

export const metadata: Metadata = {
  title: seo.gallery.title,
  description: seo.gallery.description,
  openGraph: {
    title: `${seo.gallery.title} · ${seo.siteName}`,
    description: seo.gallery.description,
  },
  twitter: {
    title: `${seo.gallery.title} · ${seo.siteName}`,
    description: seo.gallery.description,
  },
};

export default async function GalleryPage() {
  const images = await client.fetch<GalleryImage[]>(
    galleryImagesQuery,
    {},
    { next: { revalidate: 300 } }
  );

  const list = images ?? [];

  return (
    <div className="gesi-chapter gesi-gallery-page text-ink">
      <div className="gesi-container">
        <div className="gesi-grid-12 mb-16">
          <div className="gesi-col-side">
            <div className="gesi-sticky">
              <ChapterHeader
                chapterLabel="Chapter 03"
                number="03"
                label="Gallery"
                kanji="写真集"
              />
            </div>
          </div>
          <div className="gesi-col-main">
            <GradHeading as="h1" className="!mb-8 !text-balance sm:!pr-4">
              Captured in motion.
              <br />
              <span className="grad">Las Vegas light.</span>
            </GradHeading>
            <p className="body-copy max-w-[36rem]">
              A rolling archive of this DC2 in its natural habitat: parking decks,
              canyons, city glow, and early desert mornings.
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
          <GalleryGrid images={list} />
        )}
      </div>
    </div>
  );
}
