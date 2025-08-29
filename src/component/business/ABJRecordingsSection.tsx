"use client";

import { motion } from "framer-motion";

export default function ABJRecordingsSection() {
  return (
    <div
      className="min-h-screen pt-20 bg-black/70"
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
            ABJ RECORDINGS
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
            Sacred audio recordings and guided journeys for your spiritual
            practice. Each recording is crafted with intention to support your
            healing, growth, and connection to your authentic self.
          </motion.p>
        </motion.div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Meditation Recordings */}
          <motion.div
            className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-primary-300/20"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: "#d8d2c6" }}
            >
              Guided Meditations
            </h2>
            <p
              className="mb-6 leading-relaxed"
              style={{ color: "#d8d2c6", opacity: 0.8 }}
            >
              Immerse yourself in sacred guided meditations designed to deepen
              your spiritual practice and connect you with your inner wisdom.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gold rounded-full"></div>
                <span style={{ color: "#d8d2c6", opacity: 0.8 }}>
                  Morning Awakening Practices
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gold rounded-full"></div>
                <span style={{ color: "#d8d2c6", opacity: 0.8 }}>
                  Inner Child Healing Journeys
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gold rounded-full"></div>
                <span style={{ color: "#d8d2c6", opacity: 0.8 }}>
                  Chakra Clearing & Balancing
                </span>
              </div>
            </div>
          </motion.div>

          {/* Breathwork Sessions */}
          <motion.div
            className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-primary-300/20"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: "#d8d2c6" }}
            >
              Breathwork Sessions
            </h2>
            <p
              className="mb-6 leading-relaxed"
              style={{ color: "#d8d2c6", opacity: 0.8 }}
            >
              Transformative breathwork recordings to release stored emotions,
              activate your life force, and access deeper states of
              consciousness.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gold rounded-full"></div>
                <span style={{ color: "#d8d2c6", opacity: 0.8 }}>
                  Energy Activation Practices
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gold rounded-full"></div>
                <span style={{ color: "#d8d2c6", opacity: 0.8 }}>
                  Emotional Release Sessions
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gold rounded-full"></div>
                <span style={{ color: "#d8d2c6", opacity: 0.8 }}>
                  Sacred Breath Ceremonies
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 1.0,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <h2 className="text-3xl font-bold mb-6" style={{ color: "#d8d2c6" }}>
            Begin Your Sacred Journey
          </h2>
          <p
            className="text-lg mb-8 max-w-2xl mx-auto"
            style={{ color: "#d8d2c6", opacity: 0.8 }}
          >
            Access these sacred recordings and transform your spiritual practice
            with guided support from Sand.
          </p>
          <button className="btn-primary text-lg px-8 py-4">
            Access Recordings
          </button>
        </motion.div>
      </div>
    </div>
  );
}
