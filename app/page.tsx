"use client";

import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { Star, Quote, Send } from "lucide-react";

const EXISTING = [
  { name: "Amara O.", role: "Founder, Nexora", text: "GLASSKID shipped our MVP in three weeks and it looked better than our Figma. Rare combination of speed and taste." },
  { name: "Tobi A.", role: "Product Lead, Grocify", text: "Communication was flawless. He treated the product like it was his own and pushed back where it mattered." },
  { name: "Chidera N.", role: "Indie Artist", text: "He built my music site and produced a record with me the same month. Genuinely two talents in one person." },
];

export default function TestifyPage() {
  const [rating, setRating] = useState(5);
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="Worked with me?"
        accent="Testify."
        description="Your words help other people trust the work. Drop an honest testimonial — it takes less than a minute."
      />

      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            className="glass-card p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <h2 className="text-xl font-semibold">Share your experience</h2>
            <p className="mt-1 text-sm text-muted-foreground">All testimonials are reviewed before publishing.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" placeholder="Jane Doe" />
              <Field label="Role / Company" placeholder="Founder, Acme" />
            </div>
            <div className="mt-4">
              <Field label="Email" type="email" placeholder="jane@acme.com" />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} star`}
                    onClick={() => setRating(n)}
                    className="rounded-md p-1 transition hover:scale-110"
                  >
                    <Star className={`size-6 ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium">Your testimonial</label>
              <textarea
                rows={5}
                required
                placeholder="What was it like working together?"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/60"
              />
            </div>

            <button type="submit" className="btn-glow mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
              {sent ? "Thank you!" : "Submit testimonial"} <Send className="size-4" />
            </button>
            {sent && <p className="mt-3 text-sm text-primary">Received — I&apos;ll review and publish it shortly.</p>}
          </form>

          <div className="space-y-4">
            <div className="chip">
              <span className="size-1.5 rounded-full bg-primary" /> Recent words
            </div>
            {EXISTING.map((t) => (
              <figure key={t.name} className="glass-card p-6">
                <Quote className="size-5 text-primary" />
                <blockquote className="mt-3 text-sm text-muted-foreground">{t.text}</blockquote>
                <figcaption className="mt-4 text-sm font-semibold">
                  {t.name} <span className="font-normal text-muted-foreground">— {t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, type = "text", placeholder }: { label: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <input
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/60"
      />
    </div>
  );
}