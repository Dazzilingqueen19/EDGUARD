from cryptography.fernet import Fernet
KEY = Fernet.generate_key()
cipher = Fernet(KEY)
def encrypt_data(t): return cipher.encrypt(t.encode()).decode()
def decrypt_data(t): return cipher.decrypt(t.encode()).decode()
