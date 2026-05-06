const express = require("express");
const cors = require("cors");
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentWritten} = require("firebase-functions/v2/firestore");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {initializeApp} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");
const {getMessaging} = require("firebase-admin/messaging");
const {
  FieldValue,
  Timestamp,
  getFirestore,
} = require("firebase-admin/firestore");
const Stripe = require("stripe");
const {
  siteConfig,
  seedCollections,
  staff: seedStaff,
  feedback: seedFeedback,
  patients: seedPatients,
  holidays: seedHolidays,
  buildMonthlySlots,
} = require("./seedData");
const {
  hmsHospitals,
  hmsMedia,
  hmsTests,
  hospitalTestIds,
  hmsTestSlots,
} = require("./hmsSeedData");

initializeApp();

const app = express();
const db = getFirestore();
const DEFAULT_HOSPITAL_ID = "default-hospital";
const HMS_MODULES = [
  "hospital",
  "appointments",
  "patients",
  "inventory",
  "staff",
  "billing",
  "emr",
  "media",
  "tests",
  "testBookings",
  "messages",
  "notifications",
  "reports",
];
const DEFAULT_ROLE_PERMISSIONS = {
  admin: Object.fromEntries(HMS_MODULES.map((module) => [
    module,
    ["view", "create", "update", "delete", "export"],
  ])),
  manager: {
    hospital: ["view", "update"],
    appointments: ["view", "create", "update", "delete", "export"],
    patients: ["view", "create", "update", "export"],
    inventory: ["view", "create", "update", "delete", "export"],
    staff: ["view", "create", "update", "delete"],
    billing: ["view", "create", "update", "export"],
    emr: ["view", "create", "update"],
    media: ["view", "create", "update", "delete"],
    tests: ["view", "create", "update", "delete"],
    testBookings: ["view", "create", "update", "export"],
    messages: ["view", "update"],
    notifications: ["view", "update"],
    reports: ["view", "export"],
  },
  staff: {
    appointments: ["view", "create", "update"],
    patients: ["view", "create", "update"],
    inventory: ["view", "update"],
    billing: ["view", "create"],
    tests: ["view"],
    testBookings: ["view", "create", "update"],
    messages: ["view"],
    notifications: ["view", "update"],
  },
  doctor: {
    appointments: ["view", "update"],
    patients: ["view"],
    emr: ["view", "create", "update"],
    testBookings: ["view"],
    messages: ["view", "create", "update"],
    notifications: ["view", "update"],
  },
  patient: {
    appointments: ["view", "create"],
    emr: ["view"],
    billing: ["view"],
    tests: ["view"],
    testBookings: ["view", "create"],
    messages: ["view", "create"],
    notifications: ["view", "update"],
  },
};

const DEFAULT_ROLES = [
  {id: "admin", name: "Admin", level: 100, systemRole: true},
  {id: "manager", name: "Hospital Manager", level: 80, systemRole: true},
  {id: "staff", name: "Staff", level: 50, systemRole: true},
  {id: "doctor", name: "Doctor", level: 60, systemRole: true},
  {id: "patient", name: "Patient", level: 10, systemRole: true},
];

const DEFAULT_PERMISSIONS = HMS_MODULES.flatMap((module) =>
  ["view", "create", "update", "delete", "export"].map((action) => ({
    id: `${module}.${action}`,
    module,
    action,
  })),
);

app.use(cors({origin: true}));
app.use((req, res, next) => {
  if (req.url === "/api" || req.url.startsWith("/api/")) {
    req.url = req.url.replace(/^\/api(?=\/|$)/, "") || "/";
  }
  next();
});
app.use(express.json({limit: "15mb"}));
app.use(express.urlencoded({extended: true, limit: "15mb"}));

const ok = (res, data = {}) => res.status(200).json(data);
const created = (res, data = {}) => res.status(201).json(data);
const badRequest = (res, message) => res.status(400).json({error: message});
const notFound = (res, message = "Not found") => res.status(404).json({error: message});

const serializeTimestamp = (value) => {
  if (value?.toDate) return value.toDate().toISOString();
  if (value?._seconds) return new Date(value._seconds * 1000).toISOString();
  return value;
};

const withId = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    date: serializeTimestamp(data.date)?.slice?.(0, 10) || data.date,
    startsAt: serializeTimestamp(data.startsAt),
    endsAt: serializeTimestamp(data.endsAt),
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt),
    lastMessageAt: serializeTimestamp(data.lastMessageAt),
    created_at: serializeTimestamp(data.createdAt),
  };
};

const seedList = (name, {activeOnly = false, limit = 100} = {}) => {
  const items = seedCollections[name] || [];
  return items
    .filter((item) => !activeOnly || item.status === 1 || item.is_active === true)
    .slice(0, limit);
};

const seedById = (name, id) =>
  (seedCollections[name] || []).find((item) => String(item.id) === String(id));

const collectionList = async (name, {activeOnly = false, limit = 100, orderBy = "createdAt"} = {}) => {
  try {
    let query = db.collection(name);
    if (activeOnly) {
      query = query.where("status", "==", 1);
    }
    if (orderBy) {
      query = query.orderBy(orderBy, "desc");
    }
    const snap = await query.limit(limit).get();
    const data = snap.docs.map(withId);
    return data.length ? data : seedList(name, {activeOnly, limit});
  } catch (error) {
    console.warn(`Using seed data for ${name}:`, error.message);
    return seedList(name, {activeOnly, limit});
  }
};

const normalizeToken = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const appointmentMatchesDoctor = (appointment, username) => {
  const normalizedUsername = normalizeToken(username);
  if (!normalizedUsername) return false;

  return [
    appointment.doctor_username,
    appointment.staff_username,
    appointment.provider_username,
    appointment.doctor,
    appointment.doctor_name,
    appointment.username,
  ].some((value) => {
    const normalizedValue = normalizeToken(value);
    return (
      normalizedValue === normalizedUsername ||
      (normalizedValue.length > 3 && normalizedUsername.includes(normalizedValue)) ||
      (normalizedUsername.length > 3 && normalizedValue.includes(normalizedUsername))
    );
  });
};

const appointmentsForDoctor = async (username) => {
  const normalizedUsername = String(username || "").trim();
  if (!normalizedUsername) return [];

  try {
    const snap = await db
      .collection("appointments")
      .where("doctor_username", "==", normalizedUsername)
      .limit(200)
      .get();
    const data = snap.docs.map(withId);
    if (data.length) return data;

    const allAppointments = await collectionList("appointments", {limit: 500});
    return allAppointments.filter((item) => appointmentMatchesDoctor(item, normalizedUsername));
  } catch (error) {
    console.warn(`Using seed appointments for ${normalizedUsername}:`, error.message);
    return seedList("appointments", {limit: 500}).filter((item) =>
      appointmentMatchesDoctor(item, normalizedUsername),
    );
  }
};

const appointmentSummary = async (username = "") => {
  const appointments = username
    ? await appointmentsForDoctor(username)
    : await collectionList("appointments", {limit: 500});
  const today = new Date().toISOString().slice(0, 10);
  const todaysAppointments = appointments.filter((item) => item.date === today);
  const cancelledAppointments = appointments.filter((item) => item.status === "cancelled");

  return {
    appointments,
    todays_appointments: todaysAppointments.length ? todaysAppointments : appointments.slice(0, 5),
    cancelled_appointments: cancelledAppointments,
    total_appointments: appointments.length,
    total_patients: (await collectionList("patients", {limit: 500})).length,
    total_doctors: (await collectionList("staff", {activeOnly: true, limit: 300})).length,
    staff: await collectionList("staff", {activeOnly: true, limit: 300}),
    departments: await collectionList("departments", {limit: 200}),
    locations: await collectionList("locations", {limit: 200}),
    services: await collectionList("services", {activeOnly: true, limit: 200}),
  };
};

const holidayDocId = (username, date) =>
  `${String(username || "").toLowerCase()}-${String(date || "").replace(/[^0-9-]/g, "-")}`;

const holidaysForDoctor = async (username) => {
  const normalizedUsername = String(username || "").toLowerCase();
  if (!normalizedUsername) return [];

  try {
    const snap = await db
      .collection("holidays")
      .where("username", "==", normalizedUsername)
      .limit(100)
      .get();
    const data = snap.docs.map(withId);
    if (data.length) return data;
  } catch (error) {
    console.warn("Using seed holidays:", error.message);
  }

  return seedHolidays.filter((holiday) => holiday.username === normalizedUsername);
};

const docById = async (collectionName, id) => {
  try {
    const doc = await db.collection(collectionName).doc(String(id)).get();
    return doc.exists ? withId(doc) : seedById(collectionName, id) || null;
  } catch (error) {
    console.warn(`Using seed document for ${collectionName}/${id}:`, error.message);
    return seedById(collectionName, id) || null;
  }
};

