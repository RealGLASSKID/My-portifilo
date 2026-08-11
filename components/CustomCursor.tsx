"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return; // don't hijack touch devices

    document.documentElement.classList.add("custom-cursor-active");

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };

    const spawnRipple = (x: number, y: number) => {
      const el = document.createElement("div");
      el.className = "cursor-ripple";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      document.body.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    };

    const onDown = () => {
      ringRef.current?.classList.add("cursor-ring-active");
      spawnRipple(pos.current.x, pos.current.y);
    };
    const onUp = () => {
      ringRef.current?.classList.remove("cursor-ring-active");
    };

    let raf: number;
    const loop = () => {
      // eased trailing follow for the outer ring — creates the "wave" lag effect
      ring.current.x += (pos.current.x - ring.current.x) * 0.15;
      ring.current.y += (pos.current.y - ring.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
      }
      // Batched here (not in onMove) so the full-viewport mask-image on
      // .grid-glow-layer repaints at most once per animation frame instead
      // of once per raw mousemove event.
      document.documentElement.style.setProperty("--mx", `${pos.current.x}px`);
      document.documentElement.style.setProperty("--my", `${pos.current.y}px`);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <>
      <div className="grid-glow-layer" />
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}