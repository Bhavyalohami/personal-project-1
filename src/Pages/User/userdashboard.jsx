import React from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaChevronRight,
  FaComments,
  FaFileMedical,
  FaHospital,
  FaKey,
  FaShieldHeart,
  FaUser,
} from "react-icons/fa6";

const portalLinks = [
  {
    title: "Profile",
    text: "Review your personal information and care identity.",
    href: "/userprofile",
    icon: <FaUser />,
  },
  {
    title: "Appointments",
    text: "Track upcoming, completed, and cancelled visits.",
    href: "/userappointments",
    icon: <FaCalendarCheck />,
  },
  {
    title: "Documents",
    text: "Upload prescriptions, reports, and consultation files.",
    href: "/userdocuments",
    icon: <FaFileMedical />,
  },
  {
    title: "Messages",
    text: "View doctor chat requests and continue accepted conversations.",
    href: "/messages",
    icon: <FaComments />,
  },
  {
    title: "Hospitals",
    text: "Find nearby hospitals, doctors, services, and diagnostic test slots.",
    href: "/hospitals",
    icon: <FaHospital />,
  },
  {
    title: "Security",
    text: "Update your password and keep access protected.",
    href: "/passwordchange",
    icon: <FaKey />,
  },
];

const Userdashboard = () => {
  const username = Cookies.get("patient_username") || "patient";

  return (
    <main className="min-h-screen bg-[#ECFEFF] text-[#134E4A]">
      <section className="relative overflow-hidden bg-[#134E4A] px-5 py-16 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 care-scan-grid opacity-20" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#67E8F9]">
              Patient command center
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
              Your care, appointments, and documents in one calm place.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-cyan-50/80">
              Welcome back, {username}. Jump into the area you need and keep
              your booking journey moving without hunting through menus.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl shadow-black/10 backdrop-blur">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#67E8F9] text-3xl text-[#134E4A]">
              <FaShieldHeart />
            </div>
            <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-[#67E8F9]">
              CareBridge status
            </p>
            <h2 className="mt-2 text-3xl font-black">Profile ready</h2>
            <p className="mt-3 text-sm leading-7 text-cyan-50/80">
              Guest and patient bookings both flow into this portal after login.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-3">
          {portalLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="group rounded-[2rem] border border-[#67E8F9]/50 bg-white p-6 shadow-xl shadow-teal-900/10 transition hover:-translate-y-1 hover:border-[#0D9488]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECFEFF] text-2xl text-[#0D9488]">
                  {item.icon}
                </div>
                <FaChevronRight className="mt-4 text-[#0D9488] transition group-hover:translate-x-1" />
              </div>
              <h2 className="mt-6 text-2xl font-black">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#134E4A]/70">
                {item.text}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Userdashboard;
