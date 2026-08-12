"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase-admin";
import cloudinary from "@/lib/cloudinary";

const COLLECTION = "projects";

const ProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers and hyphens only"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().url().or(z.literal("")).default(""),
  imagePublicId: z.string().default(""),
  liveUrl: z.union([z.string().url(), z.literal("")]).optional().default(""),
  githubUrl: z.union([z.string().url(), z.literal("")]).optional().default(""),
  featured: z.boolean().default(false),
  // Case study (detail page)
  problem: z.string().default(""),
  approach: z.string().default(""),
  decisions: z.string().default(""),
  result: z.string().default(""),
  status: z.string().default("Live"), // Live | In progress | Archive
  gallery: z.array(z.string().url()).default([]), // extra image URLs
});

export type ProjectInput = z.infer<typeof ProjectSchema>;

export type Project = ProjectInput & {
  id: string;
  createdAt: number;
  updatedAt: number;
};

export async function getProjects(): Promise<Project[]> {
  const snapshot = await db.collection(COLLECTION).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Project);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const snapshot = await db.collection(COLLECTION).where("slug", "==", slug).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Project;
}

export async function createProject(
  input: ProjectInput
): Promise<{ success: true; id: string } | { success: false; error: string }> {
  const parsed = ProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const now = Date.now();
  const ref = await db.collection(COLLECTION).add({
    ...parsed.data,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath(`/projects/${parsed.data.slug}`);
  return { success: true, id: ref.id };
}

export async function updateProject(
  id: string,
  input: Partial<ProjectInput>
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = ProjectSchema.partial().safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db
    .collection(COLLECTION)
    .doc(id)
    .update({ ...parsed.data, updatedAt: Date.now() });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  if (parsed.data.slug) revalidatePath(`/projects/${parsed.data.slug}`);
  return { success: true };
}

export async function deleteProject(
  id: string
): Promise<{ success: true } | { success: false; error: string }> {
  const docRef = db.collection(COLLECTION).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return { success: false, error: "Project not found" };

  const data = doc.data();
  if (data?.imagePublicId) {
    await cloudinary.uploader.destroy(data.imagePublicId).catch(() => {});
  }
  await docRef.delete();

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { success: true };
}

/** One-time seed — call from admin or a script */
export async function seedDefaultProjects(): Promise<{ success: true; count: number } | { success: false; error: string }> {
  const existing = await db.collection(COLLECTION).limit(1).get();
  if (!existing.empty) {
    return { success: false, error: "Projects already exist. Delete them first if you want to re-seed." };
  }

  const now = Date.now();
  const batch = db.batch();

  SEED_PROJECTS.forEach((p, i) => {
    const ref = db.collection(COLLECTION).doc();
    batch.set(ref, {
      ...p,
      imageUrl: p.imageUrl || "",
      imagePublicId: "",
      gallery: p.gallery || [],
      createdAt: now - i * 1000,
      updatedAt: now - i * 1000,
    });
  });

  await batch.commit();
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { success: true, count: SEED_PROJECTS.length };
}

const SEED_PROJECTS: ProjectInput[] = [
  {
    name: "SiteNix",
    slug: "sitenix",
    category: "SaaS",
    description:
      "A visual website builder with AI-assisted content generation, reusable components, and a responsive editing experience for creating and publishing modern websites.",
    tags: ["TypeScript", "React", "Next.js", "Firebase", "Tailwind CSS", "Zustand", "Groq AI", "Cloudinary"],
    imageUrl: "",
    imagePublicId: "",
    liveUrl: "https://sitenix.app",
    githubUrl: "",
    featured: true,
    status: "Live",
    problem:
      "Traditional website builders often trade flexibility for simplicity or overwhelm users with complex editing interfaces. We wanted a visual editor that feels approachable while still giving precise control.",
    approach:
      "Built a component-based visual editor where every website is a JSON node tree. Supports reusable components, responsive layouts, live editing, and AI-assisted content generation.",
    decisions:
      "JSON node architecture instead of HTML templates for serialization, undo/redo, and dynamic data. Firebase for auth and persistence so effort stayed on the editor experience.",
    result:
      "Scalable visual editing platform with reusable components, live previews, AI content, and one-click publishing. Collaborated with David Onyema (dskyle77).",
    gallery: [],
  },
  {
    name: "Benzene Plus Academy",
    slug: "benzene-plus-academy",
    category: "Web Apps",
    description:
      "Full-stack enrollment platform and CMS for a JAMB, WAEC & NECO tutorial academy in Lagos — built to convert visiting parents into registered students.",
    tags: ["TypeScript", "Next.js", "Tailwind CSS", "Firebase"],
    imageUrl: "",
    imagePublicId: "",
    liveUrl: "https://benzene-plus-academy.vercel.app/",
    githubUrl: "",
    featured: true,
    status: "Live",
    problem:
      "An academy competing for trust needs a credible, high-converting site with proof of results, clear programs, and easy onboarding — plus an internal tool for staff to update records without code.",
    approach:
      "Public storefront focused on trust (stats, testimonials, exam breakdowns) plus a secure admin dashboard for blogs and top-scorer metrics.",
    decisions:
      "Firebase admin for non-technical staff. Registrations via WhatsApp deep links to reduce friction for Nigerian parents.",
    result:
      "Live academy site with self-serve content updates and an active inquiry pipeline. Collaborated with David Onyema (dskyle77).",
    gallery: [],
  },
  {
    name: "Nexora",
    slug: "nexora",
    category: "SaaS",
    description: "Modern SaaS platform for managing projects, teams and analytics in one place.",
    tags: ["Next.js", "TypeScript", "Tailwind", "PostgreSQL"],
    imageUrl: "",
    imagePublicId: "",
    liveUrl: "",
    githubUrl: "",
    featured: true,
    status: "Live",
    problem: "Teams juggle scattered tools for projects, people, and metrics.",
    approach: "Unified dashboard with projects, team roles, and analytics widgets.",
    decisions: "Next.js App Router + typed APIs for speed and maintainability.",
    result: "Clean SaaS foundation ready for real teams and metrics.",
    gallery: [],
  },
  {
    name: "Grocify",
    slug: "grocify",
    category: "E-Commerce",
    description: "E-commerce platform for fresh groceries with real-time inventory and delivery.",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    imageUrl: "",
    imagePublicId: "",
    liveUrl: "",
    githubUrl: "",
    featured: true,
    status: "Live",
    problem: "Grocery shoppers need fast browse, stock truth, and reliable delivery slots.",
    approach: "Catalog + cart + inventory-aware checkout with delivery windows.",
    decisions: "MongoDB for flexible product data; real-time stock checks at checkout.",
    result: "End-to-end grocery flow from browse to delivery booking.",
    gallery: [],
  },
  {
    name: "Echoes",
    slug: "echoes",
    category: "Music",
    description: "Music streaming platform for emerging artists and music lovers.",
    tags: ["Next.js", "Firebase", "Tailwind", "Howler.js"],
    imageUrl: "",
    imagePublicId: "",
    liveUrl: "",
    githubUrl: "",
    featured: true,
    status: "Live",
    problem: "Emerging artists lack a simple place to publish and be discovered.",
    approach: "Stream-focused UI with artist profiles, playlists, and audio playback.",
    decisions: "Firebase for auth/storage; Howler.js for reliable web audio.",
    result: "Lightweight streaming experience aimed at independents.",
    gallery: [],
  },
  {
    name: "StudyFlow",
    slug: "studyflow",
    category: "Web Apps",
    description: "Student productivity and collaboration tool with task management and file sharing.",
    tags: ["React", "TypeScript", "Firebase"],
    imageUrl: "",
    imagePublicId: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
    status: "Live",
    problem: "Students lose track of tasks and shared files across chats and drives.",
    approach: "Tasks, groups, and file sharing in one focused workspace.",
    decisions: "Firebase for realtime sync between study groups.",
    result: "Simple collab hub for coursework and group projects.",
    gallery: [],
  },
  {
    name: "Devfolio Template",
    slug: "devfolio-template",
    category: "UI/UX",
    description: "A modern, customizable portfolio template for developers.",
    tags: ["Next.js", "Tailwind", "MDX"],
    imageUrl: "",
    imagePublicId: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
    status: "Live",
    problem: "Developers need a polished portfolio without designing from zero.",
    approach: "Composable sections, MDX content, and theme-friendly layout.",
    decisions: "MDX for content speed; Tailwind for easy restyling.",
    result: "Ready-to-fork portfolio shell for ship-ready personal sites.",
    gallery: [],
  },
  {
    name: "FinTrack",
    slug: "fintrack",
    category: "Web Apps",
    description: "Personal finance tracker to manage income, expenses and savings.",
    tags: ["React", "Chart.js", "Node.js"],
    imageUrl: "",
    imagePublicId: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
    status: "Live",
    problem: "People lose sight of where money goes each month.",
    approach: "Income/expense logging with category charts and savings goals.",
    decisions: "Chart.js for clear visuals; simple API for transactions.",
    result: "Clear monthly picture of cash flow and goals.",
    gallery: [],
  },
  {
    name: "Cherry Noble School",
    slug: "cherry-noble-school",
    category: "Web Apps",
    description:
      "School website and information platform for Cherry Noble School — programs, admissions, and school life in one place.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Firebase"],
    imageUrl: "",
    imagePublicId: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
    status: "Live",
    problem: "Parents need clear, trustworthy school information and an easy path to inquire or apply.",
    approach: "Public site for programs and life at school, with contact/admissions pathways.",
    decisions: "Content-first structure so staff can keep pages current.",
    result: "Professional school presence focused on clarity for parents.",
    gallery: [],
  },
];