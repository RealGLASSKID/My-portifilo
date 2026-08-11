"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Star,
  X,
  UploadCloud,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";
import {
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  type GalleryItem,
} from "./actions";

const CATS = ["All", "Personal", "Studio", "Events", "Travel", "Behind the scenes"] as const;
const FORM_CATS = CATS.filter((c) => c !== "All");

type FormState = {
  id: string | null;
  title: string;
  description: string;
  imageUrl: string;
  imagePublicId: string;
  category: string;
  location: string;
  takenAt: string;
  featured: boolean;
  order: number;
  // UI helper: "upload" | "url"
  source: "upload" | "url";
};

const EMPTY_FORM: FormState = {
  id: null,
  title: "",
  description: "",
  imageUrl: "",
  imagePublicId: "",
  category: FORM_CATS[0],
  location: "",
  takenAt: "",
  featured: false,
  order: 0,
  source: "upload",
};

export function GalleryClient({ initialItems }: { initialItems: GalleryItem[] }) {
  const router = useRouter();

  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  useEffect(() => setItems(initialItems), [initialItems]);

  const [active, setActive] = useState<(typeof CATS)[number]>("All");
  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (active === "All" || item.category === active) &&
          (item.title.toLowerCase().includes(q.toLowerCase()) ||
            item.description.toLowerCase().includes(q.toLowerCase()))
      ),
    [items, active, q]
  );

  function openCreateForm() {
    setForm(EMPTY_FORM);
    setError(null);
    setFormOpen(true);
  }

  function openEditForm(item: GalleryItem) {
    setForm({
      id: item.id,
      title: item.title,
      description: item.description ?? "",
      imageUrl: item.imageUrl,
      imagePublicId: item.imagePublicId ?? "",
      category: item.category || FORM_CATS[0],
      location: item.location ?? "",
      takenAt: item.takenAt ?? "",
      featured: item.featured ?? false,
      order: item.order ?? 0,
      source: item.imagePublicId ? "upload" : "url",
    });
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
      setForm((f) => ({
        ...f,
        imageUrl: data.url,
        imagePublicId: data.publicId,
        source: "upload",
      }));
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
    if (!form.imageUrl.trim()) {
      setError("Add an image (upload or paste a URL)");
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      imagePublicId: form.source === "upload" ? form.imagePublicId : "",
      category: form.category,
      location: form.location.trim(),
      takenAt: form.takenAt.trim(),
      featured: form.featured,
      order: Number(form.order) || 0,
    };

    const result = form.id
      ? await updateGalleryItem(form.id, payload)
      : await createGalleryItem(payload);

    setSaving(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    closeForm();
    router.refresh();
  }

  async function handleDelete(item: GalleryItem) {
    if (!confirm(`Delete "${item.title}"? This can't be undone.`)) return;
    const result = await deleteGalleryItem(item.id);
    if (!result.success) {
      alert(result.error);
      return;
    }
    router.refresh();
  }

  async function toggleFeatured(item: GalleryItem) {
    setItems((prev) =>
      prev.map((x) => (x.id === item.id ? { ...x, featured: !x.featured } : x))
    );
    const result = await updateGalleryItem(item.id, { featured: !item.featured });
    if (!result.success) {
      setItems((prev) =>
        prev.map((x) => (x.id === item.id ? { ...x, featured: item.featured } : x))
      );
      alert(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Collection"
        title="Gallery"
        description={`${items.length} photos · showing ${filtered.length} · synced with Firestore`}
      >
        <button
          onClick={() => (formOpen ? closeForm() : openCreateForm())}
          className="btn-glow inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
        >
          {formOpen ? <X className="size-4" /> : <Plus className="size-4" />}{" "}
          {formOpen ? "Cancel" : "Add Photo"}
        </button>
      </AdminPageHeader>

      {formOpen && (
        <form onSubmit={handleSubmit} className="glass-card mb-6 grid gap-3 p-5 sm:grid-cols-2">
          {/* Source toggle */}
          <div className="flex gap-2 sm:col-span-2">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, source: "upload" }))}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                form.source === "upload" ? "btn-glow" : "btn-ghost-glass"
              }`}
            >
              Upload file
            </button>
            <button
              type="button"
              onClick={() =>
                setForm((f) => ({ ...f, source: "url", imagePublicId: "" }))
              }
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                form.source === "url" ? "btn-glow" : "btn-ghost-glass"
              }`}
            >
              Image URL
            </button>
          </div>

          {/* Image */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Photo
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                {form.imageUrl ? (
                  <Image
                    src={form.imageUrl}
                    alt=""
                    width={80}
                    height={80}
                    className="size-full object-cover"
                    unoptimized={form.source === "url"}
                  />
                ) : uploading ? (
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                ) : form.source === "upload" ? (
                  <UploadCloud className="size-5 text-muted-foreground" />
                ) : (
                  <LinkIcon className="size-5 text-muted-foreground" />
                )}
              </div>

              {form.source === "upload" ? (
                <label className="btn-ghost-glass inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium">
                  {uploading ? "Uploading…" : form.imageUrl ? "Replace image" : "Upload image"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/avif"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              ) : (
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, imageUrl: e.target.value, imagePublicId: "" }))
                  }
                  className="min-w-0 flex-1 rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
                />
              )}
            </div>
          </div>

          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none"
          >
            {FORM_CATS.map((c) => (
              <option key={c} value={c} className="bg-background">
                {c}
              </option>
            ))}
          </select>
          <input
            placeholder="Location (optional)"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <input
            placeholder="When taken (e.g. March 2025)"
            value={form.takenAt}
            onChange={(e) => setForm((f) => ({ ...f, takenAt: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <input
            type="number"
            placeholder="Order (lower = first)"
            value={form.order}
            onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <label className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            />
            Featured
          </label>
          <textarea
            placeholder="Details about this photo…"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground sm:col-span-2"
          />

          {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}

          <button
            type="submit"
            disabled={saving || uploading}
            className="btn-glow rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-50 sm:col-span-2 sm:justify-self-start"
          >
            {saving ? "Saving…" : form.id ? "Save changes" : "Add Photo"}
          </button>
        </form>
      )}

      <div className="glass-card flex flex-col gap-4 p-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search gallery…"
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
        {filtered.map((item) => (
          <div
            key={item.id}
            className="glass-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="size-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <Image
                  src={item.imageUrl}
                  alt=""
                  width={64}
                  height={64}
                  className="size-full object-cover"
                  unoptimized={!item.imagePublicId}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-semibold">{item.title}</h3>
                  {item.featured && (
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      Featured
                    </span>
                  )}
                  <span className="rounded-md border border-white/10 px-2 py-0.5 text-[11px] text-muted-foreground">
                    {item.category}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {item.description || "No description"}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {[item.location, item.takenAt].filter(Boolean).join(" · ") || "—"}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => toggleFeatured(item)}
                title={item.featured ? "Unfeature" : "Feature"}
                className={`grid size-9 place-items-center rounded-lg border transition ${
                  item.featured
                    ? "border-primary/40 text-primary"
                    : "border-white/10 text-muted-foreground hover:text-primary"
                }`}
              >
                <Star className="size-4" fill={item.featured ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => openEditForm(item)}
                className="grid size-9 place-items-center rounded-lg border border-white/10 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
              >
                <Pencil className="size-4" />
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="grid size-9 place-items-center rounded-lg border border-white/10 text-muted-foreground transition hover:border-destructive/50 hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="glass-card p-10 text-center text-sm text-muted-foreground">
            {items.length === 0
              ? "No photos yet — add your first one above."
              : "No photos match your filters."}
          </div>
        )}
      </div>
    </>
  );
}