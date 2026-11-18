"use client";

import { useEffect, useState } from "react";
import { RunButton, Seg, XRes, useTimers, type Result } from "../shared";

type Mode = "off" | "on";
type LeadCls = "" | "a" | "b" | "bad";

const MODES = [
  { value: "off", label: "No lock" },
  { value: "on", label: "Redis lock" },
] as const;

const EMPTY: LeadCls[] = ["", "", "", "", "", ""];

export function Lock() {
  const t = useTimers();
  const [mode, setMode] = useState<Mode>("off");
  const [leads, setLeads] = useState<LeadCls[]>(EMPTY);
  const [sA, setSA] = useState("idle");
  const [sB, setSB] = useState("idle");
  const [sL, setSL] = useState("free");
  const [held, setHeld] = useState(false);
  const [res, setRes] = useState<Result>({ text: "" });

  const claim = (i: number, c: LeadCls) => setLeads((p) => p.map((l, k) => (k === i ? c : l)));

  // Schedules the animation only (no synchronous state writes), so it is safe to start from an effect.
  const start = (m: Mode) => {
    if (m === "off") {
      t.after(300, () => {
        claim(0, "a");
        claim(2, "b");
        setSA("took L1");
        setSB("took L3");
      });
      t.after(800, () => {
        claim(1, "a");
        claim(3, "b");
        setSA("took L2");
        setSB("took L4");
      });
      t.after(1300, () => {
        claim(2, "bad");
        claim(4, "b");
        setSA("took L3 too");
        setSB("took L5");
        setRes({ text: "Collision: L3 now belongs to both reps.", tone: "bad" });
      });
    } else {
      t.after(200, () => {
        setSL("held by Rep A");
        setHeld(true);
        setSB("waiting");
      });
      [0, 1, 2].forEach((k) =>
        t.after(500 + k * 350, () => {
          claim(k, "a");
          setSA("took L" + (k + 1));
        }),
      );
      t.after(1700, () => {
        setSL("released");
        setSA("done");
      });
      t.after(2000, () => {
        setSL("held by Rep B");
        setSB("working");
      });
      [3, 4, 5].forEach((k, j) =>
        t.after(2300 + j * 350, () => {
          claim(k, "b");
          setSB("took L" + (k + 1));
        }),
      );
      t.after(3500, () => {
        setSL("free");
        setSB("done");
        setRes({ text: "Six leads, six owners. No overlap.", tone: "good" });
      });
    }
  };

  const run = (m: Mode) => {
    t.clear();
    setLeads(EMPTY);
    setSA("idle");
    setSB("idle");
    setSL("free");
    setHeld(false);
    setRes({ text: "" });
    start(m);
  };

  // The mockup runs the unlocked demo once on load.
  useEffect(() => {
    start("off");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="xbox">
        <div className="pool">
          {leads.map((c, i) => (
            <div key={i} className={`lead-c${c ? ` ${c}` : ""}`}>
              L{i + 1}
            </div>
          ))}
        </div>
        <div className="reps">
          <div className="rep">
            <b>Rep A</b>
            <span>{sA}</span>
          </div>
          <div className={`rep lock${held ? " held" : ""}`}>
            <b>Redis lock</b>
            <span>{sL}</span>
          </div>
          <div className="rep">
            <b>Rep B</b>
            <span>{sB}</span>
          </div>
        </div>
        <div className="xctl">
          <Seg
            label="Locking"
            options={MODES}
            value={mode}
            onChange={(v) => {
              setMode(v);
              run(v);
            }}
          />
          <RunButton onClick={() => run(mode)}>Run</RunButton>
        </div>
      </div>
      <XRes res={res} />
    </>
  );
}
