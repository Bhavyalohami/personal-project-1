import axios from "axios";

const siteConfig = {
  id: "site",
  name: "CareBridge",
  site_name: "CareBridge",
  new_logo: "/brand/carebridge-logo-future.png",
  favicon: "/brand/carebridge-favicon-future.png",
  slogan_title: "Smart clinic appointments with a human touch",
  slogan_text:
    "Find trusted specialists, choose the right time, and manage appointments with a calm, connected care experience.",
  address: "22 Wellness Avenue, New Delhi, India",
  city: "New Delhi",
  state: "Delhi",
  country: "India",
  postal_code: "110001",
  email: "care@carebridge.example",
  contact_email: "care@carebridge.example",
  phone: "+91 98765 43210",
  contact: "+91 98765 43210",
  currency: "USD",
  currency_symbol: "$",
  opening_time: "09:00",
  closing_time: "19:00",
  facebook: "https://www.facebook.com",
  instagram: "https://www.instagram.com",
  twitter: "https://www.twitter.com",
  linkedin: "https://www.linkedin.com",
  status: 1,
};

const locations = [
  { id: "loc-delhi", name: "New Delhi", status: 1 },
  { id: "loc-noida", name: "Noida", status: 1 },
  { id: "loc-gurugram", name: "Gurugram", status: 1 },
];

const departments = [
  { id: "dep-cardiology", name: "Cardiology", status: 1 },
  { id: "dep-dermatology", name: "Dermatology", status: 1 },
  { id: "dep-neurology", name: "Neurology", status: 1 },
  { id: "dep-pediatrics", name: "Pediatrics", status: 1 },
  { id: "dep-orthopedics", name: "Orthopedics", status: 1 },
  { id: "dep-general", name: "General Medicine", status: 1 },
];

const staff = [
  {
    id: "doctor-amelia-shah",
    fname: "Amelia",
    lname: "Shah",
    name: "Dr. Amelia Shah",
    username: "amelia.shah",
    email: "amelia.shah@doctorsconsultation.example",
    role: "Doctor",
    designation: "Senior Cardiologist",
    department: "Cardiology",
    location: "New Delhi",
    yoe: 14,
    amount: 65,
    status: 1,
    average_rating: 4.8,
    rating: 4.8,
    image: "/brand/doctor-avatar-female-teal.png",
    introduction:
      "Dr. Amelia Shah focuses on preventive cardiology, hypertension management, and long-term heart health planning.",
    achievements:
      "<p>Fellowship in non-invasive cardiology. Published research on lifestyle-led cardiac recovery.</p>",
  },
  {
    id: "doctor-rahul-mehta",
    fname: "Rahul",
    lname: "Mehta",
    name: "Dr. Rahul Mehta",
    username: "rahul.mehta",
    email: "rahul.mehta@doctorsconsultation.example",
    role: "Doctor",
    designation: "Consultant Dermatologist",
    department: "Dermatology",
    location: "Noida",
    yoe: 9,
    amount: 45,
    status: 1,
    average_rating: 4.6,
    rating: 4.6,
    image: "/brand/doctor-avatar-teal.png",
    introduction:
      "Dr. Rahul Mehta treats acne, pigmentation, hair loss, and chronic skin allergies with evidence-based plans.",
    achievements:
      "<p>Member of the Indian Association of Dermatologists. Advanced dermoscopy certification.</p>",
  },
  {
    id: "doctor-nisha-rao",
    fname: "Nisha",
    lname: "Rao",
    name: "Dr. Nisha Rao",
    username: "nisha.rao",
    email: "nisha.rao@doctorsconsultation.example",
    role: "Doctor",
    designation: "Neurology Specialist",
    department: "Neurology",
    location: "Gurugram",
    yoe: 12,
    amount: 70,
    status: 1,
    average_rating: 4.9,
    rating: 4.9,
    image: "/brand/doctor-avatar-female-teal.png",
    introduction:
      "Dr. Nisha Rao helps patients with migraines, seizures, neuropathy, and memory concerns.",
    achievements:
      "<p>Lead clinician for headache care pathways and patient education programs.</p>",
  },
  {
    id: "doctor-vikram-kapoor",
    fname: "Vikram",
    lname: "Kapoor",
    name: "Dr. Vikram Kapoor",
    username: "vikram.kapoor",
    email: "vikram.kapoor@doctorsconsultation.example",
    role: "Doctor",
    designation: "Orthopedic Surgeon",
    department: "Orthopedics",
    location: "New Delhi",
    yoe: 16,
    amount: 75,
    status: 1,
    average_rating: 4.7,
    rating: 4.7,
    image: "/brand/doctor-avatar-teal.png",
    introduction:
      "Dr. Vikram Kapoor works with sports injuries, joint pain, fractures, and post-operative rehabilitation.",
    achievements:
      "<p>Special training in minimally invasive joint procedures and sports rehabilitation.</p>",
  },
  {
    id: "doctor-priya-menon",
    fname: "Priya",
    lname: "Menon",
    name: "Dr. Priya Menon",
    username: "priya.menon",
    email: "priya.menon@doctorsconsultation.example",
    role: "Doctor",
    designation: "Pediatrician",
    department: "Pediatrics",
    location: "Noida",
    yoe: 11,
    amount: 50,
    status: 1,
    average_rating: 4.8,
    rating: 4.8,
    image: "/brand/doctor-avatar-female-teal.png",
    introduction:
      "Dr. Priya Menon supports newborn care, vaccination planning, nutrition, and childhood illness management.",
    achievements:
      "<p>Certified in pediatric emergency care and family health counseling.</p>",
  },
  {
    id: "doctor-arjun-sen",
    fname: "Arjun",
    lname: "Sen",
    name: "Dr. Arjun Sen",
    username: "arjun.sen",
    email: "arjun.sen@doctorsconsultation.example",
    role: "Doctor",
    designation: "Family Physician",
    department: "General Medicine",
    location: "Gurugram",
    yoe: 8,
    amount: 40,
    status: 1,
    average_rating: 4.5,
    rating: 4.5,
    image: "/brand/doctor-avatar-teal.png",
    introduction:
      "Dr. Arjun Sen provides primary care, chronic illness follow-up, preventive screening, and travel health advice.",
    achievements:
      "<p>Runs community health camps and preventive screening clinics.</p>",
  },
];

