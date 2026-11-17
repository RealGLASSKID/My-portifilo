"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  fallbackSrc?: string;
  alt?: string;
  autoPlayMs?: number;
};

export function HeroGallerySlideshow({
  images,
  fallbackSrc = "/images/hero-portrait.png",
  alt = "GLASSKID",
  autoPlayMs = 3500,
}: Props) {
  const slides = Array.from(new Set(images.filter(Boolean)));
  const list = slides.length > 0 ? slides : [fallbackSrc];
  const [i, setI] = useState(0);

  useEffect(() => {
    if (list.length <= 1) return;
    const t = setInterval(() => setI((v) => (v + 1) % list.length), autoPlayMs);
    return () => clearInterval(t);
  }, [list.length, autoPlayMs]);

  return (
    <div className="glass neon-ring relative overflow-hidden rounded-3xl">
      <div className="relative h-[min(32rem,70vw)] w-full sm:h-[min(32.5rem,55vw)]">
        <Image
          key={list[i]}
          src={list[i]}
          alt={`${alt} ${i + 1}`}
          fill
          className="object-cover transition-opacity duration-700"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={i === 0}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {list.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {list.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-5 bg-white" : "w-1.5 bg-white/40"
              }`}
              aria-label={`Image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}