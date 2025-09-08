import WisdomDropsSection from "@/component/business/user/WisdomDropsSection";
import FullWidthImageSection from "@/component/common/FullWidthImageSection";
import DescriptionVisualSection from "@/component/common/DescriptionVisualSection";

export const metadata = {
  title: "Wisdom Drops - Sand Symes",
  description:
    "Sacred insights and gentle wisdom for your spiritual journey. Text and image enriched teachings to support your growth and awakening.",
};

export default function WisdomPage() {
  return (
    <div className="min-h-screen">
      <WisdomDropsSection />

      <FullWidthImageSection
        imageUrl="/images/wisdom.png"
        altText="Sacred insights and gentle wisdom for your spiritual journey and awakening"
      />
      <DescriptionVisualSection
        title="WISDOM FOR THE SOUL"
        description="Every word of wisdom is a gentle reminder of your divine nature and the sacred journey you're on. These teachings are not just information—they're invitations to remember who you truly are and to embrace the wisdom that has been passed down through generations of healers and wisdom keepers."
        visualPosition="right"
      />
    </div>
  );
}
