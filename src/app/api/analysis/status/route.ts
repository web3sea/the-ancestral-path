import { NextResponse } from "next/server";
import { createSpeechClient } from "@/lib/gcp";
import { handleApiError } from "@/lib/utils";

async function handle(operationName: string) {
  const client = createSpeechClient();
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
    return handleApiError(error);
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
    return handleApiError(error);
  }
}
