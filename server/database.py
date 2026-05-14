import sqlite3
import os
from pathlib import Path

DB_PATH = os.environ.get("DB_PATH", "shopguard.db")


def get_conn():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_conn()
    c = conn.cursor()
    c.executescript("""
        CREATE TABLE IF NOT EXISTS cameras (
            serial      TEXT PRIMARY KEY,
            channel     INTEGER NOT NULL DEFAULT 1,
            name        TEXT NOT NULL,
            location    TEXT DEFAULT '',
            enabled     INTEGER NOT NULL DEFAULT 1,
            zones       TEXT DEFAULT '[]',
            created_at  TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS alerts (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            camera_serial   TEXT NOT NULL,
            camera_name     TEXT NOT NULL,
            alert_type      TEXT NOT NULL,
            person_count    INTEGER DEFAULT 0,
            confidence      REAL DEFAULT 0.0,
            snapshot_url    TEXT DEFAULT '',
            annotated_b64   TEXT DEFAULT '',
            created_at      TEXT DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_alerts_time ON alerts(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_alerts_camera ON alerts(camera_serial);

        CREATE TABLE IF NOT EXISTS settings (
            key     TEXT PRIMARY KEY,
            value   TEXT NOT NULL
        );

        INSERT OR IGNORE INTO settings VALUES ('ezviz_app_key', '');
        INSERT OR IGNORE INTO settings VALUES ('ezviz_app_secret', '');
        INSERT OR IGNORE INTO settings VALUES ('scan_interval', '60');
        INSERT OR IGNORE INTO settings VALUES ('crowd_threshold', '5');
        INSERT OR IGNORE INTO settings VALUES ('shop_open', '08:00');
        INSERT OR IGNORE INTO settings VALUES ('shop_close', '22:00');
        INSERT OR IGNORE INTO settings VALUES ('email_to', '');
        INSERT OR IGNORE INTO settings VALUES ('email_from', '');
        INSERT OR IGNORE INTO settings VALUES ('email_password', '');
        INSERT OR IGNORE INTO settings VALUES ('fcm_enabled', 'false');
        INSERT OR IGNORE INTO settings VALUES ('alert_cooldown', '180');
    """)
    conn.commit()
    conn.close()


def get_setting(key: str, default: str = "") -> str:
    conn = get_conn()
    row = conn.execute("SELECT value FROM settings WHERE key=?", (key,)).fetchone()
    conn.close()
    return row["value"] if row else default


def set_setting(key: str, value: str):
    conn = get_conn()
    conn.execute("INSERT OR REPLACE INTO settings VALUES (?,?)", (key, value))
    conn.commit()
    conn.close()


def get_all_settings() -> dict:
    conn = get_conn()
    rows = conn.execute("SELECT key, value FROM settings").fetchall()
    conn.close()
    return {r["key"]: r["value"] for r in rows}


def save_alert(camera_serial, camera_name, alert_type, person_count, confidence, snapshot_url, annotated_b64=""):
    conn = get_conn()
    conn.execute(
        "INSERT INTO alerts (camera_serial,camera_name,alert_type,person_count,confidence,snapshot_url,annotated_b64) VALUES (?,?,?,?,?,?,?)",
        (camera_serial, camera_name, alert_type, person_count, confidence, snapshot_url, annotated_b64)
    )
    conn.commit()
    conn.close()


def get_alerts(page=0, page_size=20, camera_serial=None, alert_type=None, date_from=None, date_to=None):
    conn = get_conn()
    where = ["1=1"]
    params = []
    if camera_serial:
        where.append("camera_serial=?")
        params.append(camera_serial)
    if alert_type:
        where.append("alert_type=?")
        params.append(alert_type)
    if date_from:
        where.append("created_at >= ?")
        params.append(date_from)
    if date_to:
        where.append("created_at <= ?")
        params.append(date_to)
    where_str = " AND ".join(where)
    total = conn.execute(f"SELECT COUNT(*) FROM alerts WHERE {where_str}", params).fetchone()[0]
    rows = conn.execute(
        f"SELECT id,camera_serial,camera_name,alert_type,person_count,confidence,snapshot_url,created_at FROM alerts WHERE {where_str} ORDER BY created_at DESC LIMIT ? OFFSET ?",
        params + [page_size, page * page_size]
    ).fetchall()
    conn.close()
    return {"total": total, "alerts": [dict(r) for r in rows]}


def get_stats():
    conn = get_conn()
    today_count = conn.execute(
        "SELECT COUNT(*) FROM alerts WHERE date(created_at)=date('now')"
    ).fetchone()[0]
    by_type = conn.execute(
        "SELECT alert_type, COUNT(*) as cnt FROM alerts WHERE date(created_at)=date('now') GROUP BY alert_type"
    ).fetchall()
    hourly = conn.execute(
        "SELECT strftime('%H',created_at) as hour, COUNT(*) as cnt FROM alerts WHERE date(created_at)=date('now') GROUP BY hour ORDER BY hour"
    ).fetchall()
    top_cameras = conn.execute(
        "SELECT camera_name, COUNT(*) as cnt FROM alerts WHERE date(created_at)=date('now') GROUP BY camera_serial ORDER BY cnt DESC LIMIT 10"
    ).fetchall()
    conn.close()
    return {
        "today_count": today_count,
        "by_type": [dict(r) for r in by_type],
        "hourly": [dict(r) for r in hourly],
        "top_cameras": [dict(r) for r in top_cameras],
    }


def save_cameras(cameras: list):
    conn = get_conn()
    for cam in cameras:
        conn.execute(
            "INSERT OR IGNORE INTO cameras (serial, channel, name, location) VALUES (?,?,?,?)",
            (cam["deviceSerial"], cam.get("channelNo", 1), cam.get("deviceName", cam["deviceSerial"]), "")
        )
    conn.commit()
    conn.close()


def get_cameras():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM cameras ORDER BY name").fetchall()
    conn.close()
    return [dict(r) for r in rows]


def update_camera(serial: str, name: str = None, location: str = None, enabled: int = None, zones: str = None):
    conn = get_conn()
    if name is not None:
        conn.execute("UPDATE cameras SET name=? WHERE serial=?", (name, serial))
    if location is not None:
        conn.execute("UPDATE cameras SET location=? WHERE serial=?", (location, serial))
    if enabled is not None:
        conn.execute("UPDATE cameras SET enabled=? WHERE serial=?", (enabled, serial))
    if zones is not None:
        conn.execute("UPDATE cameras SET zones=? WHERE serial=?", (zones, serial))
    conn.commit()
    conn.close()
