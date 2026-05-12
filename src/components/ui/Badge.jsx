export default function Badge({ color, children, size = "sm" }) {
  const fontSize = size === "xs" ? 10 : size === "sm" ? 11 : 12;
  return (
    <span
      style={{
        background: color + "22",
        color,
        border: `1px solid ${color}44`,
        borderRadius: 6,
        padding: size === "xs" ? "1px 7px" : "2px 10px",
        fontSize,
        fontWeight: 700,
        letterSpacing: 0.8,
        textTransform: "uppercase",
        fontFamily: "'Space Mono', monospace",
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {children}
    </span>
  );
}
