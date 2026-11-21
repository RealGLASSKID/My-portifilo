"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { Plus, Pencil, Trash2, X, Loader2, UploadCloud } from "lucide-react";
import {
  createPopup,
  updatePopup,
  deletePopup,
  seedDefaultPopups,
  type PopupAd,
  type PopupInput,
} from "./actions";
import { getAdminIdToken } from "@/lib/get-admin-token";

type FormState = {
  id: string | null;
  title: string;
  body: string;
  mediaType: "image" | "video" | "none";
  mediaUrl: string;
  buttonLabel: string;
  buttonUrl: string;
  secondaryLabel: string;
  secondaryUrl: string;
  enabled: boolean;
  delaySeconds: number;
  cooldownDays: number;
  pages: "home" | "all";
  locked: boolean;
  sortOrder: number;
};

const EMPTY: FormState = {
  id: null,
  title: "",
  body: "",
  mediaType: "image",
  mediaUrl: "",
  buttonLabel: "",
  buttonUrl: "",
  secondaryLabel: "",
  secondaryUrl: "",
  enabled: true,
  delaySeconds: 10,
  cooldownDays: 1,
  pages: "all",
  locked: false,
  sortOrder: 10,
};

export function PopupsClient({ initialPopups }: { initialPopups: PopupAd[] }) {
  const router = useRouter();
  const [popups, setPopups] = useState(initialPopups);
  useEffect(() => setPopups(initialPopups), [initialPopups]);

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setForm(EMPTY);
    setError(null);
    setFormOpen(true);
  }

  function openEdit(p: PopupAd) {
    setForm({
      id: p.id,
      title: p.title,
      body: p.body || "",
      mediaType: p.mediaType || "none",
      mediaUrl: p.mediaUrl || "",
      buttonLabel: p.buttonLabel || "",
      buttonUrl: p.buttonUrl || "",
      secondaryLabel: p.secondaryLabel || "",
      secondaryUrl: p.secondaryUrl || "",
      enabled: p.enabled !== false,
      delaySeconds: p.delaySeconds ?? 8,
      cooldownDays: p.cooldownDays ?? 1,
      pages: p.pages === "home" ? "home" : "all",
      locked: !!p.locked,
      sortOrder: p.sortOrder ?? 0,
    });
    setError(null);
    setFormOpen(true);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
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
      const isVideo = file.type.startsWith("video/");
      setForm((f) => ({
        ...f,
        mediaUrl: data.url,
        mediaType: isVideo ? "video" : "image",
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
    setSaving(true);
    setError(null);
    const payload: PopupInput = {
      title: form.title.trim(),
      body: form.body.trim(),
      mediaType: form.mediaType,
      mediaUrl: form.mediaUrl.trim(),
      buttonLabel: form.buttonLabel.trim(),
      buttonUrl: form.buttonUrl.trim(),
      secondaryLabel: form.secondaryLabel.trim(),
      secondaryUrl: form.secondaryUrl.trim(),
      enabled: form.locked ? true : form.enabled,
      delaySeconds: Number(form.delaySeconds) || 0,
      cooldownDays: form.locked ? 0 : Number(form.cooldownDays) || 0,
      pages: form.pages,
      locked: form.locked,
      sortOrder: Number(form.sortOrder) || 0,
    };
    const token = await getAdminIdToken();
    const result = form.id
      ? await updatePopup(form.id, payload, token)
      : await createPopup(payload, token);
    setSaving(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setFormOpen(false);
    router.refresh();
  }

  async function handleDelete(p: PopupAd) {
    if (p.locked) {
      alert("Hire Me system popup cannot be deleted.");
      return;
    }
    if (!confirm(`Delete popup "${p.title}"?`)) return;
    const token = await getAdminIdToken();
    const r = await deletePopup(p.id, token);
    if (!r.success) alert(r.error);
    else router.refresh();
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Marketing"
        title="Popup ads"
        description="Hire Me stays always on. Project / custom ads support delay, cooldown, image or video (upload or Cloudinary URL)."
      >
        {popups.length === 0 && (
          <button
            type="button"
            className="btn-ghost-glass rounded-xl px-4 py-2 text-sm font-semibold"
            onClick={async () => {
              const token = await getAdminIdToken();
              const r = await seedDefaultPopups(token);
              alert(r.success ? `Seeded ${r.count} popups` : r.error);
              router.refresh();
            }}
          >
            Seed default popups
          </button>
        )}
        <button
          type="button"
          onClick={() => (formOpen ? setFormOpen(false) : openCreate())}
          className="btn-glow inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
        >
          {formOpen ? <X className="size-4" /> : <Plus className="size-4" />}
          {formOpen ? "Cancel" : "New popup"}
        </button>
      </AdminPageHeader>

      {formOpen && (
        <form onSubmit={handleSubmit} className="glass-card mb-6 grid gap-3 p-5 sm:grid-cols-2">
          {form.locked && (
            <p className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary sm:col-span-2">
              System Hire Me popup — always enabled on all pages. You can still update media/text if needed.
            </p>
          )}
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none sm:col-span-2"
          />
          <textarea
            placeholder="Body text"
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            rows={3}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none sm:col-span-2"
          />

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs text-muted-foreground">Media type</label>
            <select
              value={form.mediaType}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  mediaType: e.target.value as FormState["mediaType"],
                }))
              }
              className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none"
            >
              <option value="none" className="bg-background">
                None
              </option>
              <option value="image" className="bg-background">
                Image
              </option>
              <option value="video" className="bg-background">
                Video
              </option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs text-muted-foreground">
              Media URL (image path, video path, or Cloudinary link)
            </label>
            <input
              placeholder="/images/... or https://res.cloudinary.com/..."
              value={form.mediaUrl}
              onChange={(e) => setForm((f) => ({ ...f, mediaUrl: e.target.value }))}
              className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none"
            />
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <label className="btn-ghost-glass inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold">
                {uploading ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
                Upload image
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  className="hidden"
                  disabled={uploading}
                  onChange={handleUpload}
                />
              </label>
              {form.mediaUrl && form.mediaType === "image" && (
                <div className="relative size-16 overflow-hidden rounded-lg border border-white/10">
                  <Image src={form.mediaUrl} alt="" fill className="object-cover" />
                </div>
              )}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Video files: paste a Cloudinary (or any) video URL if direct video upload is blocked.
            </p>
          </div>

          <input
            placeholder="Primary button label"
            value={form.buttonLabel}
            onChange={(e) => setForm((f) => ({ ...f, buttonLabel: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none"
          />
          <input
            placeholder="Primary button link (/contact or https://...)"
            value={form.buttonUrl}
            onChange={(e) => setForm((f) => ({ ...f, buttonUrl: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none"
          />
          <input
            placeholder="Secondary button label (optional)"
            value={form.secondaryLabel}
            onChange={(e) => setForm((f) => ({ ...f, secondaryLabel: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none"
          />
          <input
            placeholder="Secondary button link"
            value={form.secondaryUrl}
            onChange={(e) => setForm((f) => ({ ...f, secondaryUrl: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none"
          />

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Delay (seconds)</label>
            <input
              type="number"
              min={0}
              max={120}
              value={form.delaySeconds}
              onChange={(e) => setForm((f) => ({ ...f, delaySeconds: Number(e.target.value) }))}
              className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">
              Cooldown days after close {form.locked ? "(hire uses session only)" : ""}
            </label>
            <input
              type="number"
              min={0}
              max={365}
              disabled={form.locked}
              value={form.cooldownDays}
              onChange={(e) => setForm((f) => ({ ...f, cooldownDays: Number(e.target.value) }))}
              className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none disabled:opacity-50"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Show on</label>
            <select
              value={form.pages}
              disabled={form.locked}
              onChange={(e) =>
                setForm((f) => ({ ...f, pages: e.target.value as "home" | "all" }))
              }
              className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none disabled:opacity-50"
            >
              <option value="all" className="bg-background">
                All pages
              </option>
              <option value="home" className="bg-background">
                Home only
              </option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.enabled}
              disabled={form.locked}
              onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
            />
            Enabled
          </label>

          {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}
          <button
            type="submit"
            disabled={saving || uploading}
            className="btn-glow rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-50 sm:col-span-2 sm:justify-self-start"
          >
            {saving ? "Saving…" : form.id ? "Save changes" : "Create popup"}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {popups.map((p) => (
          <article key={p.id} className="glass-card flex flex-wrap items-center gap-4 p-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-white/5">
              {p.mediaType === "image" && p.mediaUrl ? (
                <Image src={p.mediaUrl} alt="" fill className="object-cover" />
              ) : p.mediaType === "video" ? (
                <div className="grid size-full place-items-center text-[10px] text-muted-foreground">
                  VIDEO
                </div>
              ) : (
                <div className="grid size-full place-items-center text-[10px] text-muted-foreground">
                  —
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{p.title}</h3>
                {p.locked && (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    HIRE / SYSTEM
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  delay {p.delaySeconds}s · cooldown {p.cooldownDays}d · {p.pages}
                </span>
              </div>
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{p.body}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => openEdit(p)}
                className="btn-ghost-glass rounded-lg p-2"
                aria-label="Edit"
              >
                <Pencil className="size-4" />
              </button>
              {!p.locked && (
                <button
                  type="button"
                  onClick={() => handleDelete(p)}
                  className="btn-ghost-glass rounded-lg p-2 text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          </article>
        ))}
        {popups.length === 0 && (
          <p className="text-sm text-muted-foreground">No popups yet. Seed defaults or create one.</p>
        )}
      </div>
    </>
  );
}
