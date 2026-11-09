"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Github, ExternalLink, Search } from "lucide-react";
import type { Project } from "@/app/admin/projects/actions";
import { ProjectImageCarousel } from "@/components/ProjectImageCarousel";

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
            <Search className="size-4 shrink-0 text-muted-foreground" />
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
                type="button"
                onClick={() => setActive(c)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  active === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl px-6 pb-28">
        {/* Bigger cards for laptop screenshots — 2 cols on md+ */}
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((p) => {
            const images = [p.imageUrl, ...(p.gallery || [])].filter(Boolean) as string[];
            return (
              <article key={p.id} className="glass-card overflow-hidden p-5 sm:p-6">
                <Link href={`/projects/${p.slug}`} className="block">
                  <ProjectImageCarousel
                    name={p.name}
                    images={images}
                    featured={p.featured}
                    aspect="aspect-[16/9]"
                    autoPlayMs={3000}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </Link>

                <Link href={`/projects/${p.slug}`} className="mt-5 block">
                  <div className="text-xs uppercase tracking-widest text-primary/80">{p.category}</div>
                  <h3 className="mt-1 text-xl font-semibold transition hover:text-primary">{p.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.description}</p>
                </Link>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags?.slice(0, 5).map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3 border-t border-white/5 pt-4 text-sm">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    View case study
                  </Link>
                  {p.liveUrl ? (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="size-4" /> Live
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
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="glass-card mt-6 p-10 text-center text-muted-foreground">
            {projects.length === 0 ? "No projects yet." : "No projects match your search."}
          </div>
        )}
      </section>
    </>
  );
}
