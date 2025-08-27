"use client";

import { motion } from "framer-motion";

interface FullWidthImageSectionProps {
  imageUrl: string;
  altText?: string;
}

const FullWidthImageSection = ({
  imageUrl,
  altText = "Sacred healing journey",
}: FullWidthImageSectionProps) => {
  return (
    <section className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: 1.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="absolute inset-0"
      >
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${imageUrl}')`,
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      {/* Optional overlay text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="text-center"
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-4 tracking-wide"
            style={{ color: "#d8d2c6" }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            SACRED JOURNEY
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed font-light px-4 sm:px-6"
            style={{ color: "#d8d2c6", opacity: 0.9 }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {altText}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default FullWidthImageSection;
