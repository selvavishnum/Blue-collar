import asyncio
import json
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from database import get_cameras, get_setting
import ezviz_client
import ai_detector
import alert_manager

_scheduler: AsyncIOScheduler | None = None


async def _scan_camera(cam: dict):
    serial = cam["serial"]
    channel = cam.get("channel", 1)
    name = cam.get("name", serial)
    zones = json.loads(cam.get("zones", "[]"))
    shop_open = get_setting("shop_open", "08:00")
    shop_close = get_setting("shop_close", "22:00")
    crowd_threshold = int(get_setting("crowd_threshold", "5"))
    cooldown_s = int(get_setting("alert_cooldown", "180"))

    try:
        snapshot_url = await ezviz_client.capture_snapshot(serial, channel)
        if not snapshot_url:
            return
        detection = await ai_detector.analyze_snapshot(snapshot_url, zones)
        if "error" in detection:
            return
        await alert_manager.process_detection(
            serial, name, detection, zones,
            shop_open, shop_close, crowd_threshold, cooldown_s
        )
    except Exception:
        pass


async def _scan_all():
    cameras = [c for c in get_cameras() if c.get("enabled", 1)]
    if not cameras:
        return
    # Scan cameras in batches of 5 to avoid overwhelming the Ezviz API
    batch_size = 5
    for i in range(0, len(cameras), batch_size):
        batch = cameras[i:i + batch_size]
        await asyncio.gather(*[_scan_camera(cam) for cam in batch])
        if i + batch_size < len(cameras):
            await asyncio.sleep(2)


def start_scheduler():
    global _scheduler
    interval = int(get_setting("scan_interval", "60"))
    _scheduler = AsyncIOScheduler()
    _scheduler.add_job(_scan_all, "interval", seconds=interval, id="scan_all", replace_existing=True)
    _scheduler.start()


def stop_scheduler():
    global _scheduler
    if _scheduler:
        _scheduler.shutdown(wait=False)


def update_interval(seconds: int):
    global _scheduler
    if _scheduler:
        _scheduler.reschedule_job("scan_all", trigger="interval", seconds=seconds)
