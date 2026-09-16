"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_/[]{}=+*^#$%";

function scramble(text: string, revealCount: number) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    if (text[i] === " ") {
      out += " ";
    } else if (i < revealCount) {
      out += text[i];
    } else {
      out += CHARSET[Math.floor(Math.random() * CHARSET.length)];
    }
  }
  return out;
}

/**
 * Matrix-style decode effect: characters flicker through random glyphs
 * before locking in left-to-right, resolving within `duration` regardless
 * of string length (short strings get more flicker per character, long
 * strings resolve faster per character so the total stays bounded).
 *
 * Renders the real text immediately (no hydration mismatch, no-JS/SEO-safe)
 * but stays visually hidden until its `delay` elapses, so it never flashes
 * the resolved text before the scramble starts — it pops in already
 * decoding. aria-label always carries the real string for screen readers.
 */
export function ScrambleText({
  text,
  as: Tag = "span",
  className,
  style,
  delay = 0,
  duration = 700,
}: {
  text: string;
  as?: "span" | "h1" | "p" | "div";
  className?: string;
  style?: CSSProperties;
  delay?: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(text);
  const [started, setStarted] = useState(false);
  const frame = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStarted(true);
      return;
    }

    const flickerFactor = text.length > 18 ? 1 : 3;
    const totalTicks = Math.max(1, text.length * flickerFactor);
    const tickMs = Math.max(12, duration / totalTicks);

    let interval: ReturnType<typeof setInterval> | undefined;
    const startTimeout = setTimeout(() => {
      setDisplay(scramble(text, 0));
      setStarted(true);
      interval = setInterval(() => {
        frame.current += 1;
        const revealCount = Math.min(text.length, Math.floor(frame.current / flickerFactor));
        setDisplay(scramble(text, revealCount));
        if (revealCount >= text.length) {
          clearInterval(interval);
        }
      }, tickMs);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(interval);
    };
  }, [text, delay, duration]);

  return (
    <Tag
      className={className}
      style={{ ...style, visibility: started ? "visible" : "hidden" }}
      aria-label={text}
    >
      {display}
    </Tag>
  );
}
