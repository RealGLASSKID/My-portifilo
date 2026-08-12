"use client";

import { useMemo, useState } from "react";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { Search, Plus, Play, Pencil, Trash2 } from "lucide-react";

type Release = { title: string; type: "Single" | "EP" | "Album"; year: string; streams: string; tag?: "NEW" };

const INITIAL: Release[] = [
  { title: "Adopted", type: "Single", year: "2024", streams: "18.2K", tag: "NEW" },
  { title: "Lagos Nights", type: "EP", year: "2024", streams: "42.7K" },
  { title: "Survive", type: "Single", year: "2023", streams: "9.4K" },
  { title: "Freezing", type: "EP", year: "2023", streams: "31.1K" },
];

export default function AdminMusicPage() {
  const [releases, setReleases] = useState<Release[]>(INITIAL);
  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");

  const filtered = useMemo(() => releases.filter((r) => r.title.toLowerCase().includes(q.toLowerCase())), [releases, q]);

  const addRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setReleases((prev) => [{ title: title.trim(), type: "Single", year: String(new Date().getFullYear()), streams: "0", tag: "NEW" }, ...prev]);
    setTitle("");
    setFormOpen(false);
  };

  const remove = (t: string) => setReleases((prev) => prev.filter((r) => r.title !== t));

  return (
    <>
      <AdminPageHeader eyebrow="Collection" title="Music" description={`${releases.length} releases across singles, EPs and albums.`}>
        <button onClick={() => setFormOpen((v) => !v)} className="btn-glow inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold">
          <Plus className="size-4" /> New Release
        </button>
      </AdminPageHeader>

      {formOpen && (
        <form onSubmit={addRelease} className="glass-card mb-6 flex flex-col gap-3 p-5 sm:flex-row">
          <input
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Track or release title"
            className="flex-1 rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button type="submit" className="btn-glow rounded-xl px-4 py-2 text-sm font-semibold">
            Add
          </button>
        </form>
      )}

      <div className="glass-card flex items-center gap-2 rounded-xl p-2 px-3">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search releases…"
          className="w-full bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-6 grid gap-3">
        {filtered.map((r) => (
          <div key={r.title} className="glass-card flex items-center gap-4 p-4">
            <button className="btn-glow grid size-11 shrink-0 place-items-center rounded-full">
              <Play className="size-4" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-semibold">{r.title}</span>
                {r.tag && <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{r.tag}</span>}
              </div>
              <div className="text-xs text-muted-foreground">
                {r.type} · {r.year} · {r.streams} streams
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button className="grid size-9 place-items-center rounded-lg border border-white/10 text-muted-foreground transition hover:border-primary/40 hover:text-primary">
                <Pencil className="size-4" />
              </button>
              <button
                onClick={() => remove(r.title)}
                className="grid size-9 place-items-center rounded-lg border border-white/10 text-muted-foreground transition hover:border-destructive/50 hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="glass-card p-10 text-center text-sm text-muted-foreground">No releases match &quot;{q}&quot;.</div>}
      </div>
    </>
  );
}
