import type { MetadataRoute } from "next";
import { getProjects } from "@/app/admin/projects/actions";
import { getPublishedMusic } from "@/app/admin/music/actions";
import { getAllSlugs } from "@/lib/blog";

const BASE_URL = "https://glasskid.vercel.app";

const STATIC_ROUTES = [
  { path: "", priority: 1, freq: "weekly" as const },
  { path: "/about", priority: 0.8, freq: "monthly" as const },
  { path: "/projects", priority: 0.9, freq: "weekly" as const },
  { path: "/services", priority: 0.7, freq: "monthly" as const },
  { path: "/music", priority: 0.8, freq: "weekly" as const },
  { path: "/blog", priority: 0.8, freq: "weekly" as const },
  { path: "/gallery", priority: 0.6, freq: "monthly" as const },
  { path: "/products", priority: 0.6, freq: "monthly" as const },
  { path: "/testify", priority: 0.5, freq: "monthly" as const },
  { path: "/links", priority: 0.5, freq: "monthly" as const },
  { path: "/contact", priority: 0.7, freq: "monthly" as const },
  { path: "/web-developer-in-nigeria", priority: 0.8, freq: "monthly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, music] = await Promise.all([
    getProjects().catch(() => []),
    getPublishedMusic().catch(() => []),
  ]);
  const blogSlugs = getAllSlugs();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    changeFrequency: r.freq,
    priority: r.priority,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const musicEntries: MetadataRoute.Sitemap = music.flatMap((m) => [
    { url: `${BASE_URL}/music/${m.slug}`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/music/${m.slug}/lyrics`, changeFrequency: "monthly" as const, priority: 0.5 },
  ]);

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...projectEntries, ...musicEntries, ...blogEntries];
}
