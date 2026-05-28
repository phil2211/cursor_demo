# Cursor Live Demo — Feedback Pulse Design Specification

## Document status

| Field | Value |
|-------|-------|
| Date | 2026-05-28 |
| Audience | Mixed technical + product |
| Duration | 20–30 minutes live |
| Approach | Split stage (local story + rehearsed cloud task) |
| Approved | 2026-05-28 (brainstorming sign-off) |

## 1. Purpose

Build a **small, reliable web application** used as a **live Cursor demo**. The app must be instantly understandable, visually rewarding in Cursor’s **integrated browser**, and structured so three Cursor workflows are the hero beats:

1. **Agent end-to-end** — natural-language feature → multi-file implementation → running UI
2. **Rules / project memory** — `AGENTS.md` or `.cursor/rules` changes agent behavior on the next prompt
3. **Plan then build** — Plan mode produces a tight spec → Agent implements only that scope

**Differentiating wow moments** (non-negotiable for this demo):

- **Instant UI updates** in Cursor’s integrated browser (HMR while Agent edits)
- **Local → cloud agent handoff** with a **pre-rehearsed, fixed** cloud prompt
- **Test screen recordings** (Playwright video/trace) shown when cloud work completes

## 2. Product: Feedback Pulse

A minimal **customer feedback inbox** for a fictional product team.

### 2.1 User-facing story (30-second pitch)

“Customers submit feedback. The team tags sentiment and triages items from New → Reviewing → Done.”

### 2.2 Pre-stage MVP (on screen at demo open)

Must already work before the live segment begins:

| Capability | Detail |
|------------|--------|
| Submit feedback | Message (required), optional email, auto `created_at` |
| Inbox list | Newest first; all items status `new` |
| Persistence | FastAPI + SQLite |
| UI | React (Vite) + Tailwind; clean, professional default theme |
| Seed data | 5–8 sample feedback rows so inbox is never empty |
| Dev startup | Documented scripts: backend `uvicorn`, frontend `npm run dev` |

### 2.3 Explicitly out of scope (live segment)

- Authentication / multi-tenant
- Email or webhook ingestion
- LLM auto-tagging
- Google Drive or external integrations
- Production deployment

Mention these only as a roadmap line during narration.

## 3. Architecture & tech stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind | Fast HMR for integrated browser wow |
| Backend | FastAPI + Python 3.11+ | Small API surface; familiar to mixed audience |
| Database | SQLite (single file, e.g. `backend/data/feedback.db`) | No Docker on stage; portable |
| E2E tests | Playwright (TypeScript) | Video/trace artifacts for cloud act |
| Repo layout | Monorepo: `frontend/`, `backend/`, `e2e/`, `docs/` | Agent can navigate with `@` context |

### 3.1 Data model

**Table: `feedback`**

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID or integer PK | |
| `message` | text | Required |
| `email` | text nullable | Optional submitter |
| `sentiment` | enum nullable | `positive`, `neutral`, `negative` — null until tagged (Act 2) |
| `status` | enum | `new`, `reviewing`, `done` — MVP uses only `new` |
| `created_at` | ISO datetime | Server-set |

### 3.2 API (MVP + Act 2)

**MVP**

- `GET /api/feedback` — list, newest first
- `POST /api/feedback` — create `{ message, email? }`

**Act 2 (live build)**

- `PATCH /api/feedback/{id}` — update `{ sentiment? }`, `{ status? }`, or both

**Errors**

- 422 validation errors with `{ detail: string }` shape
- UI shows one-sentence user-facing message (reinforced by rules in Act 3)

### 3.3 Frontend structure (target)

```
frontend/src/
  components/     # FeedbackForm, FeedbackList, SentimentChips, TriageBoard
  api/            # typed client for /api/feedback
  types/          # Feedback, Sentiment, Status
  App.tsx
```

Keep file count small (~15–25 source files total across repo) so multi-file Agent edits are visible but not overwhelming.

## 4. Demo script (Split stage — recommended approach)

### 4.1 Hero beat mapping

| Minute | Beat | Mode | Artifact / outcome |
|--------|------|------|-------------------|
| 0–2 | MVP tour | Narration | Integrated browser: submit + list |
| 2–8 | Plan then build | **Plan** | Approve `docs/demo-act2-spec.md` |
| 8–20 | Agent end-to-end | **Agent (local)** | Sentiment + triage board live in browser |
| 20–25 | Rules | **Agent + AGENTS.md** | Colors, copy, error UX per rules |
| 25–28 | Cloud handoff | **Cloud agent** | Fixed prompt from `docs/demo-cloud-task.md` |
| 28–30 | Wow close | Show artifacts | Playwright video/trace + recap |

### 4.2 Act 2 scope (live implementation)

Defined in `docs/demo-act2-spec.md` (created during Plan mode on stage, ≤1 page):

