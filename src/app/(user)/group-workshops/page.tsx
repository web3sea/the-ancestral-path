import GroupWorkshopsSection from "@/component/business/user/GroupWorkshopsSection";
import DescriptionVisualSection from "@/component/common/DescriptionVisualSection";
import FullWidthImageSection from "@/component/common/FullWidthImageSection";

export default function GroupWorkshopsPage() {
  return (
    <div className="min-h-screen">
      <GroupWorkshopsSection />
      <FullWidthImageSection
        imageUrl="/images/workshops.png"
        altText="Experience the power of collective healing and transformation in our dedicated group workshops"
      />

      <DescriptionVisualSection
        title="FIND PEACE WITHIN"
        description="In the stillness of meditation, you discover the sacred space within where healing begins. Each guided journey is a gentle invitation to explore your inner landscape, release tension, and connect with the divine wisdom that resides in your heart."
        visualPosition="left"
      />
    </div>
  );
}
