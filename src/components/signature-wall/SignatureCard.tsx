"use client";

import type { Signature } from "@/lib/supabase/signatures";
import { SignatureSVG } from "./SignatureSVG";

export function SignatureCard({
  sig,
  tilt,
  isAdmin,
  onDelete,
}: {
  sig: Signature;
  tilt: string;
  isAdmin: boolean;
  onDelete: () => void;
}) {
  return (
    <div
      className={`relative ${tilt} transition-transform duration-300 hover:-translate-y-1 hover:rotate-0`}
    >
      <div className="sw-pin" />
      <div className="relative border border-line bg-bg p-5 pt-6 shadow-[0_4px_20px_rgba(26,14,46,0.08)]">
        <SignatureSVG paths={sig.paths} />
        <div className="mt-4 border-t border-dashed border-line pt-4">
          <div className="flex items-baseline justify-between gap-2">
            <div className="truncate font-[family-name:var(--font-family-display)] text-lg leading-tight uppercase text-ink">
              {sig.name}
            </div>
            {sig.location ? (
              <div className="whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                {sig.location}
              </div>
            ) : null}
          </div>
          {sig.note ? (
            <div className="mt-2 font-mono text-[11px] italic leading-snug text-[#c8102e]">
              &ldquo;{sig.note}&rdquo;
            </div>
          ) : null}
        </div>
        {isAdmin ? (
          <button
            type="button"
            onClick={onDelete}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-ink font-mono text-sm leading-none text-bg transition-colors hover:bg-[#c8102e]"
            aria-label="Hide signature"
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}
