// Simple in-memory SSE broadcast bus for analysis events

const encoder = new TextEncoder();

type SendFn = (data: string) => void;

// Keep in global scope to survive hot-reloads in dev
const globalAny = globalThis as unknown as {
  __analysisClients?: Set<SendFn>;
};

if (!globalAny.__analysisClients) {
  globalAny.__analysisClients = new Set<SendFn>();
}

const clients = globalAny.__analysisClients;

export function addAnalysisClient(send: SendFn) {
  clients.add(send);
  return () => clients.delete(send);
}

export function broadcastAnalysis(data: unknown) {
  const payload = typeof data === "string" ? data : JSON.stringify(data);
  for (const send of clients) {
    try {
      send(payload);
    } catch {
      // remove broken client to prevent repeated errors
      clients.delete(send);
    }
  }
}

export function formatSSE(data: string) {
  return encoder.encode(`data: ${data}\n\n`);
}
