"""
SQLite persistence for RECHECK-X decisions, users, and audit trail.
Uses parameterized queries. Safe schema init (no data deletion).
"""

import os
import json
import sqlite3
import hashlib
import secrets
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from contextlib import contextmanager

DB_FILE = os.path.join(os.path.dirname(__file__), "recheckx.db")


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _hash_password(password: str, salt: Optional[str] = None) -> tuple:
    salt = salt or secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 120000)
    return salt, dk.hex()


@contextmanager
def get_conn():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    with get_conn() as conn:
        c = conn.cursor()
        c.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT,
            password_salt TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """)
        c.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
        """)
        c.execute("""
        CREATE TABLE IF NOT EXISTS decisions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            query TEXT NOT NULL,
            device_type TEXT,
            verdict TEXT,
            initial_recommendation TEXT,
            final_recommendation TEXT,
            payload_json TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
        """)
        c.execute("""
        CREATE TABLE IF NOT EXISTS audit_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            decision_id INTEGER NOT NULL,
            step INTEGER,
            event TEXT,
            detail TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY(decision_id) REFERENCES decisions(id)
        )
        """)
        # Demo user (password: demo1234) — clearly labeled demo
        row = c.execute("SELECT id FROM users WHERE email = ?", ("demo@recheckx.ai",)).fetchone()
        if not row:
            salt, pw_hash = _hash_password("demo1234")
            c.execute(
                "INSERT INTO users (email, name, password_salt, password_hash, created_at) VALUES (?,?,?,?,?)",
                ("demo@recheckx.ai", "Demo User", salt, pw_hash, _now()),
            )


def register_user(email: str, password: str, name: str = "") -> Dict[str, Any]:
    email = email.strip().lower()
    if not email or not password or len(password) < 6:
        raise ValueError("Valid email and password (min 6 chars) required")
    salt, pw_hash = _hash_password(password)
    with get_conn() as conn:
        try:
            cur = conn.execute(
                "INSERT INTO users (email, name, password_salt, password_hash, created_at) VALUES (?,?,?,?,?)",
                (email, name or email.split("@")[0], salt, pw_hash, _now()),
            )
            return {"id": cur.lastrowid, "email": email, "name": name or email.split("@")[0]}
        except sqlite3.IntegrityError:
            raise ValueError("Email already registered")


def authenticate(email: str, password: str) -> Optional[Dict[str, Any]]:
    email = email.strip().lower()
    with get_conn() as conn:
        row = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        if not row:
            return None
        _, pw_hash = _hash_password(password, row["password_salt"])
        if pw_hash != row["password_hash"]:
            return None
        token = secrets.token_urlsafe(32)
        conn.execute(
            "INSERT INTO sessions (token, user_id, created_at) VALUES (?,?,?)",
            (token, row["id"], _now()),
        )
        return {
            "token": token,
            "user": {"id": row["id"], "email": row["email"], "name": row["name"]},
        }


def user_from_token(token: Optional[str]) -> Optional[Dict[str, Any]]:
    if not token:
        return None
    with get_conn() as conn:
        row = conn.execute(
            """
            SELECT u.id, u.email, u.name FROM sessions s
            JOIN users u ON u.id = s.user_id
            WHERE s.token = ?
            """,
            (token,),
        ).fetchone()
        if not row:
            return None
        return {"id": row["id"], "email": row["email"], "name": row["name"]}


def logout(token: str):
    with get_conn() as conn:
        conn.execute("DELETE FROM sessions WHERE token = ?", (token,))


def save_decision(user_id: Optional[int], audit_result: Dict[str, Any]) -> int:
    with get_conn() as conn:
        cur = conn.execute(
            """
            INSERT INTO decisions
            (user_id, query, device_type, verdict, initial_recommendation, final_recommendation, payload_json, created_at)
            VALUES (?,?,?,?,?,?,?,?)
            """,
            (
                user_id,
                audit_result.get("query") or "",
                audit_result.get("device_type"),
                audit_result.get("verdict"),
                (audit_result.get("final_decision") or {}).get("initial_recommendation")
                or (audit_result.get("first_pass_pick") or {}).get("name"),
                (audit_result.get("final_decision") or {}).get("final_recommendation")
                or (audit_result.get("top_pick") or {}).get("name"),
                json.dumps(audit_result),
                _now(),
            ),
        )
        decision_id = cur.lastrowid
        for ev in audit_result.get("audit_events") or []:
            conn.execute(
                "INSERT INTO audit_events (decision_id, step, event, detail, created_at) VALUES (?,?,?,?,?)",
                (decision_id, ev.get("step"), ev.get("event"), ev.get("detail"), _now()),
            )
        return decision_id


def list_decisions(user_id: Optional[int], limit: int = 50) -> List[Dict[str, Any]]:
    with get_conn() as conn:
        if user_id:
            rows = conn.execute(
                """
                SELECT id, query, device_type, verdict, initial_recommendation, final_recommendation, created_at
                FROM decisions WHERE user_id = ? ORDER BY id DESC LIMIT ?
                """,
                (user_id, limit),
            ).fetchall()
        else:
            rows = conn.execute(
                """
                SELECT id, query, device_type, verdict, initial_recommendation, final_recommendation, created_at
                FROM decisions ORDER BY id DESC LIMIT ?
                """,
                (limit,),
            ).fetchall()
        return [dict(r) for r in rows]


def get_decision(decision_id: int, user_id: Optional[int] = None) -> Optional[Dict[str, Any]]:
    with get_conn() as conn:
        if user_id is not None:
            row = conn.execute(
                "SELECT * FROM decisions WHERE id = ? AND (user_id = ? OR user_id IS NULL)",
                (decision_id, user_id),
            ).fetchone()
        else:
            row = conn.execute("SELECT * FROM decisions WHERE id = ?", (decision_id,)).fetchone()
        if not row:
            return None
        payload = json.loads(row["payload_json"])
        payload["decision_id"] = row["id"]
        payload["created_at"] = row["created_at"]
        events = conn.execute(
            "SELECT step, event, detail, created_at FROM audit_events WHERE decision_id = ? ORDER BY step",
            (decision_id,),
        ).fetchall()
        payload["stored_audit_events"] = [dict(e) for e in events]
        return payload


# Initialize on import
init_db()
