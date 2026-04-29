/**
 * Loads `key=value` pairs from `.env.local` at `process.cwd()` into `process.env`
 * only for keys that are not already set (explicit shell exports win).
 *
 * Used by CLI scripts; keep parser dependency-free (no dotenv).
 */
import * as fs from "node:fs";
import * as path from "node:path";

export function loadEnvLocalFromRepoRoot(): void {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    console.log("Note: no .env.local at repo root; using existing process.env only.");
    return;
  }
  let raw: string;
  try {
    raw = fs.readFileSync(envPath, "utf8");
  } catch {
    console.log("Note: could not read .env.local; using existing process.env only.");
    return;
  }

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq <= 0) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    if (!key) {
      continue;
    }
    if (process.env[key] !== undefined) {
      continue;
    }
    let value = trimmed.slice(eq + 1).trim();
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

/** Sanity write token: `SANITY_AUTH_TOKEN` first, then `SANITY_API_TOKEN` (empty strings ignored). */
export function getSanityWriteToken(): string | undefined {
  const t = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_TOKEN;
  return t ? t : undefined;
}

loadEnvLocalFromRepoRoot();
