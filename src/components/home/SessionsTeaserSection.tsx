import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/client";
import { fetchPhotoSessionBySlug } from "@/sanity/photoSessions";
import type { SanityImageField } from "@/sanity/types";

const SESSION_SLUG = "downtown-summerlin";

const OVERLAY_IDX = ["001", "002", "003"] as const;

type SessionTeaserPhoto = NonNullable<SanityImageField> & {
  asset: { _ref: string; _type?: "reference" };
};

function isRenderablePhoto(p: SanityImageField | null | undefined): p is SessionTeaserPhoto {
  return p != null && Boolean(p.asset?._ref);
}

export default async function SessionsTeaserSection() {
  const session = await fetchPhotoSessionBySlug(SESSION_SLUG);
  const photos: SessionTeaserPhoto[] = (session?.photos ?? []).filter(isRenderablePhoto).slice(0, 3);

  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="gesi-sessions-teaser__container">
      <div className="gesi-gallery-head">
        <div>
          <div className="chapter-num-label">CHAPTER 04</div>
          <h2 className="gesi-gallery__title">The Present.</h2>
          <p className="gesi-sessions-teaser__jp-line" lang="ja">
            現在
            <span className="gesi-sessions-teaser__romaji"> · GENZAI</span>
          </p>
        </div>
        <p className="gesi-gallery__meta">Shot In Las Vegas / Film + Digital</p>
      </div>

      <div className="gesi-sessions-teaser-grid">
        {photos.map((photo, i) => (
          <Link
            key={photo.asset?._ref ?? `teaser-${i}`}
            href={`/sessions/${SESSION_SLUG}`}
            className="gesi-sessions-teaser-card min-w-0 block no-underline transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(232,56,164,0.18)]"
            aria-label={`Open session — ${OVERLAY_IDX[i]}`}
          >
            <div className="gesi-sessions-teaser-card__media">
              <Image
                src={urlFor(photo).width(1600).url()}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 767px) 100vw, 33vw"
                quality={75}
              />
            </div>
            <span className="gesi-sessions-teaser-idx" aria-hidden>
              {OVERLAY_IDX[i]}
            </span>
          </Link>
        ))}
      </div>

      <div className="gesi-cta mt-12">
        <Link href="/sessions">VIEW ALL SESSIONS →</Link>
      </div>
    </div>
  );
}
