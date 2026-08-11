"use client";

import { useState } from "react";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { Plus, RotateCcw } from "lucide-react";

type Status = "active" | "starting" | "broken";
type Streak = { emoji: string; title: string; desc: string; current: number; best: number; total: number; status: Status };

const INITIAL: Streak[] = [
  { emoji: "💻", title: "Ship every day", desc: "Commit code that moves a project forward. No zero days.", current: 12, best: 34, total: 128, status: "active" },
  { emoji: "🎧", title: "Make music", desc: "Open the DAW. 20 minutes minimum. Ideas over polish.", current: 6, best: 21, total: 74, status: "active" },
  { emoji: "🏃", title: "Morning run", desc: "3km before the sun gets serious.", current: 0, best: 9, total: 9, status: "starting" },
  { emoji: "🐬", title: "Calisthenics", desc: "Just train. Feel the touch of pain too 😹", current: 0, best: 0, total: 0, status: "starting" },
];

const STATUS_STYLE: Record<Status, string> = {
  active: "bg-primary/10 text-primary",
  starting: "bg-white/5 text-muted-foreground",
  broken: "bg-destructive/10 text-destructive",
};

export default function AdminStreaksPage() {
  const [streaks, setStreaks] = useState<Streak[]>(INITIAL);

  const logToday = (title: string) =>
    setStreaks((prev) =>
      prev.map((s) =>
        s.title === title
          ? { ...s, current: s.current + 1, total: s.total + 1, best: Math.max(s.best, s.current + 1), status: "active" }
          : s
      )
    );

  const resetStreak = (title: string) =>
    setStreaks((prev) => prev.map((s) => (s.title === title ? { ...s, current: 0, status: "broken" } : s)));

  return (
    <>
      <AdminPageHeader eyebrow="Collection" title="Streaks" description="Log today's progress or reset a broken streak. Changes are session-only." />

      <div className="grid gap-4 sm:grid-cols-2">
        {streaks.map((s) => (
          <div key={s.title} className="glass-card p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-white/5 text-xl">{s.emoji}</span>
                <div>
                  <div className="font-semibold">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLE[s.status]}`}>
                {s.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-white/5 py-2">
                <div className="text-lg font-bold">{s.current}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Current</div>
              </div>
              <div className="rounded-lg bg-white/5 py-2">
                <div className="text-lg font-bold">{s.best}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Best</div>
              </div>
              <div className="rounded-lg bg-white/5 py-2">
                <div className="text-lg font-bold">{s.total}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Total</div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => logToday(s.title)}
                className="btn-glow flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
              >
                <Plus className="size-4" /> Log today
              </button>
              <button
                onClick={() => resetStreak(s.title)}
                title="Reset streak"
                className="btn-ghost-glass grid size-10 shrink-0 place-items-center rounded-xl"
              >
                <RotateCcw className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
