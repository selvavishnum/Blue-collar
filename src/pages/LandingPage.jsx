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
  const [hoveredCat, setHoveredCat] = useState(null);

  return (
    <div style={{ background: palette.bg, minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(4,8,15,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "14px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            background: `linear-gradient(135deg, ${palette.accent}, ${palette.orange})`,
            borderRadius: 11,
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            boxShadow: `0 4px 16px ${palette.accent}44`,
          }}>👷</div>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>Blue Collar Job</h1>
            <p style={{ color: palette.muted, fontSize: 9, margin: 0, fontFamily: "'Space Mono', monospace", letterSpacing: 0.5 }}>
              வேலை வாய்ப்பு · TAMIL NADU
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="ghost" size="sm" onClick={() => navigate("/worker/onboard")}>Worker Login</Button>
          <Button size="sm" onClick={() => navigate("/owner/dashboard")}>Owner Login</Button>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section style={{
        position: "relative",
        padding: "90px 24px 80px",
        textAlign: "center",
        overflow: "hidden",
        minHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Floating orbs */}
        <div style={{
          position: "absolute",
          top: "10%", left: "8%",
          width: 500, height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${palette.accent}22 0%, transparent 70%)`,
          animation: "orb1 12s ease-in-out infinite",
          pointerEvents: "none",
          filter: "blur(40px)",
        }} />
        <div style={{
          position: "absolute",
          top: "20%", right: "5%",
          width: 400, height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${palette.blue}22 0%, transparent 70%)`,
          animation: "orb2 16s ease-in-out infinite",
          pointerEvents: "none",
          filter: "blur(50px)",
        }} />
        <div style={{
          position: "absolute",
          bottom: "5%", left: "30%",
          width: 300, height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${palette.purple}18 0%, transparent 70%)`,
          animation: "orb1 20s ease-in-out infinite reverse",
          pointerEvents: "none",
          filter: "blur(60px)",
        }} />
        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(${palette.accent}0e 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
          pointerEvents: "none",
          opacity: 0.7,
        }} />

        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
          <div className="fade-up" style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            <Badge color={palette.green} glow>MOBILE-FIRST</Badge>
            <Badge color={palette.accent} glow>AI-DRIVEN</Badge>
            <Badge color={palette.blue} glow>HYPER-LOCAL</Badge>
            <Badge color={palette.purple} glow>ZERO RESUME</Badge>
          </div>

          <h2 className="fade-up" style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 20,
            letterSpacing: -1,
            background: `linear-gradient(135deg, ${palette.text} 0%, ${palette.textSoft} 40%, ${palette.accent} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Blue-Collar Jobs,<br />Found in Minutes
          </h2>

          <p className="fade-up" style={{
            color: palette.muted,
            fontSize: 16,
            lineHeight: 1.75,
            marginBottom: 44,
            maxWidth: 500,
            margin: "0 auto 44px",
          }}>
            AI-powered job matching for workers across Tamil Nadu.<br />
            <span style={{ color: palette.textSoft }}>No resume. No English required.</span> Just chat in Tamil.
          </p>

          {/* Role Selection Cards */}
          <div className="fade-up" style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              {
                role: "worker",
                icon: "👷",
                title: "I'm Looking for Work",
                sub: "வேலை தேடுகிறேன்",
                color: palette.blue,
                path: "/worker/onboard",
                ctaText: "Start Now",
              },
              {
                role: "owner",
                icon: "🏪",
                title: "I'm Hiring",
                sub: "ஆட்கள் தேடுகிறேன்",
                color: palette.accent,
                path: "/owner/dashboard",
                ctaText: "Post a Job",
              },
            ].map((r) => (
              <div
                key={r.role}
                onClick={() => navigate(r.path)}
                onMouseEnter={() => setHoveredRole(r.role)}
                onMouseLeave={() => setHoveredRole(null)}
                style={{
                  background: hoveredRole === r.role
                    ? `rgba(${r.color === palette.blue ? "99,102,241" : "245,158,11"},0.12)`
                    : "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: `1.5px solid ${hoveredRole === r.role ? r.color + "77" : "rgba(255,255,255,0.09)"}`,
                  borderRadius: 20,
                  padding: "32px 44px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  minWidth: 210,
                  transform: hoveredRole === r.role ? "translateY(-6px) scale(1.02)" : "none",
                  boxShadow: hoveredRole === r.role ? `0 20px 60px ${r.color}28` : "none",
                }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: r.color + "22",
                  border: `1.5px solid ${r.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 32, margin: "0 auto 16px",
                  boxShadow: hoveredRole === r.role ? `0 8px 24px ${r.color}33` : "none",
                  transition: "box-shadow 0.25s",
                }}>{r.icon}</div>
                <p style={{ color: palette.text, fontWeight: 800, fontSize: 16, margin: "0 0 6px" }}>{r.title}</p>
                <p style={{ color: palette.muted, fontSize: 11, margin: "0 0 20px", fontFamily: "'Space Mono', monospace" }}>{r.sub}</p>
                <div style={{
                  background: hoveredRole === r.role
                    ? `linear-gradient(135deg, ${r.color}, ${r.color === palette.blue ? palette.purple : palette.orange})`
                    : r.color + "22",
                  border: `1px solid ${r.color}44`,
                  borderRadius: 10,
                  padding: "9px 0",
                  color: hoveredRole === r.role ? (r.role === "owner" ? "#000" : "#fff") : r.color,
                  fontWeight: 700,
                  fontSize: 13,
                  transition: "all 0.25s",
                  boxShadow: hoveredRole === r.role ? `0 4px 16px ${r.color}55` : "none",
                }}>
                  {r.ctaText} →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 24 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p style={{
                fontSize: 32,
                fontWeight: 800,
                margin: "0 0 4px",
                fontFamily: "'Space Mono', monospace",
                background: `linear-gradient(135deg, ${palette.accent}, ${palette.orange})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>{s.value}</p>
              <p style={{ color: palette.muted, fontSize: 11, margin: 0, fontFamily: "'Space Mono', monospace", textTransform: "uppercase", letterSpacing: 0.5 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Job Categories ────────────────────────────────────────────── */}
      <section style={{ padding: "72px 24px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <p style={{ color: palette.accent, fontSize: 11, fontFamily: "'Space Mono', monospace", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
            What We Cover
          </p>
          <h3 style={{
            fontSize: "clamp(24px, 3vw, 34px)",
            fontWeight: 800,
            marginBottom: 10,
            background: `linear-gradient(135deg, ${palette.text}, ${palette.textSoft})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Popular Job Categories</h3>
          <p style={{ color: palette.muted, fontFamily: "'Space Mono', monospace", fontSize: 12, margin: 0 }}>
            From tea shops to delivery — we cover all blue-collar trades
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 14 }}>
          {jobCategories.map((cat, i) => (
            <div
              key={cat.label}
              onMouseEnter={() => setHoveredCat(i)}
              onMouseLeave={() => setHoveredCat(null)}
              style={{
                background: hoveredCat === i ? palette.accent + "14" : "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${hoveredCat === i ? palette.accent + "55" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 14,
                padding: "22px 12px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                transform: hoveredCat === i ? "translateY(-3px)" : "none",
                boxShadow: hoveredCat === i ? `0 8px 24px ${palette.accent}20` : "none",
              }}
            >
              <div style={{
                fontSize: 30,
                marginBottom: 10,
                transition: "transform 0.2s",
                transform: hoveredCat === i ? "scale(1.15)" : "scale(1)",
                display: "block",
              }}>{cat.icon}</div>
              <p style={{ color: hoveredCat === i ? palette.accent : palette.muted, fontSize: 11, margin: 0, fontWeight: 700, transition: "color 0.2s" }}>
                {cat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section style={{ padding: "0 24px 72px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <p style={{ color: palette.blue, fontSize: 11, fontFamily: "'Space Mono', monospace", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
            Why Choose Us
          </p>
          <h3 style={{
            fontSize: "clamp(24px, 3vw, 34px)",
            fontWeight: 800,
            marginBottom: 10,
            background: `linear-gradient(135deg, ${palette.text}, ${palette.textSoft})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Built for Tamil Nadu</h3>
          <p style={{ color: palette.muted, fontFamily: "'Space Mono', monospace", fontSize: 12, margin: 0 }}>
            In their language, on their terms
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 18 }}>
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid rgba(255,255,255,0.08)`,
                borderTop: `2px solid ${f.color}`,
                borderRadius: 16,
                padding: "24px 20px",
                transition: "box-shadow 0.25s",
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: f.color + "18",
                border: `1px solid ${f.color}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, marginBottom: 16,
              }}>{f.icon}</div>
              <h4 style={{ color: f.color, fontSize: 14, fontWeight: 800, marginBottom: 8 }}>{f.title}</h4>
              <p style={{ color: palette.muted, fontSize: 12, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{
          maxWidth: 860,
          margin: "0 auto",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid rgba(245,158,11,0.25)`,
          borderRadius: 24,
          padding: "56px 40px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400, height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${palette.accent}0f 0%, transparent 70%)`,
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative" }}>
            <p style={{ color: palette.accent, fontSize: 11, fontFamily: "'Space Mono', monospace", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>
              Get Started Today
            </p>
            <h3 style={{
              fontSize: "clamp(22px, 3vw, 34px)",
              fontWeight: 800,
              marginBottom: 12,
              background: `linear-gradient(135deg, ${palette.text}, ${palette.accent})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Ready to Find Your Next Job?
            </h3>
            <p style={{ color: palette.muted, fontSize: 14, marginBottom: 32, maxWidth: 420, margin: "0 auto 32px" }}>
              Tamil-speaking AI bot · Takes only 3 minutes · No resume needed
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Button size="lg" onClick={() => navigate("/worker/onboard")}>
                👷 Start as Worker
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/owner/dashboard")}>
                🏪 Post a Job
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "28px 24px",
        textAlign: "center",
      }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{
            background: `linear-gradient(135deg, ${palette.accent}, ${palette.orange})`,
            borderRadius: 8, width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
          }}>👷</div>
          <span style={{ fontWeight: 800, fontSize: 14 }}>Blue Collar Job</span>
        </div>
        <p style={{ color: palette.dim, fontSize: 11, fontFamily: "'Space Mono', monospace" }}>
          © 2025 Blue Collar Job · வேலை வாய்ப்பு · Tamil Nadu MVP
        </p>
      </footer>
    </div>
  );
}
