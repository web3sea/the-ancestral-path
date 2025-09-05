import { Storage } from "@google-cloud/storage";
import { getGCPCredentials } from "./auth";

/**
 * Creates a Google Cloud Storage client with proper authentication
 */
export function createStorageClient(): Storage {
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