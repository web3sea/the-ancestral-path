import MeditationsSection from "@/component/MeditationsSection";

export const metadata = {
  title: "Guided Meditations - Sand Symes",
  description:
    "Journey inward with carefully crafted meditations designed to bring peace, healing, and spiritual connection to your daily practice.",
};

export default function MeditationsPage() {
  return (
    <div className="min-h-screen">
      <MeditationsSection />
    </div>
  );
}
