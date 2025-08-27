"use client";

import { motion } from "framer-motion";

export default function ProductDiscountSection() {
  return (
    <section className="pt-36 pb-24 relative">
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
        {/* Page Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ y: 60, opacity: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.h1
            className="text-5xl lg:text-7xl font-light mb-8 tracking-wide"
            style={{ color: "#d8d2c6" }}
            initial={{ y: 30, opacity: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            SACRED COLLECTION
          </motion.h1>
          <motion.p
            className="text-xl max-w-3xl mx-auto leading-relaxed font-light"
            style={{ color: "#d8d2c6", opacity: 0.9 }}
            initial={{ y: 30, opacity: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            Enhance your spiritual practice with our curated collection of
            sacred healing tools, crystals, oils, and ritual items chosen to
            support your transformation and awakening.
          </motion.p>
        </motion.div>

        {/* Main Product Card */}
        <motion.div
          className="max-w-5xl mx-auto mb-20"
          initial={{ y: 60, opacity: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.div
            className="bg-black/40 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-primary-300/20"
            initial={{ scale: 0.95, opacity: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* Hero Section */}
            <div className="relative h-96 bg-gradient-to-br from-gold/30 via-primary-300/20 to-secondary-400/30">
              <div className="absolute inset-0 bg-black/20"></div>

              {/* Floating Elements */}
              <div className="absolute top-8 left-8 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
              <div className="absolute top-16 right-12 w-2 h-2 bg-white/40 rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-12 left-16 w-3 h-3 bg-white/20 rounded-full animate-pulse delay-700"></div>
              <div className="absolute bottom-8 right-8 w-5 h-5 bg-white/25 rounded-full animate-pulse delay-500"></div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-light mb-3">
                    Sacred Healing Tools
                  </h2>
                  <p className="text-xl opacity-90 mb-4">
                    Crystals • Oils • Ritual Items • Oracle Decks
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="bg-red-500/90 text-white px-4 py-2 rounded-full text-sm font-bold border border-red-400/50 animate-pulse">
                      30% OFF
                    </span>
                    <span className="bg-primary-300/20 text-primary-300 px-4 py-2 rounded-full text-sm font-medium border border-primary-300/30">
                      Limited Time
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column - Product Details */}
                <div>
                  <h3
                    className="text-2xl font-light mb-6"
                    style={{ color: "#d8d2c6" }}
                  >
                    Transform Your Spiritual Practice
                  </h3>

                  <p
                    className="mb-8 leading-relaxed"
                    style={{ color: "#d8d2c6", opacity: 0.9 }}
                  >
                    Enhance your spiritual practice with our curated collection
                    of sacred healing tools. From high-vibrational crystals to
                    pure essential oils and ritual items, each piece is chosen
                    to support your journey of transformation and awakening.
                  </p>

                  {/* Product Categories */}
                  <div className="space-y-4 mb-8">
                    <h4
                      className="text-lg font-medium mb-4"
                      style={{ color: "#d8d2c6" }}
                    >
                      Sacred Categories:
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        "Premium crystals & healing stones",
                        "Pure therapeutic grade essential oils",
                        "Hand-poured ritual candles",
                        "Oracle decks & divination tools",
                        "Sacred jewelry & talismans",
                        "Meditation cushions & altars",
                        "Sage bundles & cleansing tools",
                        "Crystal grids & sacred geometry",
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-primary-300/20 rounded-full flex items-center justify-center border border-primary-300/30">
                            <svg
                              className="w-3 h-3 text-primary-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span style={{ color: "#d8d2c6", opacity: 0.8 }}>
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Pricing & Offers */}
                <div>
                  {/* Limited Time Offer */}
                  <div className="bg-red-500/10 rounded-2xl p-6 mb-8 border border-red-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <svg
                        className="w-6 h-6 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <h3
                          className="font-medium"
                          style={{ color: "#d8d2c6" }}
                        >
                          Limited Time Offer
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: "#d8d2c6", opacity: 0.7 }}
                        >
                          Ends January 31st, 2024
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-light text-red-400 mb-1">
                          30% OFF
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: "#d8d2c6", opacity: 0.7 }}
                        >
                          All healing tools
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-light text-green-400 mb-1">
                          FREE
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: "#d8d2c6", opacity: 0.7 }}
                        >
                          Shipping worldwide
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Special Bundles */}
                  <div className="space-y-3 mb-8">
                    <h4
                      className="text-lg font-medium mb-4"
                      style={{ color: "#d8d2c6" }}
                    >
                      Sacred Bundles:
                    </h4>
                    {[
                      {
                        name: "Beginner's Sacred Kit",
                        original: 127,
                        sale: 89,
                        desc: "Perfect for starting your journey",
                      },
                      {
                        name: "Advanced Healer Collection",
                        original: 347,
                        sale: 243,
                        desc: "For experienced practitioners",
                      },
                      {
                        name: "Complete Sacred Arsenal",
                        original: 697,
                        sale: 488,
                        featured: true,
                        desc: "Everything you need",
                      },
                    ].map((bundle, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          bundle.featured
                            ? "bg-gold/10 border-gold/30"
                            : "bg-black/20 border-primary-300/10"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span
                              className="font-medium"
                              style={{ color: "#d8d2c6" }}
                            >
                              {bundle.name}
                            </span>
                            <p
                              className="text-xs"
                              style={{ color: "#d8d2c6", opacity: 0.6 }}
                            >
                              {bundle.desc}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className="text-sm line-through"
                              style={{ color: "#d8d2c6", opacity: 0.5 }}
                            >
                              ${bundle.original}
                            </span>
                            <span
                              className={`text-lg font-bold ml-2 ${
                                bundle.featured ? "text-gold" : "text-green-400"
                              }`}
                            >
                              ${bundle.sale}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <a
                    href="https://sandsymes.com/sacred-collection"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full btn-primary py-4 text-center font-medium text-lg transform hover:scale-105 shadow-lg mb-4"
                  >
                    Shop Sacred Collection
                  </a>

                  <p
                    className="text-center text-sm"
                    style={{ color: "#d8d2c6", opacity: 0.6 }}
                  >
                    ⏰ Offer expires in 7 days • Use code: SACRED30
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Product Highlights Grid */}
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ y: 60, opacity: 0 }}
          transition={{
            duration: 0.8,
            delay: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.div className="text-center mb-12">
            <motion.h2
              className="text-3xl lg:text-4xl font-light mb-6"
              style={{ color: "#d8d2c6" }}
            >
              SACRED CATEGORIES
            </motion.h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "#d8d2c6", opacity: 0.9 }}
            >
              Discover our carefully curated categories of sacred healing tools,
              each designed to support your spiritual journey and
              transformation.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ y: 40, opacity: 0 }}
            transition={{
              duration: 0.8,
              delay: 1.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {[
              {
                icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
                title: "Premium Crystals",
                desc: "Hand-selected high-vibration stones for healing and manifestation",
                color: "gold",
                features: [
                  "Clear Quartz",
                  "Amethyst",
                  "Rose Quartz",
                  "Citrine",
                ],
              },
              {
                icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
                title: "Sacred Oils",
                desc: "Pure therapeutic grade essences for aromatherapy and ritual",
                color: "primary",
                features: ["Lavender", "Frankincense", "Sage", "Rose"],
              },
              {
                icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z",
                title: "Ritual Candles",
                desc: "Hand-poured candles with intention for sacred ceremonies",
                color: "sage",
                features: [
                  "Soy Wax",
                  "Essential Oils",
                  "Crystal Infused",
                  "Hand-Poured",
                ],
              },
              {
                icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                title: "Oracle Decks",
                desc: "Divination and guidance tools for spiritual insight",
                color: "secondary",
                features: [
                  "Moon Phases",
                  "Sacred Feminine",
                  "Elemental",
                  "Ancestral",
                ],
              },
            ].map((category, index) => (
              <div
                key={index}
                className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-primary-300/20 hover:border-primary-300/40 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div
                  className={`w-16 h-16 bg-${category.color}/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-${category.color}/30`}
                >
                  <svg
                    className={`w-8 h-8 text-${category.color}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={category.icon}
                    />
                  </svg>
                </div>

                <h3
                  className="text-xl font-light mb-3 text-center"
                  style={{ color: "#d8d2c6" }}
                >
                  {category.title}
                </h3>

                <p
                  className="text-sm mb-4 text-center"
                  style={{ color: "#d8d2c6", opacity: 0.8 }}
                >
                  {category.desc}
                </p>

                <div className="space-y-2">
                  {category.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 bg-${category.color}/40 rounded-full`}
                      ></div>
                      <span
                        className="text-xs"
                        style={{ color: "#d8d2c6", opacity: 0.7 }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
