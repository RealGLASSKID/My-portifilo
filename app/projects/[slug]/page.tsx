import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects } from "@/app/admin/projects/actions";
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
    title: `${project.name} — GLASSKID`,
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

  return (
    <div className="mx-auto max-w-3xl px-6 pb-28 pt-8">
      <Link
        href="/projects"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
      >
        <ArrowLeft className="size-4" /> All projects
      </Link>

      <div className="chip mb-4">Case study · {project.slug}</div>
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{project.name}</h1>
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

      {project.imageUrl ? (
        <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
          <Image
            src={project.imageUrl}
            alt={project.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      ) : null}

      <div className="mt-14 space-y-12">
        {sections.map((s) => (
          <section key={s.n}>
            <div className="text-xs font-semibold tracking-widest text-primary">{s.n}</div>
            <h2 className="mt-2 text-2xl font-bold">{s.title}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{s.body}</p>
          </section>
        ))}
      </div>

      {project.gallery?.length > 0 && (
        <div className="mt-14">
          <h2 className="text-2xl font-bold">Gallery</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {project.gallery.map((url, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10"
              >
                <Image src={url} alt="" fill className="object-cover" sizes="50vw" />
              </div>
            ))}
          </div>
        </div>
      )}

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