import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { urlFor } from "@/sanity/client";
import { fetchPhotoSessionBySlug, fetchPhotoSessions } from "@/sanity/photoSessions";

export const revalidate = 300;

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
                sizes="100vw"
                unoptimized
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          </figure>
        ))}
      </div>
    </main>
  );
}
