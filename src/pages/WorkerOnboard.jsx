import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { palette } from "../theme";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

// Simulated AI conversation flows per state
const BOT_FLOWS = {
  GREETING: {
    question: "வணக்கம் 🙏 நான் உங்களுக்கு வேலை கண்டுபிடிக்க help பண்ணுவேன்!\n\nஎன் பேரு Velai Bot. நீங்கள் என்ன மாதிரி வேலை தேடுகிறீர்கள்? 😊",
    nextState: "SKILLS",
    field: "jobType",
    placeholder: "e.g. Delivery, Tea shop, Mechanic...",
  },
  SKILLS: {
    question: null, // dynamic based on input
    nextState: "EXPERIENCE",
    field: "primarySkill",
    placeholder: "e.g. Bike riding, Cooking, Welding...",
  },
  EXPERIENCE: {
    question: "Super! 👍 எத்தனை வருஷமா இந்த வேலை பாக்குறீங்க?\n(How many years of experience do you have?)",
    nextState: "LOCATION",
    field: "experienceYears",
    placeholder: "e.g. 3 years, 6 months...",
  },
  LOCATION: {
    question: "Good da! 💪 நீங்கள் இப்போது எங்கே இருக்கீங்க?\n(Which area/town are you currently in?)",
    nextState: "RADIUS",
    field: "location",
    placeholder: "e.g. Thuckalay, Nagercoil, Madurai...",
  },
  RADIUS: {
    question: "Okay! எந்த area-ல வேலை பண்ணலாம்னு நினைக்கீங்க?\nMax எத்தனை km travel பண்ண ready? 🚗",
    nextState: "SALARY",
    field: "travelRadius",
    placeholder: "e.g. 5 km, 10 km, 15 km...",
  },
  SALARY: {
    question: "Nice! 💰 ஒரு மாசத்திற்கு எவ்வளவு சம்பளம் expect பண்றீங்க?\n(Expected monthly salary in ₹)",
    nextState: "WORKTYPE",
    field: "expectedSalary",
    placeholder: "e.g. ₹12,000 to ₹15,000...",
  },
  WORKTYPE: {
    question: "Almost done! 🎯 Full-time வேணுமா, part-time சரியா, or contract basis?",
    nextState: "VERIFY",
    field: "workType",
    options: ["Full-time", "Part-time", "Contract"],
  },
  VERIFY: {
    question: "One last step! 🔐 நம்பகமான worker-ஆ நீங்க என்று owners கேக்குவாங்க.\nஉங்க phone number OTP verify பண்ணலாமா?",
    nextState: "DONE",
    field: "verified",
    options: ["Yes, Verify Me ✅", "Skip for now"],
  },
};

const STATE_ORDER = ["GREETING", "SKILLS", "EXPERIENCE", "LOCATION", "RADIUS", "SALARY", "WORKTYPE", "VERIFY", "DONE"];

