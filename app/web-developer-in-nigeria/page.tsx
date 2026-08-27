import type { Metadata } from "next";
import Link from "next/link";
import { Check, MapPin, Rocket, ShieldCheck, Timer, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Web Developer in Nigeria | Hire GLASSKID (Lagos)",
  description:
    "Looking for a reliable web developer in Nigeria? GLASSKID builds fast, modern websites and web apps for businesses in Lagos, Abuja, Port Harcourt and beyond.",
  openGraph: {
    title: "Web Developer in Nigeria | Hire GLASSKID",
    description: "Fast, modern websites and web apps built for Nigerian businesses by a Lagos-based full stack developer.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/web-developer-in-nigeria" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "GLASSKID — Web Developer in Nigeria",
  description: "Full stack web development, UI/UX design and SaaS engineering for businesses in Nigeria.",
  areaServed: "Nigeria",
  address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
  email: "glasskid01@gmail.com",
};

const CITIES = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Enugu", "Kano", "Benin City", "Remote / Diaspora"];

const WHY = [
  { Icon: Timer, title: "Shipped in weeks, not months", desc: "Most business sites go live in 2–3 weeks. SaaS MVPs in 4–8." },
  { Icon: ShieldCheck, title: "Built to be owned by you", desc: "Clean code, your domain, your hosting, full handover. No lock-in." },
  { Icon: Rocket, title: "Fast on Nigerian networks", desc: "Optimised images, lean bundles and caching so it loads on 3G too." },
  { Icon: MapPin, title: "Local context, global standard", desc: "Paystack/Flutterwave, WhatsApp, local SEO — with world-class craft." },
];

const OFFERS = [
  { title: "Business Website", price: "from ₦350,000", points: ["5–8 pages", "Mobile-first design", "Local SEO setup", "WhatsApp & contact forms"] },
  { title: "E-commerce / Booking", price: "from ₦750,000", points: ["Product or service catalogue", "Paystack / Flutterwave", "Order dashboard", "Email notifications"] },
  { title: "SaaS / Web App", price: "from ₦1,500,000", points: ["Auth & user accounts", "Database & dashboards", "Subscriptions & billing", "Ongoing support"] },
];

const FAQ = [
  { q: "How much does a website cost in Nigeria?", a: "A quality business website typically ranges from ₦350,000 to ₦1,000,000 depending on pages, custom design and integrations. You get a fixed quote before anything starts." },
  { q: "How long does it take?", a: "A standard business website takes 2–3 weeks. E-commerce takes 3–5 weeks, and custom web apps 6–12 weeks depending on scope." },
  { q: "Do you work with clients outside Lagos?", a: "Yes. I work remotely with clients across Nigeria and internationally, with regular calls and shared progress previews." },
  { q: "Will I be able to update the site myself?", a: "Yes. Every site ships with a simple admin area or CMS so you can edit content without touching code." },
];

export default function NigeriaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow="Hire me"
        title="Web Developer"
        accent="in Nigeria."
        description="I'm Prince Dennis (GLASSKID) — a Lagos-based full stack developer building fast, modern websites and web apps for Nigerian businesses and founders."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="btn-glow inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
            Get a free quote <ArrowRight className="size-4" />
          </Link>
          <Link href="/projects" className="btn-ghost-glass inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
            See past work
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map(({ Icon, title, desc }) => (
            <div key={title} className="glass-card p-6">
              <span className="icon-tile mb-4">
                <Icon className="size-5" />
              </span>
              <h2 className="text-base font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-6">
        <div className="chip mb-3">
          <span className="size-1.5 rounded-full bg-primary" /> Packages
        </div>
        <h2 className="text-2xl font-bold md:text-3xl">
          Transparent <span className="text-gradient">pricing</span>
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {OFFERS.map((o) => (
            <div key={o.title} className="glass-card p-6">
              <h3 className="text-lg font-semibold">{o.title}</h3>
              <div className="text-gradient mt-1 text-2xl font-bold">{o.price}</div>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {o.points.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-6">
        <div className="chip mb-3">
          <span className="size-1.5 rounded-full bg-primary" /> Coverage
        </div>
        <h2 className="text-2xl font-bold md:text-3xl">
          Where I <span className="text-gradient">work</span>
        </h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {CITIES.map((c) => (
            <span key={c} className="chip">
              <MapPin className="size-3 text-primary" /> {c}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl px-6 pb-24">
        <div className="chip mb-3">
          <span className="size-1.5 rounded-full bg-primary" /> FAQ
        </div>
        <h2 className="text-2xl font-bold md:text-3xl">
          Common <span className="text-gradient">questions</span>
        </h2>
        <div className="mt-8 space-y-4">
          {FAQ.map((f) => (
            <details key={f.q} className="glass-card group p-5">
              <summary className="cursor-pointer list-none text-base font-semibold">{f.q}</summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}