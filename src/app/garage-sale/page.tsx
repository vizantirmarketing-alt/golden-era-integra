import type { Metadata } from "next";
import Link from "next/link";
import { GarageSalePartCard } from "@/components/garage-sale/GarageSalePartCard";
import { PART_CATEGORY_LABELS, PART_CATEGORY_ORDER, isPartCategory } from "@/lib/parts/constants";
import { usdWhole } from "@/lib/parts/format";
import { seo } from "@/lib/seo";
import { urlFor } from "@/sanity/client";
import { fetchPartCategories, fetchPartsList } from "@/sanity/parts";

export const revalidate = 300;

const TYPE_R_RED = "#c8102e";

export const metadata: Metadata = {
  title: { absolute: seo.garageSale.titleAbsolute },
  description: seo.garageSale.description,
  openGraph: {
    title: seo.garageSale.titleAbsolute,
    description: seo.garageSale.description,
    images: [...seo.garageSale.openGraphImages],
  },
  twitter: {
    title: seo.garageSale.titleAbsolute,
    description: seo.garageSale.description,
    images: [...seo.garageSale.openGraphImages],
  },
};

type GarageSalePageProps = {
  searchParams?: Promise<{ category?: string | string[] }>;
};

export default async function GarageSalePage({ searchParams }: GarageSalePageProps) {
  const sp = (await searchParams) ?? {};
  const rawCat = Array.isArray(sp.category) ? sp.category[0] : sp.category;
  const activeCategory =
    typeof rawCat === "string" && isPartCategory(rawCat) ? rawCat : undefined;

  const [allParts, categoriesWithAvailable] = await Promise.all([
    fetchPartsList(),
    fetchPartCategories(),
  ]);

  const filtered =
    activeCategory !== undefined
      ? allParts.filter((p) => p.category === activeCategory)
      : allParts;

  const availableParts = allParts.filter((p) => p.status === "available");
  const availableCount = availableParts.length;
  const categoryCount = new Set(allParts.map((p) => p.category)).size;
  const prices = availableParts.map((p) => p.price);
  const priceRangeLabel =
    prices.length === 0
      ? "—"
      : `${usdWhole.format(Math.min(...prices))}–${usdWhole.format(Math.max(...prices))}`;

  const chipCategories = PART_CATEGORY_ORDER.filter((c) => categoriesWithAvailable.includes(c));

  const stats: { value: string; label: string }[] = [
    { value: String(availableCount), label: "Available" },
    { value: String(categoryCount), label: "Categories" },
    { value: priceRangeLabel, label: "Price band" },
  ];

  return (
    <div className="gesi-chapter bg-[#faf8f3] text-[#1a1816]">
      <div className="gesi-container">
        <header className="mb-12 max-w-[48rem] md:mb-16">
          <p
            className="mb-4 font-mono text-[10px] tracking-[0.25em] uppercase"
            style={{ color: TYPE_R_RED }}
          >
            Vol. 02 — The Garage Sale
          </p>
          <h1 className="mb-6 font-[family-name:var(--font-family-display)] text-[clamp(36px,6vw,64px)] leading-[0.95] tracking-normal uppercase">
            Hunt is over. Take what&apos;s left.
          </h1>
          <p className="max-w-[42rem] font-sans text-base leading-[1.7] text-[rgba(26,24,22,0.78)]">
            Leftover parts from a four-year build. Each piece sourced, vetted, and now surplus to one
            car&apos;s needs.
          </p>

          <div
            className="mt-10 grid grid-cols-3 border-y border-[rgba(26,24,22,0.1)]"
            aria-label="Garage sale snapshot"
          >
            {stats.map((cell) => (
              <div
                key={cell.label}
                className="flex flex-col items-center justify-center gap-1 border-[rgba(26,24,22,0.1)] border-r px-2 py-4 last:border-r-0 md:px-3"
              >
                <span
                  className="font-[family-name:var(--font-family-display)] text-[22px] leading-none"
                  style={{ color: TYPE_R_RED }}
                >
                  {cell.value}
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[rgba(26,24,22,0.55)] uppercase">
                  / {cell.label}
                </span>
              </div>
            ))}
          </div>
        </header>

        <nav
          className="mb-10 flex snap-x snap-mandatory flex-nowrap gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Filter by category"
        >
          <Link
            href="/garage-sale"
            scroll={false}
            className={`shrink-0 snap-center rounded-sm px-3 py-2 font-mono text-[10px] tracking-[0.16em] whitespace-nowrap uppercase transition-colors duration-150 ${
              activeCategory === undefined
                ? "border border-transparent bg-[#c8102e] text-[#faf8f3]"
                : "border border-[rgba(26,24,22,0.18)] bg-transparent text-[#1a1816] hover:border-[#c8102e]/50"
            }`}
          >
            All
          </Link>
          {chipCategories.map((cat) => {
            const selected = activeCategory === cat;
            return (
              <Link
                key={cat}
                href={`/garage-sale?category=${cat}`}
                scroll={false}
                className={`shrink-0 snap-center rounded-sm px-3 py-2 font-mono text-[10px] tracking-[0.16em] whitespace-nowrap uppercase transition-colors duration-150 ${
                  selected
                    ? "border border-transparent bg-[#c8102e] text-[#faf8f3]"
                    : "border border-[rgba(26,24,22,0.18)] bg-transparent text-[#1a1816] hover:border-[#c8102e]/50"
                }`}
              >
                {PART_CATEGORY_LABELS[cat]}
              </Link>
            );
          })}
        </nav>

        {filtered.length === 0 ? (
          <p className="mx-auto max-w-md py-16 text-center font-mono text-xs leading-relaxed text-[rgba(26,24,22,0.62)]">
            Nothing in this category right now. Check back — parts are added as the build settles.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((part) => {
              const alt =
                typeof part.photos?.alt === "string" && part.photos.alt.trim()
                  ? part.photos.alt
                  : part.title;
              const coverSrc = urlFor(part.photos).width(900).height(1125).fit("crop").url();
              return (
                <li key={part._id}>
                  <GarageSalePartCard part={part} coverSrc={coverSrc} coverAlt={alt} />
                </li>
              );
            })}
          </ul>
        )}

        <p className="mx-auto mt-20 max-w-[40rem] text-center font-mono text-[11px] leading-relaxed tracking-[0.06em] text-[rgba(26,24,22,0.62)]">
          Local Vegas pickup welcome. US shipping coordinated by email. Prices firm — this is a garage,
          not a flea market.
        </p>
      </div>
    </div>
  );
}
