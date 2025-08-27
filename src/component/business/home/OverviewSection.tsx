"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Overview() {
  return (
    <section
      className="bg-black/40 backdrop-blur-sm rounded-xl mx-4 sm:mx-6 md:mx-8 lg:mx-10 my-8 sm:my-10 overflow-hidden shadow-2xl"
      style={{
        backgroundImage: `url('/images/bg-image.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full flex flex-col lg:flex-row overflow-hidden">
        {/* Text Content Section */}
        <motion.div
          className="flex flex-col w-full lg:w-1/2 py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-10 bg-black/40 backdrop-blur-sm"
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl mb-4 sm:mb-6 font-bold tracking-wide"
            style={{ color: "#d8d2c6" }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            OVERVIEW
          </motion.h2>

          {/* About Sand Section */}
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <motion.h3
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-8 sm:mb-12 lg:mb-20"
              style={{ color: "#d8d2c6" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              ABOUT SAND
            </motion.h3>

            <motion.div
              className="space-y-4 sm:space-y-6 lg:space-y-8 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed"
              style={{ color: "#d8d2c6", opacity: 0.9 }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                delay: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {[
                "Sand Symes is one of the most sought-after mentors in the psychedelic field, specializing in helping women ready to expand, express, and elevate themselves. With a distinguished career that spans over four decades, including years as a dedicated social worker, Sand expertly guides women to reshape their identities and amplify their visions, empowering them to live authentically and vibrantly.",
                "Her deep-rooted expertise is enriched by extensive shamanic training under the guidance of a Peruvian Medicine woman, spanning a 16-year apprenticeship. Additionally, Sand has gained profound insights from her revered medicine teachers of the Ecuadorian rainforest, the jungles of Peru, and she's had the privilege of learning from esteemed Andean Elders and the rich traditions of Indigenous Native American wisdom and cosmology, which deeply inform and inspire her work. These teachings have guided her in integrating ancient earth-based practices, with modern approaches to healing and transformation. Yet she gives the medicine plants themselves, the full honor of being her most powerful teachers of all. Her wisdom and experience come from a powerful combination of sitting in, learning from, and eventually leading over 130 medicine ceremonies. Sand also brings the unique gift of a Seer, a talent nurtured since childhood through her profound connection with ancestors, which deeply informs her practice and enhances her ability to connect with and guide her clients on a spiritual and emotional level.",
                "Today, Sand is passionately committed to nurturing the next generation of empowered female leaders. Through sacred mentorship and personalized psychedelic explorations, she assists them in uncovering and expressing their innate genius, passion, and purpose, paving the way for a future where they can lead with confidence and insight.",
              ].map((text, index) => (
                <motion.p
                  key={index}
                  className="text-justify sm:text-left"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.6,
                    delay: 1.0 + index * 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {text}
                </motion.p>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="w-full lg:w-1/2 overflow-hidden p-4 sm:p-6 lg:p-10 max-h-[400px] lg:max-h-max lg:min-h-[500px] rounded-xl"
          style={{
            backgroundImage: `url('/images/bg1-image.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
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
              src="/images/sandsymes-2.png"
              alt="Sand Symes - Modern Medicine Woman and Shamanic Practitioner"
              className="w-full h-full  object-cover sm:object-contain rounded-xl"
              width={500}
              height={300}
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
