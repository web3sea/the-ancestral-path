"use client";

import { useState, useMemo } from "react";
import { RecordingForm } from "./recordings-form";
import { formatDate } from "@/lib/utils";
import { FileText, Video, Edit3, Trash2, Plus, Calendar } from "lucide-react";
import AppModal from "@/component/common/AppModal";
import { Recording } from "@/@types/abj-recording";

export const AbjRecordings = () => {
  const [records, setRecords] = useState<Recording[]>([
    {
      id: "1",
      title: "Breathwork Session 01",
      type: "Full Moons",
      videoUrl: "https://example.com/video/1",
      date: "2024-12-12T10:00:00",
      summary: "Breath-focused session covering grounding and presence.",
      status: "published",
    },
    {
      id: "2",
      title: "Breathwork Session 02",
      type: "New Moons",
      videoUrl: "https://example.com/video/2",
      date: "2024-12-15T14:00:00",
      summary: "Breath-focused session covering grounding and presence.",
      status: "published",
    },
  ]);
  const [editing, setEditing] = useState<Recording | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const sorted = useMemo(() => {
    return [...records].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [records]);

  function handleCreate(newRec: Omit<Recording, "id">) {
    const rec: Recording = {
      id: crypto.randomUUID(),
      ...newRec,
      status: "draft",
    };
    setRecords((prev) => [rec, ...prev]);
    setIsCreateOpen(false);
  }

  function handleUpdate(updated: Recording) {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === updated.id ? { ...updated, status: "draft" } : r
      )
    );
    setEditing(null);
  }

  function handleDelete(id: string) {
    setRecords((prev) => prev.filter((r) => r.id !== id));
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
              New Recording
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
        </div>
      </div>

      {/* Modals */}
      {isCreateOpen && (
        <AppModal
          title="Create New Recording"
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
