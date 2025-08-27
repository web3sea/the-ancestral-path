"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface BreathworkSession {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  thumbnail: string;
  videoUrl: string;
  benefits: string[];
}

const breathworkSessions: BreathworkSession[] = [
  {
    id: "1",
    title: "Morning Awakening Breathwork",
    description:
      "Start your day with intention and energy through this gentle yet powerful breathing practice.",
    duration: "15 min",
    difficulty: "Beginner",
    thumbnail: "/api/placeholder/400/225",
    videoUrl: "#",
    benefits: ["Increased energy", "Mental clarity", "Emotional balance"],
  },
  {
    id: "2",
    title: "Deep Release Breathwork",
    description:
      "Release stored emotions and trauma through this transformative breathing journey.",
    duration: "45 min",
    difficulty: "Intermediate",
    thumbnail: "/api/placeholder/400/225",
    videoUrl: "#",
    benefits: ["Emotional release", "Stress reduction", "Inner healing"],
  },
  {
    id: "3",
    title: "Chakra Clearing Breathwork",
    description:
      "Align and clear your energy centers through focused breathing and visualization.",
    duration: "30 min",
    difficulty: "Advanced",
    thumbnail: "/api/placeholder/400/225",
    videoUrl: "#",
    benefits: ["Energy alignment", "Spiritual connection", "Chakra balance"],
  },
];

export default function BreathworkSection() {
  const [selectedSession, setSelectedSession] =
    useState<BreathworkSession | null>(null);
  const [filter, setFilter] = useState<
    "All" | "Beginner" | "Intermediate" | "Advanced"
  >("All");

  const filteredSessions =
    filter === "All"
      ? breathworkSessions
      : breathworkSessions.filter((session) => session.difficulty === filter);

  return (
    <section id="breathwork" className="relative">
      <div
        className="relative h-full pt-36"
        style={{
          backgroundImage: `url('/images/stickybg1.png')`,
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-0" />

        {/* Header */}
        <motion.div
          className="text-center mb-20 max-w-7xl mx-auto relative z-12"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.h2
            className="text-4xl lg:text-5xl font-light mb-6 tracking-wide"
            style={{ color: "#d8d2c6" }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            MEDICINE CONTAINERS
          </motion.h2>
          <motion.p
            className="text-lg max-w-2xl mx-auto leading-relaxed font-light"
            style={{ color: "#d8d2c6", opacity: 0.9 }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            Sacred spaces for transformation through conscious breathwork,
            ancestral healing practices, and guided inner journeys.
          </motion.p>
        </motion.div>

        {/* Filter buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-16 max-w-7xl mx-auto relative z-10"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
            <motion.button
              key={level}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setFilter(
                  level as "All" | "Beginner" | "Intermediate" | "Advanced"
                )
              }
              className={filter === level ? "btn-primary" : "btn-secondary"}
            >
              {level}
            </motion.button>
          ))}
        </motion.div>

        {/* Sessions grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto pb-20"
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            delay: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: 1.0 + index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-black/50 transition-all duration-300 border border-primary-300/20 hover:border-primary-300/40"
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-primary-400 to-secondary-400">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Difficulty badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      session.difficulty === "Beginner"
                        ? "bg-green-100 text-green-800"
                        : session.difficulty === "Intermediate"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {session.difficulty}
                  </span>
                </div>

                {/* Duration */}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {session.duration}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "#d8d2c6" }}
                >
                  {session.title}
                </h3>

                <p
                  className="mb-4 line-clamp-3"
                  style={{ color: "#d8d2c6", opacity: 0.8 }}
                >
                  {session.description}
                </p>

                {/* Benefits */}
                <motion.div
                  className="mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <h4
                    className="text-sm font-semibold mb-2"
                    style={{ color: "#d8d2c6" }}
                  >
                    Benefits:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {session.benefits.map((benefit, index) => (
                      <motion.span
                        key={index}
                        className="px-3 py-1 text-sm rounded-full bg-primary-300/20 border border-primary-300/30"
                        style={{ color: "#d8d2c6" }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                          duration: 0.4,
                          delay: 0.3 + index * 0.1,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {benefit}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Action button */}
                <motion.button
                  onClick={() => setSelectedSession(session)}
                  className="w-full btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  Watch Session
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Video modal placeholder */}
        {selectedSession && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              whileInView={{ scale: 1, opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedSession.title}
                  </h3>
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Video placeholder */}
                <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-10 h-10"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-lg">Video: {selectedSession.title}</p>
                    <p className="text-sm opacity-75">
                      Duration: {selectedSession.duration}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700">{selectedSession.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
