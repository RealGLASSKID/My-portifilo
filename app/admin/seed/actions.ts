"use server";

import { seedBlogPosts } from "../blog/actions";
import { seedMusicReleases } from "../music/actions";
import { seedServices } from "../services/actions";

export async function seedAllCollections() {
  const results = await Promise.allSettled([
    seedBlogPosts(),
    seedMusicReleases(),
    seedServices(),
  ]);
  const names = ["blog", "music", "services"];
  return results.map((r, i) => {
    if (r.status === "fulfilled") return { collection: names[i], ...r.value };
    return { collection: names[i], success: false as const, error: String(r.reason) };
  });
}
