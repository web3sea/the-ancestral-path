import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("user_email_campaign")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return NextResponse.json({ ok: true });
}
