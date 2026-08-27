"use client";

import { useState } from "react";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("Prince Dennis (GLASSKID)");
  const [email, setEmail] = useState("glasskid01@gmail.com");
  const [bio, setBio] = useState(
    "Full Stack Web Developer, Creative Technologist, Artist & Songwriter from Lagos, Nigeria."
  );
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyComments, setNotifyComments] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <AdminPageHeader eyebrow="Settings" title="Account & Preferences" description="Profile info shown across the site, plus notification preferences." />

      <form onSubmit={save} className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card space-y-4 p-6 lg:col-span-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Display name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-white/5 px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Contact email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-white/5 px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-xl bg-white/5 px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <button type="submit" className="btn-glow inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold">
            {saved ? <Check className="size-4" /> : null} {saved ? "Saved" : "Save changes"}
          </button>
        </div>

        <div className="glass-card h-fit space-y-4 p-6">
          <h3 className="text-sm font-semibold">Notifications</h3>
          <Toggle label="New contact messages" checked={notifyMessages} onChange={setNotifyMessages} />
          <Toggle label="New comments" checked={notifyComments} onChange={setNotifyComments} />
          <p className="pt-2 text-xs text-muted-foreground">
            These preferences are stored in this session only — connect a backend to persist them.
          </p>
        </div>
      </form>
    </>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2.5 text-left text-sm"
    >
      <span>{label}</span>
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition ${checked ? "bg-primary" : "bg-white/10"}`}>
        <span className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${checked ? "left-[18px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}
