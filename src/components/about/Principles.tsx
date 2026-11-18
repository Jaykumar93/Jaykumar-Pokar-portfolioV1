"use client";

import { useId, useState, type MouseEvent } from "react";
import { principles } from "@/data/about";
import { useUI } from "@/components/providers/UIProvider";

export function Principles() {
  const baseId = useId();
  const { openCase, requestEng } = useUI();
  const [open, setOpen] = useState<readonly boolean[]>(() => principles.map(() => false));

  const toggle = (i: number) => setOpen((prev) => prev.map((v, k) => (k === i ? !v : v)));

  const go = (e: MouseEvent<HTMLButtonElement>, i: number) => {
    const target = principles[i].go;
    if (target.type === "case") openCase(target.index, { x: e.clientX, y: e.clientY });
    else requestEng(target.index);
  };

  return (
    <div className="princ">
      {principles.map((p, i) => {
        const panelId = `${baseId}-pr${i}`;
        return (
          <article key={p.title} className={`card pr${open[i] ? " open" : ""}`}>
            <button type="button" className="pr-h" aria-expanded={open[i]} aria-controls={panelId} onClick={() => toggle(i)}>
              <b>{p.title}</b>
              <span>{p.line}</span>
              <i aria-hidden="true">+</i>
            </button>
            <div className="pr-b" id={panelId}>
              <div>
                <p>{p.proof}</p>
                <button type="button" className="ghost" onClick={(e) => go(e, i)}>
                  {p.label} &rarr;
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
