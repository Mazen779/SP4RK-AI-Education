import React from "react";
import { Bot } from "lucide-react";
import { cn } from "../../lib/cn";
import { useLocale } from "../../lib/locale.jsx";
import SolveMessageCard from "./SolveMessageCard";
import ClarificationCard from "./ClarificationCard";
import AIFormattedMessage from "./AIFormattedMessage";
import TypingMessage from "./TypingMessage";

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1" aria-label="Assistant is typing" role="status">
      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.2s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.1s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
    </div>
  );
}

function isSolveRichAssistant(m) {
  return (
    m.role === "assistant" &&
    m.content &&
    typeof m.content === "object" &&
    (m.content.type === "solve" || m.content.intent === "solve")
  );
}

function isClarificationAssistant(m) {
  return (
    m.role === "assistant" &&
    m.content &&
    typeof m.content === "object" &&
    (m.content.type === "clarification" || m.content.intent === "clarification")
  );
}

/** نص للـ Markdown / TypingMessage فقط — لا يُستخرج من رسائل solve (تُعرض عبر SolveMessageCard). */
function assistantMarkdownSource(m) {
  if (isSolveRichAssistant(m)) return "";
  if (isClarificationAssistant(m)) return "";
  if (m.text != null && String(m.text).trim()) return String(m.text);
  const c = m.content;
  if (typeof c === "string") return c;
  if (c && typeof c === "object") {
    return String(c.answer ?? c.final_answer ?? c.explanation ?? "");
  }
  return "";
}

function userVisibleText(m) {
  return m.text ?? (typeof m.content === "string" ? m.content : "") ?? "";
}

function SolveTypingPlaceholder() {
  return (
    <div
      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      role="status"
      aria-label="Building the solution"
    >
      <div className="animate-pulse space-y-3">
        <div className="text-sm font-medium text-zinc-500">Analyzing the exercise...</div>
        <div className="h-3 w-2/3 rounded bg-zinc-200" />
        <div className="text-sm font-medium text-zinc-500">Matching the closest example...</div>
        <div className="h-3 w-1/2 rounded bg-zinc-200" />
        <div className="text-sm font-medium text-zinc-500">Building the solution...</div>
        <div className="h-3 w-3/4 rounded bg-zinc-200" />
      </div>
    </div>
  );
}

export function ChatMessageList({ messages, isLoading = false, onClarificationFollowUp }) {
  const { dir } = useLocale();
  const isRtl = dir === "rtl";

  if (!messages.length && !isLoading) return null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-6 md:px-8" dir={dir}>
      {messages.map((m) => (
        <div
          key={m.id}
          className={cn(
            "flex w-full",
            m.role === "user" ? (isRtl ? "justify-start" : "justify-end") : isRtl ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "flex min-w-0 items-start gap-2",
              m.role === "user" && "flex-row-reverse",
              isSolveRichAssistant(m) || isClarificationAssistant(m)
                ? "w-full max-w-[min(100%,52rem)]"
                : "max-w-[min(100%,40rem)]"
            )}
          >
            {m.role === "assistant" ? (
              <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-violet-700 shadow-[var(--spark-shadow-xs)]">
                <Bot className="h-4 w-4" strokeWidth={1.9} />
              </span>
            ) : null}

            <div
              className={cn(
                "rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-[var(--spark-shadow-xs)]",
                m.role === "user"
                  ? "bg-zinc-900 text-white"
                  : "border border-white/70 bg-white/75 text-zinc-800 backdrop-blur-lg"
              )}
            >
            {m.imageAttachments?.length ? (
              <div className={cn("flex flex-wrap gap-2", userVisibleText(m) ? "mb-3" : "")}>
                {m.imageAttachments.map((img, i) => (
                  <img
                    key={`${img.name}-${i}`}
                    src={img.dataUrl}
                    alt={img.name || ""}
                    className="max-h-[min(280px,50vh)] max-w-full rounded-xl border border-white/10 object-contain"
                  />
                ))}
              </div>
            ) : null}
            {m.pending ? <TypingDots /> : null}
            {m.role === "user" && userVisibleText(m) ? (
              <p className={cn("whitespace-pre-wrap", m.imageAttachments?.length ? "text-[15px]" : "")}>
                {userVisibleText(m)}
              </p>
            ) : null}
            {m.role === "assistant" && !m.pending ? (
              isSolveRichAssistant(m) ? (
                m.isTyping ? (
                  <SolveTypingPlaceholder />
                ) : (
                  <SolveMessageCard data={m.content} />
                )
              ) : isClarificationAssistant(m) ? (
                <ClarificationCard
                  data={m.content}
                  disabled={isLoading}
                  onSelectOption={onClarificationFollowUp}
                />
              ) : assistantMarkdownSource(m) ? (
                m.isTyping ? (
                  <TypingMessage fullText={assistantMarkdownSource(m)} speed={8} />
                ) : (
                  <AIFormattedMessage content={assistantMarkdownSource(m)} />
                )
              ) : null
            ) : null}
            {m.fileNames?.length ? (
              <ul className={cn("mt-2 space-y-1 text-xs", m.role === "user" ? "text-white/80" : "text-zinc-500")}>
                {m.fileNames.map((name) => (
                  <li key={name} className="truncate">
                    📎 {name}
                  </li>
                ))}
              </ul>
            ) : null}
            </div>
          </div>
        </div>
      ))}
      {isLoading ? (
        <div className={cn("flex w-full", isRtl ? "justify-end" : "justify-start")}>
          <div className="flex max-w-[min(100%,40rem)] items-start gap-2">
            <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-violet-700 shadow-[var(--spark-shadow-xs)]">
              <Bot className="h-4 w-4" strokeWidth={1.9} />
            </span>
            <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 text-zinc-800 shadow-[var(--spark-shadow-xs)] backdrop-blur-lg">
              <TypingDots />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
