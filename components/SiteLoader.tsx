"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "glasskid_splash_done";

export function SiteLoader() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Only on public site, once per browser tab session
    if (pathname?.startsWith("/admin")) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;

    setShow(true);
    const minMs = 2200;
    const t1 = setTimeout(() => setFade(true), minMs);
    const t2 = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setShow(false);
    }, minMs + 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-opacity duration-500 ${
        fade ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-label="Loading"
      role="status"
    >
      {/* Hero portrait background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-portrait.png')" }}
      />
      <div className="absolute inset-0 bg-black/75" />

      {/* Circular GLASSKID text */}
      <div className="relative grid size-44 place-items-center sm:size-56">
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 size-full animate-[spin_8s_linear_infinite]"
        >
          <defs>
            <path
              id="glasskid-circle"
              d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
            />
          </defs>
          <text className="fill-white text-[14px] font-bold uppercase tracking-[0.35em]">
            <textPath href="#glasskid-circle" startOffset="0%">
              GLASSKID • GLASSKID • GLASSKID • GLASSKID •
            </textPath>
          </text>
        </svg>
        <span className="relative text-lg font-bold tracking-tight text-white sm:text-xl">
          GLASSKID
        </span>
      </div>
    </div>
  );
}

/** Small loader for in-page waits (optional) */
export function GlasskidSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`relative grid size-16 place-items-center ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full animate-[spin_6s_linear_infinite]"
      >
        <defs>
          <path
            id="gk-spin-small"
            d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
          />
        </defs>
        <text className="fill-current text-[8px] font-bold uppercase tracking-[0.3em] text-primary">
          <textPath href="#gk-spin-small">GLASSKID • GLASSKID • </textPath>
        </text>
      </svg>
    </div>
  );
}