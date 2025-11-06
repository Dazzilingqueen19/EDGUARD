import os
from twilio.rest import Client as TwClient
import firebase_admin
from firebase_admin import messaging, credentials

TW_SID = os.environ.get("TWILIO_SID")
TW_TOKEN = os.environ.get("TWILIO_TOKEN")
TW_FROM = os.environ.get("TWILIO_FROM")
PARENT_PHONE = os.environ.get("PARENT_PHONE")

FCM_CRED_PATH = os.environ.get("FCM_CRED_PATH")
_firebase_initialized = False

def send_sms(body):
    if not (TW_SID and TW_TOKEN and TW_FROM and PARENT_PHONE):
        print("Twilio not configured — SMS skipped:", body)
        return False
    client = TwClient(TW_SID, TW_TOKEN)
    client.messages.create(body=body, from_=TW_FROM, to=PARENT_PHONE)
    return True

def _init_firebase():
    global _firebase_initialized
    if _firebase_initialized: return
    if not FCM_CRED_PATH:
        print("FCM creds path not set; push disabled")
        return
    cred = credentials.Certificate(FCM_CRED_PATH)
    firebase_admin.initialize_app(cred)
    _firebase_initialized = True

def send_push(token, title, body, data=None):
    _init_firebase()
    if not _firebase_initialized:
        print("Firebase not initialized, skip push")
        return False
    message = messaging.Message(
        notification=messaging.Notification(title=title, body=body),
        token=token,
        data=data or {}
    )
    resp = messaging.send(message)
    return resp
