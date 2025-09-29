import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/shadcn-ui";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 rounded-md",
        destructive:
          "bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-md border border-red-500/30",
        outline:
          "bg-transparent text-primary-300 border border-primary-300/30 hover:bg-white/9 hover:border-primary-300/50 rounded-full backdrop-filter backdrop-blur-sm",
        secondary:
          "bg-transparent text-primary-300 border border-primary-300/30 hover:bg-white/9 hover:border-primary-300/50 rounded-full backdrop-filter backdrop-blur-sm",
        ghost:
          "bg-white/6 text-primary-300 border border-primary-300/20 hover:bg-white/10 rounded-xl",
        link: "text-primary-300 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 rounded-full px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-full gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-full px-10 py-2 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
