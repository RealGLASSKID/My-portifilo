import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import {
  Code2, Palette, MonitorSmartphone, Cloud, Zap, Shield, Compass, User, ArrowUpRight, type LucideIcon,
} from "lucide-react";
import { getPublishedServices } from "@/app/admin/services/actions";

export const metadata: Metadata = {
  title: "Services — THEREALGLASSKID | What I can build for you",
  description: "End-to-end product development: web apps, SaaS, UI/UX, APIs, performance and consultation.",
  openGraph: { title: "Services — THEREALGLASSKID", description: "What THEREALGLASSKID can build for you.", type: "website", url: "/services" },
  alternates: { canonical: "/services" },
};

export const dynamic = "force-dynamic";

const ICON_MAP: Record<string, LucideIcon> = {
  Code2, Palette, MonitorSmartphone, Cloud, Zap, Shield, Compass, User,
};

const FALLBACK = [
  { title: "Full Stack Development", description: "End-to-end web development using modern technologies to build fast, secure and scalable applications.", icon: "Code2" },
  { title: "UI/UX Design", description: "Beautiful, user-centered designs that not only look stunning but deliver exceptional experiences.", icon: "Palette" },
  { title: "Web Applications", description: "Custom web applications built for performance, scalability and a seamless user experience.", icon: "MonitorSmartphone" },
  { title: "SaaS Development", description: "I build robust SaaS platforms with secure authentication, billing and analytics integration.", icon: "Cloud" },
  { title: "API Integration", description: "Seamlessly integrate third-party APIs and build custom APIs to power your applications.", icon: "Zap" },
  { title: "Performance Optimization", description: "Improve speed, SEO and core web vitals to ensure the best user experience.", icon: "Shield" },
  { title: "Maintenance & Support", description: "Reliable maintenance, updates and support to keep your application running smoothly.", icon: "Compass" },
  { title: "Consultation", description: "Get expert advice on your project idea, tech stack and best development approach.", icon: "User" },
];

const PROCESS = [
  { step: "01", title: "Discovery", desc: "Understanding your goals, requirements and target audience." },
  { step: "02", title: "Design", desc: "Planning, wireframing and designing the perfect user experience." },
  { step: "03", title: "Develop", desc: "Writing clean, efficient and scalable code using best practices." },
  { step: "04", title: "Deploy", desc: "Testing, deploying and launching your project to the world." },
];

export default async function ServicesPage() {
  let services = FALLBACK;
  try {
    const fromDb = await getPublishedServices();
    if (fromDb.length > 0) {
      services = fromDb.map((s) => ({ title: s.title, description: s.description, icon: s.icon || "Code2" }));
    }
  } catch { /* fallback */ }

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
          {services.map(({ icon, title, description }) => {
            const Icon = ICON_MAP[icon] || Code2;
            return (
              <div key={title} className="glass-card group p-5">
                <span className="icon-tile mb-4"><Icon className="size-5" /></span>
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                <ArrowUpRight className="mt-3 size-4 text-muted-foreground transition group-hover:text-primary" />
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-6 pb-28">
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
        <div className="mt-16 text-center">
          <Link href="/contact" className="btn-glow inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold">
            Start a project
          </Link>
        </div>
      </section>
    </>
  );
}
