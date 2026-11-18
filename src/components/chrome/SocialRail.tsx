"use client";

import { useEffect, useRef } from "react";
import { profile } from "@/data/profile";
import { Arrow } from "@/components/ui/Arrow";
import "./social.css";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.13 20.45H3.56V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.08.78 2.18 0 1.57-.01 2.84-.01 3.23 0 .3.2.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

/** `solid` twins are filled ink buttons on the page; `line` twins are outlined. */
const SOCIALS = [
  { key: "linkedin", label: "LinkedIn", href: profile.linkedin, external: true, Icon: LinkedInIcon, kind: "line", ghostLabel: "LinkedIn", arrow: false },
  { key: "github", label: "GitHub", href: profile.github, external: true, Icon: GitHubIcon, kind: "line", ghostLabel: "GitHub", arrow: false },
  { key: "email", label: "Email", href: `mailto:${profile.email}`, external: false, Icon: MailIcon, kind: "solid", ghostLabel: profile.email, arrow: true },
] as const;

const CIRCLE = 40;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Floating social links. Each button reveals its label on hover or focus. As the Contact section scrolls into
 * view, one button at a time is on screen: the floating circle is replaced by a morphing copy that grows into the
 * matching Contact button (`data-dock`), and at arrival the real button takes over in the same spot.
 */
export function SocialRail() {
  const railRef = useRef<HTMLElement>(null);
  const items = useRef(new Map<string, HTMLAnchorElement>());
  const ghosts = useRef(new Map<string, HTMLDivElement>());

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = new Map<string, HTMLElement>();
    document.querySelectorAll<HTMLElement>("[data-dock]").forEach((el) => {
      if (!el.closest(".rail") && el.dataset.dock) targets.set(el.dataset.dock, el);
    });

    const update = () => {
      const rail = railRef.current;
      if (!rail) return;
      const rr = rail.getBoundingClientRect();
      // On small screens the rail is hidden, so the page buttons are simply shown.
      const railVisible = rr.width > 0;
      const vh = window.innerHeight;
      SOCIALS.forEach(({ key, kind }) => {
        const item = items.current.get(key);
        const ghost = ghosts.current.get(key);
        const target = targets.get(key);
        if (!item || !ghost || !target) return;
        if (!railVisible) {
          target.classList.add("docked");
          ghost.style.visibility = "hidden";
          return;
        }
        const tr = target.getBoundingClientRect();
        const ty = tr.top + tr.height / 2;
        // Progress runs over 260px of the page scrolling up from the bottom edge, so it always completes by the end of the page.
        const p = clamp01((vh - ty - 100) / 260);
        const s = p * p * (3 - 2 * p);

        if (reduced) {
          const docked = p > 0.5;
          target.classList.toggle("docked", docked);
          item.style.visibility = docked ? "hidden" : "";
          ghost.style.visibility = "hidden";
          return;
        }

        const atRest = p <= 0;
        const arrived = p >= 1;
        target.classList.toggle("docked", arrived);
        item.style.visibility = atRest ? "" : "hidden";
        item.style.pointerEvents = atRest ? "" : "none";
        if (atRest || arrived) {
          ghost.style.visibility = "hidden";
          return;
        }

        const startLeft = rr.left + item.offsetLeft + item.offsetWidth - CIRCLE;
        const startTop = rr.top + item.offsetTop;
        const x = lerp(startLeft, tr.left, s);
        const y = lerp(startTop, tr.top, s);
        ghost.style.visibility = "visible";
        ghost.style.transform = `translate(${x}px, ${y}px)`;
        ghost.style.width = `${lerp(CIRCLE, tr.width, s)}px`;
        ghost.style.height = `${lerp(CIRCLE, tr.height, s)}px`;
        ghost.style.borderRadius = `${lerp(20, 8, s)}px`;
        ghost.style.fontSize = `${lerp(0.85, 0.95, s)}rem`;
        if (kind === "line") {
          ghost.style.background = `color-mix(in srgb, var(--text) ${Math.round((1 - s) * 100)}%, transparent)`;
          ghost.style.borderColor = `color-mix(in srgb, var(--line) ${Math.round(s * 100)}%, transparent)`;
          ghost.style.color = `color-mix(in srgb, var(--text) ${Math.round(s * 100)}%, var(--bg))`;
        }
        ghost.style.setProperty("--ic", String(clamp01(1 - s / 0.45)));
        ghost.style.setProperty("--lb", String(clamp01((s - 0.45) / 0.4)));
      });
    };

    targets.forEach((t) => t.classList.add("dock-target"));
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    document.fonts?.ready.then(update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      targets.forEach((t) => t.classList.remove("dock-target", "docked"));
    };
  }, []);

  return (
    <>
      <nav className="rail" ref={railRef} aria-label="Social links">
        {SOCIALS.map(({ key, label, href, external, Icon }) => (
          <a
            key={key}
            ref={(el) => {
              if (el) items.current.set(key, el);
              else items.current.delete(key);
            }}
            href={href}
            className="rail-item"
            data-dock={key}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label={label}
          >
            <span className="rail-label">{label}</span>
            <span className="rail-icon">
              <Icon />
            </span>
          </a>
        ))}
      </nav>
      {SOCIALS.map(({ key, kind, Icon, ghostLabel, arrow }) => (
        <div
          key={key}
          ref={(el) => {
            if (el) ghosts.current.set(key, el);
            else ghosts.current.delete(key);
          }}
          className={`rail-ghost ${kind}`}
          aria-hidden="true"
        >
          <span className="g-ic">
            <Icon />
          </span>
          <span className="g-lb">
            {ghostLabel}
            {arrow && <Arrow />}
          </span>
        </div>
      ))}
    </>
  );
}
