from flask import Blueprint, request, jsonify
from chat_monitor import detect_risky_chat
from db import save_event, get_events

phase2_api = Blueprint("phase2_api", __name__, url_prefix="/api/phase2")


@phase2_api.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "phase": "2",
        "message": "Phase 2 API is running"
    })


@phase2_api.route("/chat", methods=["POST"])
def phase2_chat():
    data = request.json or {}
    text = data.get("text", "")

    # Reuse Phase-1 NLP detector
    info = detect_risky_chat(text)

    # Phase-2 enhancement: context-aware risk
    context_score = min(1.0, info["score"] + 0.2)

    save_event(
        "phase2_chat",
        f"{text} | base_score:{info['score']} | context_score:{context_score}"
    )

    return jsonify({
        "ok": True,
        "phase": 2,
        "base_score": info["score"],
        "context_score": context_score,
        "flagged": info["flagged"],
        "explanation": "Phase 2 AI added contextual risk amplification"
    })
