"use client";

/* Case-study overlay ported from the mockup. Gallery/promo use plain <img> for static media. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import type { SubProject } from "@/data/types";
import { Arrow } from "@/components/ui/Arrow";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ProjectVisual, VideoLayer, type CSSVars } from "./Visuals";

interface CaseStudyProps {
  index: number;
  open: boolean;
  origin: { x: number; y: number };
  onClose: () => void;
  onNavigate: (index: number) => void;
}

type VideoHost = "hero" | "promo" | null;

function Sub({ s, play }: { s: SubProject; play: boolean }) {
  return (
    <div className="sub">
      <span className="st"><i />{s.status}</span>
      <br />
      <b>{s.name}</b>
      <p style={{ color: "var(--text-2)", margin: "8px 0 16px" }}>{s.desc}</p>
      {s.vis && (
        <div className="vis-wrap" style={{ minHeight: 0, margin: "0 0 20px", padding: 18 }}>
          <ProjectVisual kind={s.vis} play={play} />
        </div>
      )}
      <ul className="clist">
        {s.details.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
    </div>
  );
}

export function CaseStudy({ index, open, origin, onClose, onNavigate }: CaseStudyProps) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);
  const needFocus = useRef(false);
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [hidden, setHidden] = useState(true);
  const [show, setShow] = useState(false);
  const [play, setPlay] = useState(false);
  const [videoHost, setVideoHost] = useState<VideoHost>(null);

  // Derive state from props during render (avoids setState-in-effect): unhide on open,
  // drop `show` on close, and reset visuals/video whenever the project or open state changes.
  const [prevOpen, setPrevOpen] = useState(open);
  const [prevIndex, setPrevIndex] = useState(index);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setHidden(false);
    else setShow(false);
    setPlay(false);
    setVideoHost(null);
  }
  if (index !== prevIndex) {
    setPrevIndex(index);
    setPlay(false);
    setVideoHost(null);
  }

  // Open: capture focus origin, then add `show` two frames after unhide so the clip-path transition runs.
  // Close: hide after the transition and restore focus.
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      needFocus.current = true;
      prevFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      let r2 = 0;
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setShow(true));
      });
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    if (navTimer.current) clearTimeout(navTimer.current);
    const t = setTimeout(
      () => {
        setHidden(true);
        const el = prevFocus.current;
        prevFocus.current = null;
        if (el && el.isConnected) el.focus();
      },
      reduced ? 0 : 700,
    );
    return () => clearTimeout(t);
  }, [open, reduced]);

  // Focus "Back to site" once the overlay is actually visible.
  useEffect(() => {
    if (open && show && needFocus.current) {
      needFocus.current = false;
      backRef.current?.focus();
    }
  }, [open, show]);

  // Scroll to top when opening or switching project.
  useEffect(() => {
    if (open && rootRef.current) rootRef.current.scrollTop = 0;
  }, [open, index, show]);

  // Start the visuals' animations/slideshow shortly after (re)render, like the mockup.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setPlay(true), 350);
    return () => clearTimeout(t);
  }, [open, index]);

  useEffect(
    () => () => {
      if (navTimer.current) clearTimeout(navTimer.current);
    },
    [],
  );

  const go = (target: number) => {
    setShow(false);
    if (navTimer.current) clearTimeout(navTimer.current);
    navTimer.current = setTimeout(
      () => {
        onNavigate(target);
        setShow(true);
      },
      reduced ? 0 : 350,
    );
  };

  const p = projects[index] ?? projects[0];
  const i = projects.indexOf(p);
  const next = (i + 1) % projects.length;
  const prev = (i + projects.length - 1) % projects.length;
  const live = p.status !== "Completed";
  const style: CSSVars = { "--cx": `${origin.x}px`, "--cy": `${origin.y}px` };

  return (
    <div
      ref={rootRef}
      className={`case${show ? " show" : ""}`}
      id="case"
      hidden={hidden}
      role="dialog"
      aria-modal="true"
      aria-labelledby="c-title"
      style={style}
    >
      <div className="case-in">
        <div className="case-bar">
          <button
            ref={backRef}
            type="button"
            className="btn btn-line"
            style={{ padding: "10px 16px" }}
            onClick={onClose}
          >
            &larr; Back to site
          </button>
          <span className="mono" style={{ fontSize: ".72rem", color: "var(--text-3)" }}>
            Case study {i + 1} of {projects.length}
          </span>
        </div>

        <div className="case-hero">
          <div>
            <span className={`st${live ? " wip" : ""}`}><i />{p.status}</span>
            <h1 id="c-title">{p.name}</h1>
            <div className="mono" style={{ color: "var(--text-3)", fontSize: ".8rem", marginTop: 12 }}>
              {p.tag}
              {p.former ? `, ${p.former}` : ""}
            </div>
            <p className="lede">{p.desc}</p>
          </div>
          <div className="vis-wrap" id="cVis">
            <ProjectVisual
              key={`hero-${i}`}
              kind={p.vis}
              play={play}
              onPlayVideo={p.video ? () => setVideoHost("hero") : undefined}
            />
            {videoHost === "hero" && <VideoLayer onClose={() => setVideoHost(null)} />}
          </div>
        </div>

        {p.gallery && (
          <div className="cblock">
            <h4>Screens from the app</h4>
            <div className="gal">
              {p.gallery.map(([key, label], k) => (
                <figure key={key} style={{ "--k": k } as CSSVars}>
                  <img
                    src={`/media/cursus/${key}.png`}
                    alt={`Cursus ${label} screen`}
                    loading="lazy"
                    width={600}
                    height={1240}
                  />
                  <figcaption>{label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        {p.video && (
          <div className="cblock">
            <h4>Promo</h4>
            <div className="vblock">
              <img src={p.video.poster} alt="Cursus promo poster: Finish the plan healthy" loading="lazy" />
              <button type="button" className="playbtn" onClick={() => setVideoHost("promo")}>
                &#9654; Play, 20 seconds
              </button>
              {videoHost === "promo" && <VideoLayer onClose={() => setVideoHost(null)} />}
            </div>
          </div>
        )}

        <div className="cblock">
          <h4>System</h4>
          <div className="cflow">
            {p.flow.map(([title, sub], k) => (
              <div className="cn" key={title} style={{ "--k": k } as CSSVars}>
                <b>{title}</b>
                <small>{sub}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="cblock">
          <h4>What I built</h4>
          <ul className="clist">
            {p.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          {p.subs?.map((s) => <Sub key={s.name} s={s} play={play} />)}
        </div>

        <div className="cblock">
          <h4>Result</h4>
          <div className="result">
            <span className="big">{p.metric[0]}</span>
            <span style={{ color: "var(--text-2)" }}>{p.metric[1]}</span>
          </div>
        </div>

        <div className="cblock">
          <h4>Stack</h4>
          <div className="chips">
            {p.stack.map((s) => (
              <span className="chip" key={s}>{s}</span>
            ))}
          </div>
          {(p.link || p.docs) && (
            <div className="cta" style={{ marginTop: 24 }}>
              {p.link && (
                <a className="btn btn-primary" href={p.link} target="_blank" rel="noopener noreferrer">
                  View on GitHub <Arrow />
                </a>
              )}
              {p.docs && (
                <a className="btn btn-line" href={p.docs} target="_blank" rel="noopener noreferrer">
                  {p.docsLabel ?? "Read the docs"} <Arrow />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="case-nav">
          <button type="button" className="btn btn-line" onClick={() => go(prev)}>
            &larr; {projects[prev].name}
          </button>
          <button type="button" className="btn btn-line" onClick={() => go(next)}>
            {projects[next].name} &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
