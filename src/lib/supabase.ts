import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Row shape for `guestbook_entries` (matches `supabase/schema.sql`). */
export type GuestbookEntry = {
  id: string;
  name: string;
  handle: string | null;
  message: string;
  created_at: string;
  ip_hash: string | null;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Anonymous Supabase client (public `anon` key).
 * Use for SELECT against RLS-protected tables where policies allow reads.
 */
export function createSupabaseAnon(): SupabaseClient {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Service-role client — bypasses RLS. Use only in Route Handlers / server code;
 * never pass this client or `SUPABASE_SERVICE_ROLE_KEY` to the browser.
 */
export function createSupabaseServiceRole(): SupabaseClient {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
