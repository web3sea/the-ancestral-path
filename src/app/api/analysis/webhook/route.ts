import { NextResponse } from "next/server";
import { broadcastAnalysis } from "@/lib/notify/analysisBus";
import { handleApiError } from "@/lib/utils";

type AnalysisEvent = {
  type: "stt.complete" | "stt.timeout" | "stt.error" | string;
  operationName?: string;
  gcsUri?: string;
  transcript?: string;
  parts?: string[];
  error?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalysisEvent;
    // Fan out to SSE listeners
    broadcastAnalysis(body);
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
