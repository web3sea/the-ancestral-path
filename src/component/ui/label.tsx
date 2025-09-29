"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils/shadcn-ui";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        // Match labels in RecordingForm
        "block text-sm font-medium text-primary-300/80 mb-2",
        className
      )}
      {...props}
    />
  );
}

export { Label };
