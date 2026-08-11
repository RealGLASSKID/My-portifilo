import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "./_components/AdminPageHeader";
import { posts } from "@/lib/blog";
import { db } from "@/lib/firebase-admin";
import {
  Activity,
  FileText,
  FolderKanban,
  ListChecks,
  Music,
  Flame,
  Link as LinkIcon,
  MessageSquare,
  Images,
  Plus,
  ArrowUpRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin — GLASSKID",
  description: "Private control room.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function count(collection: string) {
  try {
    const snap = await db.collection(collection).count().get();
    return snap.data().count;
  } catch {
    const snap = await db.collection(collection).get();
    return snap.size;
  }
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(ts).toLocaleDateString();
}

export default async function AdminPage() {
  const [projectsCount, galleryCount, messagesCount, unreadCount] = await Promise.all([
    count("projects"),
    count("gallery"),
    count("messages"),
    count("messages").then(async () => {
      try {
        const snap = await db.collection("messages").where("read", "==", false).count().get();
        return snap.data().count;
      } catch {
        const snap = await db.collection("messages").where("read", "==", false).get();
        return snap.size;
      }
    }),
  ]);

  let recentMessages: { name: string; subject: string; createdAt: number }[] = [];
  try {
    const snap = await db.collection("messages").orderBy("createdAt", "desc").limit(5).get();
    recentMessages = snap.docs.map((d) => {
      const data = d.data();
      return {
        name: data.name as string,
        subject: data.subject as string,
        createdAt: data.createdAt as number,
      };
    });
  } catch {
    // empty
  }

  const STATS = [
    { Icon: FolderKanban, label: "Projects", value: String(projectsCount), delta: "live" },
    { Icon: Images, label: "Gallery photos", value: String(galleryCount), delta: "live" },
    { Icon: MessageSquare, label: "Messages", value: String(messagesCount), delta: `${unreadCount} unread` },
    { Icon: FileText, label: "Blog posts", value: String(posts.length), delta: "static" },
  ];

  const COLLECTIONS = [
    { Icon: FolderKanban, name: "Projects", href: "/admin/projects", count: projectsCount },
    { Icon: Images, name: "Gallery", href: "/admin/gallery", count: galleryCount },
    { Icon: FileText, name: "Blog Posts", href: "/admin/blog", count: posts.length },
    { Icon: MessageSquare, name: "Messages", href: "/admin/messages", count: messagesCount },
    { Icon: Music, name: "Music Releases", href: "/admin/music", count: "—" },
    { Icon: ListChecks, name: "Bucket List", href: "/admin/bucket-list", count: "—" },
    { Icon: Flame, name: "Streaks", href: "/admin/streaks", count: "—" },
    { Icon: LinkIcon, name: "Links", href: "/admin/links", count: "—" },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Control Room"
        title="Overview"
        description="Live counts from Firestore for projects, gallery and messages."
      >
        <Link
          href="/admin/projects"
          className="btn-glow inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
        >
          <Plus className="size-4" /> New Project
        </Link>
        <Link
          href="/admin/gallery"
          className="btn-ghost-glass inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
        >
          <Plus className="size-4" /> Add Photo
        </Link>
      </AdminPageHeader>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ Icon, label, value, delta }) => (
          <div key={label} className="glass-card p-5">
            <div className="flex items-center justify-between">
              <span className="icon-tile">
                <Icon className="size-5" />
              </span>
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                {delta}
              </span>
            </div>
            <div className="mt-4 text-2xl font-bold">{value}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="chip mb-3">
            <span className="size-1.5 rounded-full bg-primary" /> Collections
          </div>
          <h2 className="text-xl font-bold md:text-2xl">
            Manage <span className="text-gradient">content</span>
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {COLLECTIONS.map(({ Icon, name, href, count }) => (
              <Link
                key={name}
                href={href}
                className="glass-card group flex items-center justify-between gap-4 p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="icon-tile">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <div className="text-base font-semibold">{name}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{count} items</div>
                  </div>
                </div>
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/10 text-muted-foreground transition group-hover:border-primary/40 group-hover:text-primary">
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="chip mb-3">
            <span className="size-1.5 rounded-full bg-primary" /> Recent messages
          </div>
          <h2 className="text-xl font-bold md:text-2xl">Inbox</h2>
          <div className="glass-card mt-4 divide-y divide-white/5 p-2">
            {recentMessages.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">No messages yet</div>
            )}
            {recentMessages.map((r, i) => (
              <Link
                key={i}
                href="/admin/messages"
                className="flex items-start gap-3 p-3 transition hover:bg-white/5"
              >
                <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Activity className="size-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-widest text-primary/80">{r.name}</div>
                  <div className="mt-0.5 truncate text-sm text-foreground">{r.subject}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{timeAgo(r.createdAt)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </> 
  );
} 