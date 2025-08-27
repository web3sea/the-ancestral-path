"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BreathworkDetailsSection() {
  const details = [
    {
      id: "01",
      title: "THE SCIENCE",
      description: [
        "Breathwork is a technique of controlled breathing and focused attention that can rapidly bring about an altered state of consciousness. It works to deactivate the sympathetic nervous system responsible for the fight-or-flight reaction and activate the parasympathetic nervous system associated with the rest-and-digest, calm response. From this altered state we have far greater access to the non-conventional forms of knowing carried in our bodies.",
      ],
      image: "/images/the-science.png",
    },
    {
      id: "02",
      title: "THE ANCESTORS",
      description: [
        "Our Ancestors exist in a realm beyond the 3-D world as both benign energies from those in our family lineage who have passed over and Ancient Ancestors who carry gifts we can embody today.",
        "They can help us to break karmic patterns and dissolve generational trauma. They will also give us access to the wisdom and gifts that run in our ancestral line.",
        "Whether for insight, healing or guidance, our Ancestors are always a willing and powerful support for our highest good.",
      ],
      image: "/images/the-ancestors.png",
    },
    {
      id: "03",
      title: "THE MOONS",
      description: [
        "We choose to journey each month with the New and Full Moons to align with the energies available at these moments. The New Moon provides an opportunity to start fresh or plant seeds. In personal work it is ideal for setting goals or starting new projects.",
        "Two weeks later the Full Moon brings a peak of energy and illumination plus a chance to harvest that which has grown. We can align with this by ensuring our ventures are providing results, and also by shedding that which no longer serves us.",
      ],
      image: "/images/the-moon.png",
    },
  ];
  return (
    <section className="flex flex-col gap-10 p-5 lg:p-10">
      {details.map((detail, index) => (
        <motion.div
          className="flex justify-between w-full border border-[#D8D2C6] rounded-xl p-5 gap-5 items-center"
          key={detail.id}
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            delay: 0.3 * index,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex flex-col gap-5 max-w-3xl">
            <motion.h3
              className="text-lg font-bold"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: 0.3 * index + 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {detail.id}
            </motion.h3>
            {detail.description.map((description, descIndex) => (
              <motion.p
                key={description}
                className="text-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: 0.3 * index + 0.4 + descIndex * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {description}
              </motion.p>
            ))}
          </div>
          <motion.div
            className="w-[600px]"
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.8,
              delay: 0.3 * index + 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src={detail.image}
              alt={detail.title}
              width={600}
              height={600}
              className="rounded-xl"
            />
          </motion.div>
        </motion.div>
      ))}
    </section>
  );
}
