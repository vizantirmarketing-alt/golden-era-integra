import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/garage-sale/InquiryForm";
import { PartGallery, type PartGalleryImage } from "@/components/garage-sale/PartGallery";
import { PartPortableText } from "@/components/garage-sale/PartPortableText";
import { isGarageSaleLive } from "@/lib/garage-sale/gate";
import { formatPartEyebrow, formatSoldMonthYear, usdWhole } from "@/lib/parts/format";
import { seo } from "@/lib/seo";
import { urlFor } from "@/sanity/client";
import { fetchAllPartSlugs, fetchPartBySlug } from "@/sanity/parts";

export const revalidate = 300;

type PartPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  if (!isGarageSaleLive()) {
    return [];
  }
  const slugs = await fetchAllPartSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PartPageProps): Promise<Metadata> {
  if (!isGarageSaleLive()) {
    return {
      title: "Not Found",
      robots: { index: false, follow: true },
    };
  }

  const { slug } = await params;
  const part = await fetchPartBySlug(slug);

  if (!part) {
    return { title: "Part not found" };
  }

  const title =
    part.seoTitle?.trim() ||
    `${part.title} — The Garage Sale`;

  const description =
    part.seoDescription?.trim() || seo.garageSale.description;

  const ogSource = part.photos?.[0];
  const ogImageUrl = ogSource
    ? urlFor(ogSource).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: ogImageUrl
        ? [{ url: ogImageUrl, width: 1200, height: 630 }]
        : [...seo.garageSale.openGraphImages],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [...seo.garageSale.openGraphImages],
    },
  };
}

export default async function GarageSalePartPage({ params }: PartPageProps) {
  if (!isGarageSaleLive()) {
    notFound();
  }

  const { slug } = await params;
  const part = await fetchPartBySlug(slug);

  if (!part) {
    notFound();
  }

  const eyebrow = formatPartEyebrow(part.category, part.condition);
  const priceLabel = usdWhole.format(part.price);
  const pending = part.status === "pending";
  const sold = part.status === "sold";
  const canInquire = part.status === "available" || part.status === "pending";

  const galleryImages: PartGalleryImage[] = (part.photos ?? [])
    .filter((img): img is NonNullable<typeof img> => Boolean(img?.asset?._ref))
    .map((img) => {
      const alt =
        typeof img.alt === "string" && img.alt.trim() ? img.alt.trim() : part.title;
      return {
        src: urlFor(img).width(1400).height(1750).fit("crop").url(),
        alt,
      };
    });

  return (
    <div className="gesi-chapter bg-[#faf8f3] text-[#1a1816]">
      <div className="gesi-container">
        <Link
          href="/garage-sale"
          className="mb-10 inline-block font-mono text-[10px] tracking-[0.18em] text-[rgba(26,24,22,0.55)] uppercase underline-offset-4 hover:text-[#c8102e] hover:underline"
        >
          ← Back to all parts
        </Link>

        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-start">
          <div>
            <PartGallery images={galleryImages} />
          </div>

          <aside className="md:sticky md:top-24">
            <p className="mb-2 font-mono text-[10px] leading-none tracking-[0.22em] text-[#c8102e] uppercase">
              {eyebrow}
            </p>
            <h1 className="font-[family-name:var(--font-family-display)] text-[32px] leading-[1.05] tracking-normal uppercase">
              {part.title}
            </h1>

            {pending ? (
              <p className="mt-3 inline-block rounded-sm bg-[#c8102e] px-2 py-1 font-mono text-[10px] font-semibold tracking-[0.14em] text-[#faf8f3] uppercase">
                Pending
              </p>
            ) : null}
            {sold ? (
              <p className="mt-3 inline-block rounded-sm bg-[#1a1816] px-2 py-1 font-mono text-[10px] font-semibold tracking-[0.14em] text-[#faf8f3] uppercase">
                Sold
              </p>
            ) : null}

            <p
              className={`mt-6 font-[family-name:var(--font-family-display)] text-[36px] leading-none text-[#c8102e] ${
                sold ? "text-[#1a1816] line-through decoration-[#1a1816]" : ""
              }`}
            >
              {priceLabel}
            </p>

            {part.partNumber?.trim() ? (
              <p className="mt-4 font-mono text-[11px] tracking-[0.08em] text-[rgba(26,24,22,0.62)]">
                Part No. {part.partNumber.trim()}
              </p>
            ) : null}

            {part.fitment && part.fitment.length > 0 ? (
              <div className="mt-6">
                <p className="mb-2 font-mono text-[10px] tracking-[0.2em] text-[#c8102e] uppercase">Fits</p>
                <ul className="flex flex-wrap gap-2">
                  {part.fitment.map((line) => (
                    <li
                      key={line}
                      className="rounded-[2px] bg-[#1a1816] px-[9px] py-[3px] text-[11px] tracking-[0.04em] text-[#faf8f3]"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-8">
              <PartPortableText value={part.description} />
            </div>

            {part.shippingNotes?.trim() ? (
              <div className="mt-8 rounded-sm border border-[rgba(26,24,22,0.12)] bg-white/40 px-4 py-4">
                <p className="mb-2 font-mono text-[10px] tracking-[0.2em] text-[#c8102e] uppercase">
                  Shipping &amp; pickup
                </p>
                <p className="font-sans text-sm leading-relaxed text-[rgba(26,24,22,0.78)]">
                  {part.shippingNotes.trim()}
                </p>
              </div>
            ) : null}

            <div className="mt-10">
              {canInquire ? (
                <InquiryForm
                  partTitle={part.title}
                  partSlug={part.slug}
                  partNumber={part.partNumber}
                />
              ) : (
                <p className="font-mono text-[11px] tracking-[0.12em] text-[rgba(26,24,22,0.55)] uppercase">
                  Sold
                  {part.soldDate ? ` ${formatSoldMonthYear(part.soldDate)}` : ""}
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
