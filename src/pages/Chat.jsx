import React, { useCallback, useRef, useState } from "react";
import { ChatMessageList } from "../components/chat/ChatMessageList";
import { ChatWelcomePanel } from "../components/chat/ChatWelcomePanel";
import { PromptComposer } from "../components/chat/PromptComposer";
import { fileToDataUrl } from "../lib/fileToDataUrl";
import { generateGeminiReply } from "../lib/gemini";
import { sendQuestionToRag } from "../lib/ragApi";
import { useLocale } from "../lib/locale.jsx";

function newId() {
  return crypto.randomUUID();
}

function solveAnswerPreview(response) {
  const fa = response?.final_answer ?? response?.answer ?? response?.explanation;
  if (fa && typeof fa === "object" && fa.type === "fraction") {
    const n = String(fa.numerator ?? "").trim();
    const d = String(fa.denominator ?? "").trim();
    return (n && d ? `${n}/${d}` : n || d || "").trim();
  }
  return String(fa ?? "").trim();
}

function clarificationPreview(response) {
  const msg = String(
    response?.message ?? response?.text ?? response?.question ?? response?.body ?? ""
  ).trim();
  if (msg) return msg.length > 96 ? `${msg.slice(0, 93)}…` : msg;
  const opts = response?.options;
  if (Array.isArray(opts) && opts.length) {
    const first = opts[0];
    const label =
      typeof first === "string"
        ? first
        : String(first?.label ?? first?.text ?? first?.title ?? "").trim();
    if (label) return label.length > 96 ? `${label.slice(0, 93)}…` : label;
  }
  return "Clarification";
}

