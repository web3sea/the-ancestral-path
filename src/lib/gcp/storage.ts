import { Storage } from "@google-cloud/storage";
import { getGCPCredentials, hasGCPCredentials } from "./auth";

/**
 * Creates a Google Cloud Storage client with proper authentication
 */
export function createStorageClient(): Storage {
  if (!hasGCPCredentials()) {
    throw new Error(
      "GCP credentials not configured. Please set GCP_PROJECT_ID, GCP_CLIENT_EMAIL, and GCP_PRIVATE_KEY environment variables."
    );
  }

  const credentials = getGCPCredentials();
  return new Storage(credentials);
}

/**
 * Gets a bucket instance from Google Cloud Storage
 */
export function getBucket(bucketName: string) {
  const storage = createStorageClient();
  return storage.bucket(bucketName);
}
