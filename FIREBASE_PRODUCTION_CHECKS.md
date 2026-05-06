# Firebase Production Checks

Use this checklist before every production Firebase deployment.

## Required Checks

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Run browser journeys:
   ```bash
   npm run test:e2e
   ```

3. Run Firestore rules checks with the emulator:
   ```bash
   firebase emulators:start --only firestore
   npm run test:rules
   ```

4. Deploy rules and indexes before hosting/functions when schema changes:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```

5. Deploy Functions and Hosting:
   ```bash
   firebase deploy --only functions,hosting
   ```

## HMS Signals To Verify

- Admin can manage global configuration, content, services, locations, blogs, enquiries, and feedback.
- Manager/vendor can only manage assigned hospital profile, staff, inventory, tests, slots, and hospital bookings.
- Doctor can only view/update assigned slots, holidays, appointments, patients, and messages.
- Patient can discover hospitals, book appointments, book tests, upload/view documents, and request doctor chat.
- Audit logs are created for role changes, inventory stock adjustments, bookings, test-slot capacity changes, and chat lifecycle changes.
- Notifications are created for new bookings, test bookings, low stock, expiring medicine, chat requests, and cancelled/rescheduled appointments.

## Firestore Emulator Notes

`npm run test:rules` intentionally skips if the Firestore emulator is not running. Start the emulator first when validating production rules locally.
