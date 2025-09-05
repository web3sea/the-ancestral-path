import { TranscoderServiceClient } from "@google-cloud/video-transcoder";
import { getGCPCredentials } from "./auth";

/**
 * Creates a Google Cloud Video Transcoder client with proper authentication
 */
export function createTranscoderClient(): TranscoderServiceClient {
  const credentials = getGCPCredentials();
  return new TranscoderServiceClient(credentials);
}