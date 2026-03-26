# EDGUARD Parent Alerts - PWA Setup Guide

## ✅ What's Installed

- ✅ Service Worker for offline support
- ✅ Web App Manifest for installation
- ✅ Auto-caching for fast load times
- ✅ Installable on home screen (Android & iOS)

---

## 📱 How to Install on Mobile

### **Android:**
1. Open **Chrome** on your Android phone
2. Go to: `http://YOUR_SERVER_IP:3001`
3. Tap the **menu (⋮)** in top right
4. Tap **"Install app"** or **"Add to Home Screen"**
5. Done! App appears on home screen 🎉

### **iOS (Safari):**
1. Open **Safari** on your iPhone/iPad
2. Go to: `http://YOUR_SERVER_IP:3001`
3. Tap the **Share button** (⬆️ box)
4. Scroll down, tap **"Add to Home Screen"**
5. Done! App appears on home screen 🎉

---

## 🚫 Works Offline

After first load:
- ✅ App data is cached
- ✅ Works without internet
- ✅ Auto-updates when online

---

## 🔄 Update Workflow

When you make code changes:

```bash
cd parent-web-app
npm run build
# Deployed app auto-refreshes on next visit
```

---

## 🌐 Access Points

**Web Browser:**
```
http://localhost:3001         # Development
http://YOUR_IP:3001          # From another device
```

**Installed App:**
- Shows as regular app icon on home screen
- Works offline with cached data
- Auto-syncs when online

---

## 📊 Service Worker Features

- **Network First:** Uses network if available
- **Cache Fallback:** Uses cached data if offline
- **Auto-Update:** New code loads on next visit
- **Smart Caching:** Caches successful requests

---

## ✨ Advantages Over Native App

✅ Same user experience  
✅ No app store needed  
✅ Fast updates (just deploy web)  
✅ Works cross-platform (Android, iOS, web)  
✅ Much smaller size (~2MB vs 50MB+ native)

---

## 🆘 Troubleshooting

**Install option not showing?**
- Try Chrome/Firefox (not all browsers support it)
- Visit on HTTPS or localhost
- Check manifest.json is loading (DevTools → Application → Manifest)

**Still loading old version?**
- Clear browser cache (Ctrl+Shift+Del)
- Uninstall and reinstall app

**Service Worker errors?**
- Check DevTools → Application → Service Workers
- Should show "activated and running"

---

## 🚀 You're All Set!

Your parent-web-app is now:
- 📱 Installable on mobile
- 🚫 Works offline
- ⚡ Super fast
- 🔄 Auto-updates

Start the dev server and try installing it! 🎉
