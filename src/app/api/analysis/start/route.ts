import { NextResponse } from "next/server";
import { createSpeechClient } from "@/lib/gcp";
import { handleApiError } from "@/lib/utils";

export const runtime = "nodejs";

type StartAnalysisRequest = {
  objectName?: string;
  gcsUri?: string;
  languageCode?: string;
};

export async function POST(request: Request) {
  try {
    const bucketName = process.env.GCS_BUCKET_NAME;
    if (!bucketName) {
      return NextResponse.json(
        { error: "GCS_BUCKET_NAME env is required" },
        { status: 500 }
      );
    }

    const body = (await request.json()) as StartAnalysisRequest;
    if (!body?.objectName && !body?.gcsUri) {
      return NextResponse.json(
        { error: "objectName or gcsUri is required" },
        { status: 400 }
      );
    }

    const gcsUri = body.gcsUri || `gs://${bucketName}/${body.objectName}`;
    const languageCode = body.languageCode || "en-US";

    const client = createSpeechClient();

    // Set encoding based on file extension to avoid INVALID_ARGUMENT
    type KnownEncoding = "WEBM_OPUS" | "OGG_OPUS" | "FLAC" | "LINEAR16" | "MP3";
    const lower = gcsUri.toLowerCase();
    let encoding: KnownEncoding | undefined;
    if (lower.endsWith(".webm")) encoding = "WEBM_OPUS";
    else if (lower.endsWith(".ogg") || lower.endsWith(".opus"))
      encoding = "OGG_OPUS";
    else if (lower.endsWith(".flac")) encoding = "FLAC";
    else if (lower.endsWith(".wav")) encoding = "LINEAR16";
    else if (lower.endsWith(".mp3")) encoding = "MP3";

    const requestPayload = {
      audio: { uri: gcsUri },
      config: {
        languageCode,
        enableAutomaticPunctuation: true,
        enableWordTimeOffsets: false,
        ...(encoding ? { encoding } : {}),
      },
    } as Parameters<speechV1.SpeechClient["longRunningRecognize"]>[0];

    const [operation] = await client.longRunningRecognize(requestPayload);
    // Return operation name; caller can poll with operations API or implement a status endpoint later
    return NextResponse.json({ operationName: operation.name, gcsUri });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
