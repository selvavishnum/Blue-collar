/**
 * In-memory session store for chatbot conversations.
 * Each session tracks: conversation history, current state, extracted data.
 * Drop-in replaceable with Redis: implement the same interface using ioredis.
 */

const sessions = new Map();

const STATES = [
  "GREETING",
  "SKILLS",
  "LOCATION",
  "SALARY",
  "WORKTYPE",
  "VERIFY",
  "DONE",
];

export function createSession(sessionId, phone = null) {
  const session = {
    id: sessionId,
    phone,
    state: "GREETING",
    messages: [],        // [{role: "user"|"assistant", content: string}]
    extractedData: {},
    verified: false,
    completed: false,
    language: "tanglish",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  sessions.set(sessionId, session);
  return session;
}

export function getSession(sessionId) {
  return sessions.get(sessionId) || null;
}

export function updateSession(sessionId, updates) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  const updated = { ...session, ...updates, updatedAt: new Date().toISOString() };
  sessions.set(sessionId, updated);
  return updated;
}

export function appendMessage(sessionId, role, content) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  session.messages.push({ role, content });
  session.updatedAt = new Date().toISOString();
  return session;
}

export function advanceState(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  const idx = STATES.indexOf(session.state);
  if (idx < STATES.length - 1) {
    session.state = STATES[idx + 1];
    session.updatedAt = new Date().toISOString();
  }
  return session;
}

export function deleteSession(sessionId) {
  sessions.delete(sessionId);
}

export function getStateProgress(state) {
  const idx = STATES.indexOf(state);
  return {
    current: idx + 1,
    total: STATES.length,
    percent: Math.round(((idx + 1) / STATES.length) * 100),
    label: state,
  };
}
