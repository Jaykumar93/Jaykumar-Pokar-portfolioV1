"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { jobs } from "@/data/jobs";
import type { Job } from "@/data/types";
import { tween } from "@/lib/tween";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function parseMetric(v: string): { num: number; rest: string } | null {
  const m = /^(\d+)(.*)$/.exec(v);
  return m ? { num: Number(m[1]), rest: m[2] } : null;
}

function Metric({ value, label, run }: { value: string; label: string; run: boolean }) {
  const parsed = parseMetric(value);
  const target = parsed?.num ?? 0;
  const hasNumber = parsed !== null;
  const reduced = useReducedMotion();
  const [n, setN] = useState(target);

  useEffect(() => {
    if (!run || !hasNumber || reduced) return;
    return tween(0, target, 1400, setN);
  }, [run, hasNumber, target, reduced]);

  return (
    <div>
      <b>
        {parsed ? (
          <>
            <span>{n}</span>
            {parsed.rest}
          </>
        ) : (
          value
        )}
      </b>
      {label}
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { threshold: 0.12, once: true });
  const [group, setGroup] = useState(0);

  return (
    <article ref={ref} className={`card job rv${job.current ? " cur" : ""}`}>
      <span className="dot" />
      <div className="job-head">
        <h3>
          {job.role} <span>· {job.company}</span>
        </h3>
        <div className="when">
          <b>{job.from}</b> to {job.to}, {job.location}
        </div>
      </div>
      <div className="jm">
        {job.metrics.map((m) => (
          <Metric key={m.label} value={m.value} label={m.label} run={inView} />
        ))}
      </div>
      <div className="seg" role="tablist" aria-label="Themes">
        {job.groups.map((g, gi) => (
          <button key={g.name} type="button" role="tab" aria-selected={gi === group} onClick={() => setGroup(gi)}>
            {g.name}
          </button>
        ))}
      </div>
      <ul className="lst">
        {job.groups[group].items.map((text, k) => (
          <li key={`${group}-${k}`} style={{ "--k": k } as CSSProperties}>
            {text}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Experience() {
  const tlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tlRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (window.innerHeight * 0.65 - r.top) / r.height));
      el.style.setProperty("--p", String(p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="experience">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">Experience</span>
          <h2>Three years at Coditas, intern to engineer.</h2>
        </div>
        <div ref={tlRef} className="tl">
          {jobs.map((job) => (
            <JobCard key={`${job.role}-${job.from}`} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}
