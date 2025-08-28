import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative py-20 bg-transparent backdrop-blur-sm">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://static.wixstatic.com/media/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg/v1/fill/w_1290,h_848,al_c,q_85,enc_avif,quality_auto/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg')`,
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary-300/20 flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Sand Symes"
                  width={40}
                  height={40}
                />
              </div>
              <h3
                className="text-2xl font-light tracking-wide"
                style={{ color: "#d8d2c6" }}
              >
                SAND SYMES
              </h3>
            </div>
            <p
              className="mb-8 max-w-md leading-relaxed font-light"
              style={{ color: "#d8d2c6", opacity: 0.8 }}
            >
              Modern Medicine Woman guiding souls through transformative healing
              journeys using ancient wisdom and contemporary practices.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.linkedin.com/in/sand-symes/"
                className="transition-colors hover:opacity-100"
                style={{ color: "#d8d2c6", opacity: 0.7 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
              <Link
                href="https://www.instagram.com/sandsymes/"
                className="transition-colors hover:opacity-100"
                style={{ color: "#d8d2c6", opacity: 0.7 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
              <Link
                href="https://calendly.com/sandsymes"
                className="transition-colors hover:opacity-100"
                style={{ color: "#d8d2c6", opacity: 0.7 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-lg font-medium mb-6"
              style={{ color: "#d8d2c6" }}
            >
              Offerings
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://www.sandsymes.com/sacred-containers"
                  className="transition-colors font-light hover:opacity-100"
                  style={{ color: "#d8d2c6", opacity: 0.8 }}
                  target="_blank"
                >
                  Sacred Containers
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.sandsymes.com/ancestral-breathwork"
                  className="transition-colors font-light hover:opacity-100"
                  style={{ color: "#d8d2c6", opacity: 0.8 }}
                  target="_blank"
                >
                  Ancestral Breathwork
                </Link>
              </li>
              <li>
                <Link
                  href="/wisdom"
                  className="transition-colors font-light hover:opacity-100"
                  style={{ color: "#d8d2c6", opacity: 0.8 }}
                  target="_blank"
                >
                  Wisdom Drops
                </Link>
              </li>
              <li>
                <Link
                  href="/astrology"
                  className="transition-colors font-light hover:opacity-100"
                  style={{ color: "#d8d2c6", opacity: 0.8 }}
                  target="_blank"
                >
                  Astrological Download
                </Link>
              </li>
              <li>
                <Link
                  href="/challenges"
                  className="transition-colors font-light hover:opacity-100"
                  style={{ color: "#d8d2c6", opacity: 0.8 }}
                  target="_blank"
                >
                  Mini Challenges
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.sandsymes.com/medicine-retreats"
                  className="transition-colors font-light hover:opacity-100"
                  style={{ color: "#d8d2c6", opacity: 0.8 }}
                  target="_blank"
                >
                  Medicine Retreats
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4
              className="text-lg font-medium mb-6"
              style={{ color: "#d8d2c6" }}
            >
              Connect
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/oracle"
                  className="transition-colors font-light hover:opacity-100"
                  style={{ color: "#d8d2c6", opacity: 0.8 }}
                  target="_blank"
                >
                  AO
                </Link>
              </li>
              <li>
                <a
                  href="https://www.sandsymes.com/contact"
                  className="transition-colors font-light hover:opacity-100"
                  style={{ color: "#d8d2c6", opacity: 0.8 }}
                  target="_blank"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="https://www.sandsymes.com/"
                  className="transition-colors font-light hover:opacity-100"
                  style={{ color: "#d8d2c6", opacity: 0.8 }}
                  target="_blank"
                >
                  About Sand
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors font-light hover:opacity-100"
                  style={{ color: "#d8d2c6", opacity: 0.8 }}
                  target="_blank"
                >
                  Resources
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-primary-300/30 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p
              className="text-sm font-light"
              style={{ color: "#d8d2c6", opacity: 0.6 }}
            >
              © 2025 Sand Symes. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span
                className="text-sm font-light"
                style={{ color: "#d8d2c6", opacity: 0.6 }}
              >
                With love and sacred intention
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
