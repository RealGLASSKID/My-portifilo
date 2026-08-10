"use client";

import { PageHero } from "@/components/PageHero";
import { Github, ExternalLink, Search } from "lucide-react";
import { useState } from "react";

const CATS = ["All", "Web Apps", "Mobile Apps", "E-Commerce", "SaaS", "Music", "UI/UX", "Open Source"] as const;

const PROJECTS = [
  { name: "Nexora", cat: "SaaS", featured: true, desc: "Modern SaaS platform for managing projects, teams and analytics in one place.", stack: ["Next.js", "TypeScript", "Tailwind", "PostgreSQL"] },
  { name: "Grocify", cat: "E-Commerce", featured: true, desc: "E-commerce platform for fresh groceries with real-time inventory and delivery.", stack: ["React", "Node.js", "MongoDB", "Express"] },
  { name: "Echoes", cat: "Music", featured: true, desc: "Music streaming platform for emerging artists and music lovers.", stack: ["Next.js", "Firebase", "Tailwind", "Howler.js"] },
  { name: "StudyFlow", cat: "Web Apps", featured: false, desc: "Student productivity and collaboration tool with task management and file sharing.", stack: ["React", "TypeScript", "Firebase"] },
  { name: "Devfolio Template", cat: "UI/UX", featured: false, desc: "A modern, customizable portfolio template for developers.", stack: ["Next.js", "Tailwind", "MDX"] },
  { name: "FinTrack", cat: "Web Apps", featured: false, desc: "Personal finance tracker to manage income, expenses and savings.", stack: ["React", "Chart.js", "Node.js"] },
];

export default function ProjectsPage() {
  const [active, setActive] = useState<(typeof CATS)[number]>("All");
  const [q, setQ] = useState("");
  const filtered = PROJECTS.filter(
    (p) => (active === "All" || p.cat === active) && p.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <PageHero
        eyebrow="My Work"
        title="Projects that solve problems and create"
        accent="impact."
        description="A collection of web applications, platforms and experiments I've built with passion, creativity and attention to detail."
      />

      <section className="mx-auto max-w-6xl px-6">
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
      </section>

      <section className="mx-auto mt-8 max-w-6xl px-6 pb-28">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <article key={p.name} className="glass-card overflow-hidden p-5">
              <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl border border-white/5">
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(135deg, oklch(0.35 0.18 295 / 0.7), oklch(0.18 0.05 285))" }}
                />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-2xl font-bold tracking-tight text-white/90">{p.name.toUpperCase()}</div>
                </div>
                {p.featured && <div className="chip absolute right-3 top-3 !text-[10px]">Featured</div>}
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex gap-3 border-t border-white/5 pt-4 text-sm">
                <a href="#" className="inline-flex items-center gap-1 text-primary hover:underline">
                  <ExternalLink className="size-4" /> Live Demo
                </a>
                <a href="#" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                  <Github className="size-4" /> GitHub
                </a>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="glass-card mt-6 p-10 text-center text-muted-foreground">No projects match your search.</div>
        )}
      </section>
    </>
  );
}