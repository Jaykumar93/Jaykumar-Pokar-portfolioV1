"use client";

import { useEffect, useState } from "react";
import styles from "./PrototypeNav.module.css";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const SCROLL_DURATION_MS = 900;
const NAV_OFFSET = 84;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollTo(target: Element) {
  const startY = window.scrollY;
  const endY = Math.max(0, startY + target.getBoundingClientRect().top - NAV_OFFSET);
  const startTime = performance.now();

  function step(now: number) {
    const progress = Math.min((now - startTime) / SCROLL_DURATION_MS, 1);
    window.scrollTo(0, startY + (endY - startY) * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/**
 * Nav merged directly into the hero: transparent with mix-blend-mode:
 * difference at rest, so it reads as part of the hero rather than a bar
 * stacked on top of it. Once the visitor actually scrolls, it picks up a
 * solid ink pill + blur — otherwise it stays invisible-ish over content
 * further down the page, which read as "no nav" rather than "merged nav".
 */
export function PrototypeNav({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }
    smoothScrollTo(target);
  }

  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("");

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <a href="#top" className={styles.logo} onClick={(e) => handleNavClick(e, "#top")}>
        {initials}
      </a>
      <ul className={styles.links}>
        {LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href} onClick={(e) => handleNavClick(e, l.href)}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