1. **Sentiment tagging** — chips on each row; PATCH persists; visual distinction per sentiment
2. **Triage board** — columns: New → Reviewing → Done; click or drag to change status
3. **Filter** — optional simple filter by sentiment (nice-to-have if time; cut if running long)
4. **Empty / loading states** — no blank broken UI during Agent edits

**Acceptance bullets** (for spec template):

- [ ] Can tag an item positive/neutral/negative and refresh persists
- [ ] Can move item New → Reviewing → Done
- [ ] Inbox and board stay in sync with API
- [ ] Integrated browser shows changes without manual hard refresh

### 4.3 Act 3 — Rules beat

On stage, add or extend `AGENTS.md` at repo root with a short rule block, for example:

- Negative sentiment uses **amber** styling, not red
- User-facing errors: one sentence, no stack traces in UI
- UI copy: concise, no internal jargon

**Second local prompt (scripted):** “Apply inbox rules to sentiment chips and error handling.”

Audience should see constrained, consistent changes across components without re-specifying the feature.

### 4.4 Act 4 — Cloud agent (pre-rehearsed)

**Fixed instruction file:** `docs/demo-cloud-task.md`

Content (stable across rehearsals):

> Add Playwright e2e tests for Act 2: submit feedback → tag sentiment → move card New → Reviewing → Done. Configure video on failure and HTML report under `playwright-report/`. Do not change Act 2 UI behavior unless required for stable selectors. Run the full e2e suite and ensure CI-friendly exit codes.

**Narration line:** “Same cloud task we rehearsed — it extends test coverage while we wrap up.”

**Requirements before demo day:**

- Repo pushed to GitHub (cloud agent needs remote)
- Cloud agent run completed at least once; recordings/traces verified
- Fallback clip in `docs/demo-assets/` from last successful rehearsal if live cloud is slow

### 4.5 Integrated browser

- Keep **browser pane visible** in split view during Act 2 and Act 3
- Pre-seed 2–3 “demo clicks” (submit, tag, triage) practiced with window layout
- Vite proxy to API (`/api` → `localhost:8000`) to avoid CORS noise on stage

## 5. Repository artifacts (checklist)

| File | Purpose |
|------|---------|
| `docs/demo-act2-spec.md` | Created/approved in Plan mode (template can ship pre-empty) |
| `docs/demo-cloud-task.md` | Fixed cloud delegation prompt |
| `AGENTS.md` | Stack conventions + slot for live rule injection |
| `README.md` | One-command dev startup + demo script outline |
| `docs/demo-assets/` | Fallback recording from rehearsal (optional mp4 or link to trace) |
| `.cursor/rules` (optional) | Duplicate critical rules if preferred over AGENTS.md |

## 6. Playwright & recordings

- **Location:** `e2e/` at repo root; document commands in root `README.md`
- **Config:** `video: 'on-first-retry'` or `'retain-on-failure'`; `trace: 'on-first-retry'`
- **Scripts:** `npm run test:e2e` from frontend or root `package.json` wrapper
- **CI-local:** `npx playwright test --reporter=html`
- **Demo close:** Open `playwright-report/` or cloud agent attachment UI showing triage flow recording

**Minimum e2e scenarios (cloud task):**

1. Submit new feedback appears in New column
2. Tag sentiment visible on card
3. Move through Reviewing to Done

## 7. Error handling & fallbacks

| Risk | Mitigation |
|------|------------|
| Cloud agent slow | Show `docs/demo-assets/rehearsal-recording.mp4` while waiting |
| API down | MVP rehearsal includes restart script in README |
| Agent scope creep | Plan spec explicitly lists out-of-scope items |
| HMR not updating | Hard refresh once; pre-rehearse Vite proxy |
| Playwright flaky | Stable `data-testid` attributes required in Act 2 spec |

## 8. Success criteria

**Demo day**

- Mixed audience understands product story without code explanation
- Plan → spec → local build visible in &lt;20 minutes
- Rules prompt produces observable style/copy change
- Cloud task completes in rehearsal; live or fallback recording plays

**Repository**

- Fresh clone → MVP running in &lt;5 minutes (documented)
- Single rehearsed cloud prompt reproducibly adds/tests Act 2 flows

## 9. Alternatives considered (not selected)

| Approach | Why not chosen |
|----------|----------------|
| Cloud builds Act 2 live | Timing risk in 20–30 min slot |
| Tests-only cloud with no local feature build | Weakens Agent hero beat |
| Frontend-only + localStorage | User chose full-stack (FastAPI + SQLite) |
| Empty repo start | User chose MVP-on-stage (option C) |

## 10. Next steps

1. User reviews this spec (gate before implementation plan)
2. Invoke **writing-plans** skill to produce implementation plan for Feedback Pulse MVP + demo artifacts
3. Implement in order: MVP scaffold → demo docs → rehearsal → cloud task validation

