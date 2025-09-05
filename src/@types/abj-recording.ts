export type Recording = {
  id: string;
  type: "Full Moons" | "New Moons";
  title: string;
  videoUrl: string;
  date: string;
  summary?: string;
  status: "published" | "draft" | "processing";
};
