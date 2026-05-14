import { useState } from "react";
import { palette } from "../../theme";

export default function Card({ children, style = {}, onClick, hover = false, glow = null }) {
  const [hovered, setHovered] = useState(false);
  const isInteractive = (hover || onClick) && onClick;

  return (
    <div
      onClick={onClick}
      onMouseEnter={isInteractive ? () => setHovered(true) : undefined}
      onMouseLeave={isInteractive ? () => setHovered(false) : undefined}
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${hovered ? (glow ? glow + "66" : palette.accent + "44") : "rgba(255,255,255,0.08)"}`,
        borderRadius: 16,
        padding: "20px 22px",
        marginBottom: 14,
        transition: "all 0.25s ease",
        cursor: onClick ? "pointer" : "default",
        transform: isInteractive && hovered ? "translateY(-2px)" : "none",
        boxShadow: isInteractive && hovered
          ? `0 8px 32px ${glow || palette.accent}22`
          : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
