// app/api/signatures/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/signatures";

// Set ADMIN_TOKEN in your env. Send as `Authorization: Bearer <token>`.
function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return token === expected;
}

// DELETE — soft-delete (sets is_hidden = true)
// Soft-delete preserves the row for spam analysis but hides it from the wall.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const admin = getSupabaseAdmin();

  const { error } = await admin
    .from("signatures")
    .update({ is_hidden: true })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
