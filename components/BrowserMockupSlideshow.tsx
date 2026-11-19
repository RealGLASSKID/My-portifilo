"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";

type Props = {
  images: string[];
  alt?: string;
  autoPlayMs?: number;
  urlLabel?: string;
  /** When true, clicking the image opens a full-screen lightbox with arrows */
  enableLightbox?: boolean;
};

export function BrowserMockupSlideshow({
  images,
  alt = "Project preview",
  autoPlayMs = 3000,
  urlLabel = "glasskid.vercel.app",
  enableLightbox = true,
}: Props) {
  const slides = Array.from(new Set(images.filter(Boolean)));
  const [i, setI] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const hasMultiple = slides.length > 1;

  const go = useCallback(
    (dir: -1 | 1) => {
      if (!hasMultiple) return;
      setI((v) => (v + dir + slides.length) % slides.length);
    },
    [hasMultiple, slides.length]
  );

  useEffect(() => {
    if (!hasMultiple || lightbox || autoPlayMs <= 0) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), autoPlayMs);
    return () => clearInterval(t);
  }, [hasMultiple, slides.length, autoPlayMs, lightbox]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, go]);

  useEffect(() => {
    if (!lightbox) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b12] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_25px_80px_rgba(0,0,0,0.55)]">
        <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-3 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-center">
            <div className="truncate rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-muted-foreground">
              {urlLabel}
            </div>
          </div>
          <span className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            Preview
          </span>
        </div>

        <div className="group relative aspect-[16/10] bg-[#07070c]">
          {slides.length > 0 ? (
            <button
              type="button"
              className="absolute inset-0 block h-full w-full cursor-zoom-in"
              onClick={() => enableLightbox && setLightbox(true)}
              aria-label="Open image gallery"
            >
              <Image
                key={slides[i]}
                src={slides[i]}
                alt={`${alt} ${i + 1}`}
                fill
                className="object-cover object-top transition-opacity duration-500"
                sizes="(max-width: 768px) 100vw, 55vw"
                priority={i === 0}
              />
            </button>
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary/30 to-[#100d26]">
              <span className="text-sm font-medium text-white/70">{alt}</span>
            </div>
          )}

          {slides.length > 0 && enableLightbox && (
            <div className="pointer-events-none absolute right-3 top-3 rounded-lg border border-white/15 bg-black/50 p-1.5 opacity-0 backdrop-blur transition group-hover:opacity-100">
              <Expand className="size-4 text-white" />
            </div>
          )}

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute left-2 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/50 text-white opacity-0 backdrop-blur transition hover:bg-black/70 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute right-2 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/50 text-white opacity-0 backdrop-blur transition hover:bg-black/70 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="size-4" />
              </button>
            </>
          )}

          {hasMultiple && (
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setI(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === i ? "w-5 bg-white" : "w-1.5 bg-white/35"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {lightbox && slides.length > 0 && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>

          {hasMultiple && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute left-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 md:left-6"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          <div
            className="relative h-[min(85vh,900px)] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={slides[i]}
              src={slides[i]}
              alt={`${alt} ${i + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
            {hasMultiple && (
              <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                {i + 1} / {slides.length}
              </p>
            )}
          </div>

          {hasMultiple && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 md:right-6"
              aria-label="Next image"
            >
              <ChevronRight className="size-6" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
