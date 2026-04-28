import type { Config } from "tailwindcss";

/**
 * Source of truth for design tokens: `src/app/globals.css` (`:root` + `@theme`).
 * This file exists so the Tailwind v4 pipeline has an explicit project entry; theme
 * extension lives in CSS as required for Tailwind 4.
 */
const config: Config = {
  content: ["./src/app/**/*.{ts,tsx,mdx}", "./src/components/**/*.{ts,tsx,mdx}"],
};

export default config;
