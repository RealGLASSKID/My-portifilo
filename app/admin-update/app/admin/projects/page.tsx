"use client";

import { useMemo, useState } from "react";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { Search, Plus, Pencil, Trash2, Star, X } from "lucide-react";

type Project = {
  name: string;
  cat: string;
  featured: boolean;
  desc: string;
  stack: string[];
};

const CATS = ["All", "Web Apps", "Mobile Apps", "E-Commerce", "SaaS", "Music", "UI/UX", "Open Source"] as const;

const INITIAL: Project[] = [
  { name: "Nexora", cat: "SaaS", featured: true, desc: "Modern SaaS platform for managing projects, teams and analytics in one place.", stack: ["Next.js", "TypeScript", "Tailwind", "PostgreSQL"] },
  { name: "Grocify", cat: "E-Commerce", featured: true, desc: "E-commerce platform for fresh groceries with real-time inventory and delivery.", stack: ["React", "Node.js", "MongoDB", "Express"] },
  { name: "Echoes", cat: "Music", featured: true, desc: "Music streaming platform for emerging artists and music lovers.", stack: ["Next.js", "Firebase", "Tailwind", "Howler.js"] },
  { name: "StudyFlow", cat: "Web Apps", featured: false, desc: "Student productivity and collaboration tool with task management and file sharing.", stack: ["React", "TypeScript", "Firebase"] },
  { name: "Devfolio Template", cat: "UI/UX", featured: false, desc: "A modern, customizable portfolio template for developers.", stack: ["Next.js", "Tailwind", "MDX"] },
  { name: "FinTrack", cat: "Web Apps", featured: false, desc: "Personal finance tracker to manage income, expenses and savings.", stack: ["React", "Chart.js", "Node.js"] },
];

const EMPTY_FORM = { name: "", cat: "Web Apps", desc: "", stack: "" };

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL);
  const [active, setActive] = useState<(typeof CATS)[number]>("All");
  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) => (active === "All" || p.cat === active) && p.name.toLowerCase().includes(q.toLowerCase())
      ),
    [projects, active, q]
  );

  const addProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setProjects((prev) => [
      {
        name: form.name.trim(),
        cat: form.cat,
        featured: false,
        desc: form.desc.trim() || "No description yet.",
        stack: form.stack.split(",").map((s) => s.trim()).filter(Boolean),
      },
      ...prev,
    ]);
    setForm(EMPTY_FORM);
    setFormOpen(false);
  };

  const removeProject = (name: string) => setProjects((prev) => prev.filter((p) => p.name !== name));

  const toggleFeatured = (name: string) =>
    setProjects((prev) => prev.map((p) => (p.name === name ? { ...p, featured: !p.featured } : p)));

  return (
    <>
      <AdminPageHeader
        eyebrow="Collection"
        title="Projects"
        description={`${projects.length} projects · showing ${filtered.length}. Changes here live for this session only.`}
      >
        <button
          onClick={() => setFormOpen((v) => !v)}
          className="btn-glow inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
        >
          {formOpen ? <X className="size-4" /> : <Plus className="size-4" />} {formOpen ? "Cancel" : "New Project"}
        </button>
      </AdminPageHeader>

      {formOpen && (
        <form onSubmit={addProject} className="glass-card mb-6 grid gap-3 p-5 sm:grid-cols-2">
          <input
            required
            placeholder="Project name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground sm:col-span-1"
          />
          <select
            value={form.cat}
            onChange={(e) => setForm({ ...form, cat: e.target.value })}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none sm:col-span-1"
          >
            {CATS.filter((c) => c !== "All").map((c) => (
              <option key={c} value={c} className="bg-background">
                {c}
              </option>
            ))}
          </select>
          <input
            placeholder="Short description"
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground sm:col-span-2"
          />
          <input
            placeholder="Tech stack, comma separated"
            value={form.stack}
            onChange={(e) => setForm({ ...form, stack: e.target.value })}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground sm:col-span-2"
          />
          <button type="submit" className="btn-glow rounded-xl px-4 py-2 text-sm font-semibold sm:col-span-2 sm:justify-self-start">
            Add Project
          </button>
        </form>
      )}

      <div className="glass-card flex flex-col gap-4 p-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                active === c ? "btn-glow" : "btn-ghost-glass"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {filtered.map((p) => (
          <div key={p.name} className="glass-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{p.name}</h3>
                {p.featured && (
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    Featured
                  </span>
                )}
                <span className="rounded-md border border-white/10 px-2 py-0.5 text-[11px] text-muted-foreground">{p.cat}</span>
              </div>
              <p className="mt-1 truncate text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => toggleFeatured(p.name)}
                title={p.featured ? "Unfeature" : "Feature"}
                className={`grid size-9 place-items-center rounded-lg border transition ${
                  p.featured ? "border-primary/40 text-primary" : "border-white/10 text-muted-foreground hover:text-primary"
                }`}
              >
                <Star className="size-4" fill={p.featured ? "currentColor" : "none"} />
              </button>
              <button className="grid size-9 place-items-center rounded-lg border border-white/10 text-muted-foreground transition hover:border-primary/40 hover:text-primary">
                <Pencil className="size-4" />
              </button>
              <button
                onClick={() => removeProject(p.name)}
                className="grid size-9 place-items-center rounded-lg border border-white/10 text-muted-foreground transition hover:border-destructive/50 hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="glass-card p-10 text-center text-sm text-muted-foreground">No projects match your filters.</div>
        )}
      </div>
    </>
  );
}
