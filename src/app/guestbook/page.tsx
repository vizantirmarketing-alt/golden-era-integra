import type { Metadata } from "next";
import { GuestbookClient } from "@/components/guestbook/GuestbookClient";
import { ChapterHeader } from "@/components/ChapterHeader";
import { GradHeading } from "@/components/GradHeading";
import { seo } from "@/lib/seo";

export const metadata: Metadata = {
  title: seo.guestbook.title,
  description: seo.guestbook.description,
  openGraph: {
    title: `${seo.guestbook.title} · ${seo.siteName}`,
    description: seo.guestbook.description,
  },
  twitter: {
    title: `${seo.guestbook.title} · ${seo.siteName}`,
    description: seo.guestbook.description,
  },
};

export default function GuestbookPage() {
  return (
    <div className="relative bg-bg text-ink">
      <div className="gesi-chapter pb-24">
        <div className="gesi-container">
          <div className="gesi-grid-12 mb-4">
            <div className="gesi-col-side">
              <div className="gesi-sticky">
                <ChapterHeader
                  chapterLabel="Chapter 04"
                  number="04"
                  label="Guestbook"
                  kanji="芳名録"
                />
              </div>
            </div>
            <div className="gesi-col-main">
              <GradHeading as="h1" className="!mb-6 !text-balance">
                Sign the
                <br />
                <span className="grad">visitor&apos;s log.</span>
              </GradHeading>
              <p className="body-copy max-w-[560px]">
                Drivers, builders, friends, lurkers. If you found this car worth a
                moment of your time, leave a note. Posts appear instantly — keep it
                clean.
              </p>
            </div>
          </div>

          <GuestbookClient />
        </div>
      </div>
    </div>
  );
}
