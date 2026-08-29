"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, ExternalLink, Search, ArrowUpRight } from "lucide-react";
import type { Project } from "@/app/admin/projects/actions";

const CATS = ["All", "Web Apps", "Mobile Apps", "E-Commerce", "SaaS", "Music", "UI/UX", "Open Source"] as const;

export function ProjectsPublicClient({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<(typeof CATS)[number]>("All");
  const [q, setQ] = useState("");

  // Build category chips from real data + defaults so filters always match stored categories
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
                onClick={() => setActive(c as (typeof CATS)[number])}
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

      <section className="mx-auto mt-8 max-w-6xl px-4 pb-28 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <article key={p.id} className="glass-card group flex flex-col overflow-hidden p-5">
              <Link href={`/projects/${p.slug}`} className="relative mb-5 block aspect-[16/10] overflow-hidden rounded-xl border border-white/5 bg-white/5">
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(70, 13, 139, 0.7), rgb(16, 13, 38))",
                    }}
                  />
                )}
                {p.featured && (
                  <div className="chip absolute right-3 top-3 !text-[10px]">Featured</div>
                )}
              </Link>

              <div className="flex flex-1 flex-col">
                <Link href={`/projects/${p.slug}`} className="block">
                  <h3 className="text-lg font-semibold transition group-hover:text-primary">{p.name}</h3>
                  <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{p.description}</p>
                </Link>

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

                <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-white/5 pt-4 text-sm">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                  >
                    Case study <ArrowUpRight className="size-4" />
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
              </div>
            </article>
          ))}
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
