import Link from "next/link";

const TYPE_R_RED = "#c8102e";

export function ComingSoon() {
  return (
    <div className="flex min-h-[calc(100dvh-var(--nav-offset))] flex-col items-center justify-center bg-[#faf8f3] px-6 py-20 text-[#1a1816]">
      <div className="flex w-full max-w-[56ch] flex-col items-center text-center">
        <p
          className="mb-6 font-mono text-[10px] tracking-[0.25em] uppercase"
          style={{ color: TYPE_R_RED }}
        >
          Vol. 02 — The Garage Sale
        </p>
        <h1 className="mb-8 font-[family-name:var(--font-family-display)] text-[clamp(48px,8vw,88px)] leading-[0.95] tracking-normal uppercase">
          Coming soon.
        </h1>
        <p className="max-w-[56ch] font-sans text-[18px] leading-[1.6] text-[rgba(26,24,22,0.78)]">
          Leftover parts from a four-year build. Honda-genuine, JDM-spec, and rare USDM pieces — sourced,
          vetted, and now surplus to one car&apos;s needs. Listings drop soon.
        </p>
        <div
          className="my-10 h-[0.5px] w-[80px] shrink-0 bg-[rgba(26,24,22,0.12)]"
          aria-hidden
        />
        <p className="mb-10 font-mono text-[11px] leading-relaxed text-[rgba(26,24,22,0.55)]">
          Local Vegas pickup welcome. US shipping coordinated by email.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/"
            className="font-mono text-[11px] tracking-[0.08em] text-[#1a1816] no-underline transition-[text-decoration-color] hover:underline"
          >
            ← Back to home
          </Link>
          <Link
            href="/build"
            className="font-mono text-[11px] tracking-[0.08em] text-[#1a1816] no-underline transition-[text-decoration-color] hover:underline"
          >
            Read the build story
          </Link>
        </nav>
      </div>
    </div>
  );
}
