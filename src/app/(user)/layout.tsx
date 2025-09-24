import Header from "@/component/layout/user/Header";
import Footer from "@/component/layout/user/Footer";
import { AuthGuard } from "@/component/provider/AuthGuard";
import { Role } from "@/@types/enum";
import SubscriptionGuard from "@/component/provider/SubscriptionGuard";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={[Role.USER]}>
      <SubscriptionGuard allowNonSubscribed={true}>
        <main className="min-h-screen">
          <Header />
          {children}
          <Footer />
        </main>
      </SubscriptionGuard>
    </AuthGuard>
  );
}
