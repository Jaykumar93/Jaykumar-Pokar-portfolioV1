"use client";

import { useState } from "react";
import { RunButton, Seg, XRes, useTimers, type Result } from "../shared";

type Mode = "net" | "local";
type CellState = "" | "seen" | "hit" | "lost";

const MODES = [
  { value: "net", label: "Upload at the end" },
  { value: "local", label: "Save on the device first" },
] as const;

const EMPTY: CellState[] = Array.from({ length: 10 }, () => "");

export function Offline() {
  const t = useTimers();
  const [mode, setMode] = useState<Mode>("local");
  const [cells, setCells] = useState<CellState[]>(EMPTY);
  const [killed, setKilled] = useState(false);
  const [res, setRes] = useState<Result>({ text: "Press the button to compare." });

  const run = (m: Mode) => {
    t.clear();
    setCells(EMPTY);
    setKilled(false);
    setRes({ text: "Recording the run..." });
    for (let k = 0; k < 7; k++) {
      t.after(150 + k * 260, () => setCells((p) => p.map((c, i) => (i === k ? "seen" : c))));
    }
    t.after(2100, () => {
      setRes({ text: "The app was killed mid-run.", tone: "bad" });
      setKilled(true);
    });
    t.after(3100, () => {
      setKilled(false);
      setRes({ text: "Relaunching..." });
    });
    t.after(3900, () => {
      setCells((p) => p.map((c) => (c === "seen" ? (m === "local" ? "hit" : "lost") : c)));
      if (m === "local") setRes({ text: "Found an unsaved run on the device and uploaded it. Nothing lost.", tone: "good" });
      else setRes({ text: "The run only existed in memory. It is gone.", tone: "bad" });
    });
  };

  return (
    <>
      <div className="xbox">
        <div className="cells">
          {cells.map((c, i) => (
            <div
              key={i}
              className={`cell${c ? ` ${c}` : ""}`}
              style={killed && c === "seen" ? { outline: "2px solid var(--err)" } : undefined}
            />
          ))}
        </div>
        <div className="xctl">
          <Seg
            label="Where the run is saved"
            options={MODES}
            value={mode}
            onChange={(v) => {
              setMode(v);
              run(v);
            }}
          />
          <RunButton onClick={() => run(mode)}>Record, then kill the app</RunButton>
        </div>
      </div>
      <XRes res={res} />
    </>
  );
}
