"use client";

import Link from "next/link";
import { CheckCircle, Star, Sparkles, Shield, Zap } from "lucide-react";
import Header from "@/component/layout/user/Header";
import Footer from "@/component/layout/user/Footer";

export default function PricingPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-black via-primary-300/10 to-black pt-20">
        {/* Hero Section */}
        <section className="py-20 px-6 lg:px-8 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-300/5 via-transparent to-primary-300/5"></div>
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary-300/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary-300/10 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-primary-300/10 border border-primary-300/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-primary-300" />
              <span className="text-sm text-primary-300/80">
                Transform Your Life Today
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-light text-primary-300 mb-6 leading-tight">
              Choose Your
              <span className="block bg-gradient-to-r from-primary-300 to-primary-200 bg-clip-text text-transparent">
                Sacred Journey
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-300/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Embark on a transformative wellness experience with our
              comprehensive platform. Discover ancient wisdom, modern healing,
              and personalized guidance.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-primary-300/60 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>5-Star Rated</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-light text-primary-300 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-primary-300/70 max-w-2xl mx-auto">
                Choose the plan that resonates with your journey. No hidden
                fees, no surprises.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Tier 1 */}
              <div className="group p-8 rounded-2xl border border-primary-300/20 bg-gradient-to-br from-black/40 to-gray-900/20 hover:border-primary-300/40 hover:bg-gradient-to-br hover:from-black/60 hover:to-gray-900/40 transition-all duration-500 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-300/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="text-center mb-8 relative z-10">
                  <div className="inline-flex items-center gap-2 bg-primary-300/10 border border-primary-300/20 rounded-full px-3 py-1 mb-4">
                    <span className="text-xs text-primary-300/80 font-medium">
                      FOUNDATION
                    </span>
                  </div>
                  <h3 className="text-3xl font-light text-primary-300 mb-3">
                    Tier 1
                  </h3>
                  <p className="text-primary-300/70 mb-6 text-lg">
                    Perfect for beginners starting their wellness journey
                  </p>
                  <div className="mb-6">
                    <div className="text-5xl font-light text-primary-300 mb-1">
                      $29
                      <span className="text-xl text-primary-300/60 font-normal">
                        /month
                      </span>
                    </div>
                    <p className="text-sm text-primary-300/60">
                      Billed monthly • Cancel anytime
                    </p>
                  </div>
                </div>

                <ul className="space-y-5 mb-10 relative z-10">
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary-300/20 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-primary-300" />
                    </div>
                    <div>
                      <span className="text-primary-300/90 font-medium">
                        Guided Breathwork Sessions
                      </span>
                      <p className="text-sm text-primary-300/60 mt-1">
                        Transform your breathing patterns
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary-300/20 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-primary-300" />
                    </div>
                    <div>
                      <span className="text-primary-300/90 font-medium">
                        Basic Meditations Library
                      </span>
                      <p className="text-sm text-primary-300/60 mt-1">
                        Curated mindfulness practices
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary-300/20 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-primary-300" />
                    </div>
                    <div>
                      <span className="text-primary-300/90 font-medium">
                        Oracle AI Daily Check-ins
                      </span>
                      <p className="text-sm text-primary-300/60 mt-1">
                        Personalized guidance & insights
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary-300/20 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-primary-300" />
                    </div>
                    <div>
                      <span className="text-primary-300/90 font-medium">
                        Wisdom Drops Collection
                      </span>
                      <p className="text-sm text-primary-300/60 mt-1">
                        Ancient teachings & modern wisdom
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary-300/20 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-primary-300" />
                    </div>
                    <div>
                      <span className="text-primary-300/90 font-medium">
                        Progress Tracking
                      </span>
                      <p className="text-sm text-primary-300/60 mt-1">
                        Monitor your growth journey
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Tier 2 */}
              <div className="group p-8 rounded-2xl border-2 border-primary-300 bg-gradient-to-br from-primary-300/10 to-primary-200/5 hover:border-primary-300/80 hover:bg-gradient-to-br hover:from-primary-300/20 hover:to-primary-200/10 transition-all duration-500 relative">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-300/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Popular Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-primary-300 to-primary-200 text-black px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-current" />
                      Most Popular
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8 relative z-10 pt-4">
                  <div className="inline-flex items-center gap-2 bg-primary-300/20 border border-primary-300/30 rounded-full px-3 py-1 mb-4">
                    <Sparkles className="w-3 h-3 text-primary-300" />
                    <span className="text-xs text-primary-300 font-medium">
                      TRANSFORMATION
                    </span>
                  </div>
                  <h3 className="text-3xl font-light text-primary-300 mb-3">
                    Tier 2
                  </h3>
                  <p className="text-primary-300/70 mb-6 text-lg">
                    Complete wellness experience with advanced features
                  </p>
                  <div className="mb-6">
                    <div className="text-5xl font-light text-primary-300 mb-1">
                      $39
                      <span className="text-xl text-primary-300/60 font-normal">
                        /month
                      </span>
                    </div>
                    <p className="text-sm text-primary-300/60">
                      Billed monthly • Cancel anytime
                    </p>
                  </div>
                </div>

                <ul className="space-y-5 mb-10 relative z-10">
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary-300/30 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-primary-300" />
                    </div>
                    <div>
                      <span className="text-primary-300/90 font-medium">
                        Everything in Tier 1
                      </span>
                      <p className="text-sm text-primary-300/60 mt-1">
                        All foundation features included
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary-300/30 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-primary-300" />
                    </div>
                    <div>
                      <span className="text-primary-300/90 font-medium">
                        Advanced Breathwork Rituals
                      </span>
                      <p className="text-sm text-primary-300/60 mt-1">
                        Deep healing & transformation
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary-300/30 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-primary-300" />
                    </div>
                    <div>
                      <span className="text-primary-300/90 font-medium">
                        Personalized Astrological Downloads
                      </span>
                      <p className="text-sm text-primary-300/60 mt-1">
                        Custom cosmic insights
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary-300/30 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-primary-300" />
                    </div>
                    <div>
                      <span className="text-primary-300/90 font-medium">
                        Mini Challenges & Programs
                      </span>
                      <p className="text-sm text-primary-300/60 mt-1">
                        Structured growth experiences
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary-300/30 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-primary-300" />
                    </div>
                    <div>
                      <span className="text-primary-300/90 font-medium">
                        Group Workshops Access
                      </span>
                      <p className="text-sm text-primary-300/60 mt-1">
                        Live community sessions
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary-300/30 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-primary-300" />
                    </div>
                    <div>
                      <span className="text-primary-300/90 font-medium">
                        ABJ Recordings Library
                      </span>
                      <p className="text-sm text-primary-300/60 mt-1">
                        Exclusive audio content
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary-300/30 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-primary-300" />
                    </div>
                    <div>
                      <span className="text-primary-300/90 font-medium">
                        Priority Support
                      </span>
                      <p className="text-sm text-primary-300/60 mt-1">
                        Direct access to our team
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-16 px-6 lg:px-8 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light text-primary-300 text-center mb-12">
              Feature Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-primary-300/20">
                    <th className="text-left py-4 px-6 text-primary-300 font-medium">
                      Features
                    </th>
                    <th className="text-center py-4 px-6 text-primary-300 font-medium">
                      Tier 1
                    </th>
                    <th className="text-center py-4 px-6 text-primary-300 font-medium">
                      Tier 2
                    </th>
                  </tr>
                </thead>
                <tbody className="text-primary-300/80">
                  <tr className="border-b border-primary-300/10">
                    <td className="py-4 px-6">Guided Breathwork Sessions</td>
                    <td className="text-center py-4 px-6">
                      <CheckCircle className="w-5 h-5 text-primary-300 mx-auto" />
                    </td>
                    <td className="text-center py-4 px-6">
                      <CheckCircle className="w-5 h-5 text-primary-300 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-primary-300/10">
                    <td className="py-4 px-6">Basic Meditations</td>
                    <td className="text-center py-4 px-6">
                      <CheckCircle className="w-5 h-5 text-primary-300 mx-auto" />
                    </td>
                    <td className="text-center py-4 px-6">
                      <CheckCircle className="w-5 h-5 text-primary-300 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-primary-300/10">
                    <td className="py-4 px-6">Oracle AI Check-ins</td>
                    <td className="text-center py-4 px-6">
                      <CheckCircle className="w-5 h-5 text-primary-300 mx-auto" />
                    </td>
                    <td className="text-center py-4 px-6">
                      <CheckCircle className="w-5 h-5 text-primary-300 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-primary-300/10">
                    <td className="py-4 px-6">Wisdom Drops</td>
                    <td className="text-center py-4 px-6">
                      <CheckCircle className="w-5 h-5 text-primary-300 mx-auto" />
                    </td>
                    <td className="text-center py-4 px-6">
                      <CheckCircle className="w-5 h-5 text-primary-300 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-primary-300/10">
                    <td className="py-4 px-6">Advanced Breathwork Rituals</td>
                    <td className="text-center py-4 px-6">-</td>
                    <td className="text-center py-4 px-6">
                      <CheckCircle className="w-5 h-5 text-primary-300 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-primary-300/10">
                    <td className="py-4 px-6">Astrological Downloads</td>
                    <td className="text-center py-4 px-6">-</td>
                    <td className="text-center py-4 px-6">
                      <CheckCircle className="w-5 h-5 text-primary-300 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-primary-300/10">
                    <td className="py-4 px-6">Mini Challenges</td>
                    <td className="text-center py-4 px-6">-</td>
                    <td className="text-center py-4 px-6">
                      <CheckCircle className="w-5 h-5 text-primary-300 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-primary-300/10">
                    <td className="py-4 px-6">Group Workshops</td>
                    <td className="text-center py-4 px-6">-</td>
                    <td className="text-center py-4 px-6">
                      <CheckCircle className="w-5 h-5 text-primary-300 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-primary-300/10">
                    <td className="py-4 px-6">ABJ Recordings</td>
                    <td className="text-center py-4 px-6">-</td>
                    <td className="text-center py-4 px-6">
                      <CheckCircle className="w-5 h-5 text-primary-300 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light text-primary-300 text-center mb-12">
              What Our Community Says
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-primary-300/80 mb-4 italic">
                  &quot;This platform has completely transformed my daily
                  routine. The breathwork sessions are incredible and the Oracle
                  AI guidance is so personalized.&quot;
                </p>
                <p className="text-primary-300/60 text-sm">- Sarah M.</p>
              </div>
              <div className="text-center p-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-primary-300/80 mb-4 italic">
                  &quot;The Tier 2 features are worth every penny. The
                  astrological downloads and group workshops have deepened my
                  practice significantly.&quot;
                </p>
                <p className="text-primary-300/60 text-sm">- Michael R.</p>
              </div>
              <div className="text-center p-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-primary-300/80 mb-4 italic">
                  &quot;I started with Tier 1 and upgraded to Tier 2. The
                  progression is perfect and the community is amazing.&quot;
                </p>
                <p className="text-primary-300/60 text-sm">- Emma L.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-6 lg:px-8 bg-black/20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light text-primary-300 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-medium text-primary-300 mb-3">
                  Can I change my subscription tier anytime?
                </h3>
                <p className="text-primary-300/80">
                  Yes! You can upgrade or downgrade your subscription at any
                  time. Changes will be reflected in your next billing cycle.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-primary-300 mb-3">
                  Can I cancel anytime?
                </h3>
                <p className="text-primary-300/80">
                  Absolutely. You can cancel your subscription at any time from
                  your account settings. You&apos;ll continue to have access
                  until the end of your billing period.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-primary-300 mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-primary-300/80">
                  We accept all major credit cards, debit cards, and PayPal. All
                  payments are processed securely through Stripe.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
