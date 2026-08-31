"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { Search, Plus, Pencil, Trash2, Play, X, FileText } from "lucide-react";
import {
  createMusicRelease,
  updateMusicRelease,
  deleteMusicRelease,
  seedMusicReleases,
  type MusicRelease,
} from "./actions";

type FormState = {
  id: string | null;
  title: string;
  slug: string;
  type: "Single" | "Album";
  year: string;
  streams: string;
  tag: string;
  coverUrl: string;
  audioUrl: string;
  lyrics: string; // stanzas separated by a blank line in the UI, split into an array on submit
  featured: boolean;
  published: boolean;
};

const EMPTY_FORM: FormState = {
  id: null,
  title: "",
  slug: "",
  type: "Single",
  year: String(new Date().getFullYear()),
  streams: "0",
  tag: "",
  coverUrl: "",
  audioUrl: "",
  lyrics: "",
  featured: false,
  published: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function MusicClient({ initialReleases }: { initialReleases: MusicRelease[] }) {
  const router = useRouter();

  const [releases, setReleases] = useState<MusicRelease[]>(initialReleases);
  useEffect(() => setReleases(initialReleases), [initialReleases]);

  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(
    () => releases.filter((r) => r.title.toLowerCase().includes(q.toLowerCase())),
    [releases, q]
  );

  function openCreateForm() {
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setError(null);
    setFormOpen(true);
  }

  function openEditForm(r: MusicRelease) {
    setForm({
      id: r.id,
      title: r.title,
      slug: r.slug,
      type: r.type as "Single" | "Album",
      year: r.year,
      streams: r.streams,
      tag: r.tag || "",
      coverUrl: r.coverUrl || "",
      audioUrl: r.audioUrl || "",
      lyrics: (r.lyrics || []).join("\n\n"),
      featured: r.featured,
      published: r.published,
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
      slug: (form.slug.trim() || slugify(form.title)) as string,
      type: form.type,
      year: form.year.trim(),
      streams: form.streams.trim() || "0",
      tag: form.tag.trim(),
      coverUrl: form.coverUrl.trim(),
      audioUrl: form.audioUrl.trim(),
      lyrics: form.lyrics
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .filter(Boolean),
      featured: form.featured,
      published: form.published,
    };

    const result = form.id
      ? await updateMusicRelease(form.id, payload)
      : await createMusicRelease(payload);

    setSaving(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    closeForm();
    router.refresh();
  }

  async function handleDelete(r: MusicRelease) {
    if (!confirm(`Delete "${r.title}"? This can't be undone.`)) return;
    const result = await deleteMusicRelease(r.id);
    if (!result.success) {
      alert("Could not delete this release.");
      return;
    }
    router.refresh();
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Collection"
        title="Music"
        description={`${releases.length} releases · showing ${filtered.length} · synced live with Firestore`}
      >
        {releases.length === 0 && (
          <button
            type="button"
            onClick={async () => {
              const r = await seedMusicReleases();
              if (!r.success) alert(r.error);
              router.refresh();
            }}
            className="btn-ghost-glass rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Seed default releases
          </button>
        )}
        <button
          onClick={() => (formOpen ? closeForm() : openCreateForm())}
          className="btn-glow inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
        >
          {formOpen ? <X className="size-4" /> : <Plus className="size-4" />}{" "}
          {formOpen ? "Cancel" : "New Release"}
        </button>
      </AdminPageHeader>

      {formOpen && (
        <form onSubmit={handleSubmit} className="glass-card mb-6 grid gap-3 p-5 sm:grid-cols-2">
          <input
            required
            autoFocus
            placeholder="Track or release title"
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
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "Single" | "Album" }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none"
          >
            <option value="Single" className="bg-background">Single</option>
            <option value="Album" className="bg-background">Album</option>
          </select>
          <input
            placeholder="Year"
            value={form.year}
            onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <input
            placeholder="Streams (e.g. 18.2K)"
            value={form.streams}
            onChange={(e) => setForm((f) => ({ ...f, streams: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <input
            placeholder="Tag (e.g. NEW) — optional"
            value={form.tag}
            onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <input
            type="url"
            placeholder="Cover image URL — optional"
            value={form.coverUrl}
            onChange={(e) => setForm((f) => ({ ...f, coverUrl: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <input
            type="url"
            placeholder="Audio file URL — optional"
            value={form.audioUrl}
            onChange={(e) => setForm((f) => ({ ...f, audioUrl: e.target.value }))}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <label className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            />
            Featured on homepage
          </label>
          <label className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            />
            Published (visible on /music)
          </label>

          <div className="sm:col-span-2 mt-2 border-t border-white/5 pt-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Lyrics
            </p>
            <p className="mb-3 text-xs text-muted-foreground">
              Paste the full lyrics. Leave a blank line between sections (chorus, verse 1, verse
              2…) — each section is shown as its own block on the lyrics page.
            </p>
            <textarea
              placeholder={"CHORUS\nI left my hands up high...\n\nVERSE 1\nI don't no why you can't see..."}
              value={form.lyrics}
              onChange={(e) => setForm((f) => ({ ...f, lyrics: e.target.value }))}
              rows={10}
              className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="btn-glow rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-50 sm:col-span-2 sm:justify-self-start"
          >
            {saving ? "Saving…" : form.id ? "Save changes" : "Add Release"}
          </button>
        </form>
      )}

      <div className="glass-card flex items-center gap-2 rounded-xl p-2 px-3">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search releases…"
          className="w-full bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-6 grid gap-3">
        {filtered.map((r) => (
          <div key={r.id} className="glass-card flex items-center gap-4 p-4">
            <span className="btn-glow grid size-11 shrink-0 place-items-center rounded-full">
              <Play className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate font-semibold">{r.title}</span>
                {r.tag && (
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {r.tag}
                  </span>
                )}
                {!r.published && (
                  <span className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] text-muted-foreground">
                    Draft
                  </span>
                )}
                {r.lyrics && r.lyrics.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-0.5 text-[10px] text-muted-foreground">
                    <FileText className="size-3" /> Lyrics added
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {r.type} · {r.year} · {r.streams} streams
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => openEditForm(r)}
                className="grid size-9 place-items-center rounded-lg border border-white/10 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
              >
                <Pencil className="size-4" />
              </button>
              <button
                onClick={() => handleDelete(r)}
                className="grid size-9 place-items-center rounded-lg border border-white/10 text-muted-foreground transition hover:border-destructive/50 hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="glass-card p-10 text-center text-sm text-muted-foreground">
            {releases.length === 0 ? "No releases yet — add your first one above." : `No releases match "${q}".`}
          </div>
        )}
      </div>
    </>
  );
}
