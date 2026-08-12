"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase-admin";

const COLLECTION = "services";
const ServiceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().default("Code2"),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});
export type ServiceInput = z.infer<typeof ServiceSchema>;
export type Service = ServiceInput & { id: string; createdAt: number; updatedAt: number };

export async function getServices(): Promise<Service[]> {
  const snapshot = await db.collection(COLLECTION).orderBy("order", "asc").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Service);
}

export async function getPublishedServices(): Promise<Service[]> {
  try {
    const snapshot = await db.collection(COLLECTION).where("published", "==", true).orderBy("order", "asc").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Service);
  } catch {
    const all = await getServices();
    return all.filter((s) => s.published !== false).sort((a, b) => a.order - b.order);
  }
}

export async function createService(input: ServiceInput) {
  const parsed = ServiceSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const now = Date.now();
  const ref = await db.collection(COLLECTION).add({ ...parsed.data, createdAt: now, updatedAt: now });
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true as const, id: ref.id };
}

export async function updateService(id: string, input: Partial<ServiceInput>) {
  const parsed = ServiceSchema.partial().safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid" };
  await db.collection(COLLECTION).doc(id).update({ ...parsed.data, updatedAt: Date.now() });
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true as const };
}

export async function deleteService(id: string) {
  await db.collection(COLLECTION).doc(id).delete();
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true as const };
}

export async function seedServices() {
  const existing = await db.collection(COLLECTION).limit(1).get();
  if (!existing.empty) return { success: false as const, error: "Services already exist." };
  const defaults = [
    { title: "Full Stack Development", description: "End-to-end web development using modern technologies to build fast, secure and scalable applications.", icon: "Code2", order: 0 },
    { title: "UI/UX Design", description: "Beautiful, user-centered designs that not only look stunning but deliver exceptional experiences.", icon: "Palette", order: 1 },
    { title: "Web Applications", description: "Custom web applications built for performance, scalability and a seamless user experience.", icon: "MonitorSmartphone", order: 2 },
    { title: "SaaS Development", description: "I build robust SaaS platforms with secure authentication, billing and analytics integration.", icon: "Cloud", order: 3 },
    { title: "API Integration", description: "Seamlessly integrate third-party APIs and build custom APIs to power your applications.", icon: "Zap", order: 4 },
    { title: "Performance Optimization", description: "Improve speed, SEO and core web vitals to ensure the best user experience.", icon: "Shield", order: 5 },
    { title: "Maintenance & Support", description: "Reliable maintenance, updates and support to keep your application running smoothly.", icon: "Compass", order: 6 },
    { title: "Consultation", description: "Get expert advice on your project idea, tech stack and best development approach.", icon: "User", order: 7 },
  ];
  const now = Date.now();
  const batch = db.batch();
  defaults.forEach((s, i) => {
    const ref = db.collection(COLLECTION).doc();
    batch.set(ref, { ...s, published: true, createdAt: now - i * 1000, updatedAt: now - i * 1000 });
  });
  await batch.commit();
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true as const, count: defaults.length };
}
