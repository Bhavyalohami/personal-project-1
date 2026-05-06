# Firebase-Native Backend

This repo is now prepared to replace Django with Firebase services:

- Firebase Hosting serves the React build.
- Firebase Auth handles patient, admin, doctor, and vendor login.
- Firestore stores services, blogs, doctors, appointments, patients, configuration, feedback, contacts, and notifications.
- Cloud Storage stores public assets and patient documents.
- Cloud Functions exposes `/clinic/**` compatibility routes so the existing React screens can migrate without changing every URL at once.

## Required Firebase Console Setup

1. Open the Firebase project `clinic-appointment-booki-15481`.
2. Add a Web App and copy the SDK config values into `.env`.
3. Enable Authentication > Sign-in method > Email/Password.
4. Create a Firestore database.
5. Enable Cloud Storage.
6. Upgrade to the Blaze plan before deploying Cloud Functions.

## Local `.env`

Copy `.env.example` to `.env` and fill in the Firebase web config:

```bash
copy .env.example .env
```

React only reads env vars when the dev server starts, so restart `npm start` after editing `.env`.

## Local Demo API

Until Firebase CLI is logged in and the real project is deployed, run the local Firebase-compatible API:

```bash
npm run mock:api
```

The React dev server now uses `http://127.0.0.1:5050/` by default in development. This mock serves demo doctors, services, blogs, clinic configuration, feedback, appointment slots, and demo appointment saves.

## Deploy Firebase

After `npx firebase-tools login` succeeds:

```bash
npx firebase-tools deploy --project clinic-appointment-booki-15481
```

## Seed Demo Data In Firestore

After deploy, set `FIRST_ADMIN_SETUP_TOKEN`, then seed demo data:

```bash
curl -X POST "https://asia-south1-clinic-appointment-booki-15481.cloudfunctions.net/api/clinic/seed-demo-data/" \
  -H "Content-Type: application/json" \
  -d "{\"setupToken\":\"YOUR_SETUP_TOKEN\"}"
```

The same seed data is used by `functions/seedData.js` and the local mock API.

## Create First Admin

Set `FIRST_ADMIN_SETUP_TOKEN` as a Cloud Functions env/secret value, then call:

```bash
curl -X POST "https://asia-south1-clinic-appointment-booki-15481.cloudfunctions.net/api/clinic/setup-first-admin/" \
  -H "Content-Type: application/json" \
  -d "{\"setupToken\":\"YOUR_SETUP_TOKEN\",\"email\":\"admin@example.com\",\"password\":\"StrongPassword123!\",\"username\":\"admin\"}"
```

After the first admin exists, remove or rotate the setup token.

## Important Migration Note

This removes Django from the target architecture, but old Django files are still present in the repo as reference until every admin screen and data import has been verified on Firebase. The app should be deployed against Firebase Hosting, Firestore, Storage, Auth, and Functions.
