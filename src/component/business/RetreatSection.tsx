"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function RetreatSection() {
  return (
    <section id="retreats" className="pt-36 pb-24 relative">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://static.wixstatic.com/media/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg/v1/fill/w_1290,h_848,al_c,q_85,enc_avif,quality_auto/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg')`,
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-8 tracking-wide"
            style={{ color: "#d8d2c6" }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            SACRED RETREATS
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed font-light"
            style={{ color: "#d8d2c6", opacity: 0.9 }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            Transform your life through intimate healing journeys in sacred
            spaces. Join Sand for deeply transformative experiences that awaken
            your soul and heal your spirit.
          </motion.p>
        </motion.div>

        {/* Main Retreat Card */}
        <motion.div
          className="container mx-auto mb-20"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.div
            className="bg-black/40 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-primary-300/20"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* Hero Section */}
            <div className="relative h-96 bg-gradient-to-br from-sage/30 via-primary-300/20 to-secondary-400/30">
              <div className="absolute inset-0 bg-black/20"></div>

              {/* Floating Elements */}
              <div className="absolute top-8 left-8 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
              <div className="absolute top-16 right-12 w-2 h-2 bg-white/40 rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-12 left-16 w-3 h-3 bg-white/20 rounded-full animate-pulse delay-700"></div>
              <div className="absolute bottom-8 right-8 w-5 h-5 bg-white/25 rounded-full animate-pulse delay-500"></div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-light mb-3">
                    Sacred Healing Retreat
                  </h2>
                  <p className="text-xl opacity-90 mb-4">
                    Mystical Mountains • Costa Rica
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="bg-primary-300/20 text-primary-300 px-4 py-2 rounded-full text-sm font-medium border border-primary-300/30">
                      March 15-20, 2024
                    </span>
                    <span className="bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-bold border border-gold/30">
                      EARLY ACCESS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <motion.div
              className="p-8 lg:p-12"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 1.0,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column - Retreat Details */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 1.2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <motion.h3
                    className="text-2xl font-light mb-6"
                    style={{ color: "#d8d2c6" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 1.4,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    A 5-Day Journey of Deep Transformation
                  </motion.h3>

                  <motion.p
                    className="mb-8 leading-relaxed"
                    style={{ color: "#d8d2c6", opacity: 0.9 }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 1.6,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    Join Sand for an intimate journey of deep healing and
                    spiritual awakening in the mystical mountains of Costa Rica.
                    This transformative retreat combines breathwork, meditation,
                    sacred ceremony, and the healing power of nature.
                  </motion.p>

                  {/* Retreat Highlights */}
                  <motion.div
                    className="space-y-4 mb-8"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: 1.8,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <motion.h4
                      className="text-lg font-medium mb-4"
                      style={{ color: "#d8d2c6" }}
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.6,
                        delay: 2.0,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    >
                      What&apos;s Included:
                    </motion.h4>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        "Daily breathwork & meditation sessions",
                        "Sacred plant ceremonies (optional)",
                        "Organic farm-to-table meals",
                        "Luxury eco-lodge accommodation",
                        "Small group (max 12 participants)",
                        "Personal guidance from Sand",
                        "Sacred ceremony & rituals",
                        "Nature immersion experiences",
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-3"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            duration: 0.6,
                            delay: 2.2 + index * 0.1,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                        >
                          <motion.div
                            className="w-5 h-5 bg-primary-300/20 rounded-full flex items-center justify-center border border-primary-300/30"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <svg
                              className="w-3 h-3 text-primary-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.div>
                          <span style={{ color: "#d8d2c6", opacity: 0.8 }}>
                            {item}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>

                {/* Right Column - Pricing & Booking */}
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 1.2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {/* Pricing Card */}
                  <motion.div
                    className="bg-primary-300/10 rounded-2xl p-6 mb-8 border border-primary-300/20"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: 1.4,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p
                          className="text-lg font-medium"
                          style={{ color: "#d8d2c6" }}
                        >
                          Early Bird Special
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: "#d8d2c6", opacity: 0.7 }}
                        >
                          5 days • 4 nights
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-sm line-through"
                          style={{ color: "#d8d2c6", opacity: 0.5 }}
                        >
                          $3,497
                        </p>
                        <p className="text-3xl font-light text-primary-300">
                          $2,997
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "#d8d2c6", opacity: 0.6 }}
                        >
                          Save $500
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "#d8d2c6", opacity: 0.8 }}
                    >
                      <svg
                        className="w-4 h-4 text-primary-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      All meals, accommodation & ceremonies included
                    </div>
                  </motion.div>

                  {/* Booking CTA */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 1.6,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <Link
                      href="https://sandsymes.com/retreat-early-access"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full btn-primary py-4 text-center font-medium text-lg transform hover:scale-105 shadow-lg mb-4"
                    >
                      Secure Your Sacred Space
                    </Link>
                  </motion.div>

                  <motion.p
                    className="text-center text-sm"
                    style={{ color: "#d8d2c6", opacity: 0.6 }}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 1.8,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    🔒 Secure booking • Full refund available until 60 days
                    before retreat
                  </motion.p>

                  {/* Limited Availability */}
                  <motion.div
                    className="mt-6 p-4 bg-gold/10 rounded-xl border border-gold/20"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 2.0,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-gold"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <p className="font-medium" style={{ color: "#d8d2c6" }}>
                          Limited Availability
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: "#d8d2c6", opacity: 0.7 }}
                        >
                          Only 12 sacred spaces available
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
