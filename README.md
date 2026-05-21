# 🏗️ Vertical Constructions

Welcome to the **Vertical Constructions** project! This repository contains both the public-facing website and the administrative backend (including a Telegram bot) for managing construction projects, jobs, fleet, vendors, and contact inquiries.

---

## 🌟 Key Features

### 🏢 Frontend Site
- **Modern UI**: Built with React and tailored for a premium construction aesthetic.
- **Dynamic Content**: Displays live projects, jobs, and services directly from the backend database.
- **Responsive Design**: Flawlessly adapts to desktop and mobile devices.

### ⚙️ Backend (FastAPI + SQLite)
- **Centralized Data**: A lightweight, fast API built with FastAPI that manages the SQLite database.
- **Data Entities**: Keeps track of Projects, Job Listings, Contact Messages, Fleet Status, Vendors, and Safety Logs.
- **Live Settings**: Allows for toggling a maintenance mode or a notice banner across the site in real-time.

### 🤖 Telegram Bot Integration
- **Admin Control Panel**: Real-time project administration straight from your Telegram app.
- **Instant Alerts**: Receive immediate notifications when a new contact inquiry is submitted.
- **Quick Actions**: Add jobs, add projects, update contact details, or view fleet & vendor statuses on the go!

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)

### Setup the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up environment variables by creating a `.env` file in the `backend` directory (ensure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ADMIN_CHAT_ID` are configured).
4. Run the server:
   ```bash
   python main.py
   ```
   *The server will start on `http://localhost:8000`.*

### Setup the Frontend Site
1. Navigate to the site directory:
   ```bash
   cd site
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🛠️ Tech Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: Python, FastAPI, SQLite
- **Bot**: Python Telegram Bot API

---

*Engineered for the future of construction.*
