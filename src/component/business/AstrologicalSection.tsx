"use client";

import { motion } from "framer-motion";

export default function AstrologicalSection() {
  return (
    <section id="astrology" className="pt-36 pb-24 relative">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://static.wixstatic.com/media/7f8caa_478cf5b6686c4e25bf57fe49de8f8a45~mv2.png/v1/fill/w_1905,h_1174,al_c,q_95,usm_0.66_1.00_0.01,enc_avif,quality_auto/7f8caa_478cf5b6686c4e25bf57fe49de8f8a45~mv2.png')`,
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 mx-auto px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <motion.h2
              className="text-4xl lg:text-5xl font-light mb-6 tracking-wide"
              style={{ color: "#d8d2c6" }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              ASTROLOGICAL ANCESTRAL DOWNLOAD
            </motion.h2>
            <motion.p
              className="text-lg max-w-2xl mx-auto leading-relaxed font-light"
              style={{ color: "#d8d2c6", opacity: 0.9 }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              Unlock the cosmic wisdom encoded in your DNA and discover the
              sacred gifts passed down through your ancestral lineage.
            </motion.p>
          </motion.div>

          {/* Main content card */}
          <motion.div
            className="bg-black/40 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-primary-300/20"
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* Hero image section */}
            <div className="relative h-80 bg-gradient-to-br from-secondary-400 via-primary-500 to-secondary-600">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  {/* Mystical symbol */}
                  <div className="w-24 h-24 mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-white/20 rounded-full backdrop-blur-sm"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-16 h-16"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                        <path
                          d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                          opacity="0.5"
                          transform="rotate(45 12 12)"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    Cosmic Inheritance
                  </h3>
                  <p className="text-lg opacity-90">
                    Your Stars • Your Story • Your Sacred Path
                  </p>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute top-8 left-8 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
              <div className="absolute top-16 right-12 w-2 h-2 bg-white/40 rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-12 left-16 w-3 h-3 bg-white/20 rounded-full animate-pulse delay-700"></div>
              <div className="absolute bottom-8 right-8 w-5 h-5 bg-white/25 rounded-full animate-pulse delay-500"></div>
            </div>

            {/* Content */}
            <div className="p-8 sm:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Text content */}
                <div>
                  <h3
                    className="text-2xl font-bold mb-6"
                    style={{ color: "#d8d2c6" }}
                  >
                    Discover Your Celestial Blueprint
                  </h3>

                  <div
                    className="prose prose-lg mb-8"
                    style={{ color: "#d8d2c6", opacity: 0.9 }}
                  >
                    <p className="mb-4">
                      Your birth chart is more than a map of planetary
                      positions—it&apos;s a sacred download of the cosmic wisdom
                      your ancestors have been preparing for lifetimes. Each
                      star, each placement, each aspect carries the encoded
                      gifts and lessons of your lineage.
                    </p>

                    <p className="mb-4">
                      Through this profound astrological exploration,
                      you&apos;ll uncover the hidden patterns that have shaped
                      your family&apos;s spiritual journey and understand how
                      these celestial influences continue to guide your path
                      today.
                    </p>

                    <p>
                      This isn&apos;t just astrology—it&apos;s ancestral
                      alchemy. It&apos;s the sacred science of understanding how
                      the cosmos and your DNA dance together to create your
                      unique soul signature.
                    </p>
                  </div>

                  {/* Features list */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-3 h-3 text-secondary-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4
                          className="font-semibold"
                          style={{ color: "#d8d2c6" }}
                        >
                          Ancestral Pattern Recognition
                        </h4>
                        <p style={{ color: "#d8d2c6", opacity: 0.8 }}>
                          Identify inherited gifts and challenges flowing
                          through your bloodline
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-3 h-3 text-secondary-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4
                          className="font-semibold"
                          style={{ color: "#d8d2c6" }}
                        >
                          Cosmic DNA Activation
                        </h4>
                        <p style={{ color: "#d8d2c6", opacity: 0.8 }}>
                          Unlock dormant potentials written in your celestial
                          code
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-3 h-3 text-secondary-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4
                          className="font-semibold"
                          style={{ color: "#d8d2c6" }}
                        >
                          Sacred Timing Guidance
                        </h4>
                        <p style={{ color: "#d8d2c6", opacity: 0.8 }}>
                          Understand the perfect cosmic moments for
                          transformation
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-3 h-3 text-secondary-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4
                          className="font-semibold"
                          style={{ color: "#d8d2c6" }}
                        >
                          Healing Ancestral Wounds
                        </h4>
                        <p style={{ color: "#d8d2c6", opacity: 0.8 }}>
                          Transform generational patterns through cosmic
                          understanding
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA button */}
                  <button className="btn-primary px-8 py-4 font-semibold text-lg hover:shadow-lg transform hover:scale-105">
                    Access Your Download
                  </button>
                </div>

                {/* Visual element */}
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-secondary-100 to-primary-100 rounded-3xl p-8 relative overflow-hidden">
                    {/* Astrological chart representation */}
                    <div className="absolute inset-8 border-2 border-secondary-300 rounded-full opacity-60"></div>
                    <div className="absolute inset-12 border border-primary-300 rounded-full opacity-40"></div>
                    <div className="absolute inset-16 border border-secondary-200 rounded-full opacity-30"></div>

                    {/* Center symbol */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-primary-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                        </svg>
                      </div>
                    </div>

                    {/* Zodiac symbols around the circle */}
                    <div className="absolute inset-0">
                      {/* These would be positioned at zodiac points */}
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-secondary-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-secondary-700">
                          ♈
                        </span>
                      </div>
                      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-6 h-6 bg-primary-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-700">
                          ♋
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-secondary-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-secondary-700">
                          ♎
                        </span>
                      </div>
                      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-6 h-6 bg-primary-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-700">
                          ♑
                        </span>
                      </div>
                    </div>

                    {/* Floating particles */}
                    <div className="absolute top-8 right-12 w-2 h-2 bg-gold rounded-full animate-pulse"></div>
                    <div className="absolute bottom-12 left-8 w-1 h-1 bg-secondary-400 rounded-full animate-pulse delay-300"></div>
                    <div className="absolute top-16 left-16 w-3 h-3 bg-primary-300 rounded-full animate-pulse delay-700"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Additional info section */}
          <motion.div
            className="mt-16 text-center"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.8,
              delay: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <motion.div
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-primary-300/20"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: 1.0,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "#d8d2c6" }}
              >
                What You&apos;ll Receive
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-secondary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h4
                    className="font-semibold mb-2"
                    style={{ color: "#d8d2c6" }}
                  >
                    Detailed PDF Report
                  </h4>
                  <p style={{ color: "#d8d2c6", opacity: 0.8 }}>
                    Comprehensive analysis of your ancestral astrological
                    patterns
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h4
                    className="font-semibold mb-2"
                    style={{ color: "#d8d2c6" }}
                  >
                    Sacred Chart Image
                  </h4>
                  <p style={{ color: "#d8d2c6", opacity: 0.8 }}>
                    Beautiful visual representation of your cosmic blueprint
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-gold"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h4
                    className="font-semibold mb-2"
                    style={{ color: "#d8d2c6" }}
                  >
                    Activation Practices
                  </h4>
                  <p style={{ color: "#d8d2c6", opacity: 0.8 }}>
                    Personalized rituals to embody your cosmic gifts
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
