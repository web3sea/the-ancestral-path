import { NextResponse } from "next/server";
import { createStorageClient } from "@/lib/gcp";
import { handleApiError } from "@/lib/utils";

type StartResumableRequest = {
  filename: string;
  contentType?: string;
  prefix?: string;
};

export async function POST(request: Request) {
  try {
    const bucketName = process.env.GCS_BUCKET_NAME;
    if (!bucketName) {
      return NextResponse.json(
        { error: "GCS_BUCKET_NAME env is required" },
        { status: 500 }
      );
    }

    const body = (await request.json()) as StartResumableRequest;
    if (!body?.filename) {
      return NextResponse.json(
        { error: "filename is required" },
        { status: 400 }
      );
    }

    const storage = createStorageClient();
    const bucket = storage.bucket(bucketName);

    const originalName = body.filename;
    const safeFilename = originalName.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const uniquePrefix = `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    const objectName = `${
      body.prefix ?? "uploads"
    }/${uniquePrefix}-${safeFilename}`;

    const file = bucket.file(objectName);
    const requestOrigin = request.headers.get("origin") || undefined;
    const [sessionUrl] = await file.createResumableUpload({
      origin: requestOrigin,
      metadata: {
        contentType: body.contentType || "application/octet-stream",
      },
    });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${objectName}`;
    return NextResponse.json({ sessionUrl, publicUrl, objectName });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
