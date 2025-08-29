"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function UniqueApproachSection() {
  return (
    <section
      className="mx-4 sm:mx-5 lg:mx-10 relative flex flex-col lg:flex-row p-4 sm:p-6 md:p-8 lg:p-10"
      style={{
        backgroundImage: `url('/images/bg1-image.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <motion.div
        className="w-full lg:w-1/3 flex relative justify-center items-center z-10 rounded-3xl bg-gradient-to-b from-black/30 to-black/10 min-h-[200px] sm:min-h-[500px] md:h-full mb-6 lg:mb-0"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <Image
          src="/images/animated2.png"
          alt="unique-approach-image"
          width={400}
          height={400}
          className="absolute top-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80 flip-horizontal-1"
        />
        <Image
          src="/images/animated2.png"
          alt="unique-approach-image"
          width={420}
          height={420}
          className="absolute top-1/2 -translate-y-1/2 w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-72 lg:h-72 xl:w-96 xl:h-96 flip-horizontal-2"
        />

        <Image
          src="/images/animated2.png"
          alt="unique-approach-image"
          width={430}
          height={430}
          className="absolute w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-80 lg:h-80 xl:w-[400px] xl:h-[400px] flip-horizontal-3"
        />
      </motion.div>
      <motion.div
        className="w-full lg:w-2/3 relative z-10 rounded-xl flex flex-col gap-6 sm:gap-8 lg:gap-10 bg-gradient-to-b from-black/30 to-black/10 border border-[#d8d2c6] p-4 sm:p-6 md:p-8 lg:p-10"
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl"
          style={{ color: "#d8d2c6" }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          A Unique Approach
        </motion.h2>
        <motion.div
          className="flex flex-col gap-6 sm:gap-8 lg:gap-10 text-sm sm:text-base md:text-lg font-light leading-relaxed"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {[
            "With over three decades of experience in trauma healing and transformation practices, Sand stands as a seer, bridging the gap between the modern and ancient worlds. Her work integrates the depth of psychedelic therapy and trauma-informed care with the profound wisdom of shamanic traditions. As a certified Internal Family Systems practitioner and seasoned social worker, Sand brings valuable clinical insights into each session, ensuring a safe and transformative environment.",
            "Sand also maintains an Ancestral Altar, offering a unique opportunity for clients to connect with their healed ancestors, spirit guides, and cosmic guides, enhancing their journey to self-discovery. Having participated in over 130 sacred medicine ceremonies, she excels at creating supportive spaces that allow individuals to access their highest potential and achieve significant breakthroughs, both personally and professionally.",
          ].map((text, index) => (
            <motion.p
              key={index}
              style={{ color: "#d8d2c6", opacity: 0.9 }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.9 + index * 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {text}
            </motion.p>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
