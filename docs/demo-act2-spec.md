# Act 2 Spec — Sentiment & Triage

> **Status:** Template — to be filled in during Plan mode on stage.

## Goal

Extend Feedback Pulse with sentiment tagging and a triage board so the team can move items from New → Reviewing → Done.

## Scope

### 1. Sentiment tagging

- Chips on each feedback row: positive, neutral, negative
- `PATCH /api/feedback/{id}` persists `{ sentiment }`
- Visual distinction per sentiment

### 2. Triage board

- Columns: **New** → **Reviewing** → **Done**
- Click or drag to change status
- `PATCH /api/feedback/{id}` persists `{ status }`

### 3. Filter (nice-to-have)

- Simple filter by sentiment; cut if running long

### 4. States

- Loading and empty states — no blank broken UI during edits

## Acceptance criteria

- [ ] Can tag an item positive/neutral/negative and refresh persists
- [ ] Can move item New → Reviewing → Done
- [ ] Inbox and board stay in sync with API
- [ ] Integrated browser shows changes without manual hard refresh

## Out of scope

- Authentication / multi-tenant
- Email or webhook ingestion
- LLM auto-tagging
- External integrations
- Production deployment

## Technical notes

- Use stable `data-testid` attributes for e2e selectors
- Vite HMR should reflect changes live in Cursor's integrated browser
