import type { Metadata } from "next";
import Link from "next/link";
import { ChapterHeader } from "@/components/ChapterHeader";
import { GradHeading } from "@/components/GradHeading";
import { client } from "@/sanity/client";
import { formatJournalDate } from "@/lib/journalDate";
import { seo } from "@/lib/seo";
import { journalEntriesListQuery } from "@/sanity/queries";
import type { JournalEntry } from "@/sanity/types";

export const metadata: Metadata = {
  title: seo.journal.title,
  description: seo.journal.description,
  openGraph: {
    title: `${seo.journal.title} · ${seo.siteName}`,
    description: seo.journal.description,
  },
  twitter: {
    title: `${seo.journal.title} · ${seo.siteName}`,
    description: seo.journal.description,
  },
};

export default async function JournalIndexPage() {
  const entries = await client.fetch<JournalEntry[]>(
    journalEntriesListQuery,
    {},
    { next: { revalidate: 300 } }
  );

  const list = entries ?? [];

  return (
    <div className="gesi-chapter text-ink">
      <div className="gesi-container">
        <div className="gesi-grid-12 mb-12">
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
            <GradHeading as="h1" className="!mb-0 !text-balance">
              A record,
              <br />
              <span className="grad">in entries.</span>
            </GradHeading>
          </div>
        </div>

        {list.length === 0 ? (
          <p className="body-copy max-w-md">
            Journal entries will appear here once they are published in Sanity Studio.
          </p>
        ) : (
          <div className="gesi-journal-list">
            {list.flatMap((entry) => {
              const slug = entry.slug?.current;
              if (!slug) {
                return [];
              }
              return [
                <Link
                  key={entry._id}
                  href={`/journal/${slug}`}
                  className="gesi-j-article text-ink"
                >
                  <div className="gesi-j-date">{formatJournalDate(entry.publishedAt)}</div>
                  <div className="gesi-j-tag">{entry.tag ?? "Other"}</div>
                  <div className="gesi-j-body">
                    <h3>{entry.title}</h3>
                    {entry.excerpt ? <p>{entry.excerpt}</p> : null}
                  </div>
                  <div className="gesi-j-read">Read →</div>
                </Link>,
              ];
            })}
          </div>
        )}
        {list.length > 0 ? <div className="gesi-j-endcap" aria-hidden /> : null}
      </div>
    </div>
  );
}
