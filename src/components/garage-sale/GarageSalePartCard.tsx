import Image from "next/image";
import Link from "next/link";
import type { PartListItem } from "@/sanity/parts";
import { formatPartEyebrow, usdWhole } from "@/lib/parts/format";

export type GarageSalePartCardProps = {
  part: PartListItem;
  coverSrc: string;
  coverAlt: string;
};

export function GarageSalePartCard({ part, coverSrc, coverAlt }: GarageSalePartCardProps) {
  const eyebrow = formatPartEyebrow(part.category, part.condition);
  const priceLabel = usdWhole.format(part.price);
  const sold = part.status === "sold";
  const pending = part.status === "pending";

  return (
    <Link
      href={`/garage-sale/${part.slug}`}
      className="group block outline-none transition-transform duration-200 ease-out hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-[#c8102e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f3]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-[#1a1816]/5">
        <Image
          src={coverSrc}
          alt={coverAlt}
          fill
          className={`object-cover transition-[filter,transform] duration-300 ${
            sold
              ? "grayscale opacity-70"
              : "group-hover:brightness-[1.04]"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {pending ? (
          <span className="absolute top-3 left-3 rounded-sm bg-[#c8102e] px-2 py-1 font-mono text-[10px] font-semibold tracking-[0.14em] text-[#faf8f3] uppercase">
            Pending
          </span>
        ) : null}
        {sold ? (
          <span className="absolute top-3 left-3 rounded-sm bg-[#1a1816] px-2 py-1 font-mono text-[10px] font-semibold tracking-[0.14em] text-[#faf8f3] uppercase">
            Sold
          </span>
        ) : null}
      </div>
      <p className="mt-3 mb-1 font-mono text-[10px] leading-none tracking-[0.22em] text-[#c8102e] uppercase">
        {eyebrow}
      </p>
      <div className="flex items-start justify-between gap-3">
        <h2 className="min-w-0 flex-1 font-[family-name:var(--font-family-display)] text-[22px] leading-[1.05] tracking-normal text-[#1a1816] uppercase">
          {part.title}
        </h2>
        <span
          className={`shrink-0 font-[family-name:var(--font-family-display)] text-[22px] leading-none text-[#c8102e] ${
            sold ? "text-[#1a1816] line-through decoration-[#1a1816]" : ""
          }`}
        >
          {priceLabel}
        </span>
      </div>
    </Link>
  );
}
