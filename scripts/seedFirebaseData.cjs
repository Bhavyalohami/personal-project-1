const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const {
  siteConfig,
  services,
  blogs,
  staff,
  locations,
  departments,
  blogCategories,
  patients,
  feedback,
  appointments,
  holidays,
} = require("../functions/seedData");
const {
  hmsHospitals,
  hmsMedia,
  hmsTests,
  hospitalTestIds,
  hmsTestSlots,
} = require("../functions/hmsSeedData");

const projectId = "clinic-appointment-booki-15481";
const apiKey = "AIzaSyAX_wvWhjTrCgAe7ZwOPHW1RSM8UoFdjow";
const password = "Demo123!";

const cliPath = path.join(process.cwd(), "node_modules", ".bin", process.platform === "win32" ? "firebase.cmd" : "firebase");
const configPath = path.join(os.homedir(), ".config", "configstore", "firebase-tools.json");

const log = (message) => process.stdout.write(`${message}\n`);

const refreshFirebaseCliToken = () => {
  try {
    execFileSync(cliPath, ["projects:list", "--json"], { stdio: "ignore" });
  } catch (error) {
    // The next read will throw a clearer message if no cached token exists.
  }
};

const accessToken = () => {
  refreshFirebaseCliToken();
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  if (!config.tokens?.access_token) {
    throw new Error("Firebase CLI is not logged in. Run `firebase login` first.");
  }
  return config.tokens.access_token;
};

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  const text = await response.text();
  const body = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(body.error?.message || `${response.status} ${response.statusText}`);
  }
  return body;
};

const authRequest = (endpoint, body) =>
  requestJson(`https://identitytoolkit.googleapis.com/v1/${endpoint}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const upsertAuthUser = async ({ email, displayName }) => {
  try {
    const created = await authRequest("accounts:signUp", {
      email,
      password,
      displayName,
      returnSecureToken: true,
    });
    return created.localId;
  } catch (error) {
    if (
      String(error.message).includes("CONFIGURATION_NOT_FOUND") ||
      String(error.message).includes("BILLING_NOT_ENABLED") ||
      String(error.message).includes("OPERATION_NOT_ALLOWED")
    ) {
      return `demo-${displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    }
    if (!String(error.message).includes("EMAIL_EXISTS")) throw error;
    const signedIn = await authRequest("accounts:signInWithPassword", {
      email,
      password,
      returnSecureToken: true,
    });
    return signedIn.localId;
  }
};

const encodeField = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return { nullValue: null };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(encodeField).filter(Boolean) } };
  }
  if (typeof value === "object") {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(value)
            .map(([key, entryValue]) => [key, encodeField(entryValue)])
            .filter(([, encoded]) => Boolean(encoded)),
        ),
      },
    };
  }
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  return { stringValue: String(value) };
};

const encodeDocument = (data) => ({
  fields: Object.fromEntries(
    Object.entries(data)
      .map(([key, value]) => [key, encodeField(value)])
      .filter(([, encoded]) => Boolean(encoded)),
  ),
});

const docUrl = (segments) =>
  `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${segments.map(encodeURIComponent).join("/")}`;

const upsertDoc = async (segments, data) => {
  await requestJson(docUrl(segments), {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(encodeDocument({
      ...data,
      updatedAt: new Date().toISOString(),
      createdAt: data.createdAt || new Date().toISOString(),
    })),
  });
};

const seedList = async (collectionName, items) => {
  for (const item of items) {
    const id = item.id || item.slug || item.username || item.name;
    await upsertDoc([collectionName, id], { id, ...item });
  }
};