const addDocument = async (collectionName, payload) => {
  const ref = await db.collection(collectionName).add({
    ...payload,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  const saved = await ref.get();
  return withId(saved);
};

const updateDocument = async (collectionName, id, payload) => {
  const ref = db.collection(collectionName).doc(String(id));
  await ref.set(
    {
      ...payload,
      updatedAt: FieldValue.serverTimestamp(),
    },
    {merge: true},
  );
  const saved = await ref.get();
  return withId(saved);
};

const deleteDocument = async (collectionName, id) => {
  await db.collection(collectionName).doc(String(id)).delete();
  return {success: true};
};

const getSiteConfig = async () => {
  try {
    const snap = await db.collection("config").doc("site").get();
    return snap.exists ? {...siteConfig, ...snap.data()} : siteConfig;
  } catch (error) {
    console.warn("Using seed site config:", error.message);
    return siteConfig;
  }
};

const getUserProfileByUsername = async (username) => {
  if (!username) return null;
  const mapping = await db.collection("usernames").doc(String(username).toLowerCase()).get();
  if (!mapping.exists) return null;
  const {uid} = mapping.data();
  const user = await db.collection("users").doc(uid).get();
  return user.exists ? {uid, ...user.data()} : null;
};

const requireAuth = async (req, res, next) => {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : header.startsWith("Token ")
      ? header.slice(6)
      : null;
  if (!token) return res.status(401).json({error: "Missing Firebase ID token"});
  try {
    req.user = await getAuth().verifyIdToken(token);
    return next();
  } catch (error) {
    return res.status(401).json({error: "Invalid Firebase ID token"});
  }
};

const getActorProfile = async (uid) => {
  if (!uid) return {};
  const snap = await db.collection("users").doc(uid).get();
  return snap.exists ? {uid, ...snap.data()} : {uid};
};

const actorRoles = (authUser = {}, profile = {}) => {
  const roles = new Set();
  if (authUser.role) roles.add(authUser.role);
  if (profile.role) roles.add(profile.role);
  if (Array.isArray(authUser.roles)) authUser.roles.forEach((role) => roles.add(role));
  if (Array.isArray(profile.roles)) profile.roles.forEach((role) => roles.add(role));
  if (authUser.admin || profile.is_superuser) roles.add("admin");
  if (profile.is_vendor) roles.add("manager");
  if (profile.is_staff) roles.add("staff");
  return roles;
};

const isAdminActor = (authUser, profile) => actorRoles(authUser, profile).has("admin");

const mergePermissions = (base = {}, override = {}) => {
  const merged = {...base};
  Object.entries(override || {}).forEach(([module, actions]) => {
    merged[module] = Array.from(new Set([...(merged[module] || []), ...(actions || [])]));
  });
  return merged;
};

const normalizePermissions = (role = "staff", permissions = null) =>
  mergePermissions(DEFAULT_ROLE_PERMISSIONS[role] || DEFAULT_ROLE_PERMISSIONS.staff, permissions || {});

const writeAuditLog = async ({
  hospitalId = null,
  actorId = "system",
  module = "system",
  action = "unknown",
  targetPath = null,
  metadata = {},
}) => {
  const payload = {
    hospitalId,
    actorId,
    module,
    action,
    targetPath,
    metadata,
    createdAt: FieldValue.serverTimestamp(),
  };
  const collection = hospitalId
    ? db.collection("hospitals").doc(hospitalId).collection("auditLogs")
    : db.collection("auditLogs");
  await collection.add(payload);
};

const createHospitalAlert = async (hospitalId, payload) => {
  if (!hospitalId) return null;
  const ref = await db.collection("hospitals").doc(hospitalId).collection("alerts").add({
    status: "open",
    severity: payload.severity || "info",
    ...payload,
    hospitalId,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
};

const sendNotificationToUser = async (uid, notification, data = {}) => {
  if (!uid) return;
  try {
    const user = await db.collection("users").doc(uid).get();
    const tokens = user.exists && Array.isArray(user.data().fcmTokens)
      ? user.data().fcmTokens
      : [];
    if (!tokens.length) return;
    await getMessaging().sendEachForMulticast({
      tokens,
      notification,
      data: Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, String(value ?? "")]),
      ),
    });
  } catch (error) {
    console.warn("Unable to send notification:", error.message);
  }
};

const attachActor = async (req, res, next) => {
  try {
    req.profile = await getActorProfile(req.user.uid);
    req.roles = actorRoles(req.user, req.profile);
    return next();
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
};

const requireHmsAdmin = async (req, res, next) => {
  await attachActor(req, res, () => {
    if (!isAdminActor(req.user, req.profile)) {
      return res.status(403).json({error: "Admin access is required"});
    }
    return next();
  });
};

const getHospitalMember = async (hospitalId, uid) => {
  const snap = await db
    .collection("hospitals")
    .doc(hospitalId)
    .collection("members")
    .doc(uid)
    .get();
  return snap.exists ? {id: snap.id, ...snap.data()} : null;
};

const actorCan = async (authUser, profile, hospitalId, module, action) => {
  if (isAdminActor(authUser, profile)) return true;
  const member = await getHospitalMember(hospitalId, authUser.uid);
  if (!member || member.active === false) return false;
  const actions = member.permissions?.[module] || [];
  return actions.includes(action) || actions.includes("manage");
};

const requireHospitalPermission = (module, action) => async (req, res, next) => {
  try {
    req.profile = await getActorProfile(req.user.uid);
    const hospitalId = req.params.hospitalId || req.body.hospitalId || DEFAULT_HOSPITAL_ID;
    const allowed = await actorCan(req.user, req.profile, hospitalId, module, action);
    if (!allowed) {
      return res.status(403).json({
        error: `Missing ${module}.${action} permission for hospital ${hospitalId}`,
      });
    }
    return next();
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
};

const seedHmsDefaults = async ({actorId = "system"} = {}) => {
  const batch = db.batch();

  DEFAULT_ROLES.forEach((role) => {
    batch.set(db.collection("roles").doc(role.id), {
      ...role,
      permissions: DEFAULT_ROLE_PERMISSIONS[role.id] || {},
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    }, {merge: true});
  });

  DEFAULT_PERMISSIONS.forEach((permission) => {
    batch.set(db.collection("permissions").doc(permission.id), {
      module: permission.module,
      action: permission.action,
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    }, {merge: true});
  });

  hmsHospitals.forEach((hospital) => {
    const hospitalId = hospital.id || hospital.hospitalId;
    batch.set(db.collection("hospitals").doc(hospitalId), {
      ...hospital,
      hospitalId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }, {merge: true});

    (hmsMedia[hospitalId] || []).forEach((media) => {
      batch.set(
        db.collection("hospitals").doc(hospitalId).collection("media").doc(media.id),
        {
          ...media,
          hospitalId,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        {merge: true},
      );
    });

    seedList("services", {activeOnly: true, limit: 20}).forEach((service) => {
      batch.set(
        db.collection("hospitals").doc(hospitalId).collection("services").doc(String(service.id)),
        {
          ...service,
          hospitalId,
          public: true,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        {merge: true},
      );
    });

    (hospitalTestIds[hospitalId] || []).forEach((testId) => {
      const test = hmsTests.find((item) => item.id === testId);
      if (!test) return;
      batch.set(
        db.collection("hospitals").doc(hospitalId).collection("tests").doc(test.id),
        {
          ...test,
          hospitalId,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        {merge: true},
      );
    });

    hmsTestSlots
      .filter((slot) => slot.hospitalId === hospitalId)
      .forEach((slot) => {
        batch.set(
          db.collection("hospitals").doc(hospitalId).collection("testSlots").doc(slot.id),
          {
            ...slot,
            startsAt: Timestamp.fromDate(new Date(`${slot.date}T${slot.startTime}:00+05:30`)),
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          },
          {merge: true},
        );
      });
  });

  await batch.commit();

  const staffItems = await collectionList("staff", {activeOnly: true, limit: 300});
  const appointmentItems = await collectionList("appointments", {limit: 500});
  const tenantBatch = db.batch();

  staffItems.forEach((doctor) => {
    const doctorId = String(doctor.id || doctor.username || doctor.name)
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-");
    const assignedHospitals = hmsHospitals.filter((hospital) =>
      String(doctor.location || "").toLowerCase().includes(
        String(hospital.location?.city || "").toLowerCase(),
      ),
    );
    const hospitalsForDoctor = assignedHospitals.length ? assignedHospitals : [hmsHospitals[0]];

    hospitalsForDoctor.forEach((hospital) => {
      const hospitalId = hospital.id || hospital.hospitalId;
      tenantBatch.set(
        db.collection("hospitals").doc(hospitalId).collection("doctors").doc(doctorId),
        {
          ...doctor,
          hospitalId,
          doctorId,
          doctorUsername: doctor.username || "",
          expertise: doctor.department || doctor.designation || "General Medicine",
          expertiseTags: [doctor.department, doctor.designation].filter(Boolean),
          public: true,
          active: doctor.status !== 0,
          updatedAt: FieldValue.serverTimestamp(),
        },
        {merge: true},
      );
    });
  });

  appointmentItems.forEach((appointment) => {
    const appointmentId = String(appointment.id || appointment.appointment_id || `${Date.now()}-${Math.random()}`);
    tenantBatch.set(
      db.collection("hospitals").doc(DEFAULT_HOSPITAL_ID).collection("appointments").doc(appointmentId),
      {
        ...appointment,
        hospitalId: DEFAULT_HOSPITAL_ID,
        legacyAppointmentId: appointmentId,
        updatedAt: FieldValue.serverTimestamp(),
      },
      {merge: true},
    );
  });

  [
    {
      id: "med-paracetamol-500",
      medicineName: "Paracetamol 500mg",
      stock: 120,
      lowStockThreshold: 30,
      batchNo: "PCM-2026-A",
      price: 3.5,
    },
    {
      id: "med-amoxicillin-250",
      medicineName: "Amoxicillin 250mg",
      stock: 48,
      lowStockThreshold: 20,
      batchNo: "AMX-2026-B",
      price: 8,
    },
  ].forEach((medicine) => {
    tenantBatch.set(
      db.collection("hospitals").doc(DEFAULT_HOSPITAL_ID).collection("inventory").doc(medicine.id),
      {
        ...medicine,
        hospitalId: DEFAULT_HOSPITAL_ID,
        expiryDate: Timestamp.fromDate(new Date("2027-03-31")),
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
      },
      {merge: true},
    );
  });

  await tenantBatch.commit();
  await writeAuditLog({
    hospitalId: DEFAULT_HOSPITAL_ID,
    actorId,
    module: "system",
    action: "seedHmsDefaults",
  });
};

app.get("/health", (req, res) => ok(res, {status: "ok", backend: "firebase"}));

app.get("/clinic/configurations/", async (req, res) => ok(res, await getSiteConfig()));
app.get("/clinic/slogan/", async (req, res) => ok(res, await getSiteConfig()));
app.get("/clinic/logochange/", async (req, res) => ok(res, await getSiteConfig()));
app.get("/clinic/faviconchange/", async (req, res) => ok(res, await getSiteConfig()));
app.get("/clinic/timings/", async (req, res) => ok(res, await getSiteConfig()));
app.get("/clinic/address/", async (req, res) => ok(res, await getSiteConfig()));
app.get("/clinic/socialmediaprofiles/", async (req, res) => ok(res, await getSiteConfig()));
app.get("/clinic/socialmediaprofile/", async (req, res) => ok(res, await getSiteConfig()));
app.get("/clinic/currency/", async (req, res) => ok(res, await getSiteConfig()));

app.put(
  [
    "/clinic/configurations/",
    "/clinic/slogan/",
    "/clinic/logochange/",
    "/clinic/faviconchange/",
    "/clinic/timings/",
    "/clinic/address/",
    "/clinic/socialmediaprofiles/",
    "/clinic/socialmediaprofile/",
    "/clinic/currency/",
  ],
  requireAuth,
  async (req, res) => {
  await db.collection("config").doc("site").set(
    {...req.body, updatedAt: FieldValue.serverTimestamp()},
    {merge: true},
  );
  ok(res, await getSiteConfig());
  },
);

app.get("/clinic/latest-services/", async (req, res) => ok(res, await collectionList("services", {activeOnly: true, limit: 6})));
app.get("/clinic/services-list/", async (req, res) => ok(res, await collectionList("services", {limit: 200})));
app.get("/clinic/services-list/:id/", async (req, res) => {
  const item = await docById("services", req.params.id);
  return item ? ok(res, item) : notFound(res);
});
app.post("/clinic/submit-service/", requireAuth, async (req, res) => created(res, await addDocument("services", req.body)));
app.put("/clinic/services-list/:id/", requireAuth, async (req, res) => ok(res, await updateDocument("services", req.params.id, req.body)));
app.patch("/clinic/services-list/:id/", requireAuth, async (req, res) => ok(res, await updateDocument("services", req.params.id, req.body)));
app.delete("/clinic/delete-service/:id/", requireAuth, async (req, res) => ok(res, await deleteDocument("services", req.params.id)));

app.get("/clinic/blogs-list/", async (req, res) => ok(res, await collectionList("blogs", {limit: 200})));
app.get("/clinic/blogs-list/:id/", async (req, res) => {
  const item = await docById("blogs", req.params.id);
  return item ? ok(res, item) : notFound(res);
});
app.post("/clinic/submit-blog/", requireAuth, async (req, res) => created(res, await addDocument("blogs", req.body)));
app.put("/clinic/blogs-list/:id/", requireAuth, async (req, res) => ok(res, await updateDocument("blogs", req.params.id, req.body)));
app.patch("/clinic/blogs-list/:id/", requireAuth, async (req, res) => ok(res, await updateDocument("blogs", req.params.id, req.body)));
app.delete("/clinic/delete-blog/:id/", requireAuth, async (req, res) => ok(res, await deleteDocument("blogs", req.params.id)));

app.get("/clinic/staff-list/", async (req, res) => ok(res, await collectionList("staff", {limit: 300})));
app.get("/clinic/allstaff/", async (req, res) => ok(res, await collectionList("staff", {limit: 300})));
app.get("/clinic/doctorlist/", async (req, res) => ok(res, await collectionList("staff", {activeOnly: true, limit: 300})));
app.get("/clinic/home-search-staff/", async (req, res) => {
  const query = String(req.query.q || "").toLowerCase().trim();
  const doctors = await collectionList("staff", {activeOnly: true, limit: 300});
  if (!query) return ok(res, doctors.slice(0, 8));

  ok(
    res,
    doctors.filter((doctor) =>
      [
        doctor.fname,
        doctor.lname,
        doctor.name,
        doctor.department,
        doctor.location,
        doctor.designation,
        doctor.username,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    ).slice(0, 10),
  );
});
app.get("/clinic/staff-list/:id/", async (req, res) => {
  const item = await docById("staff", req.params.id);
  return item ? ok(res, item) : notFound(res);
});
app.post("/clinic/submit-staff/", requireAuth, async (req, res) => created(res, await addDocument("staff", req.body)));
app.put("/clinic/staff-list/:id/", requireAuth, async (req, res) => ok(res, await updateDocument("staff", req.params.id, req.body)));
app.patch("/clinic/staff-list/:id/", requireAuth, async (req, res) => ok(res, await updateDocument("staff", req.params.id, req.body)));
app.delete("/clinic/delete-staff/:id/", requireAuth, async (req, res) => ok(res, await deleteDocument("staff", req.params.id)));

app.get("/clinic/managelocation/", async (req, res) => ok(res, await collectionList("locations", {limit: 200})));
app.post("/clinic/managelocation/", requireAuth, async (req, res) => created(res, await addDocument("locations", req.body)));
app.patch("/clinic/managelocation/:id/", requireAuth, async (req, res) => ok(res, await updateDocument("locations", req.params.id, req.body)));
app.delete("/clinic/delete-location/:id/", requireAuth, async (req, res) => ok(res, await deleteDocument("locations", req.params.id)));

app.get("/clinic/managedepartment/", async (req, res) => ok(res, await collectionList("departments", {limit: 200})));
app.post("/clinic/managedepartment/", requireAuth, async (req, res) => created(res, await addDocument("departments", req.body)));
app.patch("/clinic/managedepartment/:id/", requireAuth, async (req, res) => ok(res, await updateDocument("departments", req.params.id, req.body)));
app.delete("/clinic/delete-department/:id/", requireAuth, async (req, res) => ok(res, await deleteDocument("departments", req.params.id)));

app.get("/clinic/manageblogcategories/", async (req, res) => ok(res, await collectionList("blogCategories", {limit: 200})));
app.post("/clinic/manageblogcategories/", requireAuth, async (req, res) => created(res, await addDocument("blogCategories", req.body)));
app.put("/clinic/manageblogcategories/:id/", requireAuth, async (req, res) => ok(res, await updateDocument("blogCategories", req.params.id, req.body)));
app.patch("/clinic/manageblogcategories/:id/", requireAuth, async (req, res) => ok(res, await updateDocument("blogCategories", req.params.id, req.body)));
app.delete("/clinic/delete-blogcategory/:id/", requireAuth, async (req, res) => ok(res, await deleteDocument("blogCategories", req.params.id)));

app.get("/clinic/contact-form-list/", requireAuth, async (req, res) => ok(res, await collectionList("contacts", {limit: 500})));
app.post("/clinic/submit-contact/", async (req, res) => created(res, await addDocument("contacts", req.body)));
app.delete("/clinic/contact-form-list/:id/", requireAuth, async (req, res) => ok(res, await deleteDocument("contacts", req.params.id)));

app.get("/clinic/consultation-query-list/", requireAuth, async (req, res) => ok(res, await collectionList("consultationQueries", {limit: 500})));
app.post("/clinic/consultation-query/", async (req, res) => created(res, await addDocument("consultationQueries", req.body)));
app.delete("/clinic/consultation-query/:id/", requireAuth, async (req, res) => ok(res, await deleteDocument("consultationQueries", req.params.id)));

app.get(["/clinic/booking/", "/clinic/booking"], requireAuth, async (req, res) =>
  ok(res, await appointmentSummary(req.query.username)),
);
app.get("/clinic/bookings-list/", requireAuth, async (req, res) => ok(res, await collectionList("appointments", {limit: 500})));
app.get("/clinic/bookings-list/:id/", requireAuth, async (req, res) => {
  const appointment = await docById("appointments", req.params.id);
  if (!appointment) return notFound(res);
  ok(res, appointment);
});
app.get("/clinic/booking/:username/", requireAuth, async (req, res) => {
  ok(res, await appointmentsForDoctor(req.params.username));
});
app.post(["/clinic/booking/", "/clinic/submit-appointment/"], async (req, res) => {
  const hospitalId = req.body.hospitalId || DEFAULT_HOSPITAL_ID;
  const payload = {
    ...req.body,
    hospitalId,
    doctor_username: req.body.doctor_username || req.body.username || "",
    doctorUsername: req.body.doctorUsername || req.body.doctor_username || req.body.username || "",
    doctorId: req.body.doctorId || req.body.doctor_id || req.body.staff_id || null,
    doctorUid: req.body.doctorUid || req.body.doctor_uid || null,
    patientUid: req.body.patientUid || req.body.patient_uid || req.body.userUid || null,
    status: req.body.status || "confirmed",
    payment_status: Boolean(req.body.payment_status),
    date: req.body.date || null,
  };
  const saved = await addDocument("appointments", payload);
  await db
    .collection("hospitals")
    .doc(hospitalId)
    .collection("appointments")
    .doc(saved.id)
    .set(
      {
        ...payload,
        legacyAppointmentId: saved.id,
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
      },
      {merge: true},
    );
  created(res, saved);
});
app.put("/clinic/bookings-list/:id/", requireAuth, async (req, res) => ok(res, await updateDocument("appointments", req.params.id, req.body)));
app.patch("/clinic/bookings-list/:id/", requireAuth, async (req, res) => ok(res, await updateDocument("appointments", req.params.id, req.body)));
app.delete("/clinic/delete-booking/:id/", requireAuth, async (req, res) => ok(res, await deleteDocument("appointments", req.params.id)));
app.post("/clinic/cancel-booking/:id/", requireAuth, async (req, res) => ok(res, await updateDocument("appointments", req.params.id, {status: "cancelled", cancelledAt: Timestamp.now()})));

app.get("/clinic/patient-profile/:username/", async (req, res) => {
  const profile = await getUserProfileByUsername(req.params.username);
  if (!profile) {
    const patient = seedPatients.find(
      (item) => String(item.username).toLowerCase() === String(req.params.username).toLowerCase(),
    );
    return patient ? ok(res, patient) : notFound(res);
  }
  const patient = await db.collection("patients").doc(profile.uid).get();
  ok(res, patient.exists ? {id: patient.id, ...patient.data()} : profile);
});
app.post("/clinic/register-patient/", async (req, res) => {
  const {email, password, username} = req.body;
  if (!email || !password || !username) return badRequest(res, "email, username, and password are required");
  const user = await getAuth().createUser({email, password, displayName: username});
  const profile = {
    username,
    email,
    roles: ["patient"],
    is_staff: false,
    is_vendor: false,
    is_superuser: false,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  await db.collection("users").doc(user.uid).set(profile);
  await db.collection("patients").doc(user.uid).set({username, email, name: username, uid: user.uid, createdAt: FieldValue.serverTimestamp()});
  await db.collection("usernames").doc(String(username).toLowerCase()).set({uid: user.uid, email, username, roles: ["patient"]});
  created(res, {http_status_code: 201, uid: user.uid, username});
});
app.get("/clinic/check-username/", async (req, res) => {
  const username = String(req.query.username || "").toLowerCase();
  if (!username) return badRequest(res, "username is required");
  const doc = await db.collection("usernames").doc(username).get();
  ok(res, {exists: doc.exists});
});

app.post("/clinic/setup-first-admin/", async (req, res) => {
  const setupToken = process.env.FIRST_ADMIN_SETUP_TOKEN;
  if (!setupToken || req.body.setupToken !== setupToken) {
    return res.status(403).json({error: "Invalid setup token"});
  }

  const {email, password, username = "admin"} = req.body;
  if (!email || !password) return badRequest(res, "email and password are required");

  const user = await getAuth().createUser({email, password, displayName: username});
  const profile = {
    uid: user.uid,
    username,
    usernameLower: String(username).toLowerCase(),
    email,
    roles: ["admin"],
    is_staff: true,
    is_vendor: false,
    is_superuser: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  await db.collection("users").doc(user.uid).set(profile);
  await db.collection("usernames").doc(String(username).toLowerCase()).set({
    uid: user.uid,
    username,
    email,
    roles: ["admin"],
  });

  created(res, {http_status_code: 201, uid: user.uid, username, email});
});

app.post("/clinic/seed-demo-data/", async (req, res) => {
  const setupToken = process.env.FIRST_ADMIN_SETUP_TOKEN;
  if (!setupToken || req.body.setupToken !== setupToken) {
    return res.status(403).json({error: "Invalid setup token"});
  }

  const batch = db.batch();
  Object.entries(seedCollections).forEach(([collectionName, records]) => {
    records.forEach((record) => {
      const id = String(record.id || record.username || record.name).toLowerCase().replace(/[^a-z0-9-]+/g, "-");
      const ref = collectionName === "config"
        ? db.collection(collectionName).doc("site")
        : db.collection(collectionName).doc(id);
      batch.set(
        ref,
        {
          ...record,
          updatedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
        },
        {merge: true},
      );
    });
  });
  await batch.commit();

  created(res, {
    success: true,
    collections: Object.fromEntries(
      Object.entries(seedCollections).map(([name, records]) => [name, records.length]),
    ),
  });
});

app.get("/clinic/monthly/:year/:month/", async (req, res) => {
  ok(res, buildMonthlySlots(req.params.year, req.params.month));
});

app.get("/clinic/doctormonthlyslots/:username/:year/:month", async (req, res) => {
  ok(res, buildMonthlySlots(req.params.year, req.params.month));
});

app.get("/clinic/slots/:username/:date", async (req, res) => {
  const [year, month] = String(req.params.date).split("-");
  const monthlySlots = buildMonthlySlots(year, month);
  const daySlots = monthlySlots[req.params.date];
  ok(res, daySlots ? [daySlots] : []);
});

app.get(["/clinic/manageholiday/", "/clinic/manageholiday"], async (req, res) =>
  ok(res, await holidaysForDoctor(req.query.username)),
);

app.get("/clinic/manageholiday/:username", async (req, res) =>
  ok(res, await holidaysForDoctor(req.params.username)),
);

app.post(["/clinic/manageholiday/", "/clinic/manageholiday"], requireAuth, async (req, res) => {
  const username = String(req.body.username || "").toLowerCase();
  const dates = Array.isArray(req.body.dates) ? req.body.dates : [];
  if (!username || !dates.length) return badRequest(res, "username and dates are required");

  const batch = db.batch();
  dates.forEach((date) => {
    const ref = db.collection("holidays").doc(holidayDocId(username, date));
    batch.set(
      ref,
      {
        username,
        date,
        comment: req.body.comments || req.body.comment || null,
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
      },
      {merge: true},
    );
  });
  await batch.commit();

  created(res, {success: true, holidays: dates.length});
});

app.delete(["/clinic/manageholiday/", "/clinic/manageholiday"], requireAuth, async (req, res) => {
  const username = String(req.body.username || "").toLowerCase();
  const dates = Array.isArray(req.body.dates) ? req.body.dates : [];
  if (!username || !dates.length) return badRequest(res, "username and dates are required");

  const batch = db.batch();
  dates.forEach((date) => {
    batch.delete(db.collection("holidays").doc(holidayDocId(username, date)));
  });
  await batch.commit();

  ok(res, {success: true});
});

app.get("/clinic/feedback-list/:doctorId", async (req, res) => {
  const doctor = await docById("staff", req.params.doctorId);
  if (!doctor) return notFound(res);

  let reviews = [];
  try {
    const snap = await db.collection("feedback").where("doctor", "==", req.params.doctorId).limit(100).get();
    reviews = snap.docs.map(withId);
  } catch (error) {
    console.warn("Using seed feedback:", error.message);
  }

  if (!reviews.length) {
    reviews = seedFeedback.filter((item) => item.doctor === req.params.doctorId);
  }

  const activeReviews = reviews.filter((item) => item.is_active !== false);
  const overallRating = activeReviews.length
    ? activeReviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / activeReviews.length
    : Number(doctor.average_rating || doctor.rating || 0);

  ok(res, {
    doctor,
    feedback: activeReviews,
    overall_rating: Number(overallRating.toFixed(1)),
  });
});

app.get("/clinic/feedback-list/", async (req, res) => ok(res, await collectionList("feedback", {limit: 500})));
app.post("/clinic/feedback/", requireAuth, async (req, res) => created(res, await addDocument("feedback", req.body)));
app.patch("/clinic/feedback/:id/", requireAuth, async (req, res) => ok(res, await updateDocument("feedback", req.params.id, req.body)));

app.get("/clinic/get-notifications/:username/", requireAuth, async (req, res) => {
  const snap = await db.collection("notifications").where("username", "==", req.params.username).limit(100).get();
  ok(res, snap.docs.map(withId));
});
app.put("/clinic/notifications/:id/", requireAuth, async (req, res) => ok(res, await updateDocument("notifications", req.params.id, req.body)));

app.post("/clinic/PayWithStripe/", async (req, res) => {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return ok(res, {
      demoMode: true,
      clientSecret: null,
      message: "Stripe is not configured; demo appointment confirmation is enabled.",
    });
  }
  const amount = Number(req.body.amount);
  if (!amount) return badRequest(res, "Amount is required");
  const stripe = new Stripe(stripeSecret);
  const intent = await stripe.paymentIntents.create({
    amount,
    currency: req.body.currency || "usd",
    description: req.body.description || "Payment for booking",
    metadata: req.body.metadata || {},
  });
  ok(res, {clientSecret: intent.client_secret});
});

app.get("/hms/schema", async (req, res) => {
  ok(res, {
    defaultHospitalId: DEFAULT_HOSPITAL_ID,
    modules: HMS_MODULES,
    roles: DEFAULT_ROLES,
    collections: {
      hospitals: "hospitals/{hospitalId}",
      members: "hospitals/{hospitalId}/members/{uid}",
      doctors: "hospitals/{hospitalId}/doctors/{doctorId}",
      staff: "hospitals/{hospitalId}/staff/{staffId}",
      patients: "hospitals/{hospitalId}/patients/{patientId}",
      appointments: "hospitals/{hospitalId}/appointments/{appointmentId}",
      inventory: "hospitals/{hospitalId}/inventory/{medicineId}",
      stockLogs: "hospitals/{hospitalId}/inventory/{medicineId}/stockLogs/{logId}",
      chats: "hospitals/{hospitalId}/chats/{chatId}",
      messages: "hospitals/{hospitalId}/chats/{chatId}/messages/{messageId}",
    },
  });
});

app.post("/hms/setup-default-hospital", requireAuth, requireHmsAdmin, async (req, res) => {
  await seedHmsDefaults({actorId: req.user.uid});
  created(res, {
    success: true,
    hospitalId: DEFAULT_HOSPITAL_ID,
    message: "HMS roles, permissions, default hospital, doctors, appointments, and starter inventory are ready.",
  });
});

app.post("/hms/hospitals", requireAuth, requireHmsAdmin, async (req, res) => {
  const hospitalId = req.body.hospitalId ||
    String(req.body.name || `hospital-${Date.now()}`).toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  const payload = {
    hospitalId,
    name: req.body.name,
    location: req.body.location || "",
    managerIds: Array.isArray(req.body.managerIds) ? req.body.managerIds : [],
    status: req.body.status || "active",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  if (!payload.name) return badRequest(res, "Hospital name is required");
  await db.collection("hospitals").doc(hospitalId).set(payload, {merge: true});
  await writeAuditLog({
    hospitalId,
    actorId: req.user.uid,
    module: "hospital",
    action: "create",
    targetPath: `hospitals/${hospitalId}`,
  });
  created(res, payload);
});

app.get("/hms/hospitals", requireAuth, attachActor, async (req, res) => {
  if (isAdminActor(req.user, req.profile)) {
    const snap = await db.collection("hospitals").orderBy("name").limit(200).get();
    return ok(res, snap.docs.map(withId));
  }
  const hospitalIds = Array.isArray(req.profile.hospitalIds) ? req.profile.hospitalIds : [];
  const hospitals = [];
  for (const hospitalId of hospitalIds.slice(0, 20)) {
    const hospital = await db.collection("hospitals").doc(hospitalId).get();
    if (hospital.exists) hospitals.push({id: hospital.id, ...hospital.data()});
  }
  return ok(res, hospitals);
});

const toRad = (value) => (Number(value) * Math.PI) / 180;

const distanceKm = (fromLat, fromLng, toLat, toLng) => {
  if (
    [fromLat, fromLng, toLat, toLng].some((value) => value === null || value === undefined || value === "") ||
    ![fromLat, fromLng, toLat, toLng].every((value) => Number.isFinite(Number(value)))
  ) {
    return null;
  }
  const earthKm = 6371;
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(dLng / 2) ** 2;
  return Number((earthKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1));
};

const publicHospitalList = async ({city = "", geoHashPrefix = "", lat, lng, limit = 30} = {}) => {
  let query = db.collection("hospitals").where("status", "==", "active");
  if (city) {
    query = query.where("location.city", "==", city);
  }
  const snap = await query.limit(Number(limit) || 30).get();
  let hospitals = snap.docs
    .map(withId)
    .filter((hospital) => hospital.public !== false);

  if (geoHashPrefix) {
    hospitals = hospitals.filter((hospital) =>
      String(hospital.location?.geoHash || "").startsWith(String(geoHashPrefix)),
    );
  }

  return hospitals
    .map((hospital) => ({
      ...hospital,
      distanceKm: distanceKm(
        Number(lat),
        Number(lng),
        Number(hospital.location?.lat),
        Number(hospital.location?.lng),
      ),
    }))
    .sort((a, b) => {
      if (a.distanceKm != null && b.distanceKm != null) return a.distanceKm - b.distanceKm;
      return Number(b.rating || 0) - Number(a.rating || 0);
    });
};

const hospitalProfilePayload = async (hospitalId) => {
  const hospitalSnap = await db.collection("hospitals").doc(hospitalId).get();
  if (!hospitalSnap.exists) return null;
  const hospital = withId(hospitalSnap);
  if (hospital.public === false || hospital.status === "inactive") return null;

  const [mediaSnap, servicesSnap, doctorsSnap, testsSnap, slotsSnap] = await Promise.all([
    db.collection("hospitals").doc(hospitalId).collection("media").orderBy("sortOrder").limit(20).get(),
    db.collection("hospitals").doc(hospitalId).collection("services").limit(40).get(),
    db.collection("hospitals").doc(hospitalId).collection("doctors").limit(80).get(),
    db.collection("hospitals").doc(hospitalId).collection("tests").limit(80).get(),
    db.collection("hospitals").doc(hospitalId).collection("testSlots").where("status", "==", "open").limit(80).get(),
  ]);

  return {
    hospital,
    media: mediaSnap.docs.map(withId).filter((item) => item.public !== false),
    services: servicesSnap.docs.map(withId).filter((item) => item.public !== false && item.status !== 0),
    doctors: doctorsSnap.docs.map(withId).filter((item) => item.public !== false && item.active !== false),
    tests: testsSnap.docs.map(withId).filter((item) => item.public !== false && item.status !== "inactive"),
    testSlots: slotsSnap.docs.map(withId).filter((item) => Number(item.availableCapacity || 0) > 0),
  };
};

app.get("/hms/discovery/hospitals", async (req, res) => {
  const hospitals = await publicHospitalList({
    city: req.query.city || "",
    geoHashPrefix: req.query.geoHashPrefix || "",
    lat: req.query.lat,
    lng: req.query.lng,
    limit: req.query.limit,
  });
  ok(res, hospitals);
});

app.get("/hms/hospitals/:hospitalId/profile", async (req, res) => {
  const payload = await hospitalProfilePayload(req.params.hospitalId);
  if (!payload) return notFound(res, "Hospital not found");
  return ok(res, payload);
});

app.patch(
  "/hms/hospitals/:hospitalId/profile",
  requireAuth,
  requireHospitalPermission("hospital", "update"),
  async (req, res) => {
    const {hospitalId} = req.params;
    const payload = {
      name: req.body.name,
      summary: req.body.summary,
      contact: req.body.contact || {},
      location: req.body.location || {},
      specialties: Array.isArray(req.body.specialties) ? req.body.specialties : [],
      public: req.body.public !== false,
      status: req.body.status || "active",
      updatedAt: FieldValue.serverTimestamp(),
    };
    Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);
    await db.collection("hospitals").doc(hospitalId).set(payload, {merge: true});
    await writeAuditLog({hospitalId, actorId: req.user.uid, module: "hospital", action: "update"});
    return ok(res, {success: true, hospitalId});
  },
);

app.post(
  "/hms/hospitals/:hospitalId/media",
  requireAuth,
  requireHospitalPermission("media", "create"),
  async (req, res) => {
    const {hospitalId} = req.params;
    const ref = db.collection("hospitals").doc(hospitalId).collection("media").doc();
    const payload = {
      id: ref.id,
      hospitalId,
      type: req.body.type || "image",
      title: req.body.title || "Hospital media",
      url: req.body.url,
      sortOrder: Number(req.body.sortOrder || 99),
      public: req.body.public !== false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (!payload.url) return badRequest(res, "url is required");
    await ref.set(payload);
    await writeAuditLog({hospitalId, actorId: req.user.uid, module: "media", action: "create"});
    return created(res, payload);
  },
);

app.get("/hms/hospitals/:hospitalId/tests", async (req, res) => {
  const snap = await db
    .collection("hospitals")
    .doc(req.params.hospitalId)
    .collection("tests")
    .limit(100)
    .get();
  ok(res, snap.docs.map(withId).filter((item) => item.public !== false && item.status !== "inactive"));
});

app.post(
  "/hms/hospitals/:hospitalId/tests",
  requireAuth,
  requireHospitalPermission("tests", "create"),
  async (req, res) => {
    const {hospitalId} = req.params;
    const ref = db.collection("hospitals").doc(hospitalId).collection("tests").doc(
      req.body.id || String(req.body.name || `test-${Date.now()}`).toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
    );
    const payload = {
      id: ref.id,
      hospitalId,
      name: req.body.name,
      category: req.body.category || "Diagnostics",
      durationMinutes: Number(req.body.durationMinutes || 15),
      price: Number(req.body.price || 0),
      instructions: req.body.instructions || "",
      image: req.body.image || "/brand/service-icon-teal.png",
      public: req.body.public !== false,
      status: req.body.status || "active",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (!payload.name) return badRequest(res, "name is required");
    await ref.set(payload, {merge: true});
    await writeAuditLog({hospitalId, actorId: req.user.uid, module: "tests", action: "create"});
    return created(res, payload);
  },
);

app.get("/hms/hospitals/:hospitalId/test-slots", async (req, res) => {
  let query = db
    .collection("hospitals")
    .doc(req.params.hospitalId)
    .collection("testSlots")
    .where("status", "==", "open");
  if (req.query.testId) query = query.where("testId", "==", req.query.testId);
  const snap = await query.limit(100).get();
  const today = new Date().toISOString().slice(0, 10);
  ok(res, snap.docs
    .map(withId)
    .filter((slot) => slot.date >= today && Number(slot.availableCapacity || 0) > 0)
    .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)));
});

app.post(
  "/hms/hospitals/:hospitalId/test-slots",
  requireAuth,
  requireHospitalPermission("tests", "create"),
  async (req, res) => {
    const {hospitalId} = req.params;
    const testId = req.body.testId;
    if (!testId) return badRequest(res, "testId is required");
    if (!req.body.date || !req.body.startTime) return badRequest(res, "date and startTime are required");
    const ref = db.collection("hospitals").doc(hospitalId).collection("testSlots").doc();
    const capacity = Number(req.body.capacity || 1);
    const payload = {
      id: ref.id,
      hospitalId,
      testId,
      date: req.body.date,
      startTime: req.body.startTime,
      capacity,
      booked: 0,
      availableCapacity: capacity,
      status: "open",
      public: req.body.public !== false,
      startsAt: Timestamp.fromDate(new Date(`${req.body.date}T${req.body.startTime}:00+05:30`)),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    await ref.set(payload);
    await writeAuditLog({hospitalId, actorId: req.user.uid, module: "tests", action: "createSlot"});
    return created(res, payload);
  },
);

app.get(
  "/hms/hospitals/:hospitalId/test-bookings",
  requireAuth,
  requireHospitalPermission("testBookings", "view"),
  async (req, res) => {
    const snap = await db
      .collection("testBookings")
      .where("hospitalId", "==", req.params.hospitalId)
      .limit(200)
      .get();
    ok(res, snap.docs.map(withId));
  },
);

app.post("/hms/hospitals/:hospitalId/test-bookings", requireAuth, async (req, res) => {
  const {hospitalId} = req.params;
  const {testId, slotId} = req.body;
  if (!testId || !slotId) return badRequest(res, "testId and slotId are required");

  const hospitalRef = db.collection("hospitals").doc(hospitalId);
  const testRef = hospitalRef.collection("tests").doc(testId);
  const slotRef = hospitalRef.collection("testSlots").doc(slotId);
  const bookingRef = db.collection("testBookings").doc();
  const patientUid = req.body.userId || req.user.uid;
  const profile = await getActorProfile(req.user.uid);
  const canCreateForOthers = await actorCan(req.user, profile, hospitalId, "testBookings", "create");
  if (patientUid !== req.user.uid && !canCreateForOthers) {
    return res.status(403).json({error: "Cannot create test booking for another patient"});
  }

  let bookingPayload = null;
  await db.runTransaction(async (transaction) => {
    const [hospitalSnap, testSnap, slotSnap] = await Promise.all([
      transaction.get(hospitalRef),
      transaction.get(testRef),
      transaction.get(slotRef),
    ]);
    if (!hospitalSnap.exists) throw new Error("Hospital not found");
    if (!testSnap.exists) throw new Error("Test not found");
    if (!slotSnap.exists) throw new Error("Slot not found");
    const hospital = hospitalSnap.data();
    const test = testSnap.data();
    const slot = slotSnap.data();
    const availableCapacity = Number(slot.availableCapacity ?? (Number(slot.capacity || 0) - Number(slot.booked || 0)));
    if (slot.status !== "open" || availableCapacity <= 0) {
      throw new Error("Selected test slot is no longer available");
    }

    transaction.update(slotRef, {
      booked: FieldValue.increment(1),
      availableCapacity: FieldValue.increment(-1),
      updatedAt: FieldValue.serverTimestamp(),
    });

    bookingPayload = {
      id: bookingRef.id,
      userId: patientUid,
      patientUid,
      patientName: req.body.patientName || profile.username || profile.name || "Patient",
      hospitalId,
      hospitalName: hospital.name,
      testId,
      testName: test.name,
      slotId,
      date: slot.date,
      startTime: slot.startTime,
      price: Number(test.price || 0),
      status: "confirmed",
      source: req.body.source || "patient-discovery",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    transaction.set(bookingRef, bookingPayload);
  });

  await sendNotificationToUser(patientUid, {
    title: "Test booking confirmed",
    body: `${bookingPayload.testName} at ${bookingPayload.hospitalName} on ${bookingPayload.date}`,
    data: {type: "testBooking", bookingId: bookingRef.id, hospitalId},
  });
  await writeAuditLog({hospitalId, actorId: req.user.uid, module: "testBookings", action: "create"});
  return created(res, bookingPayload);
});

app.post("/hms/users/:uid/role", requireAuth, requireHmsAdmin, async (req, res) => {
  const {uid} = req.params;
  const role = req.body.role || "staff";
  const hospitalIds = Array.isArray(req.body.hospitalIds) ? req.body.hospitalIds : [];
  const permissions = normalizePermissions(role, req.body.permissions);
  const profilePayload = {
    uid,
    role,
    roles: Array.from(new Set([role, ...(req.body.roles || [])])),
    hospitalIds,
    permissions,
    is_superuser: role === "admin",
    is_staff: ["admin", "manager", "staff", "doctor"].includes(role),
    is_vendor: role === "manager",
    updatedAt: FieldValue.serverTimestamp(),
  };

  await db.collection("users").doc(uid).set(profilePayload, {merge: true});
  await getAuth().setCustomUserClaims(uid, {
    role,
    roles: profilePayload.roles,
    admin: role === "admin",
    hospitalIds,
  });

  const batch = db.batch();
  hospitalIds.forEach((hospitalId) => {
    batch.set(
      db.collection("hospitals").doc(hospitalId).collection("members").doc(uid),
      {
        uid,
        role,
        roleId: role,
        permissions,
        active: true,
        createdBy: req.user.uid,
        updatedAt: FieldValue.serverTimestamp(),
      },
      {merge: true},
    );
  });
  await batch.commit();
  await writeAuditLog({
    actorId: req.user.uid,
    module: "staff",
    action: "assignRole",
    targetPath: `users/${uid}`,
    metadata: {role, hospitalIds},
  });

  ok(res, {success: true, uid, role, hospitalIds, permissions});
});

app.post(
  "/hms/hospitals/:hospitalId/members",
  requireAuth,
  requireHospitalPermission("staff", "create"),
  async (req, res) => {
    const {hospitalId} = req.params;
    const uid = req.body.uid;
    const role = req.body.role || "staff";
    if (!uid) return badRequest(res, "uid is required");
    const permissions = normalizePermissions(role, req.body.permissions);
    await db.collection("hospitals").doc(hospitalId).collection("members").doc(uid).set({
      uid,
      role,
      roleId: role,
      permissions,
      active: req.body.active !== false,
      createdBy: req.user.uid,
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    }, {merge: true});
    await db.collection("users").doc(uid).set({
      role,
      roles: FieldValue.arrayUnion(role),
      hospitalIds: FieldValue.arrayUnion(hospitalId),
      updatedAt: FieldValue.serverTimestamp(),
    }, {merge: true});
    await writeAuditLog({
      hospitalId,
      actorId: req.user.uid,
      module: "staff",
      action: "addHospitalMember",
      targetPath: `hospitals/${hospitalId}/members/${uid}`,
      metadata: {role},
    });
    created(res, {success: true, uid, hospitalId, role, permissions});
  },
);

app.get(
  "/hms/hospitals/:hospitalId/inventory",
  requireAuth,
  requireHospitalPermission("inventory", "view"),
  async (req, res) => {
    const snap = await db
      .collection("hospitals")
      .doc(req.params.hospitalId)
      .collection("inventory")
      .orderBy("medicineName")
      .limit(Number(req.query.limit || 200))
      .get();
    ok(res, snap.docs.map(withId));
  },
);

app.post(
  "/hms/hospitals/:hospitalId/inventory",
  requireAuth,
  requireHospitalPermission("inventory", "create"),
  async (req, res) => {
    const {hospitalId} = req.params;
    const medicineName = req.body.medicineName || req.body.name;
    if (!medicineName) return badRequest(res, "medicineName is required");
    const ref = db.collection("hospitals").doc(hospitalId).collection("inventory").doc();
    const payload = {
      hospitalId,
      medicineName,
      stock: Number(req.body.stock || 0),
      lowStockThreshold: Number(req.body.lowStockThreshold || 10),
      expiryDate: req.body.expiryDate ? Timestamp.fromDate(new Date(req.body.expiryDate)) : null,
      batchNo: req.body.batchNo || "",
      price: Number(req.body.price || 0),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    await ref.set(payload);
    await writeAuditLog({
      hospitalId,
      actorId: req.user.uid,
      module: "inventory",
      action: "create",
      targetPath: ref.path,
    });
    created(res, {id: ref.id, ...payload});
  },
);

app.post(
  "/hms/hospitals/:hospitalId/inventory/:medicineId/adjust-stock",
  requireAuth,
  requireHospitalPermission("inventory", "update"),
  async (req, res) => {
    const {hospitalId, medicineId} = req.params;
    const quantity = Number(req.body.quantity || 0);
    if (!quantity) return badRequest(res, "quantity is required");
    const type = req.body.type || (quantity > 0 ? "purchase" : "dispense");
    const medicineRef = db.collection("hospitals").doc(hospitalId).collection("inventory").doc(medicineId);

    const result = await db.runTransaction(async (transaction) => {
      const medicineSnap = await transaction.get(medicineRef);
      if (!medicineSnap.exists) throw new Error("Medicine not found");
      const medicine = medicineSnap.data();
      const previousStock = Number(medicine.stock || 0);
      const newStock = previousStock + quantity;
      if (newStock < 0) throw new Error("Stock cannot be negative");
      transaction.update(medicineRef, {
        stock: newStock,
        updatedAt: FieldValue.serverTimestamp(),
      });
      const logRef = medicineRef.collection("stockLogs").doc();
      transaction.set(logRef, {
        hospitalId,
        medicineId,
        type,
        quantity,
        previousStock,
        newStock,
        actorId: req.user.uid,
        note: req.body.note || "",
        createdAt: FieldValue.serverTimestamp(),
      });
      return {
        medicineName: medicine.medicineName,
        lowStockThreshold: Number(medicine.lowStockThreshold || 0),
        previousStock,
        newStock,
      };
    });

    if (result.lowStockThreshold && result.newStock <= result.lowStockThreshold) {
      await createHospitalAlert(hospitalId, {
        type: "low_stock",
        severity: "warning",
        refPath: medicineRef.path,
        title: "Low stock alert",
        message: `${result.medicineName} has ${result.newStock} units remaining.`,
      });
    }

    await writeAuditLog({
      hospitalId,
      actorId: req.user.uid,
      module: "inventory",
      action: "adjustStock",
      targetPath: medicineRef.path,
      metadata: {quantity, type, newStock: result.newStock},
    });

    ok(res, {success: true, ...result});
  },
);

app.get(
  "/hms/hospitals/:hospitalId/notifications",
  requireAuth,
  requireHospitalPermission("notifications", "view"),
  async (req, res) => {
    const {hospitalId} = req.params;
    const limit = Number(req.query.limit || 100);
    const [notificationSnap, alertSnap] = await Promise.all([
      db
        .collection("hospitals")
        .doc(hospitalId)
        .collection("notifications")
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get(),
      db
        .collection("hospitals")
        .doc(hospitalId)
        .collection("alerts")
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get(),
    ]);
    const notifications = [
      ...notificationSnap.docs.map(withId),
      ...alertSnap.docs.map((doc) => ({
        ...withId(doc),
        type: doc.data().type || "inventory",
        title: doc.data().title || "Hospital alert",
      })),
    ].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
    ok(res, notifications.slice(0, limit));
  },
);

app.get(
  "/hms/hospitals/:hospitalId/audit-logs",
  requireAuth,
  requireHospitalPermission("reports", "view"),
  async (req, res) => {
    const snap = await db
      .collection("hospitals")
      .doc(req.params.hospitalId)
      .collection("auditLogs")
      .orderBy("createdAt", "desc")
      .limit(Number(req.query.limit || 100))
      .get();
    ok(res, snap.docs.map(withId));
  },
);

app.post(
  "/hms/hospitals/:hospitalId/appointments",
  requireAuth,
  async (req, res) => {
    const {hospitalId} = req.params;
    const profile = await getActorProfile(req.user.uid);
    const canCreate = await actorCan(req.user, profile, hospitalId, "appointments", "create");
    const patientUid = req.body.patientUid || req.user.uid;
    if (!canCreate && patientUid !== req.user.uid) {
      return res.status(403).json({error: "Cannot create appointment for another patient"});
    }
    const ref = db.collection("hospitals").doc(hospitalId).collection("appointments").doc();
    const payload = {
      ...req.body,
      hospitalId,
      appointmentId: ref.id,
      patientUid,
      doctorUid: req.body.doctorUid || null,
      doctorId: req.body.doctorId || null,
      status: req.body.status || "requested",
      startsAt: req.body.startsAt ? Timestamp.fromDate(new Date(req.body.startsAt)) : null,
      endsAt: req.body.endsAt ? Timestamp.fromDate(new Date(req.body.endsAt)) : null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    await ref.set(payload);
    const legacy = await addDocument("appointments", {
      ...payload,
      date: req.body.date || null,
      time: req.body.time || null,
      legacyTenantPath: ref.path,
    });
    await ref.set({legacyAppointmentId: legacy.id}, {merge: true});
    await sendNotificationToUser(payload.doctorUid, {
      title: "New appointment request",
      body: "A patient requested an appointment.",
    }, {hospitalId, appointmentId: ref.id});
    created(res, {id: ref.id, legacyAppointmentId: legacy.id, ...payload});
  },
);

app.get(
  "/hms/hospitals/:hospitalId/chats",
  requireAuth,
  attachActor,
  async (req, res) => {
    const {hospitalId} = req.params;
    const canViewAll = await actorCan(req.user, req.profile, hospitalId, "messages", "view");
    let query = db.collection("hospitals").doc(hospitalId).collection("chats");
    if (req.roles?.has?.("patient")) {
      query = query.where("patientUid", "==", req.user.uid);
    } else if (req.roles?.has?.("doctor")) {
      query = query.where("doctorUid", "==", req.user.uid);
    } else if (!canViewAll) {
      return ok(res, []);
    }
    const snap = await query.orderBy("lastMessageAt", "desc").limit(100).get();
    ok(res, snap.docs.map(withId));
  },
);

app.post("/hms/hospitals/:hospitalId/chats/request", requireAuth, async (req, res) => {
  const {hospitalId} = req.params;
  const doctorUid = req.body.doctorUid || req.body.doctorUsername || req.body.doctorId;
  const doctorId = req.body.doctorId || doctorUid;
  if (!doctorUid) return badRequest(res, "doctorUid or doctorId is required");

  const ref = db.collection("hospitals").doc(hospitalId).collection("chats").doc();
  const payload = {
    hospitalId,
    chatId: ref.id,
    patientUid: req.user.uid,
    patientName: req.body.patientName || req.user.name || req.user.email || "Patient",
    doctorUid,
    doctorId,
    doctorUsername: req.body.doctorUsername || req.body.doctorId || "",
    appointmentId: req.body.appointmentId || null,
    status: "requested",
    requestedAt: FieldValue.serverTimestamp(),
    lastMessageAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  await ref.set(payload);
  if (req.body.message) {
    await ref.collection("messages").add({
      hospitalId,
      chatId: ref.id,
      senderUid: req.user.uid,
      text: req.body.message,
      type: "text",
      createdAt: FieldValue.serverTimestamp(),
      readBy: [req.user.uid],
    });
  }
  await sendNotificationToUser(doctorUid, {
    title: "New chat request",
    body: "A patient wants to chat with you.",
  }, {hospitalId, chatId: ref.id});
  await writeAuditLog({
    hospitalId,
    actorId: req.user.uid,
    module: "messages",
    action: "requestChat",
    targetPath: ref.path,
  });
  created(res, {id: ref.id, ...payload});
});

app.post("/hms/hospitals/:hospitalId/chats/:chatId/accept", requireAuth, async (req, res) => {
  const {hospitalId, chatId} = req.params;
  const ref = db.collection("hospitals").doc(hospitalId).collection("chats").doc(chatId);
  const snap = await ref.get();
  if (!snap.exists) return notFound(res, "Chat not found");
  const chat = snap.data();
  const profile = await getActorProfile(req.user.uid);
  const allowed = chat.doctorUid === req.user.uid ||
    chat.doctorUsername === profile.username ||
    await actorCan(req.user, profile, hospitalId, "messages", "update");
  if (!allowed) return res.status(403).json({error: "Only the assigned doctor can accept this chat"});
  await ref.set({
    status: "open",
    acceptedBy: req.user.uid,
    acceptedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    lastMessageAt: FieldValue.serverTimestamp(),
  }, {merge: true});
  await ref.collection("messages").add({
    hospitalId,
    chatId,
    senderUid: req.user.uid,
    type: "system",
    text: "Doctor accepted the chat request.",
    createdAt: FieldValue.serverTimestamp(),
    readBy: [req.user.uid],
  });
  await sendNotificationToUser(chat.patientUid, {
    title: "Chat request accepted",
    body: "Your doctor is ready to chat.",
  }, {hospitalId, chatId});
  ok(res, {success: true, status: "open"});
});

app.post("/hms/hospitals/:hospitalId/chats/:chatId/messages", requireAuth, async (req, res) => {
  const {hospitalId, chatId} = req.params;
  const text = String(req.body.text || "").trim();
  if (!text) return badRequest(res, "text is required");
  const chatRef = db.collection("hospitals").doc(hospitalId).collection("chats").doc(chatId);
  const chatSnap = await chatRef.get();
  if (!chatSnap.exists) return notFound(res, "Chat not found");
  const chat = chatSnap.data();
  const participant = chat.patientUid === req.user.uid || chat.doctorUid === req.user.uid;
  if (!participant) return res.status(403).json({error: "Only chat participants can send messages"});
  if (chat.status !== "open") return badRequest(res, "Chat is not open");
  const messageRef = await chatRef.collection("messages").add({
    hospitalId,
    chatId,
    senderUid: req.user.uid,
    text,
    type: "text",
    attachmentPath: req.body.attachmentPath || null,
    createdAt: FieldValue.serverTimestamp(),
    readBy: [req.user.uid],
  });
  await chatRef.set({
    lastMessage: text.slice(0, 180),
    lastMessageAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }, {merge: true});
  await sendNotificationToUser(
    chat.patientUid === req.user.uid ? chat.doctorUid : chat.patientUid,
    {title: "New chat message", body: text.slice(0, 90)},
    {hospitalId, chatId},
  );
  created(res, {id: messageRef.id, text});
});

app.post("/hms/hospitals/:hospitalId/chats/:chatId/close", requireAuth, async (req, res) => {
  const {hospitalId, chatId} = req.params;
  const ref = db.collection("hospitals").doc(hospitalId).collection("chats").doc(chatId);
  const snap = await ref.get();
  if (!snap.exists) return notFound(res, "Chat not found");
  const chat = snap.data();
  const profile = await getActorProfile(req.user.uid);
  const allowed = chat.doctorUid === req.user.uid ||
    chat.doctorUsername === profile.username ||
    await actorCan(req.user, profile, hospitalId, "messages", "update");
  if (!allowed) return res.status(403).json({error: "Only the doctor can close this chat"});
  await ref.set({
    status: "closed",
    closedBy: req.user.uid,
    closedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }, {merge: true});
  await ref.collection("messages").add({
    hospitalId,
    chatId,
    senderUid: req.user.uid,
    type: "system",
    text: "Doctor closed the chat.",
    createdAt: FieldValue.serverTimestamp(),
    readBy: [req.user.uid],
  });
  ok(res, {success: true, status: "closed"});
});

app.post(
  "/hms/hospitals/:hospitalId/invoices",
  requireAuth,
  requireHospitalPermission("billing", "create"),
  async (req, res) => {
    const {hospitalId} = req.params;
    const ref = db.collection("hospitals").doc(hospitalId).collection("billing").doc();
    const lineItems = Array.isArray(req.body.lineItems) ? req.body.lineItems : [];
    const subtotal = lineItems.reduce((total, item) => total + Number(item.amount || 0), 0);
    const tax = Number(req.body.tax || 0);
    const total = subtotal + tax;
    const payload = {
      hospitalId,
      invoiceId: ref.id,
      patientUid: req.body.patientUid,
      appointmentId: req.body.appointmentId || null,
      lineItems,
      subtotal,
      tax,
      total,
      status: req.body.status || "draft",
      createdBy: req.user.uid,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    await ref.set(payload);
    await writeAuditLog({
      hospitalId,
      actorId: req.user.uid,
      module: "billing",
      action: "createInvoice",
      targetPath: ref.path,
      metadata: {total},
    });
    created(res, {id: ref.id, ...payload});
  },
);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({error: error.message || "Internal server error"});
});

exports.api = onRequest(
  {
    region: "asia-south1",
    cors: true,
    timeoutSeconds: 120,
    memory: "512MiB",
  },
  app,
);

exports.onInventoryWrite = onDocumentWritten(
  {
    region: "asia-south1",
    document: "hospitals/{hospitalId}/inventory/{medicineId}",
  },
  async (event) => {
    const after = event.data?.after;
    if (!after?.exists) return;
    const data = after.data();
    const stock = Number(data.stock || 0);
    const threshold = Number(data.lowStockThreshold || 0);
    if (threshold && stock <= threshold) {
      await createHospitalAlert(event.params.hospitalId, {
        type: "low_stock",
        severity: "warning",
        refPath: after.ref.path,
        title: "Low stock alert",
        message: `${data.medicineName || "Medicine"} has ${stock} units remaining.`,
      });
    }
  },
);

exports.onAppointmentWrite = onDocumentWritten(
  {
    region: "asia-south1",
    document: "hospitals/{hospitalId}/appointments/{appointmentId}",
  },
  async (event) => {
    const before = event.data?.before;
    const after = event.data?.after;
    if (!after?.exists) return;
    const appointment = after.data();
    const statusChanged = !before?.exists || before.data()?.status !== appointment.status;
    if (!statusChanged) return;

    await writeAuditLog({
      hospitalId: event.params.hospitalId,
      actorId: appointment.updatedBy || "system",
      module: "appointments",
      action: before?.exists ? "statusChanged" : "created",
      targetPath: after.ref.path,
      metadata: {status: appointment.status},
    });

    await sendNotificationToUser(appointment.patientUid, {
      title: "Appointment update",
      body: `Your appointment is ${appointment.status || "updated"}.`,
    }, {
      hospitalId: event.params.hospitalId,
      appointmentId: event.params.appointmentId,
    });
  },
);

exports.dailyExpiryAlerts = onSchedule(
  {
    region: "asia-south1",
    schedule: "every day 08:00",
    timeZone: "Asia/Kolkata",
  },
  async () => {
    const soon = new Date();
    soon.setDate(soon.getDate() + 30);
    const snap = await db
      .collectionGroup("inventory")
      .where("expiryDate", "<=", Timestamp.fromDate(soon))
      .limit(500)
      .get();

    const writes = snap.docs.map((doc) => {
      const segments = doc.ref.path.split("/");
      const hospitalId = segments[1];
      const data = doc.data();
      return createHospitalAlert(hospitalId, {
        type: "expiry",
        severity: "warning",
        refPath: doc.ref.path,
        title: "Medicine expiry alert",
        message: `${data.medicineName || "Medicine"} expires soon.`,
      });
    });
    await Promise.all(writes);
  },
);
