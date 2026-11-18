"use client";

import { useState, type MouseEvent } from "react";
import { projects } from "@/data/projects";
import type { LayerKey } from "@/data/types";
import { useUI } from "@/components/providers/UIProvider";
import { Arrow } from "@/components/ui/Arrow";
import { ProjectVisual, VideoLayer, type CSSVars } from "./Visuals";

const LAYER_NAMES = ["Data", "Services", "Interface", "AI"] as const;
const LAYER_KEYS: LayerKey[] = [0, 1, 2, 3];

function layerVar(k: LayerKey): CSSVars {
  return { "--c": `var(--sl${k})` };
}

export function Projects() {
  const { openCase } = useUI();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [videoRow, setVideoRow] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIdx((cur) => (cur === i ? null : i));
    setVideoRow(null);
  };

  const onOpenCase = (i: number) => (e: MouseEvent<HTMLButtonElement>) => {
    let x = e.clientX;
    let y = e.clientY;
    if (e.detail === 0) {
      // Keyboard activation has no pointer position: expand from the button instead.
      const r = e.currentTarget.getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top + r.height / 2;
    }
    openCase(i, { x, y });
  };

  return (
    <section id="projects">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">Projects</span>
          <h2>Selected work.</h2>
          <p className="sec-sub">
            Open a project to see how it works. Cursus shows real screens from the app. The other visuals are
            illustrative recreations.
          </p>
        </div>
        <p className="leg">
          <span>Layers each project touches:</span>
          {LAYER_KEYS.map((k) => (
            <span key={k}>
              <i className="lf on" style={layerVar(k)} />
              {LAYER_NAMES[k]}
            </span>
          ))}
        </p>
        <div className="prows">
          {projects.map((p, i) => {
            const open = openIdx === i;
            const used = p.layers.map((k) => LAYER_NAMES[k]).join(", ");
            const more = p.stack.length > 6 ? p.stack.length - 6 : 0;
            return (
              <article key={p.name} className={`acc-row${open ? " open" : ""}`}>
                <button
                  type="button"
                  className="acc-h"
                  id={`ph${i}`}
                  aria-expanded={open}
                  aria-controls={`pp${i}`}
                  onClick={() => toggle(i)}
                >
                  <span className="pn">
                    <b>{p.name}</b>
                    <small>
                      {p.status}, {p.tag}
                      {p.former ? `, ${p.former}` : ""}
                    </small>
                  </span>
                  <span className="pd">{p.line}</span>
                  <span className="pl" role="img" aria-label={`Layers used: ${used}`}>
                    {LAYER_KEYS.map((k) => (
                      <i key={k} className={`lf${p.layers.includes(k) ? " on" : ""}`} style={layerVar(k)} />
                    ))}
                  </span>
                  <span className="pm">
                    <b>{p.metric[0]}</b>
                    <small>{p.metric[1]}</small>
                  </span>
                  <span className="pc" aria-hidden="true">+</span>
                </button>
                <div className="pp" id={`pp${i}`} role="region" aria-labelledby={`ph${i}`}>
                  <div className="pp-in">
                    <div className="pv">
                      <ProjectVisual
                        kind={p.vis}
                        play={open}
                        onPlayVideo={p.video ? () => setVideoRow(i) : undefined}
                      />
                      {open && videoRow === i && <VideoLayer onClose={() => setVideoRow(null)} />}
                    </div>
                    <div className="pbody">
                      <p className="lede">{p.desc}</p>
                      <div className="trio">
                        <div><span>The problem</span><p>{p.problem}</p></div>
                        <div><span>What I built</span><p>{p.built}</p></div>
                        <div><span>Result</span><p>{p.result}</p></div>
                      </div>
                      <div className="pfacts">
                        {p.facts.map(([value, label]) => (
                          <div key={label}>
                            <b>{value}</b>
                            {label}
                          </div>
                        ))}
                      </div>
                      <div className="chips">
                        {p.stack.slice(0, 6).map((s) => (
                          <span className="chip" key={s}>{s}</span>
                        ))}
                        {more > 0 && <span className="chip">+{more} more</span>}
                      </div>
                      <div className="pcta">
                        <button type="button" className="btn btn-primary" onClick={onOpenCase(i)}>
                          Open the case study <Arrow />
                        </button>
                        <span className="chip">{p.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
