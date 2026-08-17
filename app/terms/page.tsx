import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Terms & Conditions — THEREALGLASSKID",
  description: "The terms and conditions that govern the use of the THEREALGLASSKID website and services.",
  openGraph: {
    title: "Terms & Conditions — THEREALGLASSKID",
    description: "Terms governing use of the THEREALGLASSKID website and services.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/terms" },
};

const SECTIONS = [
  {
    title: "1. Acceptance of terms",
    body: "By accessing or using this website you agree to be bound by these terms. If you do not agree with any part of them, please discontinue use of the site.",
  },
  {
    title: "2. Use of the website",
    body: "You may browse, read and share content from this site for personal, non-commercial purposes. You may not use the site for anything unlawful, or attempt to disrupt, probe or reverse engineer any part of it.",
  },
  {
    title: "3. Intellectual property",
    body: "All content on this site — including code samples, written articles, designs, music, artwork and the THEREALGLASSKID name — belongs to Prince Dennis unless stated otherwise. Reproducing or redistributing it commercially without written permission is not allowed.",
  },
  {
    title: "4. Client work & projects",
    body: "Project scope, timelines, payment schedules and ownership of deliverables are agreed separately in writing before work begins. Nothing on this website constitutes a binding offer or contract on its own.",
  },
  {
    title: "5. Payments & refunds",
    body: "Unless otherwise agreed, projects require a deposit before work starts. Deposits cover time already reserved and committed and are generally non-refundable once work has commenced.",
  },
  {
    title: "6. Third-party links & services",
    body: "This site links to external platforms such as GitHub, Spotify and social networks. I am not responsible for the content, policies or availability of those third-party services.",
  },
  {
    title: "7. Music & media",
    body: "Songs, lyrics and recordings published here are for personal listening. Sampling, remixing, sync licensing or commercial use requires prior written clearance.",
  },
  {
    title: "8. Disclaimer",
    body: 'Content is provided "as is" for informational purposes. While I aim for accuracy, I make no warranty that tutorials, code or advice on this site will be error-free or suitable for your specific case.',
  },
  {
    title: "9. Limitation of liability",
    body: "To the fullest extent permitted by law, I am not liable for any indirect or consequential loss arising from your use of this website or reliance on its content.",
  },
  {
    title: "10. Changes to these terms",
    body: "These terms may be updated from time to time. Continued use of the site after changes are posted means you accept the revised terms.",
  },
  {
    title: "11. Contact",
    body: "Questions about these terms? Reach out at glasskid01@gmail.com and I'll respond as soon as I can.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms &"
        accent="Conditions."
        description="Plain-language terms covering how this website, its content and my services may be used."
      />

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="glass-card p-6 md:p-10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Last updated: July 2026</p>
          <div className="mt-8 space-y-8">
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <h2 className="text-lg font-semibold text-foreground">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}