import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      id: string;
      title?: string;
      type?: "Full Moons" | "New Moons";
      video_url?: string;
      date?: string | Date;
      summary?: string | null;
    };
    const { id, ...rest } = body;
    if (!id)
      return NextResponse.json({ error: "id required" }, { status: 400 });
    const supabase = createSupabaseAdmin();
    const update: Record<string, unknown> = {};
    if (rest.title !== undefined) update.title = rest.title;
    if (rest.type !== undefined) update.type = rest.type;
    if (rest.video_url !== undefined) update.video_url = rest.video_url;
    if (rest.date !== undefined)
      update.date =
        typeof rest.date === "string" ? rest.date : rest.date.toISOString();
    if (rest.summary !== undefined) update.summary = rest.summary;
    const { data, error } = await supabase
      .from("abj_recordings")
      .update(update)
      .eq("id", id)
      .select(
        "id,title,type,video_url,audio_url,date,summary,status,transcript"
      )
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
