# Optional webcam client using 'fer' to detect emotions and POST to backend.
import cv2, os, requests
from fer import FER

SERVER = os.environ.get("EDGUARD_SERVER", "http://127.0.0.1:5000")
API_KEY = os.environ.get("EDGUARD_API_KEY", "devkey")

def run():
    detector = FER(mtcnn=True)
    cap = cv2.VideoCapture(0)
    while True:
        ret, frame = cap.read()
        if not ret: break
        result = detector.detect_emotions(frame)
        if result:
            emotions = result[0]["emotions"]
            dominant = max(emotions, key=emotions.get)
            score = emotions[dominant]
            try:
                requests.post(f"{SERVER}/api/emotion",
                              json={"emotion": dominant, "score": float(score)},
                              headers={"X-API-KEY": API_KEY}, timeout=3)
            except Exception as e:
                print("send fail:", e)
        cv2.imshow("EDGUARD Cam (q to quit)", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    run()
