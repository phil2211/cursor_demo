# Feedback Pulse — Agent conventions

Stack and conventions for Cursor agents working in this repo.

## Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS (`frontend/`)
- **Backend:** FastAPI, Python 3.11+, SQLite (`backend/`)
- **E2E:** Playwright TypeScript (`e2e/` — added during cloud demo act)

## Layout

```
frontend/src/
  components/   # UI components
  api/          # Typed fetch client for /api/feedback
  types/        # Shared TypeScript types
backend/
  main.py       # FastAPI app + routes
  database.py   # SQLite connection
  schemas.py    # Pydantic models
  seed.py       # Sample data on first run
```

## API

- `GET /api/feedback` — list all, newest first
- `POST /api/feedback` — create `{ message, email? }`
- `PATCH /api/feedback/{id}` — update sentiment/status (Act 2, live demo)

## Dev commands

```bash
# Backend (from backend/)
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --reload-exclude '.venv/*' --port 8000

# Frontend (from frontend/)
npm install
npm run dev
```

Vite proxies `/api` → `http://localhost:8000`.

## Conventions

- Keep components small and focused; prefer `data-testid` for e2e selectors.
- User-facing errors: one sentence, no stack traces in the UI.
- UI copy: concise, no internal jargon.
- Match existing Tailwind patterns (slate neutrals, indigo accents).

## Live demo rule slot

<!-- Rules injected during Act 3 of the live demo go below this line -->
