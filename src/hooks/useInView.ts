"use client";
import { useEffect, useState, type RefObject } from "react";

/** True while the element is intersecting. With once=true it stays true after the first time. */
export function useInView(ref: RefObject<Element | null>, options: { threshold?: number; once?: boolean } = {}): boolean {
  const { threshold = 0.2, once = false } = options;
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            if (once) io.unobserve(e.target);
          } else if (!once) setInView(false);
        });
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, once]);
  return inView;
}