const services = [
  {
    id: "svc-cardiology",
    name: "Cardiology",
    text: "Heart health consultations, ECG review, blood pressure care, and preventive cardiac plans.",
    image: "/brand/service-icon-teal.png",
    status: 1,
  },
  {
    id: "svc-dermatology",
    name: "Dermatology",
    text: "Skin, hair, allergy, acne, and pigmentation treatment with practical follow-up plans.",
    image: "/brand/service-icon-teal.png",
    status: 1,
  },
  {
    id: "svc-neurology",
    name: "Neurology",
    text: "Specialist support for migraine, nerve pain, seizures, dizziness, and memory concerns.",
    image: "/brand/service-icon-teal.png",
    status: 1,
  },
  {
    id: "svc-pediatrics",
    name: "Pediatrics",
    text: "Child health, growth monitoring, vaccinations, nutrition, and urgent pediatric advice.",
    image: "/brand/service-icon-teal.png",
    status: 1,
  },
  {
    id: "svc-orthopedics",
    name: "Orthopedics",
    text: "Joint pain, sports injuries, fracture recovery, posture issues, and mobility care.",
    image: "/brand/service-icon-teal.png",
    status: 1,
  },
  {
    id: "svc-general-medicine",
    name: "General Medicine",
    text: "Primary care for fever, infections, chronic conditions, health checks, and referrals.",
    image: "/brand/service-icon-teal.png",
    status: 1,
  },
];

const blogCategories = [
  { id: "blogcat-wellness", name: "Wellness", status: 1 },
  { id: "blogcat-prevention", name: "Prevention", status: 1 },
  { id: "blogcat-family-care", name: "Family Care", status: 1 },
];

const blogs = [
  {
    id: "blog-heart-checkup",
    name: "When should you schedule a heart check-up?",
    author: "Care Team",
    date: "2026-05-01",
    category: "Prevention",
    image: "/brand/blog-heart-care-teal.png",
    text:
      "<p>Regular heart screening helps catch risk factors early, especially if you have high blood pressure, diabetes, chest discomfort, or a family history of heart disease.</p>",
    status: 1,
  },
  {
    id: "blog-skin-care",
    name: "Simple skin habits dermatologists recommend",
    author: "Dr. Rahul Mehta",
    date: "2026-04-22",
    category: "Wellness",
    image: "/brand/blog-skin-care-teal.png",
    text:
      "<p>Consistent sunscreen, gentle cleansing, and early treatment for recurring irritation can prevent many common skin problems from becoming chronic.</p>",
    status: 1,
  },
  {
    id: "blog-child-fever",
    name: "What to watch when a child has fever",
    author: "Dr. Priya Menon",
    date: "2026-04-10",
    category: "Family Care",
    image: "/brand/blog-family-care-teal.png",
    text:
      "<p>Hydration, temperature patterns, breathing comfort, alertness, and age are important clues. Seek urgent care when symptoms feel unusual or severe.</p>",
    status: 1,
  },
];

