"use client";

import Image from "next/image";
import { useCallback, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ClickToPlayVideoProps = {
  embedSrc: string | null;
  posterSrc: string | null;
  posterAlt: string;
  variant: "featured" | "card";
  /** Shown when embed URL is invalid */
  unavailableLabel?: string;
  children?: ReactNode;
};

/**
 * Thumbnail + play overlay until the user activates; only then mounts the iframe (no eager embed load).
 */
export function ClickToPlayVideo({
  embedSrc,
  posterSrc,
  posterAlt,
  variant,
  unavailableLabel = "Video link unavailable",
  children,
}: ClickToPlayVideoProps) {
  const [playing, setPlaying] = useState(false);
  const onPlay = useCallback(() => {
    if (embedSrc) {
      setPlaying(true);
    }
  }, [embedSrc]);

  const isFeatured = variant === "featured";
  const canPlay = Boolean(embedSrc);

  return (
    <div
      className={cn(
        "gesi-film-frame group relative overflow-hidden rounded-md border border-[rgba(253,246,236,0.1)] bg-[linear-gradient(135deg,#1a0e2e,#000)]",
        isFeatured ? "gesi-film-frame--featured" : "gesi-film-frame--card"
      )}
    >
      {!playing ? (
        <>
          {posterSrc ? (
            <Image
              src={posterSrc}
              alt={posterAlt}
              fill
              className="object-cover"
              sizes={isFeatured ? "(max-width: 768px) 100vw, 80rem" : "(max-width: 768px) 100vw, 33vw"}
              priority={isFeatured}
            />
          ) : (
            <div className="gesi-film-frame__fallback" aria-hidden />
          )}

          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[rgba(10,4,18,0.55)] via-transparent to-[rgba(10,4,18,0.25)]" />

          {children}

          {canPlay ? (
            <button
              type="button"
              onClick={onPlay}
              className="absolute inset-0 z-[3] flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-milano focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a0e2e]"
              aria-label={`Play video: ${posterAlt}`}
            >
              <span className="gesi-film-play pointer-events-none">
                <span className="gesi-film-play__triangle" aria-hidden />
              </span>
            </button>
          ) : (
            <div className="absolute inset-0 z-[3] flex items-center justify-center px-4 text-center">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[rgba(253,246,236,0.55)]">
                {unavailableLabel}
              </p>
            </div>
          )}
        </>
      ) : (
        <iframe
          title={posterAlt}
          src={embedSrc ?? undefined}
          className="absolute inset-0 z-[4] h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
    </div>
  );
}
