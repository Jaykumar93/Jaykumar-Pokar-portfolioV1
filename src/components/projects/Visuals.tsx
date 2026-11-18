"use client";

/* Project visuals ported from the approved mockup. Cursus uses real app screenshots
   (plain <img>, intentionally not next/image: fixed-size static PNGs under /public/media). */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { projects } from "@/data/projects";
import type { ProjectVisual as ProjectVisualKind } from "@/data/types";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** CSSProperties that also accepts custom properties such as `--i` or `--c`. */
export type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

const SHOTS: { key: string; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "plan", label: "Plan" },
  { key: "run", label: "Live run" },
  { key: "coach", label: "Coach" },
  { key: "summary", label: "Run summary" },
];

const LEADERBOARD: [string, number][] = [
  ["Rep A", 92],
  ["Rep B", 74],
  ["Rep C", 61],
  ["Rep D", 43],
];
const MEALS: [string, number][] = [
  ["Breakfast", 70],
  ["Lunch", 88],
  ["Dinner", 55],
];
const LEAD_DOTS = [0, 1, 2, 3, 4, 5, 6, 7];
const LANE_PACKETS = [0, 1, 2];

function Dash({ play }: { play: boolean }) {
  return (
    <>
      <div className={`vis v-dash${play ? " play" : ""}`}>
        <div className="dash-h">
          <b>Beacon</b>
          <span>weekly, monthly, quarterly</span>
        </div>
        <div className="dg">
          <div className="w w1" style={{ "--i": 0 } as CSSVars}>
            <h6>Targets</h6>
            <div className="pb"><i style={{ "--v": "78%", "--i": 1 } as CSSVars} /></div>
            <div className="pb"><i style={{ "--v": "54%", "--i": 2 } as CSSVars} /></div>
            <div className="pb"><i style={{ "--v": "31%", "--i": 3 } as CSSVars} /></div>
          </div>
          <div className="w w2" style={{ "--i": 1 } as CSSVars}>
            <h6>Leaderboard</h6>
            {LEADERBOARD.map(([name, v], k) => (
              <div className="lb" key={name}>
                <span>{name}</span>
                <div className="pb" style={{ "--i": k + 1 } as CSSVars}>
                  <i style={{ "--v": `${v}%`, "--i": k + 1 } as CSSVars} />
                </div>
              </div>
            ))}
          </div>
          <div className="w w3" style={{ "--i": 2 } as CSSVars}>
            <h6>Follow-ups</h6>
            <div className="qrow">List A<em>call</em></div>
            <div className="qrow">List C<em>call</em></div>
            <div className="qrow">List B<em>call</em></div>
          </div>
          <div className="w w4" style={{ "--i": 3 } as CSSVars}>
            <h6>Time saved</h6>
            <svg className="spark" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
              <polyline points="2,34 18,28 34,30 50,18 66,20 82,9 98,5" />
            </svg>
          </div>
          <div className="w w5" style={{ "--i": 4 } as CSSVars}>
            <h6>Lead pool</h6>
            <div className="dots">
              {LEAD_DOTS.map((k) => (
                <i key={k} className={k < 5 ? "t" : undefined} style={{ "--k": k } as CSSVars} />
              ))}
            </div>
          </div>
          <div className="w w6" style={{ "--i": 5 } as CSSVars}>
            <h6>Recordings</h6>
            <div className="qrow">Call review<em>play</em></div>
            <div className="play-bar"><i /></div>
          </div>
          <div className="w w7" style={{ "--i": 6 } as CSSVars}>
            <h6>Action plan</h6>
            <div className="chk d">Review targets</div>
            <div className="chk d">Clear follow-ups</div>
            <div className="chk">Coach next call</div>
          </div>
        </div>
      </div>
      <span className="vcap">Illustrative UI</span>
    </>
  );
}

function Diet({ play }: { play: boolean }) {
  return (
    <>
      <div className={`vis${play ? " play" : ""}`}>
        <div className="phone">
          <div className="toastp">New message from your group</div>
          <div className="ph-h">
            Today&apos;s plan <small>role-based</small>
          </div>
          {MEALS.map(([name, v]) => (
            <div className="meal" key={name}>
              <div>
                {name}
                <i style={{ "--v": `${v}%` } as CSSVars} />
              </div>
              <span>macros</span>
            </div>
          ))}
          <div className="bub" style={{ "--k": 0 } as CSSVars}>Dinner swapped. Check your plan.</div>
          <div className="bub me" style={{ "--k": 1 } as CSSVars}>Got it, thanks.</div>
          <div className="bub" style={{ "--k": 2 } as CSSVars}>
            <span className="typing"><i /><i /><i /></span>
          </div>
          <span className="cpill">Redis cache</span>
        </div>
      </div>
      <span className="vcap">Illustrative UI</span>
    </>
  );
}

