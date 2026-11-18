"use client";

import { useState } from "react";
import { RunButton, Seg, XRes, useTimers, type Result } from "../shared";
import "./features.css";

type Mode = "stop" | "isolate";
type Status = "idle" | "working" | "ok" | "fail" | "skip";

const MODES = [
  { value: "stop", label: "Stop at the first error" },
  { value: "isolate", label: "Isolate each row" },
] as const;

const ROWS: { id: string; bad?: string }[] = [
  { id: "Call 4821" },
  { id: "Call 4822" },
  { id: "Call 4823", bad: "No matching recording" },
  { id: "Call 4824" },
  { id: "Call 4825" },
  { id: "Call 4826", bad: "Invalid id" },
  { id: "Call 4827" },
  { id: "Call 4828" },
];

const LABEL: Record<Status, string> = { idle: "Not run", working: "Working...", ok: "✓ Downloaded", fail: "✕ Failed", skip: "Skipped, already downloaded" };

export function Bulk() {
  const t = useTimers();
  const [mode, setMode] = useState<Mode>("isolate");
  const [status, setStatus] = useState<Status[]>(() => ROWS.map(() => "idle"));
  const [ran, setRan] = useState(false);
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<Result>({ text: "Run the batch. Two of the eight rows are bad on purpose." });

  const reset = () => {
    t.clear();
    setStatus(ROWS.map(() => "idle"));
    setRan(false);
    setBusy(false);
    setRes({ text: "Run the batch. Two of the eight rows are bad on purpose." });
  };

  const run = (m: Mode, from: Status[]) => {
    t.clear();
    setBusy(true);
    const next = [...from];
    const again = from.some((s) => s === "ok" || s === "fail");
    let stopped = -1;
    ROWS.forEach((row, i) => {
      t.after(i * 420, () => {
        if (stopped >= 0) return;
        if (from[i] === "ok") {
          next[i] = "skip";
          setStatus([...next]);
          return;
        }
        next[i] = "working";
        setStatus([...next]);
        t.after(260, () => {
          if (stopped >= 0 && i > stopped) return;
          if (row.bad) {
            next[i] = "fail";
            if (m === "stop") stopped = i;
          } else next[i] = "ok";
          setStatus([...next]);
        });
      });
    });
    t.after(ROWS.length * 420 + 400, () => {
      setBusy(false);
      setRan(true);
      const ok = next.filter((s) => s === "ok").length;
      const skipped = next.filter((s) => s === "skip").length;
      const failed = next.filter((s) => s === "fail").length;
      if (m === "stop" && stopped >= 0) {
        setRes({ text: `Stopped at ${ROWS[stopped].id}. ${ROWS.length - stopped - 1} rows were never tried, and nobody knows if they would have worked.`, tone: "bad" });
      } else if (again) {
        setRes({ text: `Re-run: ${skipped} skipped because they were already downloaded, ${failed} retried and still failing. Nothing was downloaded twice.`, tone: "good" });
      } else {
        setRes({ text: `${ok} downloaded, ${failed} failed and listed for follow-up. One bad row did not stop the rest.`, tone: "good" });
      }
    });
  };

  const start = () => run(mode, ROWS.map(() => "idle"));
  const again = () => run(mode, status.map((s) => (s === "working" ? "idle" : s)));

  return (
    <>
      <div className="xbox">
        <div className="bk" role="list">
          {ROWS.map((r, i) => (
            <div key={r.id} role="listitem" className={`bk-row${status[i] === "ok" ? " ok" : status[i] === "fail" ? " fail" : ""}`}>
              <span>{r.id}</span>
              <span className="bk-st">{status[i] === "fail" && r.bad ? `✕ ${r.bad}` : LABEL[status[i]]}</span>
            </div>
          ))}
        </div>
        <div className="xctl">
          <Seg
            label="How errors are handled"
            options={MODES}
            value={mode}
            onChange={(v) => {
              setMode(v);
              t.clear();
              setStatus(ROWS.map(() => "idle"));
              setRan(false);
              run(v, ROWS.map(() => "idle"));
            }}
          />
          <RunButton onClick={start}>{busy ? "Running..." : "Run the batch"}</RunButton>
          {ran && !busy && (
            <button className="ghost" type="button" onClick={again}>
              Run it again
            </button>
          )}
          {(ran || busy) && (
            <button className="ghost" type="button" onClick={reset}>
              Reset
            </button>
          )}
        </div>
      </div>
      <XRes res={res} />
    </>
  );
}
