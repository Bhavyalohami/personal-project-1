# Firebase Migration Plan

This project currently has a React frontend and a Django REST backend. Firebase Hosting can serve the React build immediately, but Firebase Functions should not be treated as a drop-in Django host. For the backend, there are two practical paths.

## Path A: Fastest Serverless Migration

Keep the Django API, containerize it, and deploy it on Google Cloud Run. Then use Firebase Hosting rewrites so `/clinic/**` points to the Cloud Run service.

Use this path if you want the current app to go serverless with the least rewrite.

Main work:
- Move Django secrets out of source code into environment variables.
- Replace local/MySQL settings with Cloud SQL or another managed database.
- Store uploaded media in Cloud Storage instead of local media folders.
- Deploy Django as a Cloud Run container.
- Configure Firebase Hosting to serve React and route API requests to Cloud Run.

## Path B: Full Firebase-Native Backend

Rewrite the Django backend around Firebase services:

- Firebase Authentication: admin, doctor/staff, patient, and vendor login.
- Cloud Firestore: app data and booking records.
- Cloud Storage: staff images, service images, blog images, patient documents.
- Cloud Functions: booking workflow, Stripe payment actions, notifications, slot generation, admin-only writes.
- Firestore Security Rules: role-based protection for patients, doctors, vendors, and admins.

Use this path if you want to remove Django completely.

Suggested Firestore collections:
- `users`: shared auth profile and roles.
- `patients`: patient profile details.
- `staff`: doctors and staff.
- `vendors`: vendor profile details.
- `services`: clinic services.
- `blogs`: blog posts and categories.
- `appointments`: bookings and cancellation status.
- `dateSlots`: generated doctor slots.
- `defaultSlots`: weekly doctor slot templates.
- `holidays`: doctor unavailable dates.
- `feedback`: patient reviews.
- `notifications`: doctor/admin notification feed.
- `config`: logo, social links, timings, currency, address.
- `documents`: patient document metadata, with files in Cloud Storage.

## What You Should Do First

1. Create a Firebase project in the Firebase console.
2. Copy the Firebase project ID.
3. Install the Firebase CLI:

```bash
npm install -g firebase-tools
```

4. Log in:

```bash
firebase login
```

5. From this project folder, connect the repo to your Firebase project:

```bash
firebase use --add
```

6. Build and deploy the React frontend:

```bash
npm run build
firebase deploy --only hosting
```

## Official Docs

- Firebase Hosting: https://firebase.google.com/docs/hosting/quickstart
- Firebase Web SDK: https://firebase.google.com/docs/web/setup
- Cloud Functions for Firebase: https://firebase.google.com/docs/functions/get-started
- Firebase Hosting with Cloud Run: https://firebase.google.com/docs/hosting/cloud-run
- Firestore Security Rules: https://firebase.google.com/docs/firestore/security/get-started
- Cloud Storage for Firebase: https://firebase.google.com/docs/storage/web/start
