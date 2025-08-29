"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface MiniChallenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Advanced";
  category:
    | "Mindfulness"
    | "Self-Love"
    | "Manifestation"
    | "Healing"
    | "Connection";
  instructions: string[];
  videoExplanation: string;
  benefits: string[];
  completedBy?: number;
}

const miniChallenges: MiniChallenge[] = [
  {
    id: "1",
    title: "7-Day Gratitude Awakening",
    description:
      "Transform your perspective and raise your vibration through the sacred practice of gratitude.",
    duration: "7 days",
    difficulty: "Easy",
    category: "Mindfulness",
    videoExplanation: "#",
    instructions: [
      "Each morning, write down 3 things you're grateful for before checking your phone",
      "Include one thing you're grateful for about yourself",
      "Share your gratitude with someone you love each day",
      "Before bed, reflect on the best moment of your day",
      "Notice how your energy shifts as you practice",
    ],
    benefits: [
      "Increased joy",
      "Higher vibration",
      "Improved relationships",
      "Better sleep",
    ],
    completedBy: 1247,
  },
  {
    id: "2",
    title: "Sacred Self-Love Ritual",
    description:
      "Develop a deeper, more compassionate relationship with yourself through daily acts of self-love.",
    duration: "5 days",
    difficulty: "Medium",
    category: "Self-Love",
    videoExplanation: "#",
    instructions: [
      "Create a sacred space in your home dedicated to self-care",
      "Each day, speak loving affirmations to yourself in the mirror",
      "Practice one act of physical self-care (bath, massage, gentle movement)",
      "Write yourself a love letter acknowledging your growth and beauty",
      "Set a loving boundary with someone or something that drains your energy",
    ],
    benefits: [
      "Increased self-worth",
      "Better boundaries",
      "Inner peace",
      "Authentic confidence",
    ],
    completedBy: 892,
  },
  {
    id: "3",
    title: "Manifestation Magic Week",
    description:
      "Align with your desires and call in what your soul is seeking through focused intention.",
    duration: "7 days",
    difficulty: "Advanced",
    category: "Manifestation",
    videoExplanation: "#",
    instructions: [
      "Get crystal clear on what you want to manifest - write it in detail",
      "Create a vision board or visual representation of your desire",
      "Practice embodying the feeling of already having what you want",
      "Take one aligned action each day toward your manifestation",
      "Release attachment to the outcome and trust divine timing",
      "Notice and celebrate signs that your manifestation is coming",
      "Express gratitude as if it's already yours",
    ],
    benefits: [
      "Clarity on desires",
      "Aligned action",
      "Increased faith",
      "Manifestation skills",
    ],
    completedBy: 634,
  },
  {
    id: "4",
    title: "Inner Child Healing Journey",
    description:
      "Reconnect with and heal your inner child through playful, nurturing practices.",
    duration: "10 days",
    difficulty: "Medium",
    category: "Healing",
    videoExplanation: "#",
    instructions: [
      "Look at photos of yourself as a child and send love to that version of you",
      "Engage in a playful activity you loved as a child",
      "Write a letter to your inner child asking what they need",
      "Practice speaking to yourself with the kindness you needed as a child",
      "Do something creative without judgment - draw, dance, sing",
      "Comfort yourself when triggered, like you would comfort a scared child",
      "Set boundaries that protect your sensitive inner child",
      "Celebrate small wins and acknowledge your progress",
      'Practice saying "I\'m proud of you" to yourself daily',
      "Create a ritual to honor your inner child's healing",
    ],
    benefits: [
      "Emotional healing",
      "Increased creativity",
      "Self-compassion",
      "Inner peace",
    ],
    completedBy: 456,
  },
  {
    id: "5",
    title: "Heart Connection Challenge",
    description:
      "Deepen your connections with others through authentic vulnerability and presence.",
    duration: "5 days",
    difficulty: "Medium",
    category: "Connection",
    videoExplanation: "#",
    instructions: [
      "Have one vulnerable conversation with someone you trust",
      "Practice deep listening - be fully present with someone",
      "Express appreciation to three people in your life",
      "Share something authentic about yourself on social media or with friends",
      "Offer help or support to someone without being asked",
    ],
    benefits: [
      "Deeper relationships",
      "Authentic connection",
      "Increased empathy",
      "Community",
    ],
    completedBy: 723,
  },
  {
    id: "6",
    title: "Energy Protection Practice",
    description:
      "Learn to protect and cleanse your energy while staying open-hearted.",
    duration: "3 days",
    difficulty: "Easy",
    category: "Healing",
    videoExplanation: "#",
    instructions: [
      "Start each day by visualizing a protective bubble of white light around you",
      "Practice grounding by connecting your feet to the earth",
      "Clear your energy after being around negative people or situations",
      "Set energetic boundaries by stating your intentions silently",
      "End each day by releasing any energy that isn't yours",
    ],
    benefits: [
      "Energy protection",
      "Emotional stability",
      "Clearer boundaries",
      "Inner strength",
    ],
    completedBy: 1089,
  },
];

