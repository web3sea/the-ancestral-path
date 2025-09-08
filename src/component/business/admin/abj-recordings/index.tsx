"use client";

import { useState, useMemo, useEffect } from "react";
import { RecordingForm } from "./recordings-form";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  Video,
  Edit3,
  Trash2,
  Plus,
  Calendar,
  Mic,
  Loader2,
  Play,
  RefreshCcw,
} from "lucide-react";
import AppModal from "@/component/common/AppModal";
import { Recording } from "@/@types/abj-recording";

export const AbjRecordings = () => {
  const [records, setRecords] = useState<Recording[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [editing, setEditing] = useState<Recording | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [summaryEditing, setSummaryEditing] = useState<{
    rec: Recording;
    text: string;
  } | null>(null);
  const [transcriptViewing, setTranscriptViewing] = useState<Recording | null>(
    null
  );
  const [savingSummary, setSavingSummary] = useState(false);

  async function refreshRecords() {
    try {
      const res = await fetch("/api/abj-recordings/list", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load");
      const rows = (await res.json()) as Array<{
        id: string;
        title: string;
        type: "Full Moons" | "New Moons";
        video_url: string;
        audio_url?: string | null;
        date: string;
        summary?: string | null;
        transcript?: string | null;
        status: "published" | "draft" | "processing";
      }>;
      const mapped: Recording[] = rows.map((r) => ({
        id: r.id,
        title: r.title,
        type: r.type,
        video_url: r.video_url,
        audio_url: r.audio_url ?? undefined,
        date: new Date(r.date),
        summary: r.summary ?? "",
        status: r.status,
        transcript: r.transcript ?? undefined,
      }));
      setRecords(mapped);
    } catch {
      // keep previous state
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/abj-recordings/list", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load");
        const rows = (await res.json()) as Array<{
          id: string;
          title: string;
          type: "Full Moons" | "New Moons";
          video_url: string;
          audio_url?: string | null;
          date: string;
          summary?: string | null;
          transcript?: string | null;
          status: "published" | "draft" | "processing";
        }>;
        if (!mounted) return;
        const mapped: Recording[] = rows.map((r) => ({
          id: r.id,
          title: r.title,
          type: r.type,
          video_url: r.video_url,
          audio_url: r.audio_url ?? undefined,
          date: new Date(r.date),
          summary: r.summary ?? "",
          status: r.status,
          transcript: r.transcript ?? undefined,
        }));
        setRecords(mapped);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const sorted = useMemo(() => {
    return [...records].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [records]);

  async function handleCreate(newRec: Omit<Recording, "id">) {
    try {
      const res = await fetch("/api/abj-recordings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRec),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = await res.json();
      const rec: Recording = {
        id: created.id,
        title: created.title,
        type: created.type,
        video_url: created.video_url,
        audio_url: created.audio_url ?? undefined,
        date: new Date(created.date),
        summary: created.summary ?? "",
        status: created.status,
      };
      setRecords((prev) => [rec, ...prev]);
    } catch (e) {
      console.error(e);
      alert("Failed to create recording");
    } finally {
      setIsCreateOpen(false);
    }
  }

  async function handleUpdate(updated: Recording) {
    try {
      const res = await fetch("/api/abj-recordings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: updated.id,
          title: updated.title,
          type: updated.type,
          video_url: updated.video_url,
          date: updated.date,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      const saved = await res.json();
      setRecords((prev) =>
        prev.map((r) =>
          r.id === saved.id
            ? {
                id: saved.id,
                title: saved.title,
                type: saved.type,
                video_url: saved.video_url,
                audio_url: saved.audio_url ?? undefined,
                date: new Date(saved.date),
                summary: saved.summary ?? "",
                status: saved.status,
              }
            : r
        )
      );
    } catch (e) {
      console.error(e);
      alert("Failed to update recording");
    } finally {
      setEditing(null);
    }
  }

  async function saveSummary() {
    if (!summaryEditing) return;
    try {
      setSavingSummary(true);
      const res = await fetch("/api/abj-recordings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: summaryEditing.rec.id,
          summary: summaryEditing.text,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      const saved = await res.json();
      setRecords((prev) =>
        prev.map((r) =>
          r.id === saved.id ? { ...r, summary: saved.summary ?? "" } : r
        )
      );
      setSummaryEditing(null);
    } catch (e) {
      console.error(e);
      alert("Failed to update summary");
    } finally {
      setSavingSummary(false);
    }
  }

  async function executeTranscript(id: string) {
    try {
      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "processing" } : r))
      );
      const res = await fetch("/api/abj-recordings/execute-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Execute transcript failed");
      const saved = await res.json();
      setRecords((prev) =>
        prev.map((r) =>
          r.id === saved.id ? { ...r, transcript: saved.transcript ?? "" } : r
        )
      );
    } catch (e) {
      console.error(e);
      alert("Failed to execute transcript");
    }
  }

  async function pollUntilDone(id: string) {
    const maxAttempts = 60; // ~5 minutes
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((r) => setTimeout(r, 5000));
      await refreshRecords();
      const rec = records.find((x) => x.id === id);
      if (!rec) continue;
      if (rec.status !== "processing" || rec.summary || rec.transcript) {
        break;
      }
    }
  }

  async function handleDelete(id: string) {
    try {
      const ok = window.confirm(
        "Delete this recording? This action cannot be undone."
      );
      if (!ok) return;
      const res = await fetch("/api/abj-recordings/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete recording");
    }
  }

  async function processAndTranscribe(id: string) {
    try {
      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "processing" } : r))
      );
      const hasAudio = records.find((r) => r.id === id)?.audio_url;
      if (!hasAudio) {
        const convertRes = await fetch("/api/abj-recordings/convert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!convertRes.ok) throw new Error("Convert failed");
        const conv = (await convertRes.json()) as { audioUrl?: string };
        if (conv?.audioUrl) {
          setRecords((prev) =>
            prev.map((r) =>
              r.id === id ? { ...r, audio_url: conv.audioUrl } : r
            )
          );
        }
      }
      await pollUntilDone(id);
    } catch (e) {
      console.error(e);
      setRecords((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: records.find((x) => x.id === id)?.status || r.status,
              }
            : r
        )
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-300 flex items-center gap-3">
            <FileText className="w-8 h-8" />
            ABJ Recordings
          </h1>
          <p className="text-primary-300/60 mt-1">
            Manage your breathwork session recordings
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="btn-secondary  gap-2 hover:bg-white/15 transition-colors"
            onClick={() => refreshRecords()}
          >
            <span className="flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </span>
          </button>
          <button
            className="btn-secondary  gap-2 hover:bg-white/15 transition-colors"
            onClick={() => setIsCreateOpen(true)}
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Upload ABJ Recording
            </span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/5 border border-primary-300/20 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-primary-300/20 bg-black/20">
          <h2 className="text-lg font-semibold text-primary-300">Recordings</h2>
        </div>
        <div className="overflow-x-auto pb-2">
          {loading && (
            <div className="p-6 text-primary-300/70 text-sm">Loading...</div>
          )}
          {error && !loading && (
            <div className="p-6 text-red-400 text-sm">{error}</div>
          )}
          {!loading && !error && sorted.length === 0 && (
            <div className="p-10 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-white/5 border border-primary-300/20 flex items-center justify-center">
                <Video className="w-7 h-7 text-primary-300/70" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-primary-300">
                No recordings yet
              </h3>
              <p className="mt-1 text-sm text-primary-300/70">
                Start by uploading your first ABJ recording.
              </p>
              <div className="mt-4">
                <button
                  className="px-4 py-2 bg-primary-300/80 text-black rounded-lg hover:bg-primary-300/60"
                  onClick={() => setIsCreateOpen(true)}
                >
                  Upload ABJ Recording
                </button>
              </div>
            </div>
          )}
          {sorted.length > 0 && (
            <table className="w-full whitespace-nowrap divide-y divide-primary-300/20 relative">
              <thead className="bg-black/40">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-primary-300 uppercase tracking-wider sticky left-0 z-20 bg-black">
                    Recording
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                    Audio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                    Summary
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                    Transcript
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-primary-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-primary-300 uppercase tracking-wider w-[5%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-300/10">
                {sorted.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 sticky left-0 z-10 bg-black w-1/6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-300/20 rounded-lg flex items-center justify-center">
                          <Video className="w-5 h-5 text-primary-300" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-primary-300">
                            {r.title}
                          </div>
                          <a
                            className="text-xs text-primary-300/60 hover:text-primary-300 transition-colors"
                            href={r.video_url || ""}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Video →
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {r.audio_url ? (
                          <a
                            className="text-sm text-primary-300/80 underline hover:text-primary-300"
                            href={r.audio_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Play MP3 →
                          </a>
                        ) : (
                          <p className="text-sm text-primary-300/60">
                            No audio yet
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-300/20 text-primary-300 border border-primary-300/30">
                        {r.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-primary-300/80">
                        <Calendar className="w-4 h-4" />
                        {formatDate(r.date.toISOString())}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {r.summary ? (
                          <button
                            className="text-sm text-primary-300/80 underline hover:text-primary-300"
                            onClick={() =>
                              setSummaryEditing({
                                rec: r,
                                text: r.summary || "",
                              })
                            }
                            title="View / Edit Summary"
                          >
                            View / Edit Summary
                          </button>
                        ) : (
                          <p className="text-sm text-primary-300/60">
                            No summary available
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {r.transcript ? (
                          <button
                            className="text-sm text-primary-300/80 underline hover:text-primary-300"
                            onClick={() => setTranscriptViewing(r)}
                            title="View Transcript"
                          >
                            View Transcript
                          </button>
                        ) : (
                          <p className="text-sm text-primary-300/60">
                            No transcript available
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <span className="inline-flex gap-2 capitalize items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-300/20 text-primary-300 border border-primary-300/30">
                          {r.status === "processing" ? "Processing" : r.status}
                          {r.status === "processing" && (
                            <span className="inline-flex items-center gap-1 text-xs text-primary-300/80">
                              <Loader2 className="w-3 h-3 animate-spin" />
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        {r.status === "failed" && r.audio_url ? (
                          <button
                            className="p-2 rounded-lg bg-white/10 text-primary-300 hover:bg-white/20 transition-colors"
                            onClick={() => executeTranscript(r.id)}
                            title="Execute Transcript"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            className="p-2 rounded-lg bg-white/10 text-primary-300 hover:bg-white/20 transition-colors"
                            onClick={() => processAndTranscribe(r.id)}
                            title="Convert to MP3 & Transcribe"
                          >
                            <Mic className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="p-2 rounded-lg bg-white/10 text-primary-300 hover:bg-white/20 transition-colors"
                          onClick={() => setEditing(r)}
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                          onClick={() => handleDelete(r.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      {isCreateOpen && (
        <AppModal
          title="Upload ABJ Recording"
          subtitle="Fill in the details below and click Save"
          onClose={() => setIsCreateOpen(false)}
          actions={
            <>
              <button
                className="btn-ghost"
                onClick={() => setIsCreateOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary-300 text-black rounded-lg hover:bg-primary-300/80"
                onClick={() => {
                  const form = document.getElementById(
                    "create-form"
                  ) as HTMLFormElement | null;
                  form?.requestSubmit();
                }}
                type="button"
              >
                Save
              </button>
            </>
          }
        >
          <RecordingForm
            initial={{
              title: "",
              type: "Full Moons",
              video_url: "",
              date: new Date(),
              summary: "",
              status: "draft",
            }}
            onSubmit={(values) => handleCreate(values)}
          />
        </AppModal>
      )}

      {editing && (
        <AppModal
          title="Edit Recording"
          subtitle="Update fields and click Save"
          onClose={() => setEditing(null)}
          actions={
            <>
              <button
                className="btn-ghost"
                onClick={() => setEditing(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary-300 text-black rounded-lg hover:bg-primary-300/80"
                onClick={() => {
                  const form = document.getElementById(
                    "edit-form"
                  ) as HTMLFormElement | null;
                  form?.requestSubmit();
                }}
                type="button"
              >
                Save
              </button>
            </>
          }
        >
          <RecordingForm
            initial={editing}
            onSubmit={(values) => handleUpdate({ ...editing, ...values })}
          />
        </AppModal>
      )}

      {summaryEditing && (
        <AppModal
          title="Summary"
          subtitle="View or update the AI-generated summary"
          onClose={() => setSummaryEditing(null)}
          actions={
            <>
              <button
                className="btn-ghost"
                onClick={() => setSummaryEditing(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary-300 text-black rounded-lg hover:bg-primary-300/80 disabled:opacity-50"
                onClick={saveSummary}
                type="button"
                disabled={savingSummary}
              >
                {savingSummary ? "Saving..." : "Save"}
              </button>
            </>
          }
        >
          <div>
            <label className="block text-sm font-medium text-primary-300/80 mb-2">
              Summary
            </label>
            <textarea
              className="w-full min-h-80 px-4 py-3 rounded-lg bg-white/5 border border-primary-300/20 text-primary-300 focus:border-primary-300/40 focus:outline-none transition-colors"
              value={summaryEditing.text}
              onChange={(e) =>
                setSummaryEditing((prev) =>
                  prev ? { ...prev, text: e.target.value } : prev
                )
              }
            />
          </div>
        </AppModal>
      )}

      {transcriptViewing && (
        <AppModal
          title="Transcript"
          subtitle="Read-only transcript"
          onClose={() => setTranscriptViewing(null)}
        >
          <div className="max-h-[60vh] overflow-y-auto">
            <pre className="whitespace-pre-wrap break-words text-sm text-primary-300/80">
              {transcriptViewing.transcript}
            </pre>
          </div>
        </AppModal>
      )}
    </div>
  );
};

export default AbjRecordings;
