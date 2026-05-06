import Cookies from "js-cookie";
import {
  createUserWithEmailAndPassword,
  getIdToken,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./firebaseClient";

const normalizeUsername = (username) => String(username || "").trim().toLowerCase();
const DEMO_PASSWORD = "Demo123!";
const DEMO_USERS_KEY = "doctor-consultation-demo-users";
const defaultDoctorSubRoles = [
  { roleId: "4", subroles: [1, 2, 3, 4, 5, 11] },
  { roleId: "5", subroles: [3, 4, 6] },
  { roleId: "13", subroles: [1, 2, 3, 4, 7, 9] },
  { roleId: "19", subroles: [1, 2, 3, 4, 7] },
];

const demoProfiles = [
  {
    uid: "demo-patient",
    username: "demo.patient",
    usernameLower: "demo.patient",
    email: "patient@example.com",
    roles: ["patient"],
    is_staff: false,
    is_vendor: false,
    is_superuser: false,
  },
  {
    uid: "demo-admin",
    username: "admin",
    usernameLower: "admin",
    email: "admin@example.com",
    roles: ["admin"],
    is_staff: true,
    is_vendor: false,
    is_superuser: true,
  },
  {
    uid: "demo-doctor",
    username: "doctor",
    usernameLower: "doctor",
    email: "doctor@example.com",
    roles: ["doctor", "staff"],
    subroles: defaultDoctorSubRoles,
    is_staff: true,
    is_vendor: false,
    is_superuser: false,
  },
  {
    uid: "demo-vendor",
    username: "vendor",
    usernameLower: "vendor",
    email: "vendor@example.com",
    roles: ["vendor"],
    is_staff: false,
    is_vendor: true,
    is_superuser: false,
  },
];

const canUseLocalStorage = () => typeof window !== "undefined" && window.localStorage;

const readStoredDemoProfiles = () => {
  if (!canUseLocalStorage()) return [];
  try {
    return JSON.parse(window.localStorage.getItem(DEMO_USERS_KEY) || "[]");
  } catch (error) {
    return [];
  }
};

const saveStoredDemoProfile = (profile) => {
  if (!canUseLocalStorage()) return;
  const existing = readStoredDemoProfiles().filter(
    (item) => item.usernameLower !== profile.usernameLower && item.email !== profile.email,
  );
  window.localStorage.setItem(DEMO_USERS_KEY, JSON.stringify([...existing, profile]));
};

const allDemoProfiles = () => [...demoProfiles, ...readStoredDemoProfiles()];

const findDemoProfile = (usernameOrEmail) => {
  const value = normalizeUsername(usernameOrEmail);
  return allDemoProfiles().find(
    (profile) =>
      profile.usernameLower === value ||
      normalizeUsername(profile.email) === value,
  );
};

const makeDemoUser = (profile) => ({
  uid: profile.uid,
  email: profile.email,
  displayName: profile.username,
});

const requireFirebaseConfig = () => {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Add your Firebase web app values to .env."
    );
  }
};

export const usernameExists = async (username) => {
  if (!isFirebaseConfigured) {
    return Boolean(findDemoProfile(username));
  }
  requireFirebaseConfig();
  const snap = await getDoc(doc(db, "usernames", normalizeUsername(username)));
  return snap.exists();
};

export const getEmailForUsername = async (usernameOrEmail) => {
  if (!isFirebaseConfigured) {
    const value = String(usernameOrEmail || "").trim();
    if (value.includes("@")) return value;
    const profile = findDemoProfile(value);
    if (!profile) {
      throw new Error("No account exists for this username.");
    }
    return profile.email;
  }
  requireFirebaseConfig();
  const value = String(usernameOrEmail || "").trim();
  if (value.includes("@")) return value;

  const snap = await getDoc(doc(db, "usernames", normalizeUsername(value)));
  if (!snap.exists()) {
    throw new Error("No account exists for this username.");
  }
  return snap.data().email;
};

export const getCurrentUserProfile = async (uid = auth.currentUser?.uid) => {
  if (!isFirebaseConfigured) {
    return allDemoProfiles().find((profile) => profile.uid === uid) || null;
  }
  requireFirebaseConfig();
  if (!uid) return null;
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { uid, ...snap.data() } : null;
};

