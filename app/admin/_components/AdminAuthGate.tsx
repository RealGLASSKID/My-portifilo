"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { Loader2 } from "lucide-react";

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined = still checking

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user === undefined) return; // still loading
    if (pathname === "/admin/login") {
      if (user) router.replace("/admin"); // already logged in → go to dashboard
      return;
    }
    if (!user) {
      router.replace("/admin/login");
    }
  }, [user, pathname, router]);

  // Login page: show it (or nothing while redirecting if already logged in)
  if (pathname === "/admin/login") {
    if (user === undefined) {
      return (
        <div className="flex min-h-dvh items-center justify-center">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      );
    }
    if (user) return null; // redirecting to /admin
    return <>{children}</>;
  }

  // Other admin pages: must be logged in
  if (user === undefined) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null; // redirecting to login

  return <>{children}</>;
}