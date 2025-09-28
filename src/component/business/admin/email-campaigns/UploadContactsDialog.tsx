"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Check, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/component/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/component/ui/dialog";
import { Label } from "@/component/ui/label";
import CsvPreview from "./CsvPreview";
import { emailCampaignSchema, type EmailCampaignFormValues } from "./schema";
import { useEmailCampaignUpload } from "@/component/hook/useEmailCampaign";
import { UserEmailCampaignUploadData } from "@/@types/email-campaign";

interface BrevoList {
  id: string;
  name: string;
}

interface BrevoCampaign {
  id: string;
  name: string;
}

interface UploadResult {
  success: boolean;
  data?: any;
  uploadData?: any;
}

interface UploadContactsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (result: UploadResult) => void;
  brevoLists: BrevoList[];
  brevoCampaigns: BrevoCampaign[];
  loadingBrevoData: boolean;
}

export function UploadContactsDialog({
  isOpen,
  onClose,
  onUploadComplete,
  brevoLists,
  brevoCampaigns,
  loadingBrevoData,
}: UploadContactsDialogProps) {
  const [uploadStep, setUploadStep] = useState(1);
  const [selectedBrevoList, setSelectedBrevoList] = useState<string | null>(
    null
  );
  const [selectedBrevoCampaign, setSelectedBrevoCampaign] = useState<
    string | null
  >(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const uploadMutation = useEmailCampaignUpload();
  const [validRowsCount, setValidRowsCount] = useState(0);
  const [invalidRowsCount, setInvalidRowsCount] = useState(0);

  const form = useForm<EmailCampaignFormValues>({
    resolver: zodResolver(emailCampaignSchema),
    defaultValues: {
      campaign_name: "",
      brevo_list_id: "",
      brevo_campaign_id: "",
      items: [],
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      resetUploadModal();
    }
  }, [isOpen]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".csv")) {
      setCsvFile(file);
      parseCsvPreview(file);
    } else {
      alert("Please select a CSV file.");
      setCsvFile(null);
      setCsvPreview([]);
    }
  }

  function parseCsvPreview(file: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter((line) => line.trim() !== "");
      const parsed = lines.map((line) => line.split(","));

      // Show first 6 rows for preview
      setCsvPreview(parsed.slice(0, 6));

      if (parsed.length > 0) {
        const headers = parsed[0];
        const initialMapping: Record<string, string> = {};
        headers.forEach((header) => {
          if (header.toLowerCase().includes("email"))
            initialMapping[header] = "email";
          else if (
            header.toLowerCase().includes("first") &&
            header.toLowerCase().includes("name")
          )
            initialMapping[header] = "first_name";
          else if (
            header.toLowerCase().includes("last") &&
            header.toLowerCase().includes("name")
          )
            initialMapping[header] = "last_name";
          else if (
            header.toLowerCase().includes("kajabi") &&
            header.toLowerCase().includes("id")
          )
            initialMapping[header] = "kajabi_id";
          else if (
            header.toLowerCase().includes("kajabi") &&
            header.toLowerCase().includes("member") &&
            header.toLowerCase().includes("id")
          )
            initialMapping[header] = "kajabi_member_id";
          else initialMapping[header] = ""; // Default to no mapping
        });
        setFieldMapping(initialMapping);

        // Count valid/invalid rows
        const dataRows = parsed.slice(1);
        let validCount = 0;
        let invalidCount = 0;

        dataRows.forEach((row) => {
          const emailIndex = headers.findIndex(
            (h) =>
              fieldMapping[h] === "email" || h.toLowerCase().includes("email")
          );
          const hasEmail =
            emailIndex >= 0 && row[emailIndex] && row[emailIndex].trim() !== "";

          if (hasEmail) {
            validCount++;
          } else {
            invalidCount++;
          }
        });

        setValidRowsCount(validCount);
        setInvalidRowsCount(invalidCount);
      }
    };
    reader.readAsText(file);
  }

  async function handleConfirmAndCreate() {
    if (!selectedBrevoList || !selectedBrevoCampaign || !csvFile) {
      alert("Please complete all steps.");
      return;
    }

    if (!Object.values(fieldMapping).includes("email")) {
      alert("Please map at least one field to Email (required).");
      return;
    }

    if (validRowsCount === 0) {
      alert(
        "No valid contacts found. Please check your CSV file and field mapping."
      );
      return;
    }

    try {
      // Parse CSV data for upload
      const csvText = await readFileAsText(csvFile);
      const lines = csvText.split("\n").filter((line) => line.trim() !== "");
      const parsed = lines.map((line) => line.split(","));

      if (parsed.length === 0) {
        throw new Error("CSV file is empty");
      }

      const headers = parsed[0];
      const dataRows = parsed.slice(1);

      // Map data according to field mapping and schema
      const items = dataRows
        .map((row) => {
          const mappedRow: Record<string, string> = {};
          headers.forEach((header, index) => {
            const fieldName = fieldMapping[header];
            if (fieldName && row[index]) {
              mappedRow[fieldName] = row[index].trim();
            }
          });
          return mappedRow;
        })
        .filter((row) => row.email) // Only include rows with email
        .map((row) => ({
          email: row.email,
          first_name: row.first_name || null,
          last_name: row.last_name || null,
          kajabi_id: row.kajabi_id || null,
          kajabi_member_id: row.kajabi_member_id || null,
        }));

      // Prepare upload data according to schema
      const uploadData: UserEmailCampaignUploadData = {
        campaign_name: `Campaign ${new Date().toISOString().split("T")[0]}`,
        brevo_list_id: selectedBrevoList,
        brevo_campaign_id: selectedBrevoCampaign,
        items: items,
      };

      // Use mutation hook
      const result = await uploadMutation.mutateAsync(uploadData);

      // Show upload summary
      if (result.data.errors && result.data.errors.length > 0) {
        alert(
          `Upload completed with some errors:\n\n${result.data.errors
            .slice(0, 5)
            .join("\n")}${
            result.data.errors.length > 5 ? "\n... and more" : ""
          }`
        );
      } else {
        alert(
          `Upload completed successfully!\n\nUploaded: ${result.data.uploaded_count}\nSkipped: ${result.data.skipped_count}\nTotal: ${result.data.total_processed}`
        );
      }

      // Call onUploadComplete with result data
      onUploadComplete({
        success: true,
        data: result,
        uploadData: uploadData,
      });

      onClose();
    } catch (error) {
      alert(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      reader.readAsText(file);
    });
  }

  function resetUploadModal() {
    setUploadStep(1);
    setSelectedBrevoList(null);
    setSelectedBrevoCampaign(null);
    setCsvFile(null);
    setCsvPreview([]);
    setFieldMapping({});
    setValidRowsCount(0);
    setInvalidRowsCount(0);
    form.reset();
  }

  function handleClose() {
    onClose();
    resetUploadModal();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full !max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>New Upload - Step {uploadStep} of 3</DialogTitle>
          <DialogDescription>
            Upload and map your CSV contacts to Brevo lists and campaigns
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 w-full">
            {/* Step 1: Brevo Selection */}
            <div
              className={`space-y-4 p-4 rounded-lg border ${
                uploadStep >= 1
                  ? "border-primary-300/30 bg-white/5"
                  : "border-primary-300/10 bg-white/2"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    uploadStep >= 1
                      ? "bg-primary-300 text-black"
                      : "bg-primary-300/20 text-primary-300/60"
                  }`}
                >
                  {uploadStep > 1 ? <Check className="w-4 h-4" /> : "1"}
                </div>
                <h3 className="text-lg font-semibold text-primary-300">
                  Select Brevo List & Campaign
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brevo-list">Brevo List</Label>
                  <select
                    id="brevo-list"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-primary-300/20 text-primary-300 focus:border-primary-300/40 focus:outline-none transition-colors"
                    {...form.register("brevo_list_id")}
                    disabled={loadingBrevoData}
                    onChange={(e) => {
                      form.setValue("brevo_list_id", e.target.value);
                      setSelectedBrevoList(e.target.value);
                    }}
                  >
                    <option value="">
                      {loadingBrevoData ? "Loading lists..." : "Select a list"}
                    </option>
                    {brevoLists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="brevo-campaign">Brevo Campaign</Label>
                  <select
                    id="brevo-campaign"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-primary-300/20 text-primary-300 focus:border-primary-300/40 focus:outline-none transition-colors"
                    {...form.register("brevo_campaign_id")}
                    disabled={loadingBrevoData}
                    onChange={(e) => {
                      form.setValue("brevo_campaign_id", e.target.value);
                      setSelectedBrevoCampaign(e.target.value);
                    }}
                  >
                    <option value="">
                      {loadingBrevoData
                        ? "Loading campaigns..."
                        : "Select a campaign"}
                    </option>
                    {brevoCampaigns.map((campaign) => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: CSV Upload */}
            <div
              className={`space-y-4 p-4 rounded-lg border ${
                uploadStep >= 2
                  ? "border-primary-300/30 bg-white/5"
                  : "border-primary-300/10 bg-white/2"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    uploadStep >= 2
                      ? "bg-primary-300 text-black"
                      : "bg-primary-300/20 text-primary-300/60"
                  }`}
                >
                  {uploadStep > 2 ? <Check className="w-4 h-4" /> : "2"}
                </div>
                <h3 className="text-lg font-semibold text-primary-300">
                  Upload CSV File
                </h3>
              </div>

              {!csvFile ? (
                <div
                  className={`relative rounded-xl border-2 border-dashed transition-colors ${"border-primary-300/30 bg-white/5 hover:border-primary-300/50"}`}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      handleFileChange({ target: { files } } as any);
                    }
                  }}
                >
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                    id="csv-upload"
                  />
                  <label
                    htmlFor="csv-upload"
                    className="flex flex-col items-center justify-center p-8 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary-300/20 flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8 text-primary-300" />
                    </div>
                    <p className="text-lg font-medium text-primary-300 mb-2">
                      Upload CSV File
                    </p>
                    <p className="text-sm text-primary-300/70 text-center">
                      Drag and drop your CSV file here, or click to browse
                    </p>
                  </label>
                </div>
              ) : (
                <div className="rounded-xl border border-green-500/40 bg-green-500/5 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-sm text-primary-300">
                        {csvFile.name}
                      </div>
                      <div className="text-xs text-primary-300/60">
                        {(csvFile.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-primary-300/70">
                    Use Cancel to re-upload
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: CSV Preview & Mapping */}
            {csvPreview.length > 0 && (
              <div
                className={`space-y-4 p-4 rounded-lg border ${
                  uploadStep >= 3
                    ? "border-primary-300/30 bg-white/5"
                    : "border-primary-300/10 bg-white/2"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      uploadStep >= 3
                        ? "bg-primary-300 text-black"
                        : "bg-primary-300/20 text-primary-300/60"
                    }`}
                  >
                    {uploadStep > 3 ? <Check className="w-4 h-4" /> : "3"}
                  </div>
                  <h3 className="text-lg font-semibold text-primary-300">
                    CSV Preview & Field Mapping
                  </h3>
                </div>

                <CsvPreview
                  csvData={csvPreview}
                  onFieldMappingChange={setFieldMapping}
                  initialMapping={fieldMapping}
                />

                {/* Validation Summary */}
                {validRowsCount > 0 && (
                  <div className="bg-white/5 border border-primary-300/20 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-primary-300 mb-2">
                      Validation Summary
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-300">
                          Valid rows: {validRowsCount}
                        </span>
                      </div>
                      {invalidRowsCount > 0 && (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-300">
                            Skipped rows: {invalidRowsCount}
                          </span>
                        </div>
                      )}
                    </div>
                    {invalidRowsCount > 0 && (
                      <p className="text-xs text-primary-300/60 mt-2">
                        Rows without valid email addresses will be skipped
                        during upload.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 flex-shrink-0">
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <div className="flex gap-3">
                {uploadStep < 3 && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (
                        uploadStep === 1 &&
                        selectedBrevoList &&
                        selectedBrevoCampaign
                      ) {
                        setUploadStep(2);
                      } else if (uploadStep === 2 && csvFile) {
                        setUploadStep(3);
                      }
                    }}
                    disabled={
                      (uploadStep === 1 &&
                        (!selectedBrevoList || !selectedBrevoCampaign)) ||
                      (uploadStep === 2 && !csvFile)
                    }
                  >
                    Next
                  </Button>
                )}
                {uploadStep === 3 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleConfirmAndCreate}
                    disabled={
                      uploadMutation.isPending ||
                      !Object.values(fieldMapping).includes("email") ||
                      validRowsCount === 0
                    }
                    className="gap-2"
                  >
                    {uploadMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Confirm & Create ({validRowsCount} contacts)
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UploadContactsDialog;
