import RetreatSection from "../../component/RetreatSection";

export const metadata = {
  title: "Sacred Retreats - Sand Symes",
  description:
    "Transform your life through intimate healing journeys in sacred spaces. Join Sand for deeply transformative experiences that awaken your soul and heal your spirit.",
  keywords:
    "healing retreats, spiritual awakening, breathwork, meditation, Costa Rica, sacred ceremony, Sand Symes",
  authors: [{ name: "Sand Symes" }],
  openGraph: {
    title: "Sacred Retreats - Sand Symes",
    description:
      "Transform your life through intimate healing journeys in sacred spaces.",
    type: "website",
  },
};

export default function RetreatsPage() {
  return (
    <div className="min-h-screen">
      <RetreatSection />
    </div>
  );
}
