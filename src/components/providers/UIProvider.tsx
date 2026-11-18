"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CaseStudy } from "@/components/projects/CaseStudy";
import { CommandMenu } from "@/components/chrome/CommandMenu";
import { Toast } from "@/components/chrome/Toast";

interface UIContextValue {
  /** Open a project case study. Pass the click position so the overlay expands from it. */
  openCase: (index: number, origin?: { x: number; y: number }) => void;
  closeCase: () => void;
  toast: (message: string) => void;
  openPalette: () => void;
  closePalette: () => void;
  paletteOpen: boolean;
  scrollToId: (id: string) => void;
  /** Scroll to the Engineering section and select a tab. Engineering watches `engRequest`. */
  requestEng: (index: number) => void;
  engRequest: { index: number; nonce: number } | null;
}

const UIContext = createContext<UIContextValue | null>(null);

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [caseState, setCaseState] = useState({ index: 0, open: false, x: 0, y: 0 });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toastState, setToastState] = useState({ text: "", show: false });
  const [engRequest, setEngRequest] = useState<{ index: number; nonce: number } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((text: string) => {
    setToastState({ text, show: true });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastState((t) => ({ ...t, show: false })), 3200);
  }, []);

  const scrollToId = useCallback((id: string) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }, []);

  const openCase = useCallback((index: number, origin?: { x: number; y: number }) => {
    setCaseState({ index, open: true, x: origin?.x ?? window.innerWidth / 2, y: origin?.y ?? window.innerHeight / 2 });
  }, []);
  const closeCase = useCallback(() => setCaseState((s) => ({ ...s, open: false })), []);
  const navigateCase = useCallback((index: number) => setCaseState((s) => ({ ...s, index })), []);


  const requestEng = useCallback(
    (index: number) => {
      setEngRequest({ index, nonce: Date.now() });
      scrollToId("engineering");
    },
    [scrollToId],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      } else if (e.key === "Escape") {
        if (paletteOpen) setPaletteOpen(false);
        else if (caseState.open) closeCase();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [paletteOpen, caseState.open, closeCase]);

  useEffect(() => {
    document.body.style.overflow = paletteOpen || caseState.open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [paletteOpen, caseState.open]);

  const value = useMemo<UIContextValue>(
    () => ({
      openCase,
      closeCase,
      toast,
      openPalette: () => setPaletteOpen(true),
      closePalette: () => setPaletteOpen(false),
      paletteOpen,
      scrollToId,
      requestEng,
      engRequest,
    }),
    [openCase, closeCase, toast, paletteOpen, scrollToId, requestEng, engRequest],
  );

  return (
    <UIContext.Provider value={value}>
      {children}
      <CaseStudy index={caseState.index} open={caseState.open} origin={{ x: caseState.x, y: caseState.y }} onClose={closeCase} onNavigate={navigateCase} />
      <CommandMenu />
      <Toast message={toastState.text} visible={toastState.show} />
    </UIContext.Provider>
  );
}
