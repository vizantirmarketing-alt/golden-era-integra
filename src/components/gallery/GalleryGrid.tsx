"use client";

import Image from "next/image";
import { urlFor } from "@/sanity/client";
import type { GalleryImage, GridSpan } from "@/sanity/types";

type GalleryGridProps = {
  images: GalleryImage[];
};

const validGridSpans: GridSpan[] = ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9", "g12"];

function getGridSpanData(value?: string) {
  return validGridSpans.includes(value as GridSpan) ? value : "g2";
}

export function GalleryGrid({ images }: GalleryGridProps) {
  return (
    <div className="gesi-grid">
      {images.map((item) => (
        <figure
          key={item._id}
          className="gesi-grid__cell"
          data-span={getGridSpanData(item.gridSpan)}
        >
          <div className="gesi-grid__media">
            {item.image ? (
              <Image
                src={urlFor(item.image).width(1600).url()}
                alt={item.image?.alt ?? item.caption ?? ""}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
                style={{ objectFit: "cover" }}
              />
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
    </div>
  );
}
