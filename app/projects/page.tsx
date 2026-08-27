import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { getProjects } from "@/app/admin/projects/actions";
import { ProjectsPublicClient } from "./public-client";

export const metadata: Metadata = {
  title: "Projects — GLASSKID",
  description: "Web apps, platforms and experiments built by GLASSKID.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero
        eyebrow="My Work"
        title="Projects that solve problems and create"
        accent="impact."
        description="A collection of web applications, platforms and experiments I've built with passion, creativity and attention to detail."
      />
      <ProjectsPublicClient projects={projects} />
    </>
  );
}