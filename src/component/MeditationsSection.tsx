"use client";

import { useState } from "react";

interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: "Mindfulness" | "Healing" | "Sleep" | "Manifestation";
  instructor: string;
  thumbnail: string;
  videoUrl: string;
  tags: string[];
}

const meditations: Meditation[] = [
  {
    id: "1",
    title: "Morning Light Meditation",
    description:
      "Begin your day with gentle awareness and gratitude, connecting to your inner light.",
    duration: "10 min",
    category: "Mindfulness",
    instructor: "Sand Symes",
    thumbnail: "/api/placeholder/400/225",
    videoUrl: "#",
    tags: ["morning", "gratitude", "awareness"],
  },
  {
    id: "2",
    title: "Heart Healing Journey",
    description:
      "A deep meditation to heal emotional wounds and open your heart to love and compassion.",
    duration: "25 min",
    category: "Healing",
    instructor: "Sand Symes",
    thumbnail: "/api/placeholder/400/225",
    videoUrl: "#",
    tags: ["healing", "heart", "compassion"],
  },
  {
    id: "3",
    title: "Sacred Sleep Preparation",
    description:
      "Gentle meditation to release the day and prepare your mind and body for restorative sleep.",
    duration: "20 min",
    category: "Sleep",
    instructor: "Sand Symes",
    thumbnail: "/api/placeholder/400/225",
    videoUrl: "#",
    tags: ["sleep", "relaxation", "evening"],
  },
  {
    id: "4",
    title: "Manifestation Activation",
    description:
      "Align with your highest potential and call in your deepest desires through focused intention.",
    duration: "30 min",
    category: "Manifestation",
    instructor: "Sand Symes",
    thumbnail: "/api/placeholder/400/225",
    videoUrl: "#",
    tags: ["manifestation", "intention", "abundance"],
  },
  {
    id: "5",
    title: "Body Wisdom Meditation",
    description:
      "Connect with the intelligence of your body and receive its messages and guidance.",
    duration: "18 min",
    category: "Healing",
    instructor: "Sand Symes",
    thumbnail: "/api/placeholder/400/225",
    videoUrl: "#",
    tags: ["body", "wisdom", "intuition"],
  },
  {
    id: "6",
    title: "Present Moment Awareness",
    description:
      "Cultivate deep presence and awareness of the eternal now through mindful observation.",
    duration: "15 min",
    category: "Mindfulness",
    instructor: "Sand Symes",
    thumbnail: "/api/placeholder/400/225",
    videoUrl: "#",
    tags: ["presence", "awareness", "mindfulness"],
  },
];

export default function MeditationsSection() {
  const [selectedMeditation, setSelectedMeditation] =
    useState<Meditation | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<
    "All" | "Mindfulness" | "Healing" | "Sleep" | "Manifestation"
  >("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMeditations = meditations.filter((meditation) => {
    const matchesCategory =
      categoryFilter === "All" || meditation.category === categoryFilter;
    const matchesSearch =
      meditation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meditation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meditation.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const categories = [
    "All",
    "Mindfulness",
    "Healing",
    "Sleep",
    "Manifestation",
  ];

  return (
    <section id="meditations" className="pt-36 pb-24 relative">
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
            GUIDED MEDITATIONS
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed font-light"
            style={{ color: "#d8d2c6", opacity: 0.9 }}
          >
            Journey inward with carefully crafted meditations designed to bring
            peace, healing, and spiritual connection to your daily practice.
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-12">
          {/* Search bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search meditations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setCategoryFilter(
                    category as
                      | "All"
                      | "Mindfulness"
                      | "Healing"
                      | "Sleep"
                      | "Manifestation"
                  )
                }
                className={
                  categoryFilter === category ? "btn-primary" : "btn-secondary"
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Meditations grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMeditations.map((meditation) => (
            <div
              key={meditation.id}
              className="bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-black/50 transition-all duration-300 border border-primary-300/20 hover:border-primary-300/40"
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-sage to-sage-light">
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

                {/* Category badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      meditation.category === "Mindfulness"
                        ? "bg-blue-100 text-blue-800"
                        : meditation.category === "Healing"
                        ? "bg-green-100 text-green-800"
                        : meditation.category === "Sleep"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {meditation.category}
                  </span>
                </div>

                {/* Duration */}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {meditation.duration}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "#d8d2c6" }}
                >
                  {meditation.title}
                </h3>

                <p
                  className="mb-4 line-clamp-3"
                  style={{ color: "#d8d2c6", opacity: 0.8 }}
                >
                  {meditation.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-primary-300/20 rounded-full flex items-center justify-center mr-3">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#d8d2c6" }}
                    >
                      {meditation.instructor
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <span
                    className="text-sm"
                    style={{ color: "#d8d2c6", opacity: 0.8 }}
                  >
                    with {meditation.instructor}
                  </span>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {meditation.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-primary-300/20 border border-primary-300/30"
                        style={{ color: "#d8d2c6" }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => setSelectedMeditation(meditation)}
                  className="w-full btn-primary"
                >
                  Begin Meditation
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredMeditations.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No meditations found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Video modal */}
        {selectedMeditation && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedMeditation.title}
                    </h3>
                    <p className="text-gray-600">
                      with {selectedMeditation.instructor}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedMeditation(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Video placeholder */}
                <div className="aspect-video bg-gradient-to-br from-sage to-sage-light rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                      <svg
                        className="w-10 h-10"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold">
                      {selectedMeditation.title}
                    </p>
                    <p className="text-sm opacity-75">
                      Duration: {selectedMeditation.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedMeditation.category === "Mindfulness"
                        ? "bg-blue-100 text-blue-800"
                        : selectedMeditation.category === "Healing"
                        ? "bg-green-100 text-green-800"
                        : selectedMeditation.category === "Sleep"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedMeditation.category}
                  </span>
                  <span className="text-sm text-gray-600">
                    {selectedMeditation.duration}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">
                  {selectedMeditation.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedMeditation.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
