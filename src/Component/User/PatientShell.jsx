import Cookies from "js-cookie";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
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
    <div className="patient-portal-shell bg-[#ECFEFF] text-[#134E4A]">
      <section className="border-b border-[#67E8F9]/45 bg-white/85 px-4 py-4 shadow-lg shadow-teal-900/5 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0D9488] text-xl text-white">
              <FaShieldHeart />
            </span>
            <span>
              <span className="block text-lg font-black">Patient Portal</span>
              <span className="block text-xs font-black uppercase tracking-[0.16em] text-[#0D9488]">
                {username}
              </span>
            </span>
          </Link>

          <nav className="flex gap-2 overflow-x-auto pb-1 xl:pb-0">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-black transition ${
                    isActive
                      ? "bg-[#0D9488] text-white shadow-lg shadow-teal-900/10"
                      : "bg-[#ECFEFF] text-[#134E4A] hover:bg-[#67E8F9]/40"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#F59E0B] px-5 text-sm font-black text-[#134E4A]"
          >
            <FaRightFromBracket />
            Logout
          </button>
        </div>
      </section>
      {children}
    </div>
  );
};

export default PatientShell;
