const http = require("http");
const fs = require("fs");
const path = require("path");
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
  buildMonthlySlots,
} = require("../functions/seedData");
const {
  hmsHospitals,
  hmsMedia,
  hmsTests,
  hospitalTestIds,
  hmsTestSlots,
} = require("../functions/hmsSeedData");

const PORT = Number(process.env.MOCK_API_PORT || 5050);
const PUBLIC_DIR = path.resolve(__dirname, "..", "public");
const writes = {
  contacts: [],
  consultationQueries: [],
  appointments: [...appointments],
  feedback: [...feedback],
  holidays: [...holidays],
  inventory: [
    {
      id: "med-paracetamol-500",
      hospitalId: "default-hospital",
      medicineName: "Paracetamol 500mg",
      batchNo: "PCM-0526",
      stock: 120,
      lowStockThreshold: 30,
      expiryDate: "2027-02-28",
      price: 18,
      category: "Analgesic",
    },
    {
      id: "med-amoxicillin-250",
      hospitalId: "default-hospital",
      medicineName: "Amoxicillin 250mg",
      batchNo: "AMX-1126",
      stock: 42,
      lowStockThreshold: 25,
      expiryDate: "2026-11-15",
      price: 64,
      category: "Antibiotic",
    },
    {
      id: "med-vitamin-d3",
      hospitalId: "default-hospital",
      medicineName: "Vitamin D3 Sachet",
      batchNo: "D3-0726",
      stock: 18,
      lowStockThreshold: 20,
      expiryDate: "2027-07-01",
      price: 35,
      category: "Supplement",
    },
  ],
  chats: [],
  testSlots: [...hmsTestSlots],
  testBookings: [],
  notifications: [
    {
      id: "notify-low-stock-vitamin-d3",
      hospitalId: "default-hospital",
      type: "inventory",
      severity: "warning",
      title: "Low stock alert",
      message: "Vitamin D3 Sachet is below its reorder threshold.",
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "notify-test-booking-today",
      hospitalId: "default-hospital",
      type: "testBooking",
      severity: "info",
      title: "Diagnostic slot ready",
      message: "Upcoming lab slots are open for patient booking.",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
  ],
  auditLogs: [
    {
      id: "audit-default-hospital-seeded",
      hospitalId: "default-hospital",
      actorName: "System",
      actorRole: "admin",
      module: "hospitals",
      action: "seed",
      summary: "Default hospital profile and discovery data are available.",
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
    {
      id: "audit-inventory-threshold",
      hospitalId: "default-hospital",
      actorName: "Inventory Function",
      actorRole: "system",
      module: "inventory",
      action: "low-stock-check",
      summary: "Low stock threshold evaluated for active medicines.",
      createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    },
  ],
};

const json = (res, status, data) => {
  res.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(data));
};

const readBody = (req) =>
  new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        resolve(Object.fromEntries(new URLSearchParams(body)));
      }
    });
  });

const normalizedPath = (pathname) => pathname.replace(/\/+$/, "") || "/";

const serveAsset = (req, res, pathname) => {
  const requested = path.resolve(PUBLIC_DIR, `.${pathname}`);
  if (!requested.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return true;
  }
  if (!fs.existsSync(requested) || !fs.statSync(requested).isFile()) {
    return false;
  }

  const ext = path.extname(requested).toLowerCase();
  const type =
    {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".webp": "image/webp",
      ".ico": "image/x-icon",
    }[ext] || "application/octet-stream";

  res.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": type,
  });
  fs.createReadStream(requested).pipe(res);
  return true;
};

const findById = (items, id) =>
  items.find((item) => String(item.id) === String(id) || String(item.username) === String(id));

const searchStaff = (query) => {
  const q = String(query || "").toLowerCase().trim();
  if (!q) return staff.filter((doctor) => doctor.status === 1).slice(0, 8);
  return staff
    .filter((doctor) =>
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
        .includes(q),
    )
    .slice(0, 10);
};

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
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(dLng / 2) ** 2;
  return Number((earthKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1));
};

