"use client";

import { motion } from "framer-motion";

interface DescriptionVisualSectionProps {
  title: string;
  description: string;
  visualElement?: React.ReactNode;
  visualPosition?: "left" | "right";
}

const DescriptionVisualSection = ({
  title,
  description,
  visualElement,
  visualPosition = "right",
}: DescriptionVisualSectionProps) => {
  return (
    <section className="py-12 sm:py-16 lg:py-24 relative">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://static.wixstatic.com/media/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg/v1/fill/w_1290,h_848,al_c,q_85,enc_avif,quality_auto/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg')`,
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center ${
            visualPosition === "left" ? "lg:grid-flow-col-dense" : ""
          }`}
        >
          {/* Text Content */}
          <motion.div
            initial={{ x: visualPosition === "left" ? 60 : -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={`${visualPosition === "left" ? "lg:col-start-2" : ""}`}
          >
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-6 sm:mb-8 tracking-wide"
              style={{ color: "#d8d2c6" }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {title}
            </motion.h2>
            <motion.p
              className="text-sm sm:text-base lg:text-lg leading-relaxed font-light mb-6 sm:mb-8"
              style={{ color: "#d8d2c6", opacity: 0.9 }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {description}
            </motion.p>

            {/* Call to action button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border border-primary-300/40 hover:border-primary-300/60 transition-all duration-300 rounded-lg group"
            >
              <span
                className="text-sm sm:text-base lg:text-lg font-light tracking-wide transition-colors"
                style={{ color: "#d8d2c6" }}
              >
                Begin Your Journey
              </span>
            </motion.button>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ x: visualPosition === "left" ? -60 : 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={`${
              visualPosition === "left" ? "lg:col-start-1" : ""
            } flex justify-center lg:justify-${
              visualPosition === "left" ? "start" : "end"
            }`}
          >
            {visualElement || (
              <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-primary-300/20 to-primary-300/5 border border-primary-300/30 flex items-center justify-center">
                <div className="text-center">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-300/30 flex items-center justify-center"
                    style={{ color: "#d8d2c6" }}
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <p
                    className="text-sm font-light"
                    style={{ color: "#d8d2c6", opacity: 0.8 }}
                  >
                    Sacred Wisdom
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DescriptionVisualSection;
