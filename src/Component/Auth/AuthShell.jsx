import { Link } from "react-router-dom";
import { FaCalendarCheck, FaShieldHeart, FaUserDoctor } from "react-icons/fa6";

const AuthShell = ({
  eyebrow = "Secure access",
  title,
  subtitle,
  children,
  footer,
}) => {
  return (
    <main className="min-h-screen bg-[#ECFEFF] text-[#134E4A]">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <Link to="/" className="mb-10 inline-flex items-center">
              <img
                src="/brand/carebridge-logo-future.png"
                alt="CareBridge Clinic Appointments"
                className="h-14 w-auto"
              />
            </Link>

            <div className="rounded-2xl border border-[#67E8F9]/50 bg-white p-6 shadow-xl shadow-teal-900/10 sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                {eyebrow}
              </p>
              <h1 className="mt-3 text-3xl font-black leading-tight text-[#134E4A] sm:text-4xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {subtitle}
                </p>
              )}
              <div className="mt-7">{children}</div>
              {footer && <div className="mt-6">{footer}</div>}
            </div>
          </div>
        </section>

        <aside className="hidden overflow-hidden bg-[#134E4A] text-white lg:block">
          <div className="relative flex h-full min-h-screen flex-col justify-between px-12 py-12">
            <img
              src="/brand/auth-care-teal.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-40"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(103,232,249,0.32),transparent_28%),linear-gradient(135deg,rgba(13,148,136,0.5),rgba(19,78,74,0.98)_58%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-cyan-50">
                <FaShieldHeart className="text-[#67E8F9]" />
                Firebase-ready care platform
              </div>
              <h2 className="mt-8 max-w-xl text-5xl font-black leading-tight">
                One calm workspace for appointments, patients, and care teams.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-8 text-cyan-50/80">
                Modern sign-in screens, role-aware access, and a clean route into
                the same admin, doctor, vendor, and patient dashboards.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-3">
              {[
                ["24/7", "Booking", <FaCalendarCheck />],
                ["4 roles", "Access", <FaUserDoctor />],
                ["Secure", "Records", <FaShieldHeart />],
              ].map(([metric, label, icon]) => (
                <div
                  key={label}
                  className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur"
                >
                  <div className="mb-3 text-2xl text-[#67E8F9]">{icon}</div>
                  <p className="text-2xl font-black">{metric}</p>
                  <p className="text-sm text-cyan-50/75">{label}</p>
                </div>
              ))}
            </div>

            <img
              src="/brand/carebridge-favicon-future.png"
              alt=""
              className="absolute bottom-20 right-8 z-0 h-40 w-40 rounded-3xl bg-white/90 p-4 opacity-95 shadow-2xl"
              aria-hidden="true"
            />
          </div>
        </aside>
      </div>
    </main>
  );
};

export default AuthShell;
