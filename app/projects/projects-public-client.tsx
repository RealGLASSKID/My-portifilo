"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, ExternalLink, Search, ChevronLeft, ChevronRight } from "lucide-react";
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
              {/* Image / carousel — click goes to detail */}
              <Link href={`/projects/${p.slug}`} className="block">
                <ProjectCarousel
                  name={p.name}
                  cover={p.imageUrl}
                  gallery={p.gallery || []}
                  featured={p.featured}
                />
              </Link>

              <Link href={`/projects/${p.slug}`} className="mt-5 block">
                <h3 className="text-lg font-semibold transition hover:text-primary">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
              </Link>

              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags?.slice(0, 4).map((s) => (
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

function ProjectCarousel({
  name,
  cover,
  gallery,
  featured,
}: {
  name: string;
  cover?: string;
  gallery: string[];
  featured?: boolean;
}) {
  const images = [cover, ...gallery].filter(Boolean) as string[];
  const [i, setI] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setI((v) => (v + 1) % images.length), 4000);
    return () => clearInterval(t);
  }, [images.length]);

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setI((v) => (v - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setI((v) => (v + 1) % images.length);
  };

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/5 bg-white/5">
      {images.length > 0 ? (
        <Image
          src={images[i]}
          alt={name}
          fill
          className="object-cover transition duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      ) : (
        <div
          className="absolute inset-0 grid place-items-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.35 0.18 295 / 0.7), oklch(0.18 0.05 285))",
          }}
        >
          <span className="text-xl font-bold tracking-tight text-white/90">
            {name.toUpperCase()}
          </span>
        </div>
      )}

      {featured && (
        <div className="chip absolute right-3 top-3 z-10 !text-[10px]">Featured</div>
      )}

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight className="size-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`size-1.5 rounded-full ${idx === i ? "bg-primary" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}