import { useState } from "react";
import { palette } from "../../theme";

const variants = {
  primary: {
    bg: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.orange} 100%)`,
    bgHover: `linear-gradient(135deg, ${palette.accentSoft} 0%, ${palette.accent} 100%)`,
    color: "#000",
    border: "none",
    shadow: `0 4px 20px rgba(245,158,11,0.3)`,
    shadowHover: `0 6px 32px rgba(245,158,11,0.55)`,
  },
  outline: {
    bg: "transparent",
    bgHover: palette.accent + "15",
    color: palette.accent,
    border: `1.5px solid ${palette.accent}`,
    shadow: "none",
    shadowHover: `0 0 24px ${palette.accent}44`,
  },
  ghost: {
    bg: "rgba(255,255,255,0.04)",
    bgHover: "rgba(255,255,255,0.09)",
    color: palette.muted,
    border: `1px solid rgba(255,255,255,0.08)`,
    shadow: "none",
    shadowHover: "none",
  },
  danger: {
    bg: palette.red + "18",
    bgHover: palette.red + "2e",
    color: palette.red,
    border: `1px solid ${palette.red}44`,
    shadow: "none",
    shadowHover: `0 0 18px ${palette.red}44`,
  },
  success: {
    bg: palette.green + "18",
    bgHover: palette.green + "2e",
    color: palette.green,
    border: `1px solid ${palette.green}44`,
    shadow: "none",
    shadowHover: `0 0 18px ${palette.green}44`,
  },
  blue: {
    bg: `linear-gradient(135deg, ${palette.blue}, ${palette.purple})`,
    bgHover: `linear-gradient(135deg, ${palette.blueSoft}, ${palette.blue})`,
    color: "#fff",
    border: "none",
    shadow: `0 4px 20px rgba(99,102,241,0.3)`,
    shadowHover: `0 6px 32px rgba(99,102,241,0.55)`,
  },
};

export default function Button({ children, variant = "primary", onClick, disabled, style = {}, full = false, size = "md" }) {
  const [hovered, setHovered] = useState(false);
  const v = variants[variant] || variants.primary;
  const padding = size === "xs" ? "5px 12px" : size === "sm" ? "7px 16px" : size === "lg" ? "14px 32px" : "10px 22px";
  const fontSize = size === "xs" ? 11 : size === "sm" ? 12 : size === "lg" ? 15 : 13;
  const radius = size === "lg" ? 12 : 10;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered && !disabled ? v.bgHover : v.bg,
        color: v.color,
        border: v.border,
        borderRadius: radius,
        padding,
        fontSize,
        fontWeight: 700,
        fontFamily: "'Syne', sans-serif",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transform: hovered && !disabled ? "translateY(-1px) scale(1.015)" : "translateY(0) scale(1)",
        width: full ? "100%" : "auto",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        letterSpacing: 0.3,
        boxShadow: hovered && !disabled ? v.shadowHover : v.shadow,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
