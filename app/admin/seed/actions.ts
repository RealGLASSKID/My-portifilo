"use server";

import { requireAdminOrFail } from "@/lib/require-admin";
import { seedBlogPosts } from "../blog/actions";
import { seedMusicReleases } from "../music/actions";
import { seedServices } from "../services/actions";

export async function seedAllCollections(idToken?: string | null) {
  const auth = await requireAdminOrFail(idToken);
  if (!auth.ok) {
    return [{ collection: "all", success: false as const, error: auth.error }];
  }

  const results = await Promise.allSettled([
    seedBlogPosts(idToken as any),
    seedMusicReleases(idToken as any),
    seedServices(idToken as any),
  ]);
  const names = ["blog", "music", "services"];
  return results.map((r, i) => {
    if (r.status === "fulfilled") return { collection: names[i], ...r.value };
    return { collection: names[i], success: false as const, error: String(r.reason) };
  });
}
