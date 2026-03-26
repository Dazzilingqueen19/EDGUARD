# EDGUARD Parent Web App

A real-time parent dashboard for monitoring child safety alerts.

## Features

- 🚨 Real-time alert notifications
- 📊 Statistics dashboard
- 💬 Chat monitoring logs
- 😊 Emotion detection alerts
- 🔴 Online/Offline status
- 📱 Responsive design (mobile-first)
- ⚡ Works offline (cached data)

## Setup

```bash
cd parent-web-app
npm install
npm run dev
```

Opens at: **http://localhost:3001**

## Build

```bash
npm run build
```

## Features

### Real-Time Alerts
- Emotion detection alerts
- Risky chat detection
- Risk score visualization
- Browser notifications

### Activity Log
- Complete event history
- Event filtering
- Timestamp tracking

### Statistics
- Emotion alert count
- Chat alert count
- Total alert tracking

## Environment

- Backend URL: `http://127.0.0.1:5000`
- API Key: `devkey`

To change, edit `src/App.jsx`:
```javascript
const BACKEND = 'http://your-backend-url'
const API_KEY = 'your-api-key'
```

## Access

### Local
- PC/Laptop: http://localhost:3001
- Phone (same network): http://192.168.x.x:3001

### Production
- Deploy to any static host (Vercel, Netlify, etc.)
- Update BACKEND URL for production server
