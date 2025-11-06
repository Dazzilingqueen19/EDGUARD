RISKY_WORDS = {

    "meet", "alone", "secret", "private", "phone", "number", "address", "location",
    "come over", "visit", "home", "house", "age", "how old", "birthdate",

    # sexual / explicit (non-graphic placeholders)
    "sex", "porn", "explicit", "nsfw", "nude", "naked", "topless", "intimate",

    # self-harm / suicide
    "suicide", "kill myself", "end it", "hanging", "overdose", "hurt myself",

    # violence / weapons / threats
    "kill", "attack", "bomb", "explosive", "gun", "rifle", "knife", "weapon",
    "shoot", "shooting", "stab", "assault", "terror", "terrorist", "attack plan",

    # drugs / illegal substances
    "drugs", "cocaine", "heroin", "meth", "weed", "marijuana", "buy drugs", "sell drugs",
    "pill", "dose", "dealers", "supplier",

    # bullying / harassment (neutral examples)
    "idiot", "stupid", "loser", "trash", "worthless", "shut up", "get lost",

    # grooming / manipulation cues
    "trust me", "don't tell", "keep it secret", "quickly", "only you", "special",

    # sexual solicitation / exploitative phrases
    "send photo", "send pics", "show me", "private pic", "nudes", "send nudes",

    # risky behavior prompts
    "run away", "skip school", "drop out", "leave home", "meet tonight", "come tonight",

    # financial scam cues
    "bank transfer", "wire", "send money", "paypal", "gift card", "claim prize", "lottery",
    "winner", "click link", "verify account", "password", "account details",

    # adult/age mismatch cues
    "younger", "minor", "underage", "age 13", "age 14", "age 15", "age 16", "age 17",

    # explicit invites / sexual roleplay
    "hook up", "hookup", "one night", "date tonight", "date", "meet up",

    # image/video abuse cues
    "record", "video", "share video", "recording", "stream", "private stream",

    # manipulation / grooming control
    "promise", "no one will know", "dont tell anyone", "your secret is safe",

    # transactional / illegal services
    "buy sell", "weapons sale", "hire", "hitman", "hit man", "assassin",

    # other red-flag words
    "blackmail", "threat", "expose", "revenge", "revenge porn", "extort",

    # common obfuscation patterns (examples; add more)
    "s3x", "p0rn", "n00dz", "nud3s",

    # placeholders for non-allowed acts
    "rape", "molest", "abuse", "abused",

    # additional generic risky tokens / slang
    "msg me", "dm me", "snap", "snapchat", "telegram", "whatsapp", "viber",
    "passwords", "ssn", "social security", "credit card", "cvv", "pin",

    # filler to reach 100+
    "danger", "help me", "alone tonight", "meet alone", "private chat", "private message",
    "control", "forced", "threaten", "stalker", "stalking", "obsessed", "obsession",
    "illicit", "illegal", "contraband", "smuggle", "smuggling", "extortion", "fraud",
    "scam", "phishing", "malware", "ransom", "ransomware", "hacked", "hack me",
    "breach", "leak", "data leak", "dox", "doxing", "doxxed", "doxing threat",
    "supply", "supplier", "contact me", "msg", "text me", "call me", "meet now"
}

def detect_risky_chat(text: str):
    text_low = text.lower()
    flagged = [w for w in RISKY_WORDS if w in text_low]
    score = min(1.0, len(flagged) / 3.0)
    return {"flagged": flagged, "score": score}
