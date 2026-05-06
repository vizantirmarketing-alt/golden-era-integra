import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ChapterHeader } from "@/components/ChapterHeader";
import { GradHeading } from "@/components/GradHeading";
import { Marquee } from "@/components/Marquee";
import HeritageSection from "@/components/home/HeritageSection";
import { Hero } from "@/components/home/Hero";
import { MotionSection } from "@/components/home/MotionSection";
import SessionsTeaserSection from "@/components/home/SessionsTeaserSection";
import SignatureWall from "@/components/signature-wall/SignatureWall";
import { seo } from "@/lib/seo";
import { fetchSignatures, fetchSignaturesCount } from "@/lib/supabase/signatures";
import Link from "next/link";

export const dynamic = "force-dynamic";

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

function Star() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" />
    </svg>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ admin?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("vizantir_admin")?.value;
  const queryToken = params.admin;
  const adminToken =
    queryToken && queryToken === process.env.ADMIN_TOKEN
      ? queryToken
      : cookieToken && cookieToken === process.env.ADMIN_TOKEN
        ? cookieToken
        : undefined;
  const [signatures, totalCount] = await Promise.all([
    fetchSignatures({ limit: 3 }),
    fetchSignaturesCount(),
  ]);

  return (
    <>
      <Hero />
      <Marquee />
      <MotionSection id="story" className="gesi-chapter text-ink">
        <div className="gesi-container">
          <div className="gesi-grid-12 mb-16">
            <div className="gesi-col-side">
              <ChapterHeader
                chapterLabel="Chapter 01"
                number="01"
                label="Origin Story"
                kanji="起源"
              />
            </div>
            <div className="gesi-col-main">
              <GradHeading as="h1" className="!mb-8 !text-balance sm:!pr-4">
                The first one I
                {" "}
                <span className="grad">burned through</span>.
                <br />
                The second one I&apos;m
                {" "}
                <span className="outline">rebuilding</span>.
              </GradHeading>
              <div className="max-w-[36rem] space-y-4">
                <p className="body-copy">
                  Bought during COVID, mostly to have something to do on
                  weekends with my buddy. One thing led to another. Four years
                  later, still here.
                </p>
              </div>
            </div>
          </div>
          <div className="gesi-cta">
            <Link href="/story">Read the full story →</Link>
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
                label="The Build"
                kanji="仕様"
              />
            </div>
            <div className="gesi-col-main">
              <GradHeading as="h2" className="!mb-8 !text-balance sm:!pr-4">
                Hunted, not <span className="grad">bought</span>.
              </GradHeading>
              <div className="max-w-[36rem] space-y-4">
                <p className="body-copy">
                  It started during COVID. Everyone was bored, including me. I
                  bought this car cheap, mostly so my buddy and I would have
                  something to do on weekends.
                </p>
                <p className="body-copy">
                  Then one thing led to another. A small fix turned into a
                  bigger one. A bigger one turned into a teardown. The teardown
                  turned into a vision.
                </p>
                <p className="body-copy">
                  When I bought the car in 2021, I didn&apos;t have a plan. By
                  the time I knew what I was building, I was already two years
                  in. The plan caught up with the work — restore it with as
                  much Honda genuine as I could find.
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
      <MotionSection id="sessions" className="gesi-chapter gesi-gallery-sec text-ink">
        <SessionsTeaserSection />
      </MotionSection>
      <SignatureWall
        adminToken={adminToken}
        signatures={signatures}
        totalCount={totalCount}
      />
    </>
  );
}
