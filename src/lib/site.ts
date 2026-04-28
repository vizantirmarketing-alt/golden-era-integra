/**
 * Canonical site URL for metadata, OG tags, and sitemap.
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://golden-era-integra.vercel.app).
 */
export function getSiteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) {
    return env.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  }
  return "http://localhost:3000";
}
