import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("abj_recordings")
      .select(
        "id,title,type,video_url,audio_url,date,summary,transcript,status"
      )
      .order("date", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to list";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
