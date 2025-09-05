"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const AppSelect = ({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        className="w-full pr-10 px-4 py-3 rounded-lg bg-white/5 border border-primary-300/20 text-left text-primary-300 hover:bg-white/10 transition-colors"
        onClick={() => setOpen((s) => !s)}
      >
        {value}
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-300/70" />
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-primary-300/20 bg-black/95 shadow-xl overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`w-full text-left px-4 py-2 text-sm ${
                opt === value
                  ? "bg-white/10 text-primary-300"
                  : "text-primary-300/90 hover:bg-white/5"
              }`}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppSelect;
