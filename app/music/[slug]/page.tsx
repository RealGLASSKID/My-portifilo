import Link from "next/link";
import { ArrowLeft, Play, FileText, Music2 } from "lucide-react";

const TRACKS: Record<string, { title: string; meta: string; tag?: string }> = {
  "broken-dreams": { title: "Broken Dreams", meta: "Single • 2024", tag: "NEW" },
  "lagos-nights": { title: "Lagos Nights", meta: "EP • 2024" },
  "pieces-of-pain": { title: "Pieces of Pain", meta: "Single • 2023" },
  "never-settle": { title: "Never Settle", meta: "EP • 2023" },
};

export default function TrackPage({ params }: { params: { slug: string } }) {
  const track = TRACKS[params.slug] ?? { title: params.slug, meta: "" };

  return (
    <section className="mx-auto max-w-4xl px-6 pb-28 pt-8">
      <Link href="/music" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4" /> Back to Music
      </Link>

      <div className="glass-card neon-ring mt-8 overflow-hidden p-6 md:p-10">
        <div className="grid gap-8 md:grid-cols-[280px_1fr] md:items-center">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/5">
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, oklch(0.4 0.22 300 / 0.8), oklch(0.15 0.05 285))" }}
            />
            <div className="absolute inset-0 grid place-items-center opacity-40">
              <Music2 className="size-20" />
            </div>
            {track.tag && <div className="chip absolute left-3 top-3 !text-[10px]">{track.tag}</div>}
          </div>

          <div>
            <div className="chip mb-3">
              <span className="size-1.5 rounded-full bg-primary" /> Now Playing
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              <span className="text-gradient">{track.title}</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{track.meta}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="btn-glow inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
                <Play className="size-4" /> Play Track
              </button>
              <Link
                href={`/music/${params.slug}/lyrics`}
                className="btn-ghost-glass inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
              >
                <FileText className="size-4" /> View Lyrics
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card mt-8 p-6 text-sm text-muted-foreground">
        Streaming links and the audio player for this track will be added soon — connect Spotify,
        Apple Music, or a direct audio embed here.
      </div>
    </section>
  );
}