"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/data/profile";
import { useUI } from "@/components/providers/UIProvider";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  const { openPalette } = useUI();
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const inBand = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? inBand.add(e.target.id) : inBand.delete(e.target.id)));
        setActive(navLinks.find((l) => inBand.has(l.id))?.id ?? "");
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    navLinks.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <header className="nav glass" id="nav">
      <a className="brand" href="#top" aria-label="Jaykumar Pokar, back to top">
        <span className="mark">JP</span>
        <span>Jaykumar Pokar</span>
      </a>
      <nav className="links" aria-label="Sections">
        {navLinks.map((l) => (
          <a key={l.id} href={`#${l.id}`} className={active === l.id ? "active" : undefined}>
            {l.label}
          </a>
        ))}
      </nav>
      <div className="nav-r">
        <button className="kbd" type="button" onClick={openPalette} aria-label="Open command menu">
          <span>Jump to</span>
          <kbd>Ctrl K</kbd>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
