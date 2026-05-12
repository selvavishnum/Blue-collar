import { palette } from "../../theme";

const variants = {
  primary: {
    background: palette.accent,
    color: "#000",
    border: "none",
    hoverBg: palette.accentSoft,
  },
  outline: {
    background: "transparent",
    color: palette.accent,
    border: `1.5px solid ${palette.accent}`,
    hoverBg: palette.accent + "15",
  },
  ghost: {
    background: "transparent",
    color: palette.muted,
    border: `1px solid ${palette.cardBorder}`,
    hoverBg: palette.cardBorder,
  },
  danger: {
    background: palette.red + "22",
    color: palette.red,
    border: `1px solid ${palette.red}44`,
    hoverBg: palette.red + "33",
  },
  success: {
    background: palette.green + "22",
    color: palette.green,
    border: `1px solid ${palette.green}44`,
    hoverBg: palette.green + "33",
  },
};

export default function Button({ children, variant = "primary", onClick, disabled, style = {}, full = false, size = "md" }) {
  const v = variants[variant] || variants.primary;
  const padding = size === "sm" ? "7px 16px" : size === "lg" ? "14px 28px" : "10px 20px";
  const fontSize = size === "sm" ? 12 : size === "lg" ? 15 : 13;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: v.background,
        color: v.color,
        border: v.border,
        borderRadius: 8,
        padding,
        fontSize,
        fontWeight: 700,
        fontFamily: "'Syne', sans-serif",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.18s",
        width: full ? "100%" : "auto",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        ...style,
      }}
      onMouseEnter={!disabled ? (e) => { e.currentTarget.style.background = v.hoverBg; } : undefined}
      onMouseLeave={!disabled ? (e) => { e.currentTarget.style.background = v.background; } : undefined}
    >
      {children}
    </button>
  );
}
