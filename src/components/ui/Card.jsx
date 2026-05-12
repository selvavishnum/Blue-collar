import { palette } from "../../theme";

export default function Card({ children, style = {}, onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: palette.card,
        border: `1px solid ${palette.cardBorder}`,
        borderRadius: 14,
        padding: "20px 22px",
        marginBottom: 16,
        transition: "border-color 0.2s, background 0.2s",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      onMouseEnter={hover && onClick ? (e) => {
        e.currentTarget.style.borderColor = palette.accent + "55";
        e.currentTarget.style.background = palette.cardHover;
      } : undefined}
      onMouseLeave={hover && onClick ? (e) => {
        e.currentTarget.style.borderColor = palette.cardBorder;
        e.currentTarget.style.background = palette.card;
      } : undefined}
    >
      {children}
    </div>
  );
}
