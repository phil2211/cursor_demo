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
uvicorn main:app --reload --port 8000
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

## Demo script outline

| Act | Mode | Goal |
|-----|------|------|
| 0–2 min | Narration | Tour MVP in integrated browser |
| 2-3 min | **Plan** | Go to plan mode to build next feature |
| 3–8 min | **Plan** | Approve `docs/demo-act2-spec.md` |
| 8–20 min | **Agent** | Sentiment chips + triage board |
| 20–25 min | **Agent + AGENTS.md** | Style/copy rules |
| 25–28 min | **Cloud agent** | Playwright e2e from `docs/demo-cloud-task.md` |
| 28–30 min | Close | Show video/trace artifacts |

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
