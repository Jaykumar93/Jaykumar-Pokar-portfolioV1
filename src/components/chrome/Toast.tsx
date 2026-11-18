"use client";

export function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div className={`toast${visible ? " show" : ""}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
