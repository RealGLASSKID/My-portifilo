"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase-admin";

const COLLECTION = "blog";

const BlogSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers and hyphens only"),
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  read: z.string().default("5 min"),
  excerpt: z.string().default(""),
  content: z.array(z.string()).default([]),
  published: z.boolean().default(true),
  coverUrl: z.string().optional().default(""),
});

export type BlogInput = z.infer<typeof BlogSchema>;
export type BlogPost = BlogInput & { id: string; createdAt: number; updatedAt: number };

export async function getBlogPosts(): Promise<BlogPost[]> {
  const snapshot = await db.collection(COLLECTION).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as BlogPost);
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  try {
    const snapshot = await db.collection(COLLECTION).where("published", "==", true).orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as BlogPost);
  } catch {
    const all = await getBlogPosts();
    return all.filter((p) => p.published !== false);
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const snapshot = await db.collection(COLLECTION).where("slug", "==", slug).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as BlogPost;
}

export async function createBlogPost(input: BlogInput) {
  const parsed = BlogSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const now = Date.now();
  const ref = await db.collection(COLLECTION).add({ ...parsed.data, createdAt: now, updatedAt: now });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);
  return { success: true as const, id: ref.id };
}

export async function updateBlogPost(id: string, input: Partial<BlogInput>) {
  const parsed = BlogSchema.partial().safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  await db.collection(COLLECTION).doc(id).update({ ...parsed.data, updatedAt: Date.now() });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (parsed.data.slug) revalidatePath(`/blog/${parsed.data.slug}`);
  return { success: true as const };
}

export async function deleteBlogPost(id: string) {
  await db.collection(COLLECTION).doc(id).delete();
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true as const };
}

export async function seedBlogPosts() {
  const existing = await db.collection(COLLECTION).limit(1).get();
  if (!existing.empty) return { success: false as const, error: "Blog posts already exist." };
  const { posts } = await import("@/lib/blog");
  const now = Date.now();
  const batch = db.batch();
  posts.forEach((p, i) => {
    const ref = db.collection(COLLECTION).doc();
    batch.set(ref, {
      slug: p.slug, title: p.title, category: p.category, date: p.date, read: p.read,
      excerpt: p.excerpt, content: p.content, published: true, coverUrl: "",
      createdAt: now - i * 1000, updatedAt: now - i * 1000,
    });
  });
  await batch.commit();
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true as const, count: posts.length };
}
