import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  const supabase = createSupabaseAdmin();
  try {
    const { data, error } = await supabase
      .from("abj_recordings")
      .select("id,title,type,video_url,audio_url,date,summary")
      .eq("status", "published")
      .not("summary", "is", null)
      .order("date", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to fetch recordings";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
