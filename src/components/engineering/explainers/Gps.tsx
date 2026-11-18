"use client";

import { useId, useMemo, useState } from "react";
import { Seg, XRes, type Result } from "../shared";
import "./features.css";

type View = "raw" | "filtered";
type P = { x: number; y: number };

const VIEWS = [
  { value: "raw", label: "Raw GPS" },
  { value: "filtered", label: "Filtered" },
] as const;

const N = 70;
const TRUE_KM = 5;
const SPIKES: Record<number, [number, number]> = { 15: [30, -26], 33: [-28, 28], 52: [26, 28] };

const rnd = (i: number, k: number) => {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
};
const dist = (a: P, b: P) => Math.hypot(a.x - b.x, a.y - b.y);
const length = (pts: P[]) => pts.reduce((sum, p, i) => (i ? sum + dist(pts[i - 1], p) : 0), 0);

// A simulated 5 km run. The real path is smooth; the recorded points are jittery with a few jumps.
const IDEAL: P[] = Array.from({ length: N }, (_, i) => {
  const t = i / (N - 1);
  return { x: 16 + 288 * t, y: 85 + 48 * Math.sin(t * Math.PI * 2.4) };
});
const RAW: P[] = IDEAL.map((p, i) => ({
  x: p.x + rnd(i, 1) * 1.5 + (SPIKES[i]?.[0] ?? 0),
  y: p.y + rnd(i, 2) * 1.5 + (SPIKES[i]?.[1] ?? 0),
}));
const KM_PER_UNIT = TRUE_KM / length(IDEAL);

const pts = (a: P[]) => a.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

export function Gps() {
  const id = useId();
  const [view, setView] = useState<View>("filtered");
  const [limit, setLimit] = useState(16);

  const { kept, rejected, rawKm, keptKm } = useMemo(() => {
    // A speed limit over time: the allowed jump grows with the number of points since the last good one.
    const k: P[] = [];
    const r: P[] = [];
    let last = -1;
    RAW.forEach((p, i) => {
      if (last < 0 || dist(k[k.length - 1], p) <= limit * (i - last)) {
        k.push(p);
        last = i;
      } else r.push(p);
    });
    return { kept: k, rejected: r, rawKm: length(RAW) * KM_PER_UNIT, keptKm: length(k) * KM_PER_UNIT };
  }, [limit]);

  const shown = view === "raw" ? rawKm : keptKm;
  const off = Math.abs(shown - TRUE_KM) / TRUE_KM;
  let res: Result;
  if (view === "raw") res = { text: `Raw: ${rawKm.toFixed(2)} km reported for a ${TRUE_KM.toFixed(2)} km run. Every jump gets added to the distance.`, tone: "bad" };
  else if (rejected.length > 6) res = { text: `Too strict: ${rejected.length} points dropped, including real ones. The run now reads ${keptKm.toFixed(2)} km, which is too short.`, tone: "bad" };
  else if (off < 0.04) res = { text: `Filtered: ${keptKm.toFixed(2)} km. ${rejected.length} impossible jumps were dropped, so it lands close to the true ${TRUE_KM.toFixed(2)} km.`, tone: "good" };
  else res = { text: `Filtered: ${keptKm.toFixed(2)} km, ${rejected.length} points dropped. A tighter limit would remove the remaining jumps.`, tone: "bad" };

  return (
    <>
      <div className="xbox">
        <svg className="gps" viewBox="0 0 320 170" role="img" aria-label="A simulated run track. The raw recording has a few large jumps. The filtered track drops them.">
          <polyline points={pts(IDEAL)} fill="none" stroke="var(--line)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          {view === "raw" ? (
            <polyline points={pts(RAW)} fill="none" stroke="var(--text)" strokeWidth="1.5" strokeLinejoin="round" />
          ) : (
            <>
              <polyline points={pts(kept)} fill="none" stroke="var(--text)" strokeWidth="2" strokeLinejoin="round" />
              {rejected.map((p, i) => (
                <g key={i} stroke="var(--err)" strokeWidth="2" strokeLinecap="round">
                  <line x1={p.x - 4} y1={p.y - 4} x2={p.x + 4} y2={p.y + 4} />
                  <line x1={p.x - 4} y1={p.y + 4} x2={p.x + 4} y2={p.y - 4} />
                </g>
              ))}
            </>
          )}
        </svg>
        <div className="xctl">
          <Seg label="View" options={VIEWS} value={view} onChange={setView} />
        </div>
        <div className="rng">
          <label htmlFor={id}>
            Drop points that jump more than <b>{limit}</b> units per reading
          </label>
          <input id={id} type="range" min={4} max={60} step={1} value={limit} onChange={(e) => setLimit(Number(e.target.value))} />
        </div>
        <div className="stats">
          <div>
            True distance<b>{TRUE_KM.toFixed(2)} km</b>
          </div>
          <div>
            Recorded<b>{shown.toFixed(2)} km</b>
          </div>
          <div>
            Points dropped<b>{view === "raw" ? 0 : rejected.length}</b>
          </div>
        </div>
      </div>
      <XRes res={res} />
    </>
  );
}
