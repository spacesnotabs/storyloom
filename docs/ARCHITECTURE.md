# Architecture

## Stack
- Frontend: Vite + React + TypeScript
- Hosting: Firebase Hosting
- Auth: Firebase Auth
- DB: Firestore

## Current code organization
- `src/auth/` Firebase config + auth context/provider
- `src/pages/` route pages (login, home, story)
- `src/routes/` route wrappers (e.g. `RequireAuth`)
- `src/stories/` story domain types + Firestore calls

## Firestore data model (early)

### `stories/{storyId}`
- `title: string`
- `ownerUid: string`
- `createdAt: serverTimestamp`
- `updatedAt: serverTimestamp`

### `stories/{storyId}/scenes/{sceneId}`
- `body: string`
- `createdAt: serverTimestamp`
- `updatedAt: serverTimestamp`

Queries currently used:
- List stories for a user, ordered by `updatedAt desc`
- List scenes for a story, ordered by `createdAt asc`

Note: Firestore may require a composite index for `ownerUid == ...` + `orderBy(updatedAt)`.

## Testing
- Unit/UI: Vitest + Testing Library
- CI: GitHub Actions
