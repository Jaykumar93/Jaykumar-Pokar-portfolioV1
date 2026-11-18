/** Eased number tween. Returns a cancel function. Snaps to the end value when reduced motion is on. */
export function tween(from: number, to: number, duration: number, onUpdate: (value: number) => void, reduced = false): () => void {
  if (reduced || duration <= 0) {
    onUpdate(to);
    return () => {};
  }
  let raf = 0;
  const t0 = performance.now();
  const step = (t: number) => {
    const p = Math.min(1, (t - t0) / duration);
    const e = 1 - Math.pow(1 - p, 3);
    onUpdate(Math.round(from + (to - from) * e));
    if (p < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}