const patients = [
  {
    id: "patient-demo",
    username: "demo.patient",
    name: "Demo Patient",
    age: "26-35",
    gender: "Female",
    contact: "9876543210",
    email: "patient@example.com",
    city: "New Delhi",
    image: "/brand/patient-avatar-teal.png",
    status: 1,
  },
];

const feedback = [
  {
    id: "feedback-1",
    doctor: "doctor-amelia-shah",
    patient: patients[0],
    rating: 5,
    review: "Clear advice, easy booking, and a calm consultation.",
    is_active: true,
    status: 1,
  },
  {
    id: "feedback-2",
    doctor: "doctor-rahul-mehta",
    patient: patients[0],
    rating: 4.5,
    review: "The treatment plan was simple and explained well.",
    is_active: true,
    status: 1,
  },
];

const appointments = [
  {
    id: "appt-demo-1",
    name: "Demo Patient",
    username: "demo.patient",
    doctor: "Dr. Amelia Shah",
    doctor_username: "amelia.shah",
    location: "New Delhi",
    department: "Cardiology",
    date: "2026-05-08",
    time: "10:00 - 10:30",
    status: "confirmed",
    payment_status: 1,
    amount: 65,
  },
];

const holidays = [
  {
    id: "holiday-1",
    username: "amelia.shah",
    date: "2026-05-15",
    comment: "Doctor unavailable",
    status: 1,
  },
];

const hospitals = [
  {
    id: "default-hospital",
    hospitalId: "default-hospital",
    name: "CareBridge Central Hospital",
    summary:
      "A full-service clinic and diagnostics hub for appointments, lab tests, and follow-up care.",
    status: "active",
    public: true,
    rating: 4.8,
    reviewCount: 312,
    openingHours: "09:00 - 19:00",
    heroImage: "/brand/hms/hospital-discovery-hero.png",
    profileImage: "/brand/hms/hospital-diagnostics-suite.png",
    contact: {
      phone: "+91 98765 43210",
      email: "central@carebridge.example",
      website: "https://carebridge.example",
    },
    location: {
      city: "New Delhi",
      area: "Connaught Place",
      address: "22 Wellness Avenue, Connaught Place, New Delhi, India",
      lat: 28.6315,
      lng: 77.2167,
      geoHash: "ttnfvp",
    },
    specialties: ["Cardiology", "Neurology", "Dermatology", "General Medicine"],
  },
  {
    id: "noida-care-hospital",
    hospitalId: "noida-care-hospital",
    name: "CareBridge Noida Wellness Hospital",
    summary:
      "A high-throughput outpatient hospital with pediatrics, dermatology, diagnostics, and wellness testing.",
    status: "active",
    public: true,
    rating: 4.6,
    reviewCount: 184,
    openingHours: "08:30 - 20:00",
    heroImage: "/brand/hms/hospital-care-team.png",
    profileImage: "/brand/hms/hospital-care-team.png",
    contact: {
      phone: "+91 98111 22334",
      email: "noida@carebridge.example",
      website: "https://carebridge.example/noida",
    },
    location: {
      city: "Noida",
      area: "Sector 62",
      address: "A-18 Health Park, Sector 62, Noida, India",
      lat: 28.627,
      lng: 77.3722,
      geoHash: "ttngn3",
    },
    specialties: ["Pediatrics", "Dermatology", "Orthopedics", "Diagnostics"],
  },
  {
    id: "gurugram-medtech-hospital",
    hospitalId: "gurugram-medtech-hospital",
    name: "CareBridge Gurugram MedTech Hospital",
    summary:
      "A technology-forward hospital for neurology, orthopedics, imaging, and preventive health packages.",
    status: "active",
    public: true,
    rating: 4.7,
    reviewCount: 227,
    openingHours: "09:00 - 21:00",
    heroImage: "/brand/hms/hospital-diagnostics-suite.png",
    profileImage: "/brand/hms/test-booking-lab.png",
    contact: {
      phone: "+91 98222 33445",
      email: "gurugram@carebridge.example",
      website: "https://carebridge.example/gurugram",
    },
    location: {
      city: "Gurugram",
      area: "Cyber City",
      address: "5 MedTech Plaza, Cyber City, Gurugram, India",
      lat: 28.4949,
      lng: 77.0888,
      geoHash: "ttn8z9",
    },
    specialties: ["Neurology", "Orthopedics", "Radiology", "Preventive Health"],
  },
];

