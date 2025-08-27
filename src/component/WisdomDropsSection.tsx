"use client";

import { useState } from "react";

interface WisdomDrop {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category:
    | "Spiritual"
    | "Healing"
    | "Manifestation"
    | "Relationships"
    | "Purpose";
  readTime: string;
  publishedDate: string;
  tags: string[];
}

const wisdomDrops: WisdomDrop[] = [
  {
    id: "1",
    title: "The Sacred Pause: Finding Stillness in Chaos",
    excerpt:
      "In moments of overwhelming energy, the sacred pause becomes our greatest teacher...",
    content: `In moments of overwhelming energy, the sacred pause becomes our greatest teacher. When life feels like a whirlwind of demands, emotions, and endless to-dos, we often forget the profound power that lies in simply stopping.

The sacred pause is not about escaping reality—it's about meeting it with presence. It's the conscious choice to breathe, to feel your feet on the ground, to remember that you are not your thoughts or your circumstances. You are the aware presence observing them.

When we pause, we create space. In that space, wisdom can arise. Solutions that seemed impossible become clear. Emotions that felt overwhelming can be felt and released. The nervous system can reset, and we can respond rather than react.

Practice the sacred pause today. When you feel triggered, overwhelmed, or scattered, simply stop. Place your hand on your heart. Take three deep breaths. Ask yourself: "What do I need right now?" Trust what arises.

Remember, beloved: You are not meant to live in constant motion. You are a spiritual being having a human experience, and part of that experience is learning to dance between doing and being, movement and stillness, effort and surrender.`,
    image: "/api/placeholder/600/400",
    category: "Spiritual",
    readTime: "3 min",
    publishedDate: "2024-01-15",
    tags: ["mindfulness", "presence", "peace"],
  },
  {
    id: "2",
    title: "Healing the Inner Child Through Self-Compassion",
    excerpt:
      "Your inner child holds both your deepest wounds and your greatest gifts...",
    content: `Your inner child holds both your deepest wounds and your greatest gifts. She remembers what it felt like to believe in magic, to trust completely, to love without conditions. She also carries the pain of moments when that trust was broken, when love felt conditional, when magic seemed to disappear.

Healing the inner child is not about fixing or changing her. It's about offering her what she needed then but didn't receive: unconditional love, safety, and the permission to be exactly as she is.

Begin by acknowledging her presence. Place your hand on your heart and speak to her gently: "I see you. I'm here now. You are safe with me." Notice what emotions arise. Allow them without judgment.

The inner child heals through play, creativity, and wonder. She heals when we choose curiosity over criticism, when we celebrate small joys, when we allow ourselves to dream again. She heals when we stop abandoning ourselves in pursuit of others' approval.

Your inner child is not a burden to heal—she is a gift to reclaim. She holds your authentic self, your natural joy, your innate wisdom. When you love her back to wholeness, you reclaim these parts of yourself.

Today, do something that would make your inner child smile. Dance to your favorite song. Create something with your hands. Look at the world with wonder. She's been waiting for you to come home to her.`,
    image: "/api/placeholder/600/400",
    category: "Healing",
    readTime: "4 min",
    publishedDate: "2024-01-12",
    tags: ["inner child", "healing", "self-love"],
  },
  {
    id: "3",
    title: "The Art of Conscious Manifestation",
    excerpt:
      "True manifestation is not about forcing the universe to give you what you want...",
    content: `True manifestation is not about forcing the universe to give you what you want. It's about aligning with who you truly are and allowing life to flow through you in its highest expression.

Most of us have been taught that manifestation is about visualization, affirmations, and positive thinking. While these tools can be helpful, they miss the deeper truth: you are already whole, already abundant, already everything you seek to become.

Conscious manifestation begins with presence. It starts with loving what is before trying to create what isn't. When we resist our current reality, we create energetic blocks that prevent new possibilities from flowing to us.

The secret is to embody the feeling of what you desire while being completely at peace with not having it. This paradox dissolves the desperate energy that repels our desires and opens us to receive in ways we never imagined.

Ask yourself: "Who would I be if I already had everything I desire?" Then be that person now. Not as a strategy to get what you want, but as a celebration of who you already are.

Your desires are not random. They are soul whispers, calling you toward your highest expression. Trust them. Follow them. But hold them lightly, knowing that what's meant for you will always find you, often in ways more beautiful than you could have planned.`,
    image: "/api/placeholder/600/400",
    category: "Manifestation",
    readTime: "5 min",
    publishedDate: "2024-01-10",
    tags: ["manifestation", "abundance", "alignment"],
  },
  {
    id: "4",
    title: "Sacred Boundaries: Love Without Losing Yourself",
    excerpt:
      "Boundaries are not walls that keep love out—they are gardens that help love flourish...",
    content: `Boundaries are not walls that keep love out—they are gardens that help love flourish. They create the sacred space where authentic relationship can bloom.

Many of us were taught that love means saying yes to everything, being available always, putting others' needs before our own. But this isn't love—it's self-abandonment. And when we abandon ourselves, we have nothing authentic to offer others.

Setting boundaries is an act of love, both for yourself and for others. When you honor your own needs, you teach others how to treat you. When you speak your truth with kindness, you create space for others to do the same.

Boundaries are not about controlling others—they're about taking responsibility for your own energy and well-being. They're about saying "yes" to what aligns with your values and "no" to what doesn't, without guilt or explanation.

Start small. Notice where you feel resentful or drained in your relationships. These are signs that boundaries are needed. Practice saying "Let me think about that" instead of automatically saying yes. Honor your energy as sacred.

Remember: You can love someone deeply and still have limits. You can be compassionate without being a doormat. You can care for others while still caring for yourself. In fact, this is the only way to love sustainably.

Your boundaries are a gift to the world. They allow your authentic self to shine, and that authenticity is what creates real intimacy and connection.`,
    image: "/api/placeholder/600/400",
    category: "Relationships",
    readTime: "4 min",
    publishedDate: "2024-01-08",
    tags: ["boundaries", "relationships", "self-care"],
  },
  {
    id: "5",
    title: "Finding Your Soul Purpose in the Everyday",
    excerpt:
      "Your purpose is not something you need to find—it's something you need to remember...",
    content: `Your purpose is not something you need to find—it's something you need to remember. It's not a job title or a grand mission statement. It's the unique way your soul expresses love in the world.

We've been conditioned to believe that purpose must be big, visible, and impressive. But what if your purpose is simply to bring more kindness to your daily interactions? What if it's to create beauty in small moments? What if it's to heal your own wounds so deeply that others feel permission to heal theirs?

Your purpose lives in the intersection of your gifts, your passions, and the world's needs. But more than that, it lives in your willingness to show up authentically, moment by moment, day by day.

Purpose is not a destination—it's a way of being. It's choosing love over fear, presence over distraction, authenticity over performance. It's saying yes to what lights you up and no to what dims your light.

Stop waiting for your purpose to be revealed in some dramatic moment. Start paying attention to what already brings you alive. What activities make you lose track of time? What causes make your heart beat faster? What compliments do you receive that you brush off as "nothing special"?

Your purpose is already here, woven into the fabric of your daily life. It's in the way you listen to a friend, the way you solve problems, the way you see beauty where others see ordinary. Trust it. Honor it. Let it guide you home to yourself.

You don't need to change the world to live your purpose. You just need to be fully, authentically you. The world needs exactly what you have to offer.`,
    image: "/api/placeholder/600/400",
    category: "Purpose",
    readTime: "5 min",
    publishedDate: "2024-01-05",
    tags: ["purpose", "authenticity", "calling"],
  },
];

