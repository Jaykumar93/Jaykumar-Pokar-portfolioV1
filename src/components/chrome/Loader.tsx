"use client";

import { useEffect, useState } from "react";
import "./loader.css";

const LAYERS = [
  { name: "Data", color: "var(--c-data)" },
  { name: "Services", color: "var(--c-svc)" },
  { name: "Interface", color: "var(--c-ui)" },
  { name: "AI", color: "var(--c-ai)" },
] as const;

const MIN_MS = 1100;
const MAX_MS = 4500;
const EXIT_MS = 650;

type Phase = "show" | "hide" | "gone";

export function Loader() {
  const [phase, setPhase] = useState<Phase>("show");
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minMs = reduced ? 0 : MIN_MS;
    const t0 = performance.now();
    let fontsReady = false;
    let loaded = document.readyState === "complete";
    let shown = 0;
    let raf = 0;
    let exitTimer: ReturnType<typeof setTimeout> | undefined;
    let finished = false;

    document.fonts?.ready.then(() => {
      fontsReady = true;
    });
    const onLoad = () => {
      loaded = true;
    };
    if (!loaded) window.addEventListener("load", onLoad, { once: true });

    const finish = () => {
      finished = true;
      setPct(100);
      document.documentElement.removeAttribute("data-loading");
      setPhase("hide");
      exitTimer = setTimeout(() => setPhase("gone"), reduced ? 0 : EXIT_MS);
    };

    const tick = (now: number) => {
      const elapsed = now - t0;
      // 12% to start, then real signals add the rest. Never faster than the minimum display time.
      const signal = 12 + (fontsReady ? 38 : 0) + (loaded ? 50 : 0);
      const pace = minMs === 0 ? 100 : (elapsed / minMs) * 100;
      const goal = elapsed >= MAX_MS ? 100 : Math.min(signal, pace, 100);
      shown += Math.max(0.6, (goal - shown) * 0.14);
      if (shown > goal) shown = goal;
      setPct(Math.round(shown));
      if (shown >= 99.5 && goal >= 100) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (exitTimer) clearTimeout(exitTimer);
      window.removeEventListener("load", onLoad);
      if (!finished) document.documentElement.removeAttribute("data-loading");
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div className={`loader${phase === "hide" ? " out" : ""}`} role="status" aria-live="polite" aria-label="Loading portfolio">
      <div className="ld-in">
        <div className="ld-name">
          Jaykumar Pokar<b>.</b>
        </div>
        <div className="ld-role">Full Stack AI Engineer</div>
        <div className="ld-bar" aria-hidden="true">
          {LAYERS.map((l, i) => {
            const fill = Math.max(0, Math.min(1, (pct - i * 25) / 25));
            return (
              <div key={l.name} className="ld-seg">
                <span className="ld-track">
                  <i style={{ transform: `scaleX(${fill})`, background: l.color }} />
                </span>
                <small className={fill >= 1 ? "on" : undefined}>{l.name}</small>
              </div>
            );
          })}
        </div>
        <div className="ld-pct" aria-hidden="true">
          {pct}%
        </div>
      </div>
    </div>
  );
}
