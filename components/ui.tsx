import { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  center = true,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-14 ${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="h2 mt-4">{title}</h2>
      {description && <p className="mt-4 text-muted">{description}</p>}
    </div>
  );
}

export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`glass glass-hover p-6 ${className}`}>{children}</div>;
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-3xl font-bold text-primary-light sm:text-4xl">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
