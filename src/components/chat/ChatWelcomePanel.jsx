import React, { useMemo } from "react";
import { BookOpen, CalendarRange, ClipboardCheck, ImageUp, Lightbulb } from "lucide-react";
import { useLocale } from "../../lib/locale.jsx";
import { cn } from "../../lib/cn";
import { QuickPromptCard } from "./QuickPromptCard";

const CARD_ORDER = ["explainSimple", "quickQuiz", "lessonPlan", "weeklyPlan", "analyzeHw"];
const PLATFORM_LOGO_SRC = "/logo-sp4rk-removebg-preview.png";

const CARD_ACCENTS = {
  lessonPlan: "violet",
  quickQuiz: "sky",
  explainSimple: "amber",
  analyzeHw: "rose",
  weeklyPlan: "emerald",
};

const CARD_ICONS = {
  lessonPlan: BookOpen,
  quickQuiz: ClipboardCheck,
  explainSimple: Lightbulb,
  analyzeHw: ImageUp,
  weeklyPlan: CalendarRange,
};

export function ChatWelcomePanel({ onSelectQuickStart, compactSpacing = false }) {
  const { t, dir } = useLocale();
  const cw = t.chatWelcome;
  const cards = cw?.cards;

  const items = useMemo(() => {
    if (!cards) return [];
    return CARD_ORDER.map((id) => {
      const entry = cards[id];
      if (!entry) return null;
      return {
        id,
        icon: CARD_ICONS[id],
        title: entry.title,
        description: entry.description,
        prompt: entry.prompt,
      };
    }).filter(Boolean);
  }, [cards]);

  return (
    <div
      dir={dir}
      className={
        compactSpacing
          ? "flex w-full max-w-4xl flex-col items-center px-4 pb-2 pt-2 md:px-8"
          : "flex w-full max-w-4xl flex-col items-center px-4 pb-4 pt-3 md:px-8 md:pb-8"
      }
    >
      <div className={cn("w-full max-w-3xl text-center", compactSpacing ? "mb-4" : "mb-6")}>
        <img src={PLATFORM_LOGO_SRC} alt="SP4RK" className="mx-auto -mt-6 -mb-3 h-36 w-auto object-contain" />
        <h2 className="mt-1 text-balance text-2xl font-semibold leading-relaxed text-zinc-900 md:text-3xl">{cw?.headline}</h2>
      </div>

      <div className="w-full min-h-0">
        {cw?.quickStartSection ? (
          <p className="mb-2 text-center text-xs font-medium text-zinc-400 md:mb-3">{cw.quickStartSection}</p>
        ) : null}
        <ul className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="min-h-0">
              <QuickPromptCard
                accent={CARD_ACCENTS[item.id] || "violet"}
                icon={item.icon}
                title={item.title}
                description={item.description}
                onClick={() =>
                  onSelectQuickStart?.({
                    prompt: item.prompt,
                    openImagePicker: item.id === "analyzeHw",
                  })
                }
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