const hospitalMedia = {
  "default-hospital": [
    { id: "central-hero", type: "image", title: "Central care lounge", url: "/brand/hms/hospital-discovery-hero.png", public: true },
    { id: "central-diagnostics", type: "image", title: "Diagnostics and consulting", url: "/brand/hms/hospital-diagnostics-suite.png", public: true },
  ],
  "noida-care-hospital": [
    { id: "noida-care-team", type: "image", title: "Noida clinical team", url: "/brand/hms/hospital-care-team.png", public: true },
  ],
  "gurugram-medtech-hospital": [
    { id: "gurugram-tech-care", type: "image", title: "MedTech diagnostics", url: "/brand/hms/hospital-diagnostics-suite.png", public: true },
  ],
};

const tests = [
  { id: "test-cbc", name: "Complete Blood Count", category: "Pathology", durationMinutes: 15, price: 450, image: "/brand/hms/test-booking-lab.png", status: "active", public: true },
  { id: "test-lipid-profile", name: "Lipid Profile", category: "Pathology", durationMinutes: 15, price: 800, image: "/brand/hms/test-booking-lab.png", status: "active", public: true },
  { id: "test-mri-brain", name: "MRI Brain", category: "Radiology", durationMinutes: 45, price: 6500, image: "/brand/hms/hospital-diagnostics-suite.png", status: "active", public: true },
  { id: "test-ecg", name: "ECG", category: "Cardiology", durationMinutes: 10, price: 350, image: "/brand/hms/hospital-care-team.png", status: "active", public: true },
];

const hospitalTestIds = {
  "default-hospital": ["test-cbc", "test-lipid-profile", "test-mri-brain", "test-ecg"],
  "noida-care-hospital": ["test-cbc", "test-lipid-profile", "test-ecg"],
  "gurugram-medtech-hospital": ["test-cbc", "test-mri-brain", "test-ecg"],
};

const testSlots = [
  ["slot-central-cbc-1", "default-hospital", "test-cbc", "2026-05-08", "09:30", 8],
  ["slot-central-cbc-2", "default-hospital", "test-cbc", "2026-05-08", "12:30", 6],
  ["slot-central-mri-1", "default-hospital", "test-mri-brain", "2026-05-09", "10:00", 3],
  ["slot-central-ecg-1", "default-hospital", "test-ecg", "2026-05-09", "15:00", 10],
  ["slot-noida-cbc-1", "noida-care-hospital", "test-cbc", "2026-05-08", "10:00", 7],
  ["slot-noida-lipid-1", "noida-care-hospital", "test-lipid-profile", "2026-05-10", "08:30", 5],
  ["slot-gurugram-mri-1", "gurugram-medtech-hospital", "test-mri-brain", "2026-05-10", "11:00", 2],
  ["slot-gurugram-ecg-1", "gurugram-medtech-hospital", "test-ecg", "2026-05-11", "16:00", 9],
].map(([id, hospitalId, testId, date, startTime, capacity]) => ({
  id,
  hospitalId,
  testId,
  date,
  startTime,
  capacity,
  booked: 0,
  availableCapacity: capacity,
  status: "open",
  public: true,
}));

const inventory = [
  { id: "med-paracetamol-500", hospitalId: "default-hospital", medicineName: "Paracetamol 500mg", batchNo: "PCM-0526", stock: 120, lowStockThreshold: 30, expiryDate: "2027-02-28", price: 18, category: "Analgesic" },
  { id: "med-amoxicillin-250", hospitalId: "default-hospital", medicineName: "Amoxicillin 250mg", batchNo: "AMX-1126", stock: 42, lowStockThreshold: 25, expiryDate: "2026-11-15", price: 64, category: "Antibiotic" },
  { id: "med-vitamin-d3", hospitalId: "default-hospital", medicineName: "Vitamin D3 Sachet", batchNo: "D3-0726", stock: 18, lowStockThreshold: 20, expiryDate: "2027-07-01", price: 35, category: "Supplement" },
];

