import { useState, useEffect, useRef } from "react";
import { Video, VideoOff, Users } from "lucide-react";
import Hls from "hls.js";
import { api } from "../services/api";

export function CameraCard({ camera, onOpen }) {
  const [snapshot, setSnapshot] = useState(camera.last_snapshot || null);
  const [loadErr, setLoadErr] = useState(false);

  useEffect(() => {
    setSnapshot(null);
    setLoadErr(false);
    api.getSnapshot(camera.serial, camera.channel || 1)
      .then(d => { if (d.url) setSnapshot(d.url); })
      .catch(() => setLoadErr(true));
  }, [camera.serial]);

  return (
    <div
      className={`cam-card${camera._alert ? " alert" : ""}`}
      onClick={() => onOpen(camera)}
    >
      <div className="cam-img-wrap">
        {snapshot && !loadErr ? (
          <img
            src={snapshot}
            alt={camera.name}
            onError={() => setLoadErr(true)}
          />
        ) : (
          <div className="cam-img-placeholder">
            {loadErr ? <VideoOff size={28} /> : <Video size={28} />}
          </div>
        )}
        <span className="cam-live-badge">CAM</span>
        {camera._alert && (
          <span style={{ position: "absolute", top: 8, right: 8, background: "var(--red)", borderRadius: 4, fontSize: 10, fontWeight: 700, padding: "2px 6px", color: "white" }}>
            ALERT
          </span>
        )}
      </div>
      <div className="cam-info">
        <div>
          <div className="cam-name">{camera.name}</div>
          <div className="cam-location">{camera.location || camera.serial}</div>
        </div>
        {camera._person_count > 0 && (
          <span className="badge badge-green" style={{ gap: 4 }}>
            <Users size={10} /> {camera._person_count}
          </span>
        )}
      </div>
    </div>
  );
}

export function StreamModal({ camera, onClose }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [streamUrl, setStreamUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!camera) return;
    setLoading(true);
    setError(null);
    api.getStream(camera.serial, camera.channel || 1)
      .then(d => {
        if (d.url) {
          setStreamUrl(d.url);
        } else {
          setError("No stream URL returned.");
        }
      })
      .catch(() => setError("Failed to fetch stream URL."))
      .finally(() => setLoading(false));
  }, [camera?.serial]);

  useEffect(() => {
    if (!streamUrl || !videoRef.current) return;
    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) setError("Stream error. Camera may be offline.");
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      video.play().catch(() => {});
    }

    return () => { hlsRef.current?.destroy(); };
  }, [streamUrl]);

  if (!camera) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ fontWeight: 700 }}>{camera.name}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{camera.location || camera.serial}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div style={{ background: "#000", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {loading && <span style={{ color: "var(--muted)", fontSize: 13 }}>Loading stream…</span>}
          {error && !loading && <span style={{ color: "var(--red)", fontSize: 13 }}>{error}</span>}
          <video
            ref={videoRef}
            controls
            playsInline
            muted
            style={{ width: "100%", display: loading || error ? "none" : "block" }}
          />
        </div>
      </div>
    </div>
  );
}
