"use client";

import { useState, useMemo, useEffect } from "react";
import { RecordingForm } from "./recordings-form";
import { formatDate } from "@/lib/utils";
import { FileText, Video, Edit3, Trash2, Plus, Calendar } from "lucide-react";
import AppModal from "@/component/common/AppModal";
import { Recording } from "@/@types/abj-recording";
import {
  fetchRecordings,
  createRecording as createRecordingDb,
  updateRecording as updateRecordingDb,
  deleteRecording as deleteRecordingDb,
  type RecordingRow,
} from "@/lib/supabase";

export const AbjRecordings = () => {
  const [records, setRecords] = useState<Recording[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const rows = await fetchRecordings();
        if (!mounted) return;
        const mapped: Recording[] = rows.map((r: RecordingRow) => ({
          id: r.id,
          title: r.title,
          type: r.type,
          videoUrl: r.videoUrl,
          date: r.date.toISOString(),
          summary: r.summary ?? "",
          status: r.status,
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
  const [editing, setEditing] = useState<Recording | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const sorted = useMemo(() => {
    return [...records].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [records]);

  async function handleCreate(newRec: Omit<Recording, "id">) {
    try {
      const created = await createRecordingDb({
        ...newRec,
        date: new Date(newRec.date),
      });
      const rec: Recording = {
        id: created.id,
        title: created.title,
        type: created.type,
        videoUrl: created.videoUrl,
        date: created.date.toISOString(),
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
      const saved = await updateRecordingDb({
        ...updated,
        date: new Date(updated.date),
      });
      setRecords((prev) =>
        prev.map((r) =>
          r.id === saved.id
            ? {
                id: saved.id,
                title: saved.title,
                type: saved.type,
                videoUrl: saved.videoUrl,
                date: saved.date.toISOString(),
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

  async function handleDelete(id: string) {
    try {
      const ok = window.confirm(
        "Delete this recording? This action cannot be undone."
      );
      if (!ok) return;
      await deleteRecordingDb(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete recording");
    }
  }

  async function handleGenerateSummary(id: string) {
    // Placeholder: pretend AI wrote a summary
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              summary: "Auto-generated summary based on transcript and model.",
            }
          : r
      )
    );
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
        <div className="overflow-x-auto">
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
            <table className="min-w-full divide-y divide-primary-300/20">
              <thead className="bg-black/40">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                    Recording
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
                  <th className="px-6 py-4 text-right text-xs font-medium text-primary-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-300/10">
                {sorted.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
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
                            href={r.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Video →
                          </a>
                        </div>
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
                        {formatDate(r.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-primary-300/80 truncate">
                          {r.summary || "No summary available"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          className="p-2 rounded-lg bg-primary-300 text-black hover:bg-primary-300/80 transition-colors"
                          onClick={() => handleGenerateSummary(r.id)}
                          title="Generate Summary"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
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
              videoUrl: "",
              date: new Date().toISOString(),
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
    </div>
  );
};

export default AbjRecordings;
