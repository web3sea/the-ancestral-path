import { NextResponse } from "next/server";
import { createStorageClient } from "@/lib/gcp";
import { handleApiError } from "@/lib/utils";

export const runtime = "nodejs";

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

    const storage = createStorageClient();
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
    return handleApiError(error);
  }
}
