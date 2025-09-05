import { createSupabaseClient, TABLES } from "./client";

export type RecordingRow = {
  id: string;
  title: string;
  type: "Full Moons" | "New Moons";
  videoUrl: string;
  date: Date;
  summary?: string | null;
  transcript?: string | null;
  status: "published" | "draft" | "processing";
};

export type RecordingInsert = Omit<RecordingRow, "id">;
export type RecordingUpdate = Partial<Omit<RecordingRow, "id">> & {
  id: string;
};

export async function fetchRecordings(): Promise<RecordingRow[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from(TABLES.ABJ_RECORDINGS)
    .select("id,title,type,video_url,date,summary,transcript,status")
    .order("date", { ascending: false });
  if (error) throw error;
  const rows = (data || []) as unknown as Array<{
    id: string;
    title: string;
    type: "Full Moons" | "New Moons";
    video_url: string;
    date: string;
    summary?: string | null;
    transcript?: string | null;
    status: "published" | "draft" | "processing";
  }>;
  return rows.map((r) => ({
    ...r,
    date: new Date(r.date),
    videoUrl: r.video_url,
  }));
}

export async function createRecording(
  values: RecordingInsert
): Promise<RecordingRow> {
  const supabase = createSupabaseClient();
  const payload = {
    title: values.title,
    type: values.type,
    video_url: values.videoUrl,
    date: values.date.toISOString(),
    summary: values.summary ?? null,
    status: values.status,
    transcript: values.transcript ?? null,
  };
  const { data, error } = await supabase
    .from(TABLES.ABJ_RECORDINGS)
    .insert(payload)
    .select("id,title,type,video_url:videoUrl,date,summary,transcript,status")
    .single();
  if (error) throw error;
  const row = data as unknown as {
    id: string;
    title: string;
    type: RecordingRow["type"];
    videoUrl: string;
    date: string;
    summary?: string | null;
    transcript?: string | null;
    status: RecordingRow["status"];
  };
  return { ...row, date: new Date(row.date) } as RecordingRow;
}

export async function updateRecording(
  values: RecordingUpdate
): Promise<RecordingRow> {
  const supabase = createSupabaseClient();
  const { id, ...rest } = values;
  const payload: Record<string, unknown> = {};
  if (rest.title !== undefined) payload.title = rest.title;
  if (rest.type !== undefined) payload.type = rest.type;
  if (rest.videoUrl !== undefined) payload.video_url = rest.videoUrl;
  if (rest.date !== undefined) payload.date = rest.date.toISOString();
  if (rest.summary !== undefined) payload.summary = rest.summary ?? null;
  if (rest.status !== undefined) payload.status = rest.status;
  if (rest.transcript !== undefined)
    payload.transcript = rest.transcript ?? null;
  const { data, error } = await supabase
    .from(TABLES.ABJ_RECORDINGS)
    .update(payload)
    .eq("id", id)
    .select("id,title,type,video_url:videoUrl,date,summary,transcript,status")
    .single();
  if (error) throw error;
  const row = data as unknown as {
    id: string;
    title: string;
    type: RecordingRow["type"];
    videoUrl: string;
    date: string;
    summary?: string | null;
    transcript?: string | null;
    status: RecordingRow["status"];
  };
  return { ...row, date: new Date(row.date) } as RecordingRow;
}

export async function deleteRecording(id: string): Promise<void> {
  const supabase = createSupabaseClient();
  const { error } = await supabase
    .from(TABLES.ABJ_RECORDINGS)
    .delete()
    .eq("id", id);
  if (error) throw error;
}
