import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChapterHeader } from "@/components/ChapterHeader";
import { JournalPortableText } from "@/components/journal/JournalPortableText";
import { client, urlFor } from "@/sanity/client";
import { JournalHeroTitle } from "@/lib/journalTitle";
import { formatJournalDate } from "@/lib/journalDate";
import { estimateReadingTimeMinutes } from "@/lib/readingTime";
import { seo } from "@/lib/seo";
import {
  journalEntryBySlugQuery,
  journalEntryNextQuery,
  journalEntryPrevQuery,
} from "@/sanity/queries";
import type { JournalEntry, JournalEntryNav } from "@/sanity/types";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const entry = await client.fetch<JournalEntry | null>(
    journalEntryBySlugQuery,
    { slug },
    { next: { revalidate: 300 } }
  );

  if (!entry?.slug?.current) {
    return { title: seo.notFound.title };
  }

  const title = entry.title ?? "Journal";
  const description =
    entry.excerpt?.trim() ||
    `Build journal — ${title}. Documented DC2 restoration and drives.`;

  const coverOg =
    entry.coverImage?.asset &&
    urlFor(entry.coverImage).width(1200).height(630).quality(85).url();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: entry.publishedAt ?? undefined,
      images: coverOg
        ? [
            {
              url: coverOg,
              width: 1200,
              height: 630,
              alt: entry.coverImage?.alt ?? title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: coverOg ? [coverOg] : undefined,
    },
  };
}

export default async function JournalEntryPage({ params }: PageProps) {
  const { slug } = await params;

  const entry = await client.fetch<JournalEntry | null>(
    journalEntryBySlugQuery,
    { slug },
    { next: { revalidate: 300 } }
  );

  if (!entry?.slug?.current) {
    notFound();
  }

  const sortAt = entry.publishedAt ?? entry._createdAt ?? "";
  const docCreatedAt = entry._createdAt ?? sortAt;

  const [prev, next] = sortAt
    ? await Promise.all([
        client.fetch<JournalEntryNav>(
          journalEntryPrevQuery,
          { slug: entry.slug.current, sortAt, docCreatedAt },
          { next: { revalidate: 300 } }
        ),
        client.fetch<JournalEntryNav>(
          journalEntryNextQuery,
          { slug: entry.slug.current, sortAt, docCreatedAt },
          { next: { revalidate: 300 } }
        ),
      ])
    : [null, null];

  const coverSrc = entry.coverImage?.asset
    ? urlFor(entry.coverImage).width(1920).height(1080).quality(85).url()
    : "";

  const readMins = estimateReadingTimeMinutes(entry.body ?? undefined);

  return (
    <article className="text-ink">
      <header className="gesi-journal-hero">
        {coverSrc ? (
          <div className="gesi-journal-hero-cover">
            <Image
              src={coverSrc}
              alt={entry.coverImage?.alt || entry.title || "Journal cover"}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="gesi-journal-hero-scrim" aria-hidden />
          </div>
        ) : (
          <div className="gesi-journal-hero-fallback" aria-hidden />
        )}
        <div className="gesi-journal-hero-inner">
          <h1 className="gesi-journal-hero-title">
            {entry.title ? <JournalHeroTitle title={entry.title} /> : null}
          </h1>
          <div className="gesi-journal-hero-meta font-mono">
            <span>{formatJournalDate(entry.publishedAt)}</span>
            <span className="text-magenta">{entry.tag ?? "Other"}</span>
            <span>{readMins} min read</span>
          </div>
        </div>
      </header>

      <div className="gesi-chapter gesi-journal-body-wrap">
        <div className="gesi-container">
          <div className="gesi-grid-12 mb-16">
            <div className="gesi-col-side">
              <div className="gesi-sticky">
                <ChapterHeader
                  chapterLabel="Chapter 04"
                  number="04"
                  label="Build Journal"
                  kanji="記録"
                />
              </div>
            </div>
            <div className="gesi-col-main">
              <JournalPortableText value={entry.body ?? undefined} />
            </div>
          </div>

          <footer className="gesi-journal-foot">
            <div className="gesi-journal-foot-row">
              {prev?.slug?.current ? (
                <Link href={`/journal/${prev.slug.current}`} className="gesi-journal-foot-link">
                  ← {prev.title ?? "Previous"}
                </Link>
              ) : (
                <span className="gesi-journal-foot-muted">← Previous</span>
              )}
              <Link href="/journal" className="gesi-journal-foot-back">
                Back to journal
              </Link>
              {next?.slug?.current ? (
                <Link href={`/journal/${next.slug.current}`} className="gesi-journal-foot-link">
                  {next.title ?? "Next"} →
                </Link>
              ) : (
                <span className="gesi-journal-foot-muted">Next →</span>
              )}
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
}
