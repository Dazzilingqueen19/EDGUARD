import sqlite3
import os
from cryptography.fernet import Fernet
from datetime import datetime

BASE = os.path.dirname(__file__)
DB_FILE = os.path.join(BASE, "edguard.db")
KEY_FILE = os.path.join(BASE, "secret.key")

def load_key():
    if not os.path.exists(KEY_FILE):
        key = Fernet.generate_key()
        with open(KEY_FILE, "wb") as f:
            f.write(key)
    else:
        with open(KEY_FILE, "rb") as f:
            key = f.read()
    return key

KEY = load_key()
CIPHER = Fernet(KEY)

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS logs (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           event TEXT,
           data BLOB,
           ts TEXT
        )
    ''')
    conn.commit()
    conn.close()

def save_event(event, data_str):
    enc = CIPHER.encrypt(data_str.encode())
    ts = datetime.utcnow().isoformat()
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("INSERT INTO logs (event, data, ts) VALUES (?, ?, ?)",
              (event, enc, ts))
    conn.commit()
    conn.close()

def get_events(limit=100):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT id,event,data,ts FROM logs ORDER BY id DESC LIMIT ?", (limit,))
    rows = c.fetchall()
    conn.close()
    out = []
    for r in rows:
        try:
            dec = CIPHER.decrypt(r[2]).decode()
        except Exception:
            dec = "<decrypt error>"
        out.append({"id": r[0], "event": r[1], "data": dec, "ts": r[3]})
    return out

init_db()
