import sys
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

API_KEY = os.environ.get("EDGUARD_API_KEY", "devkey")

def require_key(req):
    return req.headers.get("X-API-KEY") == API_KEY

# Lightweight API endpoints for Vercel serverless
# ML-heavy features (chat analysis, emotion detection) are stubbed for external services

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "edguard-api"}), 200

@app.route("/api/chat", methods=["POST"])
def api_chat():
    """Stubbed chat endpoint - integrate with external ML service"""
    if not require_key(request):
        return jsonify({"error": "unauthorized"}), 401
    data = request.json or {}
    text = data.get("text", "")
    # For production, call external ML API (e.g., AWS Comprehend, Google NLP)
    # For now, return safe response
    return jsonify({
        "text": text,
        "info": {"score": 0.1, "category": "safe"},
        "message": "Chat analysis requires external ML service integration"
    }), 200

@app.route("/api/emotion", methods=["POST"])
def api_emotion():
    """Stubbed emotion detection endpoint - integrate with external ML service"""
    if not require_key(request):
        return jsonify({"error": "unauthorized"}), 401
    data = request.json or {}
    # For production, call external ML API (e.g., AWS Rekognition, Google Vision)
    return jsonify({
        "emotion": "neutral",
        "score": 0.5,
        "message": "Emotion detection requires external ML service integration"
    }), 200

@app.route("/api/events", methods=["GET"])
def get_events_api():
    """Get logged events - integrate with Firebase"""
    if not require_key(request):
        return jsonify({"error": "unauthorized"}), 401
    # Connect to Firebase or database for event retrieval
    return jsonify({"events": [], "message": "Database integration required"}), 200

@app.route("/api/events", methods=["POST"])
def save_event_api():
    """Log event - integrate with Firebase"""
    if not require_key(request):
        return jsonify({"error": "unauthorized"}), 401
    data = request.json or {}
    # Connect to Firebase or database to save events
    return jsonify({"status": "saved", "data": data}), 201

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "endpoint not found"}), 404

# Vercel serverless handler
def handler(request):
    """WSGI handler for Vercel"""
    return app(environ=request.environ, start_response=request.start_response)
