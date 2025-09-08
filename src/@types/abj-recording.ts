export type Recording = {
  id: string;
  type: "Full Moons" | "New Moons";
  title: string;
  video_url: string;
  audio_url?: string;
  date: Date;
  summary?: string;
  status: "published" | "draft" | "processing" | "failed";
  transcript?: string;
};
