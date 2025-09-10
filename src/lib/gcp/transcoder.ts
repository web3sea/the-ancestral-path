import { TranscoderServiceClient } from "@google-cloud/video-transcoder";
import { getGCPCredentials, hasGCPCredentials } from "./auth";

/**
 * Creates a Google Cloud Video Transcoder client with proper authentication
 */
export function createTranscoderClient(): TranscoderServiceClient {
  if (!hasGCPCredentials()) {
    throw new Error(
      "GCP credentials not configured. Please set GCP_PROJECT_ID, GCP_CLIENT_EMAIL, and GCP_PRIVATE_KEY environment variables."
    );
  }

  const credentials = getGCPCredentials();
  return new TranscoderServiceClient(credentials);
}
