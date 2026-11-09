"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectImageCarousel } from "@/components/ProjectImageCarousel";

export type FeaturedProject = {
  slug: string;
  tag: string;
  name: string;
  desc: string;
  stack: string[];
  images: string[];
};

export function FeaturedProjectsGrid({ projects }: { projects: FeaturedProject[] }) {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <Link
          key={p.slug}
          href={`/projects/${p.slug}`}
          className="glass-card group block overflow-hidden p-5 transition hover:border-primary/30 sm:p-6"
        >
          <ProjectImageCarousel
            name={p.name}
            images={p.images}
            featured
            aspect="aspect-[16/9]"
            autoPlayMs={3000}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="mb-5"
          />
          <div className="text-xs uppercase tracking-widest text-primary/80">{p.tag}</div>
          <h3 className="mt-1 text-lg font-semibold transition group-hover:text-primary">{p.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.desc}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <span
                key={s}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
            Case study <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5" />
          </div>
        </Link>
      ))}
    </div>
  );
}
