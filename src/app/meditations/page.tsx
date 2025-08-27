import MeditationsSection from "@/component/business/MeditationsSection";
import FullWidthImageSection from "@/component/common/FullWidthImageSection";
import DescriptionVisualSection from "@/component/common/DescriptionVisualSection";

export const metadata = {
  title: "Guided Meditations - Sand Symes",
  description:
    "Journey inward with carefully crafted meditations designed to bring peace, healing, and spiritual connection to your daily practice.",
};

export default function MeditationsPage() {
  return (
    <div className="min-h-screen">
      <MeditationsSection />

      <FullWidthImageSection
        imageUrl="/images/meditations.png"
        altText="Journey inward with guided meditations designed to bring peace and spiritual connection"
      />

      <DescriptionVisualSection
        title="FIND PEACE WITHIN"
        description="In the stillness of meditation, you discover the sacred space within where healing begins. Each guided journey is a gentle invitation to explore your inner landscape, release tension, and connect with the divine wisdom that resides in your heart."
        visualPosition="left"
      />
    </div>
  );
}
