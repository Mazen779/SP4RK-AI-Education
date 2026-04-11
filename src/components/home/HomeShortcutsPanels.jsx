import React, { useMemo } from "react";
import { motion } from "framer-motion";

const MotionButton = motion.button;
const MotionDiv = motion.div;
import {
  ArrowUpRight,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Circle,
  ListTodo,
  MessageCircle,
} from "lucide-react";
import { cn } from "../../lib/cn";

function averageProgress(subjects) {
  if (!subjects?.length) return 72;
  const sum = subjects.reduce((acc, s) => acc + (s.progress ?? 0), 0);
  return Math.round(sum / subjects.length);
}

function buildSeries(avg) {
  const t = Math.min(98, Math.max(18, avg));
  return [
    Math.max(12, t - 24),
    Math.max(12, t - 18),
    Math.max(12, t - 12),
    Math.max(12, t - 8),
    Math.max(12, t - 3),
    t,
  ].map((v) => Math.round(Math.min(100, v)));
}

/**
 * Left / progress side — area chart + summary (RTL: appears on start side).
 */
export function HomeProgressShortcutCard({ subjects, t, locale, onOpen }) {
  const avg = useMemo(() => averageProgress(subjects), [subjects]);
  const series = useMemo(() => buildSeries(avg), [avg]);

  const { linePath, areaPath, points, gridSpan } = useMemo(() => {
    const w = 280;
    const h = 112;
    const padL = 8;
    const padR = 8;
    const padB = 4;
    const plotW = w - padL - padR;
    const plotH = h - padB;
    const vals = series;
    const vmin = Math.min(...vals) - 6;
    const vmax = Math.max(...vals) + 6;
    const span = vmax - vmin || 1;
    const n = vals.length;
    const coords = vals.map((v, i) => {
      const x = padL + (i / (n - 1)) * plotW;
      const y = padB + (1 - (v - vmin) / span) * plotH;
      return { x, y, v };
    });
    const dLine = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ");
    const bottom = h - 2;
    const gridSpan = Math.min(90, plotH * 0.85);
    const dArea = [
      `M ${coords[0].x.toFixed(1)} ${bottom}`,
      ...coords.map((c) => `L ${c.x.toFixed(1)} ${c.y.toFixed(1)}`),
      `L ${coords[n - 1].x.toFixed(1)} ${bottom}`,
      "Z",
    ].join(" ");
    return { linePath: dLine, areaPath: dArea, points: coords, gridSpan };
  }, [series]);

  const labels = locale === "ar" ? ["١", "٢", "٣", "٤", "٥", "٦"] : ["W1", "W2", "W3", "W4", "W5", "W6"];

  return (
    <MotionButton
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group flex min-h-[360px] w-full flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white text-start shadow-sm ring-1 ring-zinc-950/[0.04] transition-all duration-300 md:min-h-[400px]",
        "hover:-translate-y-0.5 hover:border-sky-200/90 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500/80"
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-zinc-100/90 bg-gradient-to-br from-sky-50/90 via-white to-white px-4 py-3.5 md:px-5 md:py-4">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-800 ring-1 ring-sky-200/70">
              <BarChart3 className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-zinc-950 md:text-base">{t.home.shortcutProgressTitle}</span>
          </div>
          <p className="text-xs leading-relaxed text-zinc-500 md:text-[13px]">{t.home.shortcutProgressChartSubtitle}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-zinc-950 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm md:text-xs">
          <ArrowUpRight className="h-3.5 w-3.5 opacity-90" strokeWidth={2} />
          {t.home.shortcutProgressOpen}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3 md:px-5 md:pb-5 md:pt-4">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">{t.home.shortcutProgressAvgLabel}</p>
            <p className="text-2xl font-bold tabular-nums tracking-tight text-zinc-950 md:text-3xl">
              {avg}
              <span className="text-base font-semibold text-zinc-400">%</span>
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-2.5 py-1.5 text-end">
            <p className="text-[10px] font-medium text-emerald-700">{t.home.shortcutProgressTrendLabel}</p>
            <p className="text-sm font-bold tabular-nums text-emerald-900">+{Math.min(18, Math.max(3, series[5] - series[0]))}%</p>
          </div>
        </div>

        <div className="relative min-h-[148px] flex-1 rounded-xl border border-zinc-100 bg-gradient-to-b from-zinc-50/80 to-white px-2 pt-2 md:min-h-[168px]">
          <svg viewBox="0 0 280 112" className="h-auto w-full overflow-visible" role="img" aria-label={t.home.shortcutProgressChartAria}>
            <defs>
              <linearGradient id="hp-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(14 165 233)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="rgb(14 165 233)" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="hp-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgb(56 189 248)" />
                <stop offset="100%" stopColor="rgb(2 132 199)" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((r) => (
              <line
                key={r}
                x1="8"
                x2="272"
                y1={8 + r * gridSpan}
                y2={8 + r * gridSpan}
                stroke="rgba(24,24,27,0.06)"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
            ))}
            <path d={areaPath} fill="url(#hp-fill)" />
            <path
              d={linePath}
              fill="none"
              stroke="url(#hp-line)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3.5" className="fill-white stroke-sky-500" strokeWidth="2" />
            ))}
          </svg>
          <div
            className={cn(
              "flex justify-between px-1 pb-1 pt-0.5 text-[10px] font-medium tabular-nums text-zinc-400",
              locale === "ar" && "flex-row-reverse"
            )}
          >
            {labels.map((lb) => (
              <span key={lb}>{lb}</span>
            ))}
          </div>
        </div>
      </div>
    </MotionButton>
  );
}

