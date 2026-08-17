import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "All Links — THEREALGLASSKID",
  description: "Every page, product and profile — one tidy index of the THEREALGLASSKID universe.",
  openGraph: {
    title: "All Links — THEREALGLASSKID",
    description: "Complete list of pages and permalinks across THEREALGLASSKID.",
    type: "website",
  },
  alternates: { canonical: "/links" },
};

type LinkItem = { to: string; label: string; desc: string; external?: boolean };

const GROUPS: { title: string; items: LinkItem[] }[] = [
  {
    title: "Main",
    items: [
      { to: "/", label: "Home", desc: "Main homepage" },
      { to: "/about", label: "About", desc: "The mind behind the code & music" },
      { to: "/projects", label: "Projects", desc: "Portfolio of completed work" },
      { to: "/blog", label: "Blog", desc: "Notes, essays and technical deep-dives" },
      { to: "/music", label: "Music", desc: "Songs, releases and studio drops" },
    ],
  },
  {
    title: "Products & Services",
    items: [
      { to: "/services", label: "Services", desc: "Full stack, UI/UX, SaaS and consultation" },
      { to: "/products", label: "Products", desc: "Templates, UI kits and digital downloads" },
      { to: "/web-developer-in-nigeria", label: "Web Developer in Nigeria", desc: "Hire me — packages, pricing and FAQs" },
      { to: "/contact", label: "Contact", desc: "Start a project or say hello" },
    ],
  },
  {
    title: "Personal",
    items: [
      { to: "/bucket-list", label: "Bucket List", desc: "Goals, adventures & personal milestones" },
      { to: "/streaks", label: "Streaks", desc: "Habits I'm tracking publicly" },
      { to: "/testify", label: "Testify", desc: "Leave a testimonial about working with me" },
    ],
  },
  {
    title: "Legal",
    items: [{ to: "/terms", label: "Terms & Conditions", desc: "How this site and my services may be used" }],
  },
  {
    title: "Social",
    items: [
      { to: "https://github.com/", label: "GitHub", desc: "Code, repos and open source", external: true },
      { to: "https://x.com/", label: "X / Twitter", desc: "Thoughts in real time", external: true },
      { to: "https://instagram.com/", label: "Instagram", desc: "Life & behind the scenes", external: true },
      { to: "https://open.spotify.com/", label: "Spotify", desc: "Stream the music", external: true },
    ],
  },
];

function Row({ item }: { item: LinkItem }) {
  const inner = (
    <div className="glass-card group flex items-center justify-between gap-4 p-5 transition hover:border-primary/40">
      <div>
        <div className="text-base font-semibold text-foreground">{item.label}</div>
        <div className="mt-0.5 text-sm text-muted-foreground">{item.desc}</div>
        <code className="mt-2 inline-block rounded-md bg-white/5 px-2 py-0.5 text-xs text-primary/80">
          {item.external ? "external" : item.to}
        </code>
      </div>
      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition group-hover:text-primary" />
    </div>
  );
  return item.external ? (
    <a key={item.to} href={item.to} target="_blank" rel="noreferrer">
      {inner}
    </a>
  ) : (
    <Link key={item.to} href={item.to}>
      {inner}
    </Link>
  );
}

export default function LinksPage() {
  return (
    <>
      <PageHero
        eyebrow="Index"
        title="All"
        accent="Links."
        description="Complete list of pages, products and profiles across the THEREALGLASSKID universe. Bookmark what you love."
      />
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="space-y-12">
          {GROUPS.map((g) => (
            <div key={g.title}>
              <div className="chip mb-4">
                <span className="size-1.5 rounded-full bg-primary" /> {g.title}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {g.items.map((item) => (
                  <Row key={item.to} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}