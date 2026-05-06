import type { Metadata } from "next";
import Link from "next/link";
import { SignatureSVG } from "@/components/signature-wall/SignatureSVG";
import { seo } from "@/lib/seo";
import { fetchSignatures } from "@/lib/supabase/signatures";

export const metadata: Metadata = {
  title: { absolute: seo.signatures.titleAbsolute },
  description: seo.signatures.description,
  openGraph: {
    title: seo.signatures.titleAbsolute,
    description: seo.signatures.description,
    images: ["/opengraph-image"],
  },
  twitter: {
    title: seo.signatures.titleAbsolute,
    description: seo.signatures.description,
    images: ["/opengraph-image"],
  },
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function countryFromLocation(location: string | null): string | null {
  if (!location) return null;
  const segments = location
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (segments.length === 0) return null;
  return segments[segments.length - 1].toLowerCase();
}

export default async function SignaturesPage() {
  const signatures = await fetchSignatures();
  const oldest = signatures.at(-1);
  const countries = new Set(
    signatures
      .map((signature) => countryFromLocation(signature.location))
      .filter((value): value is string => Boolean(value)),
  );

  const stats = [
    { value: signatures.length.toString(), label: "Total signatures" },
    { value: countries.size.toString(), label: "Countries represented" },
    {
      value: oldest ? formatDate(oldest.created_at) : "—",
      label: "Oldest signature",
    },
  ];

  return (
    <section className="gesi-chapter border-t border-[#2a2722] bg-[#1a1816] text-[#faf8f3]">
      <div className="gesi-container py-12 md:py-16">
        <header className="border-b border-[#2a2722] pb-10">
          <p className="font-mono text-[11px] tracking-[0.25em] text-[#c8102e] uppercase">
            Vol. 03 - The Signature Wall
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-family-display)] text-[clamp(36px,6vw,64px)] uppercase leading-[0.95] tracking-tight">
            The full wall.
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-base leading-[1.6] text-[rgba(250,248,243,0.75)]">
            Every name that&apos;s signed, in order. Click to sign yours.
          </p>

          <div
            className="mt-9 grid grid-cols-1 border-y border-[rgba(250,248,243,0.12)] sm:grid-cols-3"
            aria-label="Signature wall stats"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex min-h-[86px] flex-col justify-center gap-1 border-b border-[rgba(250,248,243,0.12)] px-4 py-4 sm:border-r sm:border-b-0 sm:last:border-r-0"
              >
                <span className="font-display text-[22px] leading-none text-[#c8102e]">
                  {stat.value}
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[rgba(250,248,243,0.55)] uppercase">
                  / {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/#signature-wall"
              className="group inline-flex items-center gap-2 rounded-full bg-[#faf8f3] px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[#1a1816] transition-[transform,box-shadow,background-color,color] duration-300 hover:-translate-y-0.5 hover:bg-[#c8102e] hover:text-[#faf8f3] hover:shadow-[0_12px_30px_rgba(200,16,46,0.35)]"
            >
              <span>Sign the Wall</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 py-10 md:grid-cols-2">
          {signatures.map((signature) => (
            <article key={signature.id} className="relative bg-[#faf8f3] p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
              <SignatureSVG paths={signature.paths} />
              <div className="mt-3 border-t border-dashed border-[#d8d2ca] pt-3">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="truncate font-[family-name:var(--font-family-display)] text-[18px] leading-tight uppercase text-[#1a1816]">
                    {signature.name}
                  </h2>
                  {signature.location ? (
                    <p className="whitespace-nowrap font-mono text-[11px] uppercase tracking-wider text-[rgba(26,24,22,0.6)]">
                      {signature.location}
                    </p>
                  ) : null}
                </div>
                {signature.note ? (
                  <p className="mt-1.5 font-sans text-[14px] leading-snug italic text-[#c8102e]">
                    &ldquo;{signature.note}&rdquo;
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        <div className="border-t border-[#2a2722] pt-8">
          <Link
            href="/#signature-wall"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[rgba(250,248,243,0.7)] transition-colors hover:text-[#faf8f3]"
          >
            <span>Want to sign? Click here</span>
            <span className="text-[#c8102e] transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
