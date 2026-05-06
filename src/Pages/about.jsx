import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaHeartPulse,
  FaShieldHeart,
  FaUserDoctor,
} from "react-icons/fa6";

const metrics = [
  ["20M+", "patient touchpoints"],
  ["95%", "satisfaction rhythm"],
  ["200+", "care professionals"],
  ["24/7", "booking access"],
];

const principles = [
  {
    title: "Human-first booking",
    text: "Patients can compare doctors, choose a time, and continue with a guest or logged-in flow without friction.",
    icon: <FaCalendarCheck />,
  },
  {
    title: "Connected care records",
    text: "The platform keeps appointments, documents, profiles, and follow-ups organized around a single care journey.",
    icon: <FaShieldHeart />,
  },
  {
    title: "Clinic-ready operations",
    text: "Admin, doctor, patient, and vendor areas are structured for modern Firebase-backed workflows.",
    icon: <FaUserDoctor />,
  },
];

const carouselItems = [
  "Instant appointment routing",
  "Specialist matching",
  "Smart calendar slots",
  "Follow-up ready profiles",
  "Secure patient flow",
  "Modern wellness-tech UI",
];

const About = () => {
  return (
    <main className="overflow-hidden bg-[#ECFEFF] text-[#134E4A]">
      <section className="relative px-5 py-14 sm:px-8 lg:px-12">
        <div className="absolute inset-0 care-scan-grid opacity-40" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="inline-flex rounded-full border border-[#67E8F9]/70 bg-white/80 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-[#0D9488] shadow-sm backdrop-blur">
              About CareBridge
            </p>
            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-6xl">
              The clinic experience redesigned for a faster future.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#134E4A]/75">
              CareBridge brings patients, doctors, and clinic teams into one
              polished appointment system, with calm booking flows and
              Firebase-ready data behind the scenes.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D9488] px-6 py-4 text-sm font-black text-white shadow-xl shadow-teal-900/10 transition hover:bg-[#0F766E]"
              >
                Explore Services
                <FaHeartPulse />
              </Link>
              <Link
                to="/ourdoctors"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#67E8F9]/70 bg-white px-6 py-4 text-sm font-black text-[#134E4A] shadow-sm transition hover:border-[#0D9488] hover:text-[#0D9488]"
              >
                Meet Doctors
                <FaUserDoctor />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="care-float overflow-hidden rounded-3xl border border-[#67E8F9]/50 bg-white shadow-2xl shadow-teal-900/10">
              <img
                src="/brand/consultation-care-teal.png"
                alt="Doctor consulting with patient"
                className="h-[470px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-6 right-6 grid grid-cols-2 gap-3 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-xl shadow-teal-900/10 backdrop-blur md:grid-cols-4">
              {metrics.map(([value, label]) => (
                <div key={label}>
                  <p className="text-2xl font-black text-[#0D9488]">{value}</p>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#134E4A]/65">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-[#67E8F9]/40 bg-[#134E4A] py-4 text-white">
        <div className="care-marquee flex w-max gap-8 text-sm font-black uppercase tracking-[0.18em] text-cyan-50/85">
          {[...Array(2)].map((_, group) => (
            <div key={group} className="flex gap-8">
              {carouselItems.map((item) => (
                <span key={`${group}-${item}`} className="inline-flex items-center gap-2">
                  <FaHeartPulse className="text-[#67E8F9]" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-3xl border border-[#67E8F9]/40 bg-[#ECFEFF] shadow-xl shadow-teal-900/10">
            <img
              src="/brand/service-tech-teal.png"
              alt="Clinic technology dashboard"
              className="h-full min-h-[500px] w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
              Why it exists
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
              We bridge the gap between care discovery and confirmed visits.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#134E4A]/75">
              Traditional appointment sites often feel fragmented. CareBridge is
              designed as a calm, futuristic clinic layer where every route
              leads patients toward the next useful step.
            </p>

            <div className="mt-8 grid gap-4">
              {principles.map((item) => (
                <article
                  key={item.title}
                  className="group rounded-2xl border border-[#67E8F9]/40 bg-[#ECFEFF] p-5 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-teal-900/10"
                >
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-xl text-[#0D9488] shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-black">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#134E4A]/70">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                Operating model
              </p>
              <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
                A care system that keeps moving.
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-[#134E4A]/70">
              The page is built around motion, not clutter: flowing signals,
              responsive sections, and clear next actions.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {[
              ["/brand/team-care-teal.png", "Care teams", "Doctors, clinic teams, and patients share the same appointment context."],
              ["/brand/departments-care-teal.png", "Departments", "Services are grouped around real patient decisions, not static lists."],
              ["/brand/blog-heart-care-teal.png", "Education", "Health articles help patients understand what to do before booking."],
            ].map(([image, title, text], index) => (
              <article
                key={title}
                className="group overflow-hidden rounded-3xl border border-[#67E8F9]/40 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-900/10"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-[#F59E0B] px-3 py-1 text-xs font-black text-[#134E4A]">
                    0{index + 1}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#134E4A]/70">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
};

export default About;
