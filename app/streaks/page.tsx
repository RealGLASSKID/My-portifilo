import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Streaks — THEREALGLASSKID",
  description: "Habits I'm tracking publicly. Every day counts.",
  openGraph: {
    title: "My Streaks — THEREALGLASSKID",
    description: "Public accountability for the habits that matter.",
    type: "website",
  },
  alternates: { canonical: "/streaks" },
};

type Status = "active" | "starting" | "broken";
type Streak = {
  emoji: string;
  title: string;
  desc: string;
  current: number;
  best: number;
  total: number;
  status: Status;
  last?: string;
};

const STREAKS: Streak[] = [
  {
    emoji: "💻",
    title: "Ship every day",
    desc: "Commit code that moves a project forward. No zero days.",
    current: 12,
    best: 34,
    total: 128,
    status: "active",
  },
  {
    emoji: "🎧",
    title: "Make music",
    desc: "Open the DAW. 20 minutes minimum. Ideas over polish.",
    current: 6,
    best: 21,
    total: 74,
    status: "active",
  },
  {
    emoji: "🏃",
    title: "Morning run",
    desc: "3km before the sun gets serious.",
    current: 0,
    best: 9,
    total: 9,
    status: "starting",
  },
  {
    emoji: "🐬",
    title: "Calisthenics",
    desc: "Just train. Feel the touch of pain too 😹",
    current: 0,
    best: 0,
    total: 0,
    status: "starting",
  },
  {
    emoji: "🚫🥤",
    title: "No Soda",
    desc: "Cutting out soda completely. Water only.",
    current: 0,
    best: 16,
    total: 16,
    status: "broken",
    last: "17 May",
  },
  {
    emoji: "🎬",
    title: "Content",
    desc: "Create and post content consistently.",
    current: 0,
    best: 1,
    total: 1,
    status: "broken",
    last: "2 May",
  },
];

const STATUS_META: Record<Status, { label: string; badge: string; heading: string }> = {
  active: { label: "🔥 Active", badge: "bg-primary/20 text-primary border-primary/40", heading: "🔥 Active" },
  starting: { label: "🌱 Starting", badge: "bg-white/5 text-muted-foreground border-white/10", heading: "🌱 Starting" },
  broken: { label: "💔 Broken", badge: "bg-red-500/10 text-red-300 border-red-500/30", heading: "💔 Broken" },
};

const totals = {
  active: STREAKS.filter((s) => s.status === "active").length,
  totalDays: STREAKS.reduce((n, s) => n + s.total, 0),
  streaks: STREAKS.length,
};

export default function StreaksPage() {
  const order: Status[] = ["active", "starting", "broken"];

  return (
    <>
      <PageHero
        eyebrow="Streaks"
        title="My"
        accent="Streaks."
        description="Habits I'm tracking publicly. Every day counts. Updated manually — consistency is the goal."
      />

      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { k: totals.active, v: "Active" },
            { k: totals.totalDays, v: "Total Days" },
            { k: totals.streaks, v: "Streaks" },
          ].map((s) => (
            <div key={s.v} className="glass-card p-5">
              <div className="text-gradient text-3xl font-bold">{s.k}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-6xl space-y-10 px-6 pb-24">
        {order.map((status) => {
          const items = STREAKS.filter((s) => s.status === status);
          if (!items.length) return null;
          const meta = STATUS_META[status];
          return (
            <div key={status}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold md:text-2xl">{meta.heading}</h2>
                <span className="chip">{items.length}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((s) => (
                  <div key={s.title} className="glass-card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-2xl">{s.emoji}</div>
                      <span className={`rounded-md border px-2 py-0.5 text-[11px] uppercase tracking-widest ${meta.badge}`}>
                        {meta.label}
                      </span>
                    </div>
                    <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>

                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                      {[
                        { k: s.current, v: "Current" },
                        { k: s.best, v: "Best" },
                        { k: s.total, v: "Total" },
                      ].map((m) => (
                        <div key={m.v} className="text-center">
                          <div className="text-xl font-bold text-foreground">{m.k}</div>
                          <div className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">{m.v}</div>
                        </div>
                      ))}
                    </div>
                    {s.last && (
                      <div className="mt-3 text-[11px] uppercase tracking-widest text-muted-foreground">Last: {s.last}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <p className="pt-4 text-center text-xs uppercase tracking-widest text-muted-foreground">
          Updated manually · consistency is the goal
        </p>
      </section>
    </>
  );
}