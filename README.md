# StoryLoom

A creative writing app.

## Local dev

```bash
npm install
npm run dev
```

## Current UX (very early)

- `/login`: "Continue as guest" (anonymous auth)
- `/`: create a story (title input) + list your existing stories
- `/stories/:storyId`: edit the story title (Save button or press Enter) + basic scenes (list/add/edit/delete)
- `/settings`: placeholder settings page

## Firebase setup (optional for now)

The app renders without Firebase, but auth is disabled until you configure it.

1. Copy env template:

```bash
cp .env.example .env.local
```

2. Fill in `VITE_FIREBASE_*` values from your Firebase project settings.

3. In Firebase Auth, enable **Anonymous** sign-in (temporary flow).

Then refresh the app and click “Continue as guest”.
