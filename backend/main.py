from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import get_connection, init_db
from schemas import FeedbackCreate, FeedbackResponse, FeedbackUpdate
from seed import seed_if_empty

app = FastAPI(title="Feedback Pulse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()
    seed_if_empty()


def row_to_response(row) -> FeedbackResponse:
    return FeedbackResponse(
        id=row["id"],
        message=row["message"],
        email=row["email"],
        sentiment=row["sentiment"],
        status=row["status"],
        created_at=datetime.fromisoformat(row["created_at"]),
    )


@app.get("/api/feedback", response_model=list[FeedbackResponse])
def list_feedback() -> list[FeedbackResponse]:
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT * FROM feedback ORDER BY created_at DESC"
        ).fetchall()
    return [row_to_response(row) for row in rows]


@app.post("/api/feedback", response_model=FeedbackResponse, status_code=201)
def create_feedback(payload: FeedbackCreate) -> FeedbackResponse:
    created_at = datetime.now(timezone.utc).isoformat()
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO feedback (message, email, sentiment, status, created_at)
            VALUES (?, ?, NULL, 'new', ?)
            """,
            (payload.message.strip(), payload.email, created_at),
        )
        conn.commit()
        row = conn.execute(
            "SELECT * FROM feedback WHERE id = ?", (cursor.lastrowid,)
        ).fetchone()

    if row is None:
        raise HTTPException(status_code=500, detail="Failed to create feedback.")
    return row_to_response(row)


@app.patch("/api/feedback/{feedback_id}", response_model=FeedbackResponse)
def update_feedback(
    feedback_id: int, payload: FeedbackUpdate
) -> FeedbackResponse:
    updates = payload.model_dump(exclude_unset=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update.")

    set_clause = ", ".join(f"{field} = ?" for field in updates)
    values = list(updates.values()) + [feedback_id]

    with get_connection() as conn:
        cursor = conn.execute(
            f"UPDATE feedback SET {set_clause} WHERE id = ?",
            values,
        )
        conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Feedback not found.")

        row = conn.execute(
            "SELECT * FROM feedback WHERE id = ?", (feedback_id,)
        ).fetchone()

    if row is None:
        raise HTTPException(status_code=404, detail="Feedback not found.")
    return row_to_response(row)
