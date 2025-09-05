import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

export const runtime = "nodejs";

function normalizePrivateKey(rawKey: string | undefined): string | undefined {
  if (!rawKey) return undefined;
  const trimmed = rawKey.trim();
  if (!trimmed) return undefined;
  const looksLikeBase64 =
    !trimmed.includes("BEGIN PRIVATE KEY") &&
    /^(?:[A-Za-z0-9+/=\r\n]+)$/.test(trimmed);
  if (looksLikeBase64) {
    try {
      const decoded = Buffer.from(trimmed, "base64").toString("utf8");
      if (decoded.includes("BEGIN PRIVATE KEY")) return decoded;
    } catch {}
  }
  return trimmed.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
}

function getStorageClient(): Storage {
  const projectId = process.env.GCP_PROJECT_ID;
  const gcpPrivateKey = normalizePrivateKey(
    process.env.GCP_PRIVATE_KEY || process.env.GCP_PRIVATE_KEY_B64
  );
  const gcpClientEmail = process.env.GCP_CLIENT_EMAIL;

  if (projectId && gcpPrivateKey && gcpClientEmail) {
    return new Storage({
      projectId,
      credentials: {
        client_email: gcpClientEmail,
        private_key: gcpPrivateKey,
      },
    });
  }
  return new Storage({ projectId });
}

export async function POST(request: Request) {
  try {
    const bucketName = process.env.GCS_BUCKET_NAME;
    if (!bucketName) {
      return NextResponse.json(
        { error: "GCS_BUCKET_NAME env is required" },
        { status: 500 }
      );
    }

    const form = await request.formData();
    const file = form.get("file");
    const prefix = (form.get("prefix") as string) || "uploads";
    const providedFilename = (form.get("filename") as string) || undefined;
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "file is required (multipart/form-data)" },
        { status: 400 }
      );
    }

    const storage = getStorageClient();
    const bucket = storage.bucket(bucketName);

    const originalName = providedFilename || file.name || "upload.bin";
    const safeFilename = originalName.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const uniquePrefix = Date.now().toString(36);
    const objectName = `${prefix}/${uniquePrefix}-${safeFilename}`;
    const contentType = file.type || "application/octet-stream";

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await bucket.file(objectName).save(buffer, {
      resumable: false,
      contentType,
      metadata: { contentType },
      validation: false,
    });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${objectName}`;
    return NextResponse.json({ publicUrl, objectName });
  } catch (error: unknown) {
    console.error("Error uploading to GCS", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
