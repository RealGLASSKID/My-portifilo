import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Sparkles,
  Music2,
  Palette,
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Facebook,
  Send,
  Briefcase,
  Headphones,
  Play,
} from "lucide-react";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "GLASSKID | Full Stack Web Developer • Next.js • React • Javascript • Tailwind CSS • TypeScript • Lagos, Nigeria",
  description:
    "GLASSKID (Prince Dennis) — Full Stack Web Developer, Creative Technologist, Artist & Songwriter from Lagos, Nigeria. Building fast, modern, scalable web apps with React, Next.js, TypeScript and Tailwind.",
  openGraph: {
    title: "GLASSKID | Full Stack Web Developer • Next.js • React • Javascript • Tailwind CSS • TypeScript",
    description:
      "GLASSKID (Prince Dennis) — Full Stack Web Developer, Creative Technologist, Artist & Songwriter from Lagos, Nigeria. Building fast, modern, scalable web apps with React, Next.js, TypeScript and Tailwind.",
    type: "website",
    url: "/",
  },
  alternates: { canonical: "/" },
};

const TECH = ["Next.js", "React", "Bootstrap", "TypeScript", "Tailwind CSS", "Firebase", "Node.js", "PostgreSQL", "MongoDB" , "React Native" , "JavaScript", "Vercel", "Supabase", "Prisma", "GraphQL", "REST APIs", "Git", "Docker" , "Jest", "Cypress", "Figma", "Adobe XD", "Photoshop", "Illustrator", "After Effects", "Premiere Pro"];

const STATS = [
  { k: "3+", v: "Years Coding", Icon: Code2 },
  { k: "20+", v: "Projects Completed", Icon: Briefcase },
  { k: "15+", v: "Songs Released", Icon: Headphones },
];

const PROJECTS = [
  { tag: "Web App", name: "Nexora", desc: "Modern SaaS platform for managing projects, teams and analytics.", stack: ["Next.js", "TS", "Tailwind"] },
  { tag: "EdTech", name: "Cherry Noble School", desc: "School management system with student, teacher and exam modules.", stack: ["React", "Firebase"] },
  { tag: "Music Platform", name: "Echoes", desc: "Music streaming platform for emerging artists and music lovers.", stack: ["Next.js", "Node", "TS"] },
];

const SERVICES = [
  { Icon: Code2, title: "Web Development", desc: "Building fast, scalable and responsive web applications." },
  { Icon: Sparkles, title: "Frontend Development", desc: "Creating beautiful, interactive and accessible user interfaces." },
  { Icon: Palette, title: "UI/UX Design", desc: "Designing intuitive and engaging digital experiences." },
  { Icon: Music2, title: "Music & Composition", desc: "Creating original songs and producing professional music." },
];

const SKILLS = [
  { name: "JavaScript / TypeScript", value: 95 },
  { name: "React / Next.js", value: 90 },
  { name: "Tailwind CSS", value: 90 },
  { name: "Next.js", value: 85 },
  { name: "React Native", value: 80 },
  { name: "UI/UX Design", value: 75 },
  { name: "React Native", value: 80 },
  { name: "JavaScript", value: 90 },
  { name: "TypeScript", value: 90 },];

const MUSIC = [
  { title: "Forever", meta: "GLASSKID • 3:45" },
  { title: "Fallen Angel", meta: "GLASSKID • 3:12" },
  { title: "Dreams", meta: "GLASSKID • 4:08" },
];

