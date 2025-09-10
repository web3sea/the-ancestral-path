import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/nextauth";
import { AuthLayout } from "@/component/layout/AuthLayout";
import { SignIn } from "@/component/common/SignIn";
import { AuthInfoCard, FeatureList } from "@/component/common/AuthComponents";
import Link from "next/link";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const nextValue = typeof params?.next === "string" ? params.next : "";

  // Check if user is already authenticated
  const session = await getServerSession(authOptions);
  if (session) {
    if (session.user.role === "admin") {
      redirect("/admin");
    } else {
      redirect(nextValue || "/");
    }
  }

  return (
    <AuthLayout
      title="Join Our Community"
      subtitle="Begin your transformative wellness journey with personalized guidance, ancient wisdom, and modern practices"
    >
      {/* Welcome Info */}
      <AuthInfoCard
        title="Transform Your Wellness Journey"
        description="Join thousands of individuals who have discovered their path to inner peace and personal growth through our comprehensive platform:"
        variant="success"
      >
        <FeatureList
          features={[
            "Guided breathwork sessions for stress relief and energy",
            "Meditation practices for mindfulness and clarity",
            "Oracle AI guidance for life decisions and insights",
            "Astrological downloads and personalized readings",
            "Mini challenges for personal development",
            "Group workshops and community support",
            "ABJ recordings for deep healing and transformation",
            "Sacred wisdom teachings and ancient practices",
          ]}
        />
      </AuthInfoCard>

      {/* Google OAuth Sign Up */}
      <div className="mb-6">
        <SignIn callbackUrl={nextValue || "/"} />
      </div>

      {/* Footer Links */}
      <div className="text-center space-y-3">
        <p className="text-primary-300/60 text-sm">
          By signing up, you agree to our{" "}
          <Link
            href="/terms"
            className="text-primary-300 hover:text-primary-200 transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-primary-300 hover:text-primary-200 transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="border-t border-primary-300/10 pt-4">
          <p className="text-primary-300/60 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary-300 hover:text-primary-200 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
