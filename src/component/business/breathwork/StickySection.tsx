"use client";
import { motion } from "framer-motion";

export default function StickySection() {
  return (
    <div className="h-full">
      <div
        className="pt-36 sticky top-0 z-10 border-y border-[#d8d2c6]"
        style={{
          backgroundImage: `url('/images/stickybg1.png')`,
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <motion.div
          className="sticky top-0 py-10 flex flex-col justify-center items-center max-w-7xl mx-auto min-h-[90vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.h2
            className="text-center text-4xl lg:text-6xl font-bold tracking-wide relative z-10"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            ANCESTRAL
          </motion.h2>
          <motion.h2
            className="text-center text-4xl lg:text-6xl font-bold tracking-wide relative z-10"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            BREATHWORK
          </motion.h2>
          <motion.p
            className="text-center lg:text-2xl font-light tracking-wide relative z-10"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            FROM LIMITATION TO LIBERATION
          </motion.p>
          <motion.p
            className="text-center text-md font-light italic relative mt-10 z-10"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            #nowomanleftbehind
          </motion.p>
        </motion.div>
      </div>

      <div
        className="sticky top-0 z-[12] border-y border-[#d8d2c6]"
        style={{
          backgroundImage: `url('/images/stickybg1.png')`,
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <motion.div
          className="sticky top-0 flex flex-col gap-10 items-center justify-center mb-40 z-10 mt-10 min-h-[90vh] max-w-7xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="flex flex-col items-center justify-center text-4xl font-light tracking-wide"
          >
            <h2>UPCOMING</h2>
            <h2>JOURNEYS</h2>
          </motion.div>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="text-center text-md font-light max-w-2xl"
          >
            Sand is unwavering in her commitment to fostering transformation
            that is both inclusive and accessible. In alignment with the
            powerful directive from our ancestors, &quot;No Woman Left
            Behind,&quot; Sand is now offering her Ancestral Breathwork Journeys
            (ABJ) completely free of charge to women worldwide. These monthly
            online sessions provide a gateway to empowerment for women striving
            to break generational chains, reclaim their sovereignty, and rewrite
            their stories. This is your opportunity to join a global community
            of women who are expanding, elevating, and expressing together. Book
            your spot today and take the first step towards your own
            transformation.
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="flex flex-col items-center justify-center font-light tracking-wide"
          >
            <p className="text-bold text-2xl">BREATHING FOR A BETTER WORLD</p>
            <p className="text-center text-xl">
              Women Who Breathe Together - Rise Together!
            </p>
            <p className="text-center text-xl">#NoWomanLeftBehind</p>
          </motion.div>
          <motion.button
            onClick={() => {
              window.open(
                "https://sand-symes.mykajabi.com/ancestral-breathwork-journey-9-2-25",
                "_blank"
              );
            }}
            className="w-[30vw] h-[10vh] mt-10 btn-primary"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            Book Your Spot
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
