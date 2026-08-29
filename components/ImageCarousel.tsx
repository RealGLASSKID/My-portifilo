"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  alt?: string;
  className?: string;
  aspect?: string; // tailwind aspect class
  autoPlayMs?: number; // 0 = off
};

export function ImageCarousel({
  images,
  alt = "Slide",
  className = "",
  aspect = "aspect-[16/10]",
  autoPlayMs = 5000,
}: Props) {
  const slides = images.filter(Boolean);
  const [index, setIndex] = useState(0);

  const len = slides.length;
  const go = useCallback(
    (dir: -1 | 1) => {
      if (len < 2) return;
      setIndex((i) => (i + dir + len) % len);
    },
    [len]
  );

  useEffect(() => {
    if (autoPlayMs <= 0 || len < 2) return;
    const t = setInterval(() => go(1), autoPlayMs);
    return () => clearInterval(t);
  }, [autoPlayMs, go, len]);

  if (len === 0) {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 ${aspect} ${className}`}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(70, 13, 139, 0.7), rgb(16, 13, 38))",
          }}
        />
      </div>
    );
  }

  if (len === 1) {
    return (
      <div className={`relative overflow-hidden rounded-2xl border border-white/10 ${aspect} ${className}`}>
        <Image src={slides[0]} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 ${aspect} ${className}`}>
      {slides.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === index ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src={src}
            alt={`${alt} ${i + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority={i === 0}
          />
        </div>
      ))}

      <button
        type="button"
        aria-label="Previous image"
        onClick={() => go(-1)}
        className="btn-ghost-glass absolute left-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Next image"
        onClick={() => go(1)}
        className="btn-ghost-glass absolute right-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-primary" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      <div className="absolute right-3 top-3 z-10 rounded-full bg-black/40 px-2.5 py-1 text-[0.65rem] font-medium text-white backdrop-blur">
        {index + 1} / {len}
      </div>
    </div>
  );
}
