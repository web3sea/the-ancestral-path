import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-36">
      {/* Background image from Sandsymes website */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://static.wixstatic.com/media/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg/v1/fill/w_1290,h_848,al_c,q_85,enc_avif,quality_auto/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg')`,
        }}
      ></div>

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20 z-10"></div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 flex items-center min-h-screen">
        {/* Text content positioned over the image */}
        <div className="text-left max-w-2xl">
          <h1
            className="text-5xl lg:text-7xl font-light mb-8 leading-tight tracking-wide text-shadow"
            style={{ color: "#d8d2c6" }}
          >
            MEET SAND SYMES.
          </h1>

          <div
            className="space-y-3 text-xl lg:text-2xl font-light mb-12"
            style={{ color: "#d8d2c6" }}
          >
            <p>Modern Medicine Woman,</p>
            <p>Shamanic Practitioner,</p>
            <p>Psychedelic Guide,</p>
            <p>Mentor & Visionary.</p>
          </div>

          <p
            className="text-lg mb-8 max-w-lg leading-relaxed"
            style={{ color: "#d8d2c6", opacity: 0.9 }}
          >
            Guiding souls through transformative healing journeys using ancient
            wisdom and modern practices for profound spiritual awakening.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/breathwork" className="btn-primary">
              EXPLORE OFFERINGS
            </Link>

            <Link href="/oracle" className="btn-secondary">
              ORACLE AI CHAT
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
