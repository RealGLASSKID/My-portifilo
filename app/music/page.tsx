import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Play, Music2, Headphones, Heart, Star, FileText } from "lucide-react";
import { getPublishedMusic } from "@/app/admin/music/actions";

export const metadata: Metadata = {
  title: "Music — GLASSKID | Original songs & releases",
  description: "Music is not what I do — it's who I am. Original songs and releases by GLASSKID.",
  openGraph: {
    title: "Music — GLASSKID",
    description: "Original songs and releases by GLASSKID.",
    type: "website",
    url: "/music",
  },
  alternates: { canonical: "/music" },
};

export const dynamic = "force-dynamic";

const FALLBACK = [
  { title: "Broken Dreams", meta: "Single • 2024", tag: "NEW", slug: "broken-dreams" },
  { title: "Lagos Nights", meta: "EP • 2024", tag: "", slug: "lagos-nights" },
  { title: "Pieces of Pain", meta: "Single • 2023", tag: "", slug: "pieces-of-pain" },
  { title: "Never Settle", meta: "EP • 2023", tag: "", slug: "never-settle" },
];

const GENRES = [
  { Icon: Music2, title: "Afrobeats", desc: "Groovy rhythms with African vibes." },
  { Icon: Headphones, title: "Hip Hop", desc: "Real bars. Real stories. Real connection." },
  { Icon: Heart, title: "R&B", desc: "Melodies that touch the soul." },
  { Icon: Star, title: "Pop", desc: "Catchy. Emotional. Timeless." },
];

export default async function MusicPage() {
  let RELEASES = FALLBACK;
  try {
    const fromDb = await getPublishedMusic();
    if (fromDb.length > 0) {
      RELEASES = fromDb.map((r) => ({
        title: r.title,
        meta: `${r.type} • ${r.year}`,
        tag: r.tag || "",
        slug: r.slug,
      }));
    }
  } catch {
    // fallback
  }

  return (
    <>
      <PageHero
        eyebrow="My Music"
        title="Music is not what I do,"
        accent="it's who I am."
        description="I write, compose and create music that speaks from the heart and connects souls."
      >
        <div className="flex flex-wrap gap-3">
          <a href="#" className="btn-glow inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
            <Play className="size-4" /> Listen Now
          </a>
          <a href="#" className="btn-ghost-glass inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
            Watch Videos
          </a>
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "25+", v: "Songs Released" },
            { k: "100K+", v: "Streams Worldwide" },
            { k: "10K+", v: "Listeners" },
            { k: "5+", v: "Years Creating" },
          ].map((s) => (
            <div key={s.v} className="glass-card p-5">
              <div className="text-gradient text-3xl font-bold">{s.k}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-6">
        <div className="chip mb-3">
          <span className="size-1.5 rounded-full bg-primary" /> Latest Releases
        </div>
        <h2 className="text-2xl font-bold md:text-3xl">
          My Latest <span className="text-gradient">Releases</span>
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {RELEASES.map((r) => (
            <article key={r.slug} className="glass-card overflow-hidden p-4">
              <div className="relative mb-4 aspect-square overflow-hidden rounded-xl border border-white/5">
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(135deg, oklch(0.4 0.22 300 / 0.8), oklch(0.15 0.05 285))" }}
                />
                <div className="absolute inset-0 grid place-items-center opacity-40">
                  <Music2 className="size-16" />
                </div>
                {r.tag ? <div className="chip absolute left-3 top-3 !text-[10px]">{r.tag}</div> : null}
                <a
                  href={`/music/${r.slug}`}
                  aria-label={`Play ${r.title}`}
                  className="btn-glow absolute bottom-3 right-3 grid size-10 place-items-center rounded-full"
                >
                  <Play className="size-4" />
                </a>
              </div>
              <h3 className="text-base font-semibold">{r.title}</h3>
              <p className="text-xs text-muted-foreground">{r.meta}</p>
              <a href={`/music/${r.slug}/lyrics`} className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                <FileText className="size-3.5" /> Lyrics
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-6 pb-28">
        <div className="chip mb-3">
          <span className="size-1.5 rounded-full bg-primary" /> Genres
        </div>
        <h2 className="text-2xl font-bold md:text-3xl">
          Sounds I <span className="text-gradient">Create</span>
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GENRES.map(({ Icon, title, desc }) => (
            <div key={title} className="glass-card p-5">
              <span className="icon-tile mb-4">
                <Icon className="size-5" />
              </span>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
