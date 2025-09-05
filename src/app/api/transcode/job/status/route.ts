import { NextResponse } from "next/server";
import { TranscoderServiceClient } from "@google-cloud/video-transcoder";

export const runtime = "nodejs";

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const client = getTranscoderClient();
    const [job] = await client.getJob({ name });
    return NextResponse.json(job);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
