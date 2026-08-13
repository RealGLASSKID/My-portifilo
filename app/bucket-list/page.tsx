import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Bucket List — GLASSKID",
  description: "Goals, adventures and personal milestones — tracked and checked off one at a time.",
  openGraph: {
    title: "Bucket List — GLASSKID",
    description: "Things I want to do at least once.",
    type: "website",
  },
  alternates: { canonical: "/bucket-list" },
};

type Item = { title: string; tag: string; year?: string; desc: string; done?: boolean };
type Group = { number: string; title: string; subtitle: string; items: Item[] };

const GROUPS: Group[] = [
  {
    number: "01",
    title: "Dream.",
    subtitle: "Career & Code",
    items: [
      { title: "Launch a SaaS product", tag: "career", year: "2026", desc: "Build something people pay for — real product, real users, real revenue." },
      { title: "Get a remote job", tag: "career", year: "2025", desc: "Full-time remote at a forward-thinking company. Ship from anywhere.", done: true },
      { title: "First open-source contribution", tag: "career", year: "2025", desc: "Merge a meaningful PR into a library I actually use.", done: true },
      { title: "International client in USD", tag: "career", year: "2025", desc: "Ongoing collaboration with a client outside Nigeria.", done: true },
      { title: "Build my first real website", tag: "career", year: "2024", desc: "The one that made it click. Terrible code, life-changing moment.", done: true },
      { title: "Ship in 20+ technologies", tag: "career", desc: "Not tutorials — actually shipped things. Range as a superpower." },
      { title: "Write 10 technical deep-dives", tag: "content", desc: "Long-form essays that teach one thing very well." },
    ],
  },
  {
    number: "02",
    title: "Create.",
    subtitle: "Music & Art",
    items: [
      { title: "Release a full-length album", tag: "music", year: "2026", desc: "10+ tracks, one cohesive body of work under GLASSKID." },
      { title: "Perform live in Lagos", tag: "music", desc: "First headline set. Small room, real crowd." },
      { title: "100M streams on a single track", tag: "music", desc: "One song that finds its people." },
      { title: "Collab with an artist I admire", tag: "music", desc: "One feature that changes the trajectory." },
      { title: "Score a short film", tag: "music", desc: "Original music for someone else's story." },
    ],
  },
  {
    number: "03",
    title: "Live.",
    subtitle: "Life & Adventure",
    items: [
      { title: "Travel to 10+ countries", tag: "travel", desc: "See the world, work from it." },
      { title: "Own my first car", tag: "life", desc: "Nothing crazy — freedom on wheels." },
      { title: "Buy my mum a house", tag: "family", desc: "The one that started it all deserves the keys." },
      { title: "Learn a second language", tag: "growth", desc: "Fluent enough to hold a real conversation." },
      { title: "Read 50 books", tag: "growth", desc: "Fiction, tech, philosophy — mix it up." },
    ],
  },
];

const total = GROUPS.reduce((n, g) => n + g.items.length, 0);
const done = GROUPS.reduce((n, g) => n + g.items.filter((i) => i.done).length, 0);

export default function BucketPage() {
  return (
    <>
      <PageHero
        eyebrow="Bucket List"
        title="Things I want to do"
        accent="at least once."
        description={`Goals, adventures and personal milestones — tracked and checked off one at a time. ${done} of ${total} done.`}
      />

      <section className="mx-auto max-w-6xl space-y-16 px-6 pb-24">
        {GROUPS.map((g) => {
          const groupDone = g.items.filter((i) => i.done).length;
          return (
            <div key={g.number}>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <div className="font-mono text-xs tracking-widest text-primary/70">{g.number}</div>
                  <h2 className="mt-1 text-3xl font-bold md:text-4xl">
                    {g.title.replace(".", "")}
                    <span className="text-primary">.</span>
                  </h2>
                  <div className="mt-1 text-sm text-muted-foreground">{g.subtitle}</div>
                </div>
                <div className="chip">
                  {groupDone}/{g.items.length}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {g.items.map((item, i) => (
                  <div key={item.title} className={`glass-card p-5 transition ${item.done ? "border-primary/40" : ""}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                        <h3 className={`text-base font-semibold ${item.done ? "line-through decoration-primary/60" : ""}`}>
                          {item.title}
                        </h3>
                      </div>
                      {item.done && (
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/20 text-primary">
                          <Check className="size-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-widest">
                      <span className="rounded-md bg-white/5 px-2 py-0.5 text-muted-foreground">{item.tag}</span>
                      {item.year && <span className="rounded-md bg-primary/10 px-2 py-0.5 text-primary/80">{item.year}</span>}
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}