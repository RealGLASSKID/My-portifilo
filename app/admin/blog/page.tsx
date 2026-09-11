import { getBlogPosts } from "./actions";
import { BlogClient } from "./blog-client";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();
  return <BlogClient initialPosts={posts} />;
}
