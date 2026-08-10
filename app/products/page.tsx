import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Package, ArrowUpRight, Sparkles, FileCode2, BookOpen, LayoutTemplate, Music4 } from "lucide-react";

export const metadata: Metadata = {
  title: "Products — GLASSKID | Templates, kits & digital goods",
  description:
    "Digital products by GLASSKID — portfolio templates, UI kits, starter code and creative resources for developers and founders.",
  openGraph: {
    title: "Products — GLASSKID",
    description: "Templates, UI kits and digital products built by GLASSKID.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/products" },
};

const PRODUCTS = [
  { Icon: LayoutTemplate, title: "Glass Portfolio Template", price: "$39", tag: "Bestseller", desc: "The exact dark-glass portfolio you're looking at, as a clean React + Tailwind starter." },
  { Icon: FileCode2, title: "SaaS Starter Kit", price: "$79", tag: "New", desc: "Auth, billing, dashboards and emails wired up so you can ship your MVP in a weekend." },
  { Icon: Sparkles, title: "Neon UI Kit", price: "$25", desc: "120+ glassmorphic components, gradients and motion presets ready to paste in." },
  { Icon: BookOpen, title: "Ship It: Freelance Playbook", price: "$15", desc: "How I price, scope, pitch and deliver client projects from Lagos to anywhere." },
  { Icon: Music4, title: "Lo-fi Sample Pack Vol. 1", price: "$12", desc: "40 original loops and one-shots recorded in my home studio. Royalty-free." },
  { Icon: Package, title: "Everything Bundle", price: "$129", tag: "Save 30%", desc: "Every template, kit and guide above — plus every future release for a year." },
];

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Store"
        title="Digital products,"
        accent="built to ship."
        description="Templates, kits and resources I built for myself first — now packaged so you can move faster too."
      />

      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <article key={p.title} className="glass-card group p-6">
              <div className="flex items-start justify-between">
                <span className="icon-tile">
                  <p.Icon className="size-5" />
                </span>
                {p.tag && <span className="chip !text-[10px]">{p.tag}</span>}
              </div>
              <h2 className="mt-5 text-lg font-semibold">{p.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-gradient text-xl font-bold">{p.price}</span>
                <a href="/products/checkout" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                  Get it <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="glass-card mt-12 flex flex-col items-center gap-4 p-8 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="text-xl font-semibold">Need something custom instead?</h2>
            <p className="mt-1 text-sm text-muted-foreground">I take on a small number of client projects each quarter.</p>
          </div>
          <Link href="/contact" className="btn-glow inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
            Start a project
          </Link>
        </div>
      </section>
    </>
  );
}