import * as React from "react";

import { cn } from "@/lib/utils/shadcn-ui";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base matches RecordingForm inputs
        "w-full min-w-0 bg-white/5 border border-primary-300/20 text-primary-300 rounded-lg px-4 py-3 text-sm transition-colors outline-none",
        // Placeholder and selection
        "placeholder:text-primary-300/60 selection:bg-primary-300/20 selection:text-primary-300",
        // Focus state
        "focus:border-primary-300/40",
        // Disabled
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
