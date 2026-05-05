import type { Metadata } from "next";
import { ChapterHeader } from "@/components/ChapterHeader";
import { GradHeading } from "@/components/GradHeading";
import { seo } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: seo.story.titleAbsolute },
  description: seo.story.description,
  openGraph: {
    title: seo.story.titleAbsolute,
    description: seo.story.description,
    images: ["/opengraph-image"],
  },
  twitter: {
    title: seo.story.titleAbsolute,
    description: seo.story.description,
    images: ["/opengraph-image"],
  },
};

export default function StoryPage() {
  return (
    <div className="gesi-chapter text-ink">
      <div className="gesi-container">
        <div className="gesi-grid-12">
          <div className="gesi-col-side">
            <div className="gesi-sticky">
              <ChapterHeader
                chapterLabel="Chapter 01"
                number="01"
                label="Origin Story"
                kanji="起源"
              />
            </div>
          </div>
          <div className="gesi-col-main">
            <GradHeading as="h1" className="!mb-12 text-balance">
              The first one I
              {" "}
              <span className="grad">burned through</span>.
              <br />
              The second one I&apos;m
              {" "}
              <span className="outline">rebuilding</span>.
            </GradHeading>
            <div className="gesi-body-grid">
              <p>
                There was this guy in high school who had an Integra. I
                don&apos;t remember his name. I remember the car. After
                graduation I saved up, found a &apos;94 LS on eBay two hours
                away. Drove out to get it. Didn&apos;t actually know how to
                drive stick — burned the clutch before I made it back into
                town.
              </p>
              <p>
                This one I got May 30, 2021. &apos;95 GS-R, bought it off an
                Air Force guy in town who was getting stationed somewhere
                else. Been working on it ever since, back and forth between
                my garage and my buddy&apos;s shop. He&apos;s a mechanic. I
                help where I can. Four years in. Still going.
              </p>
            </div>
            <div className="gesi-stats" aria-label="Key figures">
              <div>
                <div className="gesi-stat-num">170</div>
                <div className="gesi-stat-lbl">Factory HP</div>
              </div>
              <div>
                <div className="gesi-stat-num">2,579</div>
                <div className="gesi-stat-lbl">Curb Weight (lb)</div>
              </div>
              <div>
                <div className="gesi-stat-num">8,100</div>
                <div className="gesi-stat-lbl">Redline RPM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
