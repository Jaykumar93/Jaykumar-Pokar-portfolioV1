"use client";

import { Fragment, useState, type ReactNode } from "react";
import { engineering, type EngKey } from "@/data/engineering";
import { useUI } from "@/components/providers/UIProvider";
import { RulesGuard } from "./explainers/RulesGuard";
import { Rag } from "./explainers/Rag";
import { Offline } from "./explainers/Offline";
import { Trace } from "./explainers/Trace";
import { Cache } from "./explainers/Cache";
import { Lock } from "./explainers/Lock";
import { Plan } from "./explainers/Plan";
import { Propose } from "./explainers/Propose";
import { Gps } from "./explainers/Gps";
import { Bulk } from "./explainers/Bulk";
import "./engineering.css";

const EXPLAINERS: Record<EngKey, () => ReactNode> = {
  rules: () => <RulesGuard />,
  rag: () => <Rag />,
  offline: () => <Offline />,
  trace: () => <Trace />,
  cache: () => <Cache />,
  lock: () => <Lock />,
  plan: () => <Plan />,
  propose: () => <Propose />,
  gps: () => <Gps />,
  bulk: () => <Bulk />,
};

export function Engineering() {
  const { engRequest } = useUI();
  // `epoch` changes on every selection (even re-selecting the same tab) so the explainer remounts and resets,
  // which also clears all of its timers.
  const [sel, setSel] = useState({ index: 0, epoch: 0 });
  const [lastNonce, setLastNonce] = useState<number | null>(null);

  // Apply an external request (e.g. from a project card) without an effect.
  if (engRequest && engRequest.nonce !== lastNonce) {
    setLastNonce(engRequest.nonce);
    setSel((s) => ({ index: Math.min(Math.max(engRequest.index, 0), engineering.length - 1), epoch: s.epoch + 1 }));
  }

  const item = engineering[sel.index];

  return (
    <section id="engineering">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">Engineering</span>
          <h2>See the problems I solved.</h2>
          <p className="sec-sub">
            Ten ideas from my work, as small interactive models. Six come from features in Cursus and four from my work at Coditas. Each is labeled with where it comes from. Press run and change the settings. Numbers on screen are illustrative.
          </p>
        </div>
        <div className="eng rv">
          <div className="eng-tabs" role="tablist" aria-label="Concepts">
            {engineering.map((e, i) => (
              <Fragment key={e.key}>
                {(i === 0 || engineering[i - 1].group !== e.group) && (
                  <div className="eng-group" aria-hidden="true">
                    {e.group === "Cursus" ? "Features in Cursus" : "From my work"}
                  </div>
                )}
              <button
                type="button"
                role="tab"
                id={`eng-tab-${e.key}`}
                aria-selected={i === sel.index}
                aria-controls="eng-panel"
                onClick={() => setSel((s) => ({ index: i, epoch: s.epoch + 1 }))}
              >
                <b>{e.title}</b>
                <small>{e.short}</small>
              </button>
              </Fragment>
            ))}
          </div>
          <div className="card xstage" id="eng-panel" role="tabpanel" aria-labelledby={`eng-tab-${item.key}`}>
            <div>
              <span className="chip" style={{ marginBottom: 14 }}>
                {item.source}
              </span>
              <h3>{item.title}</h3>
              <p className="why">{item.why}</p>
            </div>
            <Explainer key={`${item.key}:${sel.epoch}`} k={item.key} />
            <div className="fixed">
              <b>What I did</b>
              <span>{item.did}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Explainer({ k }: { k: EngKey }) {
  return <>{EXPLAINERS[k]()}</>;
}
