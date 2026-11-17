"use client";

import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { BrowserMockupSlideshow } from "@/components/BrowserMockupSlideshow";

export type FeaturedProject = {
  slug: string;
  tag: string;
  name: string;
  desc: string;
  stack: string[];
  images: string[];
  liveUrl?: string;
};

export function FeaturedProjectsGrid({ projects }: { projects: FeaturedProject[] }) {
  if (!projects.length) return null;

  return (
    <div className="mt-10 space-y-10">
      {projects.map((p, index) => (
        <article
          key={p.slug}
          className="glass-card overflow-hidden p-4 sm:p-6 lg:p-8"
        >
          <div
            className={`grid items-center gap-8 lg:grid-cols-2 ${
              index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            {/* Left: browser mockup slideshow */}
            <BrowserMockupSlideshow
              images={p.images}
              alt={p.name}
              autoPlayMs={3000}
              urlLabel={p.liveUrl ? p.liveUrl.replace(/^https?:\/\//, "") : `${p.slug}.app`}
            />

            {/* Right: details */}
            <div className="flex flex-col justify-center px-1 sm:px-2">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Featured project
                </span>
                <span className="text-xs text-muted-foreground">{p.tag}</span>
              </div>

              <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">{p.name}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                {p.desc}
              </p>

              <div className="mt-6">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Technology
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.stack.slice(0, 6).map((s) => (
                    <span
                      key={s}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                  {p.stack.length > 6 && (
                    <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
                      +{p.stack.length - 6}
                    </span>
                  )}
                </div>
              </div>

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
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}