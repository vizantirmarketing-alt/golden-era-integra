import type { Metadata } from "next";
import Link from "next/link";
import { seo } from "@/lib/seo";

export const metadata: Metadata = {
  title: seo.notFound.title,
  description: seo.notFound.description,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="gesi-chapter flex min-h-[min(70vh,calc(100dvh-8rem))] flex-col items-center justify-center px-6 py-24 text-center text-ink">
      <p className="font-mono text-[10px] tracking-[0.35em] text-ink-ghost uppercase">
        Error 404
      </p>
      <h1 className="font-display mt-4 max-w-lg text-4xl tracking-wide uppercase sm:text-5xl">
        <span className="grad-text">Off line.</span>
        <br />
        <span className="text-ink">Wrong exit.</span>
      </h1>
      <p className="body-copy mx-auto mt-6 max-w-md text-balance">
        This URL isn&apos;t part of the Golden Era Integra route book. Head back
        to the grid or open the full specification.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <div className="gesi-cta">
          <Link href="/">Home</Link>
        </div>
        <Link
          href="/build"
          className="inline-flex min-h-11 min-w-[10rem] items-center justify-center rounded border border-line px-6 py-2 font-mono text-[11px] tracking-[0.2em] text-ink uppercase no-underline transition-colors hover:border-magenta hover:text-magenta"
        >
          Specification
        </Link>
      </div>
    </div>
  );
}
