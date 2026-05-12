import { palette } from "../../theme";

export default function SectionTitle({ icon, title, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        {icon && <span style={{ fontSize: 22 }}>{icon}</span>}
        <h2 style={{ color: palette.accent, fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, margin: 0 }}>
          {title}
        </h2>
      </div>
      {sub && (
        <p style={{ color: palette.muted, fontSize: 12, margin: icon ? "4px 0 0 32px" : "4px 0 0 0", fontFamily: "'Space Mono', monospace" }}>
          {sub}
        </p>
      )}
      <div style={{ height: 2, background: `linear-gradient(90deg, ${palette.accent}, transparent)`, marginTop: 10, borderRadius: 2 }} />
    </div>
  );
}
