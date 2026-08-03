# Capacitor Mobile Setup — Age Calculator

This document explains **exactly** how this Next.js app was turned into a native Android (and optionally iOS) app using [Capacitor](https://capacitorjs.com/).

Capacitor wraps your **static web build** inside a native WebView shell. There is no rewrite of React/Next code into Kotlin/Swift — the same UI runs on phone, with access to native APIs (status bar, splash screen, keyboard, etc.).

---

## Prerequisites

| Tool | Why | Notes |
|------|-----|--------|
| **Node.js 18+** | Build the web app | Already used for Next.js |
| **Android Studio** | Build / run Android | [Download](https://developer.android.com/studio) — includes SDK + emulator |
| **JDK 17+** | Gradle / Android builds | Installed with Android Studio, or separately |
| **Xcode (macOS only)** | Build / run iOS | Not available on Windows |

> **You are on Windows** — Android works fully. iOS must be built on a Mac (or CI with macOS runners).

---

## Architecture (how it fits together)

```
┌─────────────────────────────────────────┐
│  Next.js app (app/, public/)            │
│  npm run build  →  static files in /out │
└──────────────────┬──────────────────────┘
                   │  npx cap sync
                   ▼
┌─────────────────────────────────────────┐
│  Capacitor copies /out into             │
│  android/app/src/main/assets/public     │
└──────────────────┬──────────────────────┘
                   │  Android Studio / Gradle
                   ▼
┌─────────────────────────────────────────┐
│  Native APK / AAB installed on device   │
│  WebView loads your Age Calculator UI   │
└─────────────────────────────────────────┘
```

**Key idea:** Capacitor needs a **folder of static HTML/CSS/JS**. Next.js App Router can produce that with `output: 'export'` (already configured in this project).

---

## Step-by-step: what was done in this repo

### Step 1 — Confirm Next.js static export

Capacitor cannot run a Node.js server on the phone. The app must be a static site.

In `next.config.mjs`:

```js
const nextConfig = {
  output: 'export',       // writes static files to /out
  trailingSlash: true,    // stable paths for file-based routing
  images: {
    unoptimized: true,    // next/image needs a server; disable for static/Capacitor
  },
};
```

This project already used `output: 'export'` for GitHub Pages (`npm run deploy`). Capacitor reuses the same `/out` folder.

### Step 2 — Install Capacitor packages

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npm install @capacitor/app @capacitor/status-bar @capacitor/splash-screen @capacitor/keyboard
```

| Package | Role |
|---------|------|
| `@capacitor/core` | JS bridge to native |
| `@capacitor/cli` | `npx cap` commands |
| `@capacitor/android` | Android native project |
| `@capacitor/ios` | iOS native project (add on Mac) |
| `@capacitor/app` | App lifecycle (back button, etc.) |
| `@capacitor/status-bar` | Status bar color/style |
| `@capacitor/splash-screen` | Launch splash |
| `@capacitor/keyboard` | Soft keyboard behavior |

### Step 3 — Create `capacitor.config.json`

Created at the project root:

```json
{
  "appId": "com.maxsivian.agecalculator",
  "appName": "Age Calculator",
  "webDir": "out",
  "server": {
    "androidScheme": "https"
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 1500,
      "launchAutoHide": true,
      "backgroundColor": "#000000",
      "showSpinner": false
    },
    "StatusBar": {
      "style": "DARK",
      "backgroundColor": "#000000"
    }
  }
}
```

- **`appId`** — unique reverse-DNS id (Play Store / App Store). Change if you publish under another org.
- **`appName`** — label under the home-screen icon.
- **`webDir`** — must match Next’s export folder (`out`).

Equivalent CLI (if starting from scratch without a config file):

```bash
npx cap init "Age Calculator" com.maxsivian.agecalculator --web-dir out
```

### Step 4 — Build the web app once

```bash
npm run build
```

This creates `/out` with `index.html` and assets. Capacitor will copy from here.

### Step 5 — Add the Android native project

```bash
npx cap add android
npx cap sync android
```

That generated the `android/` folder (Gradle project). Sync copies web assets + registers plugins.

### Step 6 — Native plugin bootstrap in React

Added `app/CapacitorInit.js` and mounted it from `app/layout.js`.

It:

1. Detects `Capacitor.isNativePlatform()` (skips browser/`npm run dev`)
2. Styles the status bar
3. Configures keyboard resize
4. Hides the splash screen when ready

Safe for web: if not native, it returns immediately.

### Step 7 — NPM scripts for daily workflow

In `package.json`:

| Script | What it does |
|--------|----------------|
| `npm run cap:sync` | Build Next → sync web assets into native projects |
| `npm run cap:android` | Build → sync Android → open Android Studio |
| `npm run cap:ios` | Build → sync iOS → open Xcode (macOS) |
| `npm run mobile` | Alias for `cap:android` |

### Step 8 — Git ignore native build junk

Updated `.gitignore` for Gradle caches, APKs, iOS Pods, etc. The `android/` source project itself **is committed** so teammates get a working native shell.

---

## How to run on Android (your machine)

### 1. Install Android Studio

1. Install [Android Studio](https://developer.android.com/studio).
2. Open it → **More Actions → SDK Manager**.
3. Install:
   - Android SDK Platform **34** or **35**
   - Android SDK Build-Tools
   - Android Emulator
4. **Tools → Device Manager** → create a virtual device (e.g. Pixel 7).

Or plug in a real phone with **USB debugging** enabled.

### 2. Build web + open Android Studio

From the project root:

```bash
npm run cap:android
```

Or manually:

```bash
npm run build
npx cap sync android
npx cap open android
```

### 3. Run from Android Studio

1. Wait for Gradle sync to finish.
2. Pick an emulator or USB device in the toolbar.
3. Click the green **Run** button.

The Age Calculator opens as a native app.

### 4. After any UI / JS change

Always rebuild and sync before expecting native to update:

```bash
npm run cap:sync
```

Then hit **Run** again in Android Studio (or use Apply Changes if only assets changed).

---

## How to add iOS (macOS only)

On a Mac with Xcode installed:

```bash
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

Then run on Simulator or a device from Xcode. CocoaPods may be required (`sudo gem install cocoapods` then `npx cap sync ios`).

---

## Live reload while developing (optional)

For faster mobile debugging, point Capacitor at your Next.js dev server instead of `/out`.

1. Find your PC’s LAN IP (e.g. `192.168.29.180` — you already use this in `npm run dev1`).
2. Temporarily add to `capacitor.config.json`:

```json
"server": {
  "androidScheme": "https",
  "url": "http://192.168.29.180:3000",
  "cleartext": true
}
```

3. Run `npm run dev1` and `npx cap sync android`, then Run in Android Studio.

**Remove `url` / `cleartext` before shipping** — production apps must load from bundled `/out` assets.

---

## Changing the app icon & splash

### App icon (Android)

Replace mipmaps under:

```
android/app/src/main/res/mipmap-*/
```

Or use Android Studio: right-click `res` → **New → Image Asset**.

You can start from `public/logo.png`.

### Splash screen

Configured in `capacitor.config.json` under `SplashScreen`. For a custom splash image, add drawable resources in Android and/or use [`@capacitor/assets`](https://github.com/ionic-team/capacitor-assets).

---

## Shipping to Google Play

1. In Android Studio: **Build → Generate Signed Bundle / APK**.
2. Choose **Android App Bundle (.aab)**.
3. Create / use a keystore (keep it private — never commit).
4. Upload the `.aab` in [Google Play Console](https://play.google.com/console).

Ensure `appId` (`com.maxsivian.agecalculator`) matches what you register in the console.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank white screen on device | Run `npm run build` then `npx cap sync`. Confirm `out/index.html` exists. |
| `webDir should not be empty` | Build failed or `out/` missing — fix Next build first. |
| Gradle / JDK errors | Install JDK 17; set `JAVA_HOME`; open project once in Android Studio. |
| Changes not showing | Forgot sync — always `npm run cap:sync` after web changes. |
| Network / CORS in live reload | Phone and PC must be on same Wi‑Fi; allow firewall for port 3000. |
| `next/image` broken | Keep `images.unoptimized: true` for static export. |

---

## File map (Capacitor-related)

```
age-calculator/
├── capacitor.config.json     # Capacitor app id, webDir, plugins
├── CAPACITOR.md              # This guide
├── next.config.mjs           # output: 'export' for static /out
├── app/
│   ├── CapacitorInit.js      # Native plugin setup (status bar, etc.)
│   └── layout.js             # Mounts CapacitorInit
├── out/                      # Static build (generated — not committed)
└── android/                  # Native Android project (Capacitor)
```

---

## Quick reference commands

```bash
# Web only (browser)
npm run dev

# Production static site
npm run build

# Sync into native projects after a build
npm run cap:sync

# One-shot: build + sync + open Android Studio
npm run cap:android

# Inspect Capacitor project health
npx cap doctor
```

---

## Summary

1. Next.js already exported statically to `out/`.
2. Capacitor packages + `capacitor.config.json` (`webDir: "out"`) were added.
3. `android/` native project was generated and synced.
4. `CapacitorInit` wires status bar / splash / keyboard on device only.
5. Use `npm run cap:android` after installing Android Studio to run the native app.

That is the full path from this Next.js repo to a mobile native wrapper via Capacitor.
