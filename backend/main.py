import os
import uuid
import asyncio
from datetime import datetime
from contextlib import asynccontextmanager
from typing import Optional, Union

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load database helper functions
from database import (
    init_db,
    get_all_projects, add_project, delete_project,
    get_all_jobs, add_job, delete_job,
    get_all_messages, add_message, delete_message, clear_messages,
    get_all_settings, update_setting,
    get_all_fleet, get_all_vendors, get_all_safety_logs
)

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_ADMIN_CHAT_ID = os.getenv("TELEGRAM_ADMIN_CHAT_ID")

# --- Telegram Bot Commands & Lifecycle ---
# Import telegram libraries only inside bot functions to prevent startup crashes if not installed
bot_running = False

async def send_telegram_notification(bot, text: str):
    if bot and TELEGRAM_ADMIN_CHAT_ID:
        try:
            await bot.send_message(chat_id=TELEGRAM_ADMIN_CHAT_ID, text=text, parse_mode="Markdown")
        except Exception as e:
            print(f"Error sending Telegram notification: {e}")

if TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID:
    try:
        from telegram import Update
        from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

        # Command: /start
        async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if str(update.effective_chat.id) != str(TELEGRAM_ADMIN_CHAT_ID):
                await update.message.reply_text("⛔ Unauthorized. Access denied.")
                return
            
            help_text = (
                "🏗️ **Vertical Constructions Bot Controls**\n\n"
                "Here are the available commands:\n"
                "• `/status` - Current site status and notices\n"
                "• `/maintenance <on|off>` - Toggle website maintenance mode\n"
                "• `/notice <message>` - Set marquee banner notice (empty to clear)\n"
                "• `/addproject Title | Category | [Image URL]` - Publish a featured project\n"
                "• `/addjob Title | Department | Location | Type` - Publish a job listing\n"
                "• `/messages` - View last 5 contact inquiries\n"
                "• `/clearmessages` - Clear all inquiries from database"
            )
            await update.message.reply_text(help_text, parse_mode="Markdown")

        # Command: /status
        async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if str(update.effective_chat.id) != str(TELEGRAM_ADMIN_CHAT_ID):
                return
            settings = get_all_settings()
            projects = get_all_projects()
            jobs = get_all_jobs()
            messages = get_all_messages()
            
            m_mode = "🔴 ON (Maintenance Screen Active)" if settings.get("maintenanceMode") else "🟢 OFF (Public Site Live)"
            notice = settings.get("siteNotice") or "*None*"
            
            text = (
                f"📊 **Vertical Constructions Live Status**\n\n"
                f"• **Maintenance Mode**: {m_mode}\n"
                f"• **Notice Banner**: {notice}\n"
                f"• **Contact Email**: `{settings.get('contactEmail')}`\n"
                f"• **Contact Phone**: `{settings.get('contactPhone')}`\n\n"
                f"📈 **Database Stats**:\n"
                f"• Total Projects: {len(projects)}\n"
                f"• Total Active Jobs: {len(jobs)}\n"
                f"• Pending Inquiries: {len(messages)}"
            )
            await update.message.reply_text(text, parse_mode="Markdown")

        # Command: /maintenance <on|off>
        async def maintenance_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if str(update.effective_chat.id) != str(TELEGRAM_ADMIN_CHAT_ID):
                return
            
            args = context.args
            if not args or args[0].lower() not in ["on", "off"]:
                await update.message.reply_text("⚠️ Usage: `/maintenance on` or `/maintenance off`")
                return
                
            is_on = args[0].lower() == "on"
            update_setting("maintenanceMode", is_on)
            
            status_str = "ENABLED (Site is now showing maintenance screen)" if is_on else "DISABLED (Site is now live)"
            await update.message.reply_text(f"✅ Maintenance Mode has been **{status_str}**.")

        # Command: /notice <message>
        async def notice_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if str(update.effective_chat.id) != str(TELEGRAM_ADMIN_CHAT_ID):
                return
            
            notice_text = " ".join(context.args).strip()
            update_setting("siteNotice", notice_text)
            
            if notice_text:
                await update.message.reply_text(f"✅ Notice banner set to:\n\"{notice_text}\"")
            else:
                await update.message.reply_text("✅ Notice banner cleared.")

        # Command: /addproject Title | Category | [Image URL]
        async def addproject_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if str(update.effective_chat.id) != str(TELEGRAM_ADMIN_CHAT_ID):
                return
            
            raw_args = " ".join(context.args)
            if not raw_args:
                await update.message.reply_text("⚠️ Usage: `/addproject Title | Category | [Image URL]`")
                return
                
            parts = [p.strip() for p in raw_args.split("|")]
            if len(parts) < 2:
                await update.message.reply_text("⚠️ Error: Must provide at least Title and Category separated by a vertical bar (`|`).")
                return
                
            title = parts[0]
            category = parts[1]
            image_url = parts[2] if len(parts) > 2 and parts[2] else "https://lh3.googleusercontent.com/aida-public/AB6AXuBZSt8DyOiyuc3D0YvzOV9Jdv6p3zqa1c41iPnk0Ifax5pnO8pm20-EXQPJfcwJFQnfT2xPv9OtSS-3bPjpE9OcTYPJvwt7azVCzNeiI1xnESPKX9SOccKQbjZ4zNvjuWGnEFijdVqZLORetO7QXnzBxfJWm2Qyvyk0PMno0Fxb1XrWG_JkB4s8pAeN6Utx3R9zlEqhDLKQAbACyu9J_wQj6IIowCdT7nnSOfN5JJFswidCpbudUKNSDzlIpoxPTb5Eb3G_EKMGBvA"
            
            p_id = f"project-{int(asyncio.get_event_loop().time())}"
            add_project(p_id, title, category, image_url, span="small")
            await update.message.reply_text(f"✅ Project **{title}** added successfully under **{category}**!")

        # Command: /addjob Title | Department | Location | Type
        async def addjob_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if str(update.effective_chat.id) != str(TELEGRAM_ADMIN_CHAT_ID):
                return
                
            raw_args = " ".join(context.args)
            if not raw_args:
                await update.message.reply_text("⚠️ Usage: `/addjob Title | Department | Location | Type`")
                return
                
            parts = [p.strip() for p in raw_args.split("|")]
            if len(parts) < 4:
                await update.message.reply_text("⚠️ Error: Must provide Title, Department, Location, and Type separated by `|`.")
                return
                
            title, dept, loc, j_type = parts[0], parts[1], parts[2], parts[3]
            add_job(title, dept, loc, j_type)
            await update.message.reply_text(f"✅ Job listing for **{title}** ({dept}) has been published!")

        # Command: /messages
        async def messages_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if str(update.effective_chat.id) != str(TELEGRAM_ADMIN_CHAT_ID):
                return
                
            inquiries = get_all_messages()
            if not inquiries:
                await update.message.reply_text("📬 No pending inquiries in the database.")
                return
                
            latest = inquiries[:5]
            reply = "📬 **Latest 5 Contact Inquiries:**\n\n"
            for i, m in enumerate(latest):
                reply += f"🔹 **#{m['id']} - {m['name']}** ({m['date']})\n"
                reply += f"📧 `{m['email']}`\n"
                reply += f"💬 *{m['message']}*\n\n"
                
            if len(inquiries) > 5:
                reply += f"_(And {len(inquiries) - 5} more inquiries in database)_"
                
            await update.message.reply_text(reply, parse_mode="Markdown")

        # Command: /clearmessages
        async def clearmessages_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if str(update.effective_chat.id) != str(TELEGRAM_ADMIN_CHAT_ID):
                return
                
            clear_messages()
            await update.message.reply_text("✅ All contact inquiries cleared from the database.")

    except ImportError:
        print("python-telegram-bot package is not loaded yet.")