const notifications = [
  { id: "notify-low-stock-vitamin-d3", hospitalId: "default-hospital", type: "inventory", severity: "warning", title: "Low stock alert", message: "Vitamin D3 Sachet is below its reorder threshold.", isRead: false, createdAt: new Date().toISOString() },
  { id: "notify-test-booking-today", hospitalId: "default-hospital", type: "testBooking", severity: "info", title: "Diagnostic slot ready", message: "Upcoming lab slots are open for patient booking.", isRead: false, createdAt: new Date(Date.now() - 2700000).toISOString() },
];

const auditLogs = [
  { id: "audit-default-hospital-seeded", hospitalId: "default-hospital", actorName: "System", actorRole: "admin", module: "hospitals", action: "seed", summary: "Default hospital profile and discovery data are available.", createdAt: new Date(Date.now() - 5400000).toISOString() },
  { id: "audit-inventory-threshold", hospitalId: "default-hospital", actorName: "Inventory Function", actorRole: "system", module: "inventory", action: "low-stock-check", summary: "Low stock threshold evaluated for active medicines.", createdAt: new Date(Date.now() - 1500000).toISOString() },
];

const pageContent = {
  "privacy-policy": {
    id: "privacy-policy",
    title: "Privacy Policy",
    content:
      "<h2>Information We Collect</h2><p>CareBridge may collect appointment details, contact information, profile data, doctor selections, preferred time slots, and messages submitted through the platform.</p><h2>How We Use Information</h2><p>We use information to manage appointments, support communication, improve booking flows, and keep clinic visit details organized.</p>",
  },
  "terms-of-service": {
    id: "terms-of-service",
    title: "Terms of Service",
    content:
      "<h2>Using CareBridge</h2><p>CareBridge helps patients discover specialists, request appointments, and manage clinic visit details. Please provide accurate information and use the service for lawful healthcare appointment purposes.</p><h2>Appointments</h2><p>Availability depends on clinic and doctor schedules, and bookings may be confirmed, rescheduled, or cancelled if availability changes.</p>",
  },
};

const storeKey = (name) => `carebridge-static-api-${name}`;
const clone = (value) => JSON.parse(JSON.stringify(value));
const pad = (value) => String(value).padStart(2, "0");

const readStore = (name, seed) => {
  if (typeof window === "undefined") return clone(seed);
  try {
    const raw = window.localStorage.getItem(storeKey(name));
    return raw ? JSON.parse(raw) : clone(seed);
  } catch (error) {
    return clone(seed);
  }
};

const writeStore = (name, data) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storeKey(name), JSON.stringify(data));
};

const findById = (items, id) =>
  items.find((item) => String(item.id) === String(id) || String(item.username) === String(id));

const activeItems = (items) =>
  items.filter((item) => item.status === 1 || item.status === "active" || item.is_active === true);

const searchStaff = (query) => {
  const q = String(query || "").toLowerCase().trim();
  const doctors = activeItems(staff);
  if (!q) return doctors.slice(0, 8);
  return doctors
    .filter((doctor) =>
      [doctor.fname, doctor.lname, doctor.name, doctor.department, doctor.location, doctor.designation, doctor.username]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    )
    .slice(0, 10);
};

const makeSubSlots = (date, slotId, startHour) =>
  [
    [0, 30],
    [30, 60],
  ].map(([startMinute, endMinute], index) => ({
    id: `${slotId}-sub-${index + 1}`,
    start_time: `${pad(startHour)}:${pad(startMinute)}:00`,
    end_time: endMinute === 60 ? `${pad(startHour + 1)}:00:00` : `${pad(startHour)}:${pad(endMinute)}:00`,
    is_active: true,
    is_booked: new Date(`${date}T00:00:00`).getDate() % 5 === 0 && index === 0,
  }));

