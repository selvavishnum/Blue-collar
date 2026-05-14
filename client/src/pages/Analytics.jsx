import { useEffect, useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { api } from "../services/api";

const CHART_STYLE = {
  backgroundColor: "#1e293b",
  border: "1px solid #475569",
  borderRadius: 8,
  fontSize: 12,
};

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getStats().then(setStats).catch(() => {});
  }, []);

  if (!stats) return (
    <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)" }}>Loading…</div>
  );

  const hourlyData = Array.from({ length: 24 }, (_, h) => {
    const hh = String(h).padStart(2, "0");
    const found = stats.hourly?.find(x => x.hour === hh);
    return { hour: `${hh}:00`, alerts: found?.cnt || 0 };
  });

  return (
    <>
      <div className="page-header">
        <div className="page-title">Analytics</div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Total Cameras</div>
          <div className="stat-value blue">{stats.total_cameras ?? "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Alerts Today</div>
          <div className="stat-value red">{stats.today_count ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Zone Intrusions</div>
          <div className="stat-value yellow">
            {stats.by_type?.find(t => t.alert_type === "zone_intrusion")?.cnt ?? 0}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Crowd Alerts</div>
          <div className="stat-value orange">
            {stats.by_type?.find(t => t.alert_type === "crowd")?.cnt ?? 0}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 14 }}>Alerts by Hour (Today)</div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" tick={{ fill: "#94a3b8", fontSize: 11 }} interval={3} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={CHART_STYLE} />
                <Line type="monotone" dataKey="alerts" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 14 }}>Alerts by Type (Today)</div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.by_type || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="alert_type" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={CHART_STYLE} />
                <Bar dataKey="cnt" fill="#ef4444" radius={[4, 4, 0, 0]} name="Alerts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {stats.top_cameras?.length > 0 && (
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 14 }}>Top Cameras by Alerts Today</div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.top_cameras} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="camera_name" tick={{ fill: "#94a3b8", fontSize: 11 }} width={120} />
                <Tooltip contentStyle={CHART_STYLE} />
                <Bar dataKey="cnt" fill="#f97316" radius={[0, 4, 4, 0]} name="Alerts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <style>{`.orange { color: var(--orange); }`}</style>
    </>
  );
}
