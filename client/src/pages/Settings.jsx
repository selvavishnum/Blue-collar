import { useEffect, useState } from "react";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { api } from "../services/api";

export default function SettingsPage() {
  const [form, setForm] = useState({
    ezviz_app_key: "",
    ezviz_app_secret: "",
    scan_interval: "60",
    crowd_threshold: "5",
    shop_open: "08:00",
    shop_close: "22:00",
    email_to: "",
    email_from: "",
    email_password: "",
    alert_cooldown: "180",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connStatus, setConnStatus] = useState(null);

  useEffect(() => {
    api.getSettings().then(s => setForm(f => ({ ...f, ...s }))).catch(() => {});
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await api.saveSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setConnStatus(null);
    try {
      await api.saveSettings({ ezviz_app_key: form.ezviz_app_key, ezviz_app_secret: form.ezviz_app_secret });
      const r = await api.testConnection();
      setConnStatus(r.connected ? "ok" : "fail");
    } catch {
      setConnStatus("fail");
    } finally {
      setTesting(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">Settings</div>
        <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : saved ? "Saved!" : "Save Settings"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Ezviz credentials */}
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 16 }}>Ezviz API Credentials</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
            Register at <strong>open.ys7.com</strong> to get your App Key and App Secret.
          </div>
          <div className="form-group">
            <label className="form-label">App Key</label>
            <input className="form-input" value={form.ezviz_app_key} onChange={e => set("ezviz_app_key", e.target.value)} placeholder="Your Ezviz App Key" />
          </div>
          <div className="form-group">
            <label className="form-label">App Secret</label>
            <input className="form-input" type="password" value={form.ezviz_app_secret} onChange={e => set("ezviz_app_secret", e.target.value)} placeholder="Your Ezviz App Secret" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="btn btn-outline btn-sm" onClick={handleTest} disabled={testing}>
              <RefreshCw size={12} /> {testing ? "Testing…" : "Test Connection"}
            </button>
            {connStatus === "ok" && <span style={{ color: "var(--green)", display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}><CheckCircle size={14} /> Connected</span>}
            {connStatus === "fail" && <span style={{ color: "var(--red)", display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}><XCircle size={14} /> Failed</span>}
          </div>
        </div>

        {/* AI settings */}
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 16 }}>AI & Monitoring</div>
          <div className="form-group">
            <label className="form-label">Scan Interval (seconds)</label>
            <select className="form-input" value={form.scan_interval} onChange={e => set("scan_interval", e.target.value)}>
              <option value="30">30 seconds</option>
              <option value="60">60 seconds</option>
              <option value="120">2 minutes</option>
              <option value="300">5 minutes</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Crowd Alert Threshold (persons)</label>
            <input className="form-input" type="number" min="2" max="50" value={form.crowd_threshold} onChange={e => set("crowd_threshold", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Alert Cooldown (seconds)</label>
            <input className="form-input" type="number" min="30" max="3600" value={form.alert_cooldown} onChange={e => set("alert_cooldown", e.target.value)} />
          </div>
        </div>

        {/* Shop schedule */}
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 16 }}>Shop Schedule</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
            After-hours alerts trigger when a person is detected outside these times.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Open Time</label>
              <input className="form-input" type="time" value={form.shop_open} onChange={e => set("shop_open", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Close Time</label>
              <input className="form-input" type="time" value={form.shop_close} onChange={e => set("shop_close", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 16 }}>Email Notifications</div>
          <div className="form-group">
            <label className="form-label">Send Alerts To</label>
            <input className="form-input" type="email" value={form.email_to} onChange={e => set("email_to", e.target.value)} placeholder="youremail@gmail.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Gmail Address (sender)</label>
            <input className="form-input" type="email" value={form.email_from} onChange={e => set("email_from", e.target.value)} placeholder="shopguard@gmail.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Gmail App Password</label>
            <input className="form-input" type="password" value={form.email_password} onChange={e => set("email_password", e.target.value)} placeholder="16-char app password" />
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            Use a Gmail App Password (not your regular password). Enable 2FA → App Passwords in Google Account.
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, textAlign: "right" }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : saved ? "Saved!" : "Save All Settings"}
        </button>
      </div>
    </>
  );
}
