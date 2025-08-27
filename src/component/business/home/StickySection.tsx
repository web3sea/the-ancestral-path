"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function StickySection() {
  const item = [
    {
      id: "01",
      title: "Ancestral Breathwork Journeys",
      description:
        "Ancestral Breathwork Journeys provide an accessible entry point into Sand's transformational work. Through online group breathwork sessions, these bi-monthly programs help women clear generational patterns, connect with ancestral wisdom, and envision a new version of themselves.",
      image: "/images/sticky1.png",
      backgroundImage: "/images/stickybg1.png",
    },
    {
      id: "02",
      title: "Personalized Medicine Containers",
      description:
        "Sand offers three distinct approaches to highly personalized, carefully curated containers for women looking to expand, elevate, and express themselves profoundly. These containers use sacred medicines to guide you on a journey of deep transformation for long-lasting change. With her extensive experience, Sand ensures an exceptionally safe and nurturing environment, allowing you to explore your inner landscapes and unlock transformative insights. Each container is designed to help you tap into heightened creativity and vision, fostering significant personal growth.",
      image: "/images/sticky2.png",
      backgroundImage: "/images/stickybg2.png",
    },

    {
      id: "03",
      title: "Medicine Retreats",
      description:
        "Our retreats are highly immersive and intimate, designed for a maximum of 10 women to ensure safety and foster deep connections. These multi-day intensives incorporate sacred medicines, enhancing creativity and strengthening self-connection. Set on a stunning retreat property, they offer the perfect environment for profound identity shifts and the emergence of new personal chapters. Each retreat is structured to provide an intimate, secure setting that promotes significant transformation.",
      image: "/images/sticky3.png",
      backgroundImage: "/images/stickybg3.png",
    },
  ];

  return (
    <motion.div
      className="mx-5 mt-5 lg:mt-10 lg:mx-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {item.map((item, index) => (
        <motion.section
          key={index}
          className="sticky bg-black p-4 sm:p-6 md:p-8 lg:p-10 top-1/4 sm:top-1/3 w-full h-fit sm:h-[75vh] md:h-[70vh] lg:h-[65.5vh] z-1 rounded-xl border-1 border-[#d8d2c6]"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            delay: index * 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div
            className="w-full flex flex-col lg:flex-row justify-between p-4 sm:p-6 md:p-8 lg:p-10 h-full z-10 rounded-xl relative"
            style={{
              backgroundImage: `url(${item.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="flex flex-col gap-2 sm:gap-3 max-w-full lg:max-w-5xl relative z-10 mb-6 lg:mb-0">
              <h2 className="text-sm sm:text-base md:text-lg font-light">
                {item.id}
              </h2>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-tight">
                {item.title}
              </h2>
              <p className="text-sm sm:text-base lg:text-lg leading-relaxed font-light max-w-full lg:max-w-2xl">
                {item.description}
              </p>
            </div>
            <div className="w-full lg:w-1/3 relative z-10 rounded-xl h-48 sm:h-56 md:h-64 lg:h-full">
              <Image
                src={item.image}
                alt="bg1-image"
                width={1000}
                height={1000}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </motion.section>
      ))}
    </motion.div>
  );
}
