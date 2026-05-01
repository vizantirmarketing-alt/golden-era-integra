import { createHash } from "node:crypto";

import { z } from "zod";

import { containsProfanity } from "@/lib/profanity";
import {
  createSupabaseServiceRole,
  type GuestbookEntry,
} from "@/lib/supabase";

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX_POSTS = 3;

const guestbookPostBodySchema = z.object({
  name: z.string().min(1).max(40),
  handle: z.string().max(64).nullish(),
  message: z.string().min(4).max(280),
  signature_svg: z.string().max(100000).nullable().optional(),
});

type GuestbookRowPublic = Omit<GuestbookEntry, "ip_hash">;

/** Strip leading `@`, keep only [a-zA-Z0-9._], prefix `@`; max 32 chars total. */
function sanitizeGuestbookHandle(raw: string | undefined): string | null {
  if (raw === undefined) return null;
  let s = raw.trim();
  while (s.startsWith("@")) {
    s = s.slice(1);
  }
  const core = [...s].filter((c) => /[a-zA-Z0-9._]/.test(c)).join("");
  if (core.length === 0) return null;
  const withAt = `@${core}`;
  return withAt.length > 32 ? withAt.slice(0, 32) : withAt;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

function hashIp(ip: string, salt: string): string {
  return createHash("sha256").update(`${salt}\0${ip}`, "utf8").digest("hex");
}

export async function GET() {
  const supabase = createSupabaseServiceRole();
  const { data, error } = await supabase
    .from("guestbook_entries")
    .select("id, name, handle, message, signature_svg, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return Response.json({ error: "Failed to load guestbook." }, { status: 500 });
  }

  return Response.json(data ?? []);
}

export async function POST(request: Request) {
  const salt = process.env.GUESTBOOK_IP_SALT;
  if (!salt) {
    return Response.json({ error: "Server configuration error." }, { status: 500 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = guestbookPostBodySchema.safeParse(json);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const message = issue?.message ?? "Invalid request body.";
    return Response.json({ error: message }, { status: 400 });
  }

  const { name, message } = parsed.data;
  const handle = sanitizeGuestbookHandle(parsed.data.handle ?? undefined);

  let signatureSvg: string | null = parsed.data.signature_svg ?? null;
  if (signatureSvg === "") {
    signatureSvg = null;
  }
  if (signatureSvg !== null) {
    const trimmed = signatureSvg.trim();
    if (!trimmed.startsWith("<svg") || !trimmed.includes("</svg>")) {
      return Response.json({ error: "Invalid signature format." }, { status: 400 });
    }
    signatureSvg = trimmed;
  }

  const partsToScan = [name, message, ...(handle ? [handle] : [])];
  for (const text of partsToScan) {
    if (containsProfanity(text)) {
      return Response.json(
        { error: "Your post contains language that isn't allowed." },
        { status: 400 },
      );
    }
  }

  const ip = getClientIp(request);
  const ipHash = hashIp(ip, salt);

  const supabase = createSupabaseServiceRole();
  const windowStart = new Date(Date.now() - RATE_WINDOW_MS).toISOString();

  const { count, error: countError } = await supabase
    .from("guestbook_entries")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", windowStart);

  if (countError) {
    return Response.json({ error: "Could not verify rate limit." }, { status: 500 });
  }

  if (count !== null && count >= RATE_MAX_POSTS) {
    return Response.json(
      { error: "Too many posts. Try again later." },
      { status: 429 },
    );
  }

  const { data: inserted, error: insertError } = await supabase
    .from("guestbook_entries")
    .insert({
      name,
      handle,
      message,
      signature_svg: signatureSvg,
      ip_hash: ipHash,
    })
    .select("id, name, handle, message, signature_svg, created_at")
    .single();

  if (insertError || !inserted) {
    return Response.json({ error: "Could not save entry." }, { status: 500 });
  }

  return Response.json(inserted as GuestbookRowPublic, { status: 201 });
}
