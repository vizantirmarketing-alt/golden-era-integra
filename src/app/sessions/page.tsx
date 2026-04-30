import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/client";
import { fetchPhotoSessions } from "@/sanity/photoSessions";

export const revalidate = 300;

export default async function SessionsPage() {
  const sessions = await fetchPhotoSessions();

  return (
    <main className="gei-sessions-page">
      <header className="gei-sessions-page__header">
        <p className="gei-sessions-page__chapter">CHAPTER 05</p>
        <h1 className="gei-sessions-page__title">SESSIONS.</h1>
        <p className="gei-sessions-page__kanji" lang="ja">
          撮影
        </p>
      </header>

      <div className="gei-sessions-page__list">
        {sessions.map((session) => (
          <Link key={session._id} href={`/sessions/${session.slug}`} className="gei-sessions-card">
            <div className="gei-sessions-card__media">
              {session.coverImage ? (
                <Image
                  src={urlFor(session.coverImage).width(2400).url()}
                  alt={session.title}
                  width={2400}
                  height={1600}
                  sizes="100vw"
                  unoptimized
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              ) : null}
            </div>
            <div className="gei-sessions-card__meta">
              {session.kanji ? (
                <p className="gei-sessions-card__kanji" lang="ja">
                  {session.kanji}
                  {session.kanjiRomaji ? (
                    <span className="gei-sessions-card__romaji"> · {session.kanjiRomaji}</span>
                  ) : null}
                </p>
              ) : null}
              <h2 className="gei-sessions-card__title">{session.title}</h2>
              {session.location ? <p className="gei-sessions-card__location">{session.location}</p> : null}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
