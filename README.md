# 🤖 AI Chat App

A modern AI chat interface built with **React + Vite + Tailwind CSS**, powered by the **OpenAI API** with real-time streaming responses.

![npm](https://img.shields.io/npm/v/ai-chat-app) ![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss)

## ✨ Features

- **Streaming responses** — real-time token-by-token output via OpenAI SDK
- **Markdown rendering** — with syntax-highlighted code blocks
- **Multi-conversation sidebar** — create, switch, and delete conversations
- **Model selector** — switch between GPT-4o, GPT-4o mini, GPT-4 Turbo, and GPT-3.5 Turbo
- **Dark mode** — system-aware with manual toggle
- **Persistent storage** — conversations saved to localStorage via Zustand
- **Secure key handling** — API key stored only in your browser, never on any server

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

### 3. Add your OpenAI API key

Open the app in your browser, click **Settings & API Key** in the sidebar, and paste your key from [platform.openai.com](https://platform.openai.com/api-keys).

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| TypeScript | Type safety |
| Tailwind CSS 3 | Styling |
| OpenAI SDK | AI streaming API |
| Zustand | State management |
| react-markdown | Markdown + code rendering |
| lucide-react | Icons |

## 📁 Project Structure

```
src/
├── components/
│   ├── ChatMessage.tsx    # Message bubble with markdown rendering
│   ├── ChatInput.tsx      # Auto-resizing input with suggestions
│   ├── ChatWindow.tsx     # Main chat area + streaming logic
│   ├── Sidebar.tsx        # Conversation list + navigation
│   └── SettingsModal.tsx  # API key configuration
├── stores/
│   └── chatStore.ts       # Zustand state (conversations, settings)
├── lib/
│   └── openai.ts          # OpenAI streaming wrapper
├── types/
│   └── index.ts           # TypeScript interfaces & model definitions
├── App.tsx                # Root layout + dark mode
└── main.tsx               # Entry point
```

## 🔑 API Key Note

Your API key is stored locally in your browser (`localStorage`) and is only ever sent directly to the OpenAI API — it never touches any intermediary server.

## 📦 npm Release

Install from npm:

```bash
npm install ai-chat-app
```

View the published package on npm: https://www.npmjs.com/package/ai-chat-app

## 📦 Build for Production

```bash
npm run build
```

Output goes to `dist/` — ready to deploy on Vercel, Netlify, or any static host.
