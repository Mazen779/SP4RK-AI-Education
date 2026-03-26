import React, { useState } from "react";
import { ArrowUp, ChevronDown, Image as ImageIcon, Mic, Paperclip, Wand2 } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { aiModes } from "../../data/mockData";

export function PromptComposer({ compact = false }) {
  const [mode, setMode] = useState(aiModes[0]);

  return (
    <div
      className={cn(
        "rounded-[28px] border border-zinc-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]",
        compact ? "p-3" : "p-4 md:p-5"
      )}
    >
      <textarea
        rows={compact ? 2 : 3}
        className="w-full resize-none bg-transparent text-sm leading-7 text-zinc-900 outline-none placeholder:text-zinc-400"
        placeholder="اسأل سؤالك... ارفع صورة لمسألة، ملف PDF، أو ابدأ مراجعة ذكية داخل المادة أو الدرس"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm">
          <ImageIcon className="h-4 w-4" />
          صورة
        </Button>
        <Button variant="secondary" size="sm">
          <Paperclip className="h-4 w-4" />
          ملف
        </Button>
        <Button variant="secondary" size="sm">
          <Mic className="h-4 w-4" />
          صوت
        </Button>

        <div className="mr-auto flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50">
            <Wand2 className="h-4 w-4" />
            <span>{mode}</span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
          </button>
          <Button size="sm">
            <ArrowUp className="h-4 w-4" />
            إرسال
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {aiModes.slice(0, 5).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[11px] transition-colors",
              mode === m ? "border-zinc-900 bg-zinc-950 text-white" : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-white"
            )}
          >
            {m}
          </button>
        ))}
        <Badge variant="outline" className="ml-auto">
          نطاق: عام
        </Badge>
      </div>
    </div>
  );
}

