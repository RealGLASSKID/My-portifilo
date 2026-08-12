"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase-admin";

const COLLECTION = "music";

const MusicSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  type: z.enum(["Single", "Single", "Album"]).default("Single"),
  year: z.string().min(4),
  streams: z.string().default("0"),
  tag: z.string().optional().default(""),
  coverUrl: z.string().optional().default(""),
  audioUrl: z.string().optional().default(""),
  lyrics: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export type MusicInput = z.infer<typeof MusicSchema>;
export type MusicRelease = MusicInput & { id: string; createdAt: number; updatedAt: number };

export async function getMusicReleases(): Promise<MusicRelease[]> {
  const snapshot = await db.collection(COLLECTION).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as MusicRelease);
}

export async function getPublishedMusic(): Promise<MusicRelease[]> {
  try {
    const snapshot = await db.collection(COLLECTION).where("published", "==", true).orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as MusicRelease);
  } catch {
    const all = await getMusicReleases();
    return all.filter((r) => r.published !== false);
  }
}

export async function getMusicBySlug(slug: string): Promise<MusicRelease | null> {
  const snapshot = await db.collection(COLLECTION).where("slug", "==", slug).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as MusicRelease;
}

export async function createMusicRelease(input: MusicInput) {
  const parsed = MusicSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const now = Date.now();
  const ref = await db.collection(COLLECTION).add({ ...parsed.data, createdAt: now, updatedAt: now });
  revalidatePath("/admin/music");
  revalidatePath("/music");
  return { success: true as const, id: ref.id };
}

export async function updateMusicRelease(id: string, input: Partial<MusicInput>) {
  const parsed = MusicSchema.partial().safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid" };
  await db.collection(COLLECTION).doc(id).update({ ...parsed.data, updatedAt: Date.now() });
  revalidatePath("/admin/music");
  revalidatePath("/music");
  return { success: true as const };
}

export async function deleteMusicRelease(id: string) {
  await db.collection(COLLECTION).doc(id).delete();
  revalidatePath("/admin/music");
  revalidatePath("/music");
  return { success: true as const };
}

export async function seedMusicReleases() {
  const existing = await db.collection(COLLECTION).limit(1).get();
  if (!existing.empty) return { success: false as const, error: "Music already exists." };
  const defaults = [
    { title: "AdoptedDreams", slug: "broken-dreams", type: "Single", year: "2024", streams: "18.2K", tag: "NEW", coverUrl: "", audioUrl: "", lyrics: ["Walking through the shadows of what used to be", "Adopteddreams still teach me how to fly"], featured: true, published: true },
    { title: "FreezingNights", slug: "lagos-nights", type: "Single", year: "2024", streams: "42.7K", tag: "", coverUrl: "", audioUrl: "", lyrics: ["City lights and late-night freestyles"], featured: true, published: true },
    { title: "Survive of Pain", slug: "Survive-of-pain", type: "Single", year: "2023", streams: "9.4K", tag: "", coverUrl: "", audioUrl: "", lyrics: ["Putting the Survive back together"], featured: false, published: true },
    { title: "Seperate Ways", slug: "never-settle", type: "Single", year: "2023", streams: "31.1K", tag: "", coverUrl: "", audioUrl: "", lyrics: ["Ambition over comfort"], featured: false, published: true },
  ];
  const now = Date.now();
  const batch = db.batch();
  defaults.forEach((r, i) => {
    const ref = db.collection(COLLECTION).doc();
    batch.set(ref, { ...r, createdAt: now - i * 1000, updatedAt: now - i * 1000 });
  });
  await batch.commit();
  revalidatePath("/admin/music");
  revalidatePath("/music");
  return { success: true as const, count: defaults.length };
}
