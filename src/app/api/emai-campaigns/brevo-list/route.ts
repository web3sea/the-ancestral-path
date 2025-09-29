import { NextResponse } from "next/server";
import { getAppConfig } from "@/lib/config/env";

export async function GET(request: Request) {
  try {
    const config = getAppConfig();
    const apiKey = config.brevo.apiKey;

    if (!apiKey) {
      return NextResponse.json(
        { error: "BREVO_API_KEY is not set" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.brevo.com/v3/contacts/lists", {
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Brevo lists error:", response.status, errorText);
      return new NextResponse(errorText || "Brevo API error", {
        status: response.status,
        headers: {
          "content-type": response.headers.get("content-type") || "text/plain",
        },
      });
    }

    const data = await response.json();

    // Transform data to match frontend format
    const lists =
      data.lists?.map((list: any) => ({
        id: list.id.toString(),
        name: list.name,
      })) || [];

    return NextResponse.json({ lists });
  } catch (error: any) {
    console.error("Error fetching Brevo lists:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch Brevo lists" },
      { status: 500 }
    );
  }
}
