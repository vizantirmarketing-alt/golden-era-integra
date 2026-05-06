import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSiteUrl } from "@/lib/site";

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 8;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function pruneRateBuckets(now: number): void {
  for (const [ip, b] of rateBuckets) {
    if (now > b.resetAt + RATE_WINDOW_MS) {
      rateBuckets.delete(ip);
    }
  }
}

function consumeRateToken(ip: string): boolean {
  const now = Date.now();
  pruneRateBuckets(now);
  let b = rateBuckets.get(ip);
  if (!b || now > b.resetAt) {
    b = { count: 0, resetAt: now + RATE_WINDOW_MS };
    rateBuckets.set(ip, b);
  }
  if (b.count >= RATE_MAX) {
    return false;
  }
  b.count += 1;
  return true;
}

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    return fwd.split(",")[0]?.trim() || "unknown";
  }
  return req.headers.get("x-real-ip") || "unknown";
}

function trimLen(s: unknown, max: number): string | null {
  if (typeof s !== "string") {
    return null;
  }
  const t = s.trim();
  if (!t || t.length > max) {
    return null;
  }
  return t;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  const honeypot = typeof b.website === "string" ? b.website : "";
  if (honeypot.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const name = trimLen(b.name, 120);
  const email = trimLen(b.email, 254);
  const message = trimLen(b.message, 5000);
  const partTitle = trimLen(b.partTitle, 200);
  const partSlug = trimLen(b.partSlug, 120);
  const partNumberRaw = typeof b.partNumber === "string" ? b.partNumber.trim() : "";
  if (partNumberRaw.length > 40) {
    return NextResponse.json({ error: "Invalid part number" }, { status: 400 });
  }
  const partNumber = partNumberRaw;

  if (!name || !email || !message || !partTitle || !partSlug) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const ip = getClientIp(req);
  if (!consumeRateToken(ip)) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (!resendKey) {
    const dev = process.env.NODE_ENV === "development";
    return NextResponse.json(
      { error: dev ? "RESEND_API_KEY is not set in the environment." : "Email is not configured." },
      { status: 500 },
    );
  }

  const inbox = process.env.GARAGE_SALE_INBOX?.trim();
  if (!inbox) {
    const dev = process.env.NODE_ENV === "development";
    return NextResponse.json(
      { error: dev ? "GARAGE_SALE_INBOX is not set in the environment." : "Email is not configured." },
      { status: 500 },
    );
  }

  const site = getSiteUrl();
  const partUrl = `${site}/garage-sale/${encodeURIComponent(partSlug)}`;

  const subjectPart = partNumber.length > 0 ? `${partTitle} (${partNumber})` : partTitle;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Part: ${partTitle}`,
    `Link: ${partUrl}`,
    partNumber.length > 0 ? `Part number: ${partNumber}` : null,
    "",
    message,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const resend = new Resend(resendKey);
  const { error } = await resend.emails.send({
    from: "Golden Era Integra <garage-sale@goldeneraintegra.com>",
    to: [inbox],
    replyTo: email,
    subject: `Inquiry: ${subjectPart}`,
    text,
  });

  if (error) {
    console.error("garage-sale-inquiry Resend error", error);
    const devMsg =
      error && typeof error === "object" && "message" in error && typeof error.message === "string"
        ? error.message
        : String(error);
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? devMsg : "Failed to send email." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
