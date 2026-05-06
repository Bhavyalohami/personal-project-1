const OurTeam1 = () => {
  return (
    <section className="bg-white px-5 pt-16 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl items-end gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
            Our Doctors
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight text-[#134E4A] sm:text-5xl">
            Specialists ready for your next appointment
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            Browse trusted clinicians by department, location, experience, and
            availability before choosing a slot.
          </p>
        </div>
        <div className="hidden overflow-hidden rounded-2xl border border-[#67E8F9]/40 bg-[#ECFEFF] shadow-lg shadow-teal-900/5 lg:block">
          <img
            src="/brand/team-care-teal.png"
            alt=""
            className="h-64 w-full object-cover"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

export default OurTeam1;
