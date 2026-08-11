"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { posts } from "@/lib/blog";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { Search, Plus, ExternalLink, Pencil } from "lucide-react";

export default function AdminBlogPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );

  return (
    <>
      <AdminPageHeader
        eyebrow="Collection"
        title="Blog Posts"
        description={`${posts.length} published posts, pulled from your live site content.`}
      >
        <button className="btn-glow inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold">
          <Plus className="size-4" /> New Post
        </button>
      </AdminPageHeader>

      <div className="glass-card flex items-center gap-2 rounded-xl p-2 px-3">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search posts by title or category…"
          className="w-full bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="glass-card mt-6 overflow-hidden">
        <div className="hidden grid-cols-[1fr_120px_100px_90px_140px] gap-4 border-b border-white/5 px-5 py-3 text-xs uppercase tracking-widest text-muted-foreground md:grid">
          <span>Title</span>
          <span>Category</span>
          <span>Date</span>
          <span>Read</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-white/5">
          {filtered.map((post) => (
            <div
              key={post.slug}
              className="grid grid-cols-1 gap-2 px-5 py-4 md:grid-cols-[1fr_120px_100px_90px_140px] md:items-center md:gap-4"
            >
              <div className="min-w-0">
                <div className="truncate font-medium">{post.title}</div>
                <div className="truncate text-xs text-muted-foreground">{post.excerpt}</div>
              </div>
              <span className="w-fit rounded-md border border-white/10 px-2 py-0.5 text-[11px] text-muted-foreground md:w-auto">
                {post.category}
              </span>
              <span className="text-xs text-muted-foreground">{post.date}</span>
              <span className="text-xs text-muted-foreground">{post.read}</span>
              <div className="flex items-center gap-2 md:justify-end">
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="grid size-9 place-items-center rounded-lg border border-white/10 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                  title="View live"
                >
                  <ExternalLink className="size-4" />
                </Link>
                <button
                  className="grid size-9 place-items-center rounded-lg border border-white/10 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                  title="Edit"
                >
                  <Pencil className="size-4" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-10 text-center text-sm text-muted-foreground">No posts match &quot;{q}&quot;.</div>
          )}
        </div>
      </div>
    </>
  );
}
