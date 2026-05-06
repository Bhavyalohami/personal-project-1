# Firestore Index Guide

`firestore.indexes.json` contains the composite indexes needed by the HMS query model.

## Important Query Families

- `appointments`: doctor schedule, patient timeline, hospital dashboards.
- `inventory`: low-stock and expiry scans by hospital.
- `stockLogs`: inventory audit history.
- `chats` and `messages`: patient-doctor chat list and ordered thread messages.
- `testSlots` and `testBookings`: diagnostic slot discovery and hospital booking reports.
- `notifications`: notification center filtered by hospital/severity and ordered by latest event.
- `auditLogs`: production audit feed filtered by hospital/module and ordered by latest event.

## Deployment

Deploy indexes before rolling out frontend code that depends on new compound queries:

```bash
firebase deploy --only firestore:indexes
```

If Firebase reports a missing index URL in console logs, add that index to `firestore.indexes.json`, commit it, and redeploy indexes before retrying the query.