function Platform({ play }: { play: boolean }) {
  const lane = (
    <div className="lane" aria-hidden="true">
      {LANE_PACKETS.map((d) => (
        <i key={d} style={{ "--d": d } as CSSVars} />
      ))}
    </div>
  );
  return (
    <>
      <div className={`vis v-eng${play ? " play" : ""}`}>
        <div className="eng-row">
          <div className="en">Agents<small>web, Angular, desktop</small></div>
          {lane}
          <div className="en hot">WCF engine<small>sessions, leads, dialing</small></div>
          {lane}
          <div className="en">Phone system<small>calls, recordings</small></div>
        </div>
        <div className="eng-row2">
          <div className="en sm">Redis<small>phone-number cache</small></div>
          <div className="en sm">SQL Server<small>stored procedures</small></div>
          <div className="en sm">RabbitMQ<small>events</small></div>
        </div>
      </div>
      <span className="vcap">Illustrative diagram</span>
    </>
  );
}

function CursusSlideshow({ play, onPlayVideo }: { play: boolean; onPlayVideo?: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { threshold: 0.2 });
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  // Advance every 3s while the visual is playing (row open), on screen, and motion is allowed.
  useEffect(() => {
    if (!play || !inView || reduced || paused) return;
    const t = setInterval(() => setI((n) => (n + 1) % SHOTS.length), 3000);
    return () => clearInterval(t);
  }, [play, inView, reduced, paused]);

  const active = SHOTS[i].key;

  return (
    <div
      ref={rootRef}
      className={`vis ss${play ? " play" : ""}`}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="ss-wrap">
        <div className="ss-phone">
          {SHOTS.map((s, k) => (
            <img
              key={s.key}
              className={k === i ? "on" : undefined}
              src={`/media/cursus/${s.key}.png`}
              alt={`Cursus ${s.label} screen`}
              width={600}
              height={1240}
            />
          ))}
        </div>
        <span className={`ss-chip c1${active === "plan" ? " hot" : ""}`}>Rules-built plan</span>
        <span className={`ss-chip c2${active === "coach" ? " hot" : ""}`}>AI coach</span>
        <span className={`ss-chip c3${active === "run" ? " hot" : ""}`}>Live GPS</span>
      </div>
      <div className="ss-dots">
        {SHOTS.map((s, k) => (
          // Styled via [aria-selected] in globals.css (kept from the mockup).
          // eslint-disable-next-line jsx-a11y/role-supports-aria-props
          <button
            key={s.key}
            type="button"
            aria-label={`Show ${s.label} screen`}
            aria-selected={k === i}
            onClick={() => setI(k)}
          />
        ))}
      </div>
      {onPlayVideo && (
        <button type="button" className="playbtn" onClick={onPlayVideo}>
          &#9654; Watch the 20-second promo
        </button>
      )}
    </div>
  );
}

/**
 * One of the four project visuals. `play` restarts the entrance animations (class `play`)
 * and runs the Cursus slideshow. `onPlayVideo` shows the promo button on the Cursus visual;
 * the host (positioned container) is expected to render a <VideoLayer> when it fires.
 */
export function ProjectVisual({
  kind,
  play,
  onPlayVideo,
}: {
  kind: ProjectVisualKind;
  play: boolean;
  onPlayVideo?: () => void;
}) {
  switch (kind) {
    case "dash":
      return <Dash play={play} />;
    case "diet":
      return <Diet play={play} />;
    case "platform":
      return <Platform play={play} />;
    case "cursus":
      return <CursusSlideshow play={play} onPlayVideo={onPlayVideo} />;
  }
}

/** Promo video overlay. Fills its nearest positioned ancestor (.pv, .vis-wrap or .vblock). */
export function VideoLayer({ onClose }: { onClose: () => void }) {
  const video = projects.find((p) => p.video)?.video;
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  if (!video) return null;

  const close = () => {
    videoRef.current?.pause();
    onClose();
  };

  return (
    <div
      className="vidlayer"
      role="group"
      aria-label="Cursus promo video"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          // Close just the video, not the case study underneath.
          e.stopPropagation();
          close();
        }
      }}
    >
      <video ref={videoRef} src={video.src} poster={video.poster} controls autoPlay muted playsInline />
      <button ref={closeRef} type="button" className="vx" aria-label="Close video" onClick={close}>
        &times;
      </button>
    </div>
  );
}
