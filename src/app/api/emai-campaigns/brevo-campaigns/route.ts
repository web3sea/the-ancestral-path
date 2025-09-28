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

    const response = await fetch("https://api.brevo.com/v3/emailCampaigns", {
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Brevo campaigns error:", response.status, errorText);
      return new NextResponse(errorText || "Brevo API error", {
        status: response.status,
        headers: {
          "content-type": response.headers.get("content-type") || "text/plain",
        },
      });
    }

    const data = await response.json();

    // Transform data to match frontend format
    const campaigns =
      data.campaigns?.map((campaign: any) => ({
        id: campaign.id.toString(),
        name: campaign.name,
      })) || [];

    return NextResponse.json({ campaigns });
  } catch (error: any) {
    console.error("Error fetching Brevo campaigns:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch Brevo campaigns" },
      { status: 500 }
    );
  }
}
