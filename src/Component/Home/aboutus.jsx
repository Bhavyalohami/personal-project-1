import { Link } from "react-router-dom";
import { GoArrowDownRight } from "react-icons/go";
import { FaCalendarCheck, FaHeartPulse, FaUserDoctor } from "react-icons/fa6";

const AboutUs = () => {
  return (
    <section className="bg-[#ECFEFF] px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative min-h-[500px] overflow-hidden rounded-2xl bg-[#134E4A] p-6 text-white shadow-xl shadow-teal-900/10">
          <img
            src="/brand/consultation-care-teal.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-70"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(19,78,74,0.96),rgba(13,148,136,0.62)_58%,rgba(236,254,255,0.08))]" />
          <img
            src="/brand/carebridge-favicon-future.png"
            alt=""
            className="absolute right-6 top-6 h-20 w-20 rounded-2xl bg-white/90 p-2 shadow-xl"
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/15 text-2xl text-[#67E8F9]">
              <FaHeartPulse />
            </div>
            <h2 className="mt-6 text-3xl font-black leading-tight">
              Patient care with less waiting and more clarity.
            </h2>
            <p className="mt-4 text-sm leading-7 text-cyan-50/80">
              From searching for a specialist to booking a slot, the experience
              stays simple, organized, and ready for follow-up.
            </p>
          </div>
          <div className="absolute bottom-6 left-6 right-6 z-10 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-black">50+</p>
              <p className="text-sm text-cyan-50/75">Specialists</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-black">30 min</p>
              <p className="text-sm text-cyan-50/75">Smart slots</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
            About Us
          </p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-[#134E4A] sm:text-5xl">
            A modern clinic experience from first search to final follow-up
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-600">
            Doctors Consultation helps patients find the right care team,
            compare services, book appointments, and keep their details in one
            place. The admin, doctor, and vendor areas are ready for Firebase
            data so the site can grow without a traditional server.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              [<FaUserDoctor />, "Verified doctors", "Specialists grouped by department and location."],
              [<FaCalendarCheck />, "Fast booking", "Guest and patient booking flows without duplicate popups."],
            ].map(([icon, title, text]) => (
              <div key={title} className="rounded-xl border border-[#67E8F9]/40 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-[#ECFEFF] text-xl text-[#0D9488]">
                  {icon}
                </div>
                <h3 className="font-black text-[#134E4A]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>

          <Link
            to="/about"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#0D9488] px-6 py-3 text-sm font-black text-white shadow-lg shadow-teal-900/10 transition hover:bg-[#0F766E]"
          >
            Learn More
            <GoArrowDownRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
