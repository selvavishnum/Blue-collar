import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { palette } from "../theme";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { chatApi, isApiAvailable } from "../services/chatApi.js";

// Fallback simulation when backend is not running
const SIM_FLOWS = {
  0: "வணக்கம் 🙏 நான் உங்களுக்கு வேலை கண்டுபிடிக்க help பண்ணுவேன்!\n\nஎன் பேரு Velai Bot. நீங்கள் என்ன மாதிரி வேலை தேடுகிறீர்கள்? 😊",
  1: (u) => `Nice da! ${u} job-a? 😊 அந்த job-la என்ன main skill வேணும்?\n(What is your main skill for this job?)`,
  2: (u) => `${u} — good skill! 👏\nஎத்தனை வருஷமா இந்த வேலை பாக்குறீங்க? (Years of experience?)`,
  3: (u) => `${u} experience — perfect! 💪\nநீங்கள் இப்போது எங்கே இருக்கீங்க? (Which area/town?)`,
  4: (u) => `${u}! 📍 Max எத்தனை km travel பண்ண ready?`,
  5: (u) => `Okay, ${u} range! 🗺️\nஒரு மாசத்திற்கு எவ்வளவு சம்பளம் expect பண்றீங்க? 💰`,
  6: (u) => `${u} — reasonable! ✅\nFull-time வேணுமா, part-time சரியா, or contract basis? 👇`,
  7: (u) => `${u} noted! 📝\nஉங்க phone number OTP verify பண்ண விரும்புகிறீர்களா? Verified workers get 3x more job offers! 🔐`,
};

const STATE_LABELS = ["Intro", "Skills", "Experience", "Location", "Travel", "Salary", "Work Type", "Verify"];

