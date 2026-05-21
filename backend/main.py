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
bot_running = False

# Conversation States
(
    ADD_PROJECT_TITLE,
    ADD_PROJECT_CATEGORY,
    ADD_PROJECT_IMAGE,
    ADD_JOB_TITLE,
    ADD_JOB_DEPARTMENT,
    ADD_JOB_LOCATION,
    ADD_JOB_TYPE,
    SET_NOTICE_TEXT,
    SET_CONTACT_PHONE,
    SET_CONTACT_EMAIL,
    SET_PRIVACY,
    SET_TERMS,
    SET_META_TITLE,
    SET_META_DESC
) = range(14)

def is_admin(chat_id: int) -> bool:
    return str(chat_id) == str(TELEGRAM_ADMIN_CHAT_ID)

async def send_telegram_notification(bot, text: str):
    if bot and TELEGRAM_ADMIN_CHAT_ID:
        try:
            await bot.send_message(chat_id=TELEGRAM_ADMIN_CHAT_ID, text=text, parse_mode="Markdown")
        except Exception as e:
            print(f"Error sending Telegram notification: {e}")

if TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID:
    try:
        from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
        from telegram.ext import (
            ApplicationBuilder,
            CommandHandler,
            ContextTypes,
            CallbackQueryHandler,
            ConversationHandler,
            MessageHandler,
            filters
        )

        def get_admin_keyboard(settings):
            m_mode = settings.get("maintenanceMode")
            maintenance_btn_text = "🟢 Disable Maintenance" if m_mode else "🔴 Enable Maintenance"
            
            keyboard = [
                [
                    InlineKeyboardButton(maintenance_btn_text, callback_data="toggle_maintenance"),
                    InlineKeyboardButton("📝 Notice Banner", callback_data="start_notice_flow"),
                ],
                [
                    InlineKeyboardButton("🏗️ Add Project", callback_data="start_project_flow"),
                    InlineKeyboardButton("💼 Add Job", callback_data="start_job_flow"),
                ],
                [
                    InlineKeyboardButton("📞 Update Phone", callback_data="start_phone_flow"),
                    InlineKeyboardButton("✉️ Update Email", callback_data="start_email_flow"),
                ],
                [
                    InlineKeyboardButton("🚚 View Fleet", callback_data="view_fleet"),
                    InlineKeyboardButton("👷 View Vendors", callback_data="view_vendors"),
                ],
                [
                    InlineKeyboardButton("📬 View Inquiries", callback_data="view_messages"),
                    InlineKeyboardButton("🗑️ Clear Inquiries", callback_data="confirm_clear_messages"),
                ],
                [
                    InlineKeyboardButton("✍️ Edit Privacy", callback_data="start_privacy_flow"),
                    InlineKeyboardButton("✍️ Edit Terms", callback_data="start_terms_flow"),
                ],
                [
                    InlineKeyboardButton("🌐 Edit Meta Title", callback_data="start_meta_title_flow"),
                    InlineKeyboardButton("🌐 Edit Meta Desc", callback_data="start_meta_desc_flow"),
                ],
                [
                    InlineKeyboardButton("🔄 Refresh Dashboard", callback_data="refresh_status"),
                ]
            ]
            return InlineKeyboardMarkup(keyboard)

        async def send_status_message(update: Optional[Update], context: ContextTypes.DEFAULT_TYPE, query=None):
            settings = get_all_settings()
            projects = get_all_projects()
            jobs = get_all_jobs()
            messages = get_all_messages()
            
            m_mode_str = "🔴 ON (Maintenance Screen Active)" if settings.get("maintenanceMode") else "🟢 OFF (Public Site Live)"
            notice_str = settings.get("siteNotice") or "*None*"
            
            text = (
                f"🏗️ **Vertical Constructions Control Panel**\n\n"
                f"📊 **Current Live Status**:\n"
                f"• **Maintenance Mode**: {m_mode_str}\n"
                f"• **Notice Banner**: {notice_str}\n"
                f"• **Contact Email**: `{settings.get('contactEmail')}`\n"
                f"• **Contact Phone**: `{settings.get('contactPhone')}`\n\n"
                f"📈 **Database Stats**:\n"
                f"• Total Projects: {len(projects)}\n"
                f"• Total Active Jobs: {len(jobs)}\n"
                f"• Pending Inquiries: {len(messages)}\n\n"
                f"👇 *Use the buttons below to manage the site:*"
            )
            
            reply_markup = get_admin_keyboard(settings)
            
            if query:
                await query.edit_message_text(text, parse_mode="Markdown", reply_markup=reply_markup)
            elif update:
                await update.message.reply_text(text, parse_mode="Markdown", reply_markup=reply_markup)

        async def send_status_message_direct(bot):
            settings = get_all_settings()
            projects = get_all_projects()
            jobs = get_all_jobs()
            messages = get_all_messages()
            m_mode_str = "🔴 ON (Maintenance Screen Active)" if settings.get("maintenanceMode") else "🟢 OFF (Public Site Live)"
            notice_str = settings.get("siteNotice") or "*None*"
            
            text = (
                f"🏗️ **Vertical Constructions Control Panel**\n\n"
                f"📊 **Current Live Status**:\n"
                f"• **Maintenance Mode**: {m_mode_str}\n"
                f"• **Notice Banner**: {notice_str}\n"
                f"• **Contact Email**: `{settings.get('contactEmail')}`\n"
                f"• **Contact Phone**: `{settings.get('contactPhone')}`\n\n"
                f"📈 **Database Stats**:\n"
                f"• Total Projects: {len(projects)}\n"
                f"• Total Active Jobs: {len(jobs)}\n"
                f"• Pending Inquiries: {len(messages)}\n\n"
                f"👇 *Use the buttons below to manage the site:*"
            )
            reply_markup = get_admin_keyboard(settings)
            try:
                await bot.send_message(chat_id=TELEGRAM_ADMIN_CHAT_ID, text=text, parse_mode="Markdown", reply_markup=reply_markup)
            except Exception as e:
                print(f"Error sending direct status message: {e}")

        # Command Handlers
        async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if not is_admin(update.effective_chat.id):
                await update.message.reply_text("⛔ Unauthorized. Access denied.")
                return
            await send_status_message(update, context)

        async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if not is_admin(update.effective_chat.id):
                return
            await send_status_message(update, context)

        # Callback Query Handler for static buttons
        async def button_callback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
            query = update.callback_query
            if not is_admin(query.message.chat.id):
                await query.answer("⛔ Unauthorized.", show_alert=True)
                return
                
            await query.answer()
            data = query.data
            
            if data == "toggle_maintenance":
                settings = get_all_settings()
                new_mode = not settings.get("maintenanceMode", False)
                update_setting("maintenanceMode", new_mode)
                await send_status_message(None, context, query=query)
                
            elif data == "refresh_status":
                await send_status_message(None, context, query=query)
                
            elif data == "view_messages":
                inquiries = get_all_messages()
                if not inquiries:
                    keyboard = [[InlineKeyboardButton("🔙 Back to Menu", callback_data="refresh_status")]]
                    await query.edit_message_text("📬 No pending inquiries in the database.", reply_markup=InlineKeyboardMarkup(keyboard))
                    return
                    
                latest = inquiries[:5]
                reply = "📬 **Latest 5 Contact Inquiries:**\n\n"
                for m in latest:
                    reply += f"🔹 **#{m['id']} - {m['name']}** ({m['date']})\n"
                    reply += f"📧 `{m['email']}`\n"
                    reply += f"💬 *{m['message']}*\n\n"
                    
                if len(inquiries) > 5:
                    reply += f"_(And {len(inquiries) - 5} more inquiries in database)_\n\n"
                    
                keyboard = [
                    [InlineKeyboardButton("🗑️ Clear Inquiries", callback_data="confirm_clear_messages")],
                    [InlineKeyboardButton("🔙 Back to Menu", callback_data="refresh_status")]
                ]
                await query.edit_message_text(reply, parse_mode="Markdown", reply_markup=InlineKeyboardMarkup(keyboard))
                
            elif data == "confirm_clear_messages":
                keyboard = [
                    [
                        InlineKeyboardButton("🗑️ Yes, Clear All", callback_data="execute_clear_messages"),
                        InlineKeyboardButton("❌ No, Cancel", callback_data="refresh_status")
                    ]
                ]
                await query.edit_message_text("⚠️ Are you sure you want to clear ALL contact inquiries from the database? This cannot be undone.", reply_markup=InlineKeyboardMarkup(keyboard))
                
            elif data == "execute_clear_messages":
                clear_messages()
                keyboard = [[InlineKeyboardButton("🔙 Back to Menu", callback_data="refresh_status")]]
                await query.edit_message_text("✅ All contact inquiries cleared from the database.", reply_markup=InlineKeyboardMarkup(keyboard))
                
            elif data == "view_fleet":
                fleet = get_all_fleet()
                if not fleet:
                    keyboard = [[InlineKeyboardButton("🔙 Back to Menu", callback_data="refresh_status")]]
                    await query.edit_message_text("🚚 No fleet data found.", reply_markup=InlineKeyboardMarkup(keyboard))
                    return
                
                reply = "🚚 **Fleet Status:**\n\n"
                for f in fleet[:10]:
                    reply += f"🔹 **{f['name']}** ({f['type']})\n"
                    reply += f"   Status: {f['status']} | Loc: {f['location']}\n\n"
                
                keyboard = [[InlineKeyboardButton("🔙 Back to Menu", callback_data="refresh_status")]]
                await query.edit_message_text(reply, parse_mode="Markdown", reply_markup=InlineKeyboardMarkup(keyboard))

            elif data == "view_vendors":
                vendors = get_all_vendors()
                if not vendors:
                    keyboard = [[InlineKeyboardButton("🔙 Back to Menu", callback_data="refresh_status")]]
                    await query.edit_message_text("👷 No vendor data found.", reply_markup=InlineKeyboardMarkup(keyboard))
                    return
                
                reply = "👷 **Vendors:**\n\n"
                for v in vendors[:10]:
                    reply += f"🔹 **{v['name']}**\n"
                    reply += f"   Status: {v['status']} | Rating: {v['rating']}\n\n"
                
                keyboard = [[InlineKeyboardButton("🔙 Back to Menu", callback_data="refresh_status")]]
                await query.edit_message_text(reply, parse_mode="Markdown", reply_markup=InlineKeyboardMarkup(keyboard))

        # --- Project Creation Wizard Handler ---
        async def start_project_flow(update: Update, context: ContextTypes.DEFAULT_TYPE):
            query = update.callback_query
            chat_id = query.message.chat.id if query else update.effective_chat.id
            if not is_admin(chat_id):
                if query:
                    await query.answer("⛔ Unauthorized.", show_alert=True)
                return ConversationHandler.END
                
            keyboard = [[InlineKeyboardButton("❌ Cancel", callback_data="cancel_flow")]]
            if query:
                await query.answer()
                await query.edit_message_text(
                    "🏗️ **Add Project Wizard**\n\nPlease enter the **Title** of the new project (or type /cancel):",
                    reply_markup=InlineKeyboardMarkup(keyboard)
                )
            else:
                await update.message.reply_text(
                    "🏗️ **Add Project Wizard**\n\nPlease enter the **Title** of the new project (or type /cancel):",
                    reply_markup=InlineKeyboardMarkup(keyboard)
                )
                
            return ADD_PROJECT_TITLE

        async def add_project_title(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if not is_admin(update.effective_chat.id):
                return ConversationHandler.END
                
            context.user_data['new_project_title'] = update.message.text
            keyboard = [[InlineKeyboardButton("❌ Cancel", callback_data="cancel_flow")]]
            await update.message.reply_text(
                f"Title saved: **{update.message.text}**\n\nNow, enter the **Category** description (e.g. `Commercial • 85 Stories`, `Residential • Luxury`):",
                parse_mode="Markdown",
                reply_markup=InlineKeyboardMarkup(keyboard)
            )
            return ADD_PROJECT_CATEGORY

        async def add_project_category(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if not is_admin(update.effective_chat.id):
                return ConversationHandler.END
                
            context.user_data['new_project_category'] = update.message.text
            keyboard = [
                [InlineKeyboardButton("🖼️ Skip & Use Default Image", callback_data="skip_project_image")],
                [InlineKeyboardButton("❌ Cancel", callback_data="cancel_flow")]
            ]
            await update.message.reply_text(
                f"Category saved: **{update.message.text}**\n\nFinally, send me the **Image URL** for the project, or click the button below to skip and use the default image:",
                parse_mode="Markdown",
                reply_markup=InlineKeyboardMarkup(keyboard)
            )
            return ADD_PROJECT_IMAGE

        async def add_project_image(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if not is_admin(update.effective_chat.id):
                return ConversationHandler.END
                
            url = update.message.text.strip()
            await save_project_and_finish(update, context, url)
            return ConversationHandler.END

        async def skip_project_image(update: Update, context: ContextTypes.DEFAULT_TYPE):
            query = update.callback_query
            if not is_admin(query.message.chat.id):
                await query.answer("⛔ Unauthorized.", show_alert=True)
                return ConversationHandler.END
                
            await query.answer()
            await save_project_and_finish(update, context, None)
            return ConversationHandler.END

        async def save_project_and_finish(update: Update, context: ContextTypes.DEFAULT_TYPE, image_url: Optional[str]):
            title = context.user_data.get('new_project_title')
            category = context.user_data.get('new_project_category')
            if not image_url:
                image_url = "https://lh3.googleusercontent.com/aida-public/AB6AXuBZSt8DyOiyuc3D0YvzOV9Jdv6p3zqa1c41iPnk0Ifax5pnO8pm20-EXQPJfcwJFQnfT2xPv9OtSS-3bPjpE9OcTYPJvwt7azVCzNeiI1xnESPKX9SOccKQbjZ4zNvjuWGnEFijdVqZLORetO7QXnzBxfJWm2Qyvyk0PMno0Fxb1XrWG_JkB4s8pAeN6Utx3R9zlEqhDLKQAbACyu9J_wQj6IIowCdT7nnSOfN5JJFswidCpbudUKNSDzlIpoxPTb5Eb3G_EKMGBvA"
                
            p_id = f"project-{uuid.uuid4().hex[:8]}"
            add_project(p_id, title, category, image_url, span="small")
            
            text = (
                f"✅ **Project Added Successfully!**\n\n"
                f"• **Title**: {title}\n"
                f"• **Category**: {category}\n"
                f"• **Image**: `{image_url[:40]}...`"
            )
            
            query = update.callback_query
            if query:
                await query.edit_message_text(text, parse_mode="Markdown")
            else:
                await update.message.reply_text(text, parse_mode="Markdown")
                
            await send_status_message_direct(context.bot)

        # --- Job Creation Wizard Handler ---
        async def start_job_flow(update: Update, context: ContextTypes.DEFAULT_TYPE):
            query = update.callback_query
            chat_id = query.message.chat.id if query else update.effective_chat.id
            if not is_admin(chat_id):
                if query:
                    await query.answer("⛔ Unauthorized.", show_alert=True)
                return ConversationHandler.END
                
            keyboard = [[InlineKeyboardButton("❌ Cancel", callback_data="cancel_flow")]]
            if query:
                await query.answer()
                await query.edit_message_text(
                    "💼 **Add Job Listing**\n\nPlease enter the **Job Title** (e.g. `Senior Architect`, `Safety Lead`):",
                    reply_markup=InlineKeyboardMarkup(keyboard)
                )
            else:
                await update.message.reply_text(
                    "💼 **Add Job Listing**\n\nPlease enter the **Job Title** (e.g. `Senior Architect`, `Safety Lead`):",
                    reply_markup=InlineKeyboardMarkup(keyboard)
                )
                
            return ADD_JOB_TITLE

        async def add_job_title(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if not is_admin(update.effective_chat.id):
                return ConversationHandler.END
                
            context.user_data['new_job_title'] = update.message.text
            keyboard = [
                [
                    InlineKeyboardButton("Engineering", callback_data="dept_Engineering"),
                    InlineKeyboardButton("Operations", callback_data="dept_Operations"),
                ],
                [
                    InlineKeyboardButton("Design", callback_data="dept_Design"),
                    InlineKeyboardButton("Safety", callback_data="dept_Safety"),
                ],
                [
                    InlineKeyboardButton("Other", callback_data="dept_Other")
                ],
                [
                    InlineKeyboardButton("❌ Cancel", callback_data="cancel_flow")
                ]
            ]
            await update.message.reply_text(
                f"Title saved: **{update.message.text}**\n\nSelect the **Department** for this job:",
                parse_mode="Markdown",
                reply_markup=InlineKeyboardMarkup(keyboard)
            )
            return ADD_JOB_DEPARTMENT

        async def add_job_department(update: Update, context: ContextTypes.DEFAULT_TYPE):
            query = update.callback_query
            if not is_admin(query.message.chat.id):
                await query.answer("⛔ Unauthorized.", show_alert=True)
                return ConversationHandler.END
                
            await query.answer()
            dept = query.data.split("_")[1]
            context.user_data['new_job_dept'] = dept
            
            keyboard = [[InlineKeyboardButton("❌ Cancel", callback_data="cancel_flow")]]
            await query.edit_message_text(
                f"Department selected: **{dept}**\n\nPlease enter the **Job Location** (e.g., `Noida, UP`, `Multiple Locations`):",
                reply_markup=InlineKeyboardMarkup(keyboard)
            )
            return ADD_JOB_LOCATION

        async def add_job_location(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if not is_admin(update.effective_chat.id):
                return ConversationHandler.END
                
            context.user_data['new_job_loc'] = update.message.text
            keyboard = [
                [
                    InlineKeyboardButton("Full-time", callback_data="type_Full-time"),
                    InlineKeyboardButton("Part-time", callback_data="type_Part-time"),
                ],
                [
                    InlineKeyboardButton("Contract", callback_data="type_Contract"),
                    InlineKeyboardButton("Internship", callback_data="type_Internship"),
                ],
                [
                    InlineKeyboardButton("❌ Cancel", callback_data="cancel_flow")
                ]
            ]
            await update.message.reply_text(
                f"Location saved: **{update.message.text}**\n\nSelect the **Employment Type**:",
                parse_mode="Markdown",
                reply_markup=InlineKeyboardMarkup(keyboard)
            )
            return ADD_JOB_TYPE

        async def add_job_type(update: Update, context: ContextTypes.DEFAULT_TYPE):
            query = update.callback_query
            if not is_admin(query.message.chat.id):
                await query.answer("⛔ Unauthorized.", show_alert=True)
                return ConversationHandler.END
                
            await query.answer()
            j_type = query.data.split("_")[1]
            context.user_data['new_job_type'] = j_type
            
            title = context.user_data.get('new_job_title')
            dept = context.user_data.get('new_job_dept')
            loc = context.user_data.get('new_job_loc')
            
            add_job(title, dept, loc, j_type)
            
            text = (
                f"✅ **Job Listing Published Successfully!**\n\n"
                f"• **Title**: {title}\n"
                f"• **Department**: {dept}\n"
                f"• **Location**: {loc}\n"
                f"• **Type**: {j_type}"
            )
            await query.edit_message_text(text, parse_mode="Markdown")
            await send_status_message_direct(context.bot)
            return ConversationHandler.END

        # --- Notice Banner Conversation Handler ---
        async def start_notice_flow(update: Update, context: ContextTypes.DEFAULT_TYPE):
            query = update.callback_query
            chat_id = query.message.chat.id if query else update.effective_chat.id
            if not is_admin(chat_id):
                if query:
                    await query.answer("⛔ Unauthorized.", show_alert=True)
                return ConversationHandler.END
                
            keyboard = [
                [InlineKeyboardButton("🗑️ Clear Notice Banner", callback_data="clear_notice_exec")],
                [InlineKeyboardButton("❌ Cancel", callback_data="cancel_flow")]
            ]
            if query:
                await query.answer()
                await query.edit_message_text(
                    "📝 **Change Notice Banner**\n\nPlease enter the new notice banner text (or click Clear to remove it):",
                    reply_markup=InlineKeyboardMarkup(keyboard)
                )
            else:
                await update.message.reply_text(
                    "📝 **Change Notice Banner**\n\nPlease enter the new notice banner text (or type /cancel):",
                    reply_markup=InlineKeyboardMarkup(keyboard)
                )
            return SET_NOTICE_TEXT

        async def set_notice_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if not is_admin(update.effective_chat.id):
                return ConversationHandler.END
                
            txt = update.message.text.strip()
            update_setting("siteNotice", txt)
            await update.message.reply_text(f"✅ Notice banner set to:\n\"{txt}\"")
            await send_status_message_direct(context.bot)
            return ConversationHandler.END

        async def clear_notice_exec(update: Update, context: ContextTypes.DEFAULT_TYPE):
            query = update.callback_query
            if not is_admin(query.message.chat.id):
                await query.answer("⛔ Unauthorized.", show_alert=True)
                return ConversationHandler.END
                
            await query.answer()
            update_setting("siteNotice", "")
            await query.edit_message_text("✅ Notice banner cleared.")
            await send_status_message_direct(context.bot)
            return ConversationHandler.END

        # --- Contact Info Handlers ---
        async def start_phone_flow(update: Update, context: ContextTypes.DEFAULT_TYPE):
            query = update.callback_query
            chat_id = query.message.chat.id if query else update.effective_chat.id
            if not is_admin(chat_id):
                if query:
                    await query.answer("⛔ Unauthorized.", show_alert=True)
                return ConversationHandler.END
                
            keyboard = [[InlineKeyboardButton("❌ Cancel", callback_data="cancel_flow")]]
            text = "📞 **Update Contact Phone**\n\nPlease enter the new phone number:"
            if query:
                await query.answer()
                await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard))
            else:
                await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard))
            return SET_CONTACT_PHONE

        async def set_contact_phone(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if not is_admin(update.effective_chat.id):
                return ConversationHandler.END
            txt = update.message.text.strip()
            update_setting("contactPhone", txt)
            await update.message.reply_text(f"✅ Contact phone set to: `{txt}`", parse_mode="Markdown")
            await send_status_message_direct(context.bot)
            return ConversationHandler.END

        async def start_email_flow(update: Update, context: ContextTypes.DEFAULT_TYPE):
            query = update.callback_query
            chat_id = query.message.chat.id if query else update.effective_chat.id
            if not is_admin(chat_id):
                if query:
                    await query.answer("⛔ Unauthorized.", show_alert=True)
                return ConversationHandler.END
                
            keyboard = [[InlineKeyboardButton("❌ Cancel", callback_data="cancel_flow")]]
            text = "✉️ **Update Contact Email**\n\nPlease enter the new email address:"
            if query:
                await query.answer()
                await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard))
            else:
                await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard))
            return SET_CONTACT_EMAIL

        async def set_contact_email(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if not is_admin(update.effective_chat.id):
                return ConversationHandler.END
            txt = update.message.text.strip()
            update_setting("contactEmail", txt)
            await update.message.reply_text(f"✅ Contact email set to: `{txt}`", parse_mode="Markdown")
            await send_status_message_direct(context.bot)
            return ConversationHandler.END

        # --- Content & Meta Handlers ---
        async def start_privacy_flow(update: Update, context: ContextTypes.DEFAULT_TYPE):
            query = update.callback_query
            chat_id = query.message.chat.id if query else update.effective_chat.id
            if not is_admin(chat_id):
                if query: await query.answer("⛔ Unauthorized.", show_alert=True)
                return ConversationHandler.END
            keyboard = [[InlineKeyboardButton("❌ Cancel", callback_data="cancel_flow")]]
            text = "✍️ **Update Privacy Policy**\n\nEnter the new Privacy Policy text. Use double newlines to separate paragraphs:"
            if query:
                await query.answer()
                await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard))
            else:
                await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard))
            return SET_PRIVACY

        async def set_privacy_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if not is_admin(update.effective_chat.id): return ConversationHandler.END
            update_setting("privacyPolicyText", update.message.text.strip())
            await update.message.reply_text("✅ Privacy Policy updated.")
            await send_status_message_direct(context.bot)
            return ConversationHandler.END

        async def start_terms_flow(update: Update, context: ContextTypes.DEFAULT_TYPE):
            query = update.callback_query
            chat_id = query.message.chat.id if query else update.effective_chat.id
            if not is_admin(chat_id):
                if query: await query.answer("⛔ Unauthorized.", show_alert=True)
                return ConversationHandler.END
            keyboard = [[InlineKeyboardButton("❌ Cancel", callback_data="cancel_flow")]]
            text = "✍️ **Update Terms & Conditions**\n\nEnter the new Terms text. Use double newlines to separate paragraphs:"
            if query:
                await query.answer()
                await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard))
            else:
                await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard))
            return SET_TERMS

        async def set_terms_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if not is_admin(update.effective_chat.id): return ConversationHandler.END
            update_setting("termsConditionsText", update.message.text.strip())
            await update.message.reply_text("✅ Terms & Conditions updated.")
            await send_status_message_direct(context.bot)
            return ConversationHandler.END

        async def start_meta_title_flow(update: Update, context: ContextTypes.DEFAULT_TYPE):
            query = update.callback_query
            chat_id = query.message.chat.id if query else update.effective_chat.id
            if not is_admin(chat_id):
                if query: await query.answer("⛔ Unauthorized.", show_alert=True)
                return ConversationHandler.END
            keyboard = [[InlineKeyboardButton("❌ Cancel", callback_data="cancel_flow")]]
            text = "🌐 **Update Meta Title**\n\nEnter the new meta title for the website:"
            if query:
                await query.answer()
                await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard))
            else:
                await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard))
            return SET_META_TITLE

        async def set_meta_title(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if not is_admin(update.effective_chat.id): return ConversationHandler.END
            update_setting("metaTitle", update.message.text.strip())
            await update.message.reply_text("✅ Meta Title updated.")
            await send_status_message_direct(context.bot)
            return ConversationHandler.END

        async def start_meta_desc_flow(update: Update, context: ContextTypes.DEFAULT_TYPE):
            query = update.callback_query
            chat_id = query.message.chat.id if query else update.effective_chat.id
            if not is_admin(chat_id):
                if query: await query.answer("⛔ Unauthorized.", show_alert=True)
                return ConversationHandler.END
            keyboard = [[InlineKeyboardButton("❌ Cancel", callback_data="cancel_flow")]]
            text = "🌐 **Update Meta Description**\n\nEnter the new meta description for the website:"
            if query:
                await query.answer()
                await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard))
            else:
                await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard))
            return SET_META_DESC

        async def set_meta_desc(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if not is_admin(update.effective_chat.id): return ConversationHandler.END
            update_setting("metaDescription", update.message.text.strip())
            await update.message.reply_text("✅ Meta Description updated.")
            await send_status_message_direct(context.bot)
            return ConversationHandler.END

        # Cancellation Handlers
        async def cancel_flow(update: Update, context: ContextTypes.DEFAULT_TYPE):
            await update.message.reply_text("❌ Action cancelled.")
            await send_status_message_direct(context.bot)
            return ConversationHandler.END

        async def cancel_flow_cb(update: Update, context: ContextTypes.DEFAULT_TYPE):
            query = update.callback_query
            await query.answer()
            await query.edit_message_text("❌ Action cancelled.")
            await send_status_message_direct(context.bot)
            return ConversationHandler.END

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
            
            # Register Project Wizard Conversation
            project_conv = ConversationHandler(
                entry_points=[
                    CallbackQueryHandler(start_project_flow, pattern="^start_project_flow$"),
                    CommandHandler("addproject", start_project_flow)
                ],
                states={
                    ADD_PROJECT_TITLE: [MessageHandler(filters.TEXT & ~filters.COMMAND, add_project_title)],
                    ADD_PROJECT_CATEGORY: [MessageHandler(filters.TEXT & ~filters.COMMAND, add_project_category)],
                    ADD_PROJECT_IMAGE: [
                        MessageHandler(filters.TEXT & ~filters.COMMAND, add_project_image),
                        CallbackQueryHandler(skip_project_image, pattern="^skip_project_image$")
                    ],
                },
                fallbacks=[
                    CommandHandler("cancel", cancel_flow),
                    CallbackQueryHandler(cancel_flow_cb, pattern="^cancel_flow$")
                ],
            )
            bot_app.add_handler(project_conv)

            # Register Job Wizard Conversation
            job_conv = ConversationHandler(
                entry_points=[
                    CallbackQueryHandler(start_job_flow, pattern="^start_job_flow$"),
                    CommandHandler("addjob", start_job_flow)
                ],
                states={
                    ADD_JOB_TITLE: [MessageHandler(filters.TEXT & ~filters.COMMAND, add_job_title)],
                    ADD_JOB_DEPARTMENT: [CallbackQueryHandler(add_job_department, pattern="^dept_")],
                    ADD_JOB_LOCATION: [MessageHandler(filters.TEXT & ~filters.COMMAND, add_job_location)],
                    ADD_JOB_TYPE: [CallbackQueryHandler(add_job_type, pattern="^type_")],
                },
                fallbacks=[
                    CommandHandler("cancel", cancel_flow),
                    CallbackQueryHandler(cancel_flow_cb, pattern="^cancel_flow$")
                ],
            )
            bot_app.add_handler(job_conv)

            # Register Notice Banner Conversation
            notice_conv = ConversationHandler(
                entry_points=[
                    CallbackQueryHandler(start_notice_flow, pattern="^start_notice_flow$"),
                    CommandHandler("notice", start_notice_flow)
                ],
                states={
                    SET_NOTICE_TEXT: [
                        MessageHandler(filters.TEXT & ~filters.COMMAND, set_notice_text),
                        CallbackQueryHandler(clear_notice_exec, pattern="^clear_notice_exec$")
                    ],
                },
                fallbacks=[
                    CommandHandler("cancel", cancel_flow),
                    CallbackQueryHandler(cancel_flow_cb, pattern="^cancel_flow$")
                ],
            )
            bot_app.add_handler(notice_conv)

            # Register Contact Handlers
            phone_conv = ConversationHandler(
                entry_points=[CallbackQueryHandler(start_phone_flow, pattern="^start_phone_flow$")],
                states={
                    SET_CONTACT_PHONE: [MessageHandler(filters.TEXT & ~filters.COMMAND, set_contact_phone)],
                },
                fallbacks=[
                    CommandHandler("cancel", cancel_flow),
                    CallbackQueryHandler(cancel_flow_cb, pattern="^cancel_flow$")
                ],
            )
            bot_app.add_handler(phone_conv)

            email_conv = ConversationHandler(
                entry_points=[CallbackQueryHandler(start_email_flow, pattern="^start_email_flow$")],
                states={
                    SET_CONTACT_EMAIL: [MessageHandler(filters.TEXT & ~filters.COMMAND, set_contact_email)],
                },
                fallbacks=[
                    CommandHandler("cancel", cancel_flow),
                    CallbackQueryHandler(cancel_flow_cb, pattern="^cancel_flow$")
                ],
            )
            bot_app.add_handler(email_conv)

            # Register Content & Meta Handlers
            privacy_conv = ConversationHandler(
                entry_points=[CallbackQueryHandler(start_privacy_flow, pattern="^start_privacy_flow$")],
                states={SET_PRIVACY: [MessageHandler(filters.TEXT & ~filters.COMMAND, set_privacy_text)]},
                fallbacks=[CommandHandler("cancel", cancel_flow), CallbackQueryHandler(cancel_flow_cb, pattern="^cancel_flow$")],
            )
            bot_app.add_handler(privacy_conv)

            terms_conv = ConversationHandler(
                entry_points=[CallbackQueryHandler(start_terms_flow, pattern="^start_terms_flow$")],
                states={SET_TERMS: [MessageHandler(filters.TEXT & ~filters.COMMAND, set_terms_text)]},
                fallbacks=[CommandHandler("cancel", cancel_flow), CallbackQueryHandler(cancel_flow_cb, pattern="^cancel_flow$")],
            )
            bot_app.add_handler(terms_conv)

            meta_title_conv = ConversationHandler(
                entry_points=[CallbackQueryHandler(start_meta_title_flow, pattern="^start_meta_title_flow$")],
                states={SET_META_TITLE: [MessageHandler(filters.TEXT & ~filters.COMMAND, set_meta_title)]},
                fallbacks=[CommandHandler("cancel", cancel_flow), CallbackQueryHandler(cancel_flow_cb, pattern="^cancel_flow$")],
            )
            bot_app.add_handler(meta_title_conv)

            meta_desc_conv = ConversationHandler(
                entry_points=[CallbackQueryHandler(start_meta_desc_flow, pattern="^start_meta_desc_flow$")],
                states={SET_META_DESC: [MessageHandler(filters.TEXT & ~filters.COMMAND, set_meta_desc)]},
                fallbacks=[CommandHandler("cancel", cancel_flow), CallbackQueryHandler(cancel_flow_cb, pattern="^cancel_flow$")],
            )
            bot_app.add_handler(meta_desc_conv)

            # Register Command Handlers
            bot_app.add_handler(CommandHandler("start", start_command))
            bot_app.add_handler(CommandHandler("status", status_command))

            # Register Static Button Callback Handler
            bot_app.add_handler(CallbackQueryHandler(button_callback_handler))
            
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
