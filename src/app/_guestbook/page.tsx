import type { Metadata } from "next";
import { GuestbookClient } from "@/components/guestbook/GuestbookClient";
import { ChapterHeader } from "@/components/ChapterHeader";
import { GradHeading } from "@/components/GradHeading";
import { seo } from "@/lib/seo";

/**
 * Archived — `src/app/_guestbook` is excluded from Next.js routing.
 * To restore: rename folder to `guestbook` and rename `src/app/api/_guestbook` → `api/guestbook`.
 */
const guestbookTitle = "Guestbook";
const guestbookDescription =
  "Sign the visitor's log — leave a note for fellow drivers and builders.";

export const metadata: Metadata = {
  title: guestbookTitle,
  description: guestbookDescription,
  openGraph: {
    title: `${guestbookTitle} · ${seo.siteName}`,
    description: guestbookDescription,
  },
  twitter: {
    title: `${guestbookTitle} · ${seo.siteName}`,
    description: guestbookDescription,
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
