import type { PartCategory, PartCondition } from "@/lib/parts/constants";
import { PART_CATEGORY_LABELS } from "@/lib/parts/constants";

const CONDITION_LABELS: Record<PartCondition, string> = {
  "new-old-stock": "New old stock",
  "used-excellent": "Used — excellent",
  "used-good": "Used — good",
  "used-fair": "Used — fair",
  "for-parts": "For parts",
};

export function formatPartCategoryLabel(category: PartCategory): string {
  return PART_CATEGORY_LABELS[category];
}

/** Uppercase, tracker-friendly line for eyebrows (e.g. grid cards). */
export function formatPartEyebrow(category: PartCategory, condition: PartCondition): string {
  const c = formatPartCategoryLabel(category).toUpperCase();
  const cond = CONDITION_LABELS[condition].toUpperCase();
  return `${c} / ${cond}`;
}

export function formatSoldMonthYear(isoDate: string): string {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(d);
}

export const usdWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
