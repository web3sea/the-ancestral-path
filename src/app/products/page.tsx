import ProductDiscountSection from "@/component/business/ProductDiscountSection";
import FullWidthImageSection from "@/component/common/FullWidthImageSection";
import DescriptionVisualSection from "@/component/common/DescriptionVisualSection";

export const metadata = {
  title: "Sacred Collection - Sand Symes",
  description:
    "Transform your spiritual practice with our curated collection of sacred healing tools, crystals, oils, and ritual items. 30% off limited time offer.",
  keywords:
    "sacred healing tools, crystals, essential oils, ritual items, oracle decks, spiritual practice, Sand Symes",
  authors: [{ name: "Sand Symes" }],
  openGraph: {
    title: "Sacred Collection - Sand Symes",
    description:
      "Transform your spiritual practice with our curated collection of sacred healing tools.",
    type: "website",
  },
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      <ProductDiscountSection />

      <FullWidthImageSection
        imageUrl="https://static.wixstatic.com/media/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg/v1/fill/w_1290,h_848,al_c,q_85,enc_avif,quality_auto/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg"
        altText="Transform your spiritual practice with our curated collection of sacred healing tools and ritual items"
      />

      <DescriptionVisualSection
        title="SACRED TOOLS FOR TRANSFORMATION"
        description="Every tool in our collection has been carefully selected to support your spiritual practice and healing journey. From crystals that amplify your intentions to oils that soothe your soul, these sacred items are more than products—they're companions on your path to transformation and awakening."
        visualPosition="right"
      />
    </div>
  );
}
