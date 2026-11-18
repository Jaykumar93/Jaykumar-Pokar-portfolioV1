"use client";

import { useState } from "react";
import { bio, facts, storySteps } from "@/data/about";
import type { LayerKey } from "@/data/types";
import { LayerStack } from "./LayerStack";
import { Principles } from "./Principles";

export function About() {
  const [step, setStep] = useState(0);
  // Set when the visitor clicks a layer: every slab lights up and that layer is selected.
  // Changing the story step clears it so the step's own layers apply again.
  const [picked, setPicked] = useState<LayerKey | null>(null);

  const current = storySteps[step];
  const selected = picked ?? current.sel;

  const chooseStep = (i: number) => {
    setStep(i);
    setPicked(null);
  };

  return (
    <section id="about">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">About</span>
          <h2>Hi, I&apos;m Jaykumar.</h2>
        </div>
        <div className="about">
          <article className="card rv">
            <div className="bio">
              {bio.map((text, i) => (
                <p key={i} className={i === 0 ? "first" : undefined}>{text}</p>
              ))}
            </div>
            <div className="facts">
              {facts.map(([label, value]) => (
                <div key={label} className="fact">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </article>
          <article className="card rv aboutR">
            <div className="steps" role="tablist" aria-label="Career steps">
              {storySteps.map((s, i) => (
                <button key={s.tab} type="button" role="tab" aria-selected={i === step} onClick={() => chooseStep(i)}>
                  {s.tab}
                </button>
              ))}
            </div>
            <div className="story" aria-live="polite">
              <h3 key={`h${step}`}>{current.heading}</h3>
              <p key={`p${step}`}>{current.body}</p>
            </div>
            <LayerStack on={picked === null ? current.on : "all"} selected={selected} onSelect={setPicked} />
          </article>
        </div>
        <h3 className="sub-h rv">How I work</h3>
        <Principles />
      </div>
    </section>
  );
}
