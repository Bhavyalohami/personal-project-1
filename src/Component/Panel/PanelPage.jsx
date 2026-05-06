import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";
import AdminSearch from "../Admin/adminsearch";
import DoctorSearch from "../Doctor/doctorsearch";
import VendorSearch from "../Vendor/vendorsearch";

const getPanelSearch = () => {
  const isSuperuser = Cookies.get("is_superuser") === "true";
  const isVendor = Cookies.get("is_vendor") === "true";
  const isStaff = Cookies.get("is_staff") === "true";

  if (isSuperuser) return <AdminSearch />;
  if (isVendor && !isStaff) return <VendorSearch />;
  if (isStaff) return <DoctorSearch />;
  return null;
};

const PanelPage = ({
  eyebrow = "CareBridge",
  title,
  description,
  breadcrumbs = [],
  actions,
  children,
  className = "",
  showSearch = true,
}) => (
  <main className={`panel-page w-full px-4 py-6 text-[#134E4A] sm:px-6 lg:px-8 ${className}`}>
    {showSearch && getPanelSearch()}

    {(breadcrumbs.length > 0 || title || description || actions) && (
      <section className="relative overflow-hidden rounded-[2rem] border border-[#67E8F9]/50 bg-[#134E4A] p-5 text-white shadow-2xl shadow-teal-950/15 sm:p-7">
        <div className="pointer-events-none care-scan-grid absolute inset-0 opacity-0" aria-hidden="true" />
        {breadcrumbs.length > 0 && (
          <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-cyan-50/70">
            {breadcrumbs.map((item, index) => (
              <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
                {item.href ? (
                  <Link to={item.href} className="transition hover:text-[#67E8F9]">
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
                {index < breadcrumbs.length - 1 && <FaChevronRight className="text-[10px]" />}
              </span>
            ))}
          </nav>
        )}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#67E8F9]">
              {eyebrow}
            </p>
            {title && <h1 className="mt-3 text-3xl font-black sm:text-5xl">{title}</h1>}
            {description && (
              <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-cyan-50/78">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>
      </section>
    )}

    <div className="mt-6">{children}</div>
  </main>
);

export default PanelPage;
