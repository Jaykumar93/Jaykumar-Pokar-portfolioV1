"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { tween } from "@/lib/tween";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Seg, XRes, useTimers, type Result } from "../shared";

type Mode = "before" | "after";

interface Stage {
  k: string;
  d: string;
  c: string;
  b: number;
  a: number;
  n: string;
}

const STAGES: readonly Stage[] = [
  { k: "Angular", d: "dispatch", c: "var(--c-ui)", b: 12, a: 12, n: "The Angular and Kendo UI front end sends the request." },
  { k: "Filter pipeline", d: "auth, validate, log", c: "var(--c-svc)", b: 58, a: 12, n: "Refactored into a modular, testable pipeline. This change cut API request processing time by 25%." },
  { k: "Redis", d: "lock + cache lookup", c: "var(--c-data)", b: 14, a: 14, n: "Redis locks guard shared pools, and cached reads keep the database quiet." },
  { k: "SQL Server", d: "stored procedure", c: "var(--c-data)", b: 78, a: 78, n: "Stored procedures behind the screens. I removed a redundant round-trip and an unneeded transaction wrapper on hot paths." },
  { k: "Serialize", d: "JSON response", c: "var(--c-svc)", b: 22, a: 22, n: "The response goes back as JSON to the grid or widget that asked for it." },
];

const MAX = 184;
const MODES = [
  { value: "before", label: "Before refactor" },
  { value: "after", label: "Modular pipeline" },
] as const;

const RES: Result = { text: "Illustrative timings. The real result: a 25% cut in request processing time." };

export function Trace() {
  const t = useTimers();
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  const [mode, setMode] = useState<Mode>("before");
  const [ms, setMs] = useState<number[]>(() => STAGES.map(() => 0));
  const [total, setTotal] = useState(MAX);
  const [selected, setSelected] = useState<number | null>(null);

  const modeRef = useRef<Mode>("before");
  const touched = useRef(false);
  const curTotal = useRef(MAX);
  const msCur = useRef<number[]>(STAGES.map(() => 0));
  const cancels = useRef<(() => void)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rowsRef = useRef<HTMLDivElement>(null);

  // Keep the reduced-motion flag readable from timers and from the mount effect below.
  useEffect(() => {
    reducedRef.current = reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, [reduced]);

  const cancelAll = useCallback(() => {
    cancels.current.forEach((c) => c());
    cancels.current = [];
  }, []);

  // Imperative part: bars (transform only) and number tweens. Does not set the mode itself.
  const animate = useCallback(
    (next: Mode, replay: boolean) => {
      modeRef.current = next;
      cancelAll();
      const key = next === "before" ? "b" : "a";
      const sum = STAGES.reduce((acc, s) => acc + s[key], 0);
      const instant = reducedRef.current;
      if (replay) {
        barRefs.current.forEach((b) => {
          if (!b) return;
          b.style.transition = "none";
          b.style.transform = "translateX(0) scaleX(0)";
        });
        // Force a reflow so the reset applies before the bars animate back out.
        void rowsRef.current?.offsetWidth;
      }
      let acc = 0;
      STAGES.forEach((s, i) => {
        const value = s[key];
        const bar = barRefs.current[i];
        if (bar) {
          bar.style.transition = `transform .9s var(--ease) ${replay ? i * 110 : 0}ms`;
          bar.style.transform = `translateX(${(acc / MAX) * 100}%) scaleX(${value / MAX})`;
        }
        const from = replay ? 0 : msCur.current[i];
        cancels.current.push(
          tween(
            from,
            value,
            900,
            (v) => {
              msCur.current[i] = v;
              setMs((p) => p.map((x, k) => (k === i ? v : x)));
            },
            instant,
          ),
        );
        acc += value;
      });
      cancels.current.push(tween(curTotal.current, sum, 900, setTotal, instant));
      curTotal.current = sum;
    },
    [cancelAll],
  );

  const render = useCallback(
    (next: Mode, replay: boolean) => {
      setMode(next);
      animate(next, replay);
    },
    [animate],
  );

  useEffect(() => {
    animate("before", true);
    t.after(2600, () => {
      if (!touched.current && !reducedRef.current) render("after", false);
    });
    return cancelAll;
  }, [animate, render, cancelAll, t]);

  const sel = selected === null ? null : STAGES[selected];

  return (
    <>
      <div className="xbox">
        <div className="tr-ctl">
          <Seg
            label="Pipeline version"
            options={MODES}
            value={mode}
            onChange={(v) => {
              touched.current = true;
              render(v, false);
            }}
          />
          <button
            className="ghost"
            type="button"
            onClick={() => {
              touched.current = true;
              curTotal.current = 0;
              render(modeRef.current, true);
            }}
          >
            Replay
          </button>
        </div>
        <div className="rows" ref={rowsRef}>
          {STAGES.map((s, i) => (
            <button
              key={s.k}
              type="button"
              className="row"
              aria-pressed={selected === i}
              onClick={() => {
                touched.current = true;
                setSelected(i);
              }}
            >
              <span className="nm">
                {s.k}
                <small>{s.d}</small>
              </span>
              <span className="track">
                <span
                  className="bar"
                  ref={(el) => {
                    barRefs.current[i] = el;
                  }}
                  style={{ "--c": s.c } as CSSProperties}
                />
              </span>
              <span className="ms">{ms[i]}ms</span>
            </button>
          ))}
        </div>
        <div className="tr-total">
          <div className="t">
            <span>{total}</span>
            <small>ms total</small>
          </div>
          <span className={`delta${mode === "after" ? " win" : ""}`}>{mode === "after" ? "-46 ms, -25%" : "baseline"}</span>
        </div>
        <div className="snote" aria-live="polite">
          {sel ? (
            <>
              <b>{sel.k}.</b> {sel.n}
            </>
          ) : (
            <>
              <b>Select a stage.</b> Each row explains what it does and what I changed there.
            </>
          )}
        </div>
      </div>
      <XRes res={RES} />
    </>
  );
}
