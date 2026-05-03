"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { urlFor } from "@/sanity/client";
import type { GalleryImage, GalleryImageAspectRatio, GridSpan, SanityImageField } from "@/sanity/types";
import type { Plugin } from "yet-another-react-lightbox";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });

type GalleryGridProps = {
  images: GalleryImage[];
};

const validGridSpans: GridSpan[] = ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9", "g12"];

function getGridSpanData(value?: string) {
  return validGridSpans.includes(value as GridSpan) ? value : "g2";
}

/** CSS `aspect-ratio` string for gallery media (matches cell shape so `object-fit: cover` crops correctly). */
function getGalleryMediaAspectRatio(value?: GalleryImageAspectRatio | null): string {
  if (value === "portrait") {
    return "3 / 4";
  }
  if (value === "square") {
    return "1 / 1";
  }
  return "3 / 2";
}

function lightboxImageUrl(image: SanityImageField): string {
  if (!image) return "";
  const w = image.metadata?.dimensions?.width;
  const h = image.metadata?.dimensions?.height;
  let b = urlFor(image);
  if (typeof w === "number" && w > 0 && typeof h === "number" && h > 0) {
    b = b.width(w).height(h).fit("max");
  } else {
    b = b.width(3200).fit("max");
  }
  return b.url();
}

function slideIndexForGridIndex(images: GalleryImage[], gridIndex: number): number {
  let n = 0;
  for (let i = 0; i < gridIndex; i++) {
    if (images[i]?.image) n++;
  }
  return n;
}

function imageAriaLabel(item: GalleryImage): string {
  const caption = item.caption?.trim();
  if (caption) return caption;
  const alt = item.image?.alt?.trim();
  if (alt) return alt;
  const ref = item.image?.asset?._ref;
  if (ref) return ref;
  return "Open image";
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [plugins, setPlugins] = useState<Plugin[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      import("yet-another-react-lightbox/plugins/zoom"),
      import("yet-another-react-lightbox/plugins/captions"),
    ]).then(([zoomMod, captionsMod]) => {
      if (!cancelled) {
        setPlugins([zoomMod.default, captionsMod.default]);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const slides = useMemo(() => {
    return images
      .filter((item): item is GalleryImage & { image: NonNullable<GalleryImage["image"]> } => Boolean(item.image))
      .map((item) => {
        const dim = item.image.metadata?.dimensions;
        const width = typeof dim?.width === "number" && dim.width > 0 ? dim.width : undefined;
        const height = typeof dim?.height === "number" && dim.height > 0 ? dim.height : undefined;
        const caption = item.caption?.trim();
        return {
          src: lightboxImageUrl(item.image),
          ...(width !== undefined && height !== undefined ? { width, height } : {}),
          ...(caption ? { description: caption } : {}),
        };
      });
  }, [images]);

  const openAt = useCallback((slideIndex: number) => {
    setLightboxIndex(slideIndex);
    setLightboxOpen(true);
  }, []);

  return (
    <div className="gesi-grid">
      {images.map((item, gridIndex) => (
        <figure
          key={item._id}
          className="gesi-grid__cell"
          data-span={getGridSpanData(item.gridSpan)}
        >
          <div
            className="gesi-grid__media"
            style={{ aspectRatio: getGalleryMediaAspectRatio(item.aspectRatio) }}
          >
            {item.image ? (
              <button
                type="button"
                className="absolute inset-0 z-10 m-0 block h-full w-full cursor-pointer border-0 bg-transparent p-0"
                aria-label={imageAriaLabel(item)}
                onClick={() => openAt(slideIndexForGridIndex(images, gridIndex))}
              >
                <Image
                  src={urlFor(item.image).width(1600).url()}
                  alt={item.image?.alt ?? item.caption ?? ""}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                  style={{ objectFit: "cover" }}
                />
              </button>
            ) : (
              <div className="gesi-grid__media-fallback">No image</div>
            )}
          </div>
          {item.caption ? (
            <figcaption className="gesi-grid__caption">{item.caption}</figcaption>
          ) : null}
          {(item.shotOn || item.capturedAt || item.location) && (
            <div className="gesi-grid__meta">
              {[
                item.shotOn,
                item.capturedAt
                  ? new Date(item.capturedAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : null,
                item.location,
              ]
                .filter(Boolean)
                .join(" · ")}
            </div>
          )}
        </figure>
      ))}
      {lightboxOpen && plugins && slides.length > 0 ? (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={slides}
          plugins={plugins}
          on={{
            view: ({ index }) => {
              setLightboxIndex(index);
            },
          }}
        />
      ) : null}
    </div>
  );
}
