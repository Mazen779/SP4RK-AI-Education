import React from "react";
import { cn } from "../../lib/cn";

export function IconButton({ size = "md", variant = "secondary", className, children, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-zinc-950/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "disabled:pointer-events-none disabled:opacity-50",
        variant === "secondary" && "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
        variant === "ghost" && "text-zinc-700 hover:bg-zinc-100",
        size === "sm" && "h-9 w-9",
        size === "md" && "h-10 w-10",
        size === "lg" && "h-11 w-11",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