const main = async () => {
  log("Creating/updating Firebase Auth users...");
  const accounts = [
    { key: "admin", email: "admin@example.com", username: "admin", roles: ["admin"], is_staff: true, is_superuser: true },
    { key: "doctor", email: "doctor@example.com", username: "nisha.rao", aliases: ["doctor"], roles: ["doctor", "staff"], is_staff: true },
    { key: "vendor", email: "vendor@example.com", username: "vendor", roles: ["vendor", "manager"], is_vendor: true },
    { key: "staff", email: "staff@example.com", username: "staff.reception", roles: ["staff"], is_staff: true },
    { key: "patient", email: "patient@example.com", username: "demo.patient", roles: ["patient"] },
  ];

  const users = {};
  for (const account of accounts) {
    const uid = await upsertAuthUser({ email: account.email, displayName: account.username });
    const profile = {
      uid,
      username: account.username,
      usernameLower: account.username.toLowerCase(),
      email: account.email,
      roles: account.roles,
      role: account.roles[0],
      is_staff: Boolean(account.is_staff),
      is_vendor: Boolean(account.is_vendor),
      is_superuser: Boolean(account.is_superuser),
      hospitalIds: ["default-hospital"],
      defaultHospitalId: "default-hospital",
      status: 1,
    };
    users[account.key] = profile;
    await upsertDoc(["users", uid], profile);
    await upsertDoc(["usernames", account.username.toLowerCase()], {
      uid,
      username: account.username,
      email: account.email,
      roles: account.roles,
    });
    for (const alias of account.aliases || []) {
      await upsertDoc(["usernames", alias], {
        uid,
        username: account.username,
        email: account.email,
        roles: account.roles,
      });
    }
  }

  log("Seeding legacy website collections...");
  await upsertDoc(["config", "site"], siteConfig);
  await upsertDoc(["config", "notifications"], { id: "notifications", email: true, sms: false, push: true });
  await seedList("services", services);
  await seedList("blogs", blogs);
  await seedList("locations", locations);
  await seedList("departments", departments);
  await seedList("blogCategories", blogCategories);
  await seedList("feedback", feedback);
  await seedList("holidays", holidays);
  await seedList("appointments", appointments.map((item) => ({ ...item, patientUid: users.patient.uid, doctorUid: users.doctor.uid })));

  const seededStaff = staff.map((doctor) =>
    doctor.username === "nisha.rao"
      ? { ...doctor, uid: users.doctor.uid, hospitalIds: ["default-hospital"], hospitalId: "default-hospital" }
      : { ...doctor, hospitalIds: ["default-hospital"], hospitalId: "default-hospital" },
  );
  await seedList("staff", seededStaff);
  await upsertDoc(["patients", users.patient.uid], {
    ...patients[0],
    id: users.patient.uid,
    uid: users.patient.uid,
    username: "demo.patient",
    email: "patient@example.com",
  });
  await upsertDoc(["vendors", users.vendor.uid], {
    id: users.vendor.uid,
    uid: users.vendor.uid,
    username: "vendor",
    name: "Hospital Manager",
    email: "vendor@example.com",
    status: 1,
    is_active: true,
    hospitalIds: ["default-hospital"],
  });

  log("Seeding HMS hospitals, members, doctors, tests, slots, and inventory...");
  for (const hospital of hmsHospitals) {
    await upsertDoc(["hospitals", hospital.id], hospital);
    const permissions = {
      hospital: ["view", "create", "update", "delete", "export"],
      staff: ["view", "create", "update", "delete", "export"],
      appointments: ["view", "create", "update", "delete", "export"],
      tests: ["view", "create", "update", "delete", "export"],
      testBookings: ["view", "create", "update", "delete", "export"],
      inventory: ["view", "create", "update", "delete", "export"],
      billing: ["view", "create", "update", "delete", "export"],
      emr: ["view", "create", "update", "delete", "export"],
      messages: ["view", "create", "update", "delete", "export"],
      notifications: ["view", "create", "update", "delete", "export"],
      reports: ["view", "export"],
      media: ["view", "create", "update", "delete"],
    };
    await upsertDoc(["hospitals", hospital.id, "members", users.admin.uid], { ...users.admin, active: true, permissions });
    await upsertDoc(["hospitals", hospital.id, "members", users.vendor.uid], { ...users.vendor, active: true, permissions });
    await upsertDoc(["hospitals", hospital.id, "members", users.staff.uid], { ...users.staff, active: true, permissions });
    await upsertDoc(["hospitals", hospital.id, "members", users.doctor.uid], { ...users.doctor, active: true, permissions: { appointments: ["view", "update"], messages: ["view", "update"], tests: ["view"], staff: ["view"] } });

    for (const media of hmsMedia[hospital.id] || []) {
      await upsertDoc(["hospitals", hospital.id, "media", media.id], media);
    }
    for (const service of services) {
      await upsertDoc(["hospitals", hospital.id, "services", service.id], { ...service, hospitalId: hospital.id, public: true });
    }
    for (const doctor of seededStaff) {
      await upsertDoc(["hospitals", hospital.id, "doctors", doctor.id], { ...doctor, hospitalId: hospital.id, public: true });
    }
    for (const test of hmsTests.filter((item) => (hospitalTestIds[hospital.id] || []).includes(item.id))) {
      await upsertDoc(["hospitals", hospital.id, "tests", test.id], { ...test, hospitalId: hospital.id });
    }
    for (const slot of hmsTestSlots.filter((item) => item.hospitalId === hospital.id)) {
      await upsertDoc(["hospitals", hospital.id, "testSlots", slot.id], slot);
    }
  }

  await upsertDoc(["hospitals", "default-hospital", "inventory", "med-paracetamol-500"], {
    id: "med-paracetamol-500",
    hospitalId: "default-hospital",
    medicineName: "Paracetamol 500mg",
    batchNo: "PCM-0526",
    stock: 120,
    lowStockThreshold: 30,
    expiryDate: "2027-02-28",
    price: 18,
  });
  await upsertDoc(["hospitals", "default-hospital", "inventory", "med-amoxicillin-250"], {
    id: "med-amoxicillin-250",
    hospitalId: "default-hospital",
    medicineName: "Amoxicillin 250mg",
    batchNo: "AMX-1126",
    stock: 42,
    lowStockThreshold: 25,
    expiryDate: "2026-11-15",
    price: 64,
  });

  log("Seeding complete.");
  log("Demo password: Demo123!");
  log("Panel users: admin@example.com, doctor@example.com, vendor@example.com, staff@example.com, patient@example.com");
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
