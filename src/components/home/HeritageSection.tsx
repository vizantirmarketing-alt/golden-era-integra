import Image from "next/image";
import { urlFor } from "@/sanity/client";
import { fetchHeritageShots } from "@/sanity/heritageShots";

export default async function HeritageSection() {
  const shots = (await fetchHeritageShots()).filter((shot) => shot.image);

  if (shots.length === 0) {
    return null;
  }

  return (
    <section className="gei-heritage" aria-labelledby="heritage-heading">
      <header className="gei-heritage__header">
        <p className="gei-heritage__chapter">CHAPTER 04</p>
        <h2 id="heritage-heading" className="gei-heritage__title">
          HERITAGE.
        </h2>
        <p className="gei-heritage__kanji" lang="ja">
          系譜
        </p>
      </header>

      <div className="gei-heritage__rows">
        {shots.map((shot) => (
          <article key={shot._id} className="gei-heritage__row">
            <div className="gei-heritage__media">
              <Image
                src={urlFor(shot.image!).width(2400).url()}
                alt={shot.caption ?? ""}
                width={2400}
                height={1600}
                sizes="100vw"
                unoptimized
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
            <div className="gei-heritage__caption-block">
              {shot.kanji ? (
                <p className="gei-heritage__row-kanji" lang="ja">
                  {shot.kanji}
                  {shot.kanjiRomaji ? (
                    <span className="gei-heritage__row-romaji"> · {shot.kanjiRomaji}</span>
                  ) : null}
                </p>
              ) : null}
              {shot.caption ? (
                <p className="gei-heritage__row-caption">{shot.caption}</p>
              ) : null}
              {shot.subjects || shot.location ? (
                <p className="gei-heritage__row-meta">
                  {[shot.subjects, shot.location].filter(Boolean).join(" · ")}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
