EDGUARD — Real-time Monitoring Prototype (Laptop / Browser)

Folders:
- backend/      Flask backend with endpoints: /api/chat, /api/emotion, /api/heartbeat, /api/logs
- frontend/     React dashboard (multi-page)
- extension/    Chrome extension (real-time input monitoring + blur overlay)
- mobile/       Expo mobile skeleton to view logs

Important:
- This prototype is for testing and demo on your local network. It monitors text typed in browser pages (Instagram web, YouTube web, WhatsApp web, etc.) and blurs the page when risky content is detected.
- For privacy/legal production use, obtain consent and follow local laws (COPPA/GDPR etc.).

Quick run (Linux / macOS):
1) Backend:
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   export EDGUARD_API_KEY=devkey
   python app.py

2) Frontend (open new terminal):
   cd frontend
   npm install
   npm start
   # open http://localhost:3000

3) Load extension in Chrome:
   - Open chrome://extensions, enable Developer mode, Load unpacked -> select the 'extension' folder inside the project
   - The extension will monitor inputs on pages and send text to backend

4) Webcam emotions (optional):
   cd backend
   source venv/bin/activate
   python emotion_detector.py

5) Mobile (optional):
   cd mobile
   npm install
   npx expo start

Test flow:
- Open Instagram Web in Chrome, focus a DM or comment box, type a risky phrase like 'let's meet alone tonight' -> extension sends text to backend -> backend marks as risky -> extension injects blur overlay on that tab -> backend logs the event and (if configured) sends SMS/push.

Security notes:
- The secret.key file is generated in backend/ on first run; protect it.
- For production use secure key storage (KMS) and HTTPS.
- Twilio / Firebase require real credentials; see backend/.env.example
