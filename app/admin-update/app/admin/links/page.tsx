"use client";

import { useState } from "react";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { Copy, Check, ExternalLink } from "lucide-react";

type LinkItem = { to: string; label: string; desc: string; external?: boolean };

const GROUPS: { title: string; items: LinkItem[] }[] = [
  {
    title: "Main",
    items: [
      { to: "/", label: "Home", desc: "Main homepage" },
      { to: "/about", label: "About", desc: "The mind behind the code & music" },
      { to: "/projects", label: "Projects", desc: "Portfolio of completed work" },
      { to: "/blog", label: "Blog", desc: "Notes, essays and technical deep-dives" },
      { to: "/music", label: "Music", desc: "Songs, releases and studio drops" },
    ],
  },
  {
    title: "Products & Services",
    items: [
      { to: "/services", label: "Services", desc: "Full stack, UI/UX, SaaS and consultation" },
      { to: "/products", label: "Products", desc: "Templates, UI kits and digital downloads" },
      { to: "/web-developer-in-nigeria", label: "Web Developer in Nigeria", desc: "Hire me — packages, pricing and FAQs" },
      { to: "/contact", label: "Contact", desc: "Start a project or say hello" },
    ],
  },
  {
    title: "Personal",
    items: [
      { to: "/bucket-list", label: "Bucket List", desc: "Goals, adventures & personal milestones" },
      { to: "/streaks", label: "Streaks", desc: "Habits I'm tracking publicly" },
      { to: "/testify", label: "Testify", desc: "Leave a testimonial about working with me" },
    ],
  },
  {
    title: "Social",
    items: [
      { to: "https://github.com/", label: "GitHub", desc: "Code, repos and open source", external: true },
      { to: "https://x.com/", label: "X / Twitter", desc: "Thoughts in real time", external: true },
      { to: "https://instagram.com/", label: "Instagram", desc: "Life & behind the scenes", external: true },
      { to: "https://open.spotify.com/", label: "Spotify", desc: "Stream the music", external: true },
    ],
  },
];

export default function AdminLinksPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (item: LinkItem) => {
    const full = item.external ? item.to : `https://glasskid.vercel.app${item.to}`;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(item.to);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard not available */
    }
  };

  const total = GROUPS.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <AdminPageHeader eyebrow="Collection" title="Links" description={`${total} links across ${GROUPS.length} groups. Click to copy the full URL.`} />

      <div className="space-y-8">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <div className="chip mb-3">
              <span className="size-1.5 rounded-full bg-primary" /> {g.title}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {g.items.map((item) => (
                <div key={item.to} className="glass-card flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate font-medium">
                      {item.label}
                      {item.external && <ExternalLink className="size-3 text-muted-foreground" />}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <button
                    onClick={() => copy(item)}
                    className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                    title="Copy link"
                  >
                    {copied === item.to ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
