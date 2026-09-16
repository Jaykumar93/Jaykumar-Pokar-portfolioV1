"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { ScrambleText } from "./ScrambleText";
import styles from "./LoadingScreen.module.css";

const MIN_VISIBLE_MS = 1000;
const HARD_TIMEOUT_MS = 4000;
const EXIT_DURATION_MS = 650;

/**
 * Full-screen preloader shown until the 3D scene's assets (Environment HDRI,
 * shader compilation) and web fonts are ready. Guarantees a minimum visible
 * time so it never just flickers, and force-completes after a hard timeout
 * so a stalled/failed asset can never strand the visitor behind it.
 */
export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const { progress } = useProgress();
  const [minTimeDone, setMinTimeDone] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [forceReady, setForceReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(true);
  const exitStarted = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setMinTimeDone(true), MIN_VISIBLE_MS);
    const hardTimeout = setTimeout(() => setForceReady(true), HARD_TIMEOUT_MS);
    return () => {
      clearTimeout(t);
      clearTimeout(hardTimeout);
    };
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => setFontsReady(true));
    } else {
      setFontsReady(true);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const ready = forceReady || (progress >= 100 && minTimeDone && fontsReady);

  useEffect(() => {
    if (!ready || exitStarted.current) return;
    exitStarted.current = true;
    setExiting(true);
    const t = setTimeout(() => {
      setMounted(false);
      document.body.style.overflow = "";
      onComplete();
    }, EXIT_DURATION_MS);
    return () => clearTimeout(t);
  }, [ready, onComplete]);

  if (!mounted) return null;

  return (
    <div className={`${styles.overlay} ${exiting ? styles.exit : ""}`} aria-hidden="true">
      <div className={styles.content}>
        <div className={styles.mark}>JP</div>
        <ScrambleText as="p" text="LOADING PORTFOLIO" className={styles.label} duration={900} />
        <div className={styles.barTrack}>
          <div className={styles.barFill} style={{ width: `${Math.min(100, progress)}%` }} />
        </div>
        <p className={styles.percent}>{Math.floor(Math.min(100, progress))}%</p>
      </div>
    </div>
  );
}
