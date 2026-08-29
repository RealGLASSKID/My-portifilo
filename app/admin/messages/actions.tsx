"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase-admin";

const COLLECTION = "messages";

const MessageSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .regex(/^[0-9+()\-\s]+$/, "Enter a valid phone number"),
  subject: z.string().min(3),
  body: z.string().min(10).max(1000),
});

export type MessageInput = z.infer<typeof MessageSchema>;

export type Message = MessageInput & {
  id: string;
  read: boolean;
  createdAt: number;
};

export async function submitContactMessage(
  input: MessageInput
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = MessageSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db.collection(COLLECTION).add({
    ...parsed.data,
    read: false,
    createdAt: Date.now(),
  });

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { success: true };
}

export async function getMessages(): Promise<Message[]> {
  const snapshot = await db.collection(COLLECTION).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Message);
}

export async function markMessageRead(id: string) {
  await db.collection(COLLECTION).doc(id).update({ read: true });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(id: string) {
  await db.collection(COLLECTION).doc(id).delete();
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function getUnreadMessageCount(): Promise<number> {
  const snapshot = await db.collection(COLLECTION).where("read", "==", false).get();
  return snapshot.size;
}