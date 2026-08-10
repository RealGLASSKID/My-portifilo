import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";

type Post = {
  slug: string;
  title: string;
  cat: string;
  read: string;
  date: string;
  excerpt: string;
  content: string[];
};

const POSTS: Post[] = [
  {
    slug: "building-scalable-react-apps-in-2026",
    title: "Building scalable React apps in 2026",
    cat: "Engineering",
    read: "6 min",
    date: "Jul 12, 2026",
    excerpt: "A practical look at the patterns and tools I actually reach for when a React codebase needs to grow without falling apart.",
    content: [
      "Scalability in a React app rarely comes down to a single framework decision — it's the accumulation of small, boring choices made consistently over time.",
      "This post is coming soon. Connect a CMS or MDX content source to publish the full article here.",
    ],
  },
  {
    slug: "how-i-design-in-the-dark-my-aesthetic-system",
    title: "How I design in the dark: my aesthetic system",
    cat: "Design",
    read: "4 min",
    date: "Jun 28, 2026",
    excerpt: "The glassmorphism, neon-purple design language behind this site — and the reasoning behind every token.",
    content: [
      "Every color, shadow and radius on this site traces back to a small set of design tokens.",
      "This post is coming soon. Connect a CMS or MDX content source to publish the full article here.",
    ],
  },
  {
    slug: "from-code-to-melody-my-creative-workflow",
    title: "From code to melody — my creative workflow",
    cat: "Creative",
    read: "5 min",
    date: "Jun 10, 2026",
    excerpt: "How writing software and writing songs feed the same part of my brain, and the workflow I use to move between them.",
    content: [
      "Code and music are more alike than people expect — both are about structure, iteration and knowing when something finally feels right.",
      "This post is coming soon. Connect a CMS or MDX content source to publish the full article here.",
    ],
  },
  {
    slug: "firebase-or-postgres-a-pragmatic-guide",
    title: "Firebase or Postgres? A pragmatic guide",
    cat: "Backend",
    read: "8 min",
    date: "May 30, 2026",
    excerpt: "No dogma — just a practical breakdown of when I reach for Firebase and when I reach for Postgres.",
    content: [
      "The honest answer is: it depends on your timeline, your team, and how much you value relational guarantees on day one.",
      "This post is coming soon. Connect a CMS or MDX content source to publish the full article here.",
    ],
  },
  {
    slug: "shipping-premium-ui-without-a-design-team",
    title: "Shipping premium UI without a design team",
    cat: "Design",
    read: "5 min",
    date: "May 15, 2026",
    excerpt: "How solo developers can ship interfaces that feel considered, without a dedicated designer on the team.",
    content: [
      "A small, disciplined set of design tokens will get you further than a huge, inconsistent component library.",
      "This post is coming soon. Connect a CMS or MDX content source to publish the full article here.",
    ],
  },
  {
    slug: "why-i-still-believe-in-personal-websites",
    title: "Why I still believe in personal websites",
    cat: "Essays",
    read: "3 min",
    date: "Apr 22, 2026",
    excerpt: "In an age of algorithmic feeds, a personal site is still the one place on the internet that's entirely yours.",
    content: [
      "A personal site doesn't get deprioritized by an algorithm or buried under someone else's ad.",
      "This post is coming soon. Connect a CMS or MDX content source to publish the full article here.",
    ],
  },
];

function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Post not found — GLASSKID" };
  return {
    title: `${post.title} — GLASSKID`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const related = POSTS.filter((p) => p.slug !== params.slug).slice(0, 3);

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