"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase-admin";
import cloudinary from "@/lib/cloudinary";
import { requireAdminOrFail } from "@/lib/require-admin";

const COLLECTION = "projects";

/** Accept full URLs or local public paths like /images/projects/foo.png */
const ImagePathSchema = z
  .string()
  .refine(
    (v) =>
      v === "" ||
      v.startsWith("/") ||
      v.startsWith("http://") ||
      v.startsWith("https://"),
    { message: "Image must be a URL or a local path starting with /" }
  );

const ProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers and hyphens only"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.string()).default([]),
  imageUrl: ImagePathSchema.default(""),
  imagePublicId: z.string().default(""),
  liveUrl: z.union([z.string().url(), z.literal("")]).optional().default(""),
  githubUrl: z.union([z.string().url(), z.literal("")]).optional().default(""),
  featured: z.boolean().default(false),
  problem: z.string().default(""),
  approach: z.string().default(""),
  decisions: z.string().default(""),
  result: z.string().default(""),
  status: z.string().default("Live"),
  /** All extra images (local paths or remote URLs). Cover is imageUrl. */
  gallery: z.array(ImagePathSchema).default([]),
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
  input: ProjectInput,
  idToken?: string | null
): Promise<{ success: true; id: string } | { success: false; error: string }> {
  const auth = await requireAdminOrFail(idToken);
  if (!auth.ok) return { success: false, error: auth.error };

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
  revalidatePath("/");
  return { success: true, id: ref.id };
}

export async function updateProject(
  id: string,
  input: Partial<ProjectInput>,
  idToken?: string | null
): Promise<{ success: true } | { success: false; error: string }> {
  const auth = await requireAdminOrFail(idToken);
  if (!auth.ok) return { success: false, error: auth.error };

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
  revalidatePath("/");
  if (parsed.data.slug) revalidatePath(`/projects/${parsed.data.slug}`);
  return { success: true };
}

export async function deleteProject(
  id: string,
  idToken?: string | null
): Promise<{ success: true } | { success: false; error: string }> {
  const auth = await requireAdminOrFail(idToken);
  if (!auth.ok) return { success: false, error: auth.error };

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
  revalidatePath("/");
  return { success: true };
}

export async function seedDefaultProjects(
  idToken?: string | null
): Promise<{ success: true; count: number } | { success: false; error: string }> {
  const auth = await requireAdminOrFail(idToken);
  if (!auth.ok) return { success: false, error: auth.error };

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
      createdAt: now - i * 1000,
      updatedAt: now - i * 1000,
    });
  });

  await batch.commit();
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  return { success: true, count: SEED_PROJECTS.length };
}

