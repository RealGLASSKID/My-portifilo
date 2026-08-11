"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Download, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/services", label: "Services" },
  { to: "/music", label: "Music" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

const MORE = [
  { to: "/gallery", label: "Gallery" },
  { to: "/bucket-list", label: "Bucket List" },
  { to: "/streaks", label: "Streaks" },
  { to: "/products", label: "Products" },
  { to: "/testify", label: "Testify" },
  { to: "/links", label: "All Links" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [moreOpen]);

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[min(1200px,calc(100%-2rem))] -translate-x-1/2">
      <nav className="glass neon-ring flex items-center justify-between rounded-2xl px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-1 font-bold tracking-tight">
          <span className="text-lg text-foreground">GLASSKID</span>
          <span className="text-primary text-lg leading-none">.</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <li key={n.to}>
              <Link
                href={n.to}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  isActive(n.to) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {n.label}
              </Link>
            </li>
          ))}

          <li className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              More <ChevronDown className={`size-4 transition ${moreOpen ? "rotate-180" : ""}`} />
            </button>
            {moreOpen && (
              <div className="glass animate-fade-up absolute right-0 top-full mt-2 w-52 rounded-xl p-2">
                <ul className="flex flex-col">
                  {MORE.map((m) => (
                    <li key={m.to}>
                      <Link
                        href={m.to}
                        onClick={() => setMoreOpen(false)}
                        className={`block rounded-lg px-3 py-2 text-sm transition hover:bg-white/5 hover:text-primary ${
                          isActive(m.to) ? "text-foreground bg-white/5" : "text-muted-foreground"
                        }`}
                      >
                        {m.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="/files/resume.pdf"
            download
            className="btn-glow hidden items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold md:inline-flex"
          >
            Resume <Download className="size-4" />
          </a>

          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="btn-ghost-glass inline-flex size-10 items-center justify-center rounded-xl md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass mt-2 max-h-[70vh] overflow-y-auto rounded-2xl p-3 md:hidden animate-fade-up">
          <ul className="flex flex-col">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  href={n.to}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm hover:bg-white/5 hover:text-primary ${
                    isActive(n.to) ? "text-foreground bg-white/5" : "text-muted-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 px-3 text-[10px] uppercase tracking-widest text-muted-foreground">More</li>
            {MORE.map((m) => (
              <li key={m.to}>
                <Link
                  href={m.to}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm hover:bg-white/5 hover:text-primary ${
                    isActive(m.to) ? "text-foreground bg-white/5" : "text-muted-foreground"
                  }`}
                >
                  {m.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="/files/resume.pdf"
                download
                className="btn-glow flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
              >
                Resume <Download className="size-4" />
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}