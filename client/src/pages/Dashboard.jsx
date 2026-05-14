import { useEffect, useState } from "react";
import { RefreshCw, Camera } from "lucide-react";
import { api } from "../services/api";
import { CameraCard, StreamModal } from "../components/CameraCard";

const PAGE_SIZE = 6;

export default function Dashboard() {
  const [cameras, setCameras] = useState([]);
  const [stats, setStats] = useState({});
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [camData, statsData] = await Promise.all([api.getCameras(), api.getStats()]);
      setCameras(camData.cameras || []);
      setStats(statsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSync = async () => {
    setSyncing(true);
    try { await api.syncCameras(); await load(); } finally { setSyncing(false); }
  };

  const totalPages = Math.ceil(cameras.length / PAGE_SIZE);
  const pageCams = cameras.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Live Dashboard</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
            {cameras.length} cameras monitored
          </div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={handleSync} disabled={syncing}>
          <RefreshCw size={13} className={syncing ? "spin" : ""} />
          {syncing ? "Syncing…" : "Sync Cameras"}
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Cameras</div>
          <div className="stat-value blue">{stats.total_cameras ?? cameras.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Cameras</div>
          <div className="stat-value green">{stats.active_cameras ?? cameras.filter(c => c.enabled).length}</div>
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
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)" }}>
          Loading cameras…
        </div>
      ) : cameras.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <Camera size={40} color="var(--border)" style={{ margin: "0 auto 12px" }} />
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No cameras found</div>
          <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 16 }}>
            Go to Settings and add your Ezviz App Key to sync cameras.
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleSync}>
            Sync from Ezviz
          </button>
        </div>
      ) : (
        <>
          <div className="camera-grid">
            {pageCams.map(cam => (
              <CameraCard key={cam.serial} camera={cam} onOpen={setSelected} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 0}>
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`page-btn${page === i ? " active" : ""}`}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </button>
              ))}
              <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages - 1}>
                ›
              </button>
            </div>
          )}
        </>
      )}

      <StreamModal camera={selected} onClose={() => setSelected(null)} />

      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
