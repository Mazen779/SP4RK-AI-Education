import React from "react";
import { Bell, PanelLeft } from "lucide-react";
import { useLocale } from "../../lib/locale.jsx";
import { cn } from "../../lib/cn";
import { IconButton } from "../ui/IconButton";

const PLATFORM_LOGO_SRC = "/logo-sp4rk-removebg-preview.png";

export function TopBar({ title, onToggleSidebar, sidebarCollapsed = false, variant = "default" }) {
  const { locale, setLocale, dir } = useLocale();
  const isRTL = dir === "rtl";

  return (
    <div
      className={cn(
        "sticky top-0 z-20 border-b backdrop-blur-xl",
        variant === "chat"
          ? "border-[var(--spark-chat-border)] bg-[color-mix(in_srgb,var(--spark-chat-surface)_94%,transparent)] shadow-[var(--spark-shadow-xs)]"
          : "border-zinc-200/80 bg-white/80"
      )}
    >
      <div className={cn("relative flex items-center gap-3 px-4 md:px-6", variant === "chat" ? "py-3.5" : "py-3")}>
        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
          <img
            src={PLATFORM_LOGO_SRC}
            alt="SP4RK"
            className="h-12 w-auto object-contain opacity-95 md:h-14"
          />
        </div>
        <IconButton onClick={onToggleSidebar} className="lg:hidden" aria-label="Open sidebar">
          <PanelLeft className="h-4 w-4" />
        </IconButton>
        <div className="min-w-0 flex-1">
          <div className="inline-flex max-w-full items-center gap-2">
            <IconButton
              variant="secondary"
              aria-label="Toggle sidebar"
              onClick={onToggleSidebar}
              className="hidden lg:inline-flex"
            >
              <PanelLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
            </IconButton>
            <h1
              className={cn(
                "truncate font-semibold",
                variant === "chat" ? "text-sm text-zinc-600 md:text-[15px]" : "text-zinc-900 md:text-base"
              )}
            >
              {title}
            </h1>
          </div>
        </div>
        <div
          className={cn(
            "flex shrink-0 items-center gap-0.5 rounded-full border border-zinc-200/90 bg-zinc-50/90 p-0.5 shadow-sm",
            isRTL && "flex-row-reverse"
          )}
          role="group"
          aria-label="Language"
        >
          {(["ar", "en"]).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition",
                locale === code ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
              )}
            >
              {code}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <IconButton variant="secondary" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
