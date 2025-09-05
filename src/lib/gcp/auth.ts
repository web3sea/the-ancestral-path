/**
 * Google Cloud Platform authentication utilities
 */

/**
 * Normalizes a private key from environment variables
 * Handles both base64 encoded and raw private key formats
 */
export function normalizePrivateKey(rawKey: string | undefined): string | undefined {
  if (!rawKey) return undefined;
  
  const trimmed = rawKey.trim();
  if (!trimmed) return undefined;
  
  // Check if it looks like base64 encoded key
  const looksLikeBase64 =
    !trimmed.includes("BEGIN PRIVATE KEY") &&
    /^(?:[A-Za-z0-9+/=\r\n]+)$/.test(trimmed);
    
  if (looksLikeBase64) {
    try {
      const decoded = Buffer.from(trimmed, "base64").toString("utf8");
      if (decoded.includes("BEGIN PRIVATE KEY")) return decoded;
    } catch {
      // Fall through to regular processing
    }
  }
  
  // Replace escaped newlines with actual newlines
  return trimmed.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
}

/**
 * Creates GCP credentials object from environment variables
 */
export function getGCPCredentials() {
  const projectId = process.env.GCP_PROJECT_ID;
  const clientEmail = process.env.GCP_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.GCP_PRIVATE_KEY);

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing required GCP credentials in environment variables");
  }

  return {
    projectId,
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
  };
}