const doctorsForHospital = (hospitalId) => {
  const hospital = hmsHospitals.find((item) => item.id === hospitalId);
  if (!hospital) return [];
  return staff
    .filter((doctor) => {
      const city = String(hospital.location?.city || "").toLowerCase();
      return String(doctor.location || "").toLowerCase().includes(city) || hospitalId === "default-hospital";
    })
    .map((doctor) => ({
      ...doctor,
      hospitalId,
      doctorId: doctor.id,
      doctorUsername: doctor.username,
      expertise: doctor.department || doctor.designation,
      expertiseTags: [doctor.department, doctor.designation].filter(Boolean),
      public: true,
      active: doctor.status !== 0,
    }));
};

const servicesForHospital = (hospitalId) =>
  services.map((service) => ({ ...service, hospitalId, public: true }));

const testsForHospital = (hospitalId) =>
  (hospitalTestIds[hospitalId] || [])
    .map((testId) => hmsTests.find((test) => test.id === testId))
    .filter(Boolean)
    .map((test) => ({ ...test, hospitalId }));

const hospitalProfile = (hospitalId) => {
  const hospital = hmsHospitals.find((item) => item.id === hospitalId);
  if (!hospital) return null;
  return {
    hospital,
    media: hmsMedia[hospitalId] || [],
    services: servicesForHospital(hospitalId),
    doctors: doctorsForHospital(hospitalId),
    tests: testsForHospital(hospitalId),
    testSlots: writes.testSlots.filter(
      (slot) => slot.hospitalId === hospitalId && slot.status === "open" && slot.availableCapacity > 0,
    ),
  };
};

