"use client";
import { submitContactMessage } from "@/app/admin/messages/actions";
import { PageHero } from "@/components/PageHero";
import { Mail, Phone, MapPin, Clock, Send, Calendar, Shield } from "lucide-react";
import { useState, type ReactNode } from "react";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Add a short subject"),
  message: z.string().min(10, "Tell me a bit more (10+ chars)").max(1000),
});

const CARDS = [
  { Icon: Mail, title: "Email Me", lines: ["hello@glasskid.dev", "I usually reply within a few hours."] },
  { Icon: Phone, title: "Call Me", lines: ["+234 813 123 4567", "Mon–Fri, 9AM–6PM WAT"] },
  { Icon: MapPin, title: "Location", lines: ["Lagos, Nigeria", "Available for remote work worldwide."] },
  { Icon: Clock, title: "Response Time", lines: ["Within 24 hours", "I value your time and always respond fast."] },
];

export default function ContactPage() {
  const [state, setState] = useState<{ ok?: boolean; err?: Record<string, string> }>({});
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });

  const [sending, setSending] = useState(false);

const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const err: Record<string, string> = {};
    parsed.error.issues.forEach((i) => {
      err[String(i.path[0])] = i.message;
    });
    setState({ err });
    return;
  }

  setSending(true);
  setState({});
  const result = await submitContactMessage({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    body: parsed.data.message,
  });
  setSending(false);

  if (!result.success) {
    setState({ err: { message: result.error } });
    return;
  }

  setState({ ok: true });
  setValues({ name: "", email: "", subject: "", message: "" });
};

  return (
    <>
      <PageHero
        eyebrow="Let's connect"
        title="Let's Build Something"
        accent="Amazing Together."
        description="Have a project in mind or just want to say hello? Fill out the form or reach out using any of the options below."
      >
        <div className="flex flex-wrap gap-3">
          <a href="#form" className="btn-glow inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
            <Send className="size-4" /> Send Message
          </a>
          <a href="#" className="btn-ghost-glass inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
            <Calendar className="size-4" /> Schedule a Call
          </a>
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map(({ Icon, title, lines }) => (
            <div key={title} className="glass-card p-5">
              <div className="flex items-start gap-3">
                <span className="icon-tile">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{title}</h3>
                  {lines.map((l, i) => (
                    <p key={i} className={`mt-0.5 text-sm ${i === 0 ? "text-foreground" : "text-muted-foreground"}`}>
                      {l}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="form" className="mx-auto mt-10 max-w-6xl px-6 pb-28">
        <div className="glass-card p-6 md:p-8">
          <div className="chip mb-3">
            <span className="size-1.5 rounded-full bg-primary" /> Send me a message
          </div>
          <h2 className="text-2xl font-bold md:text-3xl">
            Write Your <span className="text-gradient">Message</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">Fill out the form and I&apos;ll get back to you as soon as possible.</p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Your Name" error={state.err?.name}>
                <input
                  value={values.name}
                  onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                  placeholder="John Doe"
                  className="input"
                />
              </Field>
              <Field label="Your Email" error={state.err?.email}>
                <input
                  value={values.email}
                  onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                  placeholder="john@example.com"
                  className="input"
                />
              </Field>
            </div>
            <Field label="Subject" error={state.err?.subject}>
              <input
                value={values.subject}
                onChange={(e) => setValues((v) => ({ ...v, subject: e.target.value }))}
                placeholder="How can I help you?"
                className="input"
              />
            </Field>
            <Field label="Message" error={state.err?.message}>
              <textarea
                value={values.message}
                onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                rows={6}
                maxLength={1000}
                placeholder="Tell me about your project…"
                className="input resize-none"
              />
              <div className="mt-1 text-right text-[11px] text-muted-foreground">{values.message.length} / 1000</div>
            </Field>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button type="submit" className="btn-glow inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold" disabled={sending}>
                <Send className="size-4" /> Send Message
              </button>
              <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="size-4 text-primary" /> Your information is safe and will never be shared.
              </p>
            </div>

            {state.ok && (
              <div className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-foreground">
                Thanks — your message has been received. I&apos;ll get back to you shortly.
              </div>
            )}
          </form>
        </div>
      </section>

      <style>{`
        .input {
          width: 100%;
          background: oklch(1 0 0 / 0.04);
          border: 1px solid oklch(1 0 0 / 0.1);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: var(--foreground);
          font-size: 0.875rem;
          outline: none;
          transition: border-color .25s ease, box-shadow .25s ease;
        }
        .input::placeholder { color: var(--muted-foreground); }
        .input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px oklch(0.65 0.24 295 / 0.15); }
      `}</style>
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}