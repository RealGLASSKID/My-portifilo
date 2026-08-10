import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  accent,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-8">
      <div
        className="pointer-events-none absolute inset-x-0 -top-20 mx-auto h-72 w-[80%] blur-3xl"
        style={{ background: "var(--gradient-radial-glow)" }}
      />
      <div className="animate-fade-up">
        <span className="chip">
          <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--neon)]" />
          {eyebrow}
        </span>
        <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          {title} {accent && <span className="text-gradient">{accent}</span>}
        </h1>
        {description && <p className="mt-5 max-w-2xl text-muted-foreground md:text-lg">{description}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}