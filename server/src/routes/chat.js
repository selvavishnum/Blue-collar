import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  createSession,
  getSession,
  appendMessage,
  updateSession,
  getStateProgress,
} from "../services/sessionStore.js";
import {
  getChatResponse,
  extractProfile,
  getInitialGreeting,
} from "../services/aiService.js";

const router = Router();

/**
 * POST /api/chat/start
 * Create a new session and return the bot's opening greeting.
 */
router.post("/start", async (req, res) => {
  try {
    const sessionId = uuidv4();
    const { phone } = req.body;
    createSession(sessionId, phone || null);

    const greeting = await getInitialGreeting();
    appendMessage(sessionId, "assistant", greeting);

    res.json({
      sessionId,
      message: greeting,
      state: "GREETING",
      progress: getStateProgress("GREETING"),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/chat/message
 * Send a user message and receive the bot's reply.
 * Body: { sessionId, message }
 */
router.post("/message", async (req, res) => {
  const { sessionId, message } = req.body;

  if (!sessionId || !message?.trim()) {
    return res.status(400).json({ error: "sessionId and message are required" });
  }

  const session = getSession(sessionId);
  if (!session) {
    return res.status(404).json({ error: "Session not found. Start a new session." });
  }

  if (session.completed) {
    return res.status(400).json({ error: "Session is already completed" });
  }

  // Add user message to history
  appendMessage(sessionId, "user", message);

  // Detect state transitions based on conversation length / keywords
  const session2 = getSession(sessionId);
  const msgCount = session2.messages.filter((m) => m.role === "user").length;

  let newState = session2.state;
  if (msgCount === 1) newState = "SKILLS";
  else if (msgCount === 3) newState = "LOCATION";
  else if (msgCount === 5) newState = "SALARY";
  else if (msgCount === 6) newState = "WORKTYPE";
  else if (msgCount === 7) newState = "VERIFY";
  else if (msgCount >= 8) newState = "DONE";

  updateSession(sessionId, { state: newState });

  try {
    const updatedSession = getSession(sessionId);
    const botReply = await getChatResponse(updatedSession.messages);

    appendMessage(sessionId, "assistant", botReply);

    // Check if profile is complete (OTP trigger or DONE state)
    const isOtpTrigger = botReply.includes("OTP_FLOW_TRIGGER");
    const isDone = newState === "DONE" || botReply.includes("<PROFILE>");

    if (isDone) {
      updateSession(sessionId, { completed: true });
    }

    res.json({
      message: isOtpTrigger
        ? "உங்க phone number verify பண்ண OTP அனுப்புறோம்! 🔐"
        : botReply,
      state: newState,
      progress: getStateProgress(newState),
      otpRequired: isOtpTrigger,
      completed: isDone,
    });
  } catch (err) {
    // Remove the user message we just added on failure
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/chat/extract-profile
 * Extract structured worker profile JSON from the conversation.
 * Body: { sessionId }
 */
router.post("/extract-profile", async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: "sessionId is required" });

  const session = getSession(sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  try {
    const profile = await extractProfile(session.messages);
    profile.verified = session.verified || false;

    // Recalculate trust score based on verified status
    if (profile.verified) profile.trust_score = Math.min(100, profile.trust_score + 20);

    updateSession(sessionId, { extractedData: profile, completed: true });

    res.json({ profile, sessionId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/chat/verify-otp
 * Mark session as verified after OTP confirmation (frontend handles actual OTP).
 * Body: { sessionId }
 */
router.post("/verify-otp", async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: "sessionId is required" });

  const session = getSession(sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  updateSession(sessionId, { verified: true });
  appendMessage(sessionId, "user", "OTP verified ✅");

  const confirmMsg = "Perfect! ✅ நீங்க இப்போ verified worker-ஆ! Owners உங்களை எளிதா contact பண்ணுவாங்க. உங்க profile ready பண்ணலாமா?";
  appendMessage(sessionId, "assistant", confirmMsg);

  res.json({ message: confirmMsg, verified: true });
});

/**
 * GET /api/chat/session/:sessionId
 * Get session state and progress.
 */
router.get("/session/:sessionId", (req, res) => {
  const session = getSession(req.params.sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  res.json({
    state: session.state,
    progress: getStateProgress(session.state),
    messageCount: session.messages.length,
    completed: session.completed,
    verified: session.verified,
  });
});

export default router;
