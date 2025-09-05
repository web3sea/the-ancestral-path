"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function ResourcesSection() {
  const offerings = [
    {
      id: "01",
      title: "Breathwork with AO",
      description:
        "Breathwork with AO provide an accessible entry point into Sand's transformational work. Through online group breathwork sessions, these bi-monthly programs help women clear generational patterns, connect with ancestral wisdom, and envision a new version of themselves.",
      image: "/images/sticky1.png",
      backgroundImage: "/images/stickybg1.png",
      link: "https://www.sandsymes.com/ancestral-breathwork",
      category: "Breathwork",
      duration: "Bi-monthly sessions",
      format: "Online Group",
    },
    {
      id: "02",
      title: "Personalized Medicine Containers",
      description:
        "Sand offers three distinct approaches to highly personalized, carefully curated containers for women looking to expand, elevate, and express themselves profoundly. These containers use sacred medicines to guide you on a journey of deep transformation for long-lasting change.",
      image: "/images/sticky2.png",
      backgroundImage: "/images/stickybg2.png",
      link: "https://www.sandsymes.com/sacred-containers",
      category: "Sacred Medicine",
      duration: "Custom duration",
      format: "One-on-One",
    },
    {
      id: "03",
      title: "Medicine Retreats",
      description:
        "Our retreats are highly immersive and intimate, designed for a maximum of 10 women to ensure safety and foster deep connections. These multi-day intensives incorporate sacred medicines, enhancing creativity and strengthening self-connection.",
      image: "/images/sticky3.png",
      backgroundImage: "/images/stickybg3.png",
      link: "https://www.sandsymes.com/medicine-retreats",
      category: "Retreats",
      duration: "Multi-day",
      format: "In-person",
    },
    {
      id: "04",
      title: "Wisdom Drops",
      description:
        "Wisdom Drops are bite-sized insights and teachings that deliver profound wisdom in digestible formats. These carefully curated pieces of ancestral knowledge and spiritual guidance help you integrate transformative concepts into your daily life.",
      image: "/images/wisdom.png",
      backgroundImage: "/images/bg1-image.png",
      link: "/wisdom",
      category: "Wisdom",
      duration: "5-10 minutes",
      format: "Digital",
    },
    {
      id: "05",
      title: "Astrological Download",
      description:
        "Astrological Download provides personalized cosmic insights and guidance based on your unique birth chart. This service offers deep understanding of your astrological blueprint, helping you align with your true purpose and navigate life's cycles.",
      image: "/images/astrology.png",
      backgroundImage: "/images/bg2-image.png",
      link: "/astrology",
      category: "Astrology",
      duration: "60-90 minutes",
      format: "One-on-One",
    },
    {
      id: "06",
      title: "Mini Challenges",
      description:
        "Mini Challenges are short, focused transformational experiences designed to create meaningful shifts in your life. These bite-sized programs combine practical exercises, guided practices, and community support to help you break through limiting patterns.",
      image: "/images/challenge.png",
      backgroundImage: "/images/bg3-image.png",
      link: "/challenges",
      category: "Transformation",
      duration: "7-21 days",
      format: "Digital",
    },
    {
      id: "07",
      title: "Guided Meditations",
      description:
        "Guided Meditations are a powerful way to connect with your inner wisdom and achieve deep relaxation. These meditations are designed to help you clear your mind, release tension, and access your inner guidance.",
      image: "/images/guided.png",
      backgroundImage: "/images/bg1-image.png",
      link: "/meditations",
      category: "Meditation",
      duration: "10-30 minutes",
      format: "Digital",
    },
    {
      id: "08",
      title: "ABJ Recordings",
      description:
        "Breathwork with AO Recordings allow you to experience the transformative power of breathwork at your own pace. These recordings guide you through powerful breathing techniques and ancestral connection practices.",
      image: "/images/abj.png",
      backgroundImage: "/images/stickybg1.png",
      link: "/breathwork",
      category: "Breathwork",
      duration: "20-45 minutes",
      format: "Digital",
    },
    {
      id: "09",
      title: "Dedicated Group Workshops",
      description:
        "Dedicated Group Workshops provide a supportive community environment for deep transformation. These workshops combine guided practices, group sharing, and individual reflection to create powerful collective healing experiences.",
      image: "/images/workshops.png",
      backgroundImage: "/images/stickybg3.png",
      link: "/retreats",
      category: "Workshops",
      duration: "2-4 hours",
      format: "Group",
    },
    {
      id: "10",
      title: "AO",
      description:
        "AO is an innovative digital companion that provides personalized spiritual guidance and insights. This advanced AI system draws from ancient wisdom traditions and Sand's extensive knowledge to offer meaningful responses.",
      image: "/images/oracle-ai.png",
      backgroundImage: "/images/bg-image.png",
      link: "/oracle",
      category: "AI Guidance",
      duration: "24/7",
      format: "Digital",
    },
  ];

  const categories = [
    "All",
    "Breathwork",
    "Sacred Medicine",
    "Retreats",
    "Wisdom",
    "Astrology",
    "Transformation",
    "Meditation",
    "Workshops",
    "AI Guidance",
  ];

  return (
    <section className="min-h-screen bg-black">
      {/* Hero Section */}
      <motion.section
        className="relative py-20 lg:py-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/stickybg1.png')`,
          }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight mb-6"
            style={{ color: "#d8d2c6" }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            SACRED RESOURCES
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl lg:text-2xl font-light max-w-3xl mx-auto leading-relaxed"
            style={{ color: "#d8d2c6", opacity: 0.9 }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover your path to transformation through our comprehensive
            collection of healing practices, wisdom teachings, and sacred
            experiences.
          </motion.p>
        </div>
      </motion.section>

      {/* Category Filter */}
      <motion.section
        className="py-12 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <button
                key={category + index}
                className="px-6 py-3 rounded-full border border-[#d8d2c6] text-[#d8d2c6] font-light transition-all duration-300 hover:bg-[#d8d2c6] hover:text-black hover:opacity-100"
                style={{ opacity: 0.7 }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Offerings Grid */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offerings.map((offering, index) => (
              <motion.div
                key={offering.id + index}
                className="group relative overflow-hidden rounded-xl border border-[#d8d2c6] bg-black"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ y: -5 }}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  style={{
                    backgroundImage: `url(${offering.backgroundImage})`,
                  }}
                />

                {/* Content */}
                <div className="relative z-10 p-6 h-full flex flex-col">
                  {/* Image */}
                  <div className="w-full h-48 mb-6 rounded-lg overflow-hidden">
                    <Image
                      src={offering.image}
                      alt={offering.title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Category Badge */}
                  <div className="mb-4">
                    <span
                      className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: "#d8d2c6",
                        color: "#000",
                        opacity: 0.8,
                      }}
                    >
                      {offering.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-xl md:text-2xl font-light mb-3 leading-tight"
                    style={{ color: "#d8d2c6" }}
                  >
                    {offering.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm md:text-base font-light mb-6 leading-relaxed flex-grow"
                    style={{ color: "#d8d2c6", opacity: 0.8 }}
                  >
                    {offering.description}
                  </p>

                  {/* Details */}
                  <div className="mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "#d8d2c6", opacity: 0.6 }}>
                        Duration:
                      </span>
                      <span style={{ color: "#d8d2c6" }}>
                        {offering.duration}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "#d8d2c6", opacity: 0.6 }}>
                        Format:
                      </span>
                      <span style={{ color: "#d8d2c6" }}>
                        {offering.format}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={offering.link}
                    className="inline-flex items-center justify-center px-6 py-3 border border-[#d8d2c6] text-[#d8d2c6] font-light rounded-lg transition-all duration-300 hover:bg-[#d8d2c6] hover:text-black group-hover:opacity-100"
                    style={{ opacity: 0.8 }}
                  >
                    Explore Experience
                    <svg
                      className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <motion.section
        className="py-20 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 leading-tight"
            style={{ color: "#d8d2c6" }}
          >
            READY TO BEGIN YOUR JOURNEY?
          </h2>
          <p
            className="text-lg md:text-xl font-light mb-8 leading-relaxed"
            style={{ color: "#d8d2c6", opacity: 0.8 }}
          >
            Each offering is carefully crafted to support your unique path of
            transformation. Choose the experience that resonates with your soul
            and take the first step toward your sacred evolution.
          </p>
        </div>
      </motion.section>
    </section>
  );
}
