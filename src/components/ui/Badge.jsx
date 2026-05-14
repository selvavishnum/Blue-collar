export default function Badge({ color, children, size = "sm", glow = false }) {
  const fs = size === "xs" ? 9 : size === "sm" ? 11 : 12;
  const px = size === "xs" ? "6px 10px" : "3px 12px";
  return (
    <span style={{
      background: color + "18",
      color,
      border: `1px solid ${color}33`,
      borderRadius: 100,
      padding: px,
      fontSize: fs,
      fontWeight: 700,
      letterSpacing: 0.6,
      textTransform: "uppercase",
      fontFamily: "'Space Mono', monospace",
      whiteSpace: "nowrap",
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      boxShadow: glow ? `0 0 12px ${color}33` : "none",
    }}>
      {children}
    </span>
  );
}
