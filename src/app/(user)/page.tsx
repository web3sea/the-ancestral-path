"use client";

import SandsTripleE from "@/component/business/user/home/SandsTripleESection";
import TripleEMethodologySection from "@/component/business/user/home/TripleEMethodologySection";
import SandSymesExperienceSection from "@/component/business/user/home/SandSymesExperienceSection";
import StickySection from "@/component/business/user/home/StickySection";
import UniqueApproachSection from "@/component/business/user/home/UniqueApproachSection";
import FullWidthImageSection from "@/component/common/FullWidthImageSection";
import DescriptionVisualSection from "@/component/common/DescriptionVisualSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <SandSymesExperienceSection />
      <StickySection />
      <SandsTripleE />
      <TripleEMethodologySection />
      <UniqueApproachSection />

      <FullWidthImageSection
        imageUrl="https://static.wixstatic.com/media/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg/v1/fill/w_1290,h_848,al_c,q_85,enc_avif,quality_auto/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg"
        altText="Transform your life through sacred healing practices and ancestral wisdom"
      />

      <DescriptionVisualSection
        title="EMBRACE YOUR SACRED PATH"
        description="Every step on your healing journey is guided by ancient wisdom and modern understanding. Through breathwork, meditation, and spiritual practices, you'll discover the profound connection between your body, mind, and soul. This is not just healing—it's a sacred transformation that honors your ancestors and prepares you for the future."
        visualPosition="left"
      />
    </div>
  );
}
