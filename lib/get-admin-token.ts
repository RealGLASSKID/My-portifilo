"use client";

import { auth } from "@/lib/firebase-client";

export async function getAdminIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken(false);
  } catch {
    return null;
  }
}
