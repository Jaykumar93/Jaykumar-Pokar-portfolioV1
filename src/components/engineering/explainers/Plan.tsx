"use client";

import { useId, useMemo, useState } from "react";
import { Seg, XRes, type Result } from "../shared";
import "./features.css";

type Race = "half" | "full";

const RACES = [
  { value: "half", label: "Half marathon" },
  { value: "full", label: "Marathon" },
] as const;
const WEEKS = [
  { value: "12", label: "12 weeks" },
  { value: "16", label: "16 weeks" },
  { value: "20", label: "20 weeks" },
] as const;

const RACE_KM: Record<Race, number> = { half: 21.0975, full: 42.195 };
const TEN_K = 10;
const RIEGEL = 1.06;

type Phase = "base" | "build" | "peak" | "taper";

function hms(total: number): string {
  const s = Math.round(total);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
function ms(total: number): string {
  const s = Math.round(total);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Illustrative block profile: weekly volume as a share of the peak week. */
function blocks(weeks: number, race: Race): { phase: Phase; v: number }[] {
  const taper = race === "full" ? 3 : 2;
  const rest = weeks - taper;
  const base = Math.round(rest * 0.45);
  const build = Math.round(rest * 0.35);
  const peak = rest - base - build;
  const out: { phase: Phase; v: number }[] = [];
  const ramp = (n: number, from: number, to: number, phase: Phase) => {
    for (let i = 0; i < n; i++) out.push({ phase, v: n === 1 ? to : from + ((to - from) * i) / (n - 1) });
  };
  ramp(base, 0.35, 0.6, "base");
  ramp(build, 0.65, 0.88, "build");
  ramp(peak, 0.95, 1, "peak");
  ramp(taper, 0.7, 0.4, "taper");
  return out;
}

export function Plan() {
  const id = useId();
  const [race, setRace] = useState<Race>("full");
  const [weeks, setWeeks] = useState("16");
  const [tenK, setTenK] = useState(3000);

  const { finish, pace, bars, counts } = useMemo(() => {
    const t2 = tenK * Math.pow(RACE_KM[race] / TEN_K, RIEGEL);
    const b = blocks(Number(weeks), race);
    const c: Record<Phase, number> = { base: 0, build: 0, peak: 0, taper: 0 };
    b.forEach((x) => (c[x.phase] += 1));
    return { finish: t2, pace: t2 / RACE_KM[race], bars: b, counts: c };
  }, [race, weeks, tenK]);

  const res: Result = {
    text: `Riegel: new time = 10K time x (race distance / 10 km) ^ ${RIEGEL}. A 10K of ${ms(tenK)} points to ${hms(finish)} over this distance, about ${ms(pace)} per km. The plan engine builds the weeks around paces like this.`,
  };

  return (
    <>
      <div className="xbox">
        <div className="xctl">
          <Seg label="Race" options={RACES} value={race} onChange={setRace} />
          <Seg label="Plan length" options={WEEKS} value={weeks} onChange={setWeeks} />
        </div>
        <div className="rng">
          <label htmlFor={id}>
            Recent 10K time: <b>{ms(tenK)}</b>
          </label>
          <input id={id} type="range" min={2100} max={4500} step={15} value={tenK} onChange={(e) => setTenK(Number(e.target.value))} />
        </div>
        <div className="stats">
          <div>
            Predicted finish<b>{hms(finish)}</b>
          </div>
          <div>
            Goal pace<b>{ms(pace)} /km</b>
          </div>
        </div>
        <div>
          <div className="bp" role="img" aria-label={`Illustrative weekly volume across ${weeks} weeks: ${counts.base} base, ${counts.build} build, ${counts.peak} peak and ${counts.taper} taper weeks.`}>
            {bars.map((b, i) => (
              <i key={i} className={`p-${b.phase}`} style={{ height: `${Math.round(b.v * 100)}%` }} />
            ))}
          </div>
          <div className="bp-leg">
            {(["base", "build", "peak", "taper"] as const).map((p) => (
              <span key={p}>
                <i className={`p-${p}`} />
                {p[0].toUpperCase() + p.slice(1)}, {counts[p]} wk
              </span>
            ))}
          </div>
        </div>
      </div>
      <XRes res={res} />
    </>
  );
}