const SOCIALS = [Github, Linkedin, Instagram, Twitter, Facebook];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-6">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-0 h-[320px] w-[min(900px,140vw)] -translate-x-1/2 rounded-full blur-3xl md:h-[520px]"
            style={{ background: "var(--gradient-radial-glow)" }}
          />
        </div>

        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
          <div className="animate-fade-up">
            <span className="chip">
              <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--neon)]" /> Hi, I&apos;m
            </span>
            <h1 className="mt-5 text-[clamp(2.5rem,6vw,4.25rem)] font-bold leading-[0.95] tracking-tighter">
              <span className="text-gradient animate-gradient">GLASSKID</span>
            </h1>
            <p className="mt-6 text-[clamp(1.05rem,2.2vw,1.5rem)] font-medium text-foreground/90">
              Full Stack Developer <span className="text-primary">•</span> Multi Instrumentalist
              <span className="text-primary">•</span> Songwriter
              <br />
              <span className="text-muted-foreground">Creative Technologist</span>
            </p>
            <p className="mt-5 max-w-lg text-muted-foreground">
              I build fast, scalable web applications and create music that tells stories.
              Turning ideas into digital experiences from Lagos, Nigeria.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/projects" className="btn-glow inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
                View Projects <ArrowRight className="size-4" />
              </Link>
              <Link href="/contact" className="btn-ghost-glass inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
                Hire Me <Send className="size-4" />
              </Link>
            </div>

            <div className="mt-6 flex gap-2">
              {SOCIALS.map((Icon, i) => (
                <a key={i} href="#" aria-label="social" className="btn-ghost-glass grid size-10 place-items-center rounded-full">
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Portrait card */}
          <div className="relative animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="glass neon-ring relative overflow-hidden rounded-3xl">
              <Image
                src="/images/hero-portrait.png"
                alt="GLASSKID portrait — Prince Dennis"
                width={1024}
                height={1280}
                className="h-[min(32rem,70vw)] w-full object-cover sm:h-[min(32.5rem,55vw)]"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="absolute -right-4 top-8 hidden flex-col gap-3 md:flex">
              {STATS.map(({ k, v, Icon }, i) => (
                <div
                  key={v}
                  className="glass-card animate-float flex items-center gap-3 px-4 py-3"
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  <span className="icon-tile !size-10">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <div className="text-lg font-bold leading-none">{k}</div>
                    <div className="text-xs text-muted-foreground">{v}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tech marquee */}
        <div className="glass mt-14 overflow-hidden rounded-2xl px-4 py-4">
          <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
            {[...TECH, ...TECH].map((t, i) => (
              <span key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--neon)]" />
                <span className="font-semibold text-foreground/80">{t}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="mx-auto mt-28 max-w-6xl px-6">
        <SectionHeader
          eyebrow="Featured Projects"
          title="Selected"
          accent="work"
          action={
            <Link href="/projects" className="group inline-flex items-center gap-1 text-sm text-primary hover:underline">
              View all <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5" />
            </Link>
          }
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {PROJECTS.map((p) => (
            <article key={p.name} className="glass-card group overflow-hidden p-5">
              <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl border border-white/5">
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(135deg, oklch(0.35 0.15 295 / 0.7), oklch(0.2 0.05 285))" }}
                />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-2xl font-bold tracking-tight text-white/90">{p.name.toUpperCase()}</div>
                </div>
                <div className="chip absolute right-3 top-3 !text-[10px]">Featured</div>
              </div>
              <div className="text-xs uppercase tracking-widest text-primary/80">{p.tag}</div>
              <h3 className="mt-1 text-lg font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* WHAT I DO */}
      <section className="mx-auto mt-28 max-w-6xl px-6">
        <SectionHeader eyebrow="What I Do" title="Services I" accent="provide" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ Icon, title, desc }) => (
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

      {/* SKILLS + MUSIC */}
      <section className="mx-auto mt-28 max-w-6xl px-6">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="glass-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="chip mb-2">
                  <span className="size-1.5 rounded-full bg-primary" /> My Skills
                </div>
                <h3 className="text-xl font-semibold">Toolbox &amp; expertise</h3>
              </div>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {SKILLS.map((s, i) => (
                  <li key={`${s.name}-${i}`}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-foreground/90">{s.name}</span>
                    <span className="text-muted-foreground">{s.value}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${s.value}%`, background: "var(--gradient-brand)", boxShadow: "0 0 12px var(--neon)" }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="chip mb-2">
                  <span className="size-1.5 rounded-full bg-primary" /> Latest Music
                </div>
                <h3 className="text-xl font-semibold">Now playing</h3>
              </div>
              <Link href="/music" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <ul className="divide-y divide-white/5">
              {MUSIC.map((m, i) => (
                <li key={m.title} className="flex items-center gap-4 py-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-white/5 text-sm font-semibold text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium">{m.title}</div>
                    <div className="text-xs text-muted-foreground">{m.meta}</div>
                  </div>
                  <button aria-label={`Play ${m.title}`} className="btn-glow grid size-10 place-items-center rounded-full">
                    <Play className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-28 max-w-6xl px-6 pb-28">
        <div className="glass-card relative overflow-hidden p-8 md:p-12">
          <div
            className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full blur-3xl"
            style={{ background: "var(--gradient-radial-glow)" }}
          />
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="chip mb-3">
                <span className="size-1.5 rounded-full bg-primary" /> Let&apos;s work together
              </div>
              <h3 className="text-3xl font-bold md:text-4xl">
                Have a project in mind? <span className="text-gradient">Let&apos;s build it.</span>
              </h3>
              <p className="mt-2 max-w-lg text-muted-foreground">
                Available for freelance projects, collaborations and full-time opportunities.
              </p>
            </div>
            <Link href="/contact" className="btn-glow inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold">
              Get in touch <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeader({
  eyebrow,
  title,
  accent,
  action,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="chip mb-3">
          <span className="size-1.5 rounded-full bg-primary" /> {eyebrow}
        </div>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          {title} {accent && <span className="text-gradient">{accent}</span>}
        </h2>
      </div>
      {action}
    </div>
  );
}