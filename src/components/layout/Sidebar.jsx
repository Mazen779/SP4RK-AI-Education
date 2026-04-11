import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronRight, FlaskConical, Languages, MessageCircle, Plus, Search, Settings, Sigma, Trash2, X } from "lucide-react";
import { SparkLogo } from "../brand/SparkLogo";
import { cn } from "../../lib/cn";
import {
  formatRelativeTimeShort,
  getHistoryListTitle,
  getHistoryTitleAndPreview,
} from "../../lib/chatHistoryStorage";
import { useLocale } from "../../lib/locale.jsx";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";

function NavRow({ icon: Icon, label, active, onClick, badge, trailing }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-start transition-all duration-200",
        active ? "bg-zinc-950 text-white shadow-[0_4px_12px_rgba(0,0,0,0.18)]" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-sm font-medium">{label}</span>
      {badge ? (
        <span className={cn("rounded-full px-2 py-0.5 text-[10px]", active ? "bg-white/15 text-white" : "bg-zinc-200 text-zinc-700")}>
          {badge}
        </span>
      ) : null}
      {trailing}
    </button>
  );
}

function navActive(page, item) {
  if (item.expandable) return page === "subject";
  if (item.route === "chat") return page === "chat" && item.key === "tasks";
  if (item.route === "progress") return page === "progress";
  return page === item.route;
}

