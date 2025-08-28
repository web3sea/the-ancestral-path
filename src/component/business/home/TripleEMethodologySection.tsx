"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function TripleEMethodologySection() {
  return (
    <section
      className="bg-black/40 backdrop-blur-sm mx-4 sm:mx-6 md:mx-8 lg:mx-10 overflow-hidden shadow-2xl"
      style={{
        backgroundImage: `url('/images/bg1-image.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between p-6 sm:p-8 lg:p-12 xl:p-16 min-h-[600px]">
        {/* Left Side - Animated Graphic */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center mb-8 lg:mb-0"
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.div
            className="relative w-full max-w-xl h-[220px] sm:h-[400px]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* Top sphere */}
            <motion.div
              className="absolute w-[235px] sm:w-[420px] top-0 left-1/2 transform -translate-x-1/2"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <Image
                src="/images/animated1.png"
                alt="Geometric spheres representing expansion and growth"
                width={200}
                height={200}
                className="w-[235px] sm:w-[440px] object-contain animate-spin"
                style={{ animationDuration: "10s" }}
                priority
              />
            </motion.div>

            {/* Bottom left sphere */}
            <motion.div
              className="absolute bottom-0 left-0"
              initial={{ x: -50, y: 50, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <Image
                src="/images/animated1.png"
                alt="Geometric spheres representing expansion and growth"
                width={200}
                height={200}
                className="w-[235px] sm:w-[440px] object-contain animate-spin"
                style={{ animationDuration: "10s" }}
                priority
              />
            </motion.div>

            {/* Bottom right sphere */}
            <motion.div
              className="absolute bottom-0 right-0"
              initial={{ x: 50, y: 50, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.9,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <Image
                src="/images/animated1.png"
                alt="Geometric spheres representing expansion and growth"
                width={200}
                height={200}
                className="w-[235px] sm:w-[440px] object-contain animate-spin"
                style={{ animationDuration: "10s" }}
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Side - Text Content */}
        <motion.div
          className="w-full lg:w-1/2 space-y-8 sm:space-y-10 lg:space-y-12"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* EXPAND */}
          <motion.div
            className="group"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.6,
              delay: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <motion.h3
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 tracking-wide group-hover:text-blue-400 transition-colors duration-300"
              style={{ color: "#d8d2c6" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              EXPAND
            </motion.h3>
            <motion.p
              className="text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed"
              style={{ color: "#d8d2c6", opacity: 0.9 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: 0.9,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              Psychedelic medicines are here to expand your reality so that you
              can see the next iteration of yourself - the next version that
              your current self cannot see. Through expansion, new possibilities
              for growth and evolution are revealed.
            </motion.p>
          </motion.div>

          {/* ELEVATE */}
          <motion.div
            className="group"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.6,
              delay: 1.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <motion.h3
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 tracking-wide group-hover:text-blue-400 transition-colors duration-300"
              style={{ color: "#d8d2c6" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: 1.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              ELEVATE
            </motion.h3>
            <motion.p
              className="text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed"
              style={{ color: "#d8d2c6", opacity: 0.9 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: 1.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              Through inner healing and expanded awareness, sacred medicines
              help elevate you beyond current limitations. By addressing trauma
              and unlocking genius within, one is empowered to rise to new
              heights of wisdom, well-being and fulfillment.
            </motion.p>
          </motion.div>

          {/* EXPRESS */}
          <motion.div
            className="group"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 1.7,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <motion.h3
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 tracking-wide group-hover:text-blue-400 transition-colors duration-300"
              style={{ color: "#d8d2c6" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: 1.9,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              EXPRESS
            </motion.h3>
            <motion.p
              className="text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed"
              style={{ color: "#d8d2c6", opacity: 0.9 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: 2.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              Once you have expanded your potential through sacred medicines,
              you begin to express your innate creativity and talents boldly and
              authentically, leading to a more fulfilling and impactful life.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