const PROGRESS_LABELS = ["Intro", "Skills", "Experience", "Location", "Travel", "Salary", "Work Type", "Verify"];

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "12px 14px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: palette.blue,
            animation: `bounce 1s ease ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function ChatBubble({ role, msg, isTyping }) {
  const isBot = role === "bot";
  return (
    <div
      className="fade-in"
      style={{
        display: "flex",
        justifyContent: isBot ? "flex-start" : "flex-end",
        marginBottom: 12,
        gap: 8,
        alignItems: "flex-end",
      }}
    >
      {isBot && (
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: palette.accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, flexShrink: 0,
        }}>🤖</div>
      )}
      <div
        style={{
          background: isBot ? "#1A2D45" : "#1A3A28",
          border: `1px solid ${isBot ? palette.blue + "33" : palette.green + "33"}`,
          borderRadius: isBot ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
          padding: isTyping ? "4px 8px" : "10px 14px",
          maxWidth: "75%",
        }}
      >
        <p style={{ color: isBot ? palette.blue : palette.green, fontSize: 9, fontFamily: "'Space Mono', monospace", margin: "0 0 4px" }}>
          {isBot ? "🤖 Velai Bot" : "👷 You"}
        </p>
        {isTyping ? <TypingIndicator /> : (
          <p style={{ color: palette.text, fontSize: 13, margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{msg}</p>
        )}
      </div>
      {!isBot && (
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: palette.green + "33",
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
  const [state, setState] = useState("GREETING");
  const [input, setInput] = useState("");
  const [profile, setProfile] = useState({});
  const [botTyping, setBotTyping] = useState(false);
  const [done, setDone] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const chatRef = useRef(null);

  const scrollToBottom = () => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, botTyping]);

  useEffect(() => {
    // Initial greeting
    setBotTyping(true);
    const t = setTimeout(() => {
      setBotTyping(false);
      setMessages([{ role: "bot", msg: BOT_FLOWS.GREETING.question }]);
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  const getBotResponse = (currentState, userMsg) => {
    const nextState = BOT_FLOWS[currentState]?.nextState;
    if (!nextState) return null;

    if (currentState === "GREETING") {
      return `Nice! ${userMsg} job-a? 😊 அந்த job-la என்ன main skill வேணும்?\n(What is your main skill for this job?)`;
    }
    if (currentState === "SKILLS") {
      return `${userMsg} — good skill da! 👏\n\nஎத்தனை வருஷமா இந்த வேலை பாக்குறீங்க? (How many years experience?)`;
    }
    if (currentState === "EXPERIENCE") {
      return `${userMsg} experience — perfect! 💪\n\nநீங்கள் இப்போது எங்கே இருக்கீங்க? (Which area/town are you in now?)`;
    }
    if (currentState === "LOCATION") {
      return `${userMsg}! Great location. 📍\n\nMax எத்தனை km travel பண்ண ready? (How far are you willing to travel for work?)`;
    }
    if (currentState === "RADIUS") {
      return `Okay, ${userMsg} radius! 🗺️\n\nOkay bro! 💰 ஒரு மாசத்திற்கு எவ்வளவு சம்பளம் expect பண்றீங்க?`;
    }
    if (currentState === "SALARY") {
      return `${userMsg} — reasonable expectation! ✅\n\nFull-time வேணுமா, part-time சரியா, or contract basis? Choose below 👇`;
    }
    if (currentState === "WORKTYPE") {
      return `${userMsg} — noted! 📝\n\nAlmost done! உங்க phone number verify பண்ண விரும்புகிறீர்களா? Verified workers get 3x more responses! 🔐`;
    }
    return null;
  };

  const sendMessage = (userMsg) => {
    if (!userMsg.trim() || botTyping) return;

    const newMsg = { role: "user", msg: userMsg };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    const newProfile = { ...profile, [BOT_FLOWS[state]?.field]: userMsg };
    setProfile(newProfile);

    if (state === "VERIFY") {
      if (userMsg.includes("Yes")) {
        setShowOTP(true);
      } else {
        finishOnboarding(newProfile, false);
      }
      return;
    }

    const nextState = BOT_FLOWS[state]?.nextState;
    if (!nextState || nextState === "DONE") return;

    setBotTyping(true);
    const t = setTimeout(() => {
      setBotTyping(false);
      const botReply = getBotResponse(state, userMsg);
      if (botReply) {
        setMessages((prev) => [...prev, { role: "bot", msg: botReply }]);
      }
      setState(nextState);
    }, 1000 + Math.random() * 600);
    return () => clearTimeout(t);
  };

  const finishOnboarding = (finalProfile, isVerified) => {
    setBotTyping(true);
    setTimeout(() => {
      setBotTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          msg: `Excellent! 🎉 உங்க profile ready-யா!\n\nஉங்க Worker Card create ஆகுது... Owners உங்களை தேடுவாங்க! 💼\n\n${isVerified ? "✅ Verified Worker — Top priority matching!" : "ℹ️ Unverified — You can verify later for better matches."}`,
        },
      ]);
      setProfile({ ...finalProfile, verified: isVerified });
      setState("DONE");
      setTimeout(() => setDone(true), 1500);
    }, 1200);
  };

  const handleOTP = () => {
    if (otp.length < 4) return;
    setShowOTP(false);
    setVerified(true);
    setMessages((prev) => [...prev, { role: "user", msg: `OTP: ${otp} ✓` }]);
    finishOnboarding({ ...profile, verified: true }, true);
  };

  const progress = STATE_ORDER.indexOf(state);

  return (
    <div style={{ background: palette.bg, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{
        background: "#050C1A",
        borderBottom: `1px solid ${palette.cardBorder}`,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <button
          onClick={() => navigate("/")}
          style={{ background: "none", border: "none", color: palette.muted, fontSize: 20, cursor: "pointer" }}
        >←</button>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: palette.accent,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>🤖</div>
        <div>
          <p style={{ fontWeight: 800, fontSize: 14, margin: 0 }}>Velai Bot</p>
          <p style={{ color: palette.green, fontSize: 10, margin: 0, fontFamily: "'Space Mono', monospace", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: palette.green, display: "inline-block" }} />
            Online · Tamil & English
          </p>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Badge color={palette.purple}>STEP {Math.min(progress + 1, 8)} / 8</Badge>
        </div>
      </header>

      {/* Progress Bar */}
      <div style={{ background: "#0D1528", padding: "10px 20px", borderBottom: `1px solid ${palette.cardBorder}` }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
          {PROGRESS_LABELS.map((label, i) => (
            <div
              key={label}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
            >
              <div style={{
                height: 3,
                borderRadius: 2,
                background: i < progress ? palette.accent : i === progress ? palette.accent + "88" : palette.cardBorder,
                width: "100%",
                transition: "background 0.3s",
              }} />
              <span style={{
                color: i <= progress ? palette.accent : palette.dim,
                fontSize: 8,
                fontFamily: "'Space Mono', monospace",
                display: "none",
              }}>{label}</span>
            </div>
          ))}
        </div>
        <p style={{ color: palette.muted, fontSize: 10, margin: 0, fontFamily: "'Space Mono', monospace" }}>
          {PROGRESS_LABELS[Math.min(progress, PROGRESS_LABELS.length - 1)]} · {Math.round((progress / 8) * 100)}% complete
        </p>
      </div>

      {/* Chat Area */}
      <div
        ref={chatRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          maxWidth: 680,
          width: "100%",
          margin: "0 auto",
          paddingBottom: done ? 100 : 20,
        }}
      >
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} msg={m.msg} />
        ))}
        {botTyping && <ChatBubble role="bot" isTyping />}
      </div>

      {/* OTP Modal */}
      {showOTP && (
        <div style={{
          position: "fixed", inset: 0, background: "#000000bb", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: palette.card,
            border: `1px solid ${palette.cardBorder}`,
            borderRadius: 16, padding: 28, width: 300, textAlign: "center",
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📱</div>
            <h3 style={{ fontWeight: 800, marginBottom: 6 }}>Enter OTP</h3>
            <p style={{ color: palette.muted, fontSize: 12, marginBottom: 20, fontFamily: "'Space Mono', monospace" }}>
              We sent a code to verify your phone
            </p>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 4-6 digit OTP"
              style={{
                background: palette.surface,
                border: `1px solid ${palette.cardBorder}`,
                borderRadius: 8, padding: "10px 14px",
                color: palette.text, fontSize: 18,
                width: "100%", textAlign: "center",
                letterSpacing: 6, fontFamily: "'Space Mono', monospace",
                outline: "none", marginBottom: 16,
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="ghost" full onClick={() => { setShowOTP(false); finishOnboarding(profile, false); }}>Skip</Button>
              <Button full onClick={handleOTP} disabled={otp.length < 4}>Verify ✅</Button>
            </div>
          </div>
        </div>
      )}

      {/* Input Area or Done */}
      {!done ? (
        <div style={{
          background: "#050C1A",
          borderTop: `1px solid ${palette.cardBorder}`,
          padding: "14px 20px",
        }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            {BOT_FLOWS[state]?.options ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {BOT_FLOWS[state].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => sendMessage(opt)}
                    style={{
                      background: palette.card,
                      border: `1.5px solid ${palette.accent}55`,
                      borderRadius: 8, padding: "9px 16px",
                      color: palette.accent, fontWeight: 700, fontSize: 13,
                      cursor: "pointer", transition: "all 0.18s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = palette.accent + "22"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = palette.card; }}
                  >
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
                  placeholder={BOT_FLOWS[state]?.placeholder || "Type your answer..."}
                  disabled={botTyping || state === "DONE"}
                  style={{
                    flex: 1,
                    background: palette.surface,
                    border: `1px solid ${palette.cardBorder}`,
                    borderRadius: 10, padding: "11px 16px",
                    color: palette.text, fontSize: 14, outline: "none",
                    fontFamily: "'Syne', sans-serif",
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
          background: "#050C1A",
          borderTop: `1px solid ${palette.green}33`,
          padding: "20px",
          textAlign: "center",
          animation: "fadeIn 0.5s ease",
        }}>
          <p style={{ color: palette.green, fontWeight: 800, fontSize: 16, marginBottom: 12 }}>
            🎉 Profile Created Successfully!
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <Button
              variant="success"
              onClick={() => navigate("/worker/dashboard", { state: { profile } })}
            >
              View My Worker Card →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
