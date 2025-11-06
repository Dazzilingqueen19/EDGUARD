import os
from cryptography.fernet import Fernet

KEY_FILE = os.path.join(os.path.dirname(__file__), "secret.key")

def load_key():
    if not os.path.exists(KEY_FILE):
        k = Fernet.generate_key()
        with open(KEY_FILE, "wb") as f:
            f.write(k)
        return k
    with open(KEY_FILE, "rb") as f:
        return f.read()

KEY = load_key()
CIPHER = Fernet(KEY)

def encrypt(s: str) -> bytes:
    return CIPHER.encrypt(s.encode())

def decrypt(b: bytes) -> str:
    return CIPHER.decrypt(b).decode()