const SEED_PROJECTS: ProjectInput[] = [
  {
    name: "JB-01 Official Website",
    slug: "jb-01-official-website",
    category: "Music",
    description:
      "A modern portfolio and interactive experience built for award-winning songwriter JB-01 (The Face of Gangster Records), featuring custom scroll-driven design and responsive glassmorphism UI.",
    tags: ["Next.js", "Tailwind", "Glassmorphism", "Music"],
    imageUrl: "/images/projects/jb-01-1.png",
    imagePublicId: "",
    liveUrl: "",
    githubUrl: "",
    featured: true,
    status: "Live",
    problem: "An award-winning artist needed a premium digital presence that matched the quality of the music.",
    approach: "Music-first layout with glassmorphism UI and a cinematic feel.",
    decisions: "Modern Next.js stack focused on performance and visual polish.",
    result: "A standout official site that positions JB-01 as The Face of Gangster Records.",
    gallery: [],
  },
  {
    name: "Blaze Hair Magic",
    slug: "blaze-hair-magic",
    category: "Web Apps",
    description:
      "Modern, responsive hair studio website designed to showcase hairstyles, services, transformations, and bookings.",
    tags: ["Next.js", "Tailwind", "Responsive Design"],
    imageUrl: "/images/projects/hair-blaze-1.png",
    imagePublicId: "",
    liveUrl: "",
    githubUrl: "",
    featured: true,
    status: "Live",
    problem: "A hair studio needed a clean online presence to show work and convert visitors into clients.",
    approach: "Service pages, gallery of transformations, and clear calls-to-action for bookings.",
    decisions: "Mobile-first layout with strong visual hierarchy for styles and before/after.",
    result: "A polished studio site ready for real customer traffic.",
    gallery: ["/images/projects/hair-blaze-2.png"],
  },
  {
    name: "Grocify",
    slug: "grocify",
    category: "E-Commerce",
    description:
      "E-commerce platform for fresh groceries with real-time inventory awareness and fast delivery messaging.",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    imageUrl: "/images/projects/grocify-1.png",
    imagePublicId: "",
    liveUrl: "",
    githubUrl: "",
    featured: true,
    status: "Live",
    problem: "Grocery shoppers need fast browse, honest stock, and reliable delivery slots.",
    approach: "Catalog + cart + inventory-aware checkout with clear delivery promises.",
    decisions: "Flexible product data and real-time stock checks at checkout.",
    result: "End-to-end grocery flow from browse to delivery booking.",
    gallery: [],
  },
  {
    name: "Sunchop",
    slug: "sunchop",
    category: "Web Apps",
    description:
      "Full product experience for Sunchop — multi-screen flows, marketing pages, and app-style UI captured across the product.",
    tags: ["Next.js", "UI/UX", "Product Design"],
    imageUrl: "/images/projects/sunchop-1.png",
    imagePublicId: "",
    liveUrl: "",
    githubUrl: "",
    featured: true,
    status: "Live",
    problem: "Needed a cohesive product and marketing presence across multiple screens.",
    approach: "Designed and built a consistent multi-page experience with clear hierarchy.",
    decisions: "Screenshot-driven case study so the real product UI is the hero.",
    result: "A complete visual case study of the Sunchop product.",
    gallery: [
      "/images/projects/sunchop-2.png",
      "/images/projects/sunchop-3.png",
      "/images/projects/sunchop-4.png",
      "/images/projects/sunchop-5.png",
      "/images/projects/sunchop-6.png",
      "/images/projects/sunchop-7.png",
    ],
  },
  {
    name: "Unik Trends",
    slug: "unik-trends",
    category: "E-Commerce",
    description:
      "Fashion / trends storefront experience with product-focused layouts and modern e-commerce UI patterns.",
    tags: ["Next.js", "E-Commerce", "Tailwind"],
    imageUrl: "/images/projects/unik-trends-1.png",
    imagePublicId: "",
    liveUrl: "",
    githubUrl: "",
    featured: true,
    status: "Live",
    problem: "A trends/fashion brand needed a sharp online storefront that highlights products.",
    approach: "Product-first pages with clean grids and conversion-focused layout.",
    decisions: "Visual screenshots as the primary storytelling device for the case study.",
    result: "A polished storefront presentation ready for real catalog content.",
    gallery: [
      "/images/projects/unik-trends-2.png",
      "/images/projects/unik-trends-3.png",
      "/images/projects/unik-trends-4.png",
    ],
  },
  {
    name: "Cherry Noble School",
    slug: "cherry-noble-school",
    category: "Web Apps",
    description:
      "School website and information platform for Cherry Noble School — programs, admissions, and school life in one place.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Firebase"],
    imageUrl: "/images/projects/cherry-noble-1.png",
    imagePublicId: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
    status: "Live",
    problem: "Parents need clear, trustworthy school information and an easy path to inquire or apply.",
    approach: "Public site for programs and life at school, with contact/admissions pathways.",
    decisions: "Content-first structure so staff can keep pages current.",
    result: "Professional school presence focused on clarity for parents.",
    gallery: [
      "/images/projects/cherry-noble-2.png",
      "/images/projects/cherry-noble-3.png",
      "/images/projects/cherry-noble-4.png",
      "/images/projects/cherry-noble-5.png",
    ],
  },
  {
    name: "Di-Chies",
    slug: "di-chies",
    category: "Web Apps",
    description:
      "Brand and product web experience for Di-Chies with multi-screen layouts and polished visual presentation.",
    tags: ["Next.js", "Tailwind", "Brand Site"],
    imageUrl: "/images/projects/di-chies-1.png",
    imagePublicId: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
    status: "Live",
    problem: "Needed a modern web presence that matches the brand quality.",
    approach: "Clean multi-page layout with strong visuals and clear hierarchy.",
    decisions: "Screenshot-led case study to show the real UI.",
    result: "A complete visual package for the Di-Chies web experience.",
    gallery: ["/images/projects/di-chies-2.png", "/images/projects/di-chies-3.png"],
  },
  {
    name: "Gangster Group Bot",
    slug: "gangster-group-bot",
    category: "Web Apps",
    description:
      "WhatsApp group bot for games, moderation, XP rankings, and admin tools — built for real Nigerian group chats.",
    tags: ["Node.js", "whatsapp-web.js", "TypeScript", "Puppeteer"],
    imageUrl: "",
    imagePublicId: "",
    liveUrl: "",
    githubUrl: "",
    featured: true,
    status: "Live",
    problem: "Group chats needed structured moderation, engagement games, and ranking without manual work.",
    approach: "A relay + brain architecture with WhatsApp Web client, webhooks, and admin controls.",
    decisions: "whatsapp-web.js + Puppeteer for session handling; separate services for reliability.",
    result: "Active bot used in real Nigerian group chats with games, XP, and moderation tools.",
    gallery: [],
  },
];
