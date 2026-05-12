import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { palette } from "../theme";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

const stats = [
  { value: "10K+", label: "Workers Registered" },
  { value: "500+", label: "Active Businesses" },
  { value: "25", label: "Towns Covered" },
  { value: "95%", label: "Match Rate" },
];

const jobCategories = [
  { icon: "🍵", label: "Tea / Hotel" },
  { icon: "🚚", label: "Delivery" },
  { icon: "🔧", label: "Mechanic" },
  { icon: "🏗️", label: "Construction" },
  { icon: "🧹", label: "Housekeeping" },
  { icon: "⚡", label: "Electrician" },
  { icon: "🍳", label: "Cook / Chef" },
  { icon: "🌾", label: "Agriculture" },
];

const features = [
  {
    icon: "🤖",
    title: "AI Chatbot Onboarding",
    desc: "No resume needed. Our Tamil-speaking AI bot builds your profile through a friendly conversation.",
    color: palette.accent,
  },
  {
    icon: "📍",
    title: "Hyper-Local Matching",
    desc: "Jobs within 5–10 km. Find work near your home — no long commutes.",
    color: palette.blue,
  },
  {
    icon: "💬",
    title: "Direct Chat",
    desc: "Talk directly to employers via in-app chat or one-tap WhatsApp connect.",
    color: palette.green,
  },
  {
    icon: "✅",
    title: "Verified Profiles",
    desc: "Aadhaar & OTP verification builds trust between workers and owners.",
    color: palette.purple,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState(null);

  return (
    <div style={{ background: palette.bg, minHeight: "100vh" }}>
      {/* Header */}
      <header style={{
        background: "#050C1A",
        borderBottom: `1px solid ${palette.cardBorder}`,
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            background: palette.accent,
            borderRadius: 10,
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}>👷</div>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>Blue Collar Job</h1>
            <p style={{ color: palette.muted, fontSize: 10, margin: 0, fontFamily: "'Space Mono', monospace" }}>
              வேலை வாய்ப்பு — Tamil Nadu
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="ghost" size="sm" onClick={() => navigate("/worker/onboard")}>Worker Login</Button>
          <Button variant="primary" size="sm" onClick={() => navigate("/owner/dashboard")}>Owner Login</Button>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #050C1A 0%, #0D1B35 50%, #0A0F1E 100%)",
        padding: "72px 24px 60px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(${palette.accent}11 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            <Badge color={palette.green}>MOBILE-FIRST</Badge>
            <Badge color={palette.accent}>AI-DRIVEN</Badge>
            <Badge color={palette.blue}>HYPER-LOCAL</Badge>
            <Badge color={palette.purple}>ZERO RESUME</Badge>
          </div>

          <h2 style={{
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 18,
            background: `linear-gradient(135deg, ${palette.text}, ${palette.accent})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Blue-Collar Jobs,<br />Found in Minutes
          </h2>

          <p style={{ color: palette.muted, fontSize: 16, lineHeight: 1.7, marginBottom: 36, maxWidth: 520, margin: "0 auto 36px" }}>
            AI-powered job matching for workers across Tamil Nadu.<br />
            No resume. No English required. Just chat in Tamil.
          </p>

          {/* Role Selection */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              {
                role: "worker",
                icon: "👷",
                title: "I'm Looking for Work",
                sub: "வேலை தேடுகிறேன்",
                color: palette.blue,
                path: "/worker/onboard",
              },
              {
                role: "owner",
                icon: "🏪",
                title: "I'm Hiring",
                sub: "ஆட்கள் தேடுகிறேன்",
                color: palette.accent,
                path: "/owner/dashboard",
              },
            ].map((r) => (
              <div
                key={r.role}
                onClick={() => navigate(r.path)}
                onMouseEnter={() => setHoveredRole(r.role)}
                onMouseLeave={() => setHoveredRole(null)}
                style={{
                  background: hoveredRole === r.role ? r.color + "20" : palette.card,
                  border: `2px solid ${hoveredRole === r.role ? r.color : palette.cardBorder}`,
                  borderRadius: 16,
                  padding: "28px 40px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  minWidth: 200,
                  transform: hoveredRole === r.role ? "translateY(-4px)" : "none",
                  boxShadow: hoveredRole === r.role ? `0 12px 40px ${r.color}22` : "none",
                }}
              >
                <div style={{ fontSize: 42, marginBottom: 10 }}>{r.icon}</div>
                <p style={{ color: palette.text, fontWeight: 800, fontSize: 16, margin: "0 0 4px" }}>{r.title}</p>
                <p style={{ color: palette.muted, fontSize: 12, margin: 0, fontFamily: "'Space Mono', monospace" }}>{r.sub}</p>
                <div style={{
                  marginTop: 16,
                  background: r.color,
                  borderRadius: 8,
                  padding: "8px 0",
                  color: r.role === "owner" ? "#000" : palette.text,
                  fontWeight: 700,
                  fontSize: 13,
                }}>
                  Get Started →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        background: "#0D1528",
        borderTop: `1px solid ${palette.cardBorder}`,
        borderBottom: `1px solid ${palette.cardBorder}`,
        padding: "28px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 20 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p style={{ color: palette.accent, fontSize: 28, fontWeight: 800, margin: 0 }}>{s.value}</p>
              <p style={{ color: palette.muted, fontSize: 12, margin: "4px 0 0", fontFamily: "'Space Mono', monospace" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Job Categories */}
      <section style={{ padding: "56px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Popular Job Categories</h3>
          <p style={{ color: palette.muted, fontFamily: "'Space Mono', monospace", fontSize: 12 }}>
            From tea shops to delivery — we cover all blue-collar trades
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 12 }}>
          {jobCategories.map((cat) => (
            <div
              key={cat.label}
              style={{
                background: palette.card,
                border: `1px solid ${palette.cardBorder}`,
                borderRadius: 12,
                padding: "18px 12px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = palette.accent + "55";
                e.currentTarget.style.background = palette.cardHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = palette.cardBorder;
                e.currentTarget.style.background = palette.card;
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{cat.icon}</div>
              <p style={{ color: palette.muted, fontSize: 11, margin: 0, fontWeight: 600 }}>{cat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "0 24px 60px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Why Blue Collar Job?</h3>
          <p style={{ color: palette.muted, fontFamily: "'Space Mono', monospace", fontSize: 12 }}>
            Built for Tamil Nadu workers — in their language, on their terms
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: palette.card,
                border: `1px solid ${palette.cardBorder}`,
                borderLeft: `3px solid ${f.color}`,
                borderRadius: 12,
                padding: "20px",
              }}
            >
              <div style={{ fontSize: 30, marginBottom: 12 }}>{f.icon}</div>
              <h4 style={{ color: f.color, fontSize: 14, fontWeight: 800, marginBottom: 8 }}>{f.title}</h4>
              <p style={{ color: palette.muted, fontSize: 12, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: `linear-gradient(135deg, ${palette.accent}18, ${palette.blue}18)`,
        border: `1px solid ${palette.accent}33`,
        margin: "0 24px 60px",
        borderRadius: 20,
        padding: "44px 32px",
        textAlign: "center",
        maxWidth: 900 - 48,
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        <h3 style={{ fontSize: 26, fontWeight: 800, marginBottom: 10 }}>
          Ready to Find Your Next Job?
        </h3>
        <p style={{ color: palette.muted, fontSize: 14, marginBottom: 28 }}>
          Tamil-speaking AI bot · Takes only 3 minutes · No resume needed
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Button size="lg" onClick={() => navigate("/worker/onboard")}>
            👷 Start as Worker
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/owner/dashboard")}>
            🏪 Post a Job
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: "#050C1A",
        borderTop: `1px solid ${palette.cardBorder}`,
        padding: "24px",
        textAlign: "center",
      }}>
        <p style={{ color: palette.dim, fontSize: 12, fontFamily: "'Space Mono', monospace" }}>
          © 2025 Blue Collar Job · வேலை வாய்ப்பு · Tamil Nadu MVP
        </p>
      </footer>
    </div>
  );
}
