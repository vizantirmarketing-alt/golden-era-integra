import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

function PulseBlock({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-line-soft", className)}
      {...props}
    />
  );
}

/** Matches chapter pages on cream background (`gesi-chapter`). */
export function ChapterRouteSkeleton() {
  return (
    <div className="gesi-chapter text-ink">
      <div className="gesi-container">
        <div className="gesi-grid-12 mb-16">
          <div className="gesi-col-side">
            <PulseBlock className="mb-3 h-3 w-28" />
            <PulseBlock className="mb-3 h-10 w-24" />
            <PulseBlock className="h-6 w-16" />
          </div>
          <div className="gesi-col-main space-y-4">
            <PulseBlock className="h-12 w-full max-w-xl" />
            <PulseBlock className="h-4 w-full max-w-lg" />
            <PulseBlock className="h-4 w-full max-w-md" />
            <PulseBlock className="h-4 w-full max-w-lg" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <PulseBlock className="h-40 w-full" />
          <PulseBlock className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}

/** Journal entry hero + body placeholder. */
export function JournalEntryRouteSkeleton() {
  return (
    <article className="text-ink">
      <div className="relative aspect-[21/9] w-full animate-pulse bg-line-soft md:aspect-[2.4/1]" />
      <div className="gesi-chapter gesi-journal-body-wrap">
        <div className="gesi-container">
          <div className="gesi-grid-12 mb-16">
            <div className="gesi-col-side">
              <PulseBlock className="mb-3 h-3 w-28" />
              <PulseBlock className="h-8 w-20" />
            </div>
            <div className="gesi-col-main space-y-3">
              <PulseBlock className="h-5 w-full" />
              <PulseBlock className="h-5 w-full max-w-[95%]" />
              <PulseBlock className="h-5 w-full max-w-[88%]" />
              <PulseBlock className="mt-6 h-4 w-full" />
              <PulseBlock className="h-4 w-full max-w-[92%]" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Film page — dark chrome. */
export function FilmRouteSkeleton() {
  return (
    <div className="gesi-film gesi-chapter pb-24 text-bg">
      <div className="gesi-container">
        <div className="gesi-grid-12 mb-12">
          <div className="gesi-col-side">
            <div className="mb-3 h-3 w-28 animate-pulse rounded-md bg-[rgba(253,246,236,0.14)]" />
            <div className="h-10 w-24 animate-pulse rounded-md bg-[rgba(253,246,236,0.14)]" />
          </div>
          <div className="gesi-col-main space-y-3">
            <div className="h-12 max-w-xl animate-pulse rounded-md bg-[rgba(253,246,236,0.14)]" />
            <div className="h-6 max-w-md animate-pulse rounded-md bg-[rgba(253,246,236,0.1)]" />
          </div>
        </div>
        <div className="mb-14 aspect-[21/9] w-full animate-pulse rounded-md bg-[rgba(253,246,236,0.08)] md:mb-16" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="aspect-video animate-pulse rounded-md bg-[rgba(253,246,236,0.08)]" />
          <div className="aspect-video animate-pulse rounded-md bg-[rgba(253,246,236,0.08)]" />
          <div className="aspect-video animate-pulse rounded-md bg-[rgba(253,246,236,0.08)]" />
        </div>
      </div>
    </div>
  );
}
