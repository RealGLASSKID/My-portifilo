import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects } from "@/app/admin/projects/actions";
import { ImageCarousel } from "@/components/ImageCarousel";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project" };
  return {
    title: `${project.name} — THEREALGLASSKID`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const sections = [
    { n: "01", title: "The problem", body: project.problem },
    { n: "02", title: "The approach", body: project.approach },
    { n: "03", title: "Key decisions", body: project.decisions },
    { n: "04", title: "The result", body: project.result },
  ].filter((s) => s.body);

  // Main image + gallery → carousel
  const slides = [
    ...(project.imageUrl ? [project.imageUrl] : []),
    ...((project.gallery || []).filter((u) => u && u !== project.imageUrl)),
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-8 sm:px-6">
      <Link
        href="/projects"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
      >
        <ArrowLeft className="size-4" /> All projects
      </Link>

      <div className="chip mb-4">Case study · {project.slug}</div>
      <h1 className="text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-tight">{project.name}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{project.description}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.tags?.map((t) => (
          <span
            key={t}
            className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Live site <ExternalLink className="size-4" />
          </a>
        ) : null}
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost-glass inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
          >
            <Github className="size-4" /> GitHub
          </a>
        ) : null}
        <span className="inline-flex items-center rounded-xl border border-white/10 px-3 py-2 text-xs text-muted-foreground">
          {project.status || "Live"} · {project.category}
        </span>
      </div>

      <div className="mt-10">
        <ImageCarousel images={slides} alt={project.name} autoPlayMs={5500} />
      </div>

      <div className="mt-14 space-y-12">
        {sections.map((s) => (
          <section key={s.n}>
            <div className="text-xs font-semibold tracking-widest text-primary">{s.n}</div>
            <h2 className="mt-2 text-2xl font-bold">{s.title}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground whitespace-pre-line">{s.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-16">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Back to all projects
        </Link>
      </div>
    </div>
  );
}
