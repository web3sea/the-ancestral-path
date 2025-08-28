"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const username = "sandsymes";

  //external links
  const sacredMedicineItems = [
    {
      label: "Medicine Containers",
      href: "https://www.sandsymes.com/sacred-containers",
    },
    {
      label: "Ancestral Breathwork",
      href: "https://www.sandsymes.com/ancestral-breathwork",
    },
    {
      label: "Sacred Medicine Retreat 2025",
      href: "https://www.sandsymes.com/medicine-retreats",
    },
  ];

  //internal links
  const sacredWisdomItems = [
    // {
    //   label: "Breathwork",
    //   href: "/breathwork",
    // },
    {
      label: "Wisdom Drops",
      href: "/wisdom",
    },
    {
      label: "Astrological Download",
      href: "/astrology",
    },
    {
      label: "Mini Challenges",
      href: "/challenges",
    },
    {
      label: "Guided Meditations",
      href: "/meditations",
    },
  ];

  return (
    <header className="bg-transparent backdrop-blur-sm top-0 z-50 border-b border-primary-300/20 fixed w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-300/20 flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="Sand Symes Logo"
                width={40}
                height={40}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
            </div>
            <Link
              href="/"
              className="text-lg sm:text-xl lg:text-2xl font-light text-primary-300 tracking-wide"
            >
              SAND SYMES
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Sacred Medicine Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown("medicine")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="px-4 py-2 text-sm font-medium text-primary-300 hover:bg-white/10 rounded-full transition-all duration-200 flex items-center gap-1">
                SACRED MEDICINE
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {activeDropdown === "medicine" && (
                <div className="absolute top-full left-0 pt-1 w-56 z-50">
                  <div className="bg-black/95 backdrop-blur-sm rounded-lg shadow-lg border border-primary-300/20 py-2">
                    {sacredMedicineItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-primary-300 hover:bg-white/10 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sacred Wisdom Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown("wisdom")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="px-4 py-2 text-sm font-medium text-primary-300 hover:bg-white/10 rounded-full transition-all duration-200 flex items-center gap-1">
                SACRED WISDOM
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {activeDropdown === "wisdom" && (
                <div className="absolute top-full left-0 pt-1 w-56 z-50">
                  <div className="bg-black/95 backdrop-blur-sm rounded-lg shadow-lg border border-primary-300/20 py-2">
                    {sacredWisdomItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-primary-300 hover:bg-white/10 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AO */}
            <Link
              href="/resources"
              className="px-4 py-2 text-sm font-medium text-primary-300 hover:bg-white/10 rounded-full transition-all duration-200"
            >
              Resources
            </Link>
            <Link
              href="/oracle"
              className="px-4 py-2 text-sm font-medium text-primary-300 hover:bg-white/10 rounded-full transition-all duration-200"
            >
              AO
            </Link>

            <Link href="#" className="btn-secondary ml-4">
              {username}
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary-300 hover:text-white focus:outline-none focus:text-white"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/95 border-t border-gray-700">
              {/* Sacred Medicine Group */}
              <div className="px-3 py-2 text-xs font-semibold text-primary-300/60 uppercase tracking-wider">
                Sacred Medicine
              </div>
              {sacredMedicineItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block px-6 py-2 text-primary-300 hover:bg-white/10 rounded-lg text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Sacred Wisdom Group */}
              <div className="px-3 py-2 text-xs font-semibold text-primary-300/60 uppercase tracking-wider mt-4">
                Sacred Wisdom
              </div>
              {sacredWisdomItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block px-6 py-2 text-primary-300 hover:bg-white/10 rounded-lg text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Resources */}

              <Link
                href="/resources"
                className="block px-6 py-2 bg-primary-300/20 text-primary-300 rounded-lg text-sm mx-3"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>

              {/* AO */}
              <Link
                href="/oracle"
                className="block px-6 py-2 bg-primary-300/20 text-primary-300 rounded-lg text-sm mx-3"
                onClick={() => setIsMenuOpen(false)}
              >
                AO
              </Link>

              {/* Contact */}
              <div className="mt-4 px-3">
                <Link
                  href="#"
                  className="block w-full text-center btn-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {username}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
