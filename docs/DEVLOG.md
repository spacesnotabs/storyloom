# Devlog

## 2026-01-30
- Initialized repo, scaffolded Vite + React + TS
- Added Firebase client dependency (Auth + Firestore planned)
- Added Vitest + Testing Library + CI workflow
- Wrote initial product + architecture notes
- Added minimal routing + auth gate shell (login route, protected home route)
- Added Firebase env config loader + .env.example (renders “missing config” UI when not set)

### Checkpoint — dev block (early afternoon)
- Elapsed: ~30 minutes
- Commits:
  - 3e107d9
  - 3463fd9
  - 2336033
  - 836d621
  - 8a88bc2
  - fffe3b9
  - b18aa48
  - 60a5c1e
  - 4eea400
  - 2f62317
- Changelog:
  - Home now lists your stories (Firestore query) and lets you create a new story with a custom title (Enter-to-create).
  - Story page has a better title-save UX (dirty state + Save disabled when unchanged; Enter-to-save) + tests.
  - Added a placeholder Settings page + updated README/architecture docs + added a screenshot in `docs/screenshots/2026-01-30-login.png`.

Next:
- Hook up non-anonymous auth (Google/email) + wire Settings to account prefs
- Add story content model (chapters/scenes) and an actual editor UI

### Checkpoint — dev block (evening)
- Elapsed: ~30 minutes
- Commits:
  - 68a2df8
- Changelog:
  - Added Firestore `deleteStoryById()` helper.
  - Story page now has a “Delete story” button with a confirm prompt; after delete, it returns you to Home.
  - Added a StoryPage delete-flow unit test.
