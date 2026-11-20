"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Github, ExternalLink, Search, ArrowUpRight } from "lucide-react";
import type { Project } from "@/app/admin/projects/actions";
import { BrowserMockupSlideshow } from "@/components/BrowserMockupSlideshow";

const CATS = ["All", "Web Apps", "Mobile Apps", "E-Commerce", "SaaS", "Music", "UI/UX", "Open Source"] as const;

export function ProjectsPublicClient({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string>("All");
  const [q, setQ] = useState("");

  const categories = useMemo(() => {
    const fromData = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));
    const base = CATS.filter((c) => c === "All" || fromData.includes(c));
    const extras = fromData.filter((c) => !CATS.includes(c as (typeof CATS)[number]));
    return ["All", ...base.filter((c) => c !== "All"), ...extras] as string[];
  }, [projects]);

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (active === "All" || p.category === active) &&
          (p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.description?.toLowerCase().includes(q.toLowerCase()) ||
            p.tags?.some((t) => t.toLowerCase().includes(q.toLowerCase())))
      ),
    [projects, active, q]
  );

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
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
            {categories.map((c) => (
              <button
                key={c}
                type="button"
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

      <section className="mx-auto mt-8 max-w-6xl space-y-10 px-4 pb-28 sm:px-6">
        {filtered.map((p, index) => {
          const images = [p.imageUrl, ...(p.gallery || [])].filter(Boolean) as string[];
          return (
            <article key={p.id} className="glass-card overflow-hidden p-4 sm:p-6 lg:p-8">
              <div
                className={`grid items-center gap-8 lg:grid-cols-2 ${
                  index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <BrowserMockupSlideshow
                  images={images}
                  alt={p.name}
                  autoPlayMs={3000}
                  enableLightbox
                  urlLabel={
                    p.liveUrl ? p.liveUrl.replace(/^https?:\/\//, "") : p.slug
                  }
                />

                <div className="flex flex-col justify-center px-1 sm:px-2">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    {p.featured && (
                      <span className="rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                        Featured
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">{p.category}</span>
                    <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                      {p.status || "Live"}
                    </span>
                  </div>

                  <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">{p.name}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {p.description || "No description yet."}
                  </p>

                  {p.tags?.length ? (
                    <div className="mt-6">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Technology
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {p.tags.slice(0, 6).map((s) => (
                          <span
                            key={s}
                            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                        {p.tags.length > 6 && (
                          <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
                            +{p.tags.length - 6}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                    >
                      Explore case study <ArrowUpRight className="size-4" />
                    </Link>
                    {p.liveUrl ? (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
                      >
                        Visit website <ExternalLink className="size-3.5" />
                      </a>
                    ) : null}
                    {p.githubUrl ? (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
                      >
                        <Github className="size-3.5" /> GitHub
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          );
        })}

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
