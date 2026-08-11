"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { Search, Plus, Pencil, Trash2, Star, X, UploadCloud, Loader2 } from "lucide-react";
import { createProject, updateProject, deleteProject, type Project } from "./actions";

const CATS = ["All", "Web Apps", "Mobile Apps", "E-Commerce", "SaaS", "Music", "UI/UX", "Open Source"] as const;
const FORM_CATS = CATS.filter((c) => c !== "All");

type FormState = {
  id: string | null;
  name: string;
  slug: string;
  category: string;
  description: string;
  tags: string; // comma-separated in the UI, split into an array on submit
  liveUrl: string;
  githubUrl: string;
  imageUrl: string;
  imagePublicId: string;
  featured: boolean;
};

const EMPTY_FORM: FormState = {
  id: null,
  name: "",
  slug: "",
  category: FORM_CATS[0],
  description: "",
  tags: "",
  liveUrl: "",
  githubUrl: "",
  imageUrl: "",
  imagePublicId: "",
  featured: false,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const router = useRouter();

  // Keep local list in sync with fresh server data after each router.refresh()
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  useEffect(() => setProjects(initialProjects), [initialProjects]);

  const [active, setActive] = useState<(typeof CATS)[number]>("All");
  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) => (active === "All" || p.category === active) && p.name.toLowerCase().includes(q.toLowerCase())
      ),
    [projects, active, q]
  );

  function openCreateForm() {
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setError(null);
    setFormOpen(true);
  }

  function openEditForm(p: Project) {
    setForm({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      description: p.description,
      tags: p.tags.join(", "),
      liveUrl: p.liveUrl ?? "",
      githubUrl: p.githubUrl ?? "",
      imageUrl: p.imageUrl,
      imagePublicId: p.imagePublicId,
      featured: p.featured,
    });
    setSlugTouched(true); // don't overwrite an existing slug while editing
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
      setForm((f) => ({ ...f, imageUrl: data.url, imagePublicId: data.publicId }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = ""; // allow re-selecting the same file if needed
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Project name is required");
      return;
    }
    if (!form.imageUrl) {
      setError("Upload a project image first");
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      slug: (form.slug.trim() || slugify(form.name)) as string,
      category: form.category,
      description: form.description.trim() || "No description yet.",
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      imageUrl: form.imageUrl,
      imagePublicId: form.imagePublicId,
      liveUrl: form.liveUrl.trim(),
      githubUrl: form.githubUrl.trim(),
      featured: form.featured,
    };

    const result = form.id
      ? await updateProject(form.id, payload)
      : await createProject(payload);

    setSaving(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    closeForm();
    router.refresh();
  }

  async function handleDelete(p: Project) {
    if (!confirm(`Delete "${p.name}"? This also removes its image from Cloudinary. This can't be undone.`)) {
      return;
    }
    const result = await deleteProject(p.id);
    if (!result.success) {
      alert(result.error);
      return;
    }
    router.refresh();
  }

  async function toggleFeatured(p: Project) {
    // optimistic update so the star feels instant
    setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, featured: !x.featured } : x)));
    const result = await updateProject(p.id, { featured: !p.featured });
    if (!result.success) {
      // revert on failure
      setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, featured: p.featured } : x)));
      alert(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Collection"
        title="Projects"
        description={`${projects.length} projects · showing ${filtered.length} · synced live with Firestore`}
      >
        <button
          onClick={() => (formOpen ? closeForm() : openCreateForm())}
          className="btn-glow inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
        >
          {formOpen ? <X className="size-4" /> : <Plus className="size-4" />} {formOpen ? "Cancel" : "New Project"}
        </button>
      </AdminPageHeader>

      {formOpen && (
        <form onSubmit={handleSubmit} className="glass-card mb-6 grid gap-3 p-5 sm:grid-cols-2">
          {/* Image upload */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Project image</label>
            <div className="flex items-center gap-4">
              <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                {form.imageUrl ? (
                  <Image src={form.imageUrl} alt="" width={80} height={80} className="size-full object-cover" />
                ) : uploading ? (
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                ) : (
                  <UploadCloud className="size-5 text-muted-foreground" />
                )}
              </div>
              <label className="btn-ghost-glass inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium">
                {uploading ? "Uploading…" : form.imageUrl ? "Replace image" : "Upload image"}
                <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={handleFileChange} disabled={uploading} className="hidden" />
              </label>
            </div>
          </div>

          <input
            required
            placeholder="Project name"
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }));
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
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none sm:col-span-1"
          >
            {FORM_CATS.map((c) => (
              <option key={c} value={c} className="bg-background">
                {c}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            />
            Featured on homepage
          </label>
          <input
            placeholder="Short description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground sm:col-span-2"
          />
          <input
            placeholder="Tech stack, comma separated"
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground sm:col-span-2"
          />
          <input
            type="url"
            placeholder="Live URL (optional)"
            value={form.liveUrl}
            onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <input
            type="url"
            placeholder="GitHub URL (optional)"
            value={form.githubUrl}
            onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />

          {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}

          <button
            type="submit"
            disabled={saving || uploading}
            className="btn-glow rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-50 sm:col-span-2 sm:justify-self-start"
          >
            {saving ? "Saving…" : form.id ? "Save changes" : "Add Project"}
          </button>
        </form>
      )}

      <div className="glass-card flex flex-col gap-4 p-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                active === c ? "btn-glow" : "btn-ghost-glass"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {filtered.map((p) => (
          <div key={p.id} className="glass-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="size-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <Image src={p.imageUrl} alt="" width={56} height={56} className="size-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold">{p.name}</h3>
                  {p.featured && (
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      Featured
                    </span>
                  )}
                  <span className="rounded-md border border-white/10 px-2 py-0.5 text-[11px] text-muted-foreground">{p.category}</span>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => toggleFeatured(p)}
                title={p.featured ? "Unfeature" : "Feature"}
                className={`grid size-9 place-items-center rounded-lg border transition ${
                  p.featured ? "border-primary/40 text-primary" : "border-white/10 text-muted-foreground hover:text-primary"
                }`}
              >
                <Star className="size-4" fill={p.featured ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => openEditForm(p)}
                className="grid size-9 place-items-center rounded-lg border border-white/10 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
              >
                <Pencil className="size-4" />
              </button>
              <button
                onClick={() => handleDelete(p)}
                className="grid size-9 place-items-center rounded-lg border border-white/10 text-muted-foreground transition hover:border-destructive/50 hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="glass-card p-10 text-center text-sm text-muted-foreground">
            {projects.length === 0 ? "No projects yet — add your first one above." : "No projects match your filters."}
          </div>
        )}
      </div>
    </>
  );
}