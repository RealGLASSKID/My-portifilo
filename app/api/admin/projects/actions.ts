
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
  imageUrl: z.string().url("Upload an image first"),
  imagePublicId: z.string().min(1),
  liveUrl: z.union([z.string().url(), z.literal("")]).optional(),
  githubUrl: z.union([z.string().url(), z.literal("")]).optional(),
  featured: z.boolean().default(false),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;

export type Project = ProjectInput & {
  id: string;
  createdAt: number;
  updatedAt: number;
};

// TODO(auth): every function below runs with full admin privileges.
// The Firebase Admin SDK bypasses Firestore security rules entirely.
// Once /admin has auth, wrap these in a session check.

export async function getProjects(): Promise<Project[]> {
  const snapshot = await db
    .collection(COLLECTION)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Project
  );
}

export async function createProject(
  input: ProjectInput
): Promise<{ success: true; id: string } | { success: false; error: string }> {
  const parsed = ProjectSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const now = Date.now();

  const ref = await db.collection(COLLECTION).add({
    ...parsed.data,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");

  return { success: true, id: ref.id };
}

export async function updateProject(
  id: string,
  input: Partial<ProjectInput>
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = ProjectSchema.partial().safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  await db
    .collection(COLLECTION)
    .doc(id)
    .update({
      ...parsed.data,
      updatedAt: Date.now(),
    });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");

  return { success: true };
}

export async function deleteProject(
  id: string
): Promise<{ success: true } | { success: false; error: string }> {
  const docRef = db.collection(COLLECTION).doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return { success: false, error: "Project not found" };
  }

  const data = doc.data();

  // Best-effort image cleanup — don't block the delete if Cloudinary hiccups.
  if (data?.imagePublicId) {
    await cloudinary.uploader
      .destroy(data.imagePublicId)
      .catch((err: unknown) => {
        console.error("Failed to delete Cloudinary image:", err);
      });
  }

  await docRef.delete();

  revalidatePath("/admin/projects");
  revalidatePath("/projects");

  return { success: true };
}

