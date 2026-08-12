"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./_components/AdminSidebar";
import { AdminTopbar } from "./_components/AdminTopbar";
import { AdminAuthGate } from "@/app/admin/_components/AdminAuthGate";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AdminAuthGate>
      {pathname === "/admin/login" ? (
        <>{children}</>
      ) : (
        /* Fixed viewport shell: sidebar stays put, only main scrolls */
        <div className="flex h-dvh max-h-dvh overflow-hidden">
          <AdminSidebar
            mobileOpen={mobileOpen}
            onCloseMobile={() => setMobileOpen(false)}
          />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <AdminTopbar onOpenMobile={() => setMobileOpen(true)} />
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-8">
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminAuthGate>
  );
}
