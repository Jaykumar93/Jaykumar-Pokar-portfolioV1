"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient decorative shapes that drift with cursor position — rebuilt from
 * studying riccardozanutta.com's hero: the shapes are NOT auto-animating, they
 * only move in response to mousemove, each at a different depth/speed for a
 * layered parallax feel.
 */
const SHAPES = [
  { top: "12%", left: "8%", size: 22, depth: 0.05, kind: "triangle" as const },
  { top: "20%", left: "88%", size: 16, depth: 0.08, kind: "ring" as const },
  { top: "68%", left: "6%", size: 14, depth: 0.1, kind: "tick" as const },
  { top: "78%", left: "92%", size: 20, depth: 0.06, kind: "swirl" as const },
  { top: "40%", left: "94%", size: 12, depth: 0.12, kind: "dot" as const },
  { top: "8%", left: "45%", size: 10, depth: 0.07, kind: "tick" as const },
  { top: "88%", left: "40%", size: 18, depth: 0.055, kind: "triangle" as const },
  { top: "32%", left: "4%", size: 12, depth: 0.09, kind: "dot" as const },
  { top: "55%", left: "48%", size: 14, depth: 0.13, kind: "ring" as const },
  { top: "4%", left: "68%", size: 10, depth: 0.1, kind: "dot" as const },
  { top: "60%", left: "80%", size: 16, depth: 0.065, kind: "swirl" as const },
  { top: "90%", left: "12%", size: 12, depth: 0.095, kind: "tick" as const },
  { top: "48%", left: "20%", size: 9, depth: 0.14, kind: "dot" as const },
  { top: "16%", left: "24%", size: 15, depth: 0.075, kind: "ring" as const },
];

export function ParallaxShapes() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const shapes = Array.from(container.children) as HTMLElement[];

    function handleMove(e: MouseEvent) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      shapes.forEach((el, i) => {
        const depth = SHAPES[i].depth;
        const rotate = (dx + dy) * depth * 0.15;
        el.style.transform = `translate(${dx * depth}px, ${dy * depth}px) rotate(${rotate}deg)`;
      });
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {SHAPES.map((s, i) => (
        <div
          key={i}
          className="absolute opacity-40 transition-transform duration-300 ease-out"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
        >
          <ShapeIcon kind={s.kind} />
        </div>
      ))}
    </div>
  );
}

function ShapeIcon({ kind }: { kind: "triangle" | "ring" | "tick" | "swirl" | "dot" }) {
  const stroke = "currentColor";
  switch (kind) {
    case "triangle":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-full w-full text-[#ff5a2b]">
          <path d="M12 3L21 19H3L12 3Z" stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case "ring":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-full w-full text-[#35c1ff]">
          <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case "tick":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-full w-full text-[#ff5a2b]">
          <path d="M6 18L18 6" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "swirl":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-full w-full text-[#35c1ff]">
          <path d="M4 12a8 8 0 1 1 4 6.9" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "dot":
      return <div className="h-full w-full rounded-full bg-[#ff5a2b]" />;
  }
}
