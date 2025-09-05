import ABJRecordingsSection from "@/component/business/user/ABJRecordingsSection";
import DescriptionVisualSection from "@/component/common/DescriptionVisualSection";
import FullWidthImageSection from "@/component/common/FullWidthImageSection";

export default function ABJRecordingsPage() {
  return (
    <div className="min-h-screen">
      <ABJRecordingsSection />

      <FullWidthImageSection
        imageUrl="/images/abj.png"
        altText="Access the power of guided support from Sand through these sacred recordings"
      />

      <DescriptionVisualSection
        title="FIND PEACE WITHIN"
        description="In the stillness of meditation, you discover the sacred space within where healing begins. Each guided journey is a gentle invitation to explore your inner landscape, release tension, and connect with the divine wisdom that resides in your heart."
        visualPosition="left"
      />
    </div>
  );
}
