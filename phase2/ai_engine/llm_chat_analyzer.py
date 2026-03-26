def analyze_chat_llm(text: str):
    lowered = text.lower()
    if "meet" in lowered and "secret" in lowered:
        return {"risk_type":"grooming","confidence":0.92,"explanation":"Potential grooming intent"}
    if "kill" in lowered or "hurt" in lowered:
        return {"risk_type":"violence","confidence":0.88,"explanation":"Threat detected"}
    return {"risk_type":"safe","confidence":0.05,"explanation":"No threat found"}
