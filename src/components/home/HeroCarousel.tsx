"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";

export type HeroSlide = {
  src: string;
  label: string;
  alt: string;
};

type HeroCarouselProps = {
  slides: HeroSlide[];
};

const ROTATE_MS = 3500;

function formatSlide(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const total = slides.length;
  const activeSlide = slides[activeIndex];
  const canAutoRotate = !paused && !prefersReducedMotion && total > 1;

  useEffect(() => {
    if (!window.matchMedia) {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!canAutoRotate) {
      return;
    }
    const timer = window.setInterval(() => {
      setActiveIndex((idx) => (idx + 1) % total);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [canAutoRotate, total]);

  const labels = useMemo(
    () =>
      slides.map((slide, idx) => ({
        idx,
        number: formatSlide(idx),
        label: slide.label.toUpperCase(),
      })),
    [slides]
  );

  return (
    <div
      className="gesi-hero__carousel"
      role="region"
      aria-roledescription="carousel"
      aria-live="polite"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          setActiveIndex((idx) => (idx + 1) % total);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          setActiveIndex((idx) => (idx - 1 + total) % total);
        }
      }}
    >
      <div className="gesi-hero__carousel-frame gesi-hero__logo-img">
        {slides.map((slide, idx) => (
          <div
            key={slide.src}
            className={cn("gesi-hero__carousel-slide", idx === activeIndex && "is-active")}
            aria-label={slide.alt}
            aria-hidden={idx !== activeIndex}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              width={520}
              height={520}
              className="h-full w-full object-contain"
              priority={idx === 0}
              sizes="(max-width: 899px) min(92vw, 520px), (max-width: 1279px) 45vw, 520px"
            />
          </div>
        ))}
      </div>

      <div className="gesi-hero__carousel-indicator">
        <p className="gesi-hero__carousel-status" aria-live="polite">
          <span className="gesi-hero__carousel-count">
            {formatSlide(activeIndex)} / {String(total).padStart(2, "0")}
          </span>
          <span className="gesi-hero__carousel-label">
            {" \u2014 "}
            {activeSlide.label.toUpperCase()}
          </span>
        </p>
        <div
          className="gesi-hero__carousel-controls"
          role="group"
          aria-label="Carousel controls"
        >
          {labels.map(({ idx, number, label }) => (
            <button
              key={number}
              type="button"
              className={cn(
                "gesi-hero__carousel-dot",
                idx === activeIndex && "is-active"
              )}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Show slide ${number}: ${slides[idx].alt}`}
              aria-current={idx === activeIndex ? "true" : undefined}
              title={label}
            >
              {number}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only">{activeSlide.alt}</p>
    </div>
  );
}