const STATE_NAMES = ["GREETING", "SKILLS", "EXPERIENCE", "LOCATION", "RADIUS", "SALARY", "WORKTYPE", "VERIFY", "DONE"];

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "12px 14px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: palette.blue,
          animation: `bounce 1s ease ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

function ChatBubble({ role, msg, isTyping }) {
  const isBot = role === "bot";
  return (
    <div className="fade-in" style={{
      display: "flex",
      justifyContent: isBot ? "flex-start" : "flex-end",
      marginBottom: 12, gap: 8, alignItems: "flex-end",
    }}>
      {isBot && (
        <div style={{
          width: 30, height: 30, borderRadius: "50%", background: palette.accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, flexShrink: 0,
        }}>🤖</div>
      )}
      <div style={{
        background: isBot ? "#1A2D45" : "#1A3A28",
        border: `1px solid ${isBot ? palette.blue + "33" : palette.green + "33"}`,
        borderRadius: isBot ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
        padding: isTyping ? "4px 8px" : "10px 14px",
        maxWidth: "75%",
      }}>
        <p style={{ color: isBot ? palette.blue : palette.green, fontSize: 9, fontFamily: "'Space Mono', monospace", margin: "0 0 4px" }}>
          {isBot ? "🤖 Velai Bot" : "👷 You"}
        </p>
        {isTyping ? <TypingIndicator /> : (
          <p style={{ color: palette.text, fontSize: 13, margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{msg}</p>
        )}
      </div>
      {!isBot && (
        <div style={{
          width: 30, height: 30, borderRadius: "50%", background: palette.green + "33",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, flexShrink: 0,
        }}>👷</div>
      )}
    </div>
  );
}

export default function WorkerOnboard() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [done, setDone] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [profile, setProfile] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [useRealApi, setUseRealApi] = useState(false);
  const [apiMode, setApiMode] = useState(null); // "real" | "sim"
  const [simStep, setSimStep] = useState(0);
  const [progress, setProgress] = useState({ current: 1, total: 8, percent: 12, label: "GREETING" });
  const [showOptions, setShowOptions] = useState(null); // options for quick-select steps
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, botTyping]);

  // On mount: try real API, fall back to simulation
  useEffect(() => {
    const init = async () => {
      setBotTyping(true);
      const available = await isApiAvailable();
      if (available) {
        try {
          const data = await chatApi.start();
          setSessionId(data.sessionId);
          setUseRealApi(true);
          setApiMode("real");
          setProgress(data.progress || progress);
          setBotTyping(false);
          setMessages([{ role: "bot", msg: data.message }]);
          return;
        } catch {
          // fall through to simulation
        }
      }
      // Simulation fallback
      setApiMode("sim");
      setTimeout(() => {
        setBotTyping(false);
        setMessages([{ role: "bot", msg: SIM_FLOWS[0] }]);
      }, 900);
    };
    init();
  }, []);

  const appendBot = (msg) => setMessages((prev) => [...prev, { role: "bot", msg }]);

  // Option lists for specific sim steps
  const getOptionsForStep = (step) => {
    if (step === 6) return ["Full-time", "Part-time", "Contract"];
    if (step === 7) return ["Yes, Verify Me ✅", "Skip for now"];
    return null;
  };

  const sendMessage = async (userMsg) => {
    if (!userMsg?.trim() || botTyping) return;
    setMessages((prev) => [...prev, { role: "user", msg: userMsg }]);
    setInput("");
    setShowOptions(null);
    setBotTyping(true);

    if (useRealApi && sessionId) {
      try {
        const data = await chatApi.sendMessage(sessionId, userMsg);
        setBotTyping(false);
        appendBot(data.message);
        if (data.progress) setProgress(data.progress);
        if (data.otpRequired) {
          setShowOTP(true);
        } else if (data.completed) {
          await finishWithRealApi();
        } else {
          const opts = getOptionsForStep(data.progress?.current);
          if (opts) setShowOptions(opts);
        }
      } catch (err) {
        setBotTyping(false);
        appendBot(`Sorry, API error: ${err.message}. Please try again.`);
      }
      return;
    }

    // Simulation path
    const nextStep = simStep + 1;
    setSimStep(nextStep);
    const newProg = {
      current: Math.min(nextStep + 1, 8),
      total: 8,
      percent: Math.round(((nextStep + 1) / 8) * 100),
      label: STATE_NAMES[nextStep] || "DONE",
    };
    setProgress(newProg);

    setTimeout(() => {
      setBotTyping(false);
      if (nextStep === 7) {
        // Verify step — show options
        appendBot(typeof SIM_FLOWS[7] === "function" ? SIM_FLOWS[7](userMsg) : SIM_FLOWS[7]);
        setShowOptions(["Yes, Verify Me ✅", "Skip for now"]);
      } else if (nextStep === 8) {
        // Done
        if (userMsg.includes("Yes")) {
          setShowOTP(true);
        } else {
          finishSim(false);
        }
      } else {
        const reply = typeof SIM_FLOWS[nextStep] === "function" ? SIM_FLOWS[nextStep](userMsg) : SIM_FLOWS[nextStep];
        appendBot(reply);
        const opts = getOptionsForStep(nextStep);
        if (opts) setShowOptions(opts);
      }
    }, 900 + Math.random() * 500);
  };

  const finishWithRealApi = async () => {
    try {
      const data = await chatApi.extractProfile(sessionId);
      setProfile(data.profile);
    } catch {
      setProfile({ primary_skill: "Worker", trust_score: 65, verified: false });
    }
    setBotTyping(true);
    setTimeout(() => {
      setBotTyping(false);
      appendBot("🎉 உங்க profile ready-யா!\n\nஉங்க Worker Card create ஆகுது... Owners உங்களை தேடுவாங்க! 💼");
      setTimeout(() => setDone(true), 1200);
    }, 800);
  };

  const finishSim = (isVerified) => {
    setProfile({ primary_skill: "Worker", trust_score: isVerified ? 82 : 55, verified: isVerified });
    setBotTyping(true);
    setTimeout(() => {
      setBotTyping(false);
      appendBot(`🎉 Excellent! உங்க profile ready-யா!\n\n${isVerified ? "✅ Verified Worker — Top priority matching!" : "ℹ️ Unverified — verify later for better matches."}\n\nOwners உங்களை தேடுவாங்க! 💼`);
      setTimeout(() => setDone(true), 1200);
    }, 900);
  };

  const handleOTP = async () => {
    if (otp.length < 4) return;
    setShowOTP(false);
    setMessages((prev) => [...prev, { role: "user", msg: `OTP: ${otp} ✓` }]);

    if (useRealApi && sessionId) {
      try {
        const data = await chatApi.verifyOtp(sessionId);
        appendBot(data.message);
        await finishWithRealApi();
      } catch {
        finishSim(true);
      }
    } else {
      finishSim(true);
    }
  };

  return (
    <div style={{ background: palette.bg, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{
        background: "#050C1A", borderBottom: `1px solid ${palette.cardBorder}`,
        padding: "14px 20px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: palette.muted, fontSize: 20, cursor: "pointer" }}>←</button>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: palette.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
        <div>
          <p style={{ fontWeight: 800, fontSize: 14, margin: 0 }}>Velai Bot</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: palette.green, display: "inline-block" }} />
            <p style={{ color: palette.green, fontSize: 10, margin: 0, fontFamily: "'Space Mono', monospace" }}>
              Online · Tamil & English
            </p>
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          {apiMode && (
            <span style={{
              fontSize: 9, fontFamily: "'Space Mono', monospace",
              color: apiMode === "real" ? palette.green : palette.accent,
              background: (apiMode === "real" ? palette.green : palette.accent) + "18",
              border: `1px solid ${(apiMode === "real" ? palette.green : palette.accent)}33`,
              borderRadius: 4, padding: "2px 7px",
            }}>
              {apiMode === "real" ? "🟢 LIVE AI" : "🟡 DEMO MODE"}
            </span>
          )}
          <Badge color={palette.purple}>STEP {Math.min(progress.current, 8)} / 8</Badge>
        </div>
      </header>

      {/* Progress Bar */}
      <div style={{ background: "#0D1528", padding: "10px 20px", borderBottom: `1px solid ${palette.cardBorder}` }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
          {STATE_LABELS.map((label, i) => (
            <div key={label} style={{ flex: 1 }}>
              <div style={{
                height: 3, borderRadius: 2,
                background: i < progress.current - 1 ? palette.accent
                  : i === progress.current - 1 ? palette.accent + "77"
                  : palette.cardBorder,
                transition: "background 0.3s",
              }} />
            </div>
          ))}
        </div>
        <p style={{ color: palette.muted, fontSize: 10, margin: 0, fontFamily: "'Space Mono', monospace" }}>
          {progress.label} · {progress.percent}% complete
        </p>
      </div>

      {/* Chat */}
      <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "20px", maxWidth: 680, width: "100%", margin: "0 auto" }}>
        {messages.map((m, i) => <ChatBubble key={i} role={m.role} msg={m.msg} />)}
        {botTyping && <ChatBubble role="bot" isTyping />}
      </div>

      {/* OTP Modal */}
      {showOTP && (
        <div style={{
          position: "fixed", inset: 0, background: "#000000bb", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ background: palette.card, border: `1px solid ${palette.cardBorder}`, borderRadius: 16, padding: 28, width: 300, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📱</div>
            <h3 style={{ fontWeight: 800, marginBottom: 6 }}>Enter OTP</h3>
            <p style={{ color: palette.muted, fontSize: 12, marginBottom: 20, fontFamily: "'Space Mono', monospace" }}>
              We sent a code to verify your phone
            </p>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter OTP"
              style={{
                background: palette.surface, border: `1px solid ${palette.cardBorder}`,
                borderRadius: 8, padding: "10px 14px", color: palette.text, fontSize: 18,
                width: "100%", textAlign: "center", letterSpacing: 6,
                fontFamily: "'Space Mono', monospace", outline: "none", marginBottom: 16,
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="ghost" full onClick={() => { setShowOTP(false); useRealApi ? finishWithRealApi() : finishSim(false); }}>Skip</Button>
              <Button full onClick={handleOTP} disabled={otp.length < 4}>Verify ✅</Button>
            </div>
          </div>
        </div>
      )}

      {/* Input or Quick Options */}
      {!done ? (
        <div style={{ background: "#050C1A", borderTop: `1px solid ${palette.cardBorder}`, padding: "14px 20px" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            {showOptions ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {showOptions.map((opt) => (
                  <button key={opt} onClick={() => sendMessage(opt)} style={{
                    background: palette.card, border: `1.5px solid ${palette.accent}55`,
                    borderRadius: 8, padding: "9px 16px", color: palette.accent,
                    fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.18s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = palette.accent + "22"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = palette.card; }}>
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  placeholder="Type your answer..."
                  disabled={botTyping}
                  style={{
                    flex: 1, background: palette.surface, border: `1px solid ${palette.cardBorder}`,
                    borderRadius: 10, padding: "11px 16px", color: palette.text,
                    fontSize: 14, outline: "none", fontFamily: "'Syne', sans-serif",
                  }}
                />
                <Button onClick={() => sendMessage(input)} disabled={!input.trim() || botTyping}>
                  Send →
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{
          background: "#050C1A", borderTop: `1px solid ${palette.green}33`,
          padding: "20px", textAlign: "center", animation: "fadeIn 0.5s ease",
        }}>
          <p style={{ color: palette.green, fontWeight: 800, fontSize: 16, marginBottom: 12 }}>
            🎉 Profile Created Successfully!
          </p>
          <Button variant="success" onClick={() => navigate("/worker/dashboard", { state: { profile } })}>
            View My Worker Card →
          </Button>
        </div>
      )}
    </div>
  );
}
