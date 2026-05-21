<div align="center">
  <h1 align="center">🏗️ Vertical Constructions</h1>
  <p align="center">
    <strong>A Premium Construction Firm Management Dashboard & Website</strong>
    <br />
    Developed by <a href="https://github.com/techxsarwar">@techxsarwar</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
    <img src="https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram Bot" />
  </p>
</div>

---

## 📖 About the Project

**Vertical Constructions** is a comprehensive full-stack solution built for a modern construction firm. It bridges a sleek, high-conversion frontend website with a powerful, fast, and completely remote backend managed via a Telegram bot.

### What does it do?
- **Public Facing Website**: Displays ongoing projects, job openings, and services. Allows clients to reach out via a contact form.
- **Content Management via Telegram**: As an admin, you don't even need a web dashboard. You manage the entire site's content (jobs, projects, meta-tags, legal pages, fleet statuses, vendors) directly from your Telegram app.
- **Real-Time Database**: A lightweight FastAPI + SQLite backend ensures lightning-fast load times.

---

## 🛠️ The Tech Stack

### Frontend (`/site`)
- **React.js** (Vite)
- **TypeScript** for type safety
- **Tailwind CSS** for responsive, luxury-themed styling

### Backend (`/backend`)
- **FastAPI** (Python) for rapid API development
- **SQLite3** for lightweight, portable data storage
- **python-telegram-bot** for building the admin control panel

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v18+)
- [Python](https://www.python.org/downloads/) (3.9+)
- [Git](https://git-scm.com/)

### 1️⃣ Setting up the Backend

1. Clone the repository and navigate to the backend:
   ```bash
   git clone https://github.com/techxsarwar/Vertical-Constructions.git
   cd Vertical-Constructions/backend
   ```
2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up your environment variables. Create a `.env` file in the `backend` folder and add your Telegram bot credentials:
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_ADMIN_CHAT_ID=your_chat_id_here
   ```
4. Start the backend server:
   ```bash
   python main.py
   ```
   *The server will start on `http://localhost:8000` and the SQLite database will initialize automatically.*

### 2️⃣ Setting up the Frontend

1. Open a new terminal and navigate to the site directory:
   ```bash
   cd site
   ```
2. Install the Node modules:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

---

## 📱 How to Use the Telegram Bot

Once the backend is running, the Telegram bot is active. Open Telegram and navigate to your bot:

1. **Send `/start` or `/status`**: This pulls up the main control panel.
2. **Add Projects & Jobs**: Follow the interactive conversational flow to add new job listings or construction projects to the database. They will appear on the React frontend instantly.
3. **Manage Meta & SEO**: Click "Edit Meta Title" or "Edit Meta Desc" to update the site's SEO tags in real-time.
4. **Maintenance Mode**: Toggle the site into maintenance mode with a single button click.
5. **Receive Inquiries**: Whenever a user submits the Contact Form on the website, you will receive an instant push notification on Telegram!

---

## 👨‍💻 Developer

Developed by **Sarwar** ([@techxsarwar](https://github.com/techxsarwar)). 
Feel free to reach out or open an issue if you have any questions or feature requests!
