import { NextResponse } from "next/server";
import { v1 as speechV1 } from "@google-cloud/speech";

export const runtime = "nodejs";

function normalizePrivateKey(rawKey: string | undefined): string | undefined {
  if (!rawKey) return undefined;
  const trimmed = rawKey.trim();
  if (!trimmed) return undefined;
  return trimmed.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
}

function getSpeechClient(): speechV1.SpeechClient {
  const projectId = process.env.GCP_PROJECT_ID;
  const clientEmail = process.env.GCP_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.GCP_PRIVATE_KEY);

  if (projectId && clientEmail && privateKey) {
    return new speechV1.SpeechClient({
      projectId,
      credentials: { client_email: clientEmail, private_key: privateKey },
    });
  }
  return new speechV1.SpeechClient();
}

async function handle(operationName: string) {
  const client = getSpeechClient();
  const op = await client.checkLongRunningRecognizeProgress(operationName);
  const done = !!op.done;

  if (!done) {
    return NextResponse.json({ done: false, operationName });
  }

  const resultUnknown = (op as unknown as { result?: unknown }).result;
  const resultsArr = (resultUnknown as unknown as { results?: Array<unknown> })
    ?.results as Array<unknown> | undefined;
  const pieces: string[] = [];
  if (Array.isArray(resultsArr)) {
    for (const r of resultsArr) {
      const alt = (
        r as unknown as { alternatives?: Array<{ transcript: string }> }
      )?.alternatives?.[0]?.transcript;
      if (typeof alt === "string" && alt.length > 0) pieces.push(alt);
    }
  }
  const transcript = pieces.join(" ").trim();
  return NextResponse.json({
    done: true,
    operationName,
    transcript,
    parts: pieces,
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const operationName = searchParams.get("operationName");
    if (!operationName) {
      return NextResponse.json(
        { error: "operationName is required" },
        { status: 400 }
      );
    }
    return await handle(operationName);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { operationName?: string };
    if (!body?.operationName) {
      return NextResponse.json(
        { error: "operationName is required" },
        { status: 400 }
      );
    }
    return await handle(body.operationName);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
