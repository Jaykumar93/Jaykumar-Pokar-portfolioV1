"use client";

import { useState } from "react";
import { RunButton, Seg, XRes, useTimers, type Result } from "../shared";
import "./rag.css";

type Mode = "ok" | "fb";

const MODES = [
  { value: "ok", label: "Within Gemini free limits" },
  { value: "fb", label: "Gemini limit reached" },
] as const;

/** Steps in order: 0 question, 1 embed, 2 retrieve, 3 decision, 4 generate (chosen branch), 5 answer. */
function stepText(step: number, mode: Mode): string {
  switch (step) {
    case 0:
      return "The runner asks something, for example how to taper before race day.";
    case 1:
      return "The question becomes a vector with Gemini embeddings.";
    case 2:
      return "Similarity search and Postgres full-text search both run, over the knowledge base and the runner's logged runs.";
    case 3:
      return mode === "ok"
        ? "Is Gemini within its free-tier limits? Yes, so Gemini answers."
        : "Is Gemini within its free-tier limits? No, so the request goes to Groq, the free-tier backup.";
    case 4:
      return mode === "ok"
        ? "Gemini writes the answer and can call tools, including live web search through Tavily. Cursus runs on free tiers, so this path has usage limits."
        : "Groq takes over and writes the answer, so the runner still gets a reply.";
    default:
      return "Both paths meet here. The reply is grounded in retrieved facts and the runner's own data.";
  }
}

function Node({ title, sub, hot, done, dec }: { title: string; sub: string; hot?: boolean; done?: boolean; dec?: boolean }) {
  return (
    <div className={`nodex${hot ? " hot" : ""}${done ? " done" : ""}${dec ? " dec" : ""}`}>
      {title}
      <small>{sub}</small>
    </div>
  );
}

function Line({ on }: { on: boolean }) {
  return <span className={`fk-v${on ? " on" : ""}`} aria-hidden="true" />;
}

export function Rag() {
  const t = useTimers();
  const [mode, setMode] = useState<Mode>("ok");
  const [step, setStep] = useState(-1);
  const [res, setRes] = useState<Result>({ text: "Ask the coach to see each step." });

  const run = (m: Mode) => {
    t.clear();
    setStep(-1);
    setRes({ text: "" });
    for (let i = 0; i <= 5; i++) {
      t.after(i * 900, () => {
        setStep(i);
        setRes({ text: stepText(i, m), tone: i === 5 ? "good" : undefined });
      });
    }
  };

  const decided = step >= 3;
  const geminiOn = decided && mode === "ok";
  const groqOn = decided && mode === "fb";

  return (
    <>
      <div className="xbox">
        <div className="fork" role="img" aria-label="Flow of a coach answer: question, embed, retrieve, then a check on Gemini free-tier limits that goes to Gemini if within limits or to Groq if not, and both end at a grounded answer.">
          <Node title="Question" sub="from the runner" hot={step === 0} done={step > 0} />
          <Line on={step >= 1} />
          <Node title="Embed" sub="Gemini embeddings" hot={step === 1} done={step > 1} />
          <Line on={step >= 2} />
          <Node title="Retrieve" sub="pgvector + full-text" hot={step === 2} done={step > 2} />
          <Line on={step >= 3} />
          <Node title="Within Gemini limits?" sub="free tier" dec hot={step === 3} done={step > 3} />
          <Line on={decided} />

          <div className="fk-split" aria-hidden="true">
            <span className={geminiOn ? "on" : ""} />
            <span className={groqOn ? "on" : ""} />
          </div>
          <div className="fk-branches">
            <div className={`fk-col${groqOn ? " dim" : ""}`}>
              <span className="fk-tag">Yes</span>
              <Node title="Gemini + tools" sub="primary model" hot={step === 4 && mode === "ok"} done={step > 4 && mode === "ok"} />
            </div>
            <div className={`fk-col${geminiOn ? " dim" : ""}`}>
              <span className="fk-tag">No</span>
              <Node title="Groq" sub="free-tier backup" hot={step === 4 && mode === "fb"} done={step > 4 && mode === "fb"} />
            </div>
          </div>
          <div className="fk-merge" aria-hidden="true">
            <span className={step >= 5 && mode === "ok" ? "on" : ""} />
            <span className={step >= 5 && mode === "fb" ? "on" : ""} />
          </div>

          <Line on={step >= 5} />
          <Node title="Grounded answer" sub="uses the runner's own data" hot={step === 5} />
        </div>
        <div className="xctl">
          <Seg
            label="Gemini free-tier limits"
            options={MODES}
            value={mode}
            onChange={(v) => {
              setMode(v);
              run(v);
            }}
          />
          <RunButton onClick={() => run(mode)}>Ask the coach</RunButton>
        </div>
      </div>
      <XRes res={res} />
    </>
  );
}
