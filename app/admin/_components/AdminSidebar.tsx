"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Music,
  ListChecks,
  Flame,
  Link as LinkIcon,
  MessageSquare,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  X,
  Images,
  BarChart3,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  Icon: typeof LayoutDashboard;
  badge?: number;
};

const NAV: NavItem[] = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", Icon: FolderKanban },
  { href: "/admin/gallery", label: "Gallery", Icon: Images },
  { href: "/admin/blog", label: "Blog Posts", Icon: FileText },
  { href: "/admin/music", label: "Music", Icon: Music },
  { href: "/admin/bucket-list", label: "Bucket List", Icon: ListChecks },
  { href: "/admin/streaks", label: "Streaks", Icon: Flame },
  { href: "/admin/links", label: "Links", Icon: LinkIcon },
  { href: "/admin/messages", label: "Messages", Icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
];

export function AdminSidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("admin-sidebar-collapsed");
    if (saved === "1") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((v) => {
      window.localStorage.setItem("admin-sidebar-collapsed", !v ? "1" : "0");
      return !v;
    });
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-2 px-4 py-5">
        <Link href="/" className="flex items-center gap-1 font-bold tracking-tight">
          <span className={`text-lg text-foreground transition-all ${collapsed ? "hidden" : "inline"}`}>
            GLASSKID
          </span>
          <span className="text-primary text-lg leading-none">.</span>
        </Link>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3">
        {NAV.map(({ href, label, Icon, badge }) => (
          <Link
            key={href}
            href={href}
            onClick={onCloseMobile}
            title={collapsed ? label : undefined}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive(href)
                ? "bg-primary/15 text-primary shadow-[0_0_0_1px_oklch(0.65_0.24_295_/_0.35)_inset]"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
          >
            <Icon className="size-[1.125rem] shrink-0" />
            <span className={collapsed ? "hidden" : "flex-1 truncate"}>{label}</span>
            {!collapsed && badge ? (
              <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[0.625rem] font-semibold text-primary">
                {badge}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>

      <div className="shrink-0 space-y-1 border-t border-white/5 px-3 py-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
        >
          <ExternalLink className="size-[1.125rem] shrink-0" />
          <span className={collapsed ? "hidden" : "flex-1 truncate"}>View site</span>
        </Link>
        <button
          type="button"
          onClick={toggleCollapsed}
          className="hidden w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-white/5 hover:text-foreground lg:flex"
        >
          {collapsed ? (
            <ChevronsRight className="size-[1.125rem] shrink-0" />
          ) : (
            <ChevronsLeft className="size-[1.125rem] shrink-0" />
          )}
          <span className={collapsed ? "hidden" : "flex-1 truncate"}>Collapse</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: fixed-height rail that never scrolls with page content */}
      <aside
        className={`glass hidden h-full shrink-0 rounded-none border-y-0 border-l-0 transition-[width] duration-200 lg:block ${
          collapsed ? "w-[4.75rem]" : "w-64"
        }`}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onCloseMobile} />
          <aside className="glass animate-fade-up absolute left-0 top-0 h-dvh w-[min(18rem,85vw)] rounded-none border-y-0 border-l-0">
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close menu"
              className="btn-ghost-glass absolute right-3 top-4 grid size-9 place-items-center rounded-full"
            >
              <X className="size-4" />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
