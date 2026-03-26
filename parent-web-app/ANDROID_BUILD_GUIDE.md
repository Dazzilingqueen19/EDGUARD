# EDGUARD Parent Alerts - Android App Setup Guide

## ✅ What's Done
- Capacitor configured for Android
- Native Android project structure created
- Web app built and ready

## 📱 Building the Android App

You have **2 main options:**

### **Option A: Using EAS Build (Recommended - No Local Setup)**

This is the **easiest** - no Android Studio needed!

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo (create free account at expo.dev):**
   ```bash
   eas login
   ```

3. **Build for Android (cloud-based):**
   ```bash
   cd c:\Users\santhya\OneDrive\Desktop\edguard_realtime_full\parent-web-app
   eas build --platform android --local
   ```

4. **Get the APK:**
   - Download from EAS dashboard
   - Install on any Android device
   - Done! 🎉

---

### **Option B: Using Android Studio (Local Development)**

This gives you **full control** but requires more setup.

1. **Download Android Studio:**
   - https://developer.android.com/studio
   - Install it

2. **Open in Android Studio:**
   ```bash
   cd c:\Users\santhya\OneDrive\Desktop\edguard_realtime_full\parent-web-app
   npx cap open android
   ```
   (This opens Android Studio automatically)

3. **Build & Run:**
   - Click "Build" → "Build Bundle/APK"
   - Connect Android device via USB
   - Click "Run" to install on device

---

## 🔄 Update Workflow

After code changes:

```bash
# This rebuilds web, copies to Android, and syncs
npm run cap:sync

# Then rebuild APK in Android Studio or EAS
```

---

## 📦 Ready Commands

```bash
npm run build              # Build web app only
npm run cap:sync           # Sync code to Android project
npm run cap:build:android  # Build for Android (requires Android Studio locally)
npm run cap:open:android   # Open Android project in Android Studio
```

---

## ✨ Next Steps

Would you like me to:
1. **Set up EAS Build** (quickest way to get APK)?
2. **Create a CI/CD pipeline** to auto-build APKs on every code push?
3. **Add PWA features** so it also works offline in browser?

Let me know which you'd prefer! 📱
