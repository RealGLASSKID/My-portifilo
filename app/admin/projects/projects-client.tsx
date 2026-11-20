"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { Search, Plus, Pencil, Trash2, Star, X, UploadCloud, Loader2, ImageIcon } from "lucide-react";
import { createProject, updateProject, deleteProject, type Project } from "./actions";
import { getAdminIdToken } from "@/lib/get-admin-token";

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
  // Case study fields (detail page)
  problem: string;
  approach: string;
  decisions: string;
  result: string;
  status: string;
  /** Cover is imageUrl; extra screenshots for carousel */
  galleryImages: string[];
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
  problem: "",
  approach: "",
  decisions: "",
  result: "",
  status: "Live",
  galleryImages: [],
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
      tags: (p.tags || []).join(", "),
      liveUrl: p.liveUrl || "",
      githubUrl: p.githubUrl || "",
      imageUrl: p.imageUrl || "",
      imagePublicId: p.imagePublicId || "",
      featured: p.featured,
      problem: p.problem || "",
      approach: p.approach || "",
      decisions: p.decisions || "",
      result: p.result || "",
      status: p.status || "Live",
      galleryImages: [...(p.gallery || [])],
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

  async function uploadOne(file: File): Promise<{ url: string; publicId: string }> {
    const fd = new FormData();
    fd.append("file", file);
    const token = await getAdminIdToken();
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: fd,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Upload failed");
    return { url: data.url as string, publicId: (data.publicId as string) || "" };
  }

  /** Multi-image upload: first image becomes cover if empty; rest go to gallery */
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      let firstPublicId = "";
      for (const file of files) {
        const { url, publicId } = await uploadOne(file);
        uploaded.push(url);
        if (!firstPublicId) firstPublicId = publicId;
      }
      setForm((f) => {
        const nextGallery = [...f.galleryImages];
        let nextCover = f.imageUrl;
        let nextPid = f.imagePublicId;
        for (const url of uploaded) {
          if (!nextCover) {
            nextCover = url;
            nextPid = firstPublicId;
          } else if (url !== nextCover && !nextGallery.includes(url)) {
            nextGallery.push(url);
          }
        }
        return { ...f, imageUrl: nextCover, imagePublicId: nextPid, galleryImages: nextGallery };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeGalleryImage(url: string) {
    setForm((f) => ({
      ...f,
      galleryImages: f.galleryImages.filter((u) => u !== url),
    }));
  }

  function clearCoverImage() {
    setForm((f) => {
      const [next, ...rest] = f.galleryImages;
      return {
        ...f,
        imageUrl: next || "",
        imagePublicId: next ? f.imagePublicId : "",
        galleryImages: next ? rest : [],
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Project name is required");
      return;
    }
    setSaving(true);
    setError(null);

    const basePayload = {
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
      problem: form.problem.trim(),
      approach: form.approach.trim(),
      decisions: form.decisions.trim(),
      result: form.result.trim(),
      status: form.status || "Live",
      gallery: form.galleryImages.filter(Boolean),
    };

    const token = await getAdminIdToken();
    const result = form.id
      ? await updateProject(form.id, basePayload, token)
      : await createProject(basePayload, token);

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
    const token = await getAdminIdToken();
    const result = await deleteProject(p.id, token);
    if (!result.success) {
      alert(result.error);
      return;
    }
    router.refresh();
  }

  async function toggleFeatured(p: Project) {
    // optimistic update so the star feels instant
    setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, featured: !x.featured } : x)));
    const token = await getAdminIdToken();
    const result = await updateProject(p.id, { featured: !p.featured }, token);
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
          type="button"
          onClick={async () => {
            const { seedDefaultProjects } = await import("./actions");
            const token = await getAdminIdToken();
            const r = await seedDefaultProjects(token);
            if (r.success) {
              alert(`Synced ${r.count} projects (${r.created} created, ${r.updated} updated) — descriptions, case study & images filled.`);
            } else {
              alert(r.error);
            }
            router.refresh();
          }}
          className="btn-ghost-glass rounded-xl px-4 py-2 text-sm font-semibold"
        >
          Sync seed projects
        </button>
        <button
          onClick={() => (formOpen ? closeForm() : openCreateForm())}
          className="btn-glow inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
        >
          {formOpen ? <X className="size-4" /> : <Plus className="size-4" />}{" "}
          {formOpen ? "Cancel" : "New Project"}
        </button>
      </AdminPageHeader>

      {formOpen && (
        <form onSubmit={handleSubmit} className="glass-card mb-6 grid gap-3 p-5 sm:grid-cols-2">
          {/* Multi image upload — cover + gallery */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Project images (upload one or many — first becomes cover, rest go to carousel)
            </label>
            <div className="flex flex-wrap items-start gap-3">
              {form.imageUrl ? (
                <div className="relative size-24 overflow-hidden rounded-xl border border-primary/40 bg-white/5">
                  <Image src={form.imageUrl} alt="Cover" width={96} height={96} className="size-full object-cover" />
                  <span className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 text-center text-[9px] font-semibold uppercase text-white">
                    Cover
                  </span>
                  <button
                    type="button"
                    onClick={clearCoverImage}
                    className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-black/70 text-white hover:bg-red-500"
                    aria-label="Remove cover"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ) : null}
              {form.galleryImages.map((url) => (
                <div key={url} className="relative size-24 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <Image src={url} alt="" width={96} height={96} className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(url)}
                    className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-black/70 text-white hover:bg-red-500"
                    aria-label="Remove image"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
              <label className="btn-ghost-glass flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium text-muted-foreground">
                {uploading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <>
                    <UploadCloud className="size-5" />
                    <span>Add</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  multiple
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Select multiple files at once. Click × on a thumbnail to remove it.
            </p>
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

          <div className="sm:col-span-2 mt-2 border-t border-white/5 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Case study (shown on project detail page)
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none sm:col-span-2"
              >
                {["Live", "In progress", "Archive"].map((s) => (
                  <option key={s} value={s} className="bg-background">
                    {s}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="The problem — what challenge did this solve?"
                value={form.problem}
                onChange={(e) => setForm((f) => ({ ...f, problem: e.target.value }))}
                rows={3}
                className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground sm:col-span-2"
              />
              <textarea
                placeholder="The approach — how did you tackle it?"
                value={form.approach}
                onChange={(e) => setForm((f) => ({ ...f, approach: e.target.value }))}
                rows={3}
                className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground sm:col-span-2"
              />
              <textarea
                placeholder="Key decisions — tech choices and trade-offs"
                value={form.decisions}
                onChange={(e) => setForm((f) => ({ ...f, decisions: e.target.value }))}
                rows={3}
                className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground sm:col-span-2"
              />
              <textarea
                placeholder="The result — outcomes and impact"
                value={form.result}
                onChange={(e) => setForm((f) => ({ ...f, result: e.target.value }))}
                rows={3}
                className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground sm:col-span-2"
              />
            </div>
          </div>

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
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${active === c ? "btn-glow" : "btn-ghost-glass"
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
              <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt="" width={56} height={56} className="size-full object-cover" />
                ) : (
                  <ImageIcon className="size-5 text-muted-foreground" />
                )}
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
                className={`grid size-9 place-items-center rounded-lg border transition ${p.featured ? "border-primary/40 text-primary" : "border-white/10 text-muted-foreground hover:text-primary"
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