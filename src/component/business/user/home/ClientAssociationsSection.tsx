"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ClientAssociations() {
  const clientAssociations = [
    {
      name: "Meta",
      image: "/images/meta.png",
    },
    {
      name: "Pinterest",
      image: "/images/pinterest.png",
    },

    {
      name: "Project Dandelion",
      image: "/images/project-dandelion.png",
    },
    {
      name: "Pachamama",
      image: "/images/pachamama.png",
    },
    {
      name: "Bill & Melinda Gates",
      image: "/images/bill-melinda-gate.png",
    },
    {
      name: "TED Woman",
      image: "/images/tedwoman.png",
    },
    {
      name: "CLIO",
      image: "/images/clio.png",
    },
  ];
  return (
    <motion.div
      className="bg-black/40 backdrop-blur-sm overflow-hidden py-5 lg:py-10 border-y-2 border-primary-300/20"
      style={{
        backgroundImage: `url('/images/bg2-image.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <motion.h2
        className="text-center text-lg mb-5"
        style={{ color: "#d8d2c6" }}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        CLIENT ASSOCIATIONS INCLUDE
      </motion.h2>
      <motion.div
        className="flex flex-wrap justify-center items-center gap-4"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {clientAssociations.map((client, index) => (
          <motion.div
            key={client.name}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.6,
              delay: 0.4 + index * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            whileHover={{ scale: 1.1, y: -5 }}
          >
            <Image
              src={client.image}
              alt={client.name}
              width={200}
              height={200}
              className="w-[100px] lg:w-[300px]"
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
