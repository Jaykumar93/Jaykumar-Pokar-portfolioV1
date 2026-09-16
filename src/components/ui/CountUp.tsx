"use client";

import { useEffect, useRef, useState } from "react";

const PARTS_RE = /^([^\d]*)(\d+)([^\d]*)$/;

/**
 * Animates a numeric prefix (e.g. "40" in "+40%") up from 0 when scrolled
 * into view, keeping any non-numeric prefix/suffix ("+", "%", "yrs") static.
 */
export function CountUp({ value }: { value: string }) {
  const hasNumber = PARTS_RE.test(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(hasNumber ? "0" : value);

  // Depend only on the primitive `value` string — re-deriving `match` inside
  // a new array on every render and listing it as a dependency (the original
  // bug here) re-subscribes the IntersectionObserver on every state update,
  // which restarts the animation before it can ever finish.
  useEffect(() => {
    const match = value.match(PARTS_RE);
    if (!match || !ref.current) return;
    const [, prefix, numStr, suffix] = match;
    const target = parseInt(numStr, 10);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const duration = 900;
        const start = performance.now();
        function tick(now: number) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(`${prefix}${Math.round(target * eased)}${suffix}`);
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>{display}</span>;
}
