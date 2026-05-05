// lib/supabase/signatures.ts
import { createClient } from "@supabase/supabase-js";

// Public client (anon key) — for reading on the client side.
// RLS enforces that only non-hidden rows are returned and writes are blocked.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } },
);

// Admin client (service role) — server-only.
// Bypasses RLS. NEVER import this from a client component.
export function getSupabaseAdmin() {
  if (typeof window !== "undefined") {
    throw new Error("getSupabaseAdmin() called on the client");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}

// ---------- Types ----------
export type SignaturePath = {
  color: string;
  size: number;
  points: [number, number][];
};

export type Signature = {
  id: string;
  name: string;
  location: string | null;
  note: string | null;
  paths: SignaturePath[];
  created_at: string;
};

export type SignatureRow = Signature & {
  ip_hash: string;
  user_agent: string | null;
  is_hidden: boolean;
};
