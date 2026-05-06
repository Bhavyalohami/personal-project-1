const fs = require("fs");
const path = require("path");
const {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} = require("@firebase/rules-unit-testing");
const {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} = require("firebase/firestore");

const projectId = "carebridge-hms-rules-test";
const rules = fs.readFileSync(path.resolve(__dirname, "../../firestore.rules"), "utf8");

async function main() {
  let testEnv;

  try {
    testEnv = await initializeTestEnvironment({
      projectId,
      firestore: {
        host: process.env.FIRESTORE_EMULATOR_HOST?.split(":")[0] || "127.0.0.1",
        port: Number(process.env.FIRESTORE_EMULATOR_HOST?.split(":")[1] || 8080),
        rules,
      },
    });
  } catch (error) {
    console.log(
      "Firestore emulator is not running; skipping rules tests. Start it with `firebase emulators:start --only firestore` and rerun `npm run test:rules`.",
    );
    return;
  }

  const authedDb = (uid, token = {}) =>
    testEnv.authenticatedContext(uid, token).firestore();
  const anonDb = () => testEnv.unauthenticatedContext().firestore();

  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, "users/admin"), {
      uid: "admin",
      role: "admin",
      roles: ["admin"],
      is_superuser: true,
    });
    await setDoc(doc(db, "users/patient-a"), {
      uid: "patient-a",
      roles: ["patient"],
      is_superuser: false,
      is_staff: false,
      is_vendor: false,
    });
    await setDoc(doc(db, "users/doctor-a"), {
      uid: "doctor-a",
      roles: ["doctor"],
      is_staff: true,
    });
    await setDoc(doc(db, "hospitals/default-hospital"), {
      name: "CareBridge Hospital",
      status: "active",
      public: true,
      hospitalId: "default-hospital",
    });
    await setDoc(doc(db, "hospitals/default-hospital/members/doctor-a"), {
      uid: "doctor-a",
      active: true,
      permissions: {
        appointments: ["view", "update"],
        inventory: ["view"],
        messages: ["view", "update"],
        reports: ["view"],
        notifications: ["view"],
      },
    });
    await setDoc(doc(db, "hospitals/default-hospital/inventory/med-a"), {
      hospitalId: "default-hospital",
      medicineName: "Paracetamol",
      stock: 12,
    });
    await setDoc(doc(db, "hospitals/default-hospital/auditLogs/audit-a"), {
      hospitalId: "default-hospital",
      module: "inventory",
      action: "low-stock-check",
      createdAt: "2026-05-05T00:00:00.000Z",
    });
    await setDoc(doc(db, "hospitals/default-hospital/notifications/notify-a"), {
      hospitalId: "default-hospital",
      doctorUid: "doctor-a",
      title: "Low stock",
      createdAt: "2026-05-05T00:00:00.000Z",
    });
  });

  const admin = authedDb("admin", { admin: true, role: "admin" });
  const patient = authedDb("patient-a");
  const doctor = authedDb("doctor-a");

  await assertSucceeds(getDoc(doc(anonDb(), "hospitals/default-hospital")));
  await assertFails(getDoc(doc(patient, "hospitals/default-hospital/inventory/med-a")));
  await assertSucceeds(getDoc(doc(doctor, "hospitals/default-hospital/inventory/med-a")));
  await assertSucceeds(getDoc(doc(doctor, "hospitals/default-hospital/auditLogs/audit-a")));
  await assertSucceeds(updateDoc(doc(doctor, "hospitals/default-hospital/notifications/notify-a"), {
    isRead: true,
  }));
  await assertFails(setDoc(doc(patient, "hospitals/default-hospital/auditLogs/audit-b"), {
    module: "inventory",
  }));
  await assertSucceeds(setDoc(doc(admin, "hospitals/branch-a"), {
    hospitalId: "branch-a",
    name: "Branch A",
    status: "draft",
  }));

  await testEnv.cleanup();
  console.log("Firestore rules production checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
