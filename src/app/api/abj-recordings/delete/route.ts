import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { id?: string };
    if (!body?.id)
      return NextResponse.json({ error: "id required" }, { status: 400 });
    const supabase = createSupabaseAdmin();
    const { error } = await supabase
      .from("abj_recordings")
      .delete()
      .eq("id", body.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to delete";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
