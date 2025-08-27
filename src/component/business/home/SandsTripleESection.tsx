"use client";

import { motion } from "framer-motion";

export default function SandsTripleE() {
  return (
    <section
      className="overflow-hidden py-5 lg:py-10 relative"
      style={{
        backgroundImage: `url('/images/bg1-image.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-black/50 absolute inset-0" />
      <div className="flex flex-col max-w-7xl mx-auto lg:flex-row gap-4 items-center justify-center relative z-10">
        <motion.div
          className="flex flex-col text-4xl lg:text-6xl font-light w-full lg:w-1/2 text-white"
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {["SAND'S", 'TRIPLE "E"', "METHODOLOGY"].map((text, index) => (
            <motion.h2
              key={index}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: 0.2 + index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {text}
            </motion.h2>
          ))}
        </motion.div>
        <motion.div
          className="flex flex-col items-center justify-center w-full lg:w-1/2 text-sm lg:text-lg gap-10"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <p>
            *Sand&apos;s Triple &quot;E&quot; Methodology* offers a
            transformative journey through Expansion, Elevation, and Expression.
            This unique approach empowers individuals to transcend their
            limitations, facilitating a broadened perspective that fosters
            profound personal and spiritual growth. Engaging with Sand’s
            methodology will elevate your understanding of self and the world
            around you, enabling a higher level of consciousness and well-being.
          </p>
          <p>
            The process encourages you to express your innate creativity and
            talents boldly and authentically, leading to a more fulfilling and
            impactful life. Ideal for those seeking to amplify their creativity
            and achieve transformation, Sand&apos;s Triple E Methodology is a
            powerful tool for crafting a life that not only meets but exceeds
            your visions and dreams.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
