// app/api/signatures/route.ts
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  getSupabaseAdmin,
  supabasePublic,
  type SignaturePath,
} from "@/lib/supabase/signatures";

// One signature per IP per 24h
const RATE_LIMIT_WINDOW_HOURS = 24;
const RATE_LIMIT_MAX = 1;

// Daily-rotating salt — not cryptographically critical, just keeps ip_hash
// from being a stable identifier across days.
function getDailySalt(): string {
  const day = new Date().toISOString().slice(0, 10);
  return `${process.env.SIGNATURE_IP_SALT || "vizantir-dev-salt"}-${day}`;
}

function hashIp(ip: string): string {
  return createHash("sha256").update(`${ip}::${getDailySalt()}`).digest("hex");
}

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

// ---------------------------------------------------------------------------
// GET — list visible signatures (newest first, paginated)
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limit = Math.min(
    parseInt(url.searchParams.get("limit") || "60", 10),
    100,
  );
  const offset = Math.max(parseInt(url.searchParams.get("offset") || "0", 10), 0);

  const { data, error } = await supabasePublic
    .from("signatures")
    .select("id, name, location, note, paths, created_at")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ signatures: data });
}

// ---------------------------------------------------------------------------
// POST — create a signature (rate-limited, validated)
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;

  // ---- Validation ----
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const location = typeof b.location === "string" ? b.location.trim() : "";
  const note = typeof b.note === "string" ? b.note.trim() : "";
  const paths = b.paths;

  if (!name || name.length > 40) {
    return NextResponse.json(
      { error: "Name is required (max 40 chars)" },
      { status: 400 },
    );
  }
  if (location.length > 40) {
    return NextResponse.json({ error: "Location too long" }, { status: 400 });
  }
  if (note.length > 60) {
    return NextResponse.json({ error: "Note too long" }, { status: 400 });
  }
  if (!Array.isArray(paths) || paths.length === 0 || paths.length > 500) {
    return NextResponse.json(
      { error: "Invalid signature drawing" },
      { status: 400 },
    );
  }
  for (const stroke of paths as SignaturePath[]) {
    if (
      !stroke ||
      typeof stroke.color !== "string" ||
      typeof stroke.size !== "number" ||
      !Array.isArray(stroke.points) ||
      stroke.points.length > 2000
    ) {
      return NextResponse.json({ error: "Invalid stroke" }, { status: 400 });
    }
  }
  // Reject oversized payloads (matches DB constraint)
  if (JSON.stringify(paths).length > 51_200) {
    return NextResponse.json({ error: "Signature too large" }, { status: 413 });
  }

  // ---- Profanity filter (lightweight — replace with a real list in prod) ----
  const blocked = ["fuck", "shit", "nigger", "faggot", "cunt"];
  const haystack = `${name} ${location} ${note}`.toLowerCase();
  if (blocked.some((w) => haystack.includes(w))) {
    return NextResponse.json(
      { error: "Please keep it respectful" },
      { status: 400 },
    );
  }

  // ---- Rate limit ----
  const ip = getClientIp(req);
  const ipHash = hashIp(ip);
  const cutoff = new Date(
    Date.now() - RATE_LIMIT_WINDOW_HOURS * 3600 * 1000,
  ).toISOString();
  const admin = getSupabaseAdmin();

  const { count, error: countErr } = await admin
    .from("signatures")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", cutoff);

  if (countErr) {
    return NextResponse.json(
      { error: "Rate-limit check failed" },
      { status: 500 },
    );
  }
  if ((count ?? 0) >= RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: "You've already signed today. Come back tomorrow." },
      { status: 429 },
    );
  }

  // ---- Insert ----
  const userAgent = (req.headers.get("user-agent") || "").slice(0, 200);

  const { data, error } = await admin
    .from("signatures")
    .insert({
      name,
      location: location || null,
      note: note || null,
      paths,
      ip_hash: ipHash,
      user_agent: userAgent,
    })
    .select("id, name, location, note, paths, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ signature: data }, { status: 201 });
}
