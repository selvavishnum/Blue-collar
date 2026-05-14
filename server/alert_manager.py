import time
import smtplib
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from database import get_setting, save_alert as db_save_alert

# cooldown tracker: {camera_serial + alert_type -> last_alert_epoch}
_cooldowns: dict[str, float] = {}

# broadcast queue for WebSocket listeners
_ws_listeners: list = []


def register_ws(queue):
    _ws_listeners.append(queue)


def unregister_ws(queue):
    _ws_listeners.discard(queue) if hasattr(_ws_listeners, "discard") else None
    try:
        _ws_listeners.remove(queue)
    except ValueError:
        pass


async def broadcast(event: dict):
    for q in list(_ws_listeners):
        try:
            await q.put(event)
        except Exception:
            pass


def _is_cooled_down(camera_serial: str, alert_type: str, cooldown_s: int) -> bool:
    key = f"{camera_serial}:{alert_type}"
    last = _cooldowns.get(key, 0)
    return time.time() - last < cooldown_s


def _mark_cooldown(camera_serial: str, alert_type: str):
    _cooldowns[f"{camera_serial}:{alert_type}"] = time.time()


async def process_detection(
    camera_serial: str,
    camera_name: str,
    detection: dict,
    zones: list,
    shop_open: str,
    shop_close: str,
    crowd_threshold: int,
    cooldown_s: int,
):
    person_count = detection.get("person_count", 0)
    persons = detection.get("persons", [])
    snapshot_url = detection.get("snapshot_url", "")
    annotated_b64 = detection.get("annotated_b64", "")

    import datetime
    now_t = datetime.datetime.now().strftime("%H:%M")
    in_hours = shop_open <= now_t <= shop_close

    triggered = []

    # Zone intrusion alert
    if zones and any(p.get("in_zone") for p in persons):
        if not _is_cooled_down(camera_serial, "zone_intrusion", cooldown_s):
            triggered.append(("zone_intrusion", person_count))
            _mark_cooldown(camera_serial, "zone_intrusion")

    # Crowd alert
    if person_count >= crowd_threshold:
        if not _is_cooled_down(camera_serial, "crowd", cooldown_s * 2):
            triggered.append(("crowd", person_count))
            _mark_cooldown(camera_serial, "crowd")

    # After-hours person detected
    if person_count > 0 and not in_hours:
        if not _is_cooled_down(camera_serial, "after_hours", cooldown_s):
            triggered.append(("after_hours", person_count))
            _mark_cooldown(camera_serial, "after_hours")

    for alert_type, count in triggered:
        conf = max((p["confidence"] for p in persons), default=0.0)
        db_save_alert(camera_serial, camera_name, alert_type, count, conf, snapshot_url, annotated_b64)
        event = {
            "camera_serial": camera_serial,
            "camera_name": camera_name,
            "alert_type": alert_type,
            "person_count": count,
            "snapshot_url": snapshot_url,
            "time": time.strftime("%Y-%m-%d %H:%M:%S"),
        }
        await broadcast(event)
        _send_email_async(event, annotated_b64)


def _send_email_async(event: dict, annotated_b64: str):
    import threading
    threading.Thread(target=_send_email, args=(event, annotated_b64), daemon=True).start()


def _send_email(event: dict, annotated_b64: str):
    email_from = get_setting("email_from")
    email_pw = get_setting("email_password")
    email_to = get_setting("email_to")
    if not all([email_from, email_pw, email_to]):
        return

    type_labels = {
        "zone_intrusion": "Zone Intrusion Alert",
        "crowd": "Crowd Alert",
        "after_hours": "After-Hours Alert",
        "motion": "Motion Detected",
    }
    subject = f"[ShopGuard] {type_labels.get(event['alert_type'], event['alert_type'])} — {event['camera_name']}"
    body = (
        f"Alert Type: {type_labels.get(event['alert_type'], event['alert_type'])}\n"
        f"Camera: {event['camera_name']}\n"
        f"Persons Detected: {event['person_count']}\n"
        f"Time: {event['time']}\n"
    )

    msg = MIMEMultipart()
    msg["From"] = email_from
    msg["To"] = email_to
    msg["Subject"] = subject
    msg.attach(MIMEText(body))

    if annotated_b64:
        try:
            img_data = base64.b64decode(annotated_b64)
            img = MIMEImage(img_data, name="snapshot.jpg")
            msg.attach(img)
        except Exception:
            pass

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10) as smtp:
            smtp.login(email_from, email_pw)
            smtp.sendmail(email_from, email_to, msg.as_string())
    except Exception:
        pass
