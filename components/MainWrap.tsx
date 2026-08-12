"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function MainWrap({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return <main className={isAdmin ? "" : "pt-20 sm:pt-24 md:pt-28"}>{children}</main>;
}
