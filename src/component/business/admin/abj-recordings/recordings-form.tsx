import { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import AppSelect from "@/component/common/AppSelect";
import { formatDate } from "@/lib/utils";
import { Calendar } from "lucide-react";
import "react-day-picker/style.css";

type Recording = {
  id: string;
  type: "Full Moons" | "New Moons";
  title: string;
  videoUrl: string;
  date: string;
  summary?: string;
  status: "published" | "draft" | "processing";
};

export const RecordingForm = ({
  initial,
  onSubmit,
}: {
  initial: Omit<Recording, "id"> | Recording;
  onSubmit: (values: Omit<Recording, "id">) => void;
}) => {
  const [title, setTitle] = useState(initial.title);
  const [videoUrl, setVideoUrl] = useState(initial.videoUrl);
  const [type, setType] = useState(initial.type);
  const [date, setDate] = useState(initial.date);
  const [summary, setSummary] = useState(initial.summary ?? "");
  const [status] = useState(initial.status || "draft");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [analysisStatus, setAnalysisStatus] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");

  // Date dropdown state and helpers
  const [isDateOpen, setIsDateOpen] = useState(false);
  const datePopoverRef = useRef<HTMLDivElement | null>(null);
  const selectedDate = useMemo(() => {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }, [date]);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (!isDateOpen) return;
      const target = e.target as Node;
      const insideWrapper = !!datePopoverRef.current?.contains(target);
      const insideDropdown = !!datePopoverRef.current?.contains(target);
      if (!insideWrapper && !insideDropdown) setIsDateOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsDateOpen(false);
    }
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDateOpen]);

  async function handleVideoUpload(file: File) {
    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const startRes = await fetch("/api/gcs/resumable/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/octet-stream",
          prefix: "videos",
        }),
      });
      if (!startRes.ok) {
        const err = await startRes.json().catch(() => ({}));
        throw new Error(
          err?.error || `Failed to start upload (${startRes.status})`
        );
      }
      const { sessionUrl, publicUrl, objectName } = (await startRes.json()) as {
        sessionUrl: string;
        publicUrl: string;
        objectName: string;
      };

      const chunkSize = 8 * 1024 * 1024; // 8MB
      const total = file.size;
      let offset = 0;

      while (offset < total) {
        const end = Math.min(offset + chunkSize, total);
        const chunk = file.slice(offset, end);
        const res = await fetch(sessionUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
            "Content-Range": `bytes ${offset}-${end - 1}/${total}`,
          },
          body: chunk,
        });

        if (res.status === 308) {
          const range = res.headers.get("Range");
          if (range) {
            // format: bytes=0-12345
            const match = range.match(/bytes=(\d+)-(\d+)/);
            if (match) {
              const last = Number(match[2]);
              offset = last + 1;
            } else {
              offset = end;
            }
          } else {
            offset = end;
          }
        } else if (res.ok) {
          offset = total; // completed
        } else {
          const text = await res.text().catch(() => "");
          throw new Error(`Chunk upload failed (${res.status}) ${text}`);
        }

        setUploadProgress(Math.round((offset / total) * 100));
      }

      setVideoUrl(publicUrl);

      // 1) Extract audio via Transcoder
      setAnalysisStatus("Extracting audio...");
      const extractRes = await fetch("/api/transcode/extract-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objectName, outputPrefix: "audio" }),
      });
      if (!extractRes.ok) {
        const err = await extractRes.json().catch(() => ({}));
        throw new Error(
          err?.error || `Audio extraction failed (${extractRes.status})`
        );
      }
      const { jobName, audioGcsUri } = (await extractRes.json()) as {
        jobName: string;
        audioGcsUri: string;
      };

      // 2) Poll Transcoder job status until SUCCEEDED
      setAnalysisStatus("Processing audio...");
      const maxAttempts = 300; // ~15 minutes at 3s interval
      const pollIntervalMs = 3000;
      let attempt = 0;
      while (attempt < maxAttempts) {
        attempt += 1;
        const statusRes = await fetch(
          `/api/transcode/job/status?name=${encodeURIComponent(jobName)}`
        );
        if (!statusRes.ok) {
          const err = await statusRes.json().catch(() => ({}));
          throw new Error(
            err?.error || `Status check failed (${statusRes.status})`
          );
        }
        const job = (await statusRes.json()) as { state?: string };
        const state = (job?.state || "").toUpperCase();
        if (state === "SUCCEEDED") break;
        if (state === "FAILED" || state === "CANCELLED") {
          throw new Error(`Transcode job ${state.toLowerCase()}`);
        }
        await new Promise((r) => setTimeout(r, pollIntervalMs));
      }

      // 3) Start Speech-to-Text on the extracted audio
      setAnalysisStatus("Starting transcription...");
      const analysisRes = await fetch("/api/analysis/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gcsUri: audioGcsUri }),
      });
      if (!analysisRes.ok) {
        const err = await analysisRes.json().catch(() => ({}));
        console.error("Failed to start analysis", err);
      } else {
        const { operationName } = (await analysisRes.json()) as {
          operationName?: string;
        };
        if (!operationName) {
          setAnalysisStatus("Transcription started.");
          return;
        }
        // Poll analysis status until done
        setAnalysisStatus("Transcribing audio...");
        const statusPollMs = 5000;
        for (;;) {
          const statusRes = await fetch(
            `/api/analysis/status?operationName=${encodeURIComponent(
              operationName
            )}`
          );
          if (!statusRes.ok) break;
          const data = (await statusRes.json()) as {
            done?: boolean;
            transcript?: string;
          };
          if (data.done) {
            setAnalysisStatus("Transcription complete.");
            if (data.transcript) setTranscript(data.transcript);
            break;
          }
          await new Promise((r) => setTimeout(r, statusPollMs));
        }
      }
    } catch (e: unknown) {
      const message =
        typeof e === "object" && e && "message" in e
          ? String((e as { message?: unknown }).message)
          : "Upload failed";
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form
      id={initial && "id" in initial ? "edit-form" : "create-form"}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ title, videoUrl, type, date, summary, status });
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary-300/80 mb-2">
            Title
          </label>
          <input
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-primary-300/20 text-primary-300 focus:border-primary-300/40 focus:outline-none transition-colors"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter recording title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-300/80 mb-2">
            Type
          </label>
          <AppSelect
            value={type}
            options={["Full Moons", "New Moons"]}
            onChange={(v) => setType(v as "Full Moons" | "New Moons")}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-primary-300/80 mb-2">
          Date
        </label>
        <div ref={datePopoverRef} className="relative">
          <input
            className="w-full relative pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-primary-300/20 text-primary-300 focus:border-primary-300/40 focus:outline-none transition-colors cursor-pointer"
            value={date ? formatDate(date) : ""}
            onClick={() => setIsDateOpen(true)}
            onFocus={() => setIsDateOpen(true)}
            readOnly
            required
            aria-haspopup="dialog"
            placeholder="Select recording date"
          />
          <Calendar className="w-4 h-4 text-primary-300/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          {isDateOpen && (
            <div className="absolute -top-2 left-0 right-0 z-[9999] mt-2 bg-black/95 border border-primary-300/20 rounded-xl shadow-3xl p-4">
              <DayPicker
                className="w-full"
                mode="single"
                selected={selectedDate}
                onSelect={(d) => {
                  if (!d) return;
                  const next = new Date(d);
                  next.setHours(0, 0, 0, 0);
                  setDate(next.toISOString());
                  setIsDateOpen(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-primary-300/80 mb-2">
          Upload Video
        </label>
        <div className="flex items-center gap-3">
          <input
            className="block w-full text-sm text-primary-300 file:mr-4 file:rounded-lg file:border file:border-primary-300/20 file:bg-white/5 file:px-4 file:py-2 file:text-primary-300 file:hover:bg-white/10"
            type="file"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleVideoUpload(file);
            }}
            disabled={isUploading}
          />
        </div>
        {isUploading && (
          <p className="mt-2 text-xs text-primary-300/70">
            Uploading... {uploadProgress}%
          </p>
        )}
        {uploadError && (
          <p className="mt-2 text-xs text-red-400">{uploadError}</p>
        )}
        {analysisStatus && (
          <p className="mt-2 text-xs text-primary-300/70">{analysisStatus}</p>
        )}
        {transcript && (
          <div className="mt-2 text-xs text-primary-300/80 whitespace-pre-wrap break-words max-h-60 overflow-y-auto p-2 border border-primary-300/20 rounded-lg bg-white/5">
            {transcript}
          </div>
        )}
        {videoUrl && (
          <a
            href={videoUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-xs text-primary-300/80 hover:text-primary-300 underline"
          >
            Uploaded video
          </a>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-primary-300/80 mb-2">
          Video URL
        </label>
        <input
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-primary-300/20 text-primary-300 focus:border-primary-300/40 focus:outline-none transition-colors"
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          required
          placeholder="https://example.com/video"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary-300/80 mb-2">
          Summary
        </label>
        <textarea
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-primary-300/20 text-primary-300 focus:border-primary-300/40 focus:outline-none transition-colors resize-none"
          rows={4}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Enter a description or summary of the recording..."
        />
      </div>
    </form>
  );
};
