# CareBridge Firebase HMS Architecture

This project is being migrated from a clinic appointment app into a multi-hospital Hospital Management System while keeping the existing appointment flow working.

## Architecture

- Firebase Auth owns identity.
- Firestore `users/{uid}` owns profile, role, hospital access, and legacy flags.
- Auth custom claims store fast global role data: `role`, `roles`, `admin`, `hospitalIds`.
- Hospital-owned data is isolated below `hospitals/{hospitalId}`.
- Cloud Functions perform trusted writes: role assignment, inventory stock transactions, chat lifecycle, invoices, alerts, and audit logs.
- Existing root collections remain readable for public website compatibility. Admin-only management writes are locked in rules.

## Core Collections

```txt
hospitals/{hospitalId}
hospitals/{hospitalId}/members/{uid}
hospitals/{hospitalId}/doctors/{doctorId}
hospitals/{hospitalId}/staff/{staffId}
hospitals/{hospitalId}/patients/{patientId}
hospitals/{hospitalId}/media/{mediaId}
hospitals/{hospitalId}/services/{serviceId}
hospitals/{hospitalId}/tests/{testId}
hospitals/{hospitalId}/testSlots/{slotId}
hospitals/{hospitalId}/appointments/{appointmentId}
hospitals/{hospitalId}/inventory/{medicineId}
hospitals/{hospitalId}/inventory/{medicineId}/stockLogs/{logId}
hospitals/{hospitalId}/billing/{invoiceId}
hospitals/{hospitalId}/emr/{recordId}
hospitals/{hospitalId}/prescriptions/{prescriptionId}
hospitals/{hospitalId}/chats/{chatId}
hospitals/{hospitalId}/chats/{chatId}/messages/{messageId}
hospitals/{hospitalId}/alerts/{alertId}
hospitals/{hospitalId}/auditLogs/{auditId}
testBookings/{bookingId}
users/{uid}
roles/{roleId}
permissions/{permissionId}
```

## Location Discovery

- Patients can use `/hospitals` to select a city manually or use browser GPS.
- The selected location is stored in local state/localStorage and reused as hospital context.
- Hospital cards read public hospital documents from `hospitals` with `location.city`, `location.lat`, `location.lng`, and `location.geoHash`.
- The UI supports both list and Google Maps embed views.
- `/hospitals/{hospitalId}` renders the public hospital profile, media, services, doctors, map, and test booking slots.

## Test Booking

```txt
hospitals/{hospitalId}/tests/{testId}
hospitals/{hospitalId}/testSlots/{slotId}
testBookings/{bookingId}
```

Test bookings duplicate small display fields like `hospitalName`, `testName`, `date`, and `startTime` to avoid joins in patient/admin panels. Slot capacity is reduced by the trusted HMS Cloud Function API when a booking is created.

## Admin-Only Modules

These are admin-only in routing/sidebar/rules for management writes:

- Consultation Queries
- Configurations
- Content
- Manage Content
- Manage Blogs
- Blog Categories
- Manage Services
- Departments
- Locations
- Enquiries
- Feedback

Public reads remain available where the marketing/booking website needs them, such as blogs, services, departments, locations, and feedback.

## Cloud Function Endpoints

```txt
GET  /hms/schema
POST /hms/setup-default-hospital
GET  /hms/hospitals
POST /hms/hospitals
GET  /hms/discovery/hospitals
GET  /hms/hospitals/:hospitalId/profile
PATCH /hms/hospitals/:hospitalId/profile
POST /hms/hospitals/:hospitalId/media
POST /hms/users/:uid/role
POST /hms/hospitals/:hospitalId/members
GET  /hms/hospitals/:hospitalId/tests
POST /hms/hospitals/:hospitalId/tests
GET  /hms/hospitals/:hospitalId/test-slots
POST /hms/hospitals/:hospitalId/test-slots
GET  /hms/hospitals/:hospitalId/test-bookings
POST /hms/hospitals/:hospitalId/test-bookings
GET  /hms/hospitals/:hospitalId/inventory
POST /hms/hospitals/:hospitalId/inventory
POST /hms/hospitals/:hospitalId/inventory/:medicineId/adjust-stock
POST /hms/hospitals/:hospitalId/appointments
GET  /hms/hospitals/:hospitalId/chats
POST /hms/hospitals/:hospitalId/chats/request
POST /hms/hospitals/:hospitalId/chats/:chatId/accept
POST /hms/hospitals/:hospitalId/chats/:chatId/messages
POST /hms/hospitals/:hospitalId/chats/:chatId/close
POST /hms/hospitals/:hospitalId/invoices
```

## Triggers

- `onInventoryWrite`: creates low-stock alerts when stock is below threshold.
- `onAppointmentWrite`: audit logs appointment creation/status changes and notifies patients.
- `dailyExpiryAlerts`: scheduled expiry scan for medicine expiring within 30 days.
- Test booking capacity reduction happens in a transaction inside `POST /hms/hospitals/:hospitalId/test-bookings`.

## Implementation Order

1. Deploy Firestore rules and indexes.
2. Enable Firebase Storage in the Firebase Console, then deploy `storage.rules`.
3. Upgrade the Firebase project to Blaze so Cloud Functions v2 can enable Cloud Build and Artifact Registry.
4. Deploy functions and hosting together, because hosting rewrites both `/clinic/**` and `/hms/**` to the `api` function.
5. Login as admin and call `POST /hms/setup-default-hospital` when reseeding is needed.
6. Move real staff/doctors into hospital membership using `POST /hms/users/:uid/role`.
7. Start writing new appointments to `/hms/hospitals/:hospitalId/appointments`.
8. Keep old `/clinic/booking/` flow live during migration; it now mirrors appointments into the default hospital.
9. Add production FCM tokens to `users/{uid}.fcmTokens` for notifications.
10. Gradually move UI modules from legacy root collections to hospital-scoped collections.

## Current Deployment Status

- Firestore rules and indexes are deployed to `clinic-appointment-booki-15481`.
- Starter HMS data is seeded in Firestore for three public hospitals, hospital media, hospital services, doctors, tests, and test slots.
- Local React build passes and the local mock API supports `/hms/**` for development.
- Functions and Hosting are intentionally not deployed yet because Cloud Functions deployment is blocked until the project is upgraded to Blaze.
- Storage rules are ready, but Firebase Storage must be initialized in the Firebase Console before they can be deployed.
