import os
from datetime import datetime
from db import save_event

SAFE_START = int(os.environ.get("SAFE_HOUR_START", "6"))
SAFE_END   = int(os.environ.get("SAFE_HOUR_END", "22"))

def is_odd_hour(dt: datetime):
    h = dt.hour
    if SAFE_START <= SAFE_END:
        return not (SAFE_START <= h < SAFE_END)
    else:
        return (h < SAFE_END) or (h >= SAFE_START)

def analyze_recent_heartbeats(heartbeat_events):
    flagged = []
    for ev in heartbeat_events:
        data = ev.get("data", "")
        try:
            if "ts:" in data:
                ts_part = data.split("ts:")[-1].strip()
                dt = datetime.fromisoformat(ts_part)
                if is_odd_hour(dt):
                    flagged.append(ev)
        except Exception:
            continue
    return flagged

def oddhour_check_and_flag(get_recent_fn):
    try:
        recent = get_recent_fn(limit=200)
        heartbeats = [r for r in recent if r["event"] == "heartbeat"]
        flagged = analyze_recent_heartbeats(heartbeats)
        for f in flagged:
            save_event("oddhour_alert", f"Detected odd-hour heartbeat: {f['data']}")
    except Exception as e:
        save_event("service_error", f"Oddhour check failed: {e}")
