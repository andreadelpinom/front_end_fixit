# FixIt Mobile (React Native + Expo)

This is the React Native (Expo) mobile app for FixIt. It mirrors the current web SPA routes with a native navigation structure and is now STANDALONE (can live in its own repo).

## Tech stack
- Expo SDK 51 (React Native 0.74)
- React Navigation (stack + bottom tabs)
- TypeScript
- Local shared types under `src/shared/*` (no monorepo dependency)

## Project layout
- `App.tsx` – Root navigation and providers
- `src/state/auth.tsx` – Minimal auth state
- `src/screens/*` – Placeholder screens mapping from the web app
- `src/services/api.ts` – API client targeting your backend (`/api`)

## Running locally
1. Install dependencies inside mobile (standalone):

```bash
cd mobile
npm install
```

2. Start your backend (optional, for local API at 8080). If your backend lives in another repo or is deployed, just ensure API_URL points to it.
```bash
# Example if backend is in another project
# npm run dev
```

3. Start the mobile app:
```bash
cd mobile
npm start
```

- Use the Expo app (iOS/Android) or an emulator to run it.
- If testing against your local API from a device, update `API_URL` via app config (see below) to your machine LAN IP, e.g. `http://192.168.0.10:8080/api`.

## Configure API URL
`src/services/api.ts` reads `expo.extra.API_URL` from `app.json` (falls back to `http://localhost:8080/api`). To point to a deployed backend or your LAN IP, set:

```json
{
  "expo": {
    "extra": {
      "API_URL": "http://192.168.0.10:8080/api"
    }
  }
}
```

## Splitting to a new repository
This `mobile/` app is ready to be pushed to its own repo:

```bash
cd mobile
git init
git add .
git commit -m "chore: bootstrap FixIt mobile app (Expo RN)"
git branch -M main
git remote add origin <URL_OF_YOUR_NEW_REPO>
git push -u origin main
```

## Notes
- Standalone: no dependency on parent workspace.
- For production, replace placeholder auth with your real flow and secure storage tokens.