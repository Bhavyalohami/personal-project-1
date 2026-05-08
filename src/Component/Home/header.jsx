import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppointmentModal from "./appointmentmodal";
import axios from "axios";
import BaseUrl from "../../Api/baseurl";
import Cookies from "js-cookie";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import {
  FaBars,
  FaCalendarCheck,
  FaChevronDown,
  FaLocationDot,
  FaXmark,
} from "react-icons/fa6";
import Swal from "sweetalert2";

const navItems = [
  { label: "Home", href: "/", matches: ["/"] },
  { label: "About", href: "/about", matches: ["/about"] },
  { label: "Hospitals", href: "/hospitals", matches: ["/hospitals"] },
  { label: "Services", href: "/services", matches: ["/services"] },
  { label: "Blog", href: "/blog", matches: ["/blog", "/blogpage"] },
  { label: "Doctors", href: "/ourdoctors", matches: ["/ourdoctors", "/profiledoctor"] },
  { label: "Contact", href: "/contact", matches: ["/contact", "/contactus"] },
];

const defaultLogo = "/brand/carebridge-logo-future.png";

const normalizeLogo = (src) => {
  if (!src || src.includes(".svg") || src.includes("logo-compact")) {
    return defaultLogo;
  }
  return src;
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [data, setData] = useState({ new_logo: "" });
  const [isLogin, setIsLogin] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [details, setDetails] = useState({ image: "", name: "" });
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const activePath = location.pathname || "/";
  const patientUsername = Cookies.get("patient_username");
  const logoSrc = normalizeLogo(data.new_logo);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/logochange/`, {
        headers: { "Content-Type": "application/json" },
      });
      setData(response.data || {});
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchDetail = async () => {
    const username = Cookies.get("patient_username");
    if (!username) return;

    try {
      const response = await axios.get(
        `${BaseUrl}clinic/patient-profile/${username}/`
      );
      setDetails(response.data || {});
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogout = () => {
    [
      "patient_token",
      "patient_username",
      "patient_status",
      "token",
      "username",
      "is_staff",
      "is_vendor",
      "is_superuser",
      "staff",
      "superuser",
      "status",
      "roles",
      "subroles",
    ].forEach((name) => Cookies.remove(name));
    setIsLogin(null);
    setDropdownOpen(false);
    navigate("/user/login", { replace: true });
  };

  useEffect(() => {
    const token = Cookies.get("patient_token");
    if (patientUsername) {
      setIsLogin(token);
      fetchDetail();
    }
  }, [patientUsername]);

  useEffect(() => {
    fetchData();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBookAppointment = () => {
    const token = Cookies.get("patient_token");
    if (!token) {
      Swal.fire({
        title: "You are not logged in!",
        text: "Would you like to continue as a guest or login?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Continue as Guest",
        cancelButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          setModalOpen(true);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          navigate("/user/login");
          setModalOpen(false);
        }
      });
    } else {
      setModalOpen(true);
    }
  };

  const handleSearch = async (event) => {
    const nextQuery = event.target.value;
    setQuery(nextQuery);

    if (nextQuery.length > 1) {
      try {
        const response = await axios.get(
          `${BaseUrl}clinic/home-search-staff/?q=${nextQuery}`
        );
        setSuggestions(response.data || []);
      } catch (error) {
        console.error("Error:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const closeSearch = () => {
    setShowSearch(false);
    setQuery("");
    setSuggestions([]);
  };

  const displayName =
    details.name && details.name !== "N/A"
      ? details.name.split(" ")[0]
      : "Patient";
  const isActiveNavItem = (item) =>
    item.matches.some((path) =>
      path === "/" ? activePath === "/" : activePath === path || activePath.startsWith(`${path}/`)
    );

  return (
    <header className="sticky top-0 z-50 border-b border-[#67E8F9]/40 bg-[#ECFEFF]/80 shadow-sm backdrop-blur-2xl">
      <div className="hidden overflow-hidden border-b border-[#67E8F9]/30 bg-[#134E4A] text-white lg:block">
        <div className="care-marquee flex w-max gap-8 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-50/85">
          {[...Array(2)].map((_, group) => (
            <div key={group} className="flex gap-8">
              {[
                "Live appointment slots",
                "Verified doctors",
                "Firebase-ready platform",
                "Clinic + wellness tech",
                "Guest booking supported",
              ].map((item) => (
                <span key={`${group}-${item}`} className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link to="/" className="flex min-w-0 items-center">
          <img
            src={logoSrc}
            alt="CareBridge Clinic Appointments"
            className="h-12 w-auto object-contain sm:h-14"
          />
        </Link>

        <nav className="hidden items-center rounded-full border border-[#67E8F9]/50 bg-white/75 p-1 shadow-sm lg:flex">
          {navItems.map((item) => {
            const isActive = isActiveNavItem(item);
            return (
              <Link
                key={item.href}
                to={item.href}
                aria-current={isActive ? "page" : undefined}
                data-active={isActive ? "true" : "false"}
                className={`rounded-full px-3 py-2 text-sm font-black transition xl:px-4 ${
                  isActive
                    ? "active bg-[#0D9488] text-white shadow-sm shadow-teal-900/10"
                    : "text-[#134E4A] hover:bg-[#ECFEFF] hover:text-[#0D9488]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSearch((value) => !value)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#67E8F9]/60 bg-white text-[#134E4A] shadow-sm transition hover:border-[#0D9488] hover:text-[#0D9488]"
              aria-label="Search doctors"
            >
              {showSearch ? <FaXmark /> : <FaSearch />}
            </button>
            {showSearch && (
              <div className="absolute right-0 top-14 w-[24rem] overflow-hidden rounded-2xl border border-[#67E8F9]/50 bg-white p-3 shadow-2xl shadow-teal-900/10">
                <div className="flex items-center gap-2 rounded-xl bg-[#ECFEFF] px-3 py-2">
                  <FaSearch className="text-[#0D9488]" />
                  <input
                    type="text"
                    placeholder="Search doctors, departments, locations"
                    value={query}
                    onChange={handleSearch}
                    className="w-full bg-transparent text-sm font-semibold text-[#134E4A] outline-none placeholder:text-[#134E4A]/45"
                    autoFocus
                  />
                </div>
                {query && (
                  <div className="mt-3 max-h-72 overflow-y-auto">
                    {suggestions.length > 0 ? (
                      suggestions.map((staff) => (
                        <Link
                          key={staff.id}
                          to={`/profiledoctor/${staff.id}`}
                          onClick={closeSearch}
                          className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-[#ECFEFF]"
                        >
                          <img
                            src={
                              staff.image?.startsWith("/brand/")
                                ? staff.image
                                : `${BaseUrl}${staff.image}`
                            }
                            alt={`${staff.fname} ${staff.lname}`}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                          <div>
                            <p className="font-black text-[#134E4A]">
                              Dr. {staff.fname} {staff.lname}
                            </p>
                            <p className="flex items-center gap-1 text-xs font-semibold text-[#134E4A]/60">
                              <FaLocationDot />
                              {staff.department || staff.location}
                            </p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="py-4 text-center text-sm font-semibold text-[#134E4A]/60">
                        No doctors found
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full bg-[#0D9488] px-5 text-sm font-black text-white shadow-lg shadow-teal-900/10 transition hover:bg-[#0F766E]"
            onClick={handleBookAppointment}
          >
            <span className="absolute inset-x-2 top-1 h-px origin-left rounded-full bg-[#67E8F9] care-pulse-line" />
            <FaCalendarCheck />
            Book
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((value) => !value)}
              className="flex h-11 items-center gap-2 rounded-full border border-[#67E8F9]/60 bg-white px-2 text-[#134E4A] shadow-sm transition hover:border-[#0D9488]"
            >
              {isLogin && details.image ? (
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={details.image}
                  alt={displayName}
                />
              ) : (
                <FaUserCircle className="text-2xl text-[#0D9488]" />
              )}
              <span className="max-w-24 truncate text-sm font-black">
                {isLogin ? displayName : "Login"}
              </span>
              <FaChevronDown className="text-xs" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-14 w-60 overflow-hidden rounded-2xl border border-[#67E8F9]/50 bg-white shadow-2xl shadow-teal-900/10">
                {isLogin === null ? (
                  <Link
                    to="/user/login"
                    className="block px-4 py-3 text-sm font-black text-[#134E4A] hover:bg-[#ECFEFF]"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Login / Register
                  </Link>
                ) : (
                  <>
                    {[
                      ["Profile", "/userprofile"],
                      ["Appointments", "/userappointments"],
                      ["Documents", "/userdocuments"],
                      ["Change Password", "/passwordchange"],
                    ].map(([label, href]) => (
                      <Link
                        key={href}
                        to={href}
                        className="block px-4 py-3 text-sm font-black text-[#134E4A] hover:bg-[#ECFEFF]"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {label}
                      </Link>
                    ))}
                    <button
                      type="button"
                      className="block w-full px-4 py-3 text-left text-sm font-black text-[#b42318] hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setShowSearch((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#67E8F9]/60 bg-white text-[#134E4A]"
            aria-label="Search doctors"
          >
            {showSearch ? <FaXmark /> : <FaSearch />}
          </button>
          <button
            type="button"
            onClick={() => setShowMenu((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#134E4A] text-white"
            aria-label="Toggle menu"
          >
            {showMenu ? <FaXmark /> : <FaBars />}
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="border-t border-[#67E8F9]/30 bg-white px-5 py-3 lg:hidden">
          <input
            type="text"
            placeholder="Search doctors, departments, locations"
            value={query}
            onChange={handleSearch}
            className="w-full rounded-xl border border-[#67E8F9]/60 bg-[#ECFEFF] px-3 py-2 text-sm font-semibold outline-none focus:border-[#0D9488]"
          />
          {query && suggestions.length > 0 && (
            <div className="mt-3 max-h-72 overflow-y-auto rounded-xl border border-[#67E8F9]/40">
              {suggestions.map((staff) => (
                <Link
                  key={staff.id}
                  to={`/profiledoctor/${staff.id}`}
                  onClick={closeSearch}
                  className="flex items-center gap-3 p-3 hover:bg-[#ECFEFF]"
                >
                  <img
                    src={
                      staff.image?.startsWith("/brand/")
                        ? staff.image
                        : `${BaseUrl}${staff.image}`
                    }
                    alt={`${staff.fname} ${staff.lname}`}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div>
                    <p className="font-black text-[#134E4A]">
                      Dr. {staff.fname} {staff.lname}
                    </p>
                    <p className="text-xs text-[#134E4A]/60">
                      {staff.department || staff.location}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {showMenu && (
        <div className="border-t border-[#67E8F9]/30 bg-white px-5 py-4 shadow-xl lg:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = isActiveNavItem(item);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setShowMenu(false)}
                  aria-current={isActive ? "page" : undefined}
                  data-active={isActive ? "true" : "false"}
                  className={`rounded-xl px-3 py-3 text-sm font-black ${
                    isActive
                      ? "active bg-[#0D9488] text-white shadow-sm"
                      : "text-[#134E4A] hover:bg-[#ECFEFF]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              to={isLogin ? "/userprofile" : "/user/login"}
              onClick={() => setShowMenu(false)}
              className="rounded-xl px-3 py-3 text-sm font-black text-[#134E4A] hover:bg-[#ECFEFF]"
            >
              {isLogin ? "My Profile" : "Login / Register"}
            </Link>
            <button
              type="button"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D9488] px-5 py-3 text-sm font-black text-white"
              onClick={handleBookAppointment}
            >
              <FaCalendarCheck />
              Book Appointment
            </button>
          </nav>
        </div>
      )}

      <AppointmentModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </header>
  );
};

export default Header;
