import React from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "../../lib/cn";

/** Per-card: vivid icon stroke + soft well — icons read clearly in color */
const ACCENT = {
  violet: {
    iconWell: "bg-violet-100/95",
    iconStroke: "text-violet-600",
    card: "border-violet-200/50 hover:border-violet-300/70 hover:shadow-[0_6px_24px_-8px_rgba(139,92,246,0.2)]",
    chevron: "text-violet-300 group-hover:text-violet-400",
    ring: "focus-visible:ring-violet-400/45",
  },
  sky: {
    iconWell: "bg-sky-100/95",
    iconStroke: "text-sky-600",
    card: "border-sky-200/50 hover:border-sky-300/70 hover:shadow-[0_6px_24px_-8px_rgba(14,165,233,0.18)]",
    chevron: "text-sky-300 group-hover:text-sky-400",
    ring: "focus-visible:ring-sky-400/45",
  },
  emerald: {
    iconWell: "bg-emerald-100/95",
    iconStroke: "text-emerald-600",
    card: "border-emerald-200/50 hover:border-emerald-300/70 hover:shadow-[0_6px_24px_-8px_rgba(16,185,129,0.18)]",
    chevron: "text-emerald-300 group-hover:text-emerald-400",
    ring: "focus-visible:ring-emerald-400/45",
  },
  amber: {
    iconWell: "bg-amber-100/95",
    iconStroke: "text-amber-600",
    card: "border-amber-200/50 hover:border-amber-300/70 hover:shadow-[0_6px_24px_-8px_rgba(245,158,11,0.2)]",
    chevron: "text-amber-300 group-hover:text-amber-500",
    ring: "focus-visible:ring-amber-400/45",
  },
  rose: {
    iconWell: "bg-rose-100/95",
    iconStroke: "text-rose-600",
    card: "border-rose-200/50 hover:border-rose-300/70 hover:shadow-[0_6px_24px_-8px_rgba(244,63,94,0.16)]",
    chevron: "text-rose-300 group-hover:text-rose-400",
    ring: "focus-visible:ring-rose-400/45",
  },
};

export function QuickPromptCard({ icon: Icon, title, description, onClick, className, accent = "violet" }) {
  const a = ACCENT[accent] || ACCENT.violet;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex h-full min-h-[7.75rem] w-full flex-col gap-1 rounded-[var(--spark-r-xl)] border bg-[var(--spark-chat-surface)] p-4 text-start shadow-[var(--spark-shadow-xs)] transition-[transform,box-shadow,border-color] duration-[var(--spark-duration)] ease-[var(--spark-ease-out)] hover:-translate-y-0.5",
        a.card,
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--spark-chat-canvas)]",
        a.ring,
        "active:translate-y-0 active:scale-[0.99] active:shadow-[var(--spark-shadow-xs)]",
        className
      )}
    >
      <span className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--spark-r-lg)] transition-colors",
            a.iconWell
          )}
          aria-hidden
        >
          <Icon className={cn("h-5 w-5", a.iconStroke)} strokeWidth={2} />
        </span>
        <ChevronLeft
          className={cn("mt-1 h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5 rtl:rotate-180", a.chevron)}
          aria-hidden
        />
      </span>
      <span className="mt-2 text-sm font-semibold leading-snug tracking-normal text-[var(--spark-chat-ink)]">{title}</span>
      {description ? (
        <span className="text-xs font-normal leading-relaxed text-[var(--spark-chat-ink-muted)]">{description}</span>
      ) : null}
    </button>
  );
}
