import React from "react";
import { cn } from "../../lib/cn";

export function Tabs({ value, onChange, items, className }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cn(
            "rounded-full px-4 py-2 text-sm transition",
            value === t ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

