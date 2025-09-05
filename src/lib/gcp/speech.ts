import { v1 as speechV1 } from "@google-cloud/speech";
import { getGCPCredentials } from "./auth";

/**
 * Creates a Google Cloud Speech client with proper authentication
 */
export function createSpeechClient(): speechV1.SpeechClient {
  const credentials = getGCPCredentials();
  return new speechV1.SpeechClient(credentials);
}