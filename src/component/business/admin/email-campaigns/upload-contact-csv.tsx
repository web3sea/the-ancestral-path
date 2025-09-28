"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, Check } from "lucide-react";
import { Button } from "@/component/ui/button";
import { Label } from "@/component/ui/label";

export function UploadContactCsv() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleFileSelect(file: File) {
    if (!file.name.endsWith(".csv")) {
      alert("Please select a CSV file");
      return;
    }
    setSelectedFile(file);
    setUploaded(false);
  }

  function onDropFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    handleFileSelect(files[0]);
  }

  async function handleUpload() {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    setUploading(false);
    setUploaded(true);
    setSelectedFile(null);
  }

  function resetUpload() {
    setSelectedFile(null);
    setUploaded(false);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative rounded-xl border transition-colors ${
          dragActive
            ? "border-primary-300/60 bg-white/10"
            : "border-primary-300/20 bg-white/5"
        }`}
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
          accept=".csv"
          className="hidden"
          onChange={(e) => onDropFiles(e.target.files)}
          disabled={uploading}
        />
        <button
          type="button"
          className="w-full text-left"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <div className="flex flex-col items-center justify-center p-8">
            {uploaded ? (
              <Check className="w-8 h-8 text-green-400" />
            ) : (
              <Upload className="w-8 h-8 text-primary-300/70" />
            )}
            <p className="mt-3 text-sm text-primary-300/80">
              {uploaded
                ? "CSV uploaded successfully!"
                : "Drag and drop your CSV file here, or click to browse"}
            </p>
            {selectedFile && (
              <p className="mt-2 text-xs text-primary-300/60">
                Selected: {selectedFile.name} (
                {(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
        </button>

        {uploading && (
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

      <div className="flex items-center gap-3">
        {selectedFile && !uploaded && (
          <Button
            variant="default"
            onClick={handleUpload}
            disabled={uploading}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload CSV"}
          </Button>
        )}
        {(selectedFile || uploaded) && (
          <Button variant="ghost" onClick={resetUpload} className="gap-2">
            <X className="w-4 h-4" />
            Reset
          </Button>
        )}
      </div>

      <div className="text-xs text-primary-300/60">
        <p>CSV format should include columns: email, first_name, last_name</p>
        <p>Maximum file size: 10MB</p>
      </div>
    </div>
  );
}
