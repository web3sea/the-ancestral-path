"use client";

import { motion } from "framer-motion";

export default function GroupWorkshopsSection() {
  return (
    <div
      className="min-h-screen bg-black/70 pt-20 pb-10"
      style={{
        backgroundImage: `url('https://static.wixstatic.com/media/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg/v1/fill/w_1290,h_848,al_c,q_85,enc_avif,quality_auto/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24">
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
          <motion.h1
            className="text-4xl lg:text-6xl font-light mb-6 tracking-wide"
            style={{ color: "#d8d2c6" }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            DEDICATED GROUP WORKSHOPS
          </motion.h1>
          <motion.p
            className="text-lg max-w-3xl mx-auto leading-relaxed font-light"
            style={{ color: "#d8d2c6", opacity: 0.9 }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            Transformative group experiences designed for deep healing,
            connection, and collective growth. Join a sacred circle of
            like-minded souls on your spiritual journey.
          </motion.p>
        </motion.div>

        {/* Workshop Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {/* Inner Child Healing */}
          <motion.div
            className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-primary-300/20"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-4">
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4" style={{ color: "#d8d2c6" }}>
              Inner Child Healing
            </h3>
            <p
              className="mb-4 leading-relaxed"
              style={{ color: "#d8d2c6", opacity: 0.8 }}
            >
              Reconnect with and heal your inner child through guided practices,
              group sharing, and sacred rituals.
            </p>
            <div className="text-sm" style={{ color: "#d8d2c6", opacity: 0.6 }}>
              Duration: 3 hours • Group Size: 8-12
            </div>
          </motion.div>

          {/* Sacred Feminine Circle */}
          <motion.div
            className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-primary-300/20"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-4">
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4" style={{ color: "#d8d2c6" }}>
              Sacred Feminine Circle
            </h3>
            <p
              className="mb-4 leading-relaxed"
              style={{ color: "#d8d2c6", opacity: 0.8 }}
            >
              Honor the divine feminine within through ritual, meditation, and
              collective wisdom sharing.
            </p>
            <div className="text-sm" style={{ color: "#d8d2c6", opacity: 0.6 }}>
              Duration: 4 hours • Group Size: 6-10
            </div>
          </motion.div>

          {/* Manifestation Mastery */}
          <motion.div
            className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-primary-300/20"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.0,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-4">
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
            <h3 className="text-xl font-bold mb-4" style={{ color: "#d8d2c6" }}>
              Manifestation Mastery
            </h3>
            <p
              className="mb-4 leading-relaxed"
              style={{ color: "#d8d2c6", opacity: 0.8 }}
            >
              Learn conscious manifestation techniques and align with your
              soul&apos;s purpose in a supportive group setting.
            </p>
            <div className="text-sm" style={{ color: "#d8d2c6", opacity: 0.6 }}>
              Duration: 3 hours • Group Size: 8-15
            </div>
          </motion.div>
        </div>

        {/* Workshop Benefits */}
        <motion.div
          className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-primary-300/20 mb-20"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <h2
            className="text-3xl font-bold mb-8 text-center"
            style={{ color: "#d8d2c6" }}
          >
            What You&apos;ll Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-3 h-3 text-gold"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4
                    style={{ color: "#d8d2c6" }}
                    className="font-semibold mb-1"
                  >
                    Sacred Container
                  </h4>
                  <p
                    style={{ color: "#d8d2c6", opacity: 0.8 }}
                    className="text-sm"
                  >
                    Safe, supportive space for deep healing and transformation
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-3 h-3 text-gold"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4
                    style={{ color: "#d8d2c6" }}
                    className="font-semibold mb-1"
                  >
                    Collective Wisdom
                  </h4>
                  <p
                    style={{ color: "#d8d2c6", opacity: 0.8 }}
                    className="text-sm"
                  >
                    Learn from group insights and shared experiences
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-3 h-3 text-gold"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4
                    style={{ color: "#d8d2c6" }}
                    className="font-semibold mb-1"
                  >
                    Guided Practices
                  </h4>
                  <p
                    style={{ color: "#d8d2c6", opacity: 0.8 }}
                    className="text-sm"
                  >
                    Expert-led sessions with proven healing techniques
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-3 h-3 text-gold"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4
                    style={{ color: "#d8d2c6" }}
                    className="font-semibold mb-1"
                  >
                    Lasting Transformation
                  </h4>
                  <p
                    style={{ color: "#d8d2c6", opacity: 0.8 }}
                    className="text-sm"
                  >
                    Tools and practices to continue your journey at home
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 1.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <h2 className="text-3xl font-bold mb-6" style={{ color: "#d8d2c6" }}>
            Join Our Sacred Circle
          </h2>
          <p
            className="text-lg mb-8 max-w-2xl mx-auto"
            style={{ color: "#d8d2c6", opacity: 0.8 }}
          >
            Experience the power of collective healing and transformation in our
            dedicated group workshops.
          </p>
          <button className="btn-primary text-lg px-8 py-4">
            View Upcoming Workshops
          </button>
        </motion.div>
      </div>
    </div>
  );
}
