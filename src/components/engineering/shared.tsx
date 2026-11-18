"use client";

import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";

export type Tone = "good" | "bad";
export interface Result {
  text: string;
  tone?: Tone;
}

/** Collects timeouts/intervals so they can be cleared on reset and on unmount (the mockup's xClear). */
export interface Timers {
  after: (ms: number, fn: () => void) => void;
  every: (ms: number, fn: () => void) => () => void;
  clear: () => void;
}

export function useTimers(): Timers {
  const ids = useRef<{ id: number; interval: boolean }[]>([]);

  const clear = useCallback(() => {
    ids.current.forEach((t) => (t.interval ? window.clearInterval(t.id) : window.clearTimeout(t.id)));
    ids.current = [];
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    ids.current.push({ id: window.setTimeout(fn, ms), interval: false });
  }, []);

  const every = useCallback((ms: number, fn: () => void) => {
    const id = window.setInterval(fn, ms);
    ids.current.push({ id, interval: true });
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => clear, [clear]);

  return useMemo(() => ({ after, every, clear }), [after, every, clear]);
}

export function XRes({ res }: { res: Result }) {
  return (
    <div className={`xres${res.tone ? ` ${res.tone}` : ""}`} aria-live="polite">
      {res.text}
    </div>
  );
}

export function Seg<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function RunButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button className="btn btn-primary" type="button" style={{ padding: "10px 18px" }} onClick={onClick}>
      {children}
    </button>
  );
}

export function Arr() {
  return (
    <span className="arr" aria-hidden="true">
      {"→"}
    </span>
  );
}

export function FlowNode({ title, sub, cls }: { title: string; sub: string; cls?: string }) {
  return (
    <div className={`nodex${cls ? ` ${cls}` : ""}`}>
      {title}
      <small>{sub}</small>
    </div>
  );
}
