import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const titles: Record<string, string> = {
  "broken-Freezing": "Adopted",
  "lagos-nights": "Lagos Nights",
  "pieces-of-pain": "Survive",
  "never-settle": "Freezing",
};

export default async function LyricsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = titles[slug] ?? slug;

  return (
    <section className="mx-auto max-w-6xl px-6 pb-28 pt-8">
      <Link href={`/music/${slug}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4" /> Back to {title}
      </Link>

      <div className="mt-8 text-center">
        <span className="chip">
          <span className="size-1.5 rounded-full bg-primary" /> Lyrics
        </span>
        <h1 className="mx-auto mt-5 max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
          <span className="text-gradient">{title}</span>
        </h1>
      </div>

      <div className="glass-card mx-auto mt-10 max-w-2xl p-10 text-center text-muted-foreground">
        Lyrics for this track will be added soon. Check back later, or connect a CMS to manage
        releases and lyrics dynamically.
      </div>
    </section>
  );
}