/**
 * Right / tasks side — dense list + footer CTA (RTL: appears on end side).
 */
export function HomeTasksShortcutCard({ recentChats, t, isRTL, onOpen }) {
  const items = (recentChats || []).slice(0, 4);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
      className={cn(
        "flex min-h-[360px] w-full flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm ring-1 ring-zinc-950/[0.04] md:min-h-[400px]",
        "transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-200/90 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-zinc-100/90 bg-gradient-to-br from-violet-50/90 via-white to-white px-4 py-3.5 md:px-5 md:py-4">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-800 ring-1 ring-violet-200/70">
              <ListTodo className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-zinc-950 md:text-base">{t.home.shortcutTasksTitle}</span>
          </div>
          <p className="text-xs leading-relaxed text-zinc-500 md:text-[13px]">{t.home.shortcutTasksHint}</p>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-violet-200/90 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-violet-900 shadow-sm transition hover:bg-violet-50 md:text-xs"
        >
          {t.home.shortcutTasksOpenAll}
          {isRTL ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
      </div>

      <ul className="flex min-h-0 flex-1 flex-col gap-0 divide-y divide-zinc-100 px-2 py-2 md:px-3 md:py-4">
        {items.length === 0 ? (
          <li className="flex flex-1 items-center justify-center px-3 py-10 text-center text-sm text-zinc-500">{t.home.shortcutTasksEmpty}</li>
        ) : (
          items.map((chat, idx) => (
            <li key={chat.id ?? idx}>
              <button
                type="button"
                onClick={onOpen}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl px-2 py-3 text-start transition hover:bg-zinc-50 md:gap-3.5 md:px-3 md:py-3.5",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500/70"
                )}
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
                  <MessageCircle className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-[13px] font-semibold leading-snug text-zinc-900 md:text-sm">{chat.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 font-medium text-violet-800 ring-1 ring-violet-100">
                      <Circle className="h-1.5 w-1.5 fill-violet-400 text-transparent" />
                      {chat.type}
                    </span>
                    <span className="tabular-nums">{chat.time}</span>
                  </span>
                </span>
              </button>
            </li>
          ))
        )}
      </ul>

      <div className="mt-auto border-t border-zinc-100 bg-zinc-50/50 px-4 py-3 md:px-5">
        <button
          type="button"
          onClick={onOpen}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          {t.home.shortcutTasksPrimaryCta}
        </button>
      </div>
    </MotionDiv>
  );
}
