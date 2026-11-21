"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase-admin";
import { requireAdminOrFail } from "@/lib/require-admin";

const COLLECTION = "popups";

const PopupSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().default(""),
  mediaType: z.enum(["image", "video", "none"]).default("none"),
  mediaUrl: z.string().default(""),
  buttonLabel: z.string().default(""),
  buttonUrl: z.string().default(""),
  secondaryLabel: z.string().default(""),
  secondaryUrl: z.string().default(""),
  enabled: z.boolean().default(true),
  delaySeconds: z.number().min(0).max(120).default(8),
  cooldownDays: z.number().min(0).max(365).default(1),
  pages: z.enum(["home", "all"]).default("all"),
  locked: z.boolean().default(false),
  sortOrder: z.number().default(0),
});

export type PopupInput = z.infer<typeof PopupSchema>;
export type PopupAd = PopupInput & {
  id: string;
  createdAt: number;
  updatedAt: number;
};

export async function getPopups(): Promise<PopupAd[]> {
  const snapshot = await db.collection(COLLECTION).orderBy("sortOrder", "asc").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as PopupAd);
}

export async function getActivePopups(): Promise<PopupAd[]> {
  try {
    const all = await getPopups();
    return all.filter((p) => p.enabled !== false);
  } catch {
    return [];
  }
}

export async function createPopup(
  input: PopupInput,
  idToken?: string | null
): Promise<{ success: true; id: string } | { success: false; error: string }> {
  const auth = await requireAdminOrFail(idToken);
  if (!auth.ok) return { success: false, error: auth.error };
  const parsed = PopupSchema.safeParse({ ...input, locked: false });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const now = Date.now();
  const ref = await db.collection(COLLECTION).add({
    ...parsed.data,
    locked: false,
    createdAt: now,
    updatedAt: now,
  });
  revalidatePath("/admin/popups");
  revalidatePath("/");
  return { success: true, id: ref.id };
}

export async function updatePopup(
  id: string,
  input: Partial<PopupInput>,
  idToken?: string | null
): Promise<{ success: true } | { success: false; error: string }> {
  const auth = await requireAdminOrFail(idToken);
  if (!auth.ok) return { success: false, error: auth.error };

  const docRef = db.collection(COLLECTION).doc(id);
  const existing = await docRef.get();
  if (!existing.exists) return { success: false, error: "Popup not found" };

  const data = existing.data() as PopupAd;
  if (data.locked) {
    input = { ...input, enabled: true, locked: true };
  }

  const parsed = PopupSchema.partial().safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await docRef.update({ ...parsed.data, updatedAt: Date.now() });
  revalidatePath("/admin/popups");
  revalidatePath("/");
  return { success: true };
}

export async function deletePopup(
  id: string,
  idToken?: string | null
): Promise<{ success: true } | { success: false; error: string }> {
  const auth = await requireAdminOrFail(idToken);
  if (!auth.ok) return { success: false, error: auth.error };

  const docRef = db.collection(COLLECTION).doc(id);
  const existing = await docRef.get();
  if (!existing.exists) return { success: false, error: "Popup not found" };
  if ((existing.data() as PopupAd).locked) {
    return { success: false, error: "This system popup cannot be deleted." };
  }

  await docRef.delete();
  revalidatePath("/admin/popups");
  revalidatePath("/");
  return { success: true };
}

export async function seedDefaultPopups(
  idToken?: string | null
): Promise<{ success: true; count: number } | { success: false; error: string }> {
  const auth = await requireAdminOrFail(idToken);
  if (!auth.ok) return { success: false, error: auth.error };

  const existing = await db.collection(COLLECTION).limit(1).get();
  if (!existing.empty) {
    return { success: false, error: "Popups already exist. Edit them instead." };
  }

  const now = Date.now();
  const batch = db.batch();

  const hireRef = db.collection(COLLECTION).doc();
  batch.set(hireRef, {
    title: "Need a website or app?",
    body: "I'm GLASSKID — Full Stack developer building fast modern web apps. Let's talk about your project.",
    mediaType: "video",
    mediaUrl: "/videos/hire-me-popup.mp4",
    buttonLabel: "Hire Me",
    buttonUrl: "/contact",
    secondaryLabel: "WhatsApp",
    secondaryUrl: "https://wa.me/2349136893921",
    enabled: true,
    delaySeconds: 10,
    cooldownDays: 0,
    pages: "all",
    locked: true,
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
  });

  const projectRef = db.collection(COLLECTION).doc();
  batch.set(projectRef, {
    title: "Featured work",
    body: "Explore selected projects — case studies, screenshots and the tech behind them.",
    mediaType: "image",
    mediaUrl: "/images/projects/jb-01-1.png",
    buttonLabel: "View projects",
    buttonUrl: "/projects",
    secondaryLabel: "",
    secondaryUrl: "",
    enabled: true,
    delaySeconds: 18,
    cooldownDays: 3,
    pages: "home",
    locked: false,
    sortOrder: 1,
    createdAt: now + 1,
    updatedAt: now + 1,
  });

  await batch.commit();
  revalidatePath("/admin/popups");
  revalidatePath("/");
  return { success: true, count: 2 };
}
