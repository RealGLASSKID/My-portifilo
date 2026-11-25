import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ArrowUpRight, Clock } from "lucide-react";
import { getPublishedBlogPosts } from "@/app/admin/blog/actions";
import { getGalleryItems } from "@/app/admin/gallery/actions";
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

export default async function BlogPage() {
  let POSTS: {
    title: string;
    cat: string;
    read: string;
    date: string;
    slug: string;
    externalUrl?: string;
    coverUrl?: string;
  }[] = [];

  let featuredGallery: {
    id: string;
    title: string;
    imageUrl: string;
  }[] = [];

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
    }));
  }

  try {
    const gallery = await getGalleryItems();
    featuredGallery = gallery
      .filter((i) => i.featured && i.imageUrl)
      .slice(0, 4)
      .map((i) => ({
        id: i.id,
        title: i.title || "Gallery",
        imageUrl: i.imageUrl,
      }));
  } catch {
    featuredGallery = [];
  }

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Thoughts on code, design"
        accent="& music."
        description="Notes, tutorials and stories from my journey as a developer, designer and songwriter."
      />

      {featuredGallery.length > 0 && (
        <section className="mx-auto mb-10 max-w-6xl px-6">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="text-lg font-semibold">Featured moments</h2>
            <Link href="/gallery" className="text-sm text-primary hover:underline">
              Gallery
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {featuredGallery.map((item) => (
              <Link
                key={item.id}
                href="/gallery"
                className="relative aspect-square overflow-hidden rounded-xl border border-white/10"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <article key={p.slug} className="glass-card group overflow-hidden p-5">
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
                href={p.externalUrl ? p.externalUrl : `/blog/${p.slug}`}
                {...(p.externalUrl
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                {p.externalUrl ? "Open post" : "Read post"}{" "}
                <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5" />
              </a>
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
