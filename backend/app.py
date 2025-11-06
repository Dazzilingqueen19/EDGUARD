from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from chat_monitor import detect_risky_chat
from db import save_event, get_events
from blurshield import show_blur_overlay
from notify import send_sms, send_push
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from oddhour import oddhour_check_and_flag

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")
CORS(app)

API_KEY = os.environ.get("EDGUARD_API_KEY", "devkey")
RISK_SENSITIVITY = float(os.environ.get("RISK_SENSITIVITY", 0.3))

def require_key(req):
    return req.headers.get("X-API-KEY") == API_KEY

def compute_risk_score(entry):
    if entry.get("event") == "chat":
        if "score" in entry.get("data", ""):
            try:
                score_part = entry["data"].split("score':")[-1].split("}")[0]
                return float(score_part)
            except:
                return 0.0
    if entry.get("event") == "emotion":
        try:
            parts = entry["data"].split("|")
            score = float(parts[-1].strip())
            return min(1.0, score)
        except:
            return 0.0
    if entry.get("event") == "oddhour_alert":
        return 0.6
    return 0.0

@app.route("/api/chat", methods=["POST"])
def api_chat():
    if not require_key(request): return jsonify({"error":"unauthorized"}), 401
    data = request.json or {}
    text = data.get("text","")
    info = detect_risky_chat(text)
    save_event("chat", f"{text} | {info}")
    if info["score"] > RISK_SENSITIVITY:
        try:
            show_blur_overlay(seconds=4)
        except Exception as e:
            print('blur failed', e)
        send_sms(f"EDGUARD Alert: risky chat detected: {info['flagged']} (score {info['score']})")
        tokens = [e['data'].split('token:')[-1] for e in get_events(200) if e['event']=='parent_token']
        for t in tokens:
            try:
                send_push(t, "EDGUARD Alert", f"Risky chat detected: {info['flagged']}")
            except Exception as e:
                print('push fail', e)
    return jsonify({"ok": True, "info": info})

@app.route("/api/emotion", methods=["POST"])
def api_emotion():
    if not require_key(request): return jsonify({"error":"unauthorized"}), 401
    data = request.json or {}
    emotion = data.get("emotion","unknown")
    score = float(data.get("score", 0))
    save_event("emotion", f"{emotion} | {score}")
    if emotion in ("sad","fear","angry") and score > 0.5:
        try:
            show_blur_overlay(seconds=3)
        except Exception as e:
            print('blur failed', e)
        send_sms(f"EDGUARD Alert: emotion {emotion} detected (score {score})")
        tokens = [e['data'].split('token:')[-1] for e in get_events(200) if e['event']=='parent_token']
        for t in tokens:
            try:
                send_push(t, "EDGUARD Alert", f"Emotion {emotion} detected: {score}")
            except Exception as e:
                print('push fail', e)
    return jsonify({"ok": True})

@app.route("/api/heartbeat", methods=["POST"])
def api_heartbeat():
    if not require_key(request): return jsonify({"error":"unauthorized"}), 401
    data = request.json or {}
    device = data.get("device", "unknown")
    ts = data.get("ts", datetime.utcnow().isoformat())
    save_event("heartbeat", f"device:{device} | ts:{ts}")
    return jsonify({"ok": True})

@app.route("/api/logs", methods=["GET"])
def api_logs():
    if not require_key(request): return jsonify({"error":"unauthorized"}), 401
    items = get_events(500)
    out = []
    for it in items:
        score = compute_risk_score(it)
        it['risk_score'] = score
        out.append(it)
    return jsonify(out)
@app.route("/api/register_token", methods=["POST"])
def register_token():
    if not require_key(request): return jsonify({"error":"unauthorized"}), 401
    body = request.json or {}
    token = body.get("token")
    if token:
        save_event("parent_token", f"token:{token}")
        return jsonify({"ok": True})
    return jsonify({"error":"no token"}), 400

@app.route("/api/oddhour_trigger", methods=["POST"])
def oddhour_trigger():
    if not require_key(request): return jsonify({"error":"unauthorized"}), 401
    body = request.json or {}
    ts = body.get("timestamp") or datetime.utcnow().isoformat()
    save_event("oddhour", f"ts:{ts} | manual_trigger")
    return jsonify({"ok": True})

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

# scheduler for odd-hour
scheduler = BackgroundScheduler()
scheduler.add_job(lambda: oddhour_check_and_flag(get_events), 'interval', minutes=5, id='oddhour_job', next_run_time=None)
scheduler.start()

if __name__ == "__main__":
    from db import init_db
    init_db()
    app.run(debug=True, host="0.0.0.0", port=5000)
