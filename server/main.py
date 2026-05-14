import asyncio
import json
import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

load_dotenv()

import database
import ezviz_client
import scheduler
import alert_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    database.init_db()
    _seed_env_settings()
    try:
        scheduler.start_scheduler()
    except Exception:
        pass
    yield
    scheduler.stop_scheduler()


def _seed_env_settings():
    for key, env in [
        ("ezviz_app_key", "EZVIZ_APP_KEY"),
        ("ezviz_app_secret", "EZVIZ_APP_SECRET"),
        ("email_from", "EMAIL_FROM"),
        ("email_password", "EMAIL_PASSWORD"),
        ("email_to", "EMAIL_TO"),
    ]:
        val = os.environ.get(env, "")
        if val:
            database.set_setting(key, val)


app = FastAPI(title="ShopGuard AI", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Cameras ──────────────────────────────────────────────────────────────────

@app.get("/api/cameras")
async def get_cameras():
    """Return cameras from DB (auto-synced from Ezviz on first call)."""
    cams = database.get_cameras()
    if not cams:
        try:
            devices = await ezviz_client.list_all_devices()
            if devices:
                database.save_cameras(devices)
                cams = database.get_cameras()
        except Exception as e:
            return JSONResponse({"cameras": [], "error": str(e)}, status_code=200)
    return {"cameras": cams}


@app.post("/api/cameras/sync")
async def sync_cameras():
    """Force sync cameras from Ezviz account."""
    try:
        devices = await ezviz_client.list_all_devices()
        database.save_cameras(devices)
        return {"synced": len(devices)}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)


class CameraUpdate(BaseModel):
    name: str | None = None
    location: str | None = None
    enabled: int | None = None
    zones: str | None = None


@app.patch("/api/cameras/{serial}")
async def update_camera(serial: str, body: CameraUpdate):
    database.update_camera(serial, body.name, body.location, body.enabled, body.zones)
    return {"ok": True}


@app.get("/api/cameras/{serial}/stream")
async def get_stream(serial: str, channel: int = 1):
    try:
        url = await ezviz_client.get_live_stream(serial, channel, protocol=2)
        return {"url": url}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)


@app.get("/api/cameras/{serial}/snapshot")
async def get_snapshot(serial: str, channel: int = 1):
    try:
        url = await ezviz_client.capture_snapshot(serial, channel)
        return {"url": url}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)


# ── Alerts ────────────────────────────────────────────────────────────────────

@app.get("/api/alerts")
async def get_alerts(
    page: int = Query(0, ge=0),
    page_size: int = Query(20, ge=1, le=100),
    camera_serial: str | None = None,
    alert_type: str | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
):
    return database.get_alerts(page, page_size, camera_serial, alert_type, date_from, date_to)


# ── Stats ─────────────────────────────────────────────────────────────────────

@app.get("/api/stats")
async def get_stats():
    stats = database.get_stats()
    cams = database.get_cameras()
    stats["total_cameras"] = len(cams)
    stats["active_cameras"] = sum(1 for c in cams if c.get("enabled", 1))
    return stats


# ── Settings ──────────────────────────────────────────────────────────────────

@app.get("/api/settings")
async def get_settings():
    s = database.get_all_settings()
    s.pop("email_password", None)
    return s


class SettingsBody(BaseModel):
    ezviz_app_key: str | None = None
    ezviz_app_secret: str | None = None
    scan_interval: str | None = None
    crowd_threshold: str | None = None
    shop_open: str | None = None
    shop_close: str | None = None
    email_to: str | None = None
    email_from: str | None = None
    email_password: str | None = None
    fcm_enabled: str | None = None
    alert_cooldown: str | None = None


@app.post("/api/settings")
async def save_settings(body: SettingsBody):
    data = {k: v for k, v in body.model_dump().items() if v is not None}
    for k, v in data.items():
        database.set_setting(k, v)
    if "scan_interval" in data:
        try:
            scheduler.update_interval(int(data["scan_interval"]))
        except Exception:
            pass
    return {"ok": True}


@app.post("/api/settings/test-connection")
async def test_connection():
    ok = await ezviz_client.test_connection()
    return {"connected": ok}


# ── WebSocket ─────────────────────────────────────────────────────────────────

@app.websocket("/ws/alerts")
async def ws_alerts(websocket: WebSocket):
    await websocket.accept()
    queue: asyncio.Queue = asyncio.Queue()
    alert_manager.register_ws(queue)
    try:
        while True:
            event = await asyncio.wait_for(queue.get(), timeout=30)
            await websocket.send_text(json.dumps(event))
    except (WebSocketDisconnect, asyncio.TimeoutError):
        pass
    finally:
        alert_manager.unregister_ws(queue)
