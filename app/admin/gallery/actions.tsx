"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase-admin";
import cloudinary from "@/lib/cloudinary";

const COLLECTION = "gallery";

const GallerySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().default(""),
  imageUrl: z.string().url("A valid image URL is required"),
  imagePublicId: z.string().optional().default(""), // empty when using external link
  category: z.string().default("Personal"),
  location: z.string().optional().default(""),
  takenAt: z.string().optional().default(""), // free-text date e.g. "2024" or "March 2025"
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

export type GalleryInput = z.infer<typeof GallerySchema>;

export type GalleryItem = GalleryInput & {
  id: string;
  createdAt: number;
  updatedAt: number;
};

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const snapshot = await db
    .collection(COLLECTION)
    .orderBy("order", "asc")
    .orderBy("createdAt", "desc")
    .get()
    .catch(async () => {
      // fallback if composite index not ready yet
      return db.collection(COLLECTION).orderBy("createdAt", "desc").get();
    });

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as GalleryItem);
}

export async function createGalleryItem(
  input: GalleryInput
): Promise<{ success: true; id: string } | { success: false; error: string }> {
  const parsed = GallerySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const now = Date.now();
  const ref = await db.collection(COLLECTION).add({
    ...parsed.data,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true, id: ref.id };
}

export async function updateGalleryItem(
  id: string,
  input: Partial<GalleryInput>
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = GallerySchema.partial().safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db
    .collection(COLLECTION)
    .doc(id)
    .update({ ...parsed.data, updatedAt: Date.now() });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true };
}

export async function deleteGalleryItem(
  id: string
): Promise<{ success: true } | { success: false; error: string }> {
  const docRef = db.collection(COLLECTION).doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return { success: false, error: "Item not found" };
  }

  const data = doc.data();

  // Only delete from Cloudinary if we uploaded it (has publicId)
  if (data?.imagePublicId) {
    await cloudinary.uploader.destroy(data.imagePublicId).catch((err) => {
      console.error("Failed to delete Cloudinary image:", err);
    });
  }

  await docRef.delete();

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true };
}