"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  alt?: string;
  autoPlayMs?: number;
  urlLabel?: string;
};

export function BrowserMockupSlideshow({
  images,
  alt = "Project preview",
  autoPlayMs = 3000,
  urlLabel = "glasskid.vercel.app",
}: Props) {
  const slides = Array.from(new Set(images.filter(Boolean)));
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), autoPlayMs);
    return () => clearInterval(t);
  }, [slides.length, autoPlayMs]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b12] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_25px_80px_rgba(0,0,0,0.55)]">
      {/* Browser chrome */}
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

      {/* Screen — laptop-ratio screenshots */}
      <div className="relative aspect-[16/10] bg-[#07070c]">
        {slides.length > 0 ? (
          <Image
            key={slides[i]}
            src={slides[i]}
            alt={`${alt} ${i + 1}`}
            fill
            className="object-cover object-top transition-opacity duration-500"
            sizes="(max-width: 768px) 100vw, 55vw"
            priority={i === 0}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary/30 to-[#100d26]">
            <span className="text-sm font-medium text-white/70">{alt}</span>
          </div>
        )}

        {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setI(idx)}
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
  );
}