export const registerPatient = async ({ username, email, password }) => {
  if (!isFirebaseConfigured) {
    const normalizedUsername = normalizeUsername(username);
    const alreadyExists = await usernameExists(normalizedUsername);
    if (alreadyExists) {
      throw new Error("This username already exists");
    }

    const profile = {
      uid: `demo-patient-${Date.now()}`,
      username,
      usernameLower: normalizedUsername,
      email,
      password,
      roles: ["patient"],
      is_staff: false,
      is_vendor: false,
      is_superuser: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveStoredDemoProfile(profile);
    return {
      user: makeDemoUser(profile),
      profile,
      token: `demo-token-${profile.uid}`,
    };
  }

  requireFirebaseConfig();
  const normalizedUsername = normalizeUsername(username);
  const alreadyExists = await usernameExists(normalizedUsername);
  if (alreadyExists) {
    throw new Error("This username already exists");
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: username });

  const profile = {
    uid: credential.user.uid,
    username,
    usernameLower: normalizedUsername,
    email,
    roles: ["patient"],
    is_staff: false,
    is_vendor: false,
    is_superuser: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, "users", credential.user.uid), profile);
  await setDoc(doc(db, "patients", credential.user.uid), {
    uid: credential.user.uid,
    username,
    name: username,
    email,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await setDoc(doc(db, "usernames", normalizedUsername), {
    uid: credential.user.uid,
    username,
    email,
    roles: ["patient"],
  });

  return { user: credential.user, profile };
};

export const loginWithUsernameOrEmail = async (usernameOrEmail, password) => {
  if (!isFirebaseConfigured) {
    const profile = findDemoProfile(usernameOrEmail);
    const expectedPassword = profile?.password || DEMO_PASSWORD;

    if (!profile || password !== expectedPassword) {
      throw new Error(
        "Demo login failed. Use Demo123! for built-in demo accounts.",
      );
    }

    return {
      user: makeDemoUser(profile),
      profile,
      token: `demo-token-${profile.uid}`,
    };
  }

  requireFirebaseConfig();
  const email = await getEmailForUsername(usernameOrEmail);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getCurrentUserProfile(credential.user.uid);
  const token = await getIdToken(credential.user);
  return { user: credential.user, profile, token };
};

export const logoutFirebaseUser = async () => {
  await signOut(auth);
  [
    "token",
    "patient_token",
    "patient_username",
    "patient_uid",
    "username",
    "uid",
    "hospitalId",
    "defaultHospitalId",
    "is_staff",
    "is_vendor",
    "is_superuser",
    "staff",
    "superuser",
    "status",
    "patient_status",
    "roles",
    "subroles",
  ].forEach((name) => Cookies.remove(name));
};

export const setLegacyAuthCookies = ({ token, profile, expires = 1, patient = false }) => {
  const roles = profile?.roles || [];
  const username = profile?.username || profile?.email || "";
  const uid = profile?.uid || profile?.user?.uid || "";
  const defaultHospitalId =
    profile?.defaultHospitalId ||
    profile?.hospitalId ||
    (Array.isArray(profile?.hospitalIds) ? profile.hospitalIds[0] : "") ||
    "default-hospital";
  const isStaff = Boolean(profile?.is_staff || roles.includes("staff") || roles.includes("doctor"));
  const isVendor = Boolean(profile?.is_vendor || roles.includes("vendor"));
  const isSuperuser = Boolean(profile?.is_superuser || roles.includes("admin"));
  const subroles =
    Array.isArray(profile?.subroles) && profile.subroles.length > 0
      ? profile.subroles
      : isStaff && !isVendor && !isSuperuser
      ? defaultDoctorSubRoles
      : [];

  Cookies.set("token", token, { expires });
  Cookies.set("username", username, { expires });
  Cookies.set("uid", uid, { expires });
  Cookies.set("hospitalId", defaultHospitalId, { expires });
  Cookies.set("defaultHospitalId", defaultHospitalId, { expires });
  Cookies.set("is_staff", isStaff, { expires });
  Cookies.set("is_vendor", isVendor, { expires });
  Cookies.set("is_superuser", isSuperuser, { expires });
  Cookies.set("status", 200, { expires });
  Cookies.set("roles", JSON.stringify(roles), { expires });
  Cookies.set("subroles", JSON.stringify(subroles), { expires });

  if (patient) {
    Cookies.set("patient_token", token, { expires });
    Cookies.set("patient_username", username, { expires });
    Cookies.set("patient_uid", uid, { expires });
    Cookies.set("staff", isStaff, { expires });
    Cookies.set("superuser", isSuperuser, { expires });
    Cookies.set("patient_status", 200, { expires });
  }
};
