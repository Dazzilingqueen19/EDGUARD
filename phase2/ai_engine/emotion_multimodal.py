def combine_emotions(face, voice, behavior):
    score = face*0.5 + voice*0.3 + behavior*0.2
    return {"emotion":"high_risk" if score>0.7 else "normal","score":round(score,2)}
