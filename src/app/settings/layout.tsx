import Header from "@/component/layout/user/Header";
import Footer from "@/component/layout/user/Footer";
import SubscriptionGuard from "@/component/provider/SubscriptionGuard";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubscriptionGuard allowNonSubscribed={true}>
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">{children}</div>
        <Footer />
      </main>
    </SubscriptionGuard>
  );
}
