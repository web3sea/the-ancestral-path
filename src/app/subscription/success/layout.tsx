import Header from "@/component/layout/user/Header";
import Footer from "@/component/layout/user/Footer";
import { AuthGuard } from "@/component/provider/AuthGuard";
import { SubscriptionGuard } from "@/component/provider/SubscriptionGuard";
import { Role } from "@/@types/enum";

export default async function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={[Role.USER]}>
      <SubscriptionGuard>
        <main className="min-h-screen">
          <Header />
          {children}
          <Footer />
        </main>
      </SubscriptionGuard>
    </AuthGuard>
  );
}
