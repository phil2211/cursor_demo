# Cloud Demo Task — Playwright E2E

Fixed instruction for the cloud agent handoff (Act 4). Keep this file stable across rehearsals.

---

Add Playwright e2e tests for Act 2: submit feedback → tag sentiment → move card New → Reviewing → Done. Configure video on failure and HTML report under `playwright-report/`. Do not change Act 2 UI behavior unless required for stable selectors. Run the full e2e suite and ensure CI-friendly exit codes.

## Minimum scenarios

1. Submit new feedback appears in New column
2. Tag sentiment visible on card
3. Move through Reviewing to Done

## Expected artifacts

- `e2e/` test suite at repo root
- `playwright-report/` HTML report after run
- Video/trace on failure (`retain-on-failure` or `on-first-retry`)

## Commands (after implementation)

```bash
npm run test:e2e          # from root or frontend wrapper
npx playwright test --reporter=html
```
