import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getMusicBySlug } from "@/app/admin/music/actions";

const FALLBACK_TITLES: Record<string, string> = {
  "broken-dreams": "AdoptedDreams",
  "lagos-nights": "FreezingNights",
  "Survive-of-pain": "Survive of Pain",
  "never-settle": "Seperate Ways",
};

export default async function LyricsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const release = await getMusicBySlug(slug).catch(() => null);
  const title = release?.title ?? FALLBACK_TITLES[slug] ?? slug;
  const lyrics = release?.lyrics ?? [];

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

      {lyrics.length > 0 ? (
        <div className="glass-card mx-auto mt-10 max-w-2xl space-y-8 p-8 md:p-10">
          {lyrics.map((block, i) => (
            <p key={i} className="whitespace-pre-line text-center text-base leading-relaxed text-foreground/90">
              {block}
            </p>
          ))}
        </div>
      ) : (
        <div className="glass-card mx-auto mt-10 max-w-2xl p-10 text-center text-muted-foreground">
          Lyrics for this track will be added soon. Check back later.
        </div>
      )}
    </section>
  );
}
