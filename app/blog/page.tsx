import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ArrowUpRight, Clock, ExternalLink } from "lucide-react";
import { getPublishedBlogPosts } from "@/app/admin/blog/actions";
import { posts as staticPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — GLASSKID | Thoughts on code, design & music",
  description:
    "Notes, tutorials and stories from GLASSKID on code, design, creativity and music.",
  openGraph: {
    title: "Blog — GLASSKID",
    description: "Notes and stories from GLASSKID.",
    type: "website",
    url: "/blog",
  },
  alternates: { canonical: "/blog" },
};

export const dynamic = "force-dynamic";

type CardPost = {
  title: string;
  cat: string;
  read: string;
  date: string;
  slug: string;
  externalUrl?: string;
  coverUrl?: string;
  featured?: boolean;
};

export default async function BlogPage() {
  let POSTS: CardPost[] = [];

  try {
    const fromDb = await getPublishedBlogPosts();
    if (fromDb.length > 0) {
      POSTS = fromDb.map((p) => ({
        title: p.title,
        cat: p.category,
        read: p.read,
        date: p.date,
        slug: p.slug,
        externalUrl: p.externalUrl || "",
        coverUrl: p.coverUrl || "",
        featured: !!p.featured,
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
      externalUrl: "",
      coverUrl: "",
      featured: false,
    }));
  }

  const featured = POSTS.filter((p) => p.featured);
  const rest = POSTS.filter((p) => !p.featured);
  const ordered = [...featured, ...rest];

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
          {ordered.map((p) => (
            <article key={p.slug} className="glass-card group flex flex-col overflow-hidden p-5">
              <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-xl border border-white/5">
                {p.coverUrl ? (
                  <Image
                    src={p.coverUrl}
                    alt={p.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(79, 0, 144, 0.7), rgb(10, 7, 31))",
                    }}
                  />
                )}
                <div className="absolute left-3 top-3 flex flex-wrap gap-1">
                  {p.featured ? (
                    <span className="rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-semibold text-white">
                      Featured
                    </span>
                  ) : null}
                </div>
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

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={`/blog/${p.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Read post <ArrowUpRight className="size-4" />
                </Link>
                {p.externalUrl ? (
                  <a
                    href={p.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Open post <ExternalLink className="size-3.5" />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        {POSTS.length === 0 && (
          <div className="glass-card p-10 text-center text-muted-foreground">
            No posts yet. Check back soon.
          </div>
        )}
      </section>
    </>
  );
}
