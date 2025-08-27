"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20 lg:pt-26">
      {/* Background image from Sandsymes website */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/bg-image.png')`,
        }}
      ></div>

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20 z-10"></div>

      {/* Content */}
      <div
        className="relative w-full mx-4 sm:mx-6 md:mx-8 lg:mx-10 p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20 z-20 flex items-end justify-start min-h-screen rounded-xl"
        style={{
          backgroundImage: `url('/images/sandsymes-1.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Text content positioned at bottom left */}
        <motion.div
          className="text-left mb-8 sm:mb-12 lg:mb-16 xl:mb-20"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight tracking-wide text-shadow w"
            style={{ color: "#d8d2c6" }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            MEET SAND SYMES
          </motion.h1>

          <motion.div
            className="space-y-1 sm:space-y-2 lg:space-y-3 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light mb-6 sm:mb-8 lg:mb-12"
            style={{ color: "#d8d2c6" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {[
              "Modern Medicine Woman,",
              "Shamanic Practitioner,",
              "Psychedelic Guide,",
              "Mentor & Visionary.",
            ].map((text, index) => (
              <motion.p
                key={index}
                className="text-left"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.6 + index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {text}
              </motion.p>
            ))}
          </motion.div>

          <motion.p
            className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 w-full leading-relaxed text-left"
            style={{ color: "#d8d2c6", opacity: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.0,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            Guiding souls through transformative healing journeys using ancient
            wisdom and modern practices for profound spiritual awakening.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-start"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/breathwork"
                className="btn-primary text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 text-center"
              >
                EXPLORE OFFERINGS
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/oracle"
                className="btn-secondary text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 text-center"
              >
                ORACLE AI CHAT
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
