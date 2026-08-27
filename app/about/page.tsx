import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Code2, Heart, Rocket, Target, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About — GLASSKID | Prince Dennis",
  description: "The mind behind the code and the music — the story of Prince Dennis, aka GLASSKID.",
  openGraph: {
    title: "About GLASSKID (Prince Dennis)",
    description: "Full stack developer, artist and songwriter from Lagos, Nigeria.",
    type: "profile",
    url: "/about",
  },
  alternates: { canonical: "/about" },
};

const TIMELINE = [
  { year: "2023", title: "The Beginning", desc: "Started my coding journey with HTML & CSS. Built my first website." },
  { year: "2023", title: "Exploring Creativity", desc: "Dive into JavaScript and discovered my love for solving problems." },
  { year: "2024", title: "Leveling Up", desc: "Learnt React, built more projects and started creating music seriously." },
  { year: "2024", title: "Going Full Stack", desc: "Mastered backend development, APIs and databases." },
  { year: "2025", title: "Building & Shipping", desc: "Built real-world projects, collaborated and improved my craft." },
  { year: "2025+", title: "The Vision", desc: "Building impactful products and music that leave a lasting legacy." },
];

const VALUES = [
  { Icon: Sparkles, title: "Authenticity", desc: "I stay true to myself in everything I build and create." },
  { Icon: Rocket, title: "Excellence", desc: "I strive for excellence in code, design and music." },
  { Icon: Heart, title: "Purpose", desc: "I build with purpose and create with meaning." },
  { Icon: Target, title: "Impact", desc: "I want my work to make a difference in people's lives." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Me"
        title="The mind behind the"
        accent="code & the music."
        description="I'm a full stack developer, artist and songwriter from Lagos, Nigeria. I build digital experiences that solve real problems and create music that speaks to the soul."
      />

      <section className="mx-auto max-w-6xl px-6">
        <div className="glass-card p-6 md:p-10">
          <div className="chip mb-3">
            <span className="size-1.5 rounded-full bg-primary" /> My Story
          </div>
          <h2 className="text-2xl font-bold md:text-3xl">My journey so far.</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {TIMELINE.map((t) => (
              <div key={t.year} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="grid size-10 place-items-center rounded-full border border-primary/50 bg-primary/10 text-sm font-bold text-primary">
                    {t.year.slice(2)}
                  </span>
                  <span className="mt-1 w-px flex-1 bg-white/10" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-primary/80">{t.year}</div>
                  <h3 className="mt-1 text-lg font-semibold">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-6">
        <div className="chip mb-3">
          <span className="size-1.5 rounded-full bg-primary" /> What drives me
        </div>
        <h2 className="text-2xl font-bold md:text-3xl">My values.</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ Icon, title, desc }) => (
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

      <section className="mx-auto mt-16 max-w-6xl px-6 pb-28">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[
            { k: "20+", v: "Projects Completed" },
            { k: "15+", v: "Songs Released" },
            { k: "3+", v: "Years Coding" },
            { k: "10+", v: "Happy Clients" },
          ].map((s) => (
            <div key={s.v} className="glass-card p-5">
              <div className="text-gradient text-3xl font-bold">{s.k}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}