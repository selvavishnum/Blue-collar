import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { palette } from "../theme";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

const WORKER_PROFILES = {
  1: { name: "Murugan K.", skill: "Delivery / Two-Wheeler", verified: true, avatar: "👷", online: true },
  2: { name: "Rajan S.", skill: "Delivery / Logistics", verified: true, avatar: "👷", online: false },
  3: { name: "Karthik M.", skill: "Delivery / Route Planning", verified: false, avatar: "👷", online: true },
};

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "bot",
    msg: "👋 Velai Bot: Murugan is a top match for your job! Click below to start chatting directly.",
    ts: "10:02 AM",
    type: "system",
  },
  {
    id: 2,
    role: "worker",
    msg: "வணக்கம் sir! Your delivery job posting paartha. I'm interested.",
    ts: "10:05 AM",
  },
  {
    id: 3,
    role: "owner",
    msg: "Hi Murugan! Yes, we need someone for morning deliveries. Do you have a bike?",
    ts: "10:06 AM",
  },
  {
    id: 4,
    role: "worker",
    msg: "Yes sir, bike own-a vachurken. Honda Activa. License also iruku. 3 years experience.",
    ts: "10:07 AM",
  },
];

const BOT_SUGGESTIONS = [
  "What is your availability?",
  "Can you start immediately?",
  "Which area do you deliver in?",
  "Are you verified?",
];

const AI_QUICK_REPLIES = {
  "What is your availability?": "I'm available from tomorrow morning sir! Full-time-a vela start pannuven.",
  "Can you start immediately?": "Yes sir! Naalaikku irunte start pannuven. No problem.",
  "Which area do you deliver in?": "Thuckalay, Udangudi, nearby areas - 10km range sir.",
  "Are you verified?": "Yes sir, Aadhaar verified. ✅ My trust score 82/100.",
};

function SystemMessage({ msg }) {
  return (
    <div style={{
      background: `rgba(245,158,11,0.08)`,
      border: `1px solid ${palette.accent}33`,
      borderRadius: 12, padding: "9px 16px",
      margin: "10px auto", maxWidth: "82%",
      textAlign: "center",
    }}>
      <p style={{ color: palette.accent, fontSize: 12, margin: 0 }}>{msg.msg}</p>
      <p style={{ color: palette.dim, fontSize: 9, margin: "3px 0 0", fontFamily: "'Space Mono', monospace" }}>{msg.ts}</p>
    </div>
  );
}

