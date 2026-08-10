import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import {
  Activity,
  FileText,
  FolderKanban,
  ListChecks,
  Music,
  Flame,
  Link as LinkIcon,
  Users,
  Eye,
  MessageSquare,
  TrendingUp,
  Plus,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin — GLASSKID",
  description: "Private control room.",
  robots: { index: false, follow: false },
};

const STATS = [
  { Icon: Eye, label: "Visitors (30d)", value: "12,847", delta: "+18.2%" },
  { Icon: Users, label: "Unique Users", value: "4,203", delta: "+9.4%" },
  { Icon: MessageSquare, label: "Inquiries", value: "38", delta: "+5" },
  { Icon: TrendingUp, label: "Avg. Session", value: "2m 41s", delta: "+12s" },
];

const COLLECTIONS = [
  { Icon: FolderKanban, name: "Projects", count: 22, updated: "2h ago" },
  { Icon: FileText, name: "Blog Posts", count: 14, updated: "yesterday" },
  { Icon: Music, name: "Music Releases", count: 16, updated: "3d ago" },
  { Icon: ListChecks, name: "Bucket List", count: 17, updated: "1w ago" },
  { Icon: Flame, name: "Streaks", count: 6, updated: "today" },
  { Icon: LinkIcon, name: "Links", count: 12, updated: "2w ago" },
];

const RECENT = [
  { who: "Contact form", what: "New inquiry from Amara O.", when: "12 min ago" },
  { who: "Blog", what: "Draft saved: \u201cShipping fast without shipping bugs\u201d", when: "1h ago" },
  { who: "Streaks", what: "Ship every day → day 12 logged", when: "3h ago" },
  { who: "Projects", what: "Updated cover image for GlassKid FM", when: "yesterday" },
  { who: "Bucket List", what: "Marked \u201cInternational client in USD\u201d as done", when: "2d ago" },
];

export default function AdminPage() {
  return (
    <>
      <PageHero
        eyebrow="Control Room"
        title="Admin"
        accent="Dashboard."
        description="Overview of everything that matters. Numbers are demo-only right now — hook this up to a real backend when you're ready to make it live."
      >
        <div className="flex flex-wrap gap-2">
          <button className="btn-glow inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold">
            <Plus className="size-4" /> New Post
          </button>
          <button className="btn-ghost-glass inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold">
            <Plus className="size-4" /> New Project
          </button>
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(({ Icon, label, value, delta }) => (
            <div key={label} className="glass-card p-5">
              <div className="flex items-center justify-between">
                <span className="icon-tile">
                  <Icon className="size-5" />
                </span>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">{delta}</span>
              </div>
              <div className="mt-4 text-2xl font-bold">{value}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 grid max-w-6xl gap-6 px-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="chip mb-3">
            <span className="size-1.5 rounded-full bg-primary" /> Collections
          </div>
          <h2 className="text-xl font-bold md:text-2xl">
            Manage <span className="text-gradient">content</span>
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {COLLECTIONS.map(({ Icon, name, count, updated }) => (
              <div key={name} className="glass-card group flex items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-3">
                  <span className="icon-tile">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <div className="text-base font-semibold">{name}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {count} items · updated {updated}
                    </div>
                  </div>
                </div>
                <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-primary">
                  Manage
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="chip mb-3">
            <span className="size-1.5 rounded-full bg-primary" /> Activity
          </div>
          <h2 className="text-xl font-bold md:text-2xl">Recent</h2>
          <div className="glass-card mt-4 divide-y divide-white/5 p-2">
            {RECENT.map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-3">
                <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Activity className="size-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-widest text-primary/80">{r.who}</div>
                  <div className="mt-0.5 truncate text-sm text-foreground">{r.what}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{r.when}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-6 pb-24">
        <div className="glass-card p-6 md:p-8">
          <div className="chip mb-3">
            <span className="size-1.5 rounded-full bg-primary" /> Heads up
          </div>
          <h3 className="text-lg font-bold md:text-xl">This is a static admin preview.</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Numbers, activity and collections are placeholder data. When you&apos;re ready for real
            editing — login, live stats, and CRUD for projects/blog/bucket-list/streaks — connect a
            real database and auth provider and I&apos;ll help wire it up.
          </p>
        </div>
      </section>
    </>
  );
}