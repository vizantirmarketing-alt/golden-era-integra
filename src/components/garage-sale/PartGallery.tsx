"use client";

import Image from "next/image";
import { useState } from "react";

export type PartGalleryImage = {
  src: string;
  alt: string;
};

type PartGalleryProps = {
  images: PartGalleryImage[];
};

export function PartGallery({ images }: PartGalleryProps) {
  const [active, setActive] = useState(0);
  const safe = images.length > 0 ? images : [];
  const primary = safe[active] ?? safe[0];

  if (!primary) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-[#1a1816]/5">
        <Image
          key={primary.src}
          src={primary.src}
          alt={primary.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 55vw"
          priority
        />
      </div>
      {safe.length > 1 ? (
        <ul className="flex flex-wrap gap-2" role="list">
          {safe.map((img, idx) => {
            const selected = idx === active;
            return (
              <li key={img.src}>
                <button
                  type="button"
                  onClick={() => setActive(idx)}
                  className={`relative h-16 w-16 overflow-hidden rounded-sm border transition-colors ${
                    selected ? "border-[#c8102e] ring-1 ring-[#c8102e]" : "border-[rgba(26,24,22,0.15)]"
                  }`}
                  aria-current={selected ? "true" : undefined}
                  aria-label={`Show image ${idx + 1}: ${img.alt}`}
                >
                  <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="64px" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
