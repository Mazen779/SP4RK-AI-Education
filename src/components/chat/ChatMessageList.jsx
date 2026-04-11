import React from "react";
import { Bot } from "lucide-react";
import { cn } from "../../lib/cn";
import { useLocale } from "../../lib/locale.jsx";

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1" aria-label="Assistant is typing" role="status">
      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.2s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.1s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
    </div>
  );
}

export function ChatMessageList({ messages }) {
  const { dir } = useLocale();
  const isRtl = dir === "rtl";

  if (!messages.length) return null;

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
          <div className={cn("flex max-w-[min(100%,40rem)] items-start gap-2", m.role === "user" && "flex-row-reverse")}>
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
              <div className={cn("flex flex-wrap gap-2", m.text ? "mb-3" : "")}>
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
            {m.text ? (
              <p className={cn("whitespace-pre-wrap", m.imageAttachments?.length ? "text-[15px]" : "")}>{m.text}</p>
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
    </div>
  );
}
