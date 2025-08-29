"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function SandSymesExperienceSection() {
  return (
    <section
      className="sticky top-0 mx-5 lg:m-10 rounded-xl flex flex-col lg:flex-row"
      style={{
        backgroundImage: `url('/images/bg3-image.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-black/50 absolute inset-0" />
      <motion.div
        className="w-full p-10 z-10 pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <motion.div
          className="flex flex-col gap-3"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.h3
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium"
            style={{ color: "#d8d2c6" }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            EXPERIENCE
          </motion.h3>
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light"
            style={{ color: "#d8d2c6" }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.6,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            SAND&apos;S OFFERINGS
          </motion.h2>
        </motion.div>
        <motion.div
          className="mt-16 flex font-light flex-col gap-10 text-sm sm:text-base lg:text-lg"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            delay: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {[
            "Sand is dedicated to creating a transformative path that is inclusive and accessible to all women. Her Ancestral Breathwork AO are a powerful portal for those seeking to break generational chains and uncover profound self-discovery. They utilize the gentle yet potent medicine of one's own breath to ensure that every woman can access deep personal growth.",
            "In her Advanced Retreats and her carefully curated one-on-one Medicine Containers, she collaborates closely with a small select cohort of creative pioneers focused on personal mastery, expansion, and growth.",
          ].map((text, index) => (
            <motion.p
              key={index}
              style={{ color: "#d8d2c6", opacity: 0.9 }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: 0.8 + index * 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {text}
            </motion.p>
          ))}
        </motion.div>
      </motion.div>
      <motion.div
        className="self-end z-10 pt-20"
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 1.2,
            delay: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <Image
            src="/images/sandsymes-3.png"
            alt="Sand Symes Experience"
            width={900}
            height={500}
            className="rounded-xl "
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
