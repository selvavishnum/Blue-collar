import { Clock, Camera, Users } from "lucide-react";

const TYPE_META = {
  zone_intrusion: { label: "Zone Intrusion", cls: "badge-red" },
  crowd:          { label: "Crowd Alert",    cls: "badge-orange" },
  after_hours:    { label: "After-Hours",    cls: "badge-yellow" },
  motion:         { label: "Motion",         cls: "badge-blue" },
};

export default function AlertCard({ alert }) {
  const meta = TYPE_META[alert.alert_type] || { label: alert.alert_type, cls: "badge-gray" };
  const thumb = alert.annotated_b64
    ? `data:image/jpeg;base64,${alert.annotated_b64}`
    : alert.snapshot_url || null;

  return (
    <div className={`alert-item ${alert.alert_type}`}>
      {thumb && (
        <div className="alert-thumb">
          <img src={thumb} alt="snapshot" />
        </div>
      )}
      <div className="alert-meta">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span className={`badge ${meta.cls}`}>{meta.label}</span>
          {alert.person_count > 0 && (
            <span className="badge badge-gray">
              <Users size={10} /> {alert.person_count}
            </span>
          )}
        </div>
        <div className="alert-title">{alert.camera_name}</div>
        <div className="alert-sub" style={{ display: "flex", gap: 12, marginTop: 4 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Camera size={11} /> {alert.camera_serial}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={11} /> {alert.created_at?.slice(0, 16).replace("T", " ")}
          </span>
        </div>
      </div>
    </div>
  );
}
