import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { palette } from "../theme";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { chatApi, isApiAvailable } from "../services/chatApi.js";

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
    <div style={{ display: "flex", gap: 5, padding: "14px 16px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: palette.blue,
          animation: `bounce 1s ease ${i * 0.22}s infinite`,
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
      marginBottom: 14,
      gap: 10,
      alignItems: "flex-end",
    }}>
      {isBot && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: `linear-gradient(135deg, ${palette.accent}, ${palette.orange})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, flexShrink: 0,
          boxShadow: `0 2px 10px ${palette.accent}44`,
        }}>🤖</div>
      )}
      <div style={{
        background: isBot
          ? "rgba(99,102,241,0.1)"
          : "rgba(16,185,129,0.1)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${isBot ? palette.blue + "33" : palette.green + "33"}`,
        borderRadius: isBot ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
        padding: isTyping ? "4px 8px" : "11px 16px",
        maxWidth: "78%",
        boxShadow: isBot ? `0 2px 12px ${palette.blue}18` : `0 2px 12px ${palette.green}18`,
      }}>
        <p style={{
          color: isBot ? palette.blue : palette.green,
          fontSize: 9,
          fontFamily: "'Space Mono', monospace",
          margin: "0 0 5px",
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}>
          {isBot ? "🤖 Velai Bot" : "👷 You"}
        </p>
        {isTyping ? <TypingIndicator /> : (
          <p style={{ color: palette.text, fontSize: 13, margin: 0, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{msg}</p>
        )}
      </div>
      {!isBot && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: palette.green + "22",
          border: `1.5px solid ${palette.green}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, flexShrink: 0,
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
  const [apiMode, setApiMode] = useState(null);
  const [simStep, setSimStep] = useState(0);
  const [progress, setProgress] = useState({ current: 1, total: 8, percent: 12, label: "GREETING" });
  const [showOptions, setShowOptions] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, botTyping]);

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
        } catch { /* fall through */ }
      }
      setApiMode("sim");
      setTimeout(() => {
        setBotTyping(false);
        setMessages([{ role: "bot", msg: SIM_FLOWS[0] }]);
      }, 900);
    };
    init();
  }, []);

  const appendBot = (msg) => setMessages((prev) => [...prev, { role: "bot", msg }]);

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
        appendBot(typeof SIM_FLOWS[7] === "function" ? SIM_FLOWS[7](userMsg) : SIM_FLOWS[7]);
        setShowOptions(["Yes, Verify Me ✅", "Skip for now"]);
      } else if (nextStep === 8) {
        if (userMsg.includes("Yes")) setShowOTP(true);
        else finishSim(false);
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
        background: "rgba(4,8,15,0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "13px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: palette.muted,
            fontSize: 16, cursor: "pointer",
            borderRadius: 8, padding: "4px 10px",
            transition: "all 0.2s",
          }}
        >←</button>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: `linear-gradient(135deg, ${palette.accent}, ${palette.orange})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, boxShadow: `0 2px 12px ${palette.accent}44`,
        }}>🤖</div>
        <div>
          <p style={{ fontWeight: 800, fontSize: 14, margin: 0 }}>Velai Bot</p>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: palette.green, display: "inline-block", boxShadow: `0 0 6px ${palette.green}` }} />
            <p style={{ color: palette.green, fontSize: 9, margin: 0, fontFamily: "'Space Mono', monospace" }}>
              Online · Tamil & English
            </p>
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          {apiMode && (
            <Badge color={apiMode === "real" ? palette.green : palette.accent} glow>
              {apiMode === "real" ? "🟢 LIVE AI" : "🟡 DEMO"}
            </Badge>
          )}
          <Badge color={palette.purple}>
            {Math.min(progress.current, 8)} / 8
          </Badge>
        </div>
      </header>

      {/* Progress Bar */}
      <div style={{
        background: "rgba(13,21,40,0.95)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "10px 20px",
      }}>
        <div style={{ display: "flex", gap: 3, marginBottom: 6, maxWidth: 680, margin: "0 auto 6px" }}>
          {STATE_LABELS.map((label, i) => (
            <div key={label} style={{ flex: 1, position: "relative" }}>
              <div style={{
                height: 3, borderRadius: 3,
                background: i < progress.current - 1
                  ? `linear-gradient(90deg, ${palette.accent}, ${palette.orange})`
                  : i === progress.current - 1
                  ? palette.accent + "77"
                  : "rgba(255,255,255,0.08)",
                transition: "background 0.4s ease",
              }} />
            </div>
          ))}
        </div>
        <p style={{ color: palette.muted, fontSize: 9, margin: 0, fontFamily: "'Space Mono', monospace", maxWidth: 680, textAlign: "center" }}>
          {progress.label} · {progress.percent}% complete
        </p>
      </div>

      {/* Chat Messages */}
      <div ref={chatRef} style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px",
        maxWidth: 680,
        width: "100%",
        margin: "0 auto",
      }}>
        {messages.map((m, i) => <ChatBubble key={i} role={m.role} msg={m.msg} />)}
        {botTyping && <ChatBubble role="bot" isTyping />}
      </div>

      {/* OTP Modal */}
      {showOTP && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16,
        }}>
          <div style={{
            background: "rgba(13,21,40,0.98)",
            border: `1px solid ${palette.blue}44`,
            borderRadius: 20,
            padding: "32px 28px",
            width: "100%",
            maxWidth: 320,
            textAlign: "center",
            boxShadow: `0 24px 80px rgba(0,0,0,0.5)`,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: palette.blue + "18",
              border: `1.5px solid ${palette.blue}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 30, margin: "0 auto 16px",
            }}>📱</div>
            <h3 style={{ fontWeight: 800, marginBottom: 6, fontSize: 18 }}>Verify Phone</h3>
            <p style={{ color: palette.muted, fontSize: 12, marginBottom: 22, fontFamily: "'Space Mono', monospace", lineHeight: 1.6 }}>
              We sent a code to verify your phone
            </p>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="• • • • • •"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `1.5px solid ${otp.length >= 4 ? palette.green + "66" : "rgba(255,255,255,0.12)"}`,
                borderRadius: 12, padding: "12px 16px",
                color: palette.text, fontSize: 22,
                width: "100%", textAlign: "center", letterSpacing: 10,
                fontFamily: "'Space Mono', monospace", outline: "none",
                marginBottom: 18,
                transition: "border-color 0.2s",
              }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <Button
                variant="ghost"
                full
                onClick={() => { setShowOTP(false); useRealApi ? finishWithRealApi() : finishSim(false); }}
              >Skip</Button>
              <Button full onClick={handleOTP} disabled={otp.length < 4}>Verify ✅</Button>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      {!done ? (
        <div style={{
          background: "rgba(4,8,15,0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "14px 20px",
        }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            {showOptions ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {showOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => sendMessage(opt)}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      backdropFilter: "blur(20px)",
                      border: `1.5px solid ${palette.accent}44`,
                      borderRadius: 10, padding: "9px 18px",
                      color: palette.accent,
                      fontWeight: 700, fontSize: 13, cursor: "pointer",
                      transition: "all 0.18s", fontFamily: "'Syne', sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = palette.accent + "18";
                      e.currentTarget.style.borderColor = palette.accent + "88";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                      e.currentTarget.style.borderColor = palette.accent + "44";
                      e.currentTarget.style.transform = "none";
                    }}
                  >{opt}</button>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  placeholder="Type your answer..."
                  disabled={botTyping}
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${input ? palette.blue + "55" : "rgba(255,255,255,0.09)"}`,
                    borderRadius: 12, padding: "12px 16px",
                    color: palette.text, fontSize: 14, outline: "none",
                    fontFamily: "'Syne', sans-serif",
                    transition: "border-color 0.2s",
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
          background: "rgba(4,8,15,0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: `1px solid ${palette.green}33`,
          padding: "22px 20px",
          textAlign: "center",
          animation: "fadeIn 0.5s ease",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: palette.green + "15",
            border: `1px solid ${palette.green}44`,
            borderRadius: 12, padding: "10px 20px",
            marginBottom: 16,
          }}>
            <span style={{ color: palette.green, fontWeight: 800, fontSize: 15 }}>🎉 Profile Created!</span>
          </div>
          <br />
          <Button variant="success" onClick={() => navigate("/worker/dashboard", { state: { profile } })}>
            View My Worker Card →
          </Button>
        </div>
      )}
    </div>
  );
}
