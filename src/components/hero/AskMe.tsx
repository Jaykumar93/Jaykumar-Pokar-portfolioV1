"use client";

import { useEffect, useMemo, useState } from "react";
import { askItems, type AskAction } from "@/data/ask";
import { profile } from "@/data/profile";
import { useUI } from "@/components/providers/UIProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Piece = { kind: "word"; text: string } | { kind: "layer"; k: number };

function toPieces(answer: string): Piece[] {
  return answer.split(/(\{L\d\})/).flatMap<Piece>((part) => {
    const m = /^\{L(\d)\}$/.exec(part);
    if (m) return [{ kind: "layer", k: Number(m[1]) }];
    return part
      .split(" ")
      .filter(Boolean)
      .map((text) => ({ kind: "word" as const, text }));
  });
}

export function AskMe() {
  const { openCase, requestEng, scrollToId } = useUI();
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(0);
  const item = askItems[index];
  const pieces = useMemo(() => toPieces(item.a), [item.a]);
  const visible = reduced ? pieces.length : shown;
  const finished = visible >= pieces.length;

  useEffect(() => {
    if (reduced) return;
    const total = pieces.length;
    const t0 = performance.now();
    const id = setInterval(() => {
      const n = Math.floor((performance.now() - t0) / 22);
      setShown(n);
      if (n >= total) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [index, reduced, pieces]);

  const select = (i: number) => {
    setIndex(i);
    setShown(0);
  };

  const run = (a: AskAction, e: React.MouseEvent) => {
    if (a.type === "go") scrollToId(a.id);
    else if (a.type === "case") openCase(a.index, { x: e.clientX, y: e.clientY });
    else if (a.type === "eng") requestEng(a.index);
    else if (a.type === "mail") window.location.assign(`mailto:${profile.email}`);
    else window.open(a.url, "_blank", "noopener");
  };

  return (
    <div className="card ask" id="ask">
      <div className="ask-h">
        <b>Ask me</b>
        <span>Pick a question</span>
      </div>
      <div className="ask-q" role="tablist" aria-label="Questions">
        {askItems.map((x, i) => (
          <button key={x.q} type="button" role="tab" aria-selected={i === index} onClick={() => select(i)}>
            <span>{x.q}</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        ))}
      </div>
      <div className="ask-a" aria-live="polite">
        <p>
          {pieces.map((p, i) => (
            <span key={`${index}-${i}`}>
              {p.kind === "layer" ? (
                <i className="lf on" style={{ "--c": `var(--sl${p.k})` } as React.CSSProperties} />
              ) : (
                <span className={`aw${i < visible ? " in" : ""}`}>{p.text}</span>
              )}{" "}
            </span>
          ))}
        </p>
        <div className="ask-act">
          {finished &&
            item.actions.map((a) => (
              <button key={a.label} type="button" className="ghost" onClick={(e) => run(a, e)}>
                {a.label}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
