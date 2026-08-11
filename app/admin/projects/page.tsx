import { getProjects } from "./actions";
import { ProjectsClient } from "./projects-client";

export const dynamic = "force-dynamic"; // always show latest data, never cache this admin view

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  return <ProjectsClient initialProjects={projects} />;
}