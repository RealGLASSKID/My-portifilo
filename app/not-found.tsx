"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-gradient text-7xl font-bold">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page doesn&apos;t exist yet — it may still be in the works or has been moved.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={goBack}
            className="btn-glow inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold"
          >
            Go back
          </button>
          <Link href="/" className="btn-ghost-glass inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}