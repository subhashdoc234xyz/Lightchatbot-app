# 💡 Light — AI Chatbot

A clean, responsive, and ultra-fast AI chatbot powered by the **Groq API**. Built with a single cross-platform codebase (**React + Vite + Tailwind CSS**) and packaged for:
- 🪟 **Windows Desktop App** (`.exe`) via **Electron**
- 📱 **Android App** (`.apk`) via **Capacitor**

---

## ⚡ Features

- **Blazing Fast**: Powered by Groq's high-speed inference engine (`llama-3.3-70b-versatile`).
- **Word-by-Word Streaming**: Real-time token streaming using native Web fetch.
- **Cross-Platform**: Run the same codebase on your PC as an installable Windows desktop app or on your phone as an Android APK.
- **In-App Settings**: Easily configure your free Groq API key and choose from multiple models right inside the app.
- **Persistent History**: Keeps your chat saved locally across sessions.
- **Markdown & Code Highlight**: Clean rendering of formatted text, bullet points, and code blocks.

---

## 🔑 Getting a Free Groq API Key

1. Sign up for free at [console.groq.com](https://console.groq.com).
2. Go to [API Keys](https://console.groq.com/keys) and click **Create API Key**.
3. Copy your key (starts with `gsk_...`).
4. You can either:
   - Add it in `.env` as `VITE_GROQ_API_KEY=gsk_...` for development, OR
   - Open the app, click the **Settings gear icon (⚙️)** in the top right, and paste your key.

> ⚠️ **Security Warning**: Never share your private `.env` file or commit it to GitHub. When distributing the `.exe` or `.apk` to friends or the public, build without embedding your personal key. Each user can easily enter their own free key in the in-app Settings.

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```
Add your key inside `.env` (optional, since you can also input it inside the app UI).

### 3. Run in browser (Development)
```bash
npm run dev
```

---

## 🪟 Windows Desktop App (Electron)

### Run and test locally:
```bash
npm run electron
```

### Build the `.exe` installer:
```bash
npm run dist:win
```
Once complete, your installable setup file (`Light Setup 1.0.0.exe`) will be in the **`release/`** folder.

---

## 📱 Android APK (Capacitor)

### 1. Build the web app
```bash
npm run build
```

### 2. Add Android platform (First time only)
```bash
npx cap add android
```

### 3. Sync changes into Android
```bash
npx cap sync
```

### 4. Open in Android Studio
```bash
npx cap open android
```

### 5. Build the APK
1. In Android Studio, go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
2. Once built, find your shareable debug APK at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```
3. Transfer this `.apk` to any Android device and tap to install!

---

## 📁 Project Structure

```
light-chatbot/
├── electron/
│   └── main.js             # Electron main process
├── src/
│   ├── components/
│   │   ├── ChatWindow.jsx   # Header, message container, empty state
│   │   ├── MessageBubble.jsx# Bubble styling with markdown support
│   │   ├── ChatInput.jsx    # Text input with enter-to-send and stop
│   │   └── SettingsModal.jsx# In-app API key and model selector
│   ├── services/
│   │   └── groq.js          # Groq streaming fetch service
│   ├── App.jsx              # Main state & chat orchestrator
│   ├── main.jsx             # React entry
│   └── index.css            # Tailwind CSS styling
├── .env.example             # Safe environment template
├── .gitignore               # Ignores .env, node_modules, builds & APKs
├── capacitor.config.json    # Capacitor configuration
├── vite.config.js           # Vite configuration with relative base './'
└── package.json             # Scripts & dependencies
```

---

## 📄 License
MIT License
