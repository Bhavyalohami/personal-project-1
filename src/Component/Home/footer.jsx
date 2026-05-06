import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { BsFillTelephonePlusFill } from "react-icons/bs";
import {
  FaCalendarCheck,
  FaHeartPulse,
  FaLocationDot,
  FaShieldHeart,
} from "react-icons/fa6";
import AppointmentModal from "./appointmentmodal";
import { useEffect, useState } from "react";
import axios from "axios";
import BaseUrl from "../../Api/baseurl";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState({
    facebook_url: "",
    twitter_url: "",
    instagram_url: "",
    linkedin_url: "",
    timings_weekday: "",
    timings_weekend: "",
    contact_number: "",
    email_address: "",
    address: "",
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/configurations/`, {
        headers: { "Content-Type": "application/json" },
      });
      setData(response.data || {});
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookAppointment = () => {
    const token = Cookies.get("patient_token");
    if (!token) {
      Swal.fire({
        title: "You are not logged in!",
        text: "Would you like to continue as a guest or log in?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Continue as Guest",
        cancelButtonText: "Log In",
      }).then((result) => {
        if (result.isConfirmed) {
          setModalOpen(true);
        } else if (result.isDismissed) {
          navigate("/user/login");
        }
      });
    } else {
      setModalOpen(true);
    }
  };

  const socialLinks = [
    [data.facebook_url, <FaFacebookF />],
    [data.instagram_url, <FaInstagram />],
    [data.twitter_url, <FaTwitter />],
    [data.linkedin_url, <FaLinkedin />],
  ].filter(([href]) => href);
  const showFooterCta = location.pathname !== "/about";

  return (
    <footer className="relative overflow-hidden bg-[#134E4A] text-white">
      <div className="absolute inset-0 care-scan-grid opacity-20" aria-hidden="true" />
      <div className="relative overflow-hidden border-y border-white/10 bg-white/5 py-3">
        <div className="care-marquee-slow flex w-max gap-8 text-sm font-black uppercase tracking-[0.18em] text-cyan-50/80">
          {[...Array(2)].map((_, group) => (
            <div key={group} className="flex gap-8">
              {[
                "Book faster",
                "Compare specialists",
                "Store follow-ups",
                "Wellness-tech clinics",
                "Firebase-ready data",
                "Mobile friendly",
              ].map((item) => (
                <span key={`${group}-${item}`} className="inline-flex items-center gap-2">
                  <FaHeartPulse className="text-[#67E8F9]" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
        {showFooterCta && (
          <div className="mb-12 grid gap-6 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#67E8F9]">
                CareBridge
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
                Ready to turn browsing into a confirmed appointment?
              </h2>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F59E0B] px-6 py-4 text-sm font-black text-[#134E4A] shadow-xl shadow-black/10 transition hover:bg-[#67E8F9]"
              onClick={handleBookAppointment}
            >
              <FaCalendarCheck />
              Book Appointment
            </button>
            <AppointmentModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
          <div>
            <Link to="/">
              <img
                src="/brand/carebridge-logo-future-light.png"
                alt="CareBridge Clinic Appointments"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-cyan-50/80">
              A modern clinic appointment experience for patients, specialists,
              and care teams, from first search to follow-up.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                [<FaCalendarCheck />, "24/7", "Booking"],
                [<FaShieldHeart />, "Secure", "Records"],
                [<FaHeartPulse />, "Care", "Ready"],
              ].map(([icon, metric, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-3">
                  <div className="text-[#67E8F9]">{icon}</div>
                  <p className="mt-2 text-base font-black leading-tight sm:text-lg">
                    {metric}
                  </p>
                  <p className="text-xs text-cyan-50/70">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black">Explore</h3>
            <nav className="mt-5 flex flex-col gap-3 text-sm font-semibold text-cyan-50/80">
              {[
                ["About", "/about"],
                ["Services", "/services"],
                ["Blog", "/blog"],
                ["Contact", "/contactus"],
                ["Doctors", "/ourdoctors"],
              ].map(([label, href]) => (
                <Link key={href} to={href} className="hover:text-[#67E8F9]">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-black">Opening Hours</h3>
            <div className="mt-5 space-y-3 text-sm text-cyan-50/80">
              <p>
                Weekdays:{" "}
                <span className="font-bold text-white">
                  {data.timings_weekday || "Available"}
                </span>
              </p>
              <p>
                Weekend:{" "}
                <span className="font-bold text-white">
                  {data.timings_weekend || "Available"}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black">Contact</h3>
            <div className="mt-5 space-y-3 text-sm text-cyan-50/80">
              {data.email_address && (
                <p className="flex items-start gap-2">
                  <CiMail className="mt-1 text-lg text-[#67E8F9]" />
                  <span>{data.email_address}</span>
                </p>
              )}
              {data.contact_number && (
                <p className="flex items-start gap-2">
                  <BsFillTelephonePlusFill className="mt-1 text-sm text-[#67E8F9]" />
                  <span>(+91) {data.contact_number}</span>
                </p>
              )}
              {data.address && (
                <p className="flex items-start gap-2 leading-6">
                  <FaLocationDot className="mt-1 text-[#67E8F9]" />
                  <span>{data.address}</span>
                </p>
              )}
            </div>
            {socialLinks.length > 0 && (
              <div className="mt-6 flex gap-3">
                {socialLinks.map(([href, icon], index) => (
                  <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#0D9488]"
                    aria-label="Social profile"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-sm text-cyan-50/70 md:flex-row md:items-center">
          <p>Copyright 2026 CareBridge Clinic Appointments. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacypolicy" className="hover:text-[#67E8F9]">
              Privacy Policy
            </Link>
            <Link to="/termsofservice" className="hover:text-[#67E8F9]">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