# --- FastAPI Lifespan Handler ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Initialize SQLite Database tables & seed mock data if empty
    init_db()
    print("SQLite database initialized successfully.")

    # 2. Run Telegram Bot
    bot_app = None
    if TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID:
        try:
            bot_app = ApplicationBuilder().token(TELEGRAM_BOT_TOKEN).build()
            
            # Add command handlers
            bot_app.add_handler(CommandHandler("start", start_command))
            bot_app.add_handler(CommandHandler("status", status_command))
            bot_app.add_handler(CommandHandler("maintenance", maintenance_command))
            bot_app.add_handler(CommandHandler("notice", notice_command))
            bot_app.add_handler(CommandHandler("addproject", addproject_command))
            bot_app.add_handler(CommandHandler("addjob", addjob_command))
            bot_app.add_handler(CommandHandler("messages", messages_command))
            bot_app.add_handler(CommandHandler("clearmessages", clearmessages_command))
            
            await bot_app.initialize()
            await bot_app.updater.start_polling()
            await bot_app.start()
            
            app.state.bot_app = bot_app
            app.state.bot = bot_app.bot
            
            # Send notification on boot
            await send_telegram_notification(
                bot_app.bot, 
                "🚀 **Vertical Constructions Server & Bot Online!**\nType /start to manage the site."
            )
            print("Telegram Bot successfully registered and polling.")
        except Exception as e:
            print(f"Error starting Telegram Bot: {e}")
    else:
        print("Telegram bot variables missing in .env. Running without Telegram controls.")

    yield

    # Shutdown
    if bot_app:
        try:
            await bot_app.updater.stop()
            await bot_app.stop()
            await bot_app.shutdown()
            print("Telegram Bot shut down successfully.")
        except Exception as e:
            print(f"Error during Telegram Bot shutdown: {e}")


