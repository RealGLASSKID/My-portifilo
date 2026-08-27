"use client";

import { Menu, Search, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AdminTopbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  return (
    <header className="glass sticky top-0 z-30 flex items-center gap-3 rounded-none border-x-0 border-t-0 px-4 py-3 md:px-6">
      <button
        onClick={onOpenMobile}
        aria-label="Open menu"
        className="btn-ghost-glass grid size-10 shrink-0 place-items-center rounded-xl lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/5 px-3 py-2 md:max-w-sm">
        <Search className="size-4 text-muted-foreground" />
        <input
          placeholder="Search admin…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button aria-label="Notifications" className="btn-ghost-glass relative grid size-10 place-items-center rounded-xl">
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--neon)]" />
        </button>
        <ThemeToggle />
        <div className="flex items-center gap-2 rounded-xl bg-white/5 py-1.5 pl-1.5 pr-3">
          <div className="grid size-7 place-items-center rounded-lg bg-primary/20 text-xs font-bold text-primary">
            G
          </div>
          <span className="hidden text-sm font-medium sm:inline">GLASSKID</span>
        </div>
      </div>
    </header>
  );
}
