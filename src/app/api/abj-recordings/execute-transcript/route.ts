import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const WEBHOOK_URL =
  process.env.N8N_SUMMARY_WEBHOOK_URL ||
  "https://coraltriangle.app.n8n.cloud/webhook/306fac96-d39d-45cd-83eb-5514bbc78628";

export async function POST(request: Request) {
  const supabase = createSupabaseAdmin();
  try {
    const { id } = (await request.json()) as { id?: string };
    if (!id)
      return NextResponse.json({ error: "id required" }, { status: 400 });

    const { data: rec, error } = await supabase
      .from("abj_recordings")
      .select("id,audio_url,status")
      .eq("id", id)
      .single();
    if (error || !rec) throw error || new Error("Not found");

    const audioUrl: string | null =
      (rec as { audio_url?: string | null }).audio_url ?? null;
    if (!audioUrl)
      return NextResponse.json({ error: "audio_url missing" }, { status: 400 });

    await supabase
      .from("abj_recordings")
      .update({ status: "processing" })
      .eq("id", id);

    const resp = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    return NextResponse.json({ ok: resp.ok, status: resp.status });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to execute transcript";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
