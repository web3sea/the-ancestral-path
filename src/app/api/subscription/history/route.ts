import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/nextauth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createSupabaseAdmin();

    // Get user account
    const { data: userData, error: userError } = await supabase
      .from("accounts")
      .select("id")
      .eq("email", session.user.email)
      .is("deleted_at", null)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get subscription history
    const { data: history, error: historyError } = await supabase
      .from("subscription_history")
      .select("*")
      .eq("account_id", userData.id)
      .order("created_at", { ascending: false });

    if (historyError) {
      throw historyError;
    }

    return NextResponse.json({
      success: true,
      history: history || [],
    });
  } catch (error) {
    console.error("Subscription history retrieval error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve subscription history",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
