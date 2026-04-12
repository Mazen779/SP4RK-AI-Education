import React, { useCallback, useMemo } from "react";
import { HelpCircle } from "lucide-react";

function normalizeOption(opt) {
  if (opt == null) return null;
  if (typeof opt === "string") {
    const label = opt.trim();
    return label ? { label, query: null } : null;
  }
  if (typeof opt === "object") {
    const label = String(opt.label ?? opt.text ?? opt.title ?? "").trim();
    const queryRaw = opt.query ?? opt.prompt ?? opt.follow_up ?? opt.followUp;
    const query = queryRaw != null && String(queryRaw).trim() ? String(queryRaw).trim() : null;
    return label || query ? { label: label || query, query } : null;
  }
  return null;
}

/** يبني جملة متابعة إن لم يُرسل الـ API حقل query صريحًا (مثل تسميات «Exercise 12 — … — page 414»). */
export function clarificationFollowUpPrompt(option) {
  const n = normalizeOption(option);
  if (!n) return "";
  if (n.query) return n.query;
  const s = n.label;
  if (!s) return "";
  const parts = s.split(/\s*—\s*/).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    const last = parts[parts.length - 1];
    if (/^page\b/i.test(last)) {
      const intro = parts[0];
      const mid = parts.slice(1, -1).join(" ");
      const topic = mid ? `${intro} in ${mid}` : intro;
      return `Explain ${topic} ${last}`.replace(/\s+/g, " ").trim();
    }
  }
  return `Explain ${s.replace(/\s*—\s*/g, " ").replace(/\s+/g, " ").trim()}`;
}

function clarificationMessage(data) {
  if (!data || typeof data !== "object") return "";
  return String(
    data.message ?? data.text ?? data.question ?? data.body ?? data.clarification ?? ""
  ).trim();
}

export default function ClarificationCard({ data, onSelectOption, disabled = false }) {
  const message = useMemo(() => clarificationMessage(data), [data]);

  const options = useMemo(() => {
    const raw = data?.options;
    if (!Array.isArray(raw)) return [];
    return raw.map(normalizeOption).filter(Boolean);
  }, [data]);

  const handlePick = useCallback(
    (opt) => {
      if (disabled) return;
      const prompt = clarificationFollowUpPrompt(opt);
      if (!prompt || typeof onSelectOption !== "function") return;
      onSelectOption(prompt);
    },
    [disabled, onSelectOption]
  );

  return (
    <div className="w-full space-y-5 rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-50/90 to-white px-5 py-5 shadow-sm ring-1 ring-amber-100/60">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-100/80 text-amber-800">
          <HelpCircle className="h-5 w-5" strokeWidth={2} aria-hidden />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-amber-800/90">
            Clarification needed
          </div>
          {message ? (
            <p className="text-[15px] leading-relaxed text-zinc-800">{message}</p>
          ) : (
            <p className="text-[15px] text-zinc-500">Please choose one of the options below.</p>
          )}
        </div>
      </div>

      {options.length > 0 ? (
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-zinc-500">Choose one</div>
          <ul className="flex flex-col gap-2">
            {options.map((opt, i) => (
              <li key={i}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => handlePick(opt)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm font-medium text-zinc-800 shadow-sm transition hover:border-violet-300 hover:bg-violet-50/60 hover:text-violet-950 disabled:pointer-events-none disabled:opacity-50"
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
