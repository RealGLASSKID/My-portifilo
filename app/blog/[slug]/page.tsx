import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/app/admin/blog/actions";
import { posts as FALLBACK_POSTS } from "@/lib/blog";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);
  const fallback = FALLBACK_POSTS.find((p) => p.slug === slug);
  const title = post?.title ?? fallback?.title;
  const excerpt = post?.excerpt ?? fallback?.excerpt;
  if (!title) return { title: "Post not found — GLASSKID" };
  return { title: `${title} — GLASSKID`, description: excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const [dbPost, dbPosts] = await Promise.all([
    getBlogPostBySlug(slug).catch(() => null),
    getPublishedBlogPosts().catch(() => []),
  ]);

  const fallback = FALLBACK_POSTS.find((p) => p.slug === slug);
  const post = dbPost
    ? {
        title: dbPost.title,
        cat: dbPost.category,
        read: dbPost.read,
        date: dbPost.date,
        excerpt: dbPost.excerpt,
        content: dbPost.content,
        coverUrl: dbPost.coverUrl,
      }
    : fallback
      ? { ...fallback, coverUrl: "" }
      : null;

  if (!post) notFound();

  const related =
    dbPosts.length > 0
      ? dbPosts.filter((p) => p.slug !== slug).slice(0, 3).map((p) => ({ slug: p.slug, cat: p.category, title: p.title }))
      : FALLBACK_POSTS.filter((p) => p.slug !== slug).slice(0, 3).map((p) => ({ slug: p.slug, cat: p.category, title: p.title }));

  return (
    <section className="mx-auto max-w-3xl px-6 pb-28 pt-8">
      <Link href="/blog" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="size-4" /> Back to blog
      </Link>

      <div className="chip mb-3 !text-[10px]">{post.cat}</div>
      <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">{post.title}</h1>
      <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
        <span>{post.date}</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3" /> {post.read} read
        </span>
      </div>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>

      {post.coverUrl && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-white/10">
          <Image src={post.coverUrl} alt={post.title} fill className="object-cover" sizes="768px" priority />
        </div>
      )}

      <article className="mt-12 space-y-6">
        {post.content.map((paragraph, i) => (
          <p key={i} className="leading-relaxed text-foreground/85">
            {paragraph}
          </p>
        ))}
      </article>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-5 text-lg font-semibold">More posts</h2>
          <div className="space-y-3">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`}>
                <div className="glass-card !py-4 !px-5">
                  <p className="text-xs text-primary/80">{p.cat}</p>
                  <p className="mt-1 font-medium text-foreground transition-colors hover:text-primary">{p.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
