import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Code2, Palette, MonitorSmartphone, Cloud, Zap, Shield, Compass, User, ArrowRight, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Services — GLASSKID | What I can build for you",
  description: "End-to-end product development: web apps, SaaS, UI/UX, APIs, performance and consultation.",
  openGraph: {
    title: "Services — GLASSKID",
    description: "What GLASSKID can build for you.",
    type: "website",
    url: "/services",
  },
  alternates: { canonical: "/services" },
};

const SERVICES = [
  { Icon: Code2, title: "Full Stack Development", desc: "End-to-end web development using modern technologies to build fast, secure and scalable applications." },
  { Icon: Palette, title: "UI/UX Design", desc: "Beautiful, user-centered designs that not only look stunning but deliver exceptional experiences." },
  { Icon: MonitorSmartphone, title: "Web Applications", desc: "Custom web applications built for performance, scalability and a seamless user experience." },
  { Icon: Cloud, title: "SaaS Development", desc: "I build robust SaaS platforms with secure authentication, billing and analytics integration." },
  { Icon: Zap, title: "API Integration", desc: "Seamlessly integrate third-party APIs and build custom APIs to power your applications." },
  { Icon: Shield, title: "Performance Optimization", desc: "Improve speed, SEO and core web vitals to ensure the best user experience." },
  { Icon: Compass, title: "Maintenance & Support", desc: "Reliable maintenance, updates and support to keep your application running smoothly." },
  { Icon: User, title: "Consultation", desc: "Get expert advice on your project idea, tech stack and best development approach." },
];

const PROCESS = [
  { step: "01", title: "Discovery", desc: "Understanding your goals, requirements and target audience." },
  { step: "02", title: "Design", desc: "Planning, wireframing and designing the perfect user experience." },
  { step: "03", title: "Develop", desc: "Writing clean, efficient and scalable code using best practices." },
  { step: "04", title: "Deploy", desc: "Testing, deploying and launching your project to the world." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What I Do"
        title="What I can build"
        accent="for you"
        description="I help businesses and individuals turn ideas into powerful digital solutions that are fast, scalable, and designed to create real impact."
      />

      <section className="mx-auto max-w-6xl px-6">
        <div className="chip mb-3">
          <span className="size-1.5 rounded-full bg-primary" /> My Services
        </div>
        <h2 className="text-2xl font-bold md:text-3xl">
          Services I <span className="text-gradient">Provide</span>
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ Icon, title, desc }) => (
            <div key={title} className="glass-card group p-5">
              <span className="icon-tile mb-4">
                <Icon className="size-5" />
              </span>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              <ArrowUpRight className="mt-3 size-4 text-muted-foreground transition group-hover:text-primary" />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-6">
        <div className="chip mb-3">
          <span className="size-1.5 rounded-full bg-primary" /> My Process
        </div>
        <h2 className="text-2xl font-bold md:text-3xl">
          My Development <span className="text-gradient">Process</span>
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p) => (
            <div key={p.step} className="glass-card relative overflow-hidden p-6">
              <div className="pointer-events-none absolute -right-4 -top-4 text-6xl font-black text-white/[0.04]">{p.step}</div>
              <h3 className="text-base font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-4 text-xs font-semibold text-primary">{p.step}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-6 pb-28">
        <div className="glass-card p-8 md:p-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="chip mb-3">
                <span className="size-1.5 rounded-full bg-primary" /> Ready to work together
              </div>
              <h3 className="text-3xl font-bold md:text-4xl">
                Ready to build something <span className="text-gradient">amazing?</span>
              </h3>
              <p className="mt-2 max-w-lg text-muted-foreground">
                Let&apos;s bring your idea to life with clean code, creative design and powerful functionality.
              </p>
            </div>
            <Link href="/contact" className="btn-glow inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold">
              Start Your Project <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}