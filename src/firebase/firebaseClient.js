import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey:
    process.env.REACT_APP_FIREBASE_API_KEY ||
    "AIzaSyAX_wvWhjTrCgAe7ZwOPHW1RSM8UoFdjow",
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
    "clinic-appointment-booki-15481.firebaseapp.com",
  projectId:
    process.env.REACT_APP_FIREBASE_PROJECT_ID ||
    "clinic-appointment-booki-15481",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    "clinic-appointment-booki-15481.firebasestorage.app",
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "877570508998",
  appId:
    process.env.REACT_APP_FIREBASE_APP_ID ||
    "1:877570508998:web:406b8e09b87ff713c92fc7",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId &&
    firebaseConfig.messagingSenderId
);

export const isFirebaseAuthEnabled =
  process.env.REACT_APP_FIREBASE_AUTH_ENABLED === "true";

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

export const auth = app ? getAuth(app) : { currentUser: null };
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const functions = app ? getFunctions(app, "asia-south1") : null;

export default app;
