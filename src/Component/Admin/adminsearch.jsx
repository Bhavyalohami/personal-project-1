import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
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
  "/admin": "Admin Dashboard",
  "/admin/vendor": "Hospital Vendors",
  "/admin/staff": "Clinic Staff",
  "/admin/managepatients": "Patient Registry",
  "/admin/appointments": "Appointment Queue",
  "/admin/consultationquery": "Consultation Queries",
  "/admin/managecontent": "Content Studio",
  "/admin/blogs": "Blog Operations",
  "/admin/blogcategories": "Blog Categories",
  "/admin/services": "Service Catalog",
  "/admin/feedback": "Patient Feedback",
  "/admin/messages": "Messages",
  "/admin/inventory": "Inventory",
  "/admin/hospital-profile": "Hospital Profile",
  "/admin/tests": "Tests & Slots",
  "/admin/manageenquiries": "Clinic Enquiries",
  "/admin/manageslots": "Slot Studio",
  "/admin/managelocation": "Locations",
  "/admin/managedepartment": "Departments",
  "/admin/manageholidays": "Holiday Planner",
  "/admin/myprofile": "Admin Profile",
  "/admin/changepassword": "Security",
  "/admin/notification": "Notifications",
  "/admin/logochange": "Brand Logo",
  "/admin/faviconchange": "Favicon",
  "/admin/socialmediaprofiles": "Social Profiles",
  "/admin/timings": "Clinic Timings",
  "/admin/slogantext": "Slogan",
  "/admin/address": "Clinic Address",
  "/admin/currencysettings": "Currency Settings",
};

const AdminSearch = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [data, setData] = useState({
    image: "",
    fname: "",
    lname: "",
    username: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const count = useRef(0);
  const username = Cookies.get("username") || "admin";
  const normalizedPath = pathname.replace(/\/$/, "") || "/admin";
  const pageTitle =
    pageTitles[normalizedPath] ||
    (pathname.includes("edit")
      ? "Update Admin Record"
      : pathname.includes("add")
      ? "Create Admin Record"
      : "Admin Command Center");

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
    try {
      const response = await axios.get(`${BaseUrl}clinic/admin/`, {
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
      "username",
      "token",
      "is_superuser",
      "is_staff",
      "is_vendor",
      "status",
      "roles",
      "subroles",
      "uid",
    ].forEach((name) => Cookies.remove(name));

    navigate("/admin/login", { replace: true });
  };

  const profileName =
    [data.fname, data.lname].filter(Boolean).join(" ") ||
    data.username ||
    username;
  const avatar = data.image || fallbackAvatar;

  return (
    <header className="doctor-topbar mb-6 overflow-hidden rounded-[2rem] border border-[#67E8F9]/55 bg-white/80 px-4 py-4 shadow-xl shadow-teal-950/5 backdrop-blur md:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#0D9488]">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#ECFEFF] text-[#0D9488]">
              <FaShieldHeart />
            </span>
            Firebase-ready command center
          </div>
          <h1 className="mt-2 text-2xl font-black text-[#134E4A] sm:text-3xl">
            {pageTitle}
          </h1>
          <p className="mt-1 text-sm font-semibold text-[#134E4A]/60">
            Manage hospitals, staff, content, bookings, and operational data from one unified panel.
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
            to="/admin/appointments"
            className="flex h-12 items-center gap-2 rounded-2xl bg-[#0D9488] px-4 text-sm font-black text-white shadow-lg shadow-teal-900/10 transition hover:bg-[#134E4A]"
          >
            <FaCalendarCheck />
            Queue
          </Link>

          <Link
            to="/admin/notification"
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
              className="flex h-12 min-w-0 items-center gap-3 rounded-2xl border border-[#67E8F9]/55 bg-white px-3 text-sm font-black text-[#134E4A] shadow-lg shadow-teal-950/5 transition hover:bg-[#ECFEFF]"
            >
              <img
                src={avatar}
                className="h-8 w-8 shrink-0 rounded-xl object-cover"
                alt={profileName}
              />
              <span className="hidden max-w-36 truncate md:block">
                {profileName}
              </span>
              <FaChevronDown className="shrink-0 text-xs text-[#0D9488]" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-2xl border border-[#67E8F9]/55 bg-white shadow-2xl shadow-teal-950/15">
                <Link
                  to="/admin/myprofile"
                  className="block px-4 py-3 text-sm font-black text-[#134E4A] transition hover:bg-[#ECFEFF] hover:text-[#0D9488]"
                  onClick={() => setDropdownOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/admin/changepassword"
                  className="block px-4 py-3 text-sm font-black text-[#134E4A] transition hover:bg-[#ECFEFF] hover:text-[#0D9488]"
                  onClick={() => setDropdownOpen(false)}
                >
                  Change Password
                </Link>
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
            "Multi-hospital visibility",
            "Role-based access",
            "Live appointment flow",
            "Firebase-ready data",
            "Inventory alerts",
            "Content governance",
            "Multi-hospital visibility",
            "Role-based access",
            "Live appointment flow",
            "Firebase-ready data",
            "Inventory alerts",
            "Content governance",
          ].map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
};

export default AdminSearch;