app = FastAPI(
    title="Vertical Constructions Core API", 
    description="Centralized backend for VC Operations with Telegram Bot integrations",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- FastAPI Schemes ---
class ProjectCreate(BaseModel):
    id: Optional[str] = None
    title: str
    category: str
    image: Optional[str] = None
    span: Optional[str] = "small"
    icon: Optional[str] = None
    badge: Optional[str] = None

class JobCreate(BaseModel):
    title: str
    department: str
    location: str
    type: str

class MessageCreate(BaseModel):
    name: str
    email: str
    message: str

class SettingUpdate(BaseModel):
    key: str
    value: Union[bool, str]

# --- API Endpoints ---
@app.get("/")
def health_check():
    settings = get_all_settings()
    return {
        "status": "VC Central Server Online", 
        "version": "1.1.0",
        "maintenance_mode": settings.get("maintenanceMode", False),
        "telegram_bot_active": hasattr(app.state, "bot")
    }

# --- Projects ---
@app.get("/api/projects")
def api_get_projects():
    return get_all_projects()

@app.post("/api/projects")
def api_add_project(project: ProjectCreate):
    p_id = project.id or f"project-{uuid.uuid4().hex[:8]}"
    try:
        add_project(p_id, project.title, project.category, project.image, project.span, project.icon, project.badge)
        return {"status": "success", "id": p_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/projects/{project_id}")
def api_delete_project(project_id: str):
    delete_project(project_id)
    return {"status": "success"}

# --- Jobs ---
@app.get("/api/jobs")
def api_get_jobs():
    return get_all_jobs()

@app.post("/api/jobs")
def api_add_job(job: JobCreate):
    try:
        j_id = add_job(job.title, job.department, job.location, job.type)
        return {"status": "success", "id": j_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/jobs/{job_id}")
def api_delete_job(job_id: int):
    delete_job(job_id)
    return {"status": "success"}

# --- Messages ---
@app.get("/api/messages")
def api_get_messages():
    return get_all_messages()

@app.post("/api/messages")
async def api_add_message(msg: MessageCreate):
    date_str = datetime.now().isoformat()
    try:
        m_id = add_message(msg.name, msg.email, msg.message, date_str)
        
        # Real-time Telegram notification to admin
        if hasattr(app.state, "bot"):
            alert_text = (
                f"🔔 **New Contact Inquiry!**\n\n"
                f"• **Name**: {msg.name}\n"
                f"• **Email**: {msg.email}\n"
                f"• **Message**:\n{msg.message}"
            )
            await send_telegram_notification(app.state.bot, alert_text)
            
        return {"status": "success", "id": m_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/messages/{message_id}")
def api_delete_message(message_id: int):
    delete_message(message_id)
    return {"status": "success"}

# --- Settings ---
@app.get("/api/settings")
def api_get_settings():
    return get_all_settings()

@app.put("/api/settings")
def api_update_settings(payload: SettingUpdate):
    try:
        update_setting(payload.key, payload.value)
        return {"status": "success", "key": payload.key, "value": payload.value}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Additional Read-Only APIs (Fleet, Vendors, Safety) ---
@app.get("/api/fleet")
def api_get_fleet():
    return get_all_fleet()

@app.get("/api/vendors")
def api_get_vendors():
    return get_all_vendors()

@app.get("/api/safety")
def api_get_safety():
    return get_all_safety_logs()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
