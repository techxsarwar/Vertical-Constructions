import os
import sqlite3
import json

# Use Render persistent disk directory /data if it exists and is writable, otherwise fall back to local directory
if os.path.exists("/data") and os.access("/data", os.W_OK):
    DB_PATH = "/data/vertical_constructions.db"
else:
    DB_PATH = os.path.join(os.path.dirname(__file__), "vertical_constructions.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create tables
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            image TEXT,
            span TEXT DEFAULT 'small',
            icon TEXT,
            badge TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            department TEXT NOT NULL,
            location TEXT NOT NULL,
            type TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            date TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS fleet (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            status TEXT NOT NULL,
            location TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS vendors (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            status TEXT NOT NULL,
            rating TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS safety_logs (
            id TEXT PRIMARY KEY,
            date TEXT NOT NULL,
            location TEXT NOT NULL,
            type TEXT NOT NULL,
            severity TEXT NOT NULL,
            status TEXT NOT NULL
        )
    """)

    conn.commit()

    # Seed initial settings
    cursor.execute("SELECT COUNT(*) FROM settings")
    if cursor.fetchone()[0] == 0:
        initial_settings = {
            "maintenanceMode": "false",
            "contactPhone": "+91 98765 43210",
            "contactEmail": "projects@verticalconstructions.in",
            "siteNotice": "",
            "metaTitle": "Vertical Constructions — Engineered for Excellence",
            "metaDescription": "Vertical Constructions — High-contrast engineering meets luxury architecture. We build the future vertically with precision, sustainability, and structural vibrancy.",
            "privacyPolicyText": "",
            "termsConditionsText": ""
        }
        for k, v in initial_settings.items():
            cursor.execute("INSERT INTO settings (key, value) VALUES (?, ?)", (k, v))

    # Seed initial projects
    cursor.execute("SELECT COUNT(*) FROM projects")
    if cursor.fetchone()[0] == 0:
        initial_projects = [
            {
                "id": "apex-tower",
                "title": "The Apex Tower",
                "category": "Commercial • 85 Stories",
                "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuB9g6YsAr-BXzFse65CTOj-Yv7OYlpKJF_0KX58LqyIBXjGjGg-jcvOb7vkZeD7hvtaIYQKxYA_8O7o4VkAhnLtFiLIkln0QEPE6JcYoD9PDvxNpBjzcKfntViJs2Gcw1N4dw8Y7EudA54asWS-qmcJzyYtaZIVsSlGHV3IfZ0TTy8SU16qkBb8O_2RuxGwjlLxKtNgMlv1hbv05fUAR0uIMc_SPHLyDdwNmESTtAXofDZXxciYOtp4ZJ2EK_as1nq405ORFyTvYnU",
                "span": "large",
                "icon": "apartment",
                "badge": None
            },
            {
                "id": "foundry-complex",
                "title": "Foundry Complex",
                "category": "Industrial • Heavy Rail",
                "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAudU7g9wZJN8kM1EWu6T_RE8OUZQJ0FZMJ-ZdeApszelV5DCbXHVwYyBDPtHI5lLVESJM19ojrfHaFMWeHjXncElUvhhsOawcDq7cPvT7XrDc9G_LveZAgf7Crg5UOwGUk7xpLkpzkHMt0U9hrDK9VsS0tvkKcP5wPknIrNCIYcDYcuwNlLDl5-YsQNOfD8NZnH5ABNEmV24hnFIrP_sKN6_Y_GiUg6BEPMBGEPc9EH6hw3Brx37fwqIds9lW6NreKRZx7vDCXHJA",
                "span": "tall",
                "icon": None,
                "badge": None
            },
            {
                "id": "green-residences",
                "title": "Green Residences",
                "category": "Residential • Luxury",
                "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDAfFMYFh0YP26ZCLkON4Crt0SGvVxfgE3sXu4fV5QBulrmIRaffCOkbAxVt9NN10ryhOlOchpm3UaZp8qgsD2eA87ZIBuzIO0dbOvF7ob95PEyIxPkawW80b3cAeBCcT84BTaGjPAiI5mdfFseM52drjMn4a1dpqGYbZNG831adAF7srrGopYwXfkc9sTT3nIDK_K0qZNo6SzwLCEhANNHLRvgZpmstNfaVDwOU9K6fmbrL8ZWE1gUAXcyOGxwEm5v-6G3HbkT7WE",
                "span": "small",
                "icon": "precision_manufacturing",
                "badge": None
            },
            {
                "id": "atrium-hq",
                "title": "Atrium HQ",
                "category": "Corporate • Headquarters",
                "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCPUXwuxZSMDWjPduq8LF1hQfYbtHMMlFYEEQ1YGd_qcD8t5Gqs6ejTFzC9K9B-zOZhXpVsbSz4uRNOmKTEp2oZ2raG5bWdn7m7SlPjfKFGBPzfhnt8llgr-xcM0LyKBC7oDbJ51INylxNN-XBuGscy00sISr23-fstPOip17_X3IcieIgWofKol3b7KnDZ81mcn4hch28nqZmpIk8Ww8xTGZssolTxVIAalciYDqaTsSakkR2FB6zXBKU89ALbK031661_kpMRxEg",
                "span": "small",
                "icon": "engineering",
                "badge": None
            },
            {
                "id": "river-gateway",
                "title": "River Gateway",
                "category": "Infrastructure • 2.4 Miles",
                "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBZSt8DyOiyuc3D0YvzOV9Jdv6p3zqa1c41iPnk0Ifax5pnO8pm20-EXQPJfcwJFQnfT2xPv9OtSS-3bPjpE9OcTYPJvwt7azVCzNeiI1xnESPKX9SOccKQbjZ4zNvjuWGnEFijdVqZLORetO7QXnzBxfJWm2Qyvyk0PMno0Fxb1XrWG_JkB4s8pAeN6Utx3R9zlEqhDLKQAbACyu9J_wQj6IIowCdT7nnSOfN5JJFswidCpbudUKNSDzlIpoxPTb5Eb3G_EKMGBvA",
                "span": "wide",
                "icon": None,
                "badge": "Sustainable Materials"
            }
        ]
        for p in initial_projects:
            cursor.execute(
                "INSERT INTO projects (id, title, category, image, span, icon, badge) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (p["id"], p["title"], p["category"], p["image"], p["span"], p["icon"], p["badge"])
            )

    # Seed initial jobs
    cursor.execute("SELECT COUNT(*) FROM jobs")
    if cursor.fetchone()[0] == 0:
        initial_jobs = [
            {"title": "Senior Structural Engineer", "department": "Engineering", "location": "Noida, UP", "type": "Full-time"},
            {"title": "Project Manager (Commercial)", "department": "Operations", "location": "Gurugram, HR", "type": "Full-time"},
            {"title": "Architectural Draftsman", "department": "Design", "location": "Noida, UP", "type": "Contract"},
            {"title": "Site Safety Inspector", "department": "Safety", "location": "Multiple Locations", "type": "Full-time"}
        ]
        for j in initial_jobs:
            cursor.execute(
                "INSERT INTO jobs (title, department, location, type) VALUES (?, ?, ?, ?)",
                (j["title"], j["department"], j["location"], j["type"])
            )

    # Seed initial fleet
    cursor.execute("SELECT COUNT(*) FROM fleet")
    if cursor.fetchone()[0] == 0:
        initial_fleet = [
            {"id": "1", "name": "CAT 320 Hydraulic Excavator", "type": "Heavy Machinery", "status": "Active", "location": "The Apex Tower"},
            {"id": "2", "name": "Liebherr Tower Crane 150 EC-B", "type": "Cranes", "status": "Maintenance", "location": "Service Yard A"},
            {"id": "3", "name": "Volvo A40G Articulated Hauler", "type": "Transport", "status": "Active", "location": "River Gateway"},
            {"id": "4", "name": "Putzmeister Concrete Pump", "type": "Specialized", "status": "Active", "location": "Green Residences"}
        ]
        for f in initial_fleet:
            cursor.execute(
                "INSERT INTO fleet (id, name, type, status, location) VALUES (?, ?, ?, ?, ?)",
                (f["id"], f["name"], f["type"], f["status"], f["location"])
            )

    # Seed initial vendors
    cursor.execute("SELECT COUNT(*) FROM vendors")
    if cursor.fetchone()[0] == 0:
        initial_vendors = [
            {"id": "v1", "name": "UltraTech Cement", "status": "Active Contract", "rating": "5/5"},
            {"id": "v2", "name": "Tata Steel Ltd", "status": "Pending Renewal", "rating": "4.5/5"}
        ]
        for v in initial_vendors:
            cursor.execute(
                "INSERT INTO vendors (id, name, status, rating) VALUES (?, ?, ?, ?)",
                (v["id"], v["name"], v["status"], v["rating"])
            )

    # Seed initial safety logs
    cursor.execute("SELECT COUNT(*) FROM safety_logs")
    if cursor.fetchone()[0] == 0:
        initial_safety = [
            {"id": "1", "date": "May 1, 2026", "location": "River Gateway", "type": "Equipment Malfunction", "severity": "Moderate", "status": "Resolved"},
            {"id": "2", "date": "April 18, 2026", "location": "The Apex Tower", "type": "Safety Harness Check Failed", "severity": "High", "status": "Resolved"}
        ]
        for s in initial_safety:
            cursor.execute(
                "INSERT INTO safety_logs (id, date, location, type, severity, status) VALUES (?, ?, ?, ?, ?, ?)",
                (s["id"], s["date"], s["location"], s["type"], s["severity"], s["status"])
            )

    conn.commit()
    conn.close()

# --- Projects Operations ---
def get_all_projects():
    conn = get_db_connection()
    projects = conn.execute("SELECT * FROM projects").fetchall()
    conn.close()
    return [dict(p) for p in projects]

def add_project(p_id, title, category, image, span='small', icon=None, badge=None):
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO projects (id, title, category, image, span, icon, badge) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (p_id, title, category, image, span, icon, badge)
    )
    conn.commit()
    conn.close()

def delete_project(p_id):
    conn = get_db_connection()
    conn.execute("DELETE FROM projects WHERE id = ?", (p_id,))
    conn.commit()
    conn.close()

# --- Jobs Operations ---
def get_all_jobs():
    conn = get_db_connection()
    jobs = conn.execute("SELECT * FROM jobs").fetchall()
    conn.close()
    return [dict(j) for j in jobs]

def add_job(title, department, location, type):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO jobs (title, department, location, type) VALUES (?, ?, ?, ?)",
        (title, department, location, type)
    )
    job_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return job_id

def delete_job(j_id):
    conn = get_db_connection()
    conn.execute("DELETE FROM jobs WHERE id = ?", (j_id,))
    conn.commit()
    conn.close()

# --- Messages Operations ---
def get_all_messages():
    conn = get_db_connection()
    messages = conn.execute("SELECT * FROM messages ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(m) for m in messages]

def add_message(name, email, message, date_str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO messages (name, email, message, date) VALUES (?, ?, ?, ?)",
        (name, email, message, date_str)
    )
    m_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return m_id

def delete_message(m_id):
    conn = get_db_connection()
    conn.execute("DELETE FROM messages WHERE id = ?", (m_id,))
    conn.commit()
    conn.close()

def clear_messages():
    conn = get_db_connection()
    conn.execute("DELETE FROM messages")
    conn.commit()
    conn.close()

# --- Settings Operations ---
def get_all_settings():
    conn = get_db_connection()
    settings = conn.execute("SELECT * FROM settings").fetchall()
    conn.close()
    
    # Default fallbacks
    settings_dict = {
        "maintenanceMode": False,
        "contactPhone": "+91 98765 43210",
        "contactEmail": "projects@verticalconstructions.in",
        "siteNotice": "",
        "metaTitle": "Vertical Constructions — Engineered for Excellence",
        "metaDescription": "Vertical Constructions — High-contrast engineering meets luxury architecture. We build the future vertically with precision, sustainability, and structural vibrancy.",
        "privacyPolicyText": "",
        "termsConditionsText": ""
    }
    
    for row in settings:
        key = row["key"]
        val = row["value"]
        if key == "maintenanceMode":
            settings_dict[key] = val.lower() == "true"
        else:
            settings_dict[key] = val
    return settings_dict

def update_setting(key, value):
    conn = get_db_connection()
    val_str = "true" if value is True else ("false" if value is False else str(value))
    conn.execute(
        "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
        (key, val_str)
    )
    conn.commit()
    conn.close()

# --- Fleet Operations ---
def get_all_fleet():
    conn = get_db_connection()
    fleet = conn.execute("SELECT * FROM fleet").fetchall()
    conn.close()
    return [dict(f) for f in fleet]

# --- Vendors Operations ---
def get_all_vendors():
    conn = get_db_connection()
    vendors = conn.execute("SELECT * FROM vendors").fetchall()
    conn.close()
    return [dict(v) for v in vendors]

# --- Safety Logs Operations ---
def get_all_safety_logs():
    conn = get_db_connection()
    logs = conn.execute("SELECT * FROM safety_logs").fetchall()
    conn.close()
    return [dict(l) for l in logs]
