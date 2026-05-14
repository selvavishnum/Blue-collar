import io
import base64
import httpx
from PIL import Image, ImageDraw, ImageFont

_model = None


def _get_model():
    global _model
    if _model is None:
        from ultralytics import YOLO
        _model = YOLO("yolov8n.pt")
    return _model


def _check_zone(cx: float, cy: float, zones: list[dict]) -> bool:
    for z in zones:
        if z["x1"] <= cx <= z["x2"] and z["y1"] <= cy <= z["y2"]:
            return True
    return False


def _draw_boxes(image: Image.Image, persons: list[dict]) -> str:
    draw = ImageDraw.Draw(image)
    for p in persons:
        x1, y1, x2, y2 = p["bbox"]
        color = "#ef4444" if p.get("in_zone") else "#22c55e"
        draw.rectangle([x1, y1, x2, y2], outline=color, width=3)
        label = f"Person {p['confidence']:.0%}"
        draw.text((x1 + 2, max(0, y1 - 14)), label, fill=color)
    buf = io.BytesIO()
    image.save(buf, format="JPEG", quality=75)
    return base64.b64encode(buf.getvalue()).decode()


async def analyze_snapshot(snapshot_url: str, zones: list[dict] | None = None) -> dict:
    """
    Download snapshot, run YOLOv8n person detection.
    Returns dict with person_count, persons list, annotated_b64, alert_type.
    """
    if zones is None:
        zones = []

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(snapshot_url)
            resp.raise_for_status()
            image_data = resp.content
    except Exception as e:
        return {"error": str(e), "person_count": 0, "persons": [], "annotated_b64": ""}

    try:
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
    except Exception as e:
        return {"error": f"Image decode: {e}", "person_count": 0, "persons": [], "annotated_b64": ""}

    model = _get_model()
    results = model(image, classes=[0], verbose=False, conf=0.4)

    persons = []
    for box in results[0].boxes:
        x1, y1, x2, y2 = [float(v) for v in box.xyxy[0]]
        conf = float(box.conf[0])
        cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
        img_w, img_h = image.size
        in_zone = _check_zone(cx / img_w, cy / img_h, zones)
        persons.append({
            "bbox": [x1, y1, x2, y2],
            "confidence": conf,
            "in_zone": in_zone,
        })

    annotated_b64 = _draw_boxes(image.copy(), persons) if persons else ""

    return {
        "person_count": len(persons),
        "persons": persons,
        "annotated_b64": annotated_b64,
        "snapshot_url": snapshot_url,
    }
