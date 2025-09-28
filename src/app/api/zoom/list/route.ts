import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = createSupabaseAdmin();

    const { data: attendance, error: attendanceError } = await supabase
      .from("zoom_attendance")
      .select("*");

    const { data: joinHistories, error: joinHistoriesError } = await supabase
      .from("zoom_join_histories")
      .select("*");

    if (attendanceError || joinHistoriesError) {
      throw attendanceError || joinHistoriesError;
    }

    // Create a map of attendance by participant_user_id for O(1) lookup
    const attendanceMap = new Map();
    attendance.forEach((att) => {
      attendanceMap.set(att.participant_user_id, att);
    });

    // Merge joinHistories with matching attendance
    const data = joinHistories.map((join) => {
      const matchingAttendance = attendanceMap.get(join.zoom_user_id);
      return {
        ...join,
        attendance: matchingAttendance || null, // or omit if not found
      };
    });

    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to list";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}