import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import {
  FaBars,
  FaBell,
  FaBoxesStacked,
  FaChevronDown,
  FaCommentDots,
  FaHospitalUser,
  FaHospital,
  FaLocationDot,
  FaLock,
  FaPowerOff,
  FaRegNewspaper,
  FaShieldHeart,
  FaUserDoctor,
  FaUsers,
  FaVialCircleCheck,
  FaXmark,
} from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { BiSolidBookContent, BiSolidDashboard } from "react-icons/bi";
import { BsPostcardFill } from "react-icons/bs";
import { GrServices } from "react-icons/gr";
import { MdMeetingRoom, MdOutlineSettingsSuggest } from "react-icons/md";
import { AiFillInteraction } from "react-icons/ai";
import BaseUrl from "../../Api/baseurl";

const defaultLogo = "/brand/carebridge-logo-future-light.png";

const normalizeLogo = (src) => {
  if (!src || src.includes(".svg") || src.includes("logo-compact")) {
    return defaultLogo;
  }
  return src;
};

const doctorDefaultRoles = [4, 5, 13, 14, 15, 16, 17, 19];
const vendorDefaultRoles = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

const normalizeRoleValues = (values) => {
  const roleIds = [];
  const roleNames = [];

  values.forEach((role) => {
    const value = typeof role === "string" ? role.trim() : role;
    const numberValue = Number(value);

    if (Number.isFinite(numberValue)) {
      roleIds.push(numberValue);
    } else if (value) {
      roleNames.push(String(value).toLowerCase());
    }
  });

  return { roleIds, roleNames };
};

const parseRoles = () => {
  const rawRoles = Cookies.get("roles");
  if (!rawRoles) return { roleIds: [], roleNames: [] };

  try {
    const parsed = JSON.parse(rawRoles);
    if (Array.isArray(parsed)) {
      return normalizeRoleValues(parsed);
    }
  } catch (error) {
    // Some logins store roles as a comma separated cookie instead of JSON.
  }

  return normalizeRoleValues(rawRoles.split(","));
};

const AdminHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [logo, setLogo] = useState(defaultLogo);
  const [showMenu, setShowMenu] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  const isSuperuser = Cookies.get("is_superuser") === "true";
  const isVendor = Cookies.get("is_vendor") === "true";
  const isDoctor = !isSuperuser && !isVendor;
  const isCarePanel = isDoctor || isVendor;
  const { roleIds } = useMemo(parseRoles, []);

  const basePath = isSuperuser ? "admin" : isVendor ? "vendor" : "doctor";
  const loginPath = isSuperuser
    ? "/admin/login"
    : isVendor
    ? "/vendor/login"
    : "/doctor/login";
  const fallbackRoles = isDoctor
    ? doctorDefaultRoles
    : isVendor
    ? vendorDefaultRoles
    : [];
  const allowedRoles = roleIds.length > 0 ? roleIds : fallbackRoles;
  const can = (role) => isSuperuser || allowedRoles.includes(role);
  const route = (slug = "") => `/${basePath}${slug}`;
  const isActive = (slug = "") => {
    const target = route(slug);
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(`${BaseUrl}clinic/logochange/`, {
          headers: { "Content-Type": "application/json" },
        });
        setLogo(normalizeLogo(response.data?.new_logo));
      } catch (error) {
        setLogo(defaultLogo);
      }
    };

    fetchLogo();
  }, []);

  useEffect(() => {
    if (pathname.includes("logochange") || pathname.includes("faviconchange")) {
      setConfigOpen(true);
    }
  }, [pathname]);

  const handleLogout = () => {
    [
      "is_superuser",
      "is_vendor",
      "is_staff",
      "token",
      "status",
      "username",
      "roles",
      "subroles",
    ].forEach((name) => Cookies.remove(name));

    navigate(loginPath, { replace: true });
  };

  const primaryLinks = [
    {
      label: "Dashboard",
      href: route(),
      icon: BiSolidDashboard,
      show: true,
      active: pathname === route() || pathname === `${route()}/`,
    },
    {
      label: "Manage Vendors",
      href: route("/vendor"),
      icon: FaShieldHeart,
      show: isSuperuser,
      active: isActive("/vendor"),
    },
    {
      label: "Hospital Profile",
      href: route("/hospital-profile"),
      icon: FaHospital,
      show: isSuperuser || isVendor,
      active: isActive("/hospital-profile"),
    },
    {
      label: "Manage Staff",
      href: route("/staff"),
      icon: FaUsers,
      show: can(3),
      active: isActive("/staff"),
    },
    {
      label: "Manage Patients",
      href: route("/managepatients"),
      icon: FaHospitalUser,
      show: can(19),
      active: isActive("/managepatients"),
    },
    {
      label: "Appointments",
      href: route("/appointments"),
      icon: MdMeetingRoom,
      show: can(4),
      active: isActive("/appointments"),
    },
    {
      label: "Inventory",
      href: route("/inventory"),
      icon: FaBoxesStacked,
      show: isSuperuser || isVendor,
      active: isActive("/inventory"),
    },
    {
      label: "Tests & Slots",
      href: route("/tests"),
      icon: FaVialCircleCheck,
      show: isSuperuser || isVendor,
      active: isActive("/tests"),
    },
    {
      label: "Manage Slots",
      href: route("/manageslots"),
      icon: FaCalendarAlt,
      show: can(13),
      active: isActive("/manageslots"),
    },
    {
      label: "Manage Holidays",
      href: route("/manageholidays"),
      icon: FaCalendarAlt,
      show: can(14),
      active: isActive("/manageholidays"),
    },
    {
      label: isDoctor ? "Queries" : "Consultation Queries",
      href: route("/consultationquery"),
      icon: AiFillInteraction,
      show: isSuperuser && can(5),
      active: isActive("/consultationquery"),
    },
    {
      label: "Messages",
      href: route("/messages"),
      icon: FaCommentDots,
      show: isDoctor || isVendor || isSuperuser,
      active: isActive("/messages"),
    },
  ];

  const contentLinks = [
    {
      label: "Manage Content",
      href: route("/managecontent"),
      icon: BiSolidBookContent,
      show: isSuperuser && can(6),
      active: isActive("/managecontent"),
    },
    {
      label: "Manage Blogs",
      href: route("/blogs"),
      icon: FaRegNewspaper,
      show: isSuperuser && can(7),
      active: isActive("/blogs"),
    },
    {
      label: "Blog Categories",
      href: route("/blogcategories"),
      icon: BsPostcardFill,
      show: isSuperuser && can(18),
      active: isActive("/blogcategories"),
    },
    {
      label: "Manage Services",
      href: route("/services"),
      icon: GrServices,
      show: isSuperuser && can(8),
      active: isActive("/services"),
    },
    {
      label: "Departments",
      href: route("/managedepartment"),
      icon: BsPostcardFill,
      show: isSuperuser && can(11),
      active: isActive("/managedepartment"),
    },
    {
      label: "Locations",
      href: route("/managelocation"),
      icon: FaLocationDot,
      show: isSuperuser && can(10),
      active: isActive("/managelocation"),
    },
    {
      label: "Enquiries",
      href: route("/manageenquiries"),
      icon: AiFillInteraction,
      show: isSuperuser && can(9),
      active: isActive("/manageenquiries"),
    },
    {
      label: "Feedback",
      href: route("/feedback"),
      icon: FaCommentDots,
      show: isSuperuser && can(12),
      active: isActive("/feedback"),
    },
  ];

  const configLinks = [
    ["Logo", "/logochange"],
    ["Favicon", "/faviconchange"],
    ["Social Profiles", "/socialmediaprofiles"],
    ["Timings", "/timings"],
    ["Slogan", "/slogantext"],
    ["Address", "/address"],
    ["Currency", "/currencysettings"],
    ...(isSuperuser ? [["Notifications", "/setupnotification"]] : []),
  ].map(([label, slug]) => ({
    label,
    href: route(slug),
    active: isActive(slug),
  }));

  const profileLinks = [
    {
      label: "My Profile",
      href: route("/myprofile"),
      icon: FaUserDoctor,
      show: can(15),
      active: isActive("/myprofile"),
    },
    {
      label: "Change Password",
      href: route("/changepassword"),
      icon: FaLock,
      show: can(16),
      active: isActive("/changepassword"),
    },
    {
      label: "Notifications",
      href: route("/notification"),
      icon: FaBell,
      show: can(17),
      active: isActive("/notification"),
    },
  ];
  const visibleContentLinks = contentLinks.filter((link) => link.show);

  const renderLink = ({ label, href, icon: Icon, show, active }) => {
    if (!show) return null;

    return (
      <Link
        key={href}
        to={href}
        data-active={active ? "true" : "false"}
        onClick={() => setShowMenu(false)}
        className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-black transition ${
          isCarePanel
            ? active
              ? "bg-white text-[#134E4A] shadow-lg shadow-cyan-950/15 ring-1 ring-[#67E8F9]/35"
              : "text-cyan-50/78 hover:bg-white/10 hover:text-white"
            : active
            ? "bg-white text-[#134E4A] shadow-lg shadow-cyan-950/10"
            : "text-cyan-50/75 hover:bg-white/10 hover:text-white"
        }`}
        >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
          isCarePanel
            ? active
              ? "bg-[#0D9488] text-white shadow-md shadow-teal-950/15"
                : "bg-white/10 text-[#67E8F9] group-hover:bg-white/15"
              : active
              ? "bg-[#ECFEFF] text-[#0D9488]"
              : "bg-white/10 text-[#67E8F9] group-hover:bg-white/15"
          }`}
        >
          <Icon />
        </span>
        <span className="min-w-0 truncate">{label}</span>
      </Link>
    );
  };

  const navContent = (
    <>
      {/* <div
        className={`rounded-2xl border p-3.5 ${
          isDoctor
            ? "border-white/12 bg-white/[0.08] shadow-inner shadow-white/5"
            : "border-white/10 bg-white/10"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#67E8F9]/15 text-xl text-[#67E8F9] ring-1 ring-[#67E8F9]/25">
            <FaUserDoctor />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#67E8F9]">
              {portalLabel}
            </p>
            <p className="mt-1 truncate text-base font-black text-white">
              {username}
            </p>
            <div className="mt-1 flex items-center gap-2 text-[11px] font-bold text-cyan-50/70">
              <span className="h-2 w-2 rounded-full bg-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.75)]" />
              {roleLabel}
            </div>
          </div>
        </div>
      </div> */}

      {/* {isVendor && (
        <div className="mt-4 rounded-2xl border border-white/12 bg-white/[0.08] p-3.5 shadow-inner shadow-white/5">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#67E8F9]/15 text-xl text-[#67E8F9] ring-1 ring-[#67E8F9]/25">
              <FaShieldHeart />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#67E8F9]">
                {portalLabel}
              </p>
              <p className="mt-1 truncate text-base font-black text-white">
                {username}
              </p>
              <div className="mt-1 flex items-center gap-2 text-[11px] font-bold text-cyan-50/70">
                <span className="h-2 w-2 rounded-full bg-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.75)]" />
                {roleLabel}
              </div>
            </div>
          </div>
        </div>
      )} */}

      <nav className="mt-4 flex flex-col gap-5">
        <div className="space-y-1.5">{primaryLinks.map(renderLink)}</div>

        {isSuperuser && can(1) && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setConfigOpen((value) => !value)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-black transition ${
                isDoctor
                  ? "text-[#134E4A]/70 hover:bg-[#ECFEFF] hover:text-[#0D9488]"
                  : "text-cyan-50/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    isDoctor
                      ? "bg-[#ECFEFF] text-[#0D9488]"
                      : "bg-white/10 text-[#67E8F9]"
                  }`}
                >
                  <MdOutlineSettingsSuggest />
                </span>
                Configurations
              </span>
              <FaChevronDown
                className={`text-xs transition ${configOpen ? "rotate-180" : ""}`}
              />
            </button>
            {configOpen && (
              <div
                className={`ml-6 space-y-1 border-l pl-3 ${
                  isDoctor ? "border-[#67E8F9]/45" : "border-white/10"
                }`}
              >
                {configLinks.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setShowMenu(false)}
                    className={`block rounded-xl px-3 py-2 text-xs font-black transition ${
                      isDoctor
                        ? item.active
                          ? "bg-[#0D9488] text-white"
                          : "text-[#134E4A]/60 hover:bg-[#ECFEFF] hover:text-[#0D9488]"
                        : item.active
                        ? "bg-white text-[#134E4A]"
                        : "text-cyan-50/65 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {visibleContentLinks.length > 0 && (
          <div>
            <p
              className={`px-4 text-xs font-black uppercase tracking-[0.18em] ${
                isDoctor ? "text-cyan-50/45" : "text-cyan-50/45"
              }`}
            >
              Content
            </p>
            <div className="mt-2 space-y-1.5">{visibleContentLinks.map(renderLink)}</div>
          </div>
        )}

        <div>
          <p
            className={`px-4 text-xs font-black uppercase tracking-[0.18em] ${
              isDoctor ? "text-cyan-50/45" : "text-cyan-50/45"
            }`}
          >
            Account
          </p>
          <div className="mt-2 space-y-1.5">{profileLinks.map(renderLink)}</div>
        </div>
      </nav>
    </>
  );

  return (
    <aside
      className="doctor-sidebar relative z-40 w-full md:sticky md:top-0 md:h-screen md:w-[17.5rem] md:shrink-0"
    >
      <div
        className={`border-b border-[#67E8F9]/30 px-4 py-3 md:hidden ${
          isDoctor ? "bg-[#134E4A]" : "bg-[#134E4A]"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link to={route()} className="flex items-center">
            <img src={logo} alt="CareBridge" className="h-11 w-auto object-contain" />
          </Link>
          <button
            type="button"
            onClick={() => setShowMenu((value) => !value)}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
              isCarePanel
                ? "border-white/15 bg-white/10 text-white"
                : "border-white/15 bg-white/10 text-white"
            }`}
            aria-label="Toggle panel navigation"
          >
            {showMenu ? <FaXmark /> : <FaBars />}
          </button>
        </div>
      </div>

      <div
        className={`${
          showMenu ? "block" : "hidden"
        } h-full overflow-y-auto p-4 shadow-2xl shadow-teal-950/20 md:block  md:min-h-0 md:p-4 ${
          isDoctor
            ? "border-r border-[#67E8F9]/25 bg-[#134E4A]"
            : isVendor
            ? "border-r border-[#67E8F9]/25 bg-[#134E4A]"
            : "bg-[#134E4A]"
        }`}
      >
        <div className="hidden md:block">
          <Link
            to={route()}
            className="flex min-w-0 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.92] px-4 py-3 shadow-xl shadow-cyan-950/10"
          >
            <img src={logo} alt="CareBridge" className="h-12 max-w-full object-contain" />
          </Link>
        </div>

        {navContent}

        <button
          type="button"
          onClick={handleLogout}
          className={`mt-6 flex w-full items-center justify-center gap-3 rounded-2xl px-4 py-3 text-sm font-black shadow-xl transition ${
            isDoctor
              ? "bg-[#F59E0B] text-[#134E4A] shadow-amber-950/10 hover:bg-[#67E8F9]"
              : "bg-[#F59E0B] text-[#134E4A] shadow-amber-950/10 hover:bg-[#67E8F9]"
          }`}
        >
          <FaPowerOff />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default AdminHeader;