const patientForUsername = (username) => {
  const found = patients.find(
    (patient) => String(patient.username).toLowerCase() === String(username).toLowerCase(),
  );
  if (found) return found;
  return {
    id: `patient-${username}`,
    username,
    name: username || "Demo Patient",
    age: "26-35",
    gender: "Female",
    contact: "9876543210",
    email: `${username || "patient"}@example.com`,
    city: "New Delhi",
    image: "/brand/patient-avatar.svg",
    status: 1,
  };
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

const appointmentSummary = (items) => {
  const list = Array.isArray(items) ? items : [];
  const today = new Date().toISOString().slice(0, 10);
  const todaysAppointments = list.filter((item) => item.date === today);
  const cancelledAppointments = list.filter((item) => item.status === "cancelled");

  return {
    appointments: list,
    todays_appointments: todaysAppointments.length ? todaysAppointments : list.slice(0, 5),
    cancelled_appointments: cancelledAppointments,
    total_appointments: list.length,
    total_patients: patients.length,
    total_doctors: staff.filter((doctor) => doctor.status === 1).length,
    staff,
    departments,
    locations,
    services,
  };
};

const route = async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = normalizedPath(url.pathname);
  const method = req.method.toUpperCase();

  if (method === "OPTIONS") return json(res, 204, {});
  if (
    (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/brand/")) &&
    serveAsset(req, res, url.pathname)
  ) {
    return;
  }
  if (pathname === "/health") return json(res, 200, {status: "ok", backend: "local-firebase-mock"});

  const body = ["POST", "PUT", "PATCH"].includes(method) ? await readBody(req) : {};

  if (method === "GET" && [
    "/clinic/configurations",
    "/clinic/slogan",
    "/clinic/logochange",
    "/clinic/faviconchange",
    "/clinic/timings",
    "/clinic/address",
    "/clinic/socialmediaprofiles",
    "/clinic/socialmediaprofile",
    "/clinic/currency",
  ].includes(pathname)) {
    return json(res, 200, siteConfig);
  }

  if (["PUT", "PATCH"].includes(method) && pathname.startsWith("/clinic/")) {
    return json(res, 200, {...siteConfig, ...body, updatedAt: new Date().toISOString()});
  }

  if (method === "GET" && pathname === "/clinic/latest-services") {
    return json(res, 200, services.filter((item) => item.status === 1).slice(0, 6));
  }
  if (method === "GET" && pathname === "/clinic/services-list") return json(res, 200, services);
  if (method === "GET" && pathname.startsWith("/clinic/services-list/")) {
    return json(res, 200, findById(services, pathname.split("/").pop()) || {});
  }

  if (method === "GET" && pathname === "/clinic/blogs-list") return json(res, 200, blogs);
  if (method === "GET" && pathname.startsWith("/clinic/blogs-list/")) {
    return json(res, 200, findById(blogs, pathname.split("/").pop()) || {});
  }
  if (method === "GET" && pathname === "/clinic/manageblogcategories") {
    return json(res, 200, blogCategories);
  }

  if (method === "GET" && ["/clinic/staff-list", "/clinic/allstaff", "/clinic/doctorlist"].includes(pathname)) {
    return json(res, 200, staff);
  }
  if (method === "GET" && pathname === "/clinic/home-search-staff") {
    return json(res, 200, searchStaff(url.searchParams.get("q")));
  }
  if (method === "GET" && pathname.startsWith("/clinic/staff-list/")) {
    return json(res, 200, findById(staff, pathname.split("/").pop()) || {});
  }

  if (method === "GET" && pathname === "/clinic/managelocation") return json(res, 200, locations);
  if (method === "GET" && pathname === "/clinic/managedepartment") return json(res, 200, departments);

  if (method === "GET" && pathname.startsWith("/clinic/feedback-list/")) {
    const doctorId = pathname.split("/").pop();
    const doctor = findById(staff, doctorId);
    const reviews = feedback.filter((item) => item.doctor === doctorId && item.is_active !== false);
    const rating = reviews.length
      ? reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length
      : Number(doctor?.average_rating || 0);
    return json(res, doctor ? 200 : 404, {
      doctor: doctor || null,
      feedback: reviews,
      overall_rating: Number(rating.toFixed(1)),
    });
  }
  if (method === "GET" && pathname === "/clinic/feedback-list") return json(res, 200, feedback);

  if (method === "GET" && pathname.startsWith("/clinic/monthly/")) {
    const [, , , year, month] = pathname.split("/");
    return json(res, 200, buildMonthlySlots(year, month));
  }
  if (method === "GET" && pathname.startsWith("/clinic/doctormonthlyslots/")) {
    const parts = pathname.split("/");
    return json(res, 200, buildMonthlySlots(parts[4], parts[5]));
  }
  if (method === "GET" && pathname.startsWith("/clinic/slots/")) {
    const parts = pathname.split("/");
    const date = parts[4];
    const [year, month] = String(date).split("-");
    const slot = buildMonthlySlots(year, month)[date];
    return json(res, 200, slot ? [slot] : []);
  }
  if (method === "GET" && pathname === "/clinic/manageholiday") {
    const username = url.searchParams.get("username");
    return json(res, 200, writes.holidays.filter((item) => item.username === username));
  }
  if (method === "GET" && pathname.startsWith("/clinic/manageholiday/")) {
    const username = pathname.split("/").pop();
    return json(res, 200, writes.holidays.filter((item) => item.username === username));
  }

  if (method === "GET" && pathname.startsWith("/clinic/patient-profile/")) {
    return json(res, 200, patientForUsername(pathname.split("/").pop()));
  }
  if (method === "GET" && pathname === "/clinic/check-username") {
    const username = String(url.searchParams.get("username") || "").toLowerCase();
    return json(res, 200, {exists: username === "demo.patient"});
  }
  if (method === "GET" && pathname === "/clinic/patient-booking-history") {
    return json(res, 200, writes.appointments);
  }
  if (method === "GET" && pathname.startsWith("/clinic/bookings-list/")) {
    const id = pathname.split("/").pop();
    const appointment = findById(writes.appointments, id);
    return json(res, appointment ? 200 : 404, appointment || { error: "Not found" });
  }
  if (method === "GET" && pathname === "/clinic/booking") {
    const username = url.searchParams.get("username");
    const scopedAppointments = username
      ? writes.appointments.filter((item) => appointmentMatchesDoctor(item, username))
      : writes.appointments;

    return json(res, 200, appointmentSummary(scopedAppointments));
  }
  if (method === "GET" && pathname.startsWith("/clinic/booking/")) {
    const username = pathname.split("/").pop();
    return json(
      res,
      200,
      writes.appointments.filter((item) => appointmentMatchesDoctor(item, username)),
    );
  }

  if (method === "GET" && pathname.startsWith("/clinic/managepages/")) {
    const slug = pathname.split("/").pop();
    return json(res, 200, {
      id: slug,
      slug,
      title: slug === "privacy-policy" ? "Privacy Policy" : "Terms of Service",
      text:
        "<p>This demo content is ready to edit from the admin panel after Firebase is connected.</p>",
      status: 1,
    });
  }

  if (method === "POST" && ["/clinic/submit-contact", "/clinic/contact-form-list"].includes(pathname)) {
    const saved = {...body, id: `contact-${Date.now()}`, createdAt: new Date().toISOString()};
    writes.contacts.push(saved);
    return json(res, 201, saved);
  }
  if (method === "POST" && pathname === "/clinic/consultation-query") {
    const saved = {...body, id: `query-${Date.now()}`, createdAt: new Date().toISOString()};
    writes.consultationQueries.push(saved);
    return json(res, 201, saved);
  }
  if (method === "POST" && ["/clinic/booking", "/clinic/submit-appointment"].includes(pathname)) {
    const saved = {
      ...body,
      id: `appt-${Date.now()}`,
      doctor_username: body.doctor_username || body.username || "",
      status: body.status || "confirmed",
      createdAt: new Date().toISOString(),
    };
    writes.appointments.push(saved);
    return json(res, 201, {success: true, ...saved});
  }
  if (method === "POST" && pathname === "/clinic/manageholiday") {
    const dates = Array.isArray(body.dates) ? body.dates : [];
    dates.forEach((date) => {
      writes.holidays.push({
        id: `holiday-${body.username}-${date}`,
        username: body.username,
        date,
        comment: body.comments || body.comment || null,
      });
    });
    return json(res, 201, {success: true, holidays: dates.length});
  }
  if (method === "DELETE" && pathname === "/clinic/manageholiday") {
    const deleteBody = await readBody(req);
    const dates = Array.isArray(deleteBody.dates) ? deleteBody.dates : [];
    writes.holidays = writes.holidays.filter(
      (item) => !(item.username === deleteBody.username && dates.includes(item.date)),
    );
    return json(res, 200, {success: true});
  }
  if (method === "POST" && pathname === "/clinic/feedback") {
    const saved = {...body, id: `feedback-${Date.now()}`, is_active: true};
    writes.feedback.push(saved);
    return json(res, 201, saved);
  }
  if (method === "POST" && pathname === "/clinic/PayWithStripe") {
    return json(res, 200, {
      demoMode: true,
      clientSecret: null,
      message: "Stripe is not configured in local Firebase mock mode.",
    });
  }
  if (method === "POST" && pathname === "/clinic/seed-demo-data") {
    return json(res, 200, {
      success: true,
      message: "Local mock already serves the demo data. Run this against deployed Firebase after login.",
    });
  }

  if (method === "GET" && pathname === "/hms/schema") {
    return json(res, 200, {
      hospitals: [
        "hospitals/{hospitalId}/media",
        "hospitals/{hospitalId}/services",
        "hospitals/{hospitalId}/doctors",
        "hospitals/{hospitalId}/tests",
        "hospitals/{hospitalId}/testSlots",
        "appointments",
        "inventory",
        "staff",
        "chats",
      ],
      roles: ["admin", "manager", "staff", "doctor", "patient"],
      modules: ["appointments", "inventory", "staff", "billing", "emr", "media", "tests", "testBookings", "messages"],
    });
  }
  if (method === "POST" && pathname === "/hms/setup-default-hospital") {
    return json(res, 200, {
      success: true,
      hospitalId: "default-hospital",
      seeded: "local mock",
    });
  }
  if (method === "GET" && pathname === "/hms/hospitals") {
    return json(res, 200, hmsHospitals);
  }
  if (method === "POST" && pathname === "/hms/hospitals") {
    return json(res, 201, {
      id: `hospital-${Date.now()}`,
      status: "active",
      ...body,
    });
  }
  if (method === "GET" && pathname === "/hms/discovery/hospitals") {
    const city = String(url.searchParams.get("city") || "").toLowerCase();
    const geoHashPrefix = String(url.searchParams.get("geoHashPrefix") || "");
    const lat = url.searchParams.get("lat");
    const lng = url.searchParams.get("lng");
    const list = hmsHospitals
      .filter((hospital) => hospital.status === "active" && hospital.public !== false)
      .filter((hospital) => (city ? String(hospital.location?.city || "").toLowerCase() === city : true))
      .filter((hospital) =>
        geoHashPrefix ? String(hospital.location?.geoHash || "").startsWith(geoHashPrefix) : true,
      )
      .map((hospital) => ({
        ...hospital,
        distanceKm: distanceKm(lat, lng, hospital.location?.lat, hospital.location?.lng),
      }))
      .sort((a, b) => {
        if (a.distanceKm != null && b.distanceKm != null) return a.distanceKm - b.distanceKm;
        return Number(b.rating || 0) - Number(a.rating || 0);
      });
    return json(res, 200, list);
  }
  if (method === "GET" && /^\/hms\/hospitals\/[^/]+\/profile$/.test(pathname)) {
    const profile = hospitalProfile(pathname.split("/")[3]);
    return json(res, profile ? 200 : 404, profile || {error: "Hospital not found"});
  }
  if (method === "PATCH" && /^\/hms\/hospitals\/[^/]+\/profile$/.test(pathname)) {
    const hospitalId = pathname.split("/")[3];
    const hospital = hmsHospitals.find((item) => item.id === hospitalId);
    if (!hospital) return json(res, 404, {error: "Hospital not found"});
    Object.assign(hospital, body, {updatedAt: new Date().toISOString()});
    return json(res, 200, {success: true, hospitalId, hospital});
  }
  if (method === "POST" && /^\/hms\/hospitals\/[^/]+\/media$/.test(pathname)) {
    const hospitalId = pathname.split("/")[3];
    const saved = {
      id: `media-${Date.now()}`,
      hospitalId,
      type: body.type || "image",
      title: body.title || "Hospital media",
      url: body.url,
      sortOrder: Number(body.sortOrder || 99),
      public: body.public !== false,
      createdAt: new Date().toISOString(),
    };
    hmsMedia[hospitalId] = [saved, ...(hmsMedia[hospitalId] || [])];
    return json(res, 201, saved);
  }
  if (method === "POST" && /^\/hms\/users\/[^/]+\/role$/.test(pathname)) {
    return json(res, 200, {
      success: true,
      uid: pathname.split("/")[3],
      ...body,
    });
  }
  if (method === "POST" && /^\/hms\/hospitals\/[^/]+\/members$/.test(pathname)) {
    return json(res, 201, {
      success: true,
      hospitalId: pathname.split("/")[3],
      ...body,
    });
  }
  if (method === "GET" && /^\/hms\/hospitals\/[^/]+\/tests$/.test(pathname)) {
    return json(res, 200, testsForHospital(pathname.split("/")[3]));
  }
  if (method === "POST" && /^\/hms\/hospitals\/[^/]+\/tests$/.test(pathname)) {
    const hospitalId = pathname.split("/")[3];
    const saved = {
      id: body.id || `test-${Date.now()}`,
      hospitalId,
      category: body.category || "Diagnostics",
      durationMinutes: Number(body.durationMinutes || 15),
      price: Number(body.price || 0),
      public: body.public !== false,
      status: body.status || "active",
      createdAt: new Date().toISOString(),
      ...body,
    };
    hmsTests.push(saved);
    hospitalTestIds[hospitalId] = [...(hospitalTestIds[hospitalId] || []), saved.id];
    return json(res, 201, saved);
  }
  if (method === "GET" && /^\/hms\/hospitals\/[^/]+\/test-slots$/.test(pathname)) {
    const hospitalId = pathname.split("/")[3];
    const testId = url.searchParams.get("testId");
    return json(
      res,
      200,
      writes.testSlots
        .filter((slot) => slot.hospitalId === hospitalId)
        .filter((slot) => (testId ? slot.testId === testId : true))
        .filter((slot) => slot.status === "open" && Number(slot.availableCapacity || 0) > 0)
        .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)),
    );
  }
  if (method === "POST" && /^\/hms\/hospitals\/[^/]+\/test-slots$/.test(pathname)) {
    const hospitalId = pathname.split("/")[3];
    const capacity = Number(body.capacity || 1);
    const saved = {
      id: `slot-${Date.now()}`,
      hospitalId,
      testId: body.testId,
      date: body.date,
      startTime: body.startTime,
      capacity,
      booked: 0,
      availableCapacity: capacity,
      status: "open",
      public: body.public !== false,
      createdAt: new Date().toISOString(),
    };
    writes.testSlots.push(saved);
    return json(res, 201, saved);
  }
  if (method === "GET" && /^\/hms\/hospitals\/[^/]+\/test-bookings$/.test(pathname)) {
    const hospitalId = pathname.split("/")[3];
    return json(res, 200, writes.testBookings.filter((booking) => booking.hospitalId === hospitalId));
  }
  if (method === "POST" && /^\/hms\/hospitals\/[^/]+\/test-bookings$/.test(pathname)) {
    const hospitalId = pathname.split("/")[3];
    const test = testsForHospital(hospitalId).find((item) => item.id === body.testId);
    const slot = writes.testSlots.find(
      (item) => item.hospitalId === hospitalId && item.id === body.slotId,
    );
    if (!test || !slot) return json(res, 404, {error: "Test or slot not found"});
    if (Number(slot.availableCapacity || 0) <= 0) {
      return json(res, 409, {error: "Selected test slot is full"});
    }
    slot.booked = Number(slot.booked || 0) + 1;
    slot.availableCapacity = Number(slot.availableCapacity || 0) - 1;
    const hospital = hmsHospitals.find((item) => item.id === hospitalId);
    const saved = {
      id: `test-booking-${Date.now()}`,
      userId: body.userId || "demo-patient",
      patientUid: body.patientUid || body.userId || "demo-patient",
      patientName: body.patientName || "Demo Patient",
      hospitalId,
      hospitalName: hospital?.name || hospitalId,
      testId: test.id,
      testName: test.name,
      slotId: slot.id,
      date: slot.date,
      startTime: slot.startTime,
      price: test.price,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    writes.testBookings.unshift(saved);
    return json(res, 201, saved);
  }
  if (method === "GET" && /^\/hms\/hospitals\/[^/]+\/inventory$/.test(pathname)) {
    const hospitalId = pathname.split("/")[3];
    return json(
      res,
      200,
      writes.inventory.filter((item) => item.hospitalId === hospitalId),
    );
  }
  if (method === "POST" && /^\/hms\/hospitals\/[^/]+\/inventory$/.test(pathname)) {
    const hospitalId = pathname.split("/")[3];
    const saved = {
      id: `med-${Date.now()}`,
      hospitalId,
      stock: Number(body.stock || 0),
      lowStockThreshold: Number(body.lowStockThreshold || 20),
      price: Number(body.price || 0),
      createdAt: new Date().toISOString(),
      ...body,
    };
    writes.inventory.unshift(saved);
    return json(res, 201, saved);
  }
  if (method === "POST" && /^\/hms\/hospitals\/[^/]+\/inventory\/[^/]+\/adjust-stock$/.test(pathname)) {
    const parts = pathname.split("/");
    const hospitalId = parts[3];
    const medicineId = parts[5];
    const delta = Number(body.delta || 0);
    const medicine = writes.inventory.find(
      (item) => item.hospitalId === hospitalId && item.id === medicineId,
    );
    if (!medicine) return json(res, 404, {error: "Medicine not found"});
    medicine.stock = Math.max(0, Number(medicine.stock || 0) + delta);
    medicine.updatedAt = new Date().toISOString();
    return json(res, 200, {success: true, item: medicine});
  }
  if (method === "POST" && /^\/hms\/hospitals\/[^/]+\/appointments$/.test(pathname)) {
    const saved = {
      id: `hms-appt-${Date.now()}`,
      hospitalId: pathname.split("/")[3],
      status: body.status || "confirmed",
      createdAt: new Date().toISOString(),
      ...body,
    };
    writes.appointments.push(saved);
    return json(res, 201, saved);
  }
  if (method === "GET" && /^\/hms\/hospitals\/[^/]+\/chats$/.test(pathname)) {
    const hospitalId = pathname.split("/")[3];
    return json(
      res,
      200,
      writes.chats.filter((chat) => chat.hospitalId === hospitalId),
    );
  }
  if (method === "GET" && /^\/hms\/hospitals\/[^/]+\/notifications$/.test(pathname)) {
    const hospitalId = pathname.split("/")[3];
    return json(
      res,
      200,
      writes.notifications
        .filter((item) => item.hospitalId === hospitalId)
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))),
    );
  }
  if (method === "GET" && /^\/hms\/hospitals\/[^/]+\/audit-logs$/.test(pathname)) {
    const hospitalId = pathname.split("/")[3];
    return json(
      res,
      200,
      writes.auditLogs
        .filter((item) => item.hospitalId === hospitalId)
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))),
    );
  }
  if (method === "POST" && /^\/hms\/hospitals\/[^/]+\/chats\/request$/.test(pathname)) {
    const hospitalId = pathname.split("/")[3];
    const saved = {
      id: `chat-${Date.now()}`,
      hospitalId,
      patientUid: body.patientUid || "demo-patient",
      patientName: body.patientName || "Demo Patient",
      doctorUid: body.doctorUid || body.doctorUsername || body.doctorId || "demo-doctor",
      doctorUsername: body.doctorUsername,
      doctorName: body.doctorName || "CareBridge Doctor",
      status: "requested",
      lastMessage: body.message || "Chat request sent.",
      lastMessageAt: new Date().toISOString(),
      messages: [
        {
          id: `message-${Date.now()}`,
          senderUid: body.patientUid || "demo-patient",
          text: body.message || "Hello doctor, I would like to chat about my care.",
          createdAt: new Date().toISOString(),
        },
      ],
    };
    writes.chats.unshift(saved);
    return json(res, 201, saved);
  }
  if (method === "POST" && /^\/hms\/hospitals\/[^/]+\/chats\/[^/]+\/accept$/.test(pathname)) {
    const chat = writes.chats.find((item) => item.id === pathname.split("/")[5]);
    if (!chat) return json(res, 404, {error: "Chat not found"});
    chat.status = "open";
    chat.acceptedAt = new Date().toISOString();
    return json(res, 200, {success: true, status: chat.status});
  }
  if (method === "POST" && /^\/hms\/hospitals\/[^/]+\/chats\/[^/]+\/close$/.test(pathname)) {
    const chat = writes.chats.find((item) => item.id === pathname.split("/")[5]);
    if (!chat) return json(res, 404, {error: "Chat not found"});
    chat.status = "closed";
    chat.closedAt = new Date().toISOString();
    return json(res, 200, {success: true, status: chat.status});
  }
  if (method === "POST" && /^\/hms\/hospitals\/[^/]+\/chats\/[^/]+\/messages$/.test(pathname)) {
    const chat = writes.chats.find((item) => item.id === pathname.split("/")[5]);
    if (!chat) return json(res, 404, {error: "Chat not found"});
    const saved = {
      id: `message-${Date.now()}`,
      senderUid: body.senderUid || "demo-user",
      text: body.text,
      createdAt: new Date().toISOString(),
    };
    chat.messages = [...(chat.messages || []), saved];
    chat.lastMessage = body.text;
    chat.lastMessageAt = saved.createdAt;
    return json(res, 201, saved);
  }
  if (method === "POST" && /^\/hms\/hospitals\/[^/]+\/invoices$/.test(pathname)) {
    return json(res, 201, {
      id: `invoice-${Date.now()}`,
      hospitalId: pathname.split("/")[3],
      status: "draft",
      createdAt: new Date().toISOString(),
      ...body,
    });
  }

  if (pathname.startsWith("/clinic/")) {
    return json(res, method === "GET" ? 200 : 201, method === "GET" ? [] : {success: true, ...body});
  }

  return json(res, 404, {error: "Not found"});
};

const server = http.createServer((req, res) => {
  route(req, res).catch((error) => {
    console.error(error);
    json(res, 500, {error: error.message || "Internal server error"});
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Local Firebase-compatible API running at http://127.0.0.1:${PORT}`);
});