export default function MiniChallengesSection() {
  const [selectedChallenge, setSelectedChallenge] =
    useState<MiniChallenge | null>(null);
  const [filter, setFilter] = useState<"All" | "Easy" | "Medium" | "Advanced">(
    "All"
  );
  const [categoryFilter, setCategoryFilter] = useState<
    | "All"
    | "Mindfulness"
    | "Self-Love"
    | "Manifestation"
    | "Healing"
    | "Connection"
  >("All");

  const filteredChallenges = miniChallenges.filter((challenge) => {
    const matchesDifficulty =
      filter === "All" || challenge.difficulty === filter;
    const matchesCategory =
      categoryFilter === "All" || challenge.category === categoryFilter;
    return matchesDifficulty && matchesCategory;
  });

  const difficulties = ["All", "Easy", "Medium", "Advanced"];
  const categories = [
    "All",
    "Mindfulness",
    "Self-Love",
    "Manifestation",
    "Healing",
    "Connection",
  ];

  return (
    <section id="challenges" className="pt-36 pb-24 relative">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://static.wixstatic.com/media/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg/v1/fill/w_1290,h_848,al_c,q_85,enc_avif,quality_auto/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg')`,
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
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
            MINI CHALLENGES
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
            Transform your life one small step at a time. Each challenge is
            designed to create lasting change through simple, powerful daily
            practices guided by Sand.
          </motion.p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-12 space-y-6"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Difficulty filter */}
          <motion.div
            className="text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <h3
              className="text-sm font-semibold mb-4"
              style={{ color: "#d8d2c6" }}
            >
              Difficulty Level
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {difficulties.map((difficulty, index) => (
                <motion.button
                  key={difficulty}
                  onClick={() =>
                    setFilter(
                      difficulty as "All" | "Easy" | "Medium" | "Advanced"
                    )
                  }
                  className={
                    filter === difficulty ? "btn-primary" : "btn-secondary"
                  }
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 1.0 + index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {difficulty}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Category filter */}
          <motion.div
            className="text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <h3
              className="text-sm font-semibold mb-4"
              style={{ color: "#d8d2c6" }}
            >
              Category
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  onClick={() =>
                    setCategoryFilter(
                      category as
                        | "All"
                        | "Mindfulness"
                        | "Self-Love"
                        | "Manifestation"
                        | "Healing"
                        | "Connection"
                    )
                  }
                  className={
                    categoryFilter === category
                      ? "btn-primary"
                      : "btn-secondary"
                  }
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 1.4 + index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Challenges grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 1.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {filteredChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              className="bg-black/40 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-primary-300/20"
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 1.8 + index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              {/* Header */}
              <div className="relative h-48 bg-gradient-to-br from-sage/20 to-primary-200 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      challenge.category === "Mindfulness"
                        ? "bg-blue-100 text-blue-800"
                        : challenge.category === "Self-Love"
                        ? "bg-pink-100 text-pink-800"
                        : challenge.category === "Manifestation"
                        ? "bg-yellow-100 text-yellow-800"
                        : challenge.category === "Healing"
                        ? "bg-green-100 text-green-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {challenge.category}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      challenge.difficulty === "Easy"
                        ? "bg-green-100 text-green-800"
                        : challenge.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {challenge.difficulty}
                  </span>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <svg
                      className="w-8 h-8 text-sage"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="bg-black/20 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {challenge.duration}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: "#d8d2c6" }}
                >
                  {challenge.title}
                </h3>

                <p
                  className="mb-4 line-clamp-3"
                  style={{ color: "#d8d2c6", opacity: 0.8 }}
                >
                  {challenge.description}
                </p>

                {/* Stats */}
                <div
                  className="flex items-center justify-between mb-6 text-sm"
                  style={{ color: "#d8d2c6", opacity: 0.6 }}
                >
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {challenge.completedBy?.toLocaleString()} completed
                  </span>
                  <span>{challenge.instructions.length} steps</span>
                </div>

                {/* Benefits preview */}
                <div className="mb-6">
                  <h4
                    className="text-sm font-semibold mb-2"
                    style={{ color: "#d8d2c6" }}
                  >
                    Key Benefits:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {challenge.benefits.slice(0, 2).map((benefit, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-sage/20 text-sage text-sm rounded-full"
                      >
                        {benefit}
                      </span>
                    ))}
                    {challenge.benefits.length > 2 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        +{challenge.benefits.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action button */}
                <motion.button
                  onClick={() => setSelectedChallenge(challenge)}
                  className="w-full btn-primary py-3 font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Challenge
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Challenge details modal */}
        {selectedChallenge && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-black/90 backdrop-blur-sm rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto border border-primary-300/20"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 mr-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedChallenge.category === "Mindfulness"
                            ? "bg-blue-100 text-blue-800"
                            : selectedChallenge.category === "Self-Love"
                            ? "bg-pink-100 text-pink-800"
                            : selectedChallenge.category === "Manifestation"
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedChallenge.category === "Healing"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {selectedChallenge.category}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedChallenge.difficulty === "Easy"
                            ? "bg-green-100 text-green-800"
                            : selectedChallenge.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedChallenge.difficulty}
                      </span>
                      <span className="text-sm text-gray-600">
                        {selectedChallenge.duration}
                      </span>
                    </div>
                    <h1
                      className="text-3xl font-bold mb-4"
                      style={{ color: "#d8d2c6" }}
                    >
                      {selectedChallenge.title}
                    </h1>
                  </div>
                  <button
                    onClick={() => setSelectedChallenge(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl flex-shrink-0"
                  >
                    ×
                  </button>
                </div>

                <p
                  className="text-lg mb-8"
                  style={{ color: "#d8d2c6", opacity: 0.8 }}
                >
                  {selectedChallenge.description}
                </p>

                {/* Video explanation placeholder */}
                <div className="mb-8">
                  <h3
                    className="text-xl font-bold mb-4"
                    style={{ color: "#d8d2c6" }}
                  >
                    Sand&apos;s Explanation
                  </h3>
                  <div className="aspect-video bg-gradient-to-br from-sage/20 to-primary-200 rounded-lg flex items-center justify-center">
                    <div
                      className="text-center"
                      style={{ color: "#d8d2c6", opacity: 0.8 }}
                    >
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <svg
                          className="w-10 h-10"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium">
                        Watch Sand explain this challenge
                      </p>
                      <p className="text-sm opacity-75">
                        Get the full context and motivation
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mb-8">
                  <h3
                    className="text-xl font-bold mb-4"
                    style={{ color: "#d8d2c6" }}
                  >
                    Challenge Steps
                  </h3>
                  <div className="space-y-4">
                    {selectedChallenge.instructions.map(
                      (instruction, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 bg-black/20 rounded-lg border border-primary-300/20"
                        >
                          <div className="w-8 h-8 bg-primary-300 text-black rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                            {index + 1}
                          </div>
                          <p
                            className="flex-1"
                            style={{ color: "#d8d2c6", opacity: 0.9 }}
                          >
                            {instruction}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-8">
                  <h3
                    className="text-xl font-bold mb-4"
                    style={{ color: "#d8d2c6" }}
                  >
                    What You&apos;ll Gain
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedChallenge.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-sage/10 rounded-lg"
                      >
                        <svg
                          className="w-5 h-5 text-sage flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span style={{ color: "#d8d2c6", opacity: 0.8 }}>
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                  <button className="btn-primary px-8 py-4 text-lg font-semibold transform hover:scale-105">
                    Begin Your Transformation
                  </button>
                  <p
                    className="text-sm mt-3"
                    style={{ color: "#d8d2c6", opacity: 0.6 }}
                  >
                    Join {selectedChallenge.completedBy?.toLocaleString()}{" "}
                    others who have completed this challenge
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
