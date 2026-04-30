import type { Metadata } from "next";
import { ChapterHeader } from "@/components/ChapterHeader";
import { GradHeading } from "@/components/GradHeading";
import { Marquee } from "@/components/Marquee";
import HeritageSection from "@/components/home/HeritageSection";
import { Hero } from "@/components/home/Hero";
import { MotionSection } from "@/components/home/MotionSection";
import { cn } from "@/lib/cn";
import { seo } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: seo.home.titleAbsolute },
  description: seo.home.description,
  openGraph: {
    title: seo.home.titleAbsolute,
    description: seo.home.description,
  },
  twitter: {
    title: seo.home.titleAbsolute,
    description: seo.home.description,
  },
};

const galleryTeaser = [
  { id: 1, idx: "001", label: "Vegas Strip — Blue Hour", tone: "t1" as const },
  { id: 2, idx: "002", label: "Front 3/4 — Magenta Sunset", tone: "t2" as const },
  { id: 3, idx: "003", label: "Mugen MF10 Detail", tone: "t3" as const },
] as const;

const toneClass = { t1: "gesi-g-item--t1", t2: "gesi-g-item--t2", t3: "gesi-g-item--t3" };

function Star() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <MotionSection id="origin" className="gesi-chapter text-ink">
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
              <GradHeading as="h2" className="!mb-12 text-balance">
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
                  There was a guy in my high school with an Integra. I
                  don&apos;t remember his name. I remember the car. After
                  graduation I saved up and won a 1994 LS on eBay, two hours
                  from where I lived. I drove it home without knowing how to
                  drive stick and burned the clutch before I made it back into
                  town.
                </p>
                <p>
                  I bought this one on May 30, 2021. A &apos;95 GS-R from a
                  guy in town getting stationed elsewhere — Air Force, needed
                  to sell before he moved. I&apos;ve been working on it ever
                  since, between my home garage and my buddy&apos;s shop.
                  He&apos;s a mechanic. I help where I can. Four years in.
                  Still going.
                </p>
              </div>
              <div className="mx-auto max-w-[36rem] py-14 text-center">
                <div
                  className="mx-auto mb-8 h-px w-28 bg-gradient-to-r from-blue via-magenta to-orange"
                  aria-hidden
                />
                <p className="text-[1.05rem] leading-[1.65] text-ink-soft italic">
                  My buddy and I have been friends for almost thirty years.
                  We&apos;ve spent the last four working on this car. Two days a
                  week, sun or rain. It costs more money, time, and effort than
                  I&apos;d ever admit out loud. But that&apos;s not really the
                  point.
                  <br />
                  <span className="font-medium not-italic text-ink">
                    The point is we got to spend the time together.
                  </span>
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
      </MotionSection>
      <MotionSection className="gesi-quote" aria-label="Design philosophy">
        <div className="gesi-quote__stars gesi-quote__stars--top" aria-hidden>
          <Star />
          <Star />
          <Star />
        </div>
        <div className="gesi-quote__inner">
          <p className="gesi-quote__eyebrow">— A Note On Philosophy</p>
          <blockquote>
            &ldquo;Restoration is not <em>nostalgia.</em> It is the refusal to
            let something good <em>disappear.</em>&rdquo;
          </blockquote>
          <cite>— Owner&apos;s Note, Vol. 01</cite>
        </div>
        <div className="gesi-quote__stars gesi-quote__stars--bot" aria-hidden>
          <Star />
          <Star />
          <Star />
          <Star />
          <Star />
        </div>
      </MotionSection>
      <MotionSection id="build" className="gesi-chapter text-ink">
        <div className="gesi-container">
          <div className="gesi-grid-12 mb-16">
            <div className="gesi-col-side">
              <ChapterHeader
                chapterLabel="Chapter 02"
                number="02"
                label="Specification"
                kanji="仕様"
              />
            </div>
            <div className="gesi-col-main">
              <GradHeading as="h2" className="!mb-8 !text-balance sm:!pr-4">
                Hunted, not <span className="grad">bought</span>.
              </GradHeading>
              <div className="max-w-[36rem] space-y-4">
                <p className="body-copy">
                  When I bought the car in 2021, I had a vision. I wanted to
                  restore it with as much Honda genuine as I could find. Not
                  because anyone was checking. I just wanted it done right.
                </p>
                <p className="body-copy">
                  The car is a &apos;95 GS-R, but I wanted the 98-spec front
                  and rear bumper, Type R spoiler, Type T side skirts, quad
                  headlights. Every piece had to be Honda or right. If it
                  wasn&apos;t, I waited.
                </p>
                <p className="body-copy">
                  Four years of hunting. Junkyards. New old stock from Japan.
                  An Acura dealer that had a brand-new 98 front bumper sitting
                  on a shelf. Whatever it took.
                </p>
              </div>
            </div>
          </div>
          <div className="gesi-cta">
            <Link href="/build">Read the full story →</Link>
          </div>
        </div>
      </MotionSection>
      <HeritageSection />
      <MotionSection
        id="gallery"
        className="gesi-chapter gesi-gallery-sec text-ink"
      >
        <div className="gesi-container">
          <div className="gesi-gallery-head">
            <div>
              <div className="chapter-num-label">Chapter 03</div>
              <h2 className="gesi-gallery__title">The Archive.</h2>
              <span
                className="chapter-tag-jp mt-3"
                style={{ display: "block" }}
                lang="ja"
              >
                記録
              </span>
            </div>
            <p className="gesi-gallery__meta">Shot In Las Vegas / Film + Digital</p>
          </div>
          <div className="grid min-h-0 auto-rows-[180px] grid-cols-1 gap-3 sm:auto-rows-min md:min-h-0 md:grid-cols-3">
            {galleryTeaser.map((g) => (
              <Link
                key={g.id}
                href="/archive"
                className={cn(
                  "gesi-g-item block no-underline transition-shadow duration-300",
                  "hover:shadow-[0_12px_40px_rgba(232,56,164,0.18)] hover:brightness-[1.02]",
                  toneClass[g.tone]
                )}
                aria-label={`Open archive — ${g.label}`}
              >
                <span className="gesi-g-num" aria-hidden>
                  {String(g.id).padStart(2, "0")}
                </span>
                <span className="gesi-g-idx">{g.idx}</span>
                <span className="gesi-g-label">{g.label}</span>
              </Link>
            ))}
          </div>
          <div className="gesi-cta mt-12">
            <Link href="/archive">View Full Archive →</Link>
          </div>
        </div>
      </MotionSection>
    </>
  );
}
