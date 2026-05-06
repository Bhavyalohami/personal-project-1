import Cookies from "js-cookie";

const normalizeToken = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const hasValue = (value) => value !== undefined && value !== null && value !== "";

const getDoctorCandidates = (item) => [
  item?.doctor_username,
  item?.staff_username,
  item?.provider_username,
  item?.doctor_user,
  item?.staff_user,
  item?.doctor,
  item?.staff,
  item?.provider,
  item?.username,
  item?.doctor_name,
  item?.staff_name,
  item?.provider_name,
  item?.doctor?.username,
  item?.doctor?.user?.username,
  item?.doctor?.name,
  item?.doctor?.fname && item?.doctor?.lname
    ? `${item.doctor.fname} ${item.doctor.lname}`
    : "",
  item?.staff?.username,
  item?.staff?.user?.username,
  item?.staff?.name,
  item?.doctor_details?.username,
  item?.doctor_details?.name,
  item?.staff_details?.username,
  item?.staff_details?.name,
];

export const isDoctorPanelFromCookies = () =>
  Cookies.get("is_staff") === "true" &&
  Cookies.get("is_vendor") !== "true" &&
  Cookies.get("is_superuser") !== "true";

export const appointmentBelongsToDoctor = (item, username) => {
  const normalizedUsername = normalizeToken(username);
  if (!item || !normalizedUsername) return false;

  return getDoctorCandidates(item)
    .filter(hasValue)
    .some((candidate) => {
      const normalizedCandidate = normalizeToken(candidate);
      if (!normalizedCandidate) return false;

      return (
        normalizedCandidate === normalizedUsername ||
        (normalizedCandidate.length > 3 &&
          normalizedUsername.includes(normalizedCandidate)) ||
        (normalizedUsername.length > 3 &&
          normalizedCandidate.includes(normalizedUsername))
      );
    });
};

export const filterDoctorItems = (items, username, shouldScope) => {
  const list = Array.isArray(items) ? items : [];
  if (!shouldScope) return list;
  if (!username) return [];

  return list.filter((item) => appointmentBelongsToDoctor(item, username));
};

export const doctorListForCurrentUser = (doctorList, username) => {
  const list = Array.isArray(doctorList) ? doctorList : [];
  const currentDoctor = list.find((doctor) => doctor?.username === username);

  return currentDoctor
    ? [currentDoctor]
    : [{ username, fname: "Current", lname: "Doctor" }];
};

export const getDoctorDisplayName = (doctorList, username) => {
  const doctor = (Array.isArray(doctorList) ? doctorList : []).find(
    (item) => item?.username === username
  );
  const fullName = [doctor?.fname, doctor?.lname].filter(Boolean).join(" ");

  return fullName || username || "Current doctor";
};
