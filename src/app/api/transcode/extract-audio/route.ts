import { NextResponse } from "next/server";
import { TranscoderServiceClient } from "@google-cloud/video-transcoder";

export const runtime = "nodejs";

type ExtractAudioRequest = {
  objectName?: string;
  gcsUri?: string;
  outputPrefix?: string;
  audioBitrateBps?: number;
};

function normalizePrivateKey(rawKey: string | undefined): string | undefined {
  if (!rawKey) return undefined;
  const trimmed = rawKey.trim();
  if (!trimmed) return undefined;
  return trimmed.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
}

function getTranscoderClient(): TranscoderServiceClient {
  const projectId = process.env.GCP_PROJECT_ID;
  const clientEmail = process.env.GCP_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.GCP_PRIVATE_KEY);

  if (projectId && clientEmail && privateKey) {
    return new TranscoderServiceClient({
      projectId,
      credentials: { client_email: clientEmail, private_key: privateKey },
    });
  }
  return new TranscoderServiceClient();
}

export async function POST(request: Request) {
  try {
    const bucketName = process.env.GCS_BUCKET_NAME;
    if (!bucketName) {
      return NextResponse.json(
        { error: "GCS_BUCKET_NAME env is required" },
        { status: 500 }
      );
    }

    const location = process.env.TRANSCODER_LOCATION || "us-central1";
    const body = (await request.json()) as ExtractAudioRequest;
    const inputUri =
      body.gcsUri ||
      (body.objectName ? `gs://${bucketName}/${body.objectName}` : undefined);
    if (!inputUri) {
      return NextResponse.json(
        { error: "gcsUri or objectName is required" },
        { status: 400 }
      );
    }

    const baseName = inputUri.split("/").pop() || "input";
    const nameWithoutExt = baseName.replace(/\.[^.]+$/, "");
    const uniquePrefix = `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    const outputFolder =
      body.outputPrefix || `audio/${uniquePrefix}-${nameWithoutExt}`;
    const outputUri = `gs://${bucketName}/${outputFolder}/`;
    const audioFileName = `${nameWithoutExt}-${uniquePrefix}.mp3`;

    const client = getTranscoderClient();
    const parent = `projects/${process.env.GCP_PROJECT_ID}/locations/${location}`;

    const audioBitrateBps = body.audioBitrateBps || 128_000;

    const requestPayload = {
      parent,
      job: {
        inputUri,
        outputUri,
        config: {
          elementaryStreams: [
            {
              key: "audio_stream",
              audioStream: {
                codec: "mp3",
                bitrateBps: audioBitrateBps,
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
    };

    const [job] = await client.createJob(requestPayload);

    return NextResponse.json({
      jobName: job.name,
      inputUri,
      outputDir: outputUri,
      audioGcsUri: `${outputUri}${audioFileName}`,
      location,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
