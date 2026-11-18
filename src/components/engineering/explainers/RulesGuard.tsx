"use client";

import { useState } from "react";
import { Arr, FlowNode, RunButton, Seg, XRes, useTimers, type Result } from "../shared";

type Mode = "off" | "on";
type NodeCls = "" | "hot" | "hit" | "miss";

const MODES = [
  { value: "off", label: "No guard" },
  { value: "on", label: "Guard on" },
] as const;

export function RulesGuard() {
  const t = useTimers();
  const [mode, setMode] = useState<Mode>("on");
  const [nodes, setNodes] = useState<NodeCls[]>(["", "", "", ""]);
  const [draft, setDraft] = useState("-");
  const [seen, setSeen] = useState("-");
  const [res, setRes] = useState<Result>({ text: "Ask the coach and compare. Numbers are illustrative." });

  const setNode = (i: number, cls: NodeCls) => setNodes((p) => p.map((c, k) => (k === i ? cls : c)));

  const run = (m: Mode) => {
    t.clear();
    setNodes(["", "", "", ""]);
    setDraft("-");
    setSeen("-");
    setRes({ text: "" });
    t.after(100, () => setNode(0, "hot"));
    t.after(800, () => {
      setNode(0, "");
      setNode(1, "hot");
      setDraft("60 km");
    });
    t.after(1600, () => {
      setNode(1, "");
      setNode(2, m === "on" ? "hit" : "miss");
    });
    t.after(2300, () => {
      setNode(3, "hot");
      if (m === "on") {
        setSeen("42 km");
        setRes({ text: "The guard caught 60 km and replaced it with the engine's 42 km.", tone: "good" });
      } else {
        setSeen("60 km");
        setRes({ text: "The model invented a number the plan never set, and the runner trusts it.", tone: "bad" });
      }
    });
  };

  return (
    <>
      <div className="xbox">
        <div className="flowx">
          <FlowNode title="Plan engine" sub="pure rules" cls={nodes[0]} />
          <Arr />
          <FlowNode title="AI draft" sub="the model writes" cls={nodes[1]} />
          <Arr />
          <FlowNode title="Guard" sub="checks numbers" cls={nodes[2]} />
          <Arr />
          <FlowNode title="Reply" sub="to the runner" cls={nodes[3]} />
        </div>
        <div className="stats">
          <div>
            Engine says<b>42 km</b>
          </div>
          <div>
            Model drafts<b>{draft}</b>
          </div>
          <div>
            Runner sees<b>{seen}</b>
          </div>
        </div>
        <div className="xctl">
          <Seg
            label="Guard"
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
