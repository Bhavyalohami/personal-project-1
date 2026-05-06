import Cookies from "js-cookie";
import axios from "axios";
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import BaseUrl from "../Api/baseurl";
import { db, isFirebaseConfigured } from "./firebaseClient";
import { DEFAULT_HOSPITAL_ID, getActiveHospitalId } from "../utils/hmsAccess";

const DEMO_CHATS_KEY = "carebridge-demo-chats";

const authHeaders = () => {
  const token = Cookies.get("token") || Cookies.get("patient_token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };
};

const isDemoMode = () => {
  const token = Cookies.get("token") || Cookies.get("patient_token");
  return !isFirebaseConfigured || !token || String(token).startsWith("demo-token");
};

const readDemoChats = () => {
  try {
    return JSON.parse(window.localStorage.getItem(DEMO_CHATS_KEY) || "[]");
  } catch (error) {
    return [];
  }
};

const writeDemoChats = (chats) => {
  window.localStorage.setItem(DEMO_CHATS_KEY, JSON.stringify(chats));
};

const currentUserIdentity = () => ({
  uid:
    Cookies.get("uid") ||
    Cookies.get("patient_uid") ||
    Cookies.get("username") ||
    Cookies.get("patient_username") ||
    "demo-user",
  name:
    Cookies.get("username") ||
    Cookies.get("patient_username") ||
    "CareBridge user",
});

const request = async (method, path, data = {}) => {
  const response = await axios({
    method,
    url: `${BaseUrl}${path.replace(/^\//, "")}`,
    data,
    headers: authHeaders(),
  });
  return response.data;
};

export const hmsApi = {
  setupDefaultHospital: () => request("post", "/hms/setup-default-hospital"),
  listHospitals: () => request("get", "/hms/hospitals"),
  discoverHospitals: (params = {}) =>
    request("get", `/hms/discovery/hospitals?${new URLSearchParams(params).toString()}`),
  getHospitalProfile: (hospitalId) => request("get", `/hms/hospitals/${hospitalId}/profile`),
  updateHospitalProfile: (hospitalId, payload) =>
    request("patch", `/hms/hospitals/${hospitalId}/profile`, payload),
  createHospital: (payload) => request("post", "/hms/hospitals", payload),
  assignRole: (uid, payload) => request("post", `/hms/users/${uid}/role`, payload),
  addHospitalMember: (hospitalId, payload) =>
    request("post", `/hms/hospitals/${hospitalId}/members`, payload),
  addHospitalMedia: (hospitalId, payload) =>
    request("post", `/hms/hospitals/${hospitalId}/media`, payload),
  listHospitalTests: (hospitalId) => request("get", `/hms/hospitals/${hospitalId}/tests`),
  createHospitalTest: (hospitalId, payload) =>
    request("post", `/hms/hospitals/${hospitalId}/tests`, payload),
  listTestSlots: (hospitalId, testId = "") =>
    request(
      "get",
      `/hms/hospitals/${hospitalId}/test-slots${
        testId ? `?${new URLSearchParams({ testId }).toString()}` : ""
      }`,
    ),
  createTestSlot: (hospitalId, payload) =>
    request("post", `/hms/hospitals/${hospitalId}/test-slots`, payload),
  listTestBookings: (hospitalId = getActiveHospitalId()) =>
    request("get", `/hms/hospitals/${hospitalId}/test-bookings`),
  bookTestSlot: (hospitalId, payload) =>
    request("post", `/hms/hospitals/${hospitalId}/test-bookings`, payload),
  listInventory: (hospitalId = getActiveHospitalId()) =>
    request("get", `/hms/hospitals/${hospitalId}/inventory`),
  createInventoryItem: (hospitalId = getActiveHospitalId(), payload) =>
    request("post", `/hms/hospitals/${hospitalId}/inventory`, payload),
  adjustStock: (hospitalId = getActiveHospitalId(), medicineId, payload) =>
    request("post", `/hms/hospitals/${hospitalId}/inventory/${medicineId}/adjust-stock`, payload),
  createInvoice: (hospitalId = getActiveHospitalId(), payload) =>
    request("post", `/hms/hospitals/${hospitalId}/invoices`, payload),
  listNotifications: (hospitalId = getActiveHospitalId()) =>
    request("get", `/hms/hospitals/${hospitalId}/notifications`),
  listAuditLogs: (hospitalId = getActiveHospitalId()) =>
    request("get", `/hms/hospitals/${hospitalId}/audit-logs`),
};

export const requestChatWithDoctor = async ({
  hospitalId = DEFAULT_HOSPITAL_ID,
  doctorUid,
  doctorId,
  doctorUsername,
  doctorName,
  message,
}) => {
  const actor = currentUserIdentity();

  if (isDemoMode()) {
    const chats = readDemoChats();
    const chat = {
      id: `demo-chat-${Date.now()}`,
      hospitalId,
      patientUid: actor.uid,
      patientName: actor.name,
      doctorUid: doctorUid || doctorUsername || doctorId,
      doctorId,
      doctorUsername,
      doctorName,
      status: "requested",
      lastMessage: message || "Chat request sent.",
      lastMessageAt: new Date().toISOString(),
      messages: [
        {
          id: `demo-message-${Date.now()}`,
          senderUid: actor.uid,
          text: message || "Hello doctor, I would like to chat about my care.",
          type: "text",
          createdAt: new Date().toISOString(),
        },
      ],
    };
    writeDemoChats([chat, ...chats]);
    return chat;
  }

  return request("post", `/hms/hospitals/${hospitalId}/chats/request`, {
    doctorUid,
    doctorId,
    doctorUsername,
    doctorName,
    patientName: actor.name,
    message,
  });
};

export const listChats = async (hospitalId = getActiveHospitalId()) => {
  const actor = currentUserIdentity();

  if (isDemoMode()) {
    const chats = readDemoChats();
    return chats.filter(
      (chat) =>
        chat.patientUid === actor.uid ||
        chat.doctorUid === actor.uid ||
        chat.doctorUsername === actor.uid ||
        Cookies.get("is_staff") === "true" ||
        Cookies.get("is_vendor") === "true" ||
        Cookies.get("is_superuser") === "true",
    );
  }

  return request("get", `/hms/hospitals/${hospitalId}/chats`);
};

export const acceptChat = async (hospitalId, chatId) => {
  if (isDemoMode()) {
    const chats = readDemoChats();
    const next = chats.map((chat) =>
      chat.id === chatId ? { ...chat, status: "open" } : chat,
    );
    writeDemoChats(next);
    return { success: true, status: "open" };
  }

  return request("post", `/hms/hospitals/${hospitalId}/chats/${chatId}/accept`);
};

export const closeChat = async (hospitalId, chatId) => {
  if (isDemoMode()) {
    const chats = readDemoChats();
    const next = chats.map((chat) =>
      chat.id === chatId ? { ...chat, status: "closed" } : chat,
    );
    writeDemoChats(next);
    return { success: true, status: "closed" };
  }

  return request("post", `/hms/hospitals/${hospitalId}/chats/${chatId}/close`);
};

export const sendChatMessage = async (hospitalId, chatId, text) => {
  const actor = currentUserIdentity();

  if (isDemoMode()) {
    const chats = readDemoChats();
    const message = {
      id: `demo-message-${Date.now()}`,
      senderUid: actor.uid,
      text,
      type: "text",
      createdAt: new Date().toISOString(),
    };
    const next = chats.map((chat) =>
      chat.id === chatId
        ? {
            ...chat,
            lastMessage: text,
            lastMessageAt: new Date().toISOString(),
            messages: [...(chat.messages || []), message],
          }
        : chat,
    );
    writeDemoChats(next);
    return message;
  }

  return request("post", `/hms/hospitals/${hospitalId}/chats/${chatId}/messages`, { text });
};

export const subscribeToChatMessages = (hospitalId, chatId, callback) => {
  if (isDemoMode() || !db) {
    const chat = readDemoChats().find((item) => item.id === chatId);
    callback(chat?.messages || []);
    return () => {};
  }

  const messagesQuery = query(
    collection(db, "hospitals", hospitalId, "chats", chatId, "messages"),
    orderBy("createdAt", "asc"),
    limit(200),
  );

  return onSnapshot(messagesQuery, (snapshot) => {
    callback(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
  });
};

export const addLocalChatMessage = async (hospitalId, chatId, payload) => {
  if (!db) return null;
  return addDoc(collection(db, "hospitals", hospitalId, "chats", chatId, "messages"), {
    ...payload,
    createdAt: serverTimestamp(),
  });
};
