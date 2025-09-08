import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      title: string;
      type: "Full Moons" | "New Moons";
      video_url: string;
      date: string | Date;
      summary?: string | null;
    };
    const supabase = createSupabaseAdmin();
    const payload = {
      title: body.title,
      type: body.type,
      video_url: body.video_url,
      date: typeof body.date === "string" ? body.date : body.date.toISOString(),
      summary: body.summary ?? null,
      status: "draft" as const,
      transcript: null as string | null,
    };
    const { data, error } = await supabase
      .from("abj_recordings")
      .insert(payload)
      .select(
        "id,title,type,video_url,audio_url,date,summary,status,transcript"
      )
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
