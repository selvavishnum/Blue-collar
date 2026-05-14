import os
import time
import aiohttp
from database import get_setting

EZVIZ_BASE = "https://open.ys7.com"

_DEMO = os.getenv("DEMO_MODE", "").lower() in ("1", "true", "yes")

_DEMO_CAMERAS = [
    {"deviceSerial": "DEMO001", "channelNo": 1, "deviceName": "Shop Front"},
    {"deviceSerial": "DEMO002", "channelNo": 1, "deviceName": "Checkout Counter"},
    {"deviceSerial": "DEMO003", "channelNo": 1, "deviceName": "Storage Room"},
]
_DEMO_SNAPSHOT = "https://ultralytics.com/images/zidane.jpg"

_token: str = ""
_token_expiry: int = 0


async def _post(path: str, data: dict) -> dict:
    async with aiohttp.ClientSession() as session:
        async with session.post(f"{EZVIZ_BASE}{path}", data=data, timeout=aiohttp.ClientTimeout(total=15)) as resp:
            return await resp.json(content_type=None)


async def get_token() -> str:
    global _token, _token_expiry
    app_key = get_setting("ezviz_app_key")
    app_secret = get_setting("ezviz_app_secret")
    result = await _post("/api/lapp/token/get", {"appKey": app_key, "appSecret": app_secret})
    if result.get("code") == "200":
        _token = result["data"]["accessToken"]
        _token_expiry = result["data"]["expireTime"]
        return _token
    raise ValueError(f"Ezviz token error: {result.get('msg', result)}")


async def ensure_token() -> str:
    global _token, _token_expiry
    if not _token or time.time() * 1000 > _token_expiry - 120_000:
        await get_token()
    return _token


async def list_devices(page: int = 0, size: int = 50) -> list[dict]:
    token = await ensure_token()
    result = await _post("/api/lapp/device/list", {
        "accessToken": token,
        "pageStart": page,
        "pageSize": size,
    })
    if result.get("code") == "200":
        return result.get("data", {}).get("deviceInfos", [])
    return []


async def list_all_devices() -> list[dict]:
    """Fetch all devices across pages."""
    if _DEMO:
        return _DEMO_CAMERAS
    all_devices = []
    page = 0
    while True:
        batch = await list_devices(page, 50)
        if not batch:
            break
        all_devices.extend(batch)
        if len(batch) < 50:
            break
        page += 1
    return all_devices


async def capture_snapshot(device_serial: str, channel: int = 1) -> str | None:
    if _DEMO:
        return _DEMO_SNAPSHOT
    token = await ensure_token()
    result = await _post("/api/lapp/device/capture", {
        "accessToken": token,
        "deviceSerial": device_serial,
        "channelNo": channel,
    })
    if result.get("code") == "200":
        return result.get("data", {}).get("picUrl")
    return None


async def get_live_stream(device_serial: str, channel: int = 1, protocol: int = 2) -> str | None:
    """protocol: 1=ezopen, 2=HLS, 3=FLV, 4=RTMP"""
    if _DEMO:
        return None
    token = await ensure_token()
    result = await _post("/api/lapp/live/address/get", {
        "accessToken": token,
        "deviceSerial": device_serial,
        "channelNo": channel,
        "protocol": protocol,
        "expireTime": 43200,
    })
    if result.get("code") == "200":
        return result.get("data", {}).get("url")
    return None


async def get_alarms(device_serial: str, start_ms: int, end_ms: int) -> list[dict]:
    token = await ensure_token()
    result = await _post("/api/lapp/alarm/list", {
        "accessToken": token,
        "deviceSerial": device_serial,
        "startTime": start_ms,
        "endTime": end_ms,
        "pageStart": 0,
        "pageSize": 20,
    })
    if result.get("code") == "200":
        return result.get("data", {}).get("alarmInfos", [])
    return []


async def test_connection() -> bool:
    if _DEMO:
        return True
    try:
        await get_token()
        return True
    except Exception:
        return False
