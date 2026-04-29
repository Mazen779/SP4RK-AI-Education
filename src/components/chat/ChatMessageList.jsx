import React from "react";
import { Bot } from "lucide-react";
import { cn } from "../../lib/cn";
import { isSolveLikePayload } from "../../lib/ragMessageTypes";
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

function isSolveContent(c) {
  return (
    c &&
    typeof c === "object" &&
    (c.type === "solve" || c.intent === "solve" || isSolveLikePayload(c))
  );
}

function isClarificationContent(c) {
  return c && typeof c === "object" && (c.type === "clarification" || c.intent === "clarification");
}

function isSolveRichAssistant(m) {
  return m.role === "assistant" && m.content && typeof m.content === "object" && isSolveContent(m.content);
}

function isClarificationAssistant(m) {
  return (
    m.role === "assistant" && m.content && typeof m.content === "object" && isClarificationContent(m.content)
  );
}

function isErrorAssistant(m) {
  return m.role === "assistant" && m.content && typeof m.content === "object" && m.content.type === "error";
}

function isInsufficientContextAssistant(m) {
  return (
    m.role === "assistant" &&
    m.content &&
    typeof m.content === "object" &&
    m.content.type === "insufficient_context"
  );
}

function isWideAssistantCard(m) {
  return (
    isSolveRichAssistant(m) ||
    isClarificationAssistant(m) ||
    isErrorAssistant(m) ||
    isInsufficientContextAssistant(m)
  );
}

function userVisibleText(m) {
  if (m.text != null && String(m.text).trim()) return String(m.text);
  const c = m.content;
  if (typeof c === "string") return c;
  if (c && typeof c === "object") {
    const q = String(c.question ?? c.text ?? c.body ?? "").trim();
    if (q) return q;
  }
  return "";
}

function userFallbackContent(m) {
  const c = m.content;
  if (typeof c === "string") return c;
  if (c && typeof c === "object") return String(c.question ?? "");
  return "";
}

function typingFullText(m) {
  const c = m.content;
  if (typeof c === "string") return c;
  if (c && typeof c === "object") {
    return String(c.answer ?? c.explanation ?? "");
  }
  return "";
}

function aiFormattedContentFromMessage(m) {
  const c = m.content;
  if (typeof c === "string") return c;
  if (c && typeof c === "object") {
    return String(c.answer ?? c.explanation ?? "");
  }
  return "";
}

export function ChatMessageList({
  messages,
  isLoading = false,
  onClarificationFollowUp,
  onSendClarification,
}) {
  const sendClarification = onSendClarification ?? onClarificationFollowUp;
  const { dir } = useLocale();
  const isRtl = dir === "rtl";

  if (!messages.length && !isLoading) return null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-6 md:px-8" dir={dir}>
      {messages.map((m) => {
        return (
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
                isWideAssistantCard(m) ? "w-full max-w-[min(100%,52rem)]" : "max-w-[min(100%,40rem)]"
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

                {m.role === "user" ? (
                  userVisibleText(m) ? (
                    <p className={cn("whitespace-pre-wrap", m.imageAttachments?.length ? "text-[15px]" : "")}>
                      {userVisibleText(m)}
                    </p>
                  ) : (
                    <div>
                      {typeof m.content === "string" ? m.content : userFallbackContent(m)}
                    </div>
                  )
                ) : !m.pending ? (
                  m.content?.type === "chat" ? (
                    <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-200 bg-white px-6 py-5 text-lg leading-8 text-zinc-800 shadow-sm">
                      {m.content?.answer || m.content?.message || "Hi! How can I help?"}
                    </div>
                  ) : m.content?.type === "clarification" || m.content?.intent === "clarification" ? (
                    <ClarificationCard
                      data={m.content}
                      disabled={isLoading}
                      onSelectOption={(option) => {
                        if (option?.reply_text && sendClarification) {
                          sendClarification(option.reply_text);
                          return;
                        }
                        if (typeof option === "string" && sendClarification) {
                          sendClarification(option);
                        }
                      }}
                      onSelectSuggestedReply={(reply) => {
                        if (sendClarification) {
                          sendClarification(reply);
                        }
                      }}
                    />
                  ) : isSolveContent(m.content) ? (
                    <SolveMessageCard data={m.content} />
                  ) : m.content?.type === "error" ? (
                    <div className="mx-auto max-w-4xl rounded-3xl border border-red-200 bg-red-50 p-5 text-red-900 shadow-sm">
                      {m.content?.message_en || "Something went wrong."}
                    </div>
                  ) : m.content?.type === "insufficient_context" ? (
                    <div className="mx-auto max-w-4xl rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm">
                      <div className="text-sm font-bold uppercase tracking-wide">
                        Textbook context is not enough
                      </div>
                      <p className="mt-3 text-lg leading-8">
                        {m.content?.message_en ||
                          "The retrieved textbook context is not sufficient."}
                      </p>
                      {m.content?.message_ar ? (
                        <p className="mt-3 text-base leading-8" dir="rtl">
                          {m.content.message_ar}
                        </p>
                      ) : null}
                    </div>
                  ) : m.isTyping ? (
                    <TypingMessage fullText={typingFullText(m)} speed={8} />
                  ) : (
                    <AIFormattedMessage content={aiFormattedContentFromMessage(m)} />
                  )
                ) : null}

                {m.fileNames?.length ? (
                  <ul
                    className={cn("mt-2 space-y-1 text-xs", m.role === "user" ? "text-white/80" : "text-zinc-500")}
                  >
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
        );
      })}
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
