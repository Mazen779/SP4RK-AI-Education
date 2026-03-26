import React, { useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, Plus } from "lucide-react";
import { Card } from "../components/ui/Card";
import { cn } from "../lib/cn";
import { PromptComposer } from "../components/chat/PromptComposer";

export function ChatPage({ aiModes, recentChats, chatMessages }) {
  const [mode, setMode] = useState(aiModes[0]);

  return (
    <div className="grid h-[calc(100vh-65px)] grid-cols-1 xl:grid-cols-[300px,1fr]">
      <div className="hidden border-l border-zinc-200 bg-zinc-50/60 p-4 xl:block">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">المحادثات</h3>
          <button className="rounded-2xl border border-zinc-200 bg-white p-2 text-zinc-700 hover:bg-zinc-50">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="mb-3 rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-400">ابحث في المحادثات...</div>
        <div className="space-y-2">
          {["الشات العام", "محادثات المواد", "محادثات الدروس", "محادثات الصور", "محادثات الملفات", "محادثات المراجعة"].map((g, i) => (
            <div key={g} className={cn("rounded-2xl px-3 py-2.5 text-sm", i === 0 ? "bg-zinc-950 text-white" : "text-zinc-700 hover:bg-white")}>
              {g}
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-2">
          {recentChats.map((chat) => (
            <div key={chat.id} className="rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <div className="truncate text-sm font-medium text-zinc-900">{chat.title}</div>
                <MoreHorizontal className="h-4 w-4 text-zinc-400" />
              </div>
              <div className="text-xs text-zinc-500">
                {chat.type} · {chat.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-col">
        <div className="border-b border-zinc-200 bg-white px-4 py-3 md:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-1 text-sm font-semibold text-zinc-900">الشات العام التعليمي</div>
              <div className="text-xs text-zinc-500">مفيد، منظم، ويعمل ضمن حدود تعليمية واضحة</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {aiModes.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[11px] transition-colors",
                    mode === m ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(to_bottom,_#ffffff,_#fafafa)] p-4 md:p-6">
          <div className="mx-auto max-w-4xl space-y-4">
            {chatMessages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex">
                <div
                  className={cn(
                    "w-full rounded-[28px] p-4 md:p-5",
                    m.role === "assistant" ? "border border-zinc-200 bg-white" : "bg-zinc-950 text-white"
                  )}
                >
                  <div className={cn("mb-2 text-xs font-medium", m.role === "assistant" ? "text-zinc-400" : "text-white/60")}>
                    {m.role === "assistant" ? `المساعد · ${mode}` : "أنت"}
                  </div>
                  <div className={cn("whitespace-pre-line text-sm leading-8", m.role === "assistant" ? "text-zinc-800" : "text-white")}>{m.content}</div>
                  {m.note ? <div className="mt-4 rounded-2xl bg-zinc-50 p-3 text-xs text-zinc-600">{m.note}</div> : null}
                </div>
              </motion.div>
            ))}

            <div className="flex items-center gap-2 px-1 text-xs text-zinc-400">
              <motion.div
                animate={{ scale: [0.85, 1.1, 0.85], opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.1 }}
                className="h-2.5 w-2.5 rounded-full bg-zinc-400"
              />
              جاري إنشاء إجابة تعليمية دقيقة...
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 bg-white p-4 md:p-5">
          <div className="mx-auto max-w-4xl">
            <PromptComposer compact />
          </div>
        </div>
      </div>
    </div>
  );
}

