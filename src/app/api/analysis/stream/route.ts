import { NextResponse } from "next/server";
import { addAnalysisClient, formatSSE } from "@/lib/notify/analysisBus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  let cleanup: (() => void) | null = null;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;
      const safeEnqueue = (data: string) => {
        if (closed) return;
        try {
          controller.enqueue(formatSSE(data));
        } catch {
          closed = true;
        }
      };

      const unsubscribe = addAnalysisClient(safeEnqueue);
      const keepAlive = setInterval(
        () => safeEnqueue('{"type":"ping"}'),
        25000
      );
      safeEnqueue('{"type":"connected"}');

      cleanup = () => {
        if (closed) return;
        closed = true;
        clearInterval(keepAlive);
        unsubscribe();
      };
    },
    cancel() {
      if (cleanup) cleanup();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
