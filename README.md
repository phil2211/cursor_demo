# Feedback Pulse

A minimal customer feedback inbox for a fictional product team — built as a live Cursor demo app.

**Story:** Customers submit feedback. The team tags sentiment and triages items from New → Reviewing → Done.

## Quick start

Fresh clone → running in under 5 minutes.

### Prerequisites

- Python 3.11+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --reload-exclude '.venv/*' --port 8000
```

API docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173 (proxies `/api` to the backend)

## MVP features

- Submit feedback (message required, email optional)
- Inbox list, newest first (all items start as `new`)
- SQLite persistence with 7 seeded sample rows

See `mvp.md` for the full design specification.

## Repository layout

```
frontend/     React + Vite + Tailwind
backend/      FastAPI + SQLite
docs/         Demo specs and assets
e2e/          Playwright tests (cloud act)
AGENTS.md     Stack conventions + live rule slot
```

## Reset database

Delete `backend/data/feedback.db` and restart the backend to re-seed sample data.
