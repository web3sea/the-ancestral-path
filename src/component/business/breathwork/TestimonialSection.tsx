"use client";
import { motion } from "framer-motion";

export default function TestimonialSection() {
  return (
    <section
      className="flex items-center justify-center min-h-[300px] sm:h-[40vh] py-12 sm:py-0"
      style={{
        backgroundImage: `url('/images/bg-image.png')`,
        backgroundRepeat: "repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div
        className="flex flex-col items-center justify-center max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          Testimonials
        </motion.h2>

        <motion.div
          className="relative text-lg sm:text-xl lg:text-2xl font-light text-center px-4 sm:px-6 lg:px-8"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            delay: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <span className="absolute top-0 -left-10 hidden lg:block">
            <svg
              preserveAspectRatio="xMidYMid meet"
              data-bbox="25.175 52 150.825 96"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="25.175 52 150.825 96"
              height="30"
              width="30"
              data-type="color"
              role="presentation"
              aria-hidden="true"
              fill="#D8D2C6"
              aria-label=""
            >
              <g>
                <path
                  fill="#D8D2C6"
                  d="M107.443 113.262c0 19.604 16.131 35.483 35.639 34.711 17.787-.701 32.199-15.307 32.891-33.333.762-19.77-14.906-36.117-34.251-36.117h-.121c-6.24.025-10.8-6.023-8.928-12.058a71.563 71.563 0 0 1 4.764-11.628c.39-.592.39-1.381.195-1.974-.195-.394-.584-.789-.974-.789-.584-.197-1.168 0-1.947.592-8.181 7.106-15.192 16.383-19.867 26.647-4.284 9.474-6.816 19.54-7.206 30.199-.191 1.184-.191 2.566-.191 3.75h-.004Z"
                  data-color="1"
                ></path>
                <path
                  fill="#D8D2C6"
                  d="M25.175 113.262c0 19.604 16.131 35.483 35.64 34.711 17.785-.701 32.198-15.307 32.89-33.333.762-19.77-14.906-36.117-34.25-36.117h-.122c-6.24.025-10.8-6.023-8.928-12.058a71.576 71.576 0 0 1 4.764-11.628c.39-.592.39-1.381.195-1.974-.195-.394-.584-.789-.974-.789-.584-.197-1.168 0-1.947.592-8.18 7.106-15.192 16.383-19.866 26.647-4.285 9.474-6.817 19.54-7.207 30.199-.191 1.184-.191 2.566-.191 3.75h-.004Z"
                  data-color="1"
                ></path>
              </g>
            </svg>
          </span>
          <p className="text-sm sm:text-base lg:text-lg">
            I love the breathwork journeys so much! I am amazed by how powerful
            they are. Having done meditation, body work, and yoga for decades
            and some medicine work in the past couple of years, I am really
            impressed. I admire your gifts in holding space, knowing what to say
            and how to show up for the group, and seeing energy and spirits, not
            to mention your incredible playlists.
          </p>
          <span className="absolute bottom-0 -right-10 transform rotate-180 hidden lg:block">
            <svg
              preserveAspectRatio="xMidYMid meet"
              data-bbox="25.175 52 150.825 96"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="25.175 52 150.825 96"
              height="30"
              width="30"
              data-type="color"
              role="presentation"
              aria-hidden="true"
              aria-label=""
              fill="#D8D2C6"
            >
              <g>
                <path
                  fill="#D8D2C6"
                  d="M107.443 113.262c0 19.604 16.131 35.483 35.639 34.711 17.787-.701 32.199-15.307 32.891-33.333.762-19.77-14.906-36.117-34.251-36.117h-.121c-6.24.025-10.8-6.023-8.928-12.058a71.563 71.563 0 0 1 4.764-11.628c.39-.592.39-1.381.195-1.974-.195-.394-.584-.789-.974-.789-.584-.197-1.168 0-1.947.592-8.181 7.106-15.192 16.383-19.867 26.647-4.284 9.474-6.816 19.54-7.206 30.199-.191 1.184-.191 2.566-.191 3.75h-.004Z"
                  data-color="1"
                ></path>
                <path
                  fill="#D8D2C6"
                  d="M25.175 113.262c0 19.604 16.131 35.483 35.64 34.711 17.785-.701 32.198-15.307 32.89-33.333.762-19.77-14.906-36.117-34.25-36.117h-.122c-6.24.025-10.8-6.023-8.928-12.058a71.576 71.576 0 0 1 4.764-11.628c.39-.592.39-1.381.195-1.974-.195-.394-.584-.789-.974-.789-.584-.197-1.168 0-1.947.592-8.18 7.106-15.192 16.383-19.866 26.647-4.285 9.474-6.817 19.54-7.207 30.199-.191 1.184-.191 2.566-.191 3.75h-.004Z"
                  data-color="1"
                ></path>
              </g>
            </svg>
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
