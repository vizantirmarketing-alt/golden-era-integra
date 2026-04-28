import { ChapterHeader } from "@/components/ChapterHeader";
import { ClickToPlayVideo } from "@/components/film/ClickToPlayVideo";
import { GradHeading } from "@/components/GradHeading";
import { embedSrcForVideo, parseVideoUrl, youtubePosterUrl } from "@/lib/videoEmbed";
import { client, urlFor } from "@/sanity/client";
import { filmEpisodesQuery } from "@/sanity/queries";
import type { FilmEpisode } from "@/sanity/types";

function volLabel(episodeNumber: number | undefined): string {
  if (episodeNumber == null || Number.isNaN(episodeNumber)) {
    return "Vol. —";
  }
  return `Vol. ${String(Math.floor(episodeNumber)).padStart(2, "0")}`;
}

function episodePosterUrl(ep: FilmEpisode): string | null {
  if (ep.thumbnail?.asset) {
    return urlFor(ep.thumbnail).width(1920).height(1080).quality(85).url();
  }
  const parsed = parseVideoUrl(ep.videoUrl);
  if (parsed?.provider === "youtube") {
    return youtubePosterUrl(parsed.id);
  }
  return null;
}

function episodeEmbedSrc(ep: FilmEpisode): string | null {
  return embedSrcForVideo(parseVideoUrl(ep.videoUrl), true);
}

export default async function FilmPage() {
  const episodes = await client.fetch<FilmEpisode[]>(
    filmEpisodesQuery,
    {},
    { next: { revalidate: 300 } }
  );

  const list = episodes ?? [];
  const [featured, ...older] = list;

  return (
    <div className="gesi-film gesi-chapter pb-24 text-bg">
      <div className="gesi-container">
        <div className="gesi-grid-12 mb-12">
          <div className="gesi-col-side">
            <div className="gesi-sticky">
              <ChapterHeader
                chapterLabel="Chapter 06"
                number="06"
                label="In Motion"
                kanji="走行"
              />
            </div>
          </div>
          <div className="gesi-col-main">
            <GradHeading as="h1" className="!mb-0 !text-balance">
              A car is meant
              <br />
              <span className="outline">to be driven.</span>
            </GradHeading>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="gesi-film-empty">
            <p className="body-copy max-w-md">
              Episodes will appear here once they are published in Sanity Studio.
            </p>
          </div>
        ) : (
          <>
            {featured ? (
              <div className="mb-14 md:mb-16">
                <ClickToPlayVideo
                  variant="featured"
                  embedSrc={episodeEmbedSrc(featured)}
                  posterSrc={episodePosterUrl(featured)}
                  posterAlt={featured.title ?? "Featured episode"}
                >
                  <div className="gesi-film-meta gesi-film-meta--tl pointer-events-none">
                    <span className="gesi-film-live-dot" aria-hidden />
                    Now Playing
                  </div>
                  <div className="gesi-film-meta gesi-film-meta--bl pointer-events-none line-clamp-2">
                    {volLabel(featured.episodeNumber)}
                    {featured.title ? ` — ${featured.title}` : ""}
                  </div>
                  {featured.duration ? (
                    <div className="gesi-film-meta gesi-film-meta--br pointer-events-none">
                      {featured.duration}
                    </div>
                  ) : null}
                </ClickToPlayVideo>
              </div>
            ) : null}

            {older.length > 0 ? (
              <div>
                <p className="eyebrow-mono mb-6 text-[rgba(253,246,236,0.45)]">Archive</p>
                <div className="gesi-film-grid">
                  {older.map((ep) => {
                    const title = ep.title ?? "Episode";
                    return (
                      <article key={ep._id}>
                        <ClickToPlayVideo
                          variant="card"
                          embedSrc={episodeEmbedSrc(ep)}
                          posterSrc={episodePosterUrl(ep)}
                          posterAlt={title}
                        >
                          {ep.duration ? (
                            <div className="gesi-film-meta gesi-film-meta--br pointer-events-none">
                              {ep.duration}
                            </div>
                          ) : null}
                          <div className="gesi-film-meta gesi-film-meta--bl pointer-events-none text-[10px] line-clamp-2">
                            {volLabel(ep.episodeNumber)}
                            {ep.title ? ` — ${ep.title}` : ""}
                          </div>
                        </ClickToPlayVideo>
                        {ep.description ? (
                          <p className="gesi-film-card-cap line-clamp-2">{ep.description}</p>
                        ) : ep.location ? (
                          <p className="gesi-film-card-cap line-clamp-1">{ep.location}</p>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
