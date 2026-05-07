import type { Signature } from "@/lib/supabase/signatures";
import { getStateName } from "@/lib/states";
import { SignatureSVG } from "./SignatureSVG";

export function SignatureCardCompact({ signature }: { signature: Signature }) {
  return (
    <article className="relative mx-auto w-full max-w-[440px] bg-[#faf8f3] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
      <div className="absolute -top-[6px] left-1/2 h-[10px] w-[10px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ef4444,#991b1b)] shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
      <SignatureSVG paths={signature.paths} />
      <div className="mt-3 border-t border-dashed border-[#d8d2ca] pt-3">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="truncate font-[family-name:var(--font-family-display)] text-[18px] leading-tight uppercase text-[#1a1816]">
            {signature.name}
          </h2>
          <p className="whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-[rgba(26,24,22,0.6)]">
            {signature.location ?? getStateName(signature.state)}
          </p>
        </div>
        {signature.note ? (
          <p className="mt-1.5 font-sans text-[13px] leading-snug italic text-[#c8102e]">
            &ldquo;{signature.note}&rdquo;
          </p>
        ) : null}
      </div>
    </article>
  );
}
