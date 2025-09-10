import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { SignIn } from "@/component/common/SignIn";
import { AuthLayout } from "@/component/layout/AuthLayout";
import { AuthError, AuthInfoCard } from "@/component/common/AuthComponents";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const nextValue = typeof params?.next === "string" ? params.next : "";
  const hasAdminError = params?.error === "admin_access_required";

  // Check if user is already authenticated
  const session = await getServerSession(authOptions);
  if (session) {
    // Redirect admin users to /admin, others to their intended destination or home
    if (session.user.role === "admin") {
      redirect("/admin");
    } else {
      redirect(nextValue || "/");
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your wellness journey with personalized guidance and transformative experiences"
    >
      {/* Error Messages */}
      {hasAdminError && (
        <AuthError message="Admin access required. Only administrators can access this area." />
      )}

      {/* Welcome Info */}
      <AuthInfoCard
        title="Welcome Back"
        description="Sign in to continue your wellness journey with personalized guidance and transformative experiences:"
        variant="success"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary-300 rounded-full"></div>
            <span className="text-primary-300/80 text-sm">
              Access guided breathwork sessions
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary-300 rounded-full"></div>
            <span className="text-primary-300/80 text-sm">
              Explore meditation practices
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary-300 rounded-full"></div>
            <span className="text-primary-300/80 text-sm">
              Get oracle AI guidance
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary-300 rounded-full"></div>
            <span className="text-primary-300/80 text-sm">
              Join group workshops
            </span>
          </div>
        </div>
      </AuthInfoCard>

      {/* Google OAuth Sign In */}
      <div className="mb-6">
        <SignIn callbackUrl={nextValue || "/"} />
      </div>

      {/* Footer Links */}
      <div className="text-center space-y-3">
        <p className="text-primary-300/60 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary-300 hover:text-primary-200 transition-colors"
          >
            Create one here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
