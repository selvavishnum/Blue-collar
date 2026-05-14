import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "";

const http = axios.create({ baseURL: BASE });

export const api = {
  getCameras: () => http.get("/api/cameras").then(r => r.data),
  syncCameras: () => http.post("/api/cameras/sync").then(r => r.data),
  updateCamera: (serial, body) => http.patch(`/api/cameras/${serial}`, body).then(r => r.data),
  getStream: (serial, channel = 1) => http.get(`/api/cameras/${serial}/stream`, { params: { channel } }).then(r => r.data),
  getSnapshot: (serial, channel = 1) => http.get(`/api/cameras/${serial}/snapshot`, { params: { channel } }).then(r => r.data),

  getAlerts: (params) => http.get("/api/alerts", { params }).then(r => r.data),
  getStats: () => http.get("/api/stats").then(r => r.data),

  getSettings: () => http.get("/api/settings").then(r => r.data),
  saveSettings: (body) => http.post("/api/settings", body).then(r => r.data),
  testConnection: () => http.post("/api/settings/test-connection").then(r => r.data),
};

export function openAlertWS(onMessage) {
  const wsBase = (import.meta.env.VITE_API_URL || window.location.origin)
    .replace(/^http/, "ws");
  const ws = new WebSocket(`${wsBase}/ws/alerts`);
  ws.onmessage = (e) => {
    try { onMessage(JSON.parse(e.data)); } catch { }
  };
  return ws;
}
