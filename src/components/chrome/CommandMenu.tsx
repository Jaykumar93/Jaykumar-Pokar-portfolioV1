"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { navLinks, profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { toggleTheme } from "@/lib/theme";
import { useUI } from "@/components/providers/UIProvider";
import "./chrome.css";

interface Command {
  label: string;
  kind: string;
  href?: string;
  external?: boolean;
  run?: () => void;
}

export function CommandMenu() {
  const { paletteOpen, closePalette, openCase } = useUI();
  if (!paletteOpen) return null;
  return <Palette onClose={closePalette} openCase={openCase} />;
}

function Palette({ onClose, openCase }: { onClose: () => void; openCase: (i: number) => void }) {
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(
    () => [
      ...navLinks.map((l) => ({ label: l.label, kind: "Go to", href: `#${l.id}` })),
      ...projects.map((p, i) => ({ label: `Open ${p.name} case study`, kind: "Project", run: () => openCase(i) })),
      { label: "Switch light / dark theme", kind: "Action", run: toggleTheme },
      { label: "Send an email", kind: "Link", href: `mailto:${profile.email}` },
      { label: "Open GitHub", kind: "Link", href: profile.github, external: true },
      { label: "Open LinkedIn", kind: "Link", href: profile.linkedin, external: true },
    ],
    [openCase],
  );

  const items = commands.filter((c) => c.label.toLowerCase().includes(query.trim().toLowerCase()));
  const active = Math.min(sel, Math.max(0, items.length - 1));

  useEffect(() => {
    const prev = document.activeElement;
    input.current?.focus();
    return () => {
      if (prev instanceof HTMLElement) prev.focus();
    };
  }, []);

  const choose = (c: Command) => {
    onClose();
    if (c.run) setTimeout(c.run, 200);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((active + 1) % Math.max(1, items.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((active - 1 + items.length) % Math.max(1, items.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const c = items[active];
      if (!c) return;
      if (c.href) {
        if (c.external) window.open(c.href, "_blank", "noopener");
        else if (c.href.startsWith("mailto:")) window.location.href = c.href;
        else document.getElementById(c.href.slice(1))?.scrollIntoView({ behavior: "smooth" });
      }
      choose(c);
    }
  };

  return (
    <div className="overlay pal show" role="dialog" aria-modal="true" aria-label="Command menu">
      <div className="scrim" onClick={onClose} />
      <div className="panel">
        <input
          ref={input}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSel(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Jump to a section, project or action"
          autoComplete="off"
          aria-label="Search commands"
        />
        <div className="pal-list">
          {items.length === 0 && <div style={{ padding: 14, color: "var(--text-3)", fontSize: ".9rem" }}>No match. Try &quot;projects&quot; or &quot;theme&quot;.</div>}
          {items.map((c, i) => {
            const cls = i === active ? "sel" : undefined;
            const inner = (
              <>
                <span>{c.label}</span>
                <small>{c.kind}</small>
              </>
            );
            if (c.href)
              return (
                <a key={c.label} href={c.href} className={cls} {...(c.external ? { target: "_blank", rel: "noopener" } : {})} onClick={() => choose(c)}>
                  {inner}
                </a>
              );
            return (
              <button key={c.label} type="button" className={cls} onClick={() => choose(c)}>
                {inner}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
