"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Alex_Brush, Noto_Serif_JP } from "next/font/google";
import { useSession } from "next-auth/react";
import { SignOut } from "@/component/common/SignOut";
import { ChevronDown, User, Settings } from "lucide-react";

const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: "400",
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: "200",
});

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const username = session?.user?.name || "sandsymes";

  // Check if user has valid subscription
  const hasValidSubscription =
    session?.user?.subscriptionTier &&
    session?.user?.subscriptionStatus === "active" &&
    ["tier1", "tier2"].includes(session.user.subscriptionTier as string);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    {
      label: "ABJ Recordings",
      href: "/abj-recordings",
    },
    {
      label: "Group Workshops",
      href: "/group-workshops",
    },
  ];

  return (
    <header className="bg-transparent backdrop-blur-sm top-0 z-50 border-b border-primary-300/20 fixed w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-300/20 flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="Sand Symes Logo"
                width={40}
                height={40}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
            </div>
            <h1
              className={`text-lg sm:text-xl lg:text-2xl font-light text-primary-300 tracking-wide ${notoSerifJP.className}`}
            >
              <span
                className={`${alexBrush.className} text-xl sm:text-2xl lg:text-3xl`}
              >
                S
              </span>
              AND{" "}
              <span
                className={`${alexBrush.className} text-xl sm:text-2xl lg:text-3xl`}
              >
                S
              </span>
              YMES
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Only show navigation items if user has valid subscription */}
            {hasValidSubscription && (
              <>
                {/* Sacred Wisdom Dropdown */}
                <div
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown("wisdom")}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="px-4 py-2 text-sm text-primary-300 hover:bg-white/10 rounded-full transition-all duration-200 flex items-center gap-1">
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
                  className="px-4 py-2 text-sm text-primary-300 hover:bg-white/10 rounded-full transition-all duration-200"
                >
                  RESOURCES
                </Link>
                <Link
                  href="/oracle"
                  className="px-4 py-2 text-sm font-medium text-primary-300 hover:bg-white/10 rounded-full transition-all duration-200"
                >
                  AO
                </Link>
              </>
            )}

            {session ? (
              <div className="relative ml-4" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-3 rounded-full text-primary-300 border border-primary-300/20 hover:bg-white/10 hover:border-primary-300 transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{username}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isUserDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm border border-primary-300/20 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-primary-300/10">
                        <p className="text-sm font-medium text-primary-300">
                          {username}
                        </p>
                        <p className="text-xs text-primary-300/60">
                          {session.user.email}
                        </p>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-primary-300/80 hover:bg-white/10 hover:text-primary-300 transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-primary-300/80 hover:bg-white/10 hover:text-primary-300 transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>

                      <div className="border-t border-primary-300/10 pt-2 px-2">
                        <SignOut className="w-full border border-primary-300/20 hover:border-primary-300/30 hover:bg-white/10 transition-all duration-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn-secondary ml-4">
                Sign In
              </Link>
            )}
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
              {/* Only show navigation items if user has valid subscription */}
              {hasValidSubscription && (
                <>
                  {/* Sacred Wisdom */}
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
                </>
              )}

              {/* User Actions */}
              <div className="mt-4 px-3">
                {session ? (
                  <div className="space-y-2">
                    <div className="text-center text-primary-300 text-sm py-2">
                      {username}
                    </div>
                    <SignOut />
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full text-center btn-secondary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