const buildMonthlySlots = (year, month) => {
  const numericYear = Number(year);
  const numericMonth = Number(month);
  const daysInMonth = new Date(numericYear, numericMonth, 0).getDate();
  const slotsByDate = {};

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${numericYear}-${pad(numericMonth)}-${pad(day)}`;
    if (new Date(`${date}T00:00:00`).getDay() === 0) continue;

    const slots = [
      { id: `${date}-morning`, slot_number: 1, start_time: "10:00:00", end_time: "11:00:00", duration: 30, is_active: true },
      { id: `${date}-afternoon`, slot_number: 2, start_time: "15:00:00", end_time: "16:00:00", duration: 30, is_active: true },
    ].map((slot) => {
      const sub_slots = makeSubSlots(date, slot.id, slot.slot_number === 1 ? 10 : 15);
      return {
        ...slot,
        sub_slots,
        booked_sub_slot_count: sub_slots.filter((subSlot) => subSlot.is_booked).length,
      };
    });
    const allSubSlots = slots.flatMap((slot) => slot.sub_slots);
    slotsByDate[date] = {
      id: date,
      date,
      total_count: allSubSlots.length,
      total_booked: allSubSlots.filter((slot) => slot.is_booked).length,
      slots,
    };
  }

  return slotsByDate;
};

const patientForUsername = (username) =>
  findById(readStore("patients", patients), username) || {
    ...patients[0],
    id: username || "patient-demo",
    username: username || "demo.patient",
  };

const hospitalProfile = (hospitalId) => {
  const hospital = findById(hospitals, hospitalId) || hospitals[0];
  const allowedTestIds = hospitalTestIds[hospital.id] || [];
  const hospitalDoctors = staff.filter((doctor) =>
    String(doctor.location || "").toLowerCase().includes(String(hospital.location?.city || "").toLowerCase()) ||
    hospital.id === "default-hospital",
  );
  return {
    ...hospital,
    media: hospitalMedia[hospital.id] || [],
    services,
    doctors: hospitalDoctors,
    tests: tests.filter((test) => allowedTestIds.includes(test.id)),
  };
};

const staticResponse = (data, status = 200) => ({ data: clone(data), status });

const parseUrl = (config) => {
  if (typeof window === "undefined") return null;
  try {
    const url = new URL(config.url || "", window.location.origin);
    const pathname = (url.pathname.replace(/^\/api(?=\/|$)/, "").replace(/\/+$/, "") || "/");
    return { url, pathname };
  } catch (error) {
    return null;
  }
};

const shouldUseStaticApi = (config, pathname, url) => {
  if (!pathname || (!pathname.startsWith("/clinic") && !pathname.startsWith("/hms"))) return false;
  const href = String(config.url || "");
  return (
    href.includes("cloudfunctions.net/api") ||
    href.includes("127.0.0.1:5050") ||
    href.includes("localhost:5050") ||
    url.origin === window.location.origin
  );
};

const resolveGet = (pathname, url) => {
  if (["/clinic/configurations", "/clinic/slogan", "/clinic/logochange", "/clinic/faviconchange", "/clinic/timings", "/clinic/address", "/clinic/socialmediaprofiles", "/clinic/socialmediaprofile", "/clinic/currency"].includes(pathname)) {
    return staticResponse(siteConfig);
  }
  if (pathname === "/clinic/latest-services") return staticResponse(activeItems(services).slice(0, 6));
  if (pathname === "/clinic/services-list") return staticResponse(services);
  if (pathname.startsWith("/clinic/services-list/")) return staticResponse(findById(services, pathname.split("/").pop()) || {});
  if (pathname === "/clinic/blogs-list") return staticResponse(blogs);
  if (pathname.startsWith("/clinic/blogs-list/")) return staticResponse(findById(blogs, pathname.split("/").pop()) || {});
  if (pathname === "/clinic/manageblogcategories") return staticResponse(blogCategories);
  if (["/clinic/staff-list", "/clinic/allstaff", "/clinic/doctorlist"].includes(pathname)) return staticResponse(staff);
  if (pathname === "/clinic/home-search-staff") return staticResponse(searchStaff(url.searchParams.get("q")));
  if (pathname.startsWith("/clinic/staff-list/")) return staticResponse(findById(staff, pathname.split("/").pop()) || {});
  if (pathname === "/clinic/managelocation") return staticResponse(locations);
  if (pathname === "/clinic/managedepartment") return staticResponse(departments);
  if (pathname === "/clinic/feedback-list") return staticResponse(feedback);
  if (pathname.startsWith("/clinic/feedback-list/")) {
    const doctorId = pathname.split("/").pop();
    const doctor = findById(staff, doctorId) || {};
    const doctorFeedback = feedback.filter(
      (item) =>
        item.doctor === doctorId ||
        item.doctor === doctor.id ||
        item.doctor === doctor.username,
    );
    const averageRating =
      doctorFeedback.length > 0
        ? doctorFeedback.reduce((total, item) => total + Number(item.rating || 0), 0) /
          doctorFeedback.length
        : Number(doctor.average_rating || doctor.rating || 0);
    return staticResponse({
      doctor,
      feedback: doctorFeedback,
      overall_rating: Number(averageRating.toFixed(1)),
    });
  }
  if (pathname.startsWith("/clinic/monthly/")) {
    const parts = pathname.split("/");
    return staticResponse(buildMonthlySlots(parts[3], parts[4]));
  }
  if (pathname.startsWith("/clinic/doctormonthlyslots/")) {
    const parts = pathname.split("/");
    return staticResponse(buildMonthlySlots(parts[4], parts[5]));
  }
  if (pathname.startsWith("/clinic/slots/")) {
    const [, , , date] = pathname.split("/");
    return staticResponse(buildMonthlySlots(date?.slice(0, 4), date?.slice(5, 7))[date]?.slots || []);
  }
  if (pathname === "/clinic/manageholiday") return staticResponse(holidays);
  if (pathname.startsWith("/clinic/manageholiday/")) {
    const username = pathname.split("/").pop();
    return staticResponse(holidays.filter((item) => item.username === username));
  }
  if (pathname.startsWith("/clinic/patient-profile/")) return staticResponse(patientForUsername(pathname.split("/").pop()));
  if (pathname === "/clinic/check-username") {
    const username = String(url.searchParams.get("username") || "").toLowerCase();
    return staticResponse({ exists: patients.some((patient) => patient.username === username) });
  }
  if (pathname === "/clinic/patient-booking-history") return staticResponse(readStore("appointments", appointments));
  if (pathname.startsWith("/clinic/bookings-list/")) return staticResponse(findById(readStore("appointments", appointments), pathname.split("/").pop()) || {});
  if (pathname === "/clinic/booking") return staticResponse(readStore("appointments", appointments));
  if (pathname.startsWith("/clinic/booking/")) {
    const username = pathname.split("/").pop();
    return staticResponse(readStore("appointments", appointments).filter((item) => item.doctor_username === username || item.username === username));
  }
  if (pathname.startsWith("/clinic/managepages/")) return staticResponse(pageContent[pathname.split("/").pop()] || {});
  if (pathname === "/clinic/admin") return staticResponse({ id: "admin", username: "admin", name: "Admin", image: "/brand/patient-avatar-teal.png" });
  if (pathname === "/clinic/vendor-profile") return staticResponse([{ id: "demo-manager", username: "manager", name: "Hospital Manager", image: "/brand/patient-avatar-teal.png" }]);
  if (pathname.startsWith("/clinic/vendor-profile/")) return staticResponse({ id: pathname.split("/").pop(), username: "manager", name: "Hospital Manager", image: "/brand/patient-avatar-teal.png" });
  if (pathname.startsWith("/clinic/get-notification")) return staticResponse(notifications);
  if (pathname === "/clinic/weekly-graphs") return staticResponse({ labels: ["Mon", "Tue", "Wed", "Thu", "Fri"], booked: [4, 6, 5, 7, 3], available: [12, 11, 13, 10, 14], cancelled: [0, 1, 0, 1, 0] });
  if (pathname === "/clinic/graphs") return staticResponse({ booked: 25, available: 60, cancelled: 2 });
  if (pathname.startsWith("/clinic/dashboard/")) return staticResponse({ appointments, documents: [], notifications });
  if (pathname === "/clinic/documents") return staticResponse([]);
  if (pathname === "/clinic/consultation-query") return staticResponse([]);
  if (pathname === "/clinic/contact-form-list") return staticResponse([]);
  if (pathname === "/clinic/setupnotifications") return staticResponse([]);
  if (pathname.startsWith("/clinic/roles/")) return staticResponse({ role: "doctor", permissions: [] });

  if (pathname === "/hms/schema") return staticResponse({ backend: "static-firebase-ready", modules: ["hospitals", "appointments", "tests", "inventory", "messages"] });
  if (pathname === "/hms/hospitals" || pathname === "/hms/discovery/hospitals") {
    const city = String(url.searchParams.get("city") || "").toLowerCase();
    return staticResponse(hospitals.filter((hospital) => (city ? String(hospital.location?.city || "").toLowerCase() === city : true)));
  }
  if (/^\/hms\/hospitals\/[^/]+\/profile$/.test(pathname)) return staticResponse(hospitalProfile(pathname.split("/")[3]));
  if (/^\/hms\/hospitals\/[^/]+\/tests$/.test(pathname)) {
    const hospitalId = pathname.split("/")[3];
    return staticResponse(tests.filter((test) => (hospitalTestIds[hospitalId] || []).includes(test.id)));
  }
  if (/^\/hms\/hospitals\/[^/]+\/test-slots$/.test(pathname)) {
    const hospitalId = pathname.split("/")[3];
    const testId = url.searchParams.get("testId");
    return staticResponse(testSlots.filter((slot) => slot.hospitalId === hospitalId && (!testId || slot.testId === testId)));
  }
  if (/^\/hms\/hospitals\/[^/]+\/test-bookings$/.test(pathname)) return staticResponse(readStore("testBookings", []));
  if (/^\/hms\/hospitals\/[^/]+\/inventory$/.test(pathname)) return staticResponse(readStore("inventory", inventory));
  if (/^\/hms\/hospitals\/[^/]+\/notifications$/.test(pathname)) return staticResponse(notifications);
  if (/^\/hms\/hospitals\/[^/]+\/audit-logs$/.test(pathname)) return staticResponse(auditLogs);
  if (/^\/hms\/hospitals\/[^/]+\/chats$/.test(pathname)) return staticResponse(readStore("chats", []));

  return staticResponse([]);
};

const resolveWrite = (pathname, config) => {
  let payload = {};
  try {
    payload = typeof config.data === "string" ? JSON.parse(config.data || "{}") : config.data || {};
  } catch (error) {
    payload = {};
  }

  if (["/clinic/booking", "/clinic/submit-appointment"].includes(pathname) || /^\/hms\/hospitals\/[^/]+\/appointments$/.test(pathname)) {
    const data = readStore("appointments", appointments);
    const appointment = { id: payload.id || `appt-${Date.now()}`, status: "confirmed", ...payload };
    writeStore("appointments", [appointment, ...data]);
    return staticResponse(appointment, 201);
  }
  if (pathname === "/clinic/feedback") {
    const data = readStore("feedback", feedback);
    const item = { id: `feedback-${Date.now()}`, status: 1, is_active: true, ...payload };
    writeStore("feedback", [item, ...data]);
    return staticResponse(item, 201);
  }
  if (pathname === "/clinic/submit-contact" || pathname === "/clinic/consultation-query") {
    return staticResponse({ id: `request-${Date.now()}`, success: true, ...payload }, 201);
  }
  if (/^\/hms\/hospitals\/[^/]+\/test-bookings$/.test(pathname)) {
    const data = readStore("testBookings", []);
    const booking = { id: `test-booking-${Date.now()}`, status: "booked", ...payload };
    writeStore("testBookings", [booking, ...data]);
    return staticResponse(booking, 201);
  }
  if (/^\/hms\/hospitals\/[^/]+\/chats\/request$/.test(pathname)) {
    const data = readStore("chats", []);
    const chat = { id: `chat-${Date.now()}`, status: "requested", lastMessage: payload.message || "Chat request sent.", ...payload };
    writeStore("chats", [chat, ...data]);
    return staticResponse(chat, 201);
  }
  if (/^\/hms\/hospitals\/[^/]+\/chats\/[^/]+\/(accept|close)$/.test(pathname)) {
    return staticResponse({ success: true, status: pathname.endsWith("/close") ? "closed" : "open" });
  }
  if (/^\/hms\/hospitals\/[^/]+\/chats\/[^/]+\/messages$/.test(pathname)) {
    return staticResponse({ id: `message-${Date.now()}`, ...payload }, 201);
  }

  return staticResponse({ id: payload.id || `static-${Date.now()}`, success: true, ...payload }, 200);
};

const resolveStaticApiResponse = (config) => {
  const parsed = parseUrl(config);
  if (!parsed || !shouldUseStaticApi(config, parsed.pathname, parsed.url)) return null;

  const method = String(config.method || "get").toUpperCase();
  if (method === "GET") return resolveGet(parsed.pathname, parsed.url);
  if (method === "DELETE") return staticResponse({ success: true });
  return resolveWrite(parsed.pathname, config);
};

export const installStaticApiFallback = () => {
  if (axios.__carebridgeStaticApiInstalled) return;
  axios.__carebridgeStaticApiInstalled = true;

  axios.interceptors.request.use((config) => {
    const response = resolveStaticApiResponse(config);
    if (!response) return config;

    return {
      ...config,
      adapter: async (adapterConfig) => ({
        data: response.data,
        status: response.status,
        statusText: response.status === 201 ? "Created" : "OK",
        headers: { "content-type": "application/json" },
        config: adapterConfig,
        request: { staticApiFallback: true },
      }),
    };
  });
};
