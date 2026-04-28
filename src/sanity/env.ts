/**
 * Public Sanity configuration (browser-safe). Matches `.env.local.example`.
 * Override via `NEXT_PUBLIC_SANITY_*` in `.env.local` or the host dashboard.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "4dgncr6u";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-12-20";
