import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { urlFor } from "@/sanity/client";
import { fetchPhotoSessionBySlug, fetchPhotoSessions } from "@/sanity/photoSessions";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const session = await fetchPhotoSessionBySlug(slug);

  if (!session) {
    return { title: "Session Not Found" };
  }

  const title =
    session.seoTitle?.trim() ||
    `${session.title} — Sessions`;

  const description =
    session.seoDescription?.trim() ||
    session.intro?.trim() ||
    `Photography from ${session.location || "the road"} — a session documenting a Milano Red 1995 Acura Integra GS-R.`;

  const ogImageSource = session.ogImage || session.photos?.[0];
  const ogImageUrl = ogImageSource
    ? urlFor(ogImageSource).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const sessions = await fetchPhotoSessions();
  return sessions.map((s) => ({ slug: s.slug }));
}

export default async function SessionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await fetchPhotoSessionBySlug(slug);

  if (!session) notFound();

  return (
    <main className="gei-session">
      <header className="gei-session__header">
        <Link href="/sessions" className="gei-session__back">
          ← All sessions
        </Link>
        {session.kanji ? (
          <p className="gei-session__kanji" lang="ja">
            {session.kanji}
            {session.kanjiRomaji ? <span className="gei-session__romaji"> · {session.kanjiRomaji}</span> : null}
          </p>
        ) : null}
        <h1 className="gei-session__title">{session.title}</h1>
        <p className="gei-session__meta">
          {[
            session.location,
            session.capturedAt
              ? new Date(session.capturedAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {session.intro ? <p className="gei-session__intro">{session.intro}</p> : null}
      </header>

      <div className="gei-session__photos">
        {session.photos?.map((photo, idx) => (
          <figure key={idx} className="gei-session__photo">
            <div className="gei-session__photo-media">
              <Image
                src={urlFor(photo!).width(2400).url()}
                alt={`${session.title} — ${idx + 1}`}
                width={2400}
                height={1600}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                quality={75}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          </figure>
        ))}
      </div>
    </main>
  );
}