export function ChatPage({ messages: parentMessages, onMessagesChange, chatMode = "general", chatModeLabel }) {
  const { t, dir } = useLocale();
  const [messages, setMessages] = useState(() => parentMessages ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const composerRef = useRef(null);
  const threadEndRef = useRef(null);

  const commitMessages = useCallback(
    (updater) => {
      setMessages((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        onMessagesChange(() => next);
        return next;
      });
    },
    [onMessagesChange]
  );

  const hasConversation = messages.length > 0;

  const handleSendMessage = async (messageParam) => {
    const cleanedMessage = messageParam?.trim();
    if (!cleanedMessage) return;

    const userMessage = {
      id: newId(),
      role: "user",
      content: cleanedMessage,
      text: cleanedMessage,
    };

    commitMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    requestAnimationFrame(() => {
      threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });

    try {
      const response = await sendQuestionToRag(cleanedMessage);

      console.log("AI Response:", response);

      const resolvedType = response.type ?? response.intent;
      const isSolve = response.type === "solve" || response.intent === "solve";
      const isClarification =
        response.type === "clarification" || response.intent === "clarification";

      let aiMessage;

      if (isSolve) {
        const assistantRagId = newId();
        const previewText = solveAnswerPreview(response) || "حل";
        aiMessage = {
          id: assistantRagId,
          role: "assistant",
          content: response,
          text: previewText,
          isTyping: true,
          meta: {
            type: resolvedType,
            used_context: response.used_context || [],
          },
        };
      } else if (isClarification) {
        const assistantRagId = newId();
        aiMessage = {
          id: assistantRagId,
          role: "assistant",
          content: response,
          text: clarificationPreview(response),
          isTyping: false,
          meta: {
            type: resolvedType,
            used_context: response.used_context || [],
          },
        };
      } else {
        const aiText = `
## الإجابة
${response.answer || ""}

${response.explanation && response.explanation !== response.answer ? `## شرح إضافي\n${response.explanation}` : ""}
`;

        const assistantRagId = newId();
        aiMessage = {
          id: assistantRagId,
          role: "assistant",
          content: aiText,
          text: aiText,
          isTyping: true,
          meta: {
            type: resolvedType,
            used_context: response.used_context || [],
          },
        };
      }

      const assistantRagId = aiMessage.id;

      commitMessages((prev) => [...prev, aiMessage]);

      if (!isClarification) {
        setTimeout(() => {
          commitMessages((prev) =>
            prev.map((msg) => (msg.id === assistantRagId ? { ...msg, isTyping: false } : msg))
          );
        }, isSolve ? 600 : Math.max((typeof aiMessage.content === "string" ? aiMessage.content.length : 0) * 8, 1200));
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("Error:", errMsg);

      const errorMessage = {
        id: newId(),
        role: "assistant",
        content: `حدث خطأ أثناء الاتصال بالنظام: ${errMsg}`,
        text: `حدث خطأ أثناء الاتصال بالنظام: ${errMsg}`,
      };

      commitMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      requestAnimationFrame(() => {
        threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      });
    }
  };

  function handleSelectQuickStart(payload) {
    const prompt = typeof payload === "string" ? payload : payload?.prompt ?? "";
    const openImagePicker = typeof payload === "object" && payload?.openImagePicker === true;
    setMessage(prompt);
    if (openImagePicker) {
      composerRef.current?.openImagePicker?.();
    }
    requestAnimationFrame(() => {
      composerRef.current?.focus?.();
    });
  }

  async function handleSubmit({ text, files }) {
    const trimmed = text.trim();
    if (!trimmed && files.length === 0) return;

    const imageAttachments = [];
    const otherFileNames = [];
    for (const f of files) {
      if (f.type.startsWith("image/")) {
        try {
          const dataUrl = await fileToDataUrl(f);
          imageAttachments.push({ name: f.name, dataUrl });
        } catch {
          otherFileNames.push(f.name);
        }
      } else {
        otherFileNames.push(f.name);
      }
    }

    const userMsg = {
      id: newId(),
      role: "user",
      text: trimmed,
      ...(imageAttachments.length ? { imageAttachments } : {}),
      ...(otherFileNames.length ? { fileNames: otherFileNames } : {}),
    };
    const assistantId = newId();
    const assistantMsg = {
      id: assistantId,
      role: "assistant",
      text: "",
      pending: true,
      fileNames: [],
    };

    commitMessages((prev) => [...prev, userMsg, assistantMsg]);
    setMessage("");

    requestAnimationFrame(() => {
      threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });

    try {
      const aiReply = await generateGeminiReply(trimmed, { mode: chatMode });
      commitMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, text: aiReply, pending: false } : m))
      );
    } catch (error) {
      const technical =
        error instanceof Error && error.message ? `\n\n${error.message}` : "";
      commitMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, text: `${t.chat?.errorFallback ?? ""}${technical}`, pending: false }
            : m
        )
      );
    }
  }

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[var(--spark-chat-canvas)]" dir={dir}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-8 h-56 w-56 rounded-full bg-violet-300/20 blur-3xl" />
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-52 w-52 rounded-full bg-fuchsia-300/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 px-3 pt-3 md:px-8 md:pt-4">
          <div className="inline-flex items-center rounded-full border border-[var(--spark-chat-border)] bg-[var(--spark-chat-surface)] px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-[var(--spark-shadow-xs)]">
            {chatModeLabel || t.titles.chat}
          </div>
        </div>
        {hasConversation ? (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-gutter:stable]">
            <ChatMessageList
              messages={messages}
              isLoading={isLoading}
              onClarificationFollowUp={(prompt) => {
                void handleSendMessage(prompt);
              }}
            />
            <div ref={threadEndRef} className="h-px shrink-0" aria-hidden />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex min-h-0 flex-1 flex-col items-center justify-start overflow-hidden pt-4 md:pt-6">
              <div className="flex min-h-0 w-full flex-col items-center overflow-hidden">
                <ChatWelcomePanel onSelectQuickStart={handleSelectQuickStart} compactSpacing />
              </div>
            </div>
          </div>
        )}

        <div className="relative shrink-0 border-t border-[var(--spark-chat-border)] bg-[color-mix(in_srgb,var(--spark-chat-surface)_74%,transparent)] px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl md:px-8 md:pb-6 md:pt-5">
          <div
            className="pointer-events-none absolute inset-x-0 bottom-full h-10 bg-gradient-to-t from-[color-mix(in_srgb,var(--spark-chat-surface)_80%,transparent)] to-transparent"
            aria-hidden
          />
          <PromptComposer
            ref={composerRef}
            variant="chat"
            message={message}
            onMessageChange={setMessage}
            onSend={handleSendMessage}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
