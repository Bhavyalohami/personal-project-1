import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaUserDoctor } from "react-icons/fa6";
import { IoIosArrowRoundForward } from "react-icons/io";
import axios from "axios";
import BaseUrl from "../../Api/baseurl";

const OurTeam = () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/staff-list/`);
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      setData([]);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const doctors = data.filter((item) => item.status === 1).slice(0, 4);

  return (
    <section className="bg-white px-5 pb-16 pt-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {doctors.map((doctor) => (
            <Link
              key={doctor.id || doctor.username}
              to={`/profiledoctor/${doctor.id}`}
              className="group overflow-hidden rounded-2xl border border-[#67E8F9]/40 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#0D9488] hover:shadow-xl hover:shadow-teal-900/10"
            >
              <div className="relative flex h-56 items-end justify-center overflow-hidden bg-[#ECFEFF]">
                <img
                  src={doctor.image || "/brand/doctor-avatar-teal.png"}
                  alt={`${doctor.fname || ""} ${doctor.lname || ""}`.trim()}
                  className="h-full w-full object-contain p-5 transition group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-md bg-white px-3 py-1 text-xs font-black text-[#134E4A] shadow-sm">
                  <FaStar className="text-[#F59E0B]" />
                  {doctor.average_rating || doctor.rating || "4.8"}
                </span>
              </div>
              <div className="p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#ECFEFF] text-[#0D9488]">
                  <FaUserDoctor />
                </div>
                <h3 className="text-lg font-black text-[#134E4A]">
                  Dr. {doctor.fname} {doctor.lname}
                </h3>
                <p className="mt-1 text-sm font-semibold text-[#0D9488]">
                  {doctor.designation || doctor.department}
                </p>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                  {doctor.introduction || "Book an appointment with this specialist."}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-[#0D9488]">
                  View profile
                  <IoIosArrowRoundForward className="text-2xl transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
