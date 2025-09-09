"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import RecordingsLoading from "@/component/common/LoadingSpinner";

interface PublicRecording {
  id: string;
  title: string;
  type: "Full Moons" | "New Moons";
  video_url: string;
  audio_url?: string | null;
  date: string;
  summary: string;
  image_url: string;
}

export default function ABJRecordingsSection() {
  const [recordings, setRecordings] = useState<PublicRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedRecording, setSelectedRecording] =
    useState<PublicRecording | null>(null);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  const getRandomImage = () => {
    const images = [
      "/images/breathwork.png",
      "/images/breathwork-1.png",
      "/images/breathwork-2.png",
      "/images/breathwork-3.png",
      "/images/abj.png",
    ];

    return images[Math.floor(Math.random() * images.length)];
  };

  useEffect(() => {
    async function fetchRecordings() {
      try {
        setLoading(true);
        const res = await fetch("/api/abj-recordings/public", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load recordings");
        const data = await res.json();
        // Assign random images to each recording
        const recordingsWithImages = data.map((recording: PublicRecording) => ({
          ...recording,
          image_url: getRandomImage(),
        }));
        setRecordings(recordingsWithImages);
        // Auto-select first recording if available
        if (recordingsWithImages.length > 0) {
          setSelectedRecording(recordingsWithImages[0]);
          setIsSummaryExpanded(false);
        }
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "Failed to load recordings";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    fetchRecordings();
  }, []);

  return (
    <div
      className=" bg-black/70"
      style={{
        backgroundImage: `url('https://static.wixstatic.com/media/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg/v1/fill/w_1290,h_848,al_c,q_85,enc_avif,quality_auto/7f8caa_88ff41d59b9c4f92b725e25042ca6879~mv2.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24">
        {/* Header */}
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-8 tracking-wide text-center"
          style={{ color: "#d8d2c6" }}
        >
          ABJ RECORDINGS
        </motion.h1>
        {/* Main Content Layout */}
        {loading && (
          <motion.div
            className="py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <RecordingsLoading />
          </motion.div>
        )}

        {error && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-lg text-red-400">{error}</div>
          </motion.div>
        )}

        {!loading && !error && recordings.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-lg" style={{ color: "#d8d2c6", opacity: 0.8 }}>
              No recordings available at this time.
            </div>
          </motion.div>
        )}

        {!loading && !error && recordings.length > 0 && (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* Sidebar - Recordings List */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="bg-black/40 h-full min-h-[40.5rem] max-h-[40.5rem] backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-primary-300/20">
                <h3
                  className="text-lg font-semibold mb-4 lg:mb-6"
                  style={{ color: "#d8d2c6" }}
                >
                  Recordings
                </h3>
                <div className="space-y-2 lg:space-y-3 max-h-[34.2rem] overflow-y-auto">
                  {recordings.map((recording) => (
                    <button
                      key={recording.id}
                      onClick={() => {
                        setSelectedRecording(recording);
                        setIsSummaryExpanded(false);
                      }}
                      className={`w-full text-left p-3 lg:p-4 rounded-lg transition-all duration-300 ${
                        selectedRecording?.id === recording.id
                          ? "bg-primary-300/20 border border-primary-300/40"
                          : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-primary-300/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar
                            className="w-3 h-3 lg:w-4 lg:h-4"
                            style={{ color: "#d8d2c6" }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-xs lg:text-sm font-medium"
                            style={{ color: "#d8d2c6" }}
                          >
                            {formatDate(recording.date)}
                          </div>
                          <div
                            className="text-xs opacity-80 leading-relaxed"
                            style={{ color: "#d8d2c6" }}
                          >
                            {recording.title}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content - Selected Recording Details */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              {selectedRecording ? (
                <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 lg:p-6 xl:p-8 border border-primary-300/20">
                  {/* Video Player */}
                  <div className="mb-6 lg:mb-8">
                    <video
                      src={selectedRecording.video_url}
                      controls
                      className="w-full h-auto rounded-xl"
                      poster={selectedRecording.image_url}
                    />
                  </div>

                  {/* Recording Details */}
                  <div className="space-y-4 lg:space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <h2
                          className="text-xl lg:text-2xl font-bold mb-2"
                          style={{ color: "#d8d2c6" }}
                        >
                          {selectedRecording.title}
                        </h2>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-300/20 text-primary-300 border border-primary-300/30 w-fit">
                            {selectedRecording.type}
                          </span>
                          <div
                            className="flex items-center gap-2"
                            style={{ color: "#d8d2c6", opacity: 0.8 }}
                          >
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {formatDate(selectedRecording.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3
                          className="text-lg font-semibold"
                          style={{ color: "#d8d2c6" }}
                        >
                          Summary
                        </h3>
                        {selectedRecording.summary.length > 200 && (
                          <button
                            onClick={() =>
                              setIsSummaryExpanded(!isSummaryExpanded)
                            }
                            className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-white/5 text-white/80 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20"
                          >
                            {isSummaryExpanded ? (
                              <>
                                <span>Show Less</span>
                                <ChevronUp className="w-3 h-3" />
                              </>
                            ) : (
                              <>
                                <span>Show More</span>
                                <ChevronDown className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <p
                        className={`text-sm leading-relaxed transition-all duration-300 ${
                          !isSummaryExpanded &&
                          selectedRecording.summary.length > 200
                            ? "line-clamp-4"
                            : ""
                        }`}
                        style={{ color: "#d8d2c6", opacity: 0.9 }}
                      >
                        {selectedRecording.summary}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 lg:p-6 xl:p-8 border border-primary-300/20 flex items-center justify-center h-64 lg:h-96">
                  <div className="text-center">
                    <div
                      className="text-base lg:text-lg"
                      style={{ color: "#d8d2c6", opacity: 0.8 }}
                    >
                      Select a recording to view details
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
