import { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import AppSelect from "@/component/common/AppSelect";
import { formatDate } from "@/lib/utils";
import {
  Calendar,
  Copy,
  ExternalLink,
  Check,
  UploadCloud,
  X,
} from "lucide-react";
import "react-day-picker/style.css";
import { Recording } from "@/@types/abj-recording";

export const RecordingForm = ({
  initial,
  onSubmit,
}: {
  initial: Omit<Recording, "id"> | Recording;
  onSubmit: (values: Omit<Recording, "id">) => void;
}) => {
  const [title, setTitle] = useState(initial.title);
  const [type, setType] = useState(initial.type);
  const [videoUrl, setVideoUrl] = useState(initial.video_url);
  const [date, setDate] = useState(initial.date);
  const [summary] = useState(initial.summary ?? "");
  const [status] = useState(initial.status || "draft");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [analysisStatus, setAnalysisStatus] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const sseRef = useRef<EventSource | null>(null);
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [selectedFileSize, setSelectedFileSize] = useState<number>(0);

  // Date dropdown state and helpers
  const [isDateOpen, setIsDateOpen] = useState(false);
  const datePopoverRef = useRef<HTMLDivElement | null>(null);
  const selectedDate = useMemo(() => {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }, [date]);

  useEffect(() => {
    // SSE removed; processing happens via server action on demand
    return () => {
      if (sseRef.current) sseRef.current.close();
      sseRef.current = null;
    };
  }, []);

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
    setSelectedFileName(file.name);
    setSelectedFileSize(file.size);
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
      const { sessionUrl, publicUrl } = (await startRes.json()) as {
        sessionUrl: string;
        publicUrl: string;
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
      setAnalysisStatus("Ready. Click Save to create the item.");
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

  function resetUpload() {
    setUploadError(null);
    setUploadProgress(0);
    setAnalysisStatus("");
    setTranscript("");
    setVideoUrl("");
    setSelectedFileName("");
    setSelectedFileSize(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onDropFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("video/")) {
      setUploadError("Please select a valid video file.");
      return;
    }
    handleVideoUpload(file);
  }

  return (
    <form
      id={initial && "id" in initial ? "edit-form" : "create-form"}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ title, video_url: videoUrl, type, date, summary, status });
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
            value={date ? formatDate(date.toISOString()) : ""}
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
                  setDate(next);
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
        <div
          className={`relative rounded-xl border ${
            dragActive
              ? "border-primary-300/60 bg-white/10"
              : "border-primary-300/20 bg-white/5"
          } transition-colors`}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            onDropFiles(e.dataTransfer.files);
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => onDropFiles(e.target.files)}
            disabled={isUploading}
          />
          <button
            type="button"
            className="w-full text-left"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <div className="flex flex-col items-center justify-center p-10">
              <UploadCloud className="w-6 h-6 text-primary-300/70" />
              <p className="mt-2 text-sm text-primary-300/80">
                Drag and drop your video here, or
                <span className="ml-1 underline">browse</span>
              </p>
              {selectedFileName && (
                <p className="mt-2 text-xs text-primary-300/80">
                  Selected: {selectedFileName}
                  {selectedFileSize
                    ? ` (${(selectedFileSize / (1024 * 1024)).toFixed(1)} MB)`
                    : ""}
                </p>
              )}
            </div>
          </button>
          {isUploading && (
            <div className="absolute inset-x-0 -bottom-2 p-3">
              <div className="h-2 w-full rounded bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-primary-300/70 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-primary-300/70 text-right">
                {uploadProgress}%
              </p>
            </div>
          )}
        </div>
        <div className="mt-2 flex items-center gap-3">
          {videoUrl && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-primary-300/80 hover:text-primary-300 underline"
            >
              View uploaded video
            </a>
          )}
          {(videoUrl || selectedFileName) && (
            <button
              type="button"
              onClick={resetUpload}
              className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-primary-300/20 text-primary-300 hover:bg-white/10 transition-colors"
            >
              <X className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
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
      </div>

      <div>
        <label className="block text-sm font-medium text-primary-300/80 mb-2">
          Video URL
        </label>
        <div className="relative">
          <input
            className="w-full pr-24 pl-4 py-3 rounded-lg bg-white/5 border border-primary-300/20 text-primary-300 focus:border-primary-300/40 focus:outline-none transition-colors"
            type="url"
            readOnly
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            required
            placeholder="URL will appear here after upload"
          />
          <div className="absolute inset-y-0 right-2 flex items-center gap-1">
            <button
              type="button"
              aria-label={copied ? "Copied" : "Copy URL"}
              className="p-2 rounded-md bg-white/5 border border-primary-300/10 text-primary-300 hover:bg-white/10 transition-colors disabled:opacity-40"
              disabled={!videoUrl}
              onClick={async () => {
                if (!videoUrl) return;
                try {
                  await navigator.clipboard.writeText(videoUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                } catch {}
              }}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <a
              href={videoUrl || "#"}
              target="_blank"
              rel="noreferrer"
              aria-label="Open video"
              className="p-2 rounded-md bg-white/5 border border-primary-300/10 text-primary-300 hover:bg-white/10 transition-colors pointer-events-auto disabled:opacity-40"
              onClick={(e) => {
                if (!videoUrl) e.preventDefault();
              }}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
        <p className="mt-1 text-xs text-primary-300/60">
          Generated after upload. Use the buttons to copy or open.
        </p>
      </div>
    </form>
  );
};
