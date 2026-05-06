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
  FaShieldHeart,
} from "react-icons/fa6";
import BaseUrl from "../../Api/baseurl";

const fallbackAvatar = "/brand/patient-avatar-teal.png";

const pageTitles = {
  "/vendor": "Vendor Dashboard",
  "/vendor/staff": "Clinic Staff",
  "/vendor/managepatients": "Patient Registry",
  "/vendor/appointments": "Appointment Queue",
  "/vendor/messages": "Messages",
  "/vendor/inventory": "Inventory",
  "/vendor/hospital-profile": "Hospital Profile",
  "/vendor/tests": "Tests & Slots",
  "/vendor/consultationquery": "Consultation Queries",
  "/vendor/managecontent": "Content Studio",
  "/vendor/blogs": "Blog Operations",
  "/vendor/blogcategories": "Blog Categories",
  "/vendor/services": "Service Catalog",
  "/vendor/feedback": "Patient Feedback",
  "/vendor/manageenquiries": "Clinic Enquiries",
  "/vendor/manageslots": "Slot Studio",
  "/vendor/manageholidays": "Holiday Planner",
  "/vendor/managelocation": "Clinic Locations",
  "/vendor/managedepartment": "Departments",
  "/vendor/myprofile": "Vendor Profile",
  "/vendor/changepassword": "Security",
  "/vendor/notification": "Notifications",
  "/vendor/logochange": "Brand Logo",
  "/vendor/faviconchange": "Favicon",
  "/vendor/socialmediaprofiles": "Social Profiles",
  "/vendor/timings": "Clinic Timings",
  "/vendor/slogantext": "Slogan",
  "/vendor/address": "Clinic Address",
  "/vendor/currencysettings": "Currency Settings",
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

const VendorSearch = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [data, setData] = useState({
    image: "",
    fname: "",
    lname: "",
    name: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const count = useRef(0);
  const roles = useMemo(parseRoles, []);
  const username = Cookies.get("username") || "vendor";
  const pageTitle =
    pageTitles[pathname.replace(/\/$/, "")] ||
    (pathname.includes("edit")
      ? "Update Workspace"
      : pathname.includes("add")
      ? "Create Workspace Record"
      : "Vendor Workspace");

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
      const response = await axios.get(`${BaseUrl}clinic/vendor-profile/${user}`, {
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
    getNotificationCount();
    fetchData();
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

    navigate("/vendor/login", { replace: true });
  };

  const profileName =
    [data.fname, data.lname].filter(Boolean).join(" ") ||
    data.name ||
    data.username ||
    username;
  const avatar = data.image || data.logo || data.new_logo || fallbackAvatar;
  const canUseAccountLinks =
    roles.ids.includes(15) ||
    roles.names.includes("vendor") ||
    Cookies.get("is_vendor") === "true";

  return (
    <header className="doctor-topbar mb-6 overflow-hidden rounded-[2rem] border border-[#67E8F9]/55 bg-white/80 px-4 py-4 shadow-xl shadow-teal-950/5 backdrop-blur md:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#0D9488]">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#ECFEFF] text-[#0D9488]">
              <FaShieldHeart />
            </span>
            Live vendor command center
          </div>
          <h1 className="mt-2 text-2xl font-black text-[#134E4A] sm:text-3xl">
            {pageTitle}
          </h1>
          <p className="mt-1 text-sm font-semibold text-[#134E4A]/60">
            Coordinate doctors, patients, schedules, content, and clinic operations from one focused hub.
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
            to="/vendor/appointments"
            className="flex h-12 items-center gap-2 rounded-2xl bg-[#0D9488] px-4 text-sm font-black text-white shadow-lg shadow-teal-900/10 transition hover:bg-[#134E4A]"
          >
            <FaCalendarCheck />
            Queue
          </Link>

          <Link
            to="/vendor/notification"
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
                      to="/vendor/myprofile"
                      className="block px-4 py-3 text-sm font-black text-[#134E4A] transition hover:bg-[#ECFEFF] hover:text-[#0D9488]"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/vendor/changepassword"
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
            "Clinic operations",
            "Staff coordination",
            "Appointment flow",
            "Content updates",
            "Feedback watch",
            "Service catalog",
            "Secure vendor workspace",
            "Clinic operations",
            "Staff coordination",
            "Appointment flow",
            "Content updates",
            "Feedback watch",
            "Service catalog",
            "Secure vendor workspace",
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

export default VendorSearch;
