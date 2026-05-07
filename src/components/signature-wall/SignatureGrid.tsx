"use client";

import { useMemo, useState } from "react";
import type { Signature } from "@/lib/supabase/signatures";
import { SignatureCardCompact } from "./SignatureCardCompact";

type FilterMode = "newest" | "oldest" | "location" | "withNotes";

const FILTERS: { id: FilterMode; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
  { id: "location", label: "By Location" },
  { id: "withNotes", label: "With Notes" },
];

export function SignatureGrid({ signatures }: { signatures: Signature[] }) {
  const [filter, setFilter] = useState<FilterMode>("newest");

  const filtered = useMemo(() => {
    switch (filter) {
      case "newest":
        return [...signatures].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      case "oldest":
        return [...signatures].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );
      case "location":
        return [...signatures].sort((a, b) =>
          (a.location ?? "zzz").localeCompare(b.location ?? "zzz"),
        );
      case "withNotes":
        return signatures.filter((s) => s.note && s.note.trim().length > 0);
      default:
        return signatures;
    }
  }, [signatures, filter]);

  return (
    <>
      <div
        className="mt-8 flex flex-wrap items-center gap-2"
        role="tablist"
        aria-label="Filter signatures"
      >
        <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[rgba(250,248,243,0.55)]">
          Filter
        </span>
        {FILTERS.map((f) => {
          const isActive = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setFilter(f.id)}
              className={
                "rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors duration-200 " +
                (isActive
                  ? "border-[#c8102e] bg-[#c8102e] text-[#faf8f3]"
                  : "border-[rgba(250,248,243,0.2)] text-[rgba(250,248,243,0.7)] hover:border-[rgba(250,248,243,0.45)] hover:text-[#faf8f3]")
              }
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center font-mono text-sm text-[rgba(250,248,243,0.55)]">
          No signatures match this filter.
        </div>
      ) : (
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((signature) => (
            <SignatureCardCompact key={signature.id} signature={signature} />
          ))}
        </div>
      )}
    </>
  );
}
