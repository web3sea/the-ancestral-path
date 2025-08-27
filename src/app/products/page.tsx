import ProductDiscountSection from "@/component/ProductDiscountSection";

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
    </div>
  );
}
