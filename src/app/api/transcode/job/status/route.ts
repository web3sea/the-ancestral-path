import { NextResponse } from "next/server";
import { createTranscoderClient } from "@/lib/gcp";
import { handleApiError } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const client = createTranscoderClient();
    const [job] = await client.getJob({ name });
    return NextResponse.json(job);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
