"use client";

import type { Signature } from "@/lib/supabase/signatures";
import { SignatureSVG } from "./SignatureSVG";

export function SignatureCard({
  sig,
  tilt,
  isAdmin,
  deleteConfirmArmed = false,
  onDelete,
}: {
  sig: Signature;
  tilt: string;
  isAdmin: boolean;
  deleteConfirmArmed?: boolean;
  onDelete: () => void;
}) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[560px] ${tilt} transition-transform duration-300 hover:-translate-y-1 hover:rotate-0`}
    >
      <div className="sw-pin" />
      <div className="relative bg-[#faf8f3] p-6 pt-7 shadow-[0_8px_30px_rgba(0,0,0,0.35),0_2px_8px_rgba(0,0,0,0.2)]">
        <SignatureSVG paths={sig.paths} />
        <div className="mt-4 border-t border-dashed border-line pt-4">
          <div className="flex items-baseline justify-between gap-2">
            <div className="truncate font-[family-name:var(--font-family-display)] text-[22px] leading-tight uppercase text-ink">
              {sig.name}
            </div>
            {sig.location ? (
              <div className="whitespace-nowrap font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                {sig.location}
              </div>
            ) : null}
          </div>
          {sig.note ? (
            <div className="mt-2 font-sans text-[14px] italic leading-snug text-[#c8102e]">
              &ldquo;{sig.note}&rdquo;
            </div>
          ) : null}
        </div>
        {isAdmin ? (
          <button
            type="button"
            onClick={onDelete}
            className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center font-mono text-sm leading-none text-bg transition-[transform,background-color] ${
              deleteConfirmArmed
                ? "scale-110 bg-[#c8102e]"
                : "bg-ink hover:bg-[#c8102e]"
            }`}
            aria-label="Hide signature"
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}
