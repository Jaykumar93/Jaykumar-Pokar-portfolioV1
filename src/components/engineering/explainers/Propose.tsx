"use client";

import { useState } from "react";
import { XRes, type Result } from "../shared";
import "./features.css";

type Stage = "idle" | "missed" | "moved" | "done" | "kept";
type Cell = { day: string; name: string; km: number; state?: "missed" | "done" | "moved" };

const ORIGINAL: Cell[] = [
  { day: "Mon", name: "Easy", km: 6 },
  { day: "Tue", name: "Tempo", km: 8 },
  { day: "Wed", name: "Rest", km: 0 },
  { day: "Thu", name: "Easy", km: 6 },
  { day: "Fri", name: "Rest", km: 0 },
  { day: "Sat", name: "Long", km: 18 },
  { day: "Sun", name: "Rest", km: 0 },
];

function active(stage: Stage): Cell[] {
  return ORIGINAL.map((c, i) => {
    if (i === 1) {
      if (stage === "missed" || stage === "kept") return { ...c, state: "missed" };
      if (stage === "done") return { ...c, state: "done" };
      if (stage === "moved") return { day: c.day, name: "Rest", km: 0 };
    }
    if (i === 2 && stage === "moved") return { ...c, name: "Tempo", km: 8, state: "moved" };
    return c;
  });
}

function Row({ label, cells }: { label: string; cells: Cell[] }) {
  return (
    <div className="pw">
      <div className="pw-lab">{label}</div>
      <div className="pw-row">
        {cells.map((c) => (
          <div key={c.day} className={`pw-cell${c.state ? ` ${c.state}` : ""}`}>
            <small>{c.day}</small>
            <b>{c.name}</b>
            <small>{c.km ? `${c.km} km` : "-"}</small>
            {c.state === "missed" && <small>missed</small>}
            {c.state === "done" && <small>done</small>}
            {c.state === "moved" && <small>moved here</small>}
          </div>
        ))}
      </div>
    </div>
  );
}

const TEXT: Record<Stage, Result> = {
  idle: { text: "plan_original and plan_active start identical. Miss a session to see what the engine does." },
  missed: { text: "The engine only proposes. plan_active has not changed yet, and nothing is applied until you choose." },
  moved: { text: "You accepted. plan_active moved the tempo to Wednesday. plan_original is untouched.", tone: "good" },
  done: { text: "You marked it done. plan_active records it. plan_original is untouched.", tone: "good" },
  kept: { text: "Not now. The session stays marked missed and the plan did not change." },
};

export function Propose() {
  const [stage, setStage] = useState<Stage>("idle");
  return (
    <>
      <div className="xbox">
        <Row label="plan_original" cells={ORIGINAL} />
        <Row label="plan_active" cells={active(stage)} />
        {stage === "missed" && (
          <div className="prop" role="group" aria-label="Proposal from the plan engine">
            <p>
              <b>You missed Tuesday&apos;s tempo.</b> What would you like to do?
            </p>
            <div className="xctl">
              <button className="btn btn-primary" type="button" style={{ padding: "10px 16px" }} onClick={() => setStage("moved")}>
                Move to tomorrow
              </button>
              <button className="ghost" type="button" onClick={() => setStage("done")}>
                Mark done anyway
              </button>
              <button className="ghost" type="button" onClick={() => setStage("kept")}>
                Not now
              </button>
            </div>
          </div>
        )}
        <div className="xctl">
          {stage === "idle" ? (
            <button className="btn btn-primary" type="button" style={{ padding: "10px 18px" }} onClick={() => setStage("missed")}>
              Miss Tuesday&apos;s tempo
            </button>
          ) : (
            <button className="ghost" type="button" onClick={() => setStage("idle")}>
              Reset the week
            </button>
          )}
        </div>
      </div>
      <XRes res={TEXT[stage]} />
    </>
  );
}
