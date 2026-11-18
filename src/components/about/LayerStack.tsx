"use client";

import { useEffect, useRef, type CSSProperties, type KeyboardEvent } from "react";
import { layers } from "@/data/about";
import type { LayerKey } from "@/data/types";

interface LayerStackProps {
  /** Which slabs are lit. "all" once the visitor has clicked a layer. */
  on: readonly LayerKey[] | "all";
  selected: LayerKey;
  onSelect: (layer: LayerKey) => void;
}

const INITIAL_RZ = -38;

export function LayerStack({ on, selected, onSelect }: LayerStackProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const slabsRef = useRef<HTMLDivElement>(null);
  const rz = useRef(INITIAL_RZ);
  const drag = useRef<{ x: number; rz: number } | null>(null);
  const moved = useRef(false);

  const applyRotation = () => {
    slabsRef.current?.style.setProperty("--rz", `${rz.current}deg`);
  };

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const onDown = (e: PointerEvent) => {
      drag.current = { x: e.clientX, rz: rz.current };
      moved.current = false;
    };
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const dx = e.clientX - d.x;
      if (Math.abs(dx) > 4) moved.current = true;
      rz.current = d.rz + dx * 0.5;
      slabsRef.current?.style.setProperty("--rz", `${rz.current}deg`);
    };
    const onUp = () => {
      drag.current = null;
    };
    scene.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      scene.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    rz.current += e.key === "ArrowRight" ? 15 : -15;
    applyRotation();
  };

  const onSlabClick = (i: LayerKey) => {
    if (moved.current) {
      moved.current = false;
      return;
    }
    onSelect(i);
  };

  const info = layers[selected];

  return (
    <>
      <div
        ref={sceneRef}
        className="slab-scene"
        tabIndex={0}
        aria-label="Layers I work across. Drag or use the arrow keys to rotate."
        onKeyDown={onKeyDown}
      >
        <div ref={slabsRef} className="slabs open">
          {layers.map((layer, i) => {
            const key = i as LayerKey;
            const lit = on === "all" || on.includes(key);
            const cls = ["slab", lit ? "on" : "", key === selected ? "sel" : ""].filter(Boolean).join(" ");
            return (
              <button
                key={layer.name}
                type="button"
                className={cls}
                data-l={i}
                aria-pressed={key === selected}
                style={{ "--i": i, "--sc": `var(--sl${i})` } as CSSProperties}
                onClick={() => onSlabClick(key)}
              >
                {layer.label}
              </button>
            );
          })}
        </div>
      </div>
      <p className="hint">Drag to rotate. Click a layer to see what I do in it.</p>
      <div className="layer-info" aria-live="polite">
        <div className="li-h">
          <b>{info.name}</b>
          <span className="mono">layer {selected + 1} of {layers.length}</span>
        </div>
        <p>{info.text}</p>
        <div className="chips">
          {info.chips.map((c) => (
            <span key={c} className="chip">{c}</span>
          ))}
        </div>
      </div>
    </>
  );
}
