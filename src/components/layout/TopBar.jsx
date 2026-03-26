import React from "react";
import { Bell, Command, PanelLeft, Search, SunMoon } from "lucide-react";
import { IconButton } from "../ui/IconButton";

export function TopBar({ title, onToggleSidebar }) {
  return (
    <div className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3 md:px-6">
        <IconButton onClick={onToggleSidebar} className="lg:hidden" aria-label="Open sidebar">
          <PanelLeft className="h-4 w-4" />
        </IconButton>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold text-zinc-900 md:text-base">{title}</h1>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <IconButton variant="secondary" aria-label="Search">
            <Search className="h-4 w-4" />
          </IconButton>
          <IconButton variant="secondary" aria-label="Command palette">
            <Command className="h-4 w-4" />
          </IconButton>
          <IconButton variant="secondary" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </IconButton>
          <IconButton variant="secondary" aria-label="Theme">
            <SunMoon className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

