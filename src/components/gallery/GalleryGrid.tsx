"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { urlFor } from "@/sanity/client";
import type { GalleryImage, GridSpan } from "@/sanity/types";

type GalleryGridProps = {
  images: GalleryImage[];
};

const validGridSpans: GridSpan[] = ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9"];

function getGridSpanClass(value?: string) {
  return validGridSpans.includes(value as GridSpan) ? value : "g2";
}

function getDisplayTitle(image: GalleryImage, idx: number) {
  return image.caption?.trim() || `Frame ${String(idx + 1).padStart(2, "0")}`;
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const prepared = useMemo(
    () =>
      images.map((image, index) => {
        const src = image.image ? urlFor(image.image).width(1800).quality(82).url() : "";
        return {
          image,
          index,
          src,
          title: getDisplayTitle(image, index),
        };
      }),
    [images]
  );

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    queueMicrotask(() => closeRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((i) =>
          i === null ? null : Math.max(0, i - 1)
        );
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((i) =>
          i === null ? null : Math.min(prepared.length - 1, i + 1)
        );
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, prepared.length]);

  const active = activeIndex === null ? null : prepared[activeIndex];

  return (
    <>
      <motion.div
        className="gesi-gallery-grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } },
        }}
      >
        {prepared.map(({ image, index, src, title }) => (
          <motion.button
            key={image._id}
            type="button"
            className={`gesi-gallery-item ${getGridSpanClass(image.gridSpan)}`}
            onClick={() => setActiveIndex(index)}
            variants={{
              hidden: { opacity: 0, y: 26 },
              show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } },
            }}
            whileHover={{ y: -3 }}
            aria-label={`Open image ${String(index + 1).padStart(2, "0")} lightbox`}
          >
            {src ? (
              <Image
                src={src}
                alt={image.image?.alt || title}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 40vw, 33vw"
                className="gesi-gallery-image"
              />
            ) : (
              <div className="gesi-gallery-fallback">No image</div>
            )}
            <span className="gesi-gallery-item-idx">
              {String(index + 1).padStart(3, "0")}
            </span>
            <span className="gesi-gallery-overlay">
              <span className="gesi-gallery-caption">{title}</span>
            </span>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {active ? (
          <motion.div
            className="gesi-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label={
              active && activeIndex !== null
                ? `Image ${String(activeIndex + 1).padStart(2, "0")}: ${active.title}`
                : "Gallery lightbox"
            }
          >
            <motion.div
              className="gesi-lightbox-panel"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                ref={closeRef}
                type="button"
                className="gesi-lightbox-close"
                onClick={() => setActiveIndex(null)}
                aria-label="Close lightbox"
              >
                <X size={18} />
              </button>
              <div className="gesi-lightbox-media">
                {active.src ? (
                  <Image
                    src={active.src}
                    alt={active.image.image?.alt || active.title}
                    fill
                    sizes="90vw"
                    className="gesi-lightbox-image"
                    priority
                  />
                ) : (
                  <div className="gesi-gallery-fallback">No image</div>
                )}
              </div>
              <div className="gesi-lightbox-meta">
                <h2 className="gesi-lightbox-title">{active.title}</h2>
                <div className="gesi-lightbox-tags">
                  {active.image.location ? <span>{active.image.location}</span> : null}
                  {active.image.shotOn ? <span>{active.image.shotOn}</span> : null}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
