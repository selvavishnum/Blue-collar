import { palette } from "../../theme";

export default function SectionTitle({ icon, title, sub, center = false, gradient = false }) {
  return (
    <div style={{ marginBottom: 28, textAlign: center ? "center" : "left" }}>
      {icon && (
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          borderRadius: 12,
          background: palette.accent + "18",
          border: `1px solid ${palette.accent}33`,
          fontSize: 22,
          marginBottom: 12,
        }}>{icon}</div>
      )}
      <h2 style={{
        fontSize: 22,
        fontWeight: 800,
        margin: "0 0 6px",
        ...(gradient ? {
          background: `linear-gradient(135deg, ${palette.text}, ${palette.accent})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        } : { color: palette.text }),
      }}>
        {title}
      </h2>
      {sub && (
        <p style={{
          color: palette.muted,
          fontSize: 12,
          margin: 0,
          fontFamily: "'Space Mono', monospace",
          lineHeight: 1.6,
        }}>
          {sub}
        </p>
      )}
      <div style={{
        height: 2,
        width: center ? 48 : 56,
        background: `linear-gradient(90deg, ${palette.accent}, ${palette.orange})`,
        borderRadius: 2,
        marginTop: 12,
        ...(center ? { marginLeft: "auto", marginRight: "auto" } : {}),
      }} />
    </div>
  );
}
