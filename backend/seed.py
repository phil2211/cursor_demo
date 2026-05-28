from datetime import datetime, timedelta, timezone

from database import get_connection, init_db

SAMPLE_FEEDBACK = [
    {
        "message": "Love the new dashboard layout — much easier to find what I need.",
        "email": "alex@example.com",
        "created_at": datetime.now(timezone.utc) - timedelta(hours=2),
    },
    {
        "message": "Export to CSV would save our team a lot of time each week.",
        "email": "jordan@acme.io",
        "created_at": datetime.now(timezone.utc) - timedelta(hours=5),
    },
    {
        "message": "The mobile app feels sluggish when loading large datasets.",
        "email": None,
        "created_at": datetime.now(timezone.utc) - timedelta(hours=8),
    },
    {
        "message": "Great onboarding flow! Got up and running in under ten minutes.",
        "email": "sam@startup.co",
        "created_at": datetime.now(timezone.utc) - timedelta(days=1),
    },
    {
        "message": "Would be helpful to have dark mode across all pages, not just settings.",
        "email": "taylor@design.studio",
        "created_at": datetime.now(timezone.utc) - timedelta(days=1, hours=3),
    },
    {
        "message": "Billing page shows an error when switching plans mid-cycle.",
        "email": "casey@enterprise.com",
        "created_at": datetime.now(timezone.utc) - timedelta(days=2),
    },
    {
        "message": "The search feature is fast and accurate — nice work on the indexing.",
        "email": None,
        "created_at": datetime.now(timezone.utc) - timedelta(days=3),
    },
]


def seed_if_empty() -> None:
    init_db()
    with get_connection() as conn:
        count = conn.execute("SELECT COUNT(*) FROM feedback").fetchone()[0]
        if count > 0:
            return

        for item in SAMPLE_FEEDBACK:
            conn.execute(
                """
                INSERT INTO feedback (message, email, sentiment, status, created_at)
                VALUES (?, ?, NULL, 'new', ?)
                """,
                (item["message"], item["email"], item["created_at"].isoformat()),
            )
        conn.commit()


if __name__ == "__main__":
    seed_if_empty()
    print("Seed complete.")
