"use client";

import { useState, type CSSProperties } from "react";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import type { SkillGroup } from "@/data/types";
import { useUI } from "@/components/providers/UIProvider";

type Cat = SkillGroup["cat"];
const CATS: ("All" | Cat)[] = ["All", "Languages", "Backend", "Frontend", "Data", "AI", "Tools"];
const SPANS = [4, 8, 7, 5, 7, 5, 8, 4];
const CAT_COLOR: Record<Cat, string> = {
  Languages: "var(--text-3)",
  Backend: "var(--c-svc)",
  Frontend: "var(--c-ui)",
  Data: "var(--c-data)",
  AI: "var(--c-ai)",
  Tools: "var(--text-3)",
};

const TOTAL_TOOLS = skills.reduce((sum, g) => sum + g.items.length, 0);

function matchProjects(name: string): number[] {
  const n = name.toLowerCase().replace(/\s*\(.*\)/, "").replace(" cache", "").replace(" api", "");
  const out: number[] = [];
  projects.forEach((p, i) => {
    const hit = p.stack.some((raw) => {
      const s = raw.toLowerCase();
      return s.includes(n) || n.includes(s);
    });
    if (hit) out.push(i);
  });
  return out;
}

export function Toolkit() {
  const { openCase } = useUI();
  const [cat, setCat] = useState<"All" | Cat>("All");
  const [selected, setSelected] = useState<{ gi: number; name: string } | null>(null);

  const shown = skills.reduce((sum, g) => (cat === "All" || g.cat === cat ? sum + g.items.length : sum), 0);
  const used = selected ? matchProjects(selected.name) : [];

  return (
    <section id="toolkit">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">Toolkit</span>
          <h2>What I reach for.</h2>
          <p className="sec-sub">Grouped by what each tool does. Filter by layer, then pick a tool to see where I used it.</p>
        </div>
        <div className="tk-top rv">
          <div className="seg" role="group" aria-label="Filter by layer">
            {CATS.map((c) => (
              <button key={c} type="button" aria-pressed={c === cat} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
          <span className="mono" style={{ fontSize: ".72rem", color: "var(--text-3)" }} aria-live="polite">
            {shown} of {TOTAL_TOOLS} tools
          </span>
        </div>
        <div className="card tk-info rv" aria-live="polite">
          {selected ? (
            <>
              <b>{selected.name}</b>
              <span className="chip">{skills[selected.gi].group}</span>
              {used.length > 0 ? (
                <div className="used">
                  <span style={{ color: "var(--text-3)", font: "400 .78rem var(--f-mono)" }}>Used in</span>
                  {used.map((i) => (
                    <button
                      key={i}
                      type="button"
                      className="chip"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => openCase(i, { x: e.clientX, y: e.clientY })}
                    >
                      {projects[i].name}
                    </button>
                  ))}
                </div>
              ) : (
                <span style={{ color: "var(--text-3)", fontSize: ".9rem" }}>An everyday tool across all projects.</span>
              )}
            </>
          ) : (
            <span style={{ color: "var(--text-3)" }}>Select a tool.</span>
          )}
        </div>
        <div className="tkgrid">
          {skills.map((g, gi) => {
            const dim = cat !== "All" && g.cat !== cat;
            const color = CAT_COLOR[g.cat];
            return (
              <article
                key={g.group}
                className={`card tg${dim ? " dim" : ""}`}
                style={{ gridColumn: `span ${SPANS[gi] ?? 6}`, "--c": color } as CSSProperties}
              >
                <h3>
                  <i />
                  {g.group}
                  <small>{g.items.length}</small>
                </h3>
                <div className="chips">
                  {g.items.map((name) => (
                    <button
                      key={name}
                      type="button"
                      className="tk"
                      aria-pressed={selected?.gi === gi && selected.name === name}
                      style={{ "--c": color } as CSSProperties}
                      onClick={() => setSelected({ gi, name })}
                    >
                      <i />
                      {name}
                    </button>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
