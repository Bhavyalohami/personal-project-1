import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FaAward, FaCalendarCheck, FaHeartPulse } from "react-icons/fa6";
import BaseUrl from "../Api/baseurl";

const Services = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/services-list/`, {
        headers: { "Content-Type": "application/json" },
      });
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const services = data.filter((item) => item.status === 1);

  return (
    <main className="bg-[#ECFEFF] text-[#134E4A]">
      <section className="px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
              Services
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
              Healthcare services built for faster booking.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#134E4A]/75">
              Explore specialist care, wellness support, and follow-up friendly
              appointments across departments.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#67E8F9]/50 bg-white shadow-xl shadow-teal-900/10">
            <img
              src="/brand/service-tech-teal.png"
              alt="Modern clinic technology"
              className="h-[420px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                Departments
              </p>
              <h2 className="mt-3 text-3xl font-black sm:text-5xl">
                Pick the right care path
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-[#134E4A]/70">
              Each service card connects to the same clean booking flow so
              patients can move from research to appointment without friction.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((item) => (
              <article
                key={item.id || item.name}
                className="group rounded-2xl border border-[#67E8F9]/40 bg-[#ECFEFF] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#0D9488] hover:bg-white hover:shadow-xl hover:shadow-teal-900/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-3 shadow-sm">
                    <img src={item.image} alt={item.name} className="max-h-11" />
                  </div>
                  <IoIosArrowRoundForward className="text-4xl text-[#0D9488] transition group-hover:translate-x-1" />
                </div>
                <h3 className="mt-6 text-xl font-black">{item.name}</h3>
                <p className="mt-3 text-sm leading-7 text-[#134E4A]/70">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_0.85fr]">
          <div className="overflow-hidden rounded-2xl border border-[#67E8F9]/40 bg-white shadow-xl shadow-teal-900/10">
            <img
              src="/brand/departments-care-teal.png"
              alt="Medical department overview"
              className="h-full min-h-[360px] w-full object-cover"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {[
              [<FaCalendarCheck />, "24/7 booking", "Patients can start a booking from every core page."],
              [<FaHeartPulse />, "Wellness-first care", "Preventive, family, and specialist care in one flow."],
              [<FaAward />, "Trusted experience", "Designed around clarity, speed, and follow-up readiness."],
            ].map(([icon, title, text]) => (
              <div key={title} className="rounded-2xl border border-[#67E8F9]/40 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#CCFBF1] text-xl text-[#0D9488]">
                  {icon}
                </div>
                <h3 className="text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#134E4A]/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