export function Sidebar({
  open,
  collapsed = false,
  onClose,
  navItems,
  page,
  setPage,
  onNewChat,
  variant = "default",
  onBack,
  subjects,
  savedChats = [],
  onOpenSavedChat,
  onDeleteSavedChat,
  activeChatMode = "general",
  onSelectChatMode,
  selectedSubject,
  setSelectedSubject,
  setSelectedLesson,
  lessonsBySubject,
}) {
  const { t, dir, locale, studentName, studentNameShort } = useLocale();
  const isRTL = dir === "rtl";
  const [chatQuery, setChatQuery] = useState("");
  const [subjectsOpen, setSubjectsOpen] = useState(true);
  const hl = t.historyLabels;

  const filteredChats = useMemo(() => {
    const q = chatQuery.trim();
    const list = savedChats;
    if (!q) return list;
    return list.filter((c) => {
      const { preview } = getHistoryTitleAndPreview(c, hl);
      const listTitle = getHistoryListTitle(c, hl);
      const firstText = c.messages?.find((m) => m.role === "user")?.text?.trim() || "";
      return `${listTitle} ${preview} ${firstText} ${c.type || ""}`.includes(q);
    });
  }, [chatQuery, savedChats, hl]);

  const sc = t.sidebarChat;
  const subjectModes = useMemo(
    () => [
      {
        key: "general",
        label: locale === "en" ? "General" : "عام",
        Icon: MessageCircle,
        dot: "bg-zinc-400",
        active: "bg-zinc-100 border-zinc-300/90 text-zinc-900",
      },
      {
        key: "math",
        label: locale === "en" ? "Mathematics" : "الرياضيات",
        Icon: Sigma,
        dot: "bg-blue-500",
        active: "bg-blue-50 border-blue-200/90 text-blue-900",
      },
      {
        key: "science",
        label: locale === "en" ? "Science" : "العلوم",
        Icon: FlaskConical,
        dot: "bg-emerald-500",
        active: "bg-emerald-50 border-emerald-200/90 text-emerald-900",
      },
      {
        key: "english",
        label: locale === "en" ? "English Language" : "اللغة الإنجليزية",
        Icon: Languages,
        dot: "bg-violet-500",
        active: "bg-violet-50 border-violet-200/90 text-violet-900",
      },
    ],
    [locale]
  );

  const content = (
    <div
      dir={dir}
      className={cn(
        "flex flex-col px-3 py-4",
        variant === "chat"
          ? "min-h-0 flex-1 overflow-hidden spark-chat-sidebar-bg"
          : "min-h-full min-h-0 flex-1 bg-[linear-gradient(to_bottom,_#fcfcfc,_#fafaf9)]"
      )}
    >
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex min-w-0 items-center gap-2">
          {variant === "chat" ? (
            <IconButton variant="ghost" onClick={onBack} aria-label="Back">
              <ArrowLeft className="h-4 w-4" />
            </IconButton>
          ) : null}
          <div className="flex min-w-0 items-center gap-2">
            <SparkLogo size={36} />
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-semibold text-zinc-950">{t.brand}</div>
              <div className="truncate text-[11px] text-zinc-500">{t.brandTagline}</div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {variant === "chat" ? (
          <motion.div
            key="chat-top"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="space-y-4"
          >
            <Button
              className="w-full rounded-[var(--spark-r-xl)] py-3 text-sm font-semibold shadow-[var(--spark-shadow-sm)] transition hover:shadow-[var(--spark-shadow-md)]"
              onClick={() => onNewChat?.()}
            >
              <Plus className="h-4 w-4" />
              {t.nav.newChat.replace(/^\+\s*/, "")}
            </Button>

            <div>
              <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">{sc.shortcutsLabel}</p>
              <div className="grid gap-2">
                {subjectModes.map((mode) => {
                  const active = activeChatMode === mode.key;
                  return (
                    <button
                      key={mode.key}
                      type="button"
                      onClick={() => onSelectChatMode?.(mode.key)}
                      className={cn(
                        "group flex items-center justify-between rounded-[var(--spark-r-lg)] border px-3 py-2.5 text-xs font-medium shadow-[var(--spark-shadow-xs)] transition duration-200",
                        active
                          ? mode.active
                          : "border-[var(--spark-chat-border)] bg-[var(--spark-chat-surface)] text-zinc-800 hover:bg-zinc-50"
                      )}
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <span
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-[var(--spark-r-md)] border transition",
                            active ? "border-white/70 bg-white/85" : "border-transparent bg-[var(--spark-chat-accent-softer)]"
                          )}
                        >
                          <mode.Icon className="h-4 w-4" strokeWidth={1.8} />
                        </span>
                        {mode.label}
                      </span>
                      <span className={cn("h-2.5 w-2.5 rounded-full", mode.dot)} aria-hidden />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-[var(--spark-chat-border)] pt-3">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 start-3" />
                <input
                  value={chatQuery}
                  onChange={(e) => setChatQuery(e.target.value)}
                  placeholder={sc.searchChats}
                  className="w-full rounded-[var(--spark-r-lg)] border border-[var(--spark-chat-border)] bg-[var(--spark-chat-surface)] py-2.5 ps-9 pe-3 text-sm text-zinc-800 shadow-[var(--spark-shadow-xs)] outline-none transition placeholder:text-zinc-400 focus:border-[var(--spark-chat-border-hover)] focus:shadow-[var(--spark-shadow-sm)] focus:ring-2 focus:ring-zinc-300/50"
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="default-top"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="space-y-3"
          >
            <Button className="w-full rounded-3xl py-3.5 text-sm font-semibold shadow-[0_10px_24px_rgba(0,0,0,0.10)]" onClick={() => onNewChat?.()}>
              <Plus className="h-4 w-4" />
              {t.nav.newChat}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout" initial={false}>
        {variant === "default" ? (
          <motion.div
            key="default-nav"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mt-4 space-y-2"
          >
            <div className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">{t.nav.navigation}</div>
            <div className="space-y-1">
              {navItems.map((item) => {
                if (item.expandable) {
                  const active = navActive(page, item);
                  return (
                    <div key={item.key} className="space-y-1">
                      <NavRow
                        icon={item.icon}
                        label={item.label}
                        active={active}
                        onClick={() => setSubjectsOpen((v) => !v)}
                        trailing={
                          <ChevronDown
                            className={cn("h-4 w-4 shrink-0 transition", subjectsOpen && "-rotate-180", active ? "text-white/80" : "text-zinc-400")}
                          />
                        }
                      />
                      <AnimatePresence initial={false}>
                        {subjectsOpen ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-1 border-s border-zinc-200/80 ps-2 ms-2">
                              {subjects.map((subject) => (
                                <button
                                  key={subject.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedSubject(subject.id);
                                    setSelectedLesson((lessonsBySubject[subject.id] || [])[0]?.id);
                                    setPage("subject");
                                  }}
                                  className={cn(
                                    "flex w-full items-center gap-2 rounded-xl px-2 py-2 text-start text-xs transition",
                                    selectedSubject === subject.id && page === "subject"
                                      ? "bg-zinc-100 font-semibold text-zinc-950"
                                      : "text-zinc-600 hover:bg-zinc-50"
                                  )}
                                >
                                  <span className={cn("h-2 w-2 shrink-0 rounded-full", subject.accent.solid)} />
                                  <span className="min-w-0 flex-1 truncate">{subject.name}</span>
                                  <span className="shrink-0 text-[10px] text-zinc-400">{subject.progress}%</span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
                  <NavRow
                    key={item.key}
                    icon={item.icon}
                    label={item.label}
                    badge={item.badge}
                    active={navActive(page, item)}
                    onClick={() => setPage(item.route)}
                  />
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {variant === "chat" ? (
        <div className="mt-6 flex min-h-0 flex-1 flex-col overflow-hidden pt-2">
          <div className="mb-2 shrink-0 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
            {t.nav.recent}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pe-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {filteredChats.length === 0 ? (
              <p className="px-1 py-2 text-center text-[11px] leading-relaxed text-zinc-400">{sc.emptyHistory}</p>
            ) : (
              <ul className="space-y-1">
                {filteredChats.map((chat) => {
                  const listTitle = getHistoryListTitle(chat, hl);
                  return (
                    <li key={chat.id} dir={dir} className="group flex min-h-0 items-center gap-0">
                      <button
                        type="button"
                        onClick={() => onOpenSavedChat?.(chat)}
                        className="min-w-0 flex-1 rounded-md px-1 py-2.5 text-start transition-colors hover:bg-zinc-950/[0.04] active:bg-zinc-950/[0.06] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300/50"
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="min-w-0 flex-1 line-clamp-1 text-[13px] font-medium leading-tight tracking-tight text-zinc-900">
                            {listTitle}
                          </span>
                          <span className="shrink-0 text-[10px] tabular-nums leading-none text-zinc-400">
                            {formatRelativeTimeShort(chat.updatedAt, locale)}
                          </span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDeleteSavedChat?.(chat.id);
                        }}
                        className="flex h-8 w-7 shrink-0 items-center justify-center rounded text-zinc-400 opacity-100 transition hover:text-red-600 md:opacity-0 md:group-hover:opacity-100"
                        aria-label={sc.deleteHistoryItem}
                        title={sc.deleteHistoryItem}
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}

      <div className={cn("mt-auto shrink-0 px-0.5", variant === "chat" ? "pt-4" : "pt-1")}>
        <button
          type="button"
          onClick={() => setPage("settings")}
          className={cn(
            "group flex w-full items-center gap-2.5 rounded-full border border-[var(--spark-chat-border)] bg-[var(--spark-chat-surface)] py-2 ps-2 pe-2 text-start shadow-[var(--spark-shadow-sm)] transition hover:border-[var(--spark-chat-border-hover)] hover:bg-zinc-50/90 hover:shadow-[var(--spark-shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--spark-chat-ring-focus)]",
            page === "settings" && "border-zinc-300 ring-1 ring-zinc-900/5"
          )}
          aria-label={t.nav.settings}
        >
          {isRTL ? (
            <>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-sm font-semibold text-white shadow-sm">
                {studentNameShort}
              </div>
              <div className="min-w-0 flex-1 pe-1">
                <div className="truncate text-end text-sm font-semibold text-zinc-950">{studentName}</div>
                <div className="truncate text-end text-[11px] text-zinc-500">{t.profile.school}</div>
              </div>
              <span
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm transition group-hover:bg-zinc-50"
                aria-hidden
              >
                <Settings className="h-4 w-4" strokeWidth={2} />
              </span>
            </>
          ) : (
            <>
              <span
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm transition group-hover:bg-zinc-50"
                aria-hidden
              >
                <Settings className="h-4 w-4" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1 px-0.5 text-center">
                <div className="truncate text-sm font-semibold text-zinc-950">{studentName}</div>
                <div className="truncate text-[11px] text-zinc-500">{t.profile.school}</div>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-sm font-semibold text-white shadow-sm">
                {studentNameShort}
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex h-[100dvh] max-h-[100dvh] w-[280px] flex-col overflow-hidden shadow-[4px_0_40px_rgba(15,23,42,0.07)] transition-transform duration-300 ease-out will-change-transform",
          variant === "chat" ? "spark-chat-sidebar-bg border-e border-[var(--spark-chat-border)]" : "bg-[#fcfcfc]",
          open ? "translate-x-0" : isRTL ? "translate-x-full max-lg:translate-x-full" : "-translate-x-full max-lg:-translate-x-full",
          collapsed ? (isRTL ? "lg:translate-x-full" : "lg:-translate-x-full") : "lg:translate-x-0"
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-4 lg:hidden">
            <div className="text-sm font-semibold text-zinc-900">{t.nav.navigation}</div>
            <IconButton onClick={onClose} aria-label="Close sidebar">
              <X className="h-4 w-4" />
            </IconButton>
          </div>
          <div
            className={cn(
              "min-h-0 flex-1",
              variant === "chat"
                ? "flex flex-col overflow-hidden"
                : "overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            )}
          >
            {content}
          </div>
        </div>
      </aside>
    </>
  );
}
