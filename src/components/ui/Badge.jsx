import React from "react";
import { cn } from "../../lib/cn";

export function Badge({ variant = "neutral", className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium",
        variant === "neutral" && "bg-zinc-100 text-zinc-700",
        variant === "outline" && "border border-zinc-200 bg-white text-zinc-700",
        variant === "solid" && "bg-zinc-950 text-white",
        variant === "warning" && "bg-amber-100 text-amber-900",
        className
      )}
      {...props}
    />
  );
}

