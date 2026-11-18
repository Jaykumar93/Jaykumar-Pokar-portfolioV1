"use client";

import { useRef, useState } from "react";
import { Arr, RunButton, XRes, useTimers, type Result } from "../shared";

type NodeCls = "" | "hot" | "hit" | "miss";
const CLEAR: NodeCls[] = ["", "", "", ""];

export function Cache() {
  const t = useTimers();
  const [nodes, setNodes] = useState<NodeCls[]>(CLEAR);
  const [redisSub, setRedisSub] = useState("cache");
  const [down, setDown] = useState(false);
  const [stats, setStats] = useState({ n: 0, h: 0, last: "-" });
  const [res, setRes] = useState<Result>({ text: "Send a request. The first one misses. Numbers are illustrative." });
  // Mutable simulation state read from timer callbacks.
  const sim = useRef({ cached: false, down: false, n: 0, h: 0, busy: false });

  const setNode = (i: number, cls: NodeCls) => setNodes((p) => p.map((c, k) => (k === i ? cls : c)));

  const send = () => {
    const s = sim.current;
    if (s.busy) return;
    s.busy = true;
    s.n++;
    const hit = s.cached && !s.down;
    const path = hit ? [0, 1, 2] : [0, 1, 2, 3];
    setNodes(CLEAR);
    setRedisSub("cache");
    path.forEach((idx, k) => {
      t.after(k * 280, () => {
        if (idx === 2) {
          setNode(2, hit ? "hit" : "miss");
          setRedisSub(sim.current.down ? "down" : hit ? "hit" : "miss");
        } else setNode(idx, "hot");
      });
    });
    t.after(path.length * 280 + 120, () => {
      if (hit) s.h++;
      if (!s.down) s.cached = true;
      s.busy = false;
      setStats({ n: s.n, h: s.h, last: hit ? "~5 ms" : "~82 ms" });
      if (s.down) setRes({ text: "Redis is unreachable. The fault is logged and the request is served without the cache.", tone: "bad" });
      else if (hit) setRes({ text: "Redis answered. The database was not touched.", tone: "good" });
      else setRes({ text: "Cache miss. The database answered and Redis stored the result." });
    });
  };

  const expire = () => {
    sim.current.cached = false;
    setNodes(CLEAR);
    setRes({ text: "Cache expired. The next request goes to the database." });
  };

  const toggleDown = () => {
    const next = !sim.current.down;
    sim.current.down = next;
    setDown(next);
    setNodes(CLEAR);
    setRes({ text: next ? "Redis is down. Send a request." : "Redis is back." });
  };

  const cls = (i: number) => `nodex${nodes[i] ? ` ${nodes[i]}` : ""}`;

  return (
    <>
      <div className="xbox">
        <div className="flowx">
          <div className={cls(0)}>
            Client<small>request</small>
          </div>
          <Arr />
          <div className={cls(1)}>
            API<small>.NET</small>
          </div>
          <Arr />
          <div className={cls(2)}>
            Redis<small>{redisSub}</small>
          </div>
          <Arr />
          <div className={cls(3)}>
            SQL Server<small>database</small>
          </div>
        </div>
        <div className="stats">
          <div>
            Requests<b>{stats.n}</b>
          </div>
          <div>
            Cache hits<b>{stats.h}</b>
          </div>
          <div>
            Last reply<b>{stats.last}</b>
          </div>
        </div>
        <div className="xctl">
          <RunButton onClick={send}>Send request</RunButton>
          <button className="ghost" type="button" onClick={expire}>
            Expire cache
          </button>
          <button className="ghost" type="button" aria-pressed={down} onClick={toggleDown}>
            {down ? "Restore Redis" : "Take Redis down"}
          </button>
        </div>
      </div>
      <XRes res={res} />
    </>
  );
}
