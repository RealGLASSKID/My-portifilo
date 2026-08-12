"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Github, ExternalLink, Search } from "lucide-react";
import type { Project } from "@/app/admin/projects/actions";

const CATS = ["All", "Web Apps", "Mobile Apps", "E-Commerce", "SaaS", "Music", "UI/UX", "Open Source"] as const;

export function ProjectsPublicClient({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<(typeof CATS)[number]>("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (active === "All" || p.category === active) &&
          p.name.toLowerCase().includes(q.toLowerCase())
      ),
    [projects, active, q]
  );

  return (
    <>
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
            <article key={p.id} className="glass-card overflow-hidden p-5">
              <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl border border-white/5 bg-white/5">
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.35 0.18 295 / 0.7), oklch(0.18 0.05 285))",
                    }}
                  />
                )}
                {p.featured && (
                  <div className="chip absolute right-3 top-3 !text-[10px]">Featured</div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags?.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex gap-3 border-t border-white/5 pt-4 text-sm">
                {p.liveUrl ? (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <ExternalLink className="size-4" /> Live Demo
                  </a>
                ) : null}
                {p.githubUrl ? (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <Github className="size-4" /> GitHub
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="glass-card mt-6 p-10 text-center text-muted-foreground">
            {projects.length === 0
              ? "No projects yet."
              : "No projects match your search."}
          </div>
        )}
      </section>
    </>
  );
}