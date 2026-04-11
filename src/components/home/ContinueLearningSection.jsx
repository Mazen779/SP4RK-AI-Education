import React from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "../../lib/cn";

function hintBadge(t, hintKey) {
  switch (hintKey) {
    case "needsReview":
      return t.home.hintBadgeNeedsReview;
    case "almostComplete":
      return t.home.hintBadgeAlmostComplete;
    default:
      return t.home.hintBadgeGoodProgress;
  }
}

function subjectTheme(subjectId) {
  switch (subjectId) {
    case "math":
      return { bar: "from-sky-400 to-blue-600", top: "from-sky-400 via-sky-300 to-transparent" };
    case "science":
      return { bar: "from-emerald-400 to-teal-600", top: "from-emerald-400 via-emerald-300 to-transparent" };
    case "english":
      return { bar: "from-violet-400 to-fuchsia-600", top: "from-violet-400 via-violet-300 to-transparent" };
    default:
      return { bar: "from-zinc-400 to-zinc-600", top: "from-zinc-400 via-zinc-300 to-transparent" };
  }
}

function ResumeCard({ item, t, isRTL, onContinueLesson, onOpenChat, featured = false }) {
  const { subject, lessonTitle, resumePoint, hintKey } = item;
  const theme = subjectTheme(subject.id);
  const pct = Math.min(100, Math.max(0, subject.progress ?? 0));

  return (
    <article
      className={cn(
        "group relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[var(--spark-r-xl)] border bg-[var(--spark-chat-surface)] text-start",
        "border-[color:var(--spark-chat-border)] shadow-[var(--spark-shadow-sm),var(--spark-shadow-inset)]",
        "transition-[box-shadow,transform,border-color] duration-[var(--spark-duration)] ease-[var(--spark-ease-out)]",
        "hover:-translate-y-0.5 hover:border-[color:var(--spark-chat-border-hover)] hover:shadow-[var(--spark-shadow-md)]",
        featured && "ring-1 ring-zinc-900/[0.06]"
      )}
    >
      <div className={cn("h-1 w-full bg-gradient-to-r opacity-90", theme.top)} aria-hidden />

      <div className={cn("flex min-h-0 flex-1 flex-col px-4 pb-4 pt-3", featured && "px-4 pb-4 pt-3.5 md:px-5 md:pb-5 md:pt-4")}>
        {featured ? (
          <span className="mb-2.5 inline-flex w-fit items-center rounded-[var(--spark-r-pill)] border border-[color:var(--spark-chat-border)] bg-[var(--spark-chat-surface-subtle)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--spark-chat-ink-muted)]">
            {t.home.priorityNow}
          </span>
        ) : null}

        <div className="flex items-baseline justify-between gap-3">
          <h3 className={cn("min-w-0 font-semibold tracking-tight text-[var(--spark-chat-ink)]", featured ? "text-base md:text-[17px]" : "text-[15px] md:text-base")}>
            {subject.name}
          </h3>
          <span className="shrink-0 tabular-nums text-[11px] font-medium text-[var(--spark-chat-ink-soft)]">{pct}%</span>
        </div>

        <p className="mt-1.5 line-clamp-1 text-sm font-medium leading-snug text-[var(--spark-chat-ink-muted)]">{lessonTitle}</p>

        <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-[var(--spark-chat-ink-muted)] md:text-xs">
          <span className="font-medium text-[var(--spark-chat-ink)]">{t.home.stoppedAt}</span> {resumePoint}
        </p>

        <div className="mt-3 h-1 w-full overflow-hidden rounded-[var(--spark-r-pill)] bg-zinc-100/90">
          <div className={cn("h-full rounded-[var(--spark-r-pill)] bg-gradient-to-r transition-[width] duration-500 ease-out", theme.bar)} style={{ width: `${pct}%` }} />
        </div>

        <div className="mt-3">
          <span className="inline-flex max-w-full items-center rounded-[var(--spark-r-md)] border border-[color:var(--spark-chat-border)] bg-[var(--spark-chat-surface-subtle)] px-2 py-1 text-[10px] font-medium text-[var(--spark-chat-ink)] md:text-[11px]">
            {hintBadge(t, hintKey)}
          </span>
        </div>

        <div className={cn("mt-3 flex items-stretch gap-2", isRTL && "flex-row-reverse")}>
          <button
            type="button"
            onClick={() => onContinueLesson(item)}
            className={cn(
              "inline-flex min-h-[40px] flex-1 items-center justify-center rounded-[var(--spark-r-lg)] px-3 text-xs font-semibold text-white transition",
              "bg-[var(--spark-chat-accent)] hover:bg-zinc-900",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 focus-visible:ring-offset-2"
            )}
          >
            {t.home.continue}
          </button>
          <button
            type="button"
            onClick={() => onOpenChat(item)}
            className={cn(
              "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--spark-r-lg)] border border-[color:var(--spark-chat-border)] bg-white text-[var(--spark-chat-ink-muted)] transition",
              "hover:border-[color:var(--spark-chat-border-hover)] hover:bg-[var(--spark-chat-accent-softer)] hover:text-[var(--spark-chat-ink)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 focus-visible:ring-offset-2"
            )}
            aria-label={t.home.openChat}
          >
            <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function ContinueLearningSection({ items, t, isRTL, onContinueLesson, onOpenChat, className, compact = false }) {
  const [first, ...rest] = items;

  return (
    <section className={cn("flex min-h-0 w-full flex-col", compact ? "justify-start gap-3 pt-1" : "justify-center gap-4", className)}>
      {first ? (
        <ResumeCard item={first} t={t} isRTL={isRTL} onContinueLesson={onContinueLesson} onOpenChat={onOpenChat} featured />
      ) : null}
      {rest.length > 0 ? (
        <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 md:gap-3">
          {rest.map((item) => (
            <ResumeCard key={item.subject.id} item={item} t={t} isRTL={isRTL} onContinueLesson={onContinueLesson} onOpenChat={onOpenChat} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
