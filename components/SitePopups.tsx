"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import type { PopupAd } from "@/app/admin/popups/actions";

const STORAGE_KEY = "glasskid_popup_dismiss";

type DismissMap = Record<string, number>; // id -> dismissedAt ms

function readDismissed(): DismissMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as DismissMap;
  } catch {
    return {};
  }
}

function writeDismissed(map: DismissMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

function isCoolingDown(id: string, cooldownDays: number, locked: boolean): boolean {
  const map = readDismissed();
  const at = map[id];
  if (!at) return false;
  // locked hire: only hide for this browser tab session via sessionStorage
  if (locked || cooldownDays <= 0) {
    return sessionStorage.getItem(`popup_sess_${id}`) === "1";
  }
  const ms = cooldownDays * 24 * 60 * 60 * 1000;
  return Date.now() - at < ms;
}

function markDismissed(id: string, locked: boolean, cooldownDays: number) {
  if (locked || cooldownDays <= 0) {
    sessionStorage.setItem(`popup_sess_${id}`, "1");
  }
  const map = readDismissed();
  map[id] = Date.now();
  writeDismissed(map);
}

export function SitePopups({ popups }: { popups: PopupAd[] }) {
  const pathname = usePathname() || "/";
  const isAdmin = pathname.startsWith("/admin");
  const [active, setActive] = useState<PopupAd | null>(null);

  const candidates = useMemo(() => {
    if (isAdmin) return [];
    return [...popups]
      .filter((p) => p.enabled !== false)
      .filter((p) => (p.pages === "home" ? pathname === "/" : true))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [popups, pathname, isAdmin]);

  useEffect(() => {
    if (isAdmin || !candidates.length) {
      setActive(null);
      return;
    }

    // Pick first popup that is not cooling down
    const next = candidates.find(
      (p) => !isCoolingDown(p.id, p.cooldownDays ?? 1, !!p.locked)
    );
    if (!next) {
      setActive(null);
      return;
    }

    const delay = Math.max(0, (next.delaySeconds ?? 8) * 1000);
    const t = setTimeout(() => setActive(next), delay);
    return () => clearTimeout(t);
  }, [candidates, isAdmin, pathname]);

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  if (!active) return null;

  const close = () => {
    markDismissed(active.id, !!active.locked, active.cooldownDays ?? 1);
    setActive(null);
  };

  const media = active.mediaUrl?.trim();
  const showMedia = active.mediaType !== "none" && !!media;

  const isExternal = (url: string) => /^https?:\/\//i.test(url);

  const Btn = ({
    href,
    label,
    primary,
  }: {
    href: string;
    label: string;
    primary?: boolean;
  }) => {
    if (!href || !label) return null;
    const cls = primary
      ? "btn-glow inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold"
      : "btn-ghost-glass inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold";
    // fix typo conf
    const className = primary
      ? "btn-glow inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold"
      : "btn-ghost-glass inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold";
    if (isExternal(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={close}>
          {label}
        </a>
      );
    }
    return (
      <Link href={href} className={className} onClick={close}>
        {label}
      </Link>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={active.title}
      onClick={close}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#0c0a14] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full border border-white/15 bg-black/50 text-white transition hover:bg-white/15"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <div className={`grid items-stretch ${showMedia ? "md:grid-cols-2" : ""}`}>
          {/* Text */}
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <h2 className="pr-10 text-2xl font-bold tracking-tight sm:text-3xl">{active.title}</h2>
            {active.body ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {active.body}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <Btn href={active.buttonUrl} label={active.buttonLabel} primary />
              <Btn href={active.secondaryUrl} label={active.secondaryLabel} />
            </div>
          </div>

          {/* Media */}
          {showMedia ? (
            <div className="relative min-h-[220px] bg-black/40 md:min-h-[320px]">
              {active.mediaType === "video" ? (
                <video
                  key={media}
                  src={media}
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <Image
                  src={media!}
                  alt={active.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
