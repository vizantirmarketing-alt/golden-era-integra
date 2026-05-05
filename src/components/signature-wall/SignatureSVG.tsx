"use client";

import type { SignaturePath } from "@/lib/supabase/signatures";

export function SignatureSVG({ paths }: { paths: SignaturePath[] }) {
  const W = 600;
  const H = 240;
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H}`}
      className="block"
      preserveAspectRatio="xMidYMid meet"
    >
      {paths.map((stroke, i) => (
        <polyline
          key={i}
          fill="none"
          stroke={stroke.color}
          strokeWidth={stroke.size}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={stroke.points.map((p) => p.join(",")).join(" ")}
        />
      ))}
    </svg>
  );
}
