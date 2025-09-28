"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/component/ui/table";

interface CsvPreviewProps {
  csvData: string[][];
  onFieldMappingChange: (mapping: Record<string, string>) => void;
  initialMapping?: Record<string, string>;
}

const availableFields = [
  { value: "email", label: "Email (Required)", required: true },
  { value: "first_name", label: "First Name", required: false },
  { value: "last_name", label: "Last Name", required: false },
  { value: "kajabi_id", label: "Kajabi ID", required: false },
  { value: "kajabi_member_id", label: "Kajabi Member ID", required: false },
];

// Fuzzy matching function
function fuzzyMatchHeader(header: string): string {
  const lowerHeader = header.toLowerCase().trim();

  // Direct matches
  if (lowerHeader.includes("email") || lowerHeader === "e-mail") return "email";
  if (lowerHeader.includes("first") && lowerHeader.includes("name"))
    return "first_name";
  if (lowerHeader.includes("last") && lowerHeader.includes("name"))
    return "last_name";
  if (lowerHeader.includes("kajabi") && lowerHeader.includes("id"))
    return "kajabi_id";

  // Partial matches - more flexible
  if (lowerHeader.includes("email")) return "email";
  if (
    lowerHeader.includes("firstname") ||
    lowerHeader.includes("first_name") ||
    lowerHeader === "first name"
  )
    return "first_name";
  if (
    lowerHeader.includes("lastname") ||
    lowerHeader.includes("last_name") ||
    lowerHeader === "last name"
  )
    return "last_name";
  if (lowerHeader.includes("kajabi")) return "kajabi_id";

  // Additional patterns
  if (lowerHeader === "fname" || lowerHeader === "first") return "first_name";
  if (lowerHeader === "lname" || lowerHeader === "last") return "last_name";

  return "";
}

export function CsvPreview({
  csvData,
  onFieldMappingChange,
  initialMapping = {},
}: CsvPreviewProps) {
  const [fieldMapping, setFieldMapping] =
    useState<Record<string, string>>(initialMapping);
  const [isEditing] = useState(false);

  useEffect(() => {
    if (csvData.length > 0 && Object.keys(initialMapping).length === 0) {
      // Auto-generate fuzzy mapping
      const headers = csvData[0];
      const autoMapping: Record<string, string> = {};

      headers.forEach((header) => {
        const fuzzyMatch = fuzzyMatchHeader(header);
        autoMapping[header] = fuzzyMatch;
      });

      setFieldMapping(autoMapping);
      onFieldMappingChange(autoMapping);
    }
  }, [csvData, initialMapping, onFieldMappingChange]);

  const handleMappingChange = (header: string, value: string) => {
    const newMapping = { ...fieldMapping, [header]: value };
    setFieldMapping(newMapping);
    onFieldMappingChange(newMapping);
  };

  if (csvData.length === 0) {
    return (
      <div className="text-center py-8 text-primary-300/60">
        No CSV data to preview
      </div>
    );
  }

  const headers = csvData[0];
  const previewRows = csvData.slice(1, 6);

  return (
    <div className="space-y-6">
      {/* Mapping vertical list */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary-300">
          Field Mapping
        </h3>
        <div className="space-y-3 w-full">
          {headers.map((header, index) => (
            <div key={index} className="flex items-center gap-3 w-full">
              <div className="flex-1 min-w-0 max-w-[200px]">
                <div className="text-xs text-primary-300/60">CSV Header</div>
                <div className="text-sm text-primary-300/90 truncate">
                  {header}
                </div>
              </div>
              <div className="flex-shrink-0 w-48">
                <select
                  value={fieldMapping[header] || ""}
                  onChange={(e) => handleMappingChange(header, e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-primary-300/20 text-primary-300 focus:border-primary-300/40 focus:outline-none"
                >
                  <option value="">Not mapped</option>
                  {availableFields.map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSV Preview table with proper horizontal scroll */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary-300">CSV Preview</h3>
        <div className="border border-primary-300/20 rounded-lg overflow-hidden w-full">
          <div className="overflow-x-auto max-h-80 w-full">
            <div className="min-w-full">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    {headers.map((header, index) => (
                      <TableHead
                        key={index}
                        className="sticky top-0 bg-black/90 z-10 whitespace-nowrap min-w-[120px] max-w-[200px] px-3 py-2"
                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewRows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell
                          key={cellIndex}
                          className="text-sm text-primary-300/80 align-top min-w-[120px] max-w-[200px] px-3 py-2"
                        >
                          <div className="truncate" title={cell || "-"}>
                            {cell || "-"}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <div className="text-xs text-primary-300/60">
          <p>Showing first 5 rows of your CSV file</p>
          <p>
            Total columns: {headers.length} | Total rows: {csvData.length - 1}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CsvPreview;
