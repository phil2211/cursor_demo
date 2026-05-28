import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "data" / "feedback.db"


def get_connection() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message TEXT NOT NULL,
                email TEXT,
                sentiment TEXT CHECK(sentiment IN ('positive', 'neutral', 'negative')),
                status TEXT NOT NULL DEFAULT 'new'
                    CHECK(status IN ('new', 'reviewing', 'done')),
                created_at TEXT NOT NULL
            )
            """
        )
        conn.commit()
