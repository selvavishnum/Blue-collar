const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API error ${res.status}`);
  }
  return res.json();
}

export const chatApi = {
  start: () =>
    apiFetch("/api/chat/start", { method: "POST", body: JSON.stringify({}) }),

  sendMessage: (sessionId, message) =>
    apiFetch("/api/chat/message", {
      method: "POST",
      body: JSON.stringify({ sessionId, message }),
    }),

  extractProfile: (sessionId) =>
    apiFetch("/api/chat/extract-profile", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    }),

  verifyOtp: (sessionId) =>
    apiFetch("/api/chat/verify-otp", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    }),

  getSession: (sessionId) =>
    apiFetch(`/api/chat/session/${sessionId}`),
};

// Check if the API server is reachable
export async function isApiAvailable() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}
