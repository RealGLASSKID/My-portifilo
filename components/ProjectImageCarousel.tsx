"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  name: string;
  /** Cover + gallery — duplicates removed */
  images: string[];
  featured?: boolean;
  /** Tailwind aspect class — larger for laptop screenshots */
  aspect?: string;
  autoPlayMs?: number;
  className?: string;
  sizes?: string;
};

export function ProjectImageCarousel({
  name,
  images,
  featured,
  aspect = "aspect-[16/9]",
  autoPlayMs = 3000,
  className = "",
  sizes = "(max-width: 768px) 100vw, 40vw",
}: Props) {
  const slides = Array.from(new Set(images.filter(Boolean)));
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length <= 1 || autoPlayMs <= 0) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), autoPlayMs);
    return () => clearInterval(t);
  }, [slides.length, autoPlayMs]);

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setI((v) => (v - 1 + slides.length) % slides.length);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setI((v) => (v + 1) % slides.length);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/5 bg-white/5 ${aspect} ${className}`}
    >
      {slides.length > 0 ? (
        <Image
          key={slides[i]}
          src={slides[i]}
          alt={`${name} screenshot ${i + 1}`}
          fill
          className="object-cover object-top transition duration-500"
          sizes={sizes}
          priority={i === 0}
        />
      ) : (
        <div
          className="absolute inset-0 grid place-items-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(70, 13, 139, 0.7), rgb(16, 13, 38))",
          }}
        >
          <span className="px-4 text-center text-xl font-bold tracking-tight text-white/90">
            {name.toUpperCase()}
          </span>
        </div>
      )}

      {featured && (
        <div className="chip absolute right-3 top-3 z-10 !text-[10px]">Featured</div>
      )}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight className="size-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? "w-4 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
