import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ArrowUpRight, Clock } from "lucide-react";
import { getPublishedBlogPosts } from "@/app/admin/blog/actions";
import { posts as staticPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — THEREALGLASSKID | Thoughts on code, design & music",
  description: "Notes, tutorials and stories from THEREALGLASSKID on code, design, creativity and music.",
  openGraph: {
    title: "Blog — THEREALGLASSKID",
    description: "Notes and stories from THEREALGLASSKID.",
    type: "website",
    url: "/blog",
  },
  alternates: { canonical: "/blog" },
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  let POSTS: { title: string; cat: string; read: string; date: string; slug: string }[] = [];

  try {
    const fromDb = await getPublishedBlogPosts();
    if (fromDb.length > 0) {
      POSTS = fromDb.map((p) => ({
        title: p.title,
        cat: p.category,
        read: p.read,
        date: p.date,
        slug: p.slug,
      }));
    }
  } catch {
    // Firebase unavailable
  }

  if (POSTS.length === 0) {
    POSTS = staticPosts.map((p) => ({
      title: p.title,
      cat: p.category,
      read: p.read,
      date: p.date,
      slug: p.slug,
    }));
  }

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
            <article key={p.slug} className="glass-card group overflow-hidden p-5">
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
                href={`/blog/${p.slug}`}
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
