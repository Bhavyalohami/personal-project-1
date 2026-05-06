import Cookies from "js-cookie";

export const DEFAULT_HOSPITAL_ID = "default-hospital";

export const HMS_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STAFF: "staff",
  DOCTOR: "doctor",
  PATIENT: "patient",
};

export const ADMIN_ONLY_PANEL_SLUGS = [
  "/consultationquery",
  "/managecontent",
  "/blogs",
  "/blogcategories",
  "/services",
  "/feedback",
  "/manageenquiries",
  "/managelocation",
  "/managedepartment",
  "/logochange",
  "/faviconchange",
  "/socialmediaprofiles",
  "/timings",
  "/slogantext",
  "/address",
  "/currencysettings",
];

export const HMS_PERMISSIONS = {
  appointments: ["view", "create", "update", "delete", "export"],
  patients: ["view", "create", "update", "delete", "export"],
  inventory: ["view", "create", "update", "delete", "export"],
  staff: ["view", "create", "update", "delete"],
  billing: ["view", "create", "update", "delete", "export"],
  emr: ["view", "create", "update", "delete"],
  media: ["view", "create", "update", "delete"],
  tests: ["view", "create", "update", "delete", "export"],
  testBookings: ["view", "create", "update", "delete", "export"],
  messages: ["view", "create", "update"],
  reports: ["view", "export"],
};

export const getCookieRoles = () => {
  const raw = Cookies.get("roles");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
  } catch (error) {
    return raw.split(",").map((role) => role.trim()).filter(Boolean);
  }
};

export const isAdminFromCookies = () =>
  Cookies.get("is_superuser") === "true" || getCookieRoles().includes(HMS_ROLES.ADMIN);

export const isVendorFromCookies = () =>
  Cookies.get("is_vendor") === "true" || getCookieRoles().includes("vendor");

export const isDoctorFromCookies = () =>
  Cookies.get("is_staff") === "true" &&
  Cookies.get("is_vendor") !== "true" &&
  Cookies.get("is_superuser") !== "true";

export const getActiveHospitalId = () =>
  Cookies.get("hospitalId") ||
  Cookies.get("defaultHospitalId") ||
  window.localStorage?.getItem("activeHospitalId") ||
  DEFAULT_HOSPITAL_ID;

export const setActiveHospitalId = (hospitalId) => {
  Cookies.set("hospitalId", hospitalId || DEFAULT_HOSPITAL_ID, { expires: 7 });
  window.localStorage?.setItem("activeHospitalId", hospitalId || DEFAULT_HOSPITAL_ID);
};

export const isAdminOnlyPanelPath = (pathname = "") =>
  ADMIN_ONLY_PANEL_SLUGS.some((slug) =>
    pathname.includes(`/admin${slug}`) ||
    pathname.includes(`/vendor${slug}`) ||
    pathname.includes(`/doctor${slug}`),
  );
