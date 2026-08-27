"use client";

import { useMemo, useState } from "react";
import { AdminPageHeader } from "./_components/AdminPageHeader";
import { Search, Check } from "lucide-react";

type Item = { title: string; group: string; tag: string; year?: string; done: boolean };

const INITIAL: Item[] = [
  { title: "Launch a SaaS product", group: "Dream.", tag: "career", year: "2026", done: false },
  { title: "Get a remote job", group: "Dream.", tag: "career", year: "2025", done: true },
  { title: "First open-source contribution", group: "Dream.", tag: "career", year: "2025", done: true },
  { title: "International client in USD", group: "Dream.", tag: "career", year: "2025", done: true },
  { title: "Build my first real website", group: "Dream.", tag: "career", year: "2024", done: true },
  { title: "Ship in 20+ technologies", group: "Dream.", tag: "career", done: false },
  { title: "Write 10 technical deep-dives", group: "Dream.", tag: "content", done: false },
  { title: "Release a full-length album", group: "Create.", tag: "music", year: "2026", done: false },
  { title: "Perform live in Lagos", group: "Create.", tag: "music", done: false },
  { title: "100M streams on a single track", group: "Create.", tag: "music", done: false },
  { title: "Collab with an artist I admire", group: "Create.", tag: "music", done: false },
  { title: "Score a short film", group: "Create.", tag: "music", done: false },
  { title: "Travel to 10+ countries", group: "Live.", tag: "travel", done: false },
  { title: "Own my first car", group: "Live.", tag: "life", done: false },
  { title: "Buy my mum a house", group: "Live.", tag: "family", done: true },
  { title: "Learn a second language", group: "Live.", tag: "growth", done: false },
  { title: "Read 50 books", group: "Live.", tag: "growth", done: false },
];

export default function AdminBucketListPage() {
  const [items, setItems] = useState<Item[]>(INITIAL);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => items.filter((i) => i.title.toLowerCase().includes(q.toLowerCase())), [items, q]);
  const doneCount = items.filter((i) => i.done).length;
  const pct = Math.round((doneCount / items.length) * 100);

  const toggle = (title: string) =>
    setItems((prev) => prev.map((i) => (i.title === title ? { ...i, done: !i.done } : i)));

  return (
    <>
      <AdminPageHeader eyebrow="Collection" title="Bucket List" description={`${doneCount} of ${items.length} goals completed. Tap an item to toggle it.`} />

      <div className="glass-card p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold">Overall progress</span>
          <span className="text-muted-foreground">{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/5">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--gradient-brand)", boxShadow: "0 0 12px var(--neon)" }} />
        </div>
      </div>

      <div className="glass-card mt-4 flex items-center gap-2 rounded-xl p-2 px-3">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search goals…"
          className="w-full bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-6 grid gap-2">
        {filtered.map((i) => (
          <button
            key={i.title}
            onClick={() => toggle(i.title)}
            className="glass-card flex items-center gap-3 p-4 text-left transition hover:border-primary/40"
          >
            <span
              className={`grid size-6 shrink-0 place-items-center rounded-full border transition ${
                i.done ? "border-primary bg-primary text-white" : "border-white/20 text-transparent"
              }`}
            >
              <Check className="size-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className={`truncate text-sm font-medium ${i.done ? "text-muted-foreground line-through" : ""}`}>{i.title}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {i.group} · {i.tag}
                {i.year ? ` · ${i.year}` : ""}
              </div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && <div className="glass-card p-10 text-center text-sm text-muted-foreground">No goals match &quot;{q}&quot;.</div>}
      </div>
    </>
  );
}
