import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ArrowUpRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — GLASSKID | Thoughts on code, design & music",
  description: "Notes, tutorials and stories from GLASSKID on code, design, creativity and music.",
  openGraph: {
    title: "Blog — GLASSKID",
    description: "Notes and stories from GLASSKID.",
    type: "website",
    url: "/blog",
  },
  alternates: { canonical: "/blog" },
};

const POSTS = [
  { title: "Building scalable React apps in 2026", cat: "Engineering", read: "6 min", date: "Jul 12, 2026" },
  { title: "How I design in the dark: my aesthetic system", cat: "Design", read: "4 min", date: "Jun 28, 2026" },
  { title: "From code to melody — my creative workflow", cat: "Creative", read: "5 min", date: "Jun 10, 2026" },
  { title: "Firebase or Postgres? A pragmatic guide", cat: "Backend", read: "8 min", date: "May 30, 2026" },
  { title: "Shipping premium UI without a design team", cat: "Design", read: "5 min", date: "May 15, 2026" },
  { title: "Why I still believe in personal websites", cat: "Essays", read: "3 min", date: "Apr 22, 2026" },
];

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Thoughts on code, design"
        accent="& music."
        description="Notes, tutorials and stories from my journey as a developer, designer and songwriter."
      />

      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <article key={p.title} className="glass-card group overflow-hidden p-5">
              <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-xl border border-white/5">
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(135deg, oklch(0.35 0.2 300 / 0.7), oklch(0.15 0.05 285))" }}
                />
                <div className="chip absolute right-3 top-3 !text-[10px]">{p.cat}</div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{p.date}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  {p.read}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-semibold leading-snug">{p.title}</h3>
              <a
                href={`/blog/${p.title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, "")}`}
                className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Read post <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5" />
              </a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}