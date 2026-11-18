"use client";

import { useRef } from "react";
import { metrics } from "@/data/profile";
import { useUI } from "@/components/providers/UIProvider";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";

function Metric({ value, suffix, label, project }: (typeof metrics)[number]) {
  const { openCase } = useUI();
  const ref = useRef<HTMLButtonElement>(null);
  const inView = useInView(ref, { once: true, threshold: 0.3 });
  const shown = useCountUp(value, inView);
  return (
    <button ref={ref} className="card metric" type="button" onClick={(e) => openCase(project, { x: e.clientX, y: e.clientY })}>
      <div className="n">
        <span>{shown}</span>
        <em>{suffix}</em>
      </div>
      <p>{label}</p>
      <span className="go">View project →</span>
    </button>
  );
}

export function Metrics() {
  return (
    <section style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="metrics">
          {metrics.map((m) => (
            <Metric key={m.label} {...m} />
          ))}
        </div>
      </div>
    </section>
  );
}
