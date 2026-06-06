// lib/supabase/signatures.ts
import { unstable_cache } from "next/cache";
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
  state: string | null;
  note: string | null;
  paths: SignaturePath[];
  created_at: string;
};

export type SignatureRow = Signature & {
  ip_hash: string;
  user_agent: string | null;
  is_hidden: boolean;
};

export const SIGNATURE_SELECT = "id, name, location, state, note, paths, created_at";

type FetchSignaturesOptions = {
  limit?: number;
  offset?: number;
};

async function fetchSignaturesImpl({
  limit,
  offset = 0,
}: FetchSignaturesOptions = {}): Promise<Signature[]> {
  let query = supabasePublic
    .from("signatures")
    .select(SIGNATURE_SELECT)
    .order("created_at", { ascending: false });
  if (typeof limit === "number") {
    const safeLimit = Math.max(1, Math.min(limit, 1000));
    const safeOffset = Math.max(0, offset);
    query = query.range(safeOffset, safeOffset + safeLimit - 1);
  }
  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}

export const fetchSignatures = (opts: FetchSignaturesOptions = {}) =>
  unstable_cache(
    () => fetchSignaturesImpl(opts),
    ["signatures", JSON.stringify(opts)],
    { tags: ["signatures"], revalidate: 3600 },
  )();

async function fetchSignaturesCountImpl(): Promise<number> {
  const { count, error } = await supabasePublic
    .from("signatures")
    .select("*", { count: "exact", head: true });
  if (error) {
    throw new Error(error.message);
  }
  return count ?? 0;
}

export const fetchSignaturesCount = unstable_cache(
  fetchSignaturesCountImpl,
  ["signatures-count"],
  { tags: ["signatures"], revalidate: 3600 },
);
