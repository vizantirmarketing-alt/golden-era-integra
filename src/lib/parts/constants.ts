/** Values must match `sanity/schemas/part.ts` category list. */
export const PART_CATEGORY_VALUES = [
  "body",
  "paint",
  "engine",
  "engine-bay",
  "drivetrain",
  "suspension",
  "brakes",
  "wheels",
  "interior",
  "glass-trim",
  "misc",
] as const;

export type PartCategory = (typeof PART_CATEGORY_VALUES)[number];

export const PART_CATEGORY_LABELS: Record<PartCategory, string> = {
  body: "Body",
  paint: "Paint",
  engine: "Engine",
  "engine-bay": "Engine bay",
  drivetrain: "Drivetrain",
  suspension: "Suspension",
  brakes: "Brakes",
  wheels: "Wheels",
  interior: "Interior",
  "glass-trim": "Glass & trim",
  misc: "Misc",
};

/** Display order for filter chips (subset may be hidden if no available parts). */
export const PART_CATEGORY_ORDER: readonly PartCategory[] = PART_CATEGORY_VALUES;

export const PART_CONDITION_VALUES = [
  "new-old-stock",
  "used-excellent",
  "used-good",
  "used-fair",
  "for-parts",
] as const;

export type PartCondition = (typeof PART_CONDITION_VALUES)[number];

export const PART_STATUS_VALUES = ["available", "pending", "sold"] as const;

export type PartStatus = (typeof PART_STATUS_VALUES)[number];

export function isPartCategory(value: string): value is PartCategory {
  return (PART_CATEGORY_VALUES as readonly string[]).includes(value);
}