function MessageBubble({ msg, isOwner }) {
  return (
    <div
      className="fade-in"
      style={{
        display: "flex",
        justifyContent: isOwner ? "flex-end" : "flex-start",
        marginBottom: 14,
        gap: 10,
        alignItems: "flex-end",
      }}
    >
      {!isOwner && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: palette.blue + "22",
          border: `1.5px solid ${palette.blue}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, flexShrink: 0,
        }}>👷</div>
      )}
      <div style={{
        background: isOwner
          ? "rgba(245,158,11,0.1)"
          : "rgba(99,102,241,0.1)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${isOwner ? palette.accent + "33" : palette.blue + "33"}`,
        borderRadius: isOwner ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
        padding: "11px 16px",
        maxWidth: "72%",
      }}>
        <p style={{ color: isOwner ? palette.accent : palette.blue, fontSize: 9, fontFamily: "'Space Mono', monospace", margin: "0 0 4px", letterSpacing: 0.5, textTransform: "uppercase" }}>
          {isOwner ? "🏪 You (Owner)" : "👷 Murugan K."}
        </p>
        <p style={{ color: palette.text, fontSize: 13, margin: 0, lineHeight: 1.65 }}>{msg.msg}</p>
        <p style={{ color: palette.dim, fontSize: 9, fontFamily: "'Space Mono', monospace", margin: "5px 0 0", textAlign: "right" }}>{msg.ts}</p>
      </div>
      {isOwner && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: palette.accent + "22",
          border: `1.5px solid ${palette.accent}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, flexShrink: 0,
        }}>🏪</div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "11px 16px", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: "50%",
          background: palette.blue,
          animation: `bounce 1s ease ${i * 0.22}s infinite`,
        }} />
      ))}
    </div>
  );
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { workerId } = useParams();
  const worker = WORKER_PROFILES[workerId] || WORKER_PROFILES[1];
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [workerTyping, setWorkerTyping] = useState(false);
  const [showAISuggest, setShowAISuggest] = useState(true);
  const [hired, setHired] = useState(false);
  const chatRef = useRef(null);

  const now = () => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, workerTyping]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), role: "owner", msg: text, ts: now() }]);
    setInput("");
    setWorkerTyping(true);
    const reply = AI_QUICK_REPLIES[text] || "Okay sir, understood! Will do.";
    setTimeout(() => {
      setWorkerTyping(false);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "worker", msg: reply, ts: now() }]);
    }, 1200 + Math.random() * 800);
  };

  const handleHire = () => {
    setHired(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "bot",
        msg: "🎉 Congratulations! You've hired Murugan K. for the Delivery Partner role. We'll notify them right away!",
        ts: now(),
        type: "system",
      },
    ]);
  };

  return (
    <div style={{ background: palette.bg, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <header style={{
        background: "rgba(4,8,15,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: palette.muted, fontSize: 16, cursor: "pointer",
            borderRadius: 8, padding: "4px 10px",
          }}
        >←</button>

        <div style={{ position: "relative" }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: palette.blue + "22",
            border: `1.5px solid ${palette.blue}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>👷</div>
          {worker.online && (
            <div style={{
              position: "absolute", bottom: 1, right: 1,
              width: 10, height: 10, borderRadius: "50%",
              background: palette.green,
              border: `2px solid ${palette.bg}`,
              boxShadow: `0 0 6px ${palette.green}`,
            }} />
          )}
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 800, fontSize: 14, margin: 0 }}>{worker.name}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <p style={{
              color: worker.online ? palette.green : palette.muted,
              fontSize: 9, margin: 0, fontFamily: "'Space Mono', monospace",
            }}>
              {worker.online ? "● Online" : "○ Last seen 2h ago"}
            </p>
            {worker.verified && <Badge color={palette.green} size="xs">✓ Verified</Badge>}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {!hired ? (
            <>
              <Button size="sm" variant="success" onClick={handleHire}>✅ Hire</Button>
              <Button size="sm" variant="ghost">📞 Call</Button>
              <Button size="sm" variant="ghost">📱 WhatsApp</Button>
            </>
          ) : (
            <Badge color={palette.green} glow>✓ Hired!</Badge>
          )}
        </div>
      </header>

      {/* Worker Mini-Profile Bar */}
      <div style={{
        background: "rgba(13,21,40,0.95)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "8px 20px",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ color: palette.muted, fontSize: 11, fontFamily: "'Space Mono', monospace" }}>{worker.skill}</span>
          <Badge color={palette.accent} size="xs">82% match</Badge>
          <Badge color={palette.purple} size="xs">3 years exp</Badge>
          <Badge color={palette.teal} size="xs">📍 Thuckalay (2 km)</Badge>
          <Badge color={palette.green} size="xs">💰 ₹12K–₹15K</Badge>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {messages.map((msg) => (
            msg.type === "system"
              ? <SystemMessage key={msg.id} msg={msg} />
              : <MessageBubble key={msg.id} msg={msg} isOwner={msg.role === "owner"} />
          ))}
          {workerTyping && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: palette.blue + "22",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
              }}>👷</div>
              <div style={{
                background: "rgba(99,102,241,0.1)",
                backdropFilter: "blur(20px)",
                border: `1px solid ${palette.blue}33`,
                borderRadius: "4px 16px 16px 16px",
                padding: "4px 8px",
              }}>
                <TypingIndicator />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Suggestions */}
      {showAISuggest && (
        <div style={{
          background: "rgba(8,14,26,0.97)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "10px 20px",
        }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <p style={{ color: palette.accent, fontSize: 9, fontFamily: "'Space Mono', monospace", margin: 0, textTransform: "uppercase", letterSpacing: 0.8 }}>
                🤖 AI Quick Questions
              </p>
              <button
                onClick={() => setShowAISuggest(false)}
                style={{ background: "none", border: "none", color: palette.dim, fontSize: 12, cursor: "pointer" }}
              >✕</button>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {BOT_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(20px)",
                    border: `1px solid ${palette.accent}44`,
                    borderRadius: 20,
                    padding: "5px 14px",
                    color: palette.accent,
                    fontSize: 11,
                    cursor: "pointer",
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 600,
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = palette.accent + "18";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.transform = "none";
                  }}
                >{s}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{
        background: "rgba(4,8,15,0.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "13px 20px",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", gap: 10 }}>
          <button
            onClick={() => setShowAISuggest((v) => !v)}
            style={{
              background: showAISuggest ? palette.accent + "22" : "rgba(255,255,255,0.04)",
              border: `1px solid ${showAISuggest ? palette.accent + "55" : "rgba(255,255,255,0.09)"}`,
              borderRadius: 10, padding: "0 12px",
              color: showAISuggest ? palette.accent : palette.muted,
              fontSize: 16, cursor: "pointer",
              transition: "all 0.18s",
            }}
            title="AI Suggestions"
          >🤖</button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${input ? palette.accent + "44" : "rgba(255,255,255,0.09)"}`,
              borderRadius: 12, padding: "11px 16px",
              color: palette.text, fontSize: 14, outline: "none",
              fontFamily: "'Syne', sans-serif",
              transition: "border-color 0.2s",
            }}
          />
          <Button onClick={() => sendMessage(input)} disabled={!input.trim()}>
            Send →
          </Button>
        </div>
      </div>
    </div>
  );
}
