import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {
  FaBell,
  FaCalendarCheck,
  FaChevronDown,
  FaPowerOff,
  FaRegClock,
  FaUserDoctor,
} from "react-icons/fa6";
import BaseUrl from "../../Api/baseurl";

const fallbackAvatar = "/brand/doctor-avatar-teal.png";

const pageTitles = {
  "/doctor": "Doctor Dashboard",
  "/doctor/managepatients": "Patient Registry",
  "/doctor/appointments": "Appointments",
  "/doctor/messages": "Messages",
  "/doctor/manageslots": "Slot Studio",
  "/doctor/manageholidays": "Holiday Planner",
  "/doctor/consultationquery": "Patient Queries",
  "/doctor/myprofile": "Doctor Profile",
  "/doctor/changepassword": "Security",
  "/doctor/notification": "Notifications",
};

const parseRoles = () => {
  const rawRoles = Cookies.get("roles");
  if (!rawRoles) return { ids: [], names: [] };

  let values = [];
  try {
    const parsed = JSON.parse(rawRoles);
    values = Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    values = rawRoles.split(",");
  }

  return values.reduce(
    (result, role) => {
      const value = typeof role === "string" ? role.trim() : role;
      const numberValue = Number(value);

      if (Number.isFinite(numberValue)) {
        result.ids.push(numberValue);
      } else if (value) {
        result.names.push(String(value).toLowerCase());
      }

      return result;
    },
    { ids: [], names: [] },
  );
};

const DoctorSearch = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [data, setData] = useState({
    image: "",
    fname: "",
    lname: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const count = useRef(0);
  const roles = useMemo(parseRoles, []);
  const username = Cookies.get("username") || "doctor";
  const pageTitle =
    pageTitles[pathname.replace(/\/$/, "")] ||
    (pathname.includes("edit") ? "Update Record" : "Clinical Workspace");
  const canUseAccountLinks =
    roles.ids.includes(15) ||
    roles.names.includes("doctor") ||
    roles.names.includes("staff") ||
    roles.names.includes("vendor") ||
    isStaff ||
    isVendor;

  const getNotificationCount = useCallback(async () => {
    try {
      const currentUsername = Cookies.get("username");
      if (!currentUsername) return;
      const response = await axios.get(
        `${BaseUrl}clinic/get-notification/${currentUsername}/`,
      );
      count.current = response.data?.unread_count || 0;
    } catch (error) {
      count.current = 0;
    }
  }, []);

  const fetchData = useCallback(async () => {
    const user = Cookies.get("username");
    if (!user) return;

    try {
      const response = await axios.get(`${BaseUrl}clinic/staff-list/${user}`, {
        headers: {
          Authorization: `Token ${Cookies.get("token")}`,
        },
      });
      setData(response.data || {});
    } catch (error) {
      setData((current) => ({ ...current, fname: username }));
    }
  }, [username]);

  useEffect(() => {
    const superuser = Cookies.get("is_superuser") === "true";
    const staff = Cookies.get("is_staff") === "true";
    const vendor = Cookies.get("is_vendor") === "true";
    setIsStaff(staff);
    setIsVendor(vendor);
    getNotificationCount();
    if (!superuser) {
      fetchData();
    }
  }, [fetchData, getNotificationCount]);

  const handleLogout = () => {
    [
      "token",
      "username",
      "is_superuser",
      "is_vendor",
      "is_staff",
      "status",
      "roles",
      "subroles",
    ].forEach((name) => Cookies.remove(name));

    navigate(isVendor ? "/vendor/login" : "/doctor/login", { replace: true });
  };

  const profileName =
    [data.fname, data.lname].filter(Boolean).join(" ") || username;
  const avatar = data.image || fallbackAvatar;
  const profileBase = isVendor ? "/vendor" : "/doctor";

  return (
    <header className="doctor-topbar mb-6 overflow-hidden rounded-[2rem] border border-[#67E8F9]/55 bg-white/80 px-4 py-4 shadow-xl shadow-teal-950/5 backdrop-blur md:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#0D9488]">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#ECFEFF] text-[#0D9488]">
              <FaUserDoctor />
            </span>
            Live clinical console
          </div>
          <h1 className="mt-2 text-2xl font-black text-[#134E4A] sm:text-3xl">
            {pageTitle}
          </h1>
          <p className="mt-1 text-sm font-semibold text-[#134E4A]/60">
            Keep patient flow, slots, and follow-ups moving from one focused workspace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden rounded-2xl border border-[#67E8F9]/45 bg-[#ECFEFF] px-4 py-3 text-sm font-black text-[#134E4A] sm:flex sm:items-center sm:gap-3">
            <FaRegClock className="text-[#0D9488]" />
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short",
              day: "2-digit",
              month: "short",
            })}
          </div>

          <Link
            to={`${profileBase}/appointments`}
            className="flex h-12 items-center gap-2 rounded-2xl bg-[#0D9488] px-4 text-sm font-black text-white shadow-lg shadow-teal-900/10 transition hover:bg-[#134E4A]"
          >
            <FaCalendarCheck />
            Queue
          </Link>

          <Link
            to={`${profileBase}/notification`}
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#67E8F9]/55 bg-white text-[#134E4A] shadow-lg shadow-teal-950/5 transition hover:bg-[#ECFEFF]"
            aria-label="Notifications"
          >
            <FaBell />
            {count.current > 0 && (
              <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F59E0B] px-1 text-[10px] font-black text-[#134E4A]">
                {count.current}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((value) => !value)}
              className="flex h-12 items-center gap-3 rounded-2xl border border-[#67E8F9]/55 bg-white px-3 text-sm font-black text-[#134E4A] shadow-lg shadow-teal-950/5 transition hover:bg-[#ECFEFF]"
            >
              <img
                src={avatar}
                className="h-8 w-8 rounded-xl object-cover"
                alt={profileName}
              />
              <span className="hidden max-w-36 truncate md:block">
                {profileName}
              </span>
              <FaChevronDown className="text-xs text-[#0D9488]" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-2xl border border-[#67E8F9]/55 bg-white shadow-2xl shadow-teal-950/15">
                {canUseAccountLinks && (
                  <>
                    <Link
                      to={`${profileBase}/myprofile`}
                      className="block px-4 py-3 text-sm font-black text-[#134E4A] transition hover:bg-[#ECFEFF] hover:text-[#0D9488]"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to={`${profileBase}/changepassword`}
                      className="block px-4 py-3 text-sm font-black text-[#134E4A] transition hover:bg-[#ECFEFF] hover:text-[#0D9488]"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Change Password
                    </Link>
                  </>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-black text-[#134E4A] transition hover:bg-[#F59E0B]/15"
                >
                  <FaPowerOff />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-[#67E8F9]/40 bg-[#134E4A] py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-50">
        <div className="care-marquee flex min-w-max gap-8 whitespace-nowrap">
          {[
            "Today's patient queue",
            "Slot health",
            "Follow-up reminders",
            "CareBridge doctor workspace",
            "Secure patient records",
            "Realtime appointment flow",
            "Today's patient queue",
            "Slot health",
            "Follow-up reminders",
            "CareBridge doctor workspace",
            "Secure patient records",
            "Realtime appointment flow",
          ].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
};

export default DoctorSearch;