export default function WisdomDropsSection() {
  const [selectedDrop, setSelectedDrop] = useState<WisdomDrop | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<
    | "All"
    | "Spiritual"
    | "Healing"
    | "Manifestation"
    | "Relationships"
    | "Purpose"
  >("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDrops = wisdomDrops.filter((drop) => {
    const matchesCategory =
      categoryFilter === "All" || drop.category === categoryFilter;
    const matchesSearch =
      drop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drop.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drop.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const categories = [
    "All",
    "Spiritual",
    "Healing",
    "Manifestation",
    "Relationships",
    "Purpose",
  ];

  return (
    <section id="wisdom" className="pt-36 pb-24 relative">
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
            WISDOM DROPS
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed font-light"
            style={{ color: "#d8d2c6", opacity: 0.9 }}
          >
            Sacred insights and gentle wisdom for your spiritual journey. Each
            drop is crafted with love to support your growth, healing, and
            awakening.
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-12">
          {/* Search bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search wisdom drops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-primary-300/30 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-300/50 focus:border-primary-300/50 bg-black/30 backdrop-blur-sm placeholder-primary-300/60"
                style={{ color: "#d8d2c6" }}
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-300/70"
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
                      | "Spiritual"
                      | "Healing"
                      | "Manifestation"
                      | "Relationships"
                      | "Purpose"
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

        {/* Wisdom drops grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDrops.map((drop) => (
            <article
              key={drop.id}
              className="bg-black/40 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-primary-300/20"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-gold/20 to-primary-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <svg
                      className="w-16 h-16 mx-auto mb-2 opacity-60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <span className="text-sm font-medium">Wisdom Drop</span>
                  </div>
                </div>

                {/* Category badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      drop.category === "Spiritual"
                        ? "bg-purple-100 text-purple-800"
                        : drop.category === "Healing"
                        ? "bg-green-100 text-green-800"
                        : drop.category === "Manifestation"
                        ? "bg-yellow-100 text-yellow-800"
                        : drop.category === "Relationships"
                        ? "bg-pink-100 text-pink-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {drop.category}
                  </span>
                </div>

                {/* Read time */}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {drop.readTime} read
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className="text-xl font-bold mb-3 line-clamp-2"
                  style={{ color: "#d8d2c6" }}
                >
                  {drop.title}
                </h3>

                <p
                  className="mb-4 line-clamp-3"
                  style={{ color: "#d8d2c6", opacity: 0.8 }}
                >
                  {drop.excerpt}
                </p>

                {/* Meta info */}
                <div
                  className="flex items-center justify-between mb-4 text-sm"
                  style={{ color: "#d8d2c6", opacity: 0.6 }}
                >
                  <span>
                    {new Date(drop.publishedDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>{drop.readTime}</span>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {drop.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gold/20 text-gold text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => setSelectedDrop(drop)}
                  className="w-full btn-primary py-3 font-semibold"
                >
                  Read Wisdom Drop
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* No results message */}
        {filteredDrops.length === 0 && (
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
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "#d8d2c6" }}
            >
              No wisdom drops found
            </h3>
            <p style={{ color: "#d8d2c6", opacity: 0.8 }}>
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Reading modal */}
        {selectedDrop && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-black/90 backdrop-blur-sm rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto border border-primary-300/20">
              <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 mr-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedDrop.category === "Spiritual"
                            ? "bg-purple-100 text-purple-800"
                            : selectedDrop.category === "Healing"
                            ? "bg-green-100 text-green-800"
                            : selectedDrop.category === "Manifestation"
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedDrop.category === "Relationships"
                            ? "bg-pink-100 text-pink-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {selectedDrop.category}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: "#d8d2c6", opacity: 0.6 }}
                      >
                        {selectedDrop.readTime}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: "#d8d2c6", opacity: 0.6 }}
                      >
                        {new Date(
                          selectedDrop.publishedDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <h1
                      className="text-3xl font-bold mb-4"
                      style={{ color: "#d8d2c6" }}
                    >
                      {selectedDrop.title}
                    </h1>
                  </div>
                  <button
                    onClick={() => setSelectedDrop(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl flex-shrink-0"
                  >
                    ×
                  </button>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  {selectedDrop.content
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="mb-6 leading-relaxed"
                        style={{ color: "#d8d2c6", opacity: 0.9 }}
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>

                {/* Tags */}
                <div className="mt-8 pt-6 border-t border-primary-300/20">
                  <div className="flex flex-wrap gap-2">
                    {selectedDrop.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gold/20 text-gold text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
