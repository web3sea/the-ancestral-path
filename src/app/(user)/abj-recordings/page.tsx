import ABJRecordingsLanding from "@/component/business/user/abj-recordings/ABJRecordingsLanding";
import DescriptionVisualSection from "@/component/common/DescriptionVisualSection";
import FullWidthImageSection from "@/component/common/FullWidthImageSection";
import { SubscriptionRequired } from "@/component/common/SubscriptionRequired";

export default function ABJRecordingsPage() {
  return (
    <SubscriptionRequired>
      <div
        className="min-h-screen bg-black/70"
        style={{
          backgroundImage: `url('https://static.wixstatic.com/media/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg/v1/fill/w_1290,h_848,al_c,q_85,enc_avif,quality_auto/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundBlendMode: "overlay",
        }}
      >
        <FullWidthImageSection
          imageUrl="/images/abj.png"
          altText="Access the power of guided support from Sand through these sacred recordings"
        />

        <ABJRecordingsLanding />

        <DescriptionVisualSection
          title="FIND PEACE WITHIN"
          description="In the stillness of meditation, you discover the sacred space within where healing begins. Each guided journey is a gentle invitation to explore your inner landscape, release tension, and connect with the divine wisdom that resides in your heart."
          visualPosition="left"
        />
      </div>
    </SubscriptionRequired>
  );
}
