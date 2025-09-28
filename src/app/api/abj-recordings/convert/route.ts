import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { createTranscoderClient } from "@/lib/gcp";

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

    const { data: rec, error: fetchErr } = await supabase
      .from("abj_recordings")
      .select("id,video_url")
      .eq("id", id)
      .single();
    if (fetchErr || !rec) throw fetchErr || new Error("Not found");

    const bucket = process.env.GCS_BUCKET_NAME;
    if (!bucket)
      return NextResponse.json(
        { error: "GCS_BUCKET_NAME missing" },
        { status: 500 }
      );

    const videoUrl: string = rec.video_url as string;
    let gcsInputUri = "";
    try {
      const u = new URL(videoUrl);
      if (
        (u.hostname === "storage.googleapis.com" ||
          u.hostname.endsWith("googleapis.com")) &&
        u.pathname.startsWith(`/${bucket}/`)
      ) {
        const objectName = u.pathname
          .replace(`/${bucket}/`, "")
          .replace(/^\//, "");
        gcsInputUri = `gs://${bucket}/${objectName}`;
      }
    } catch {}
    if (!gcsInputUri && videoUrl.includes(`/${bucket}/`)) {
      const idx = videoUrl.indexOf(`/${bucket}/`);
      const objectName = videoUrl.substring(idx + bucket.length + 2);
      gcsInputUri = `gs://${bucket}/${objectName}`;
    }
    if (!gcsInputUri)
      return NextResponse.json(
        { error: "Cannot derive GCS URI" },
        { status: 400 }
      );

    // Update status -> processing
    await supabase
      .from("abj_recordings")
      .update({ status: "processing" })
      .eq("id", id);

    // Transcode to deterministic mp3 path: gs://bucket/audio/{id}.mp3
    const transcoder = createTranscoderClient();
    const location = process.env.TRANSCODER_LOCATION || "us-central1";
    const parent = `projects/${process.env.GCP_PROJECT_ID}/locations/${location}`;
    const outputDir = `gs://${bucket}/audio/`;
    const audioFileName = `${id}.mp3`;

    const [job] = await transcoder.createJob({
      parent,
      job: {
        inputUri: gcsInputUri,
        outputUri: outputDir,
        config: {
          elementaryStreams: [
            {
              key: "audio_stream",
              audioStream: {
                codec: "mp3",
                languageCode: "en-US",
                bitrateBps: 128_000,
                channelCount: 2,
                sampleRateHertz: 44100,
              },
            },
          ],
          muxStreams: [
            {
              key: "audio_only",
              container: "mp3",
              elementaryStreams: ["audio_stream"],
              fileName: audioFileName,
            },
          ],
        },
      },
    });

    // Poll job until done
    const jobName = job.name as string;
    const maxTranscoderAttempts = 300;
    let attempt = 0;
    while (attempt < maxTranscoderAttempts) {
      attempt += 1;
      const [j] = await transcoder.getJob({ name: jobName });
      const state = (j.state || "").toString().toUpperCase();
      if (state === "SUCCEEDED") break;
      if (state === "FAILED" || state === "CANCELLED")
        throw new Error(`Transcode ${state}`);
      await new Promise((r) => setTimeout(r, 3000));
    }

    // Mark conversion complete, set audio_url (public), reset status so UI can stop spinner
    const publicAudioUrl = `https://storage.googleapis.com/${bucket}/audio/${audioFileName}`;
    await supabase
      .from("abj_recordings")
      .update({ status: "processing", audio_url: publicAudioUrl })
      .eq("id", id);

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch {
      await supabase
        .from("abj_recordings")
        .update({ status: "failed" })
        .eq("id", id);
    }

    return NextResponse.json({
      ok: true,
      audioUri: `gs://${bucket}/audio/${audioFileName}`,
      audioUrl: publicAudioUrl,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to convert";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
