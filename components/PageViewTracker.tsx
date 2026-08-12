"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getVisitorId() {
  try {
    const key = "gk_vid";
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID?.() || `v_${Math.random().toString(36).slice(2)}_${Date.now()}`;
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const payload = {
      path: pathname,
      visitorId: getVisitorId(),
      referrer: typeof document !== "undefined" ? document.referrer : "",
    };

    // fire-and-forget; prefer sendBeacon for unload safety
    const body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon("/api/analytics", blob);
      } else {
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // ignore
    }
  }, [pathname]);

  return null;
}
