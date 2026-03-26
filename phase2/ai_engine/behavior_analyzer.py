from datetime import datetime
def analyze_behavior(ts):
    h = datetime.fromisoformat(ts).hour
    return {"odd_hour": h>=23 or h<=5, "risk":0.6 if h>=23 or h<=5 else 0.1}
