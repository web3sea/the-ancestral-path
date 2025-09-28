"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, Users, Sparkles, Shield, ArrowRight } from "lucide-react";
import Header from "@/component/layout/user/Header";
import Footer from "@/component/layout/user/Footer";
import { NotificationProvider } from "@/component/provider/NotificationProvider";
import { NotificationToast } from "@/component/common/NotificationToast";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Sacred Healing",
      description:
        "We honor the ancient wisdom of breathwork and meditation, creating sacred spaces for deep transformation and healing.",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "Building a supportive community where women can connect, share experiences, and grow together on their wellness journey.",
    },
    {
      icon: Sparkles,
      title: "Personalized Guidance",
      description:
        "Our Oracle AI provides personalized insights and guidance, adapting to your unique needs and spiritual path.",
    },
    {
      icon: Shield,
      title: "Safe Spaces",
      description:
        "Creating secure, judgment-free environments where you can explore your inner world and embrace your authentic self.",
    },
  ];

  const team = [
    {
      name: "Sand Symes",
      role: "Founder & Spiritual Guide",
      image: "/images/sandsymes-1.png",
      bio: "Sand is a transformational breathwork facilitator and spiritual guide who helps women connect with their ancestral wisdom and create profound life changes through sacred practices.",
    },
    {
      name: "The Ancestors",
      role: "Wisdom Keepers",
      image: "/images/the-ancestors.png",
      bio: "Our connection to ancestral wisdom guides every aspect of our work, ensuring that ancient knowledge is preserved and shared with modern seekers.",
    },
    {
      name: "The Moon",
      role: "Cosmic Guide",
      image: "/images/the-moon.png",
      bio: "Lunar wisdom influences our practices, helping us align with natural cycles and harness the power of cosmic energy for healing and transformation.",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Foundation",
      description:
        "Sand Symes began her journey of creating sacred healing spaces for women seeking transformation.",
    },
    {
      year: "2022",
      title: "Community Growth",
      description:
        "Launched breathwork programs and built a thriving community of women on their healing journeys.",
    },
    {
      year: "2024",
      title: "Digital Platform",
      description:
        "Introduced the AO Platform, bringing ancient wisdom to the digital age with personalized AI guidance.",
    },
    {
      year: "2025",
      title: "Expansion",
      description:
        "Continuing to expand our offerings with retreats, workshops, and deeper spiritual practices.",
    },
  ];

  return (
    <NotificationProvider>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-black via-primary-300/10 to-black pt-20">
        {/* Hero Section */}
        <section className="py-20 px-6 lg:px-8 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-300/5 via-transparent to-primary-300/5"></div>
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary-300/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary-300/10 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary-300/10 border border-primary-300/20 rounded-full px-4 py-2 mb-8">
                <Heart className="w-4 h-4 text-primary-300" />
                <span className="text-sm text-primary-300/80">
                  Our Sacred Mission
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-light text-primary-300 mb-6 leading-tight">
                About
                <span className="block bg-gradient-to-r from-primary-300 to-primary-200 bg-clip-text text-transparent">
                  Sand Symes
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-300/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                We are dedicated to creating sacred spaces for women to heal,
                transform, and connect with their deepest wisdom through ancient
                practices and modern guidance.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-light text-primary-300 mb-8">
                  Our Sacred Mission
                </h2>
                <div className="space-y-6 text-lg text-primary-300/80 leading-relaxed">
                  <p>
                    At Sand Symes, we believe that every woman carries within
                    her the power to heal, transform, and create profound change
                    in her life. Our mission is to provide sacred spaces where
                    this transformation can unfold naturally and powerfully.
                  </p>
                  <p>
                    Through breathwork, meditation, ancestral wisdom, and
                    personalized guidance, we help women connect with their
                    inner strength, release generational patterns, and step into
                    their authentic power.
                  </p>
                  <p>
                    We honor the ancient traditions while embracing modern
                    technology, creating a bridge between timeless wisdom and
                    contemporary life. Every practice, every session, every
                    moment of guidance is infused with intention, love, and deep
                    respect for your journey.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="rounded-2xl overflow-hidden">
                  <Image
                    src="/images/sandsymes-2.png"
                    alt="Sand Symes - Sacred Healing"
                    width={600}
                    height={600}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-6 lg:px-8 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-light text-primary-300 mb-6">
                Our Core Values
              </h2>
              <p className="text-xl text-primary-300/80 max-w-3xl mx-auto">
                These principles guide everything we do and every interaction we
                have with our community.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-6 rounded-xl border border-primary-300/20 bg-gradient-to-br from-black/40 to-gray-900/20 hover:border-primary-300/40 hover:bg-gradient-to-br hover:from-black/60 hover:to-gray-900/40 transition-all duration-500"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-300/20 flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-primary-300" />
                  </div>
                  <h3 className="text-xl font-medium text-primary-300 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-primary-300/70 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <p className="text-xl text-primary-300/80 max-w-3xl mx-auto">
                The wisdom keepers and guides who make this sacred work
                possible.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-12">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="relative mb-8">
                    <div className="aspect-square rounded-2xl overflow-hidden mx-auto w-64">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={256}
                        height={256}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                  </div>
                  <h3 className="text-2xl font-medium text-primary-300 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary-300/70 mb-4 font-medium">
                    {member.role}
                  </p>
                  <p className="text-primary-300/80 leading-relaxed">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Journey Timeline */}
        <section className="py-20 px-6 lg:px-8 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-light text-primary-300 mb-6">
                Our Sacred Journey
              </h2>
              <p className="text-xl text-primary-300/80 max-w-3xl mx-auto">
                A timeline of our growth and evolution in service of
                women&apos;s healing and transformation.
              </p>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-300/20 via-primary-300/40 to-primary-300/20"></div>

              <div className="space-y-16">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`flex items-center ${
                      index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`w-1/2 ${
                        index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
                      }`}
                    >
                      <div className="bg-gradient-to-br from-black/40 to-gray-900/20 border border-primary-300/20 rounded-xl p-6 hover:border-primary-300/40 transition-all duration-500">
                        <div className="inline-flex items-center gap-2 bg-primary-300/10 border border-primary-300/20 rounded-full px-3 py-1 mb-4">
                          <span className="text-sm text-primary-300/80 font-medium">
                            {milestone.year}
                          </span>
                        </div>
                        <h3 className="text-xl font-medium text-primary-300 mb-3">
                          {milestone.title}
                        </h3>
                        <p className="text-primary-300/80 leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    {/* Timeline dot */}
                    <div className="w-4 h-4 bg-primary-300 rounded-full border-4 border-black relative z-10"></div>

                    <div className="w-1/2"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-light text-primary-300 mb-8">
                Ready to Begin Your Sacred Journey?
              </h2>
              <p className="text-xl text-primary-300/80 mb-12 leading-relaxed">
                Join our community of women who are transforming their lives
                through sacred practices, ancestral wisdom, and personalized
                guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing" className="btn-primary">
                  <span className="flex items-center gap-2">
                    Explore Our Offerings
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Link>
                <Link href="/login" className="btn-secondary">
                  <span>Join Our Community</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
      <NotificationToast />
    </NotificationProvider>
  );
}
