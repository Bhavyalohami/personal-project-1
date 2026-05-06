import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowRoundForward } from "react-icons/io";
import BaseUrl from "../../Api/baseurl";

const Section2 = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const apiUrl = `${BaseUrl}clinic/latest-services/`;
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
        },
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

  const services = Array.isArray(data)
    ? data.filter((item) => item.status === 1).slice(0, 6)
    : [];

  return (
    <section className="bg-white px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0D9488]">
              Our Services
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#134E4A] sm:text-5xl">
              Medical services made easier to access
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 font-bold text-[#0D9488] hover:text-[#0F766E]"
          >
            View all services
            <IoIosArrowRoundForward className="text-2xl" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((item) => (
            <Link
              to="/services"
              key={item.id || item.name}
              className="group rounded-2xl border border-[#67E8F9]/40 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#0D9488] hover:shadow-xl hover:shadow-teal-900/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#CCFBF1] p-3">
                  <img src={item.image} alt={item.name} className="max-h-9" />
                </div>
                <IoIosArrowRoundForward className="text-3xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#0D9488]" />
              </div>
              <h3 className="mt-6 text-xl font-black text-[#134E4A]">
                {item.name}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                {item.text}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section2;
