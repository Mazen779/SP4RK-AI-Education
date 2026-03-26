import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Plus, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";

function SidebarItem({ icon: Icon, label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-right transition-colors",
        active ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-sm font-medium">{label}</span>
      {badge ? (
        <span className={cn("rounded-full px-2 py-0.5 text-[10px]", active ? "bg-white/15 text-white" : "bg-zinc-200 text-zinc-700")}>
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function SubjectPill({ subject, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-right transition-colors",
        selected ? "border-zinc-900 bg-zinc-950 text-white" : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
      )}
    >
      <span className={cn("h-2.5 w-2.5 rounded-full", selected ? "bg-white" : subject.accent.solid)} />
      <span className={cn("flex-1 text-sm font-medium", selected ? "text-white" : "text-zinc-800")}>{subject.name}</span>
      <ChevronRight className={cn("h-4 w-4", selected ? "text-white/70" : "text-zinc-400")} />
    </button>
  );
}

export function Sidebar({
  open,
  onClose,
  navItems,
  page,
  setPage,
  subjects,
  recentChats,
  selectedSubject,
  setSelectedSubject,
  setSelectedLesson,
  lessonsBySubject,
}) {
  const content = (
    <div className="flex h-full flex-col bg-[#fcfcfc] px-3 py-4">
      <Button className="mb-4 rounded-2xl py-3 text-sm font-semibold" onClick={() => setPage("chat")}>
        <Plus className="h-4 w-4" />
        محادثة جديدة
      </Button>

      <div className="space-y-1">
        {navItems.map((item) => (
          <SidebarItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            active={page === item.key || (page === "home" && item.key === "home")}
            onClick={() => setPage(item.route)}
          />
        ))}
      </div>

      <div className="mt-6">
        <div className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">المواد</div>
        <div className="space-y-2">
          {subjects.map((subject) => (
            <SubjectPill
              key={subject.id}
              subject={subject}
              selected={selectedSubject === subject.id && page === "subject"}
              onClick={() => {
                setSelectedSubject(subject.id);
                setSelectedLesson((lessonsBySubject[subject.id] || [])[0]?.id);
                setPage("subject");
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex-1 overflow-hidden">
        <div className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">المحادثات الأخيرة</div>
        <div className="space-y-2 overflow-auto">
          {recentChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setPage("chat")}
              className="w-full rounded-2xl border border-zinc-200 bg-white p-3 text-right transition-colors hover:bg-zinc-50"
            >
              <div className="mb-1 line-clamp-1 text-sm font-medium text-zinc-900">{chat.title}</div>
              <div className="text-[11px] text-zinc-500">
                {chat.type} · {chat.time}
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setPage("settings")}
        className="mt-4 rounded-[24px] border border-zinc-200 bg-white p-3 text-right shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors hover:bg-zinc-50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-sm font-semibold text-white">AH</div>
          <div className="flex-1">
            <div className="text-sm font-medium text-zinc-900">عبد الهادي</div>
            <div className="text-[11px] text-zinc-500">مدرسة الإبداع · الصف التاسع</div>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-400" />
        </div>
      </button>
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

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : 24, opacity: open ? 1 : 0 }}
        className="fixed inset-y-0 right-0 z-50 w-[300px] border-l border-zinc-200 bg-[#fcfcfc] lg:static lg:z-auto lg:block lg:w-[300px] lg:translate-x-0 lg:opacity-100"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4 lg:hidden">
            <div className="text-sm font-semibold text-zinc-900">التنقل</div>
            <IconButton onClick={onClose} aria-label="Close sidebar">
              <X className="h-4 w-4" />
            </IconButton>
          </div>
          {content}
        </div>
      </motion.aside>
    </>
  );
}

