/**
 * Signature element: a small glass-shard chip beside every section label —
 * one recurring material motif tying the page together, instead of scattered
 * unrelated decoration per section.
 */
export function SectionLabel({ children, tone = "ink" }: { children: React.ReactNode; tone?: "ink" | "paper" }) {
  const color = tone === "ink" ? "var(--paper)" : "var(--ink)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <span
        aria-hidden="true"
        style={{
          width: 14,
          height: 14,
          borderRadius: 4,
          transform: "rotate(20deg)",
          background: "linear-gradient(135deg, var(--cobalt), var(--vermilion))",
          boxShadow: "inset 0 0 6px rgba(255,255,255,0.5)",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color,
          opacity: 0.7,
        }}
      >
        {children}
      </span>
    </div>
  );
}
