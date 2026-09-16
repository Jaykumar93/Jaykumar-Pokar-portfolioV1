"use client";

import Link from "next/link";
import styles from "./ArrowButton.module.css";

/**
 * Dual-text-swap hover button, rebuilt from studying agustinburgos.com's CTA:
 * the label has a duplicate layer that slides up into view on hover while the
 * original slides out above it, and the arrow (in its own wrapper) shifts
 * further along its own diagonal instead of just sitting still.
 */
export function ArrowButton({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
}) {
  return (
    <Link href={href} className={`${styles.btn} ${variant === "outline" ? styles.outline : styles.solid}`}>
      <span className={styles.textWrap}>
        <span className={styles.text}>{children}</span>
        <span className={styles.textHover} aria-hidden="true">
          {children}
        </span>
      </span>
      <span className={styles.arrowWrap} aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={styles.arrowGhost}>
          <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
