"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { Search, Plus, Pencil, Trash2, X, ExternalLink, UploadCloud, Loader2 } from "lucide-react";
import { createBlogPost, updateBlogPost, deleteBlogPost, seedBlogPosts, type BlogPost } from "./actions";

type FormState = {
  id: string | null;
  title: string;
  slug: string;
  category: string;
  date: string;
  read: string;
  excerpt: string;
  content: string; // paragraphs separated by a blank line in the UI, split into an array on submit
  coverUrl: string;
  published: boolean;
};

const EMPTY_FORM: FormState = {
  id: null,
  title: "",
  slug: "",
  category: "",
  date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  read: "5 min",
  excerpt: "",
  content: "",
  coverUrl: "",
  published: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function BlogClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const router = useRouter();

  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  useEffect(() => setPosts(initialPosts), [initialPosts]);

  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())
      ),
    [posts, q]
  );

  function openCreateForm() {
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setError(null);
    setFormOpen(true);
  }

  function openEditForm(p: BlogPost) {
    setForm({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      date: p.date,
      read: p.read,
      excerpt: p.excerpt,
      content: (p.content || []).join("\n\n"),
      coverUrl: p.coverUrl || "",
      published: p.published,
    });
    setSlugTouched(true);
    setError(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setForm(EMPTY_FORM);
    setError(null);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setForm((f) => ({ ...f, coverUrl: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      category: form.category.trim() || "General",
      date: form.date.trim(),
      read: form.read.trim() || "5 min",
      excerpt: form.excerpt.trim(),
      content: form.content
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .filter(Boolean),
      coverUrl: form.coverUrl.trim(),
      published: form.published,
    };

    const result = form.id ? await updateBlogPost(form.id, payload) : await createBlogPost(payload);

    setSaving(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    closeForm();
    router.refresh();
  }

  async function handleDelete(p: BlogPost) {
    if (!confirm(`Delete "${p.title}"? This can't be undone.`)) return;
    const result = await deleteBlogPost(p.id);
    if (!result.success) {
      alert("Could not delete this post.");
      return;
    }
    router.refresh();
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Collection"
        title="Blog Posts"
        description={`${posts.length} posts · showing ${filtered.length} · synced live with Firestore`}
      >
        {posts.length === 0 && (
          <button
            type="button"
            onClick={async () => {
              const r = await seedBlogPosts();
              if (!r.success) alert(r.error);
              router.refresh();
            }}
            className="btn-ghost-glass rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Seed default posts
          </button>
        )}
        <button
          onClick={() => (formOpen ? closeForm() : openCreateForm())}
          className="btn-glow inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
        >
          {formOpen ? <X className="size-4" /> : <Plus className="size-4" />}{" "}
          {formOpen ? "Cancel" : "New Post"}
        </button>
      </AdminPageHeader>

      {formOpen && (
        <form onSubmit={handleSubmit} className="glass-card mb-6 grid gap-3 p-5 sm:grid-cols-2">
          <input
            required
            autoFocus
            placeholder="Post title"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
            }}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <input
            placeholder="url-friendly-slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setForm((f) => ({ ...f, slug: e.target.value }));
            }}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <input
            placeholder="Category (e.g. Engineering)"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <input
            placeholder="Date (e.g. Sep 11, 2026)"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <input
            placeholder="Read time (e.g. 5 min)"
            value={form.read}
            onChange={(e) => setForm((f) => ({ ...f, read: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <label className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            />
            Published (visible on /blog)
          </label>

          <textarea
            placeholder="Short excerpt shown on the blog listing…"
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            rows={2}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground sm:col-span-2"
          />

          {/* Cover image upload */}
          <div className="sm:col-span-2">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Cover Image
            </p>
            <div className="flex items-center gap-4">
              <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                {form.coverUrl ? (
                  <Image src={form.coverUrl} alt="" width={80} height={80} className="size-full object-cover" />
                ) : uploading ? (
                  <div className="grid size-full place-items-center">
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                  </div>
                ) : null}
              </div>
              <label className="btn-ghost-glass inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold">
                <UploadCloud className="size-4" />
                {uploading ? "Uploading…" : form.coverUrl ? "Replace image" : "Upload image"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="sm:col-span-2 mt-2 border-t border-white/5 pt-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Content
            </p>
            <p className="mb-3 text-xs text-muted-foreground">
              Write the full post. Leave a blank line between paragraphs — each becomes its own
              paragraph on the published page.
            </p>
            <textarea
              placeholder={"First paragraph...\n\nSecond paragraph..."}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              rows={10}
              className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}

          <button
            type="submit"
            disabled={saving || uploading}
            className="btn-glow rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-50 sm:col-span-2 sm:justify-self-start"
          >
            {saving ? "Saving…" : form.id ? "Save changes" : "Publish Post"}
          </button>
        </form>
      )}

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
              key={post.id}
              className="grid grid-cols-1 gap-2 px-5 py-4 md:grid-cols-[1fr_120px_100px_90px_140px] md:items-center md:gap-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                {post.coverUrl && (
                  <div className="size-10 shrink-0 overflow-hidden rounded-lg border border-white/10">
                    <Image src={post.coverUrl} alt="" width={40} height={40} className="size-full object-cover" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{post.title}</span>
                    {!post.published && (
                      <span className="shrink-0 rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{post.excerpt}</div>
                </div>
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
                  onClick={() => openEditForm(post)}
                  className="grid size-9 place-items-center rounded-lg border border-white/10 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                  title="Edit"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => handleDelete(post)}
                  className="grid size-9 place-items-center rounded-lg border border-white/10 text-muted-foreground transition hover:border-destructive/50 hover:text-destructive"
                  title="Delete"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-10 text-center text-sm text-muted-foreground">
              {posts.length === 0 ? "No posts yet — add your first one above." : `No posts match "${q}".`}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
