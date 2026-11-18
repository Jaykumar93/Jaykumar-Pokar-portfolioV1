"use client";
import { useEffect, useState } from "react";
import { tween } from "@/lib/tween";
import { useReducedMotion } from "./useReducedMotion";

/** Counts from 0 to target once `start` becomes true. Shows the final value until then. */
export function useCountUp(target: number, start: boolean, duration = 1400): number {
  const [value, setValue] = useState(target);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!start) return;
    return tween(0, target, duration, setValue, reduced);
  }, [start, target, duration, reduced]);
  return value;
}
