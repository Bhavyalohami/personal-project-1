import Cookies from "js-cookie";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaChevronRight,
  FaComments,
  FaFileMedical,
  FaHospital,
  FaKey,
  FaRightFromBracket,
  FaShieldHeart,
  FaUser,
} from "react-icons/fa6";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: <FaShieldHeart /> },
  { label: "Profile", href: "/userprofile", icon: <FaUser /> },
  { label: "Appointments", href: "/userappointments", icon: <FaCalendarCheck /> },
  { label: "Documents", href: "/userdocuments", icon: <FaFileMedical /> },
  { label: "Messages", href: "/messages", icon: <FaComments /> },
  { label: "Hospitals", href: "/hospitals", icon: <FaHospital /> },
  { label: "Password", href: "/passwordchange", icon: <FaKey /> },
];

const PatientShell = ({ children }) => {
  const navigate = useNavigate();
  const username = Cookies.get("patient_username") || "patient";

  const handleLogout = () => {
    ["patient_token", "patient_username", "patient_uid"].forEach((name) =>
      Cookies.remove(name),
    );
    navigate("/user/login", { replace: true });
  };

  return (
    <div className="patient-portal-shell min-h-screen bg-[#ECFEFF] text-[#134E4A] lg:flex">
      <aside className="hidden w-[300px] shrink-0 border-r border-[#67E8F9]/45 bg-[#134E4A] text-white shadow-2xl shadow-teal-950/20 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="p-5">
          <Link
            to="/dashboard"
            className="group flex items-center gap-4 rounded-[1.6rem] border border-white/15 bg-white/10 p-4 shadow-lg shadow-teal-950/10 transition hover:bg-white/15"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0D9488] text-2xl text-white shadow-lg shadow-teal-950/20">
              <FaShieldHeart />
            </span>
            <span className="min-w-0">
              <span className="block text-2xl font-black leading-tight">Patient</span>
              <span className="block text-2xl font-black leading-tight">Portal</span>
              <span className="mt-1 block truncate text-xs font-black uppercase tracking-[0.18em] text-[#67E8F9]">
                {username}
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-5 pb-5">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `group flex min-h-14 items-center gap-3 rounded-2xl px-4 text-sm font-black transition ${
                  isActive
                    ? "bg-white text-[#134E4A] shadow-xl shadow-teal-950/15"
                    : "text-cyan-50/85 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg transition ${
                      isActive
                        ? "bg-[#ECFEFF] text-[#0D9488]"
                        : "bg-white/10 text-[#67E8F9] group-hover:bg-white/15"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="min-w-0 flex-1">{item.label}</span>
                  <FaChevronRight
                    className={`text-xs transition ${
                      isActive ? "text-[#0D9488]" : "text-cyan-50/35 group-hover:text-white"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-5">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#F59E0B] px-5 text-sm font-black text-[#134E4A] shadow-lg shadow-amber-950/20 transition hover:bg-[#fbb12b]"
          >
            <FaRightFromBracket />
            Logout
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="border-b border-[#67E8F9]/45 bg-white/90 px-4 py-4 shadow-lg shadow-teal-900/5 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link to="/dashboard" className="flex min-w-0 items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0D9488] text-xl text-white">
                <FaShieldHeart />
              </span>
              <span className="min-w-0">
                <span className="block text-lg font-black leading-tight">Patient Portal</span>
                <span className="block truncate text-xs font-black uppercase tracking-[0.16em] text-[#0D9488]">
                  {username}
                </span>
              </span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F59E0B] text-[#134E4A]"
              aria-label="Logout"
            >
              <FaRightFromBracket />
            </button>
          </div>

          <nav className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-3 text-xs font-black transition ${
                    isActive
                      ? "bg-[#0D9488] text-white"
                      : "bg-[#ECFEFF] text-[#134E4A] hover:bg-[#67E8F9]/40"
                  }`
                }
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </header>

        {children}
      </div>
    </div>
  );
};

export default PatientShell;
