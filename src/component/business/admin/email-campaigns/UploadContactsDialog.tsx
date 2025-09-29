"use client";

import { useState, useEffect } from "react";
import { Upload, Check, AlertCircle } from "lucide-react";
import Papa from "papaparse";
import { Button } from "@/component/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/component/ui/dialog";
import { Label } from "@/component/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/component/ui/select";
import {
  useBrevoLists,
  useEmailCampaignUpload,
} from "@/component/hook/useEmailCampaign";
import { UserEmailCampaignUploadData } from "@/@types/email-campaign";

interface UploadResult {
  success: boolean;
  data?: any;
  uploadData?: any;
}

interface UploadContactsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (result: UploadResult) => void;
}

const CONFIG_AUTO_MAPPING = {
  "first name": "first_name",
  "last name": "last_name",
  email: "email",
  id: "kajabi_id",
  "member id": "kajabi_member_id",
};

export function UploadContactsDialog({
  isOpen,
  onClose,
  onUploadComplete,
}: UploadContactsDialogProps) {
  const [selectedBrevoList, setSelectedBrevoList] = useState<string>("");
  // Campaign selection removed
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const [mappedData, setMappedData] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  const uploadMutation = useEmailCampaignUpload();
  const { data: brevoListsData, isLoading: loadingBrevoLists } =
    useBrevoLists();
  // Campaign API removed

  const brevoLists = brevoListsData?.lists || [];
  const loadingBrevoData = loadingBrevoLists;

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  function resetForm() {
    setSelectedBrevoList("");
    // no-op for campaign
    setCsvFile(null);
    setCsvPreview([]);
    setMappedData([]);
    setError("");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".csv")) {
      setCsvFile(file);
      parseCsvPreview(file);
      setError("");
    } else {
      setError("Please select a valid CSV file.");
      setCsvFile(null);
      setCsvPreview([]);
    }
  }

  function parseCsvWithPapa(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          if (results.errors.length > 0) {
            console.warn("CSV parsing warnings:", results.errors);
          }
          resolve(results.data);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  }

  // Auto-mapping function using CONFIG - works with papaparse objects
  function autoMapData(csvData: any[]): any[] {
    if (csvData.length === 0) return [];

    const mappedData = csvData.map((row) => {
      const mappedRow: any = {
        email: "",
        first_name: null,
        last_name: null,
        kajabi_id: null,
        kajabi_member_id: null,
      };

      // Get all column names from the first row
      const columnNames = Object.keys(row);

      columnNames.forEach((columnName) => {
        const lowerHeader = columnName.toLowerCase().trim();
        const value = row[columnName]?.trim() || null;

        // Use CONFIG for mapping - simplified logic
        console.log(
          `Processing column: "${columnName}" -> "${lowerHeader}" = "${value}"`
        );

        // Direct mapping based on exact matches or patterns
        if (lowerHeader === "first name" || lowerHeader === "firstname") {
          mappedRow.first_name = value;
          console.log(`✓ Mapped first_name: "${value}"`);
        } else if (lowerHeader === "last name" || lowerHeader === "lastname") {
          mappedRow.last_name = value;
          console.log(`✓ Mapped last_name: "${value}"`);
        } else if (lowerHeader === "email") {
          mappedRow.email = value;
          console.log(`✓ Mapped email: "${value}"`);
        } else if (lowerHeader === "id") {
          mappedRow.kajabi_id = value;
          console.log(`✓ Mapped kajabi_id: "${value}"`);
        } else if (lowerHeader === "member id" || lowerHeader === "memberid") {
          mappedRow.kajabi_member_id = value;
          console.log(`✓ Mapped kajabi_member_id: "${value}"`);
        } else {
          console.log(`✗ No mapping for: "${lowerHeader}"`);
        }
      });

      return mappedRow;
    });

    const filteredData = mappedData.filter(
      (row) => row.email && row.email.trim() !== ""
    );
    console.log("Final mapped and filtered data:", filteredData);
    return filteredData;
  }

  async function parseCsvPreview(file: File) {
    try {
      const csvData = await parseCsvWithPapa(file);

      // Create preview array for display (first 6 rows)
      const previewRows = csvData.slice(0, 6);
      const previewArray = [];

      if (previewRows.length > 0) {
        // Add headers
        const headers = Object.keys(previewRows[0]);
        previewArray.push(headers);

        // Add data rows
        previewRows.forEach((row) => {
          const rowArray = headers.map((header) => row[header] || "");
          previewArray.push(rowArray);
        });
      }

      setCsvPreview(previewArray);

      // Auto-map data
      const mapped = autoMapData(csvData);
      setMappedData(mapped.slice(0, 5)); // First 5 mapped rows for preview
    } catch (error) {
      console.error("Error parsing CSV:", error);
      setError("Error parsing CSV file. Please check the file format.");
    }
  }

  async function handleSubmit() {
    setError("");

    // Validation
    if (!selectedBrevoList) {
      setError("Please select a Brevo list.");
      return;
    }
    // No campaign validation needed
    if (!csvFile) {
      setError("Please upload a CSV file.");
      return;
    }

    try {
      // Use already mapped data from file parsing
      if (mappedData.length === 0) {
        setError(
          "No valid contacts found. Please check your CSV file has an 'email' column."
        );
        return;
      }

      // Get all mapped data (not just preview) using papaparse
      const csvData = await parseCsvWithPapa(csvFile);
      const allMappedData = autoMapData(csvData);

      if (allMappedData.length === 0) {
        setError(
          "No valid contacts found. Please check your CSV file has an 'email' column."
        );
        return;
      }

      const uploadData: UserEmailCampaignUploadData = {
        campaign_name: `Import ${new Date().toISOString().split("T")[0]}`,
        brevo_list_id: selectedBrevoList,
        items: allMappedData,
      };

      const result = await uploadMutation.mutateAsync(uploadData);

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
          `Upload completed successfully!\n\nTotal contacts processed: ${
            result.data.total_processed || result.data.uploaded_count
          }\nSkipped/Existing contacts: ${
            result.data.skipped_count || 0
          }\nTotal processed: ${result.data.total_processed}`
        );
      }

      onUploadComplete({
        success: true,
        data: result,
        uploadData: uploadData,
      });

      onClose();
    } catch (error) {
      setError(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  function handleClose() {
    onClose();
    resetForm();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full !max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Upload CSV Contacts</DialogTitle>
          <DialogDescription>
            Upload and map your CSV contacts to a Brevo list
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 w-full">
            {/* Brevo Selection */}
            <div className="space-y-4 p-4 rounded-lg border border-primary-300/30 bg-white/5">
              <h3 className="text-lg font-semibold text-primary-300">
                Select Brevo List
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brevo-list">Brevo List</Label>
                  <Select
                    value={selectedBrevoList}
                    onValueChange={setSelectedBrevoList}
                    disabled={loadingBrevoData}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingBrevoData
                            ? "Loading lists..."
                            : "Select a list"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {brevoLists.map((list) => (
                        <SelectItem key={list.id} value={list.id}>
                          {list.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Campaign selection removed */}
              </div>
            </div>

            {/* Auto-mapping info */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-300 mb-2">
                Auto-mapping Rules
              </h4>
              <div className="text-xs text-blue-300/80 space-y-1">
                <p>• First Name → first_name</p>
                <p>• Last Name → last_name</p>
                <p>• Email → email</p>
                <p>• ID → kajabi_id</p>
                <p>• Member ID → kajabi_member_id</p>
              </div>
            </div>

            {/* CSV Upload */}
            {!csvFile && (
              <div className="space-y-4 p-4 rounded-lg border border-primary-300/30 bg-white/5">
                <h3 className="text-lg font-semibold text-primary-300">
                  Upload CSV File
                </h3>

                <div
                  className="relative rounded-xl border-2 border-dashed transition-colors border-primary-300/30 bg-white/5 hover:border-primary-300/50"
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
              </div>
            )}

            {/* CSV Preview */}
            {csvFile && (
              <div className="space-y-4 p-4 rounded-lg border border-primary-300/30 bg-white/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-primary-300">
                    CSV Preview
                  </h3>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <div className="text-sm text-primary-300">
                      {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
                    </div>
                  </div>
                </div>

                <CsvPreviewTableInline mappedData={mappedData} />
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-300">{error}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 flex-shrink-0">
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={handleSubmit}
                disabled={uploadMutation.isPending}
                className="gap-2"
              >
                {uploadMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Upload Contacts
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CsvPreviewTableInline({ mappedData }: { mappedData: any[] }) {
  if (mappedData.length === 0) {
    return (
      <div className="text-center py-8 text-primary-300/60">
        No mapped data to preview
      </div>
    );
  }

  // Get field names that have data
  const fieldNames = Object.values(CONFIG_AUTO_MAPPING);
  const displayFields = fieldNames.filter((field) =>
    mappedData.some((row) => row[field] && row[field].trim() !== "")
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-primary-300">
          Preview (First 5 rows) - Auto-mapped Data
        </h4>
        <div className="border border-primary-300/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/20">
                <tr>
                  {displayFields.map((field, index) => (
                    <th
                      key={index}
                      className="px-3 py-2 text-left text-xs font-medium text-primary-300/80 border-b border-primary-300/20"
                    >
                      {field.replace("_", " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mappedData.slice(0, 5).map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-primary-300/10">
                    {displayFields.map((field, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-3 py-2 text-sm text-primary-300/80"
                      >
                        {row[field] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-xs text-primary-300/60">
          <p>Showing first 5 mapped rows</p>
          <p>Valid contacts found: {mappedData.length}</p>
        </div>
      </div>
    </div>
  );
}

export default UploadContactsDialog;
