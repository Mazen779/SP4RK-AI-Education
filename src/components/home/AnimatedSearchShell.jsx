import React from "react";

/** Static shell — ring + shadow only (no motion). */
export function AnimatedSearchShell({ children, className = "" }) {
  return (
    <div
      className={`relative overflow-visible rounded-[28px] shadow-[0_12px_40px_rgba(15,23,42,0.06)] ring-1 ring-zinc-200/80 ${className}`}
    >
      <div className="relative z-10 rounded-[28px] bg-white p-[1px]">
        <div className="rounded-[27px] bg-white">{children}</div>
      </div>
    </div>
  );
}
