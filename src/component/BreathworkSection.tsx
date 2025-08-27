"use client";

import { useState } from "react";

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
    <section id="breathwork" className="pt-36 pb-24 relative">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://static.wixstatic.com/media/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg/v1/fill/w_1290,h_848,al_c,q_85,enc_avif,quality_auto/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg')`,
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2
            className="text-4xl lg:text-5xl font-light mb-6 tracking-wide"
            style={{ color: "#d8d2c6" }}
          >
            MEDICINE CONTAINERS
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed font-light"
            style={{ color: "#d8d2c6", opacity: 0.9 }}
          >
            Sacred spaces for transformation through conscious breathwork,
            ancestral healing practices, and guided inner journeys.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
            <button
              key={level}
              onClick={() =>
                setFilter(
                  level as "All" | "Beginner" | "Intermediate" | "Advanced"
                )
              }
              className={filter === level ? "btn-primary" : "btn-secondary"}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Sessions grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
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
                <div className="mb-6">
                  <h4
                    className="text-sm font-semibold mb-2"
                    style={{ color: "#d8d2c6" }}
                  >
                    Benefits:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {session.benefits.map((benefit, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm rounded-full bg-primary-300/20 border border-primary-300/30"
                        style={{ color: "#d8d2c6" }}
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => setSelectedSession(session)}
                  className="w-full btn-primary"
                >
                  Watch Session
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Video modal placeholder */}
        {selectedSession && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
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
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
