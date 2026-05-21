<div align="center">

# 🏗️ Vertical Constructions

### A Premium Construction Firm Management Platform

*Public-facing website. Real-time database. Entire CMS via Telegram.*

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Telegram Bot](https://img.shields.io/badge/Telegram_Bot-26A5E4?style=flat-square&logo=telegram&logoColor=white)](https://core.telegram.org/bots)

Developed by [@techxsarwar](https://github.com/techxsarwar)

</div>

---

## 📖 About

**Vertical Constructions** is a comprehensive full-stack solution built for a modern construction firm. It bridges a sleek, high-conversion frontend website with a powerful, fast backend — managed entirely from your **Telegram app**, with no traditional admin panel required.

### What it does

| Layer | Description |
|---|---|
| 🌐 **Public Website** | Displays ongoing projects, job openings, and services. Clients submit inquiries via a contact form. |
| 🤖 **Telegram CMS** | Admins manage all site content — projects, jobs, SEO tags, legal pages, fleet statuses, vendors — directly from Telegram. |
| ⚡ **Real-Time Backend** | FastAPI + SQLite delivers lightning-fast load times and instant content updates. |

---

## 🛠️ Tech Stack

### Frontend — `/site`

- **[React.js](https://react.dev/)** (Vite) — component-driven UI
- **[TypeScript](https://www.typescriptlang.org/)** — end-to-end type safety
- **[Tailwind CSS](https://tailwindcss.com/)** — responsive, luxury-themed styling

### Backend — `/backend`

- **[FastAPI](https://fastapi.tiangolo.com/)** — high-performance Python API framework
- **[SQLite3](https://www.sqlite.org/)** — lightweight, portable data storage
- **[python-telegram-bot](https://python-telegram-bot.org/)** — admin control panel via Telegram

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) `v18+`
- [Python](https://www.python.org/downloads/) `3.9+`
- [Git](https://git-scm.com/)

---

### 1️⃣ Backend Setup

**Clone the repository and navigate to the backend:**

```bash
git clone https://github.com/techxsarwar/Vertical-Constructions.git
cd Vertical-Constructions/backend
```

**Install Python dependencies:**

```bash
pip install -r requirements.txt
```

**Configure your environment — create a `.env` file in `/backend`:**

```env
# Telegram Admin Credentials
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_ADMIN_CHAT_ID=your_chat_id_here
```

> 💡 Get your bot token from [@BotFather](https://t.me/BotFather) on Telegram. Get your chat ID by messaging [@userinfobot](https://t.me/userinfobot).

**Start the backend server:**

```bash
python main.py
```

The server starts at `http://localhost:8000` and the SQLite database initializes automatically.

---

### 2️⃣ Frontend Setup

**Open a new terminal and navigate to the site directory:**

```bash
cd site
```

**Install dependencies:**

```bash
npm install
```

**Start the Vite development server:**

```bash
npm run dev
```

Open your browser at the local URL Vite provides — typically `http://localhost:5173`.

---

## 📱 Telegram Bot — Admin Panel

Once the backend is running, the Telegram bot is live. Navigate to your bot on Telegram and use the following controls:

| Command / Button | Action |
|---|---|
| `/start` · `/status` | Opens the main admin control panel |
| **Add Project** | Conversational flow to publish new construction projects — appears on site instantly |
| **Add Job** | Post new job listings to the careers page in real-time |
| **Edit Meta Title** | Update the site's SEO title live |
| **Edit Meta Desc** | Update the site's meta description live |
| **Maintenance Mode** | Toggle the site on/off with a single button tap |
| **Contact Inquiry** | Receive instant push notifications when a visitor submits the contact form |

---

## 📁 Project Structure

```
Vertical-Constructions/
├── site/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route pages
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
│
└── backend/                # FastAPI + Telegram Bot
    ├── main.py             # Entry point
    ├── requirements.txt
    ├── .env                # Your secrets (never commit this)
    └── ...
```

---

## 🔄 System Architecture

```
Visitor
  │
  ▼
React Site (Vite + TypeScript)
  │  ← REST API calls
  ▼
FastAPI Backend (Python)
  │  ← Read / Write
  ▼
SQLite Database
  ▲  ← Admin commands
  │
Telegram Bot ← Admin (You)
```

---

## 👨‍💻 Developer

<div align="center">

Built with ⚡ by **Sarwar**

[![GitHub](https://img.shields.io/badge/@techxsarwar-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/techxsarwar)

*Have a question or feature request? Open an [issue](https://github.com/techxsarwar/Vertical-Constructions/issues) — happy to help.*

</div>

---

<div align="center">
<sub>FastAPI · React · Telegram Bot · SQLite · TypeScript · Tailwind CSS</sub>
</div>
