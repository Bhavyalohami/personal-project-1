import { FaCalendarCheck, FaNotesMedical, FaShieldHeart } from "react-icons/fa6";

const benefits = [
  {
    title: "Free Consultation",
    text: "Get clear guidance before booking and choose the care path that fits your schedule.",
    icon: <FaNotesMedical />,
  },
  {
    title: "Verified Experts",
    text: "Browse experienced doctors by location, department, availability, and feedback.",
    icon: <FaShieldHeart />,
  },
  {
    title: "Easy Follow-Up",
    text: "Patients can manage appointments, documents, feedback, and profile details in one place.",
    icon: <FaCalendarCheck />,
  },
];

const Section1 = () => {
  return (
    <section className="bg-[#ECFEFF] px-5 py-14 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0D9488]">
            Why Choose Us
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#134E4A] sm:text-4xl">
            Care that feels organized before you arrive
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {benefits.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-[#67E8F9]/40 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-900/10"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-[#ECFEFF] text-2xl text-[#0D9488]">
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-[#134E4A]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section1;
