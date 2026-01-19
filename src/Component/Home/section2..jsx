import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BaseUrl from "../../Api/baseurl";
const Section2 = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const apiUrl = `${BaseUrl}clinic/latest-services/`;
    // const token = localStorage.getItem('auth_token')
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          // Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="container mx-auto px-4 sm:px-8 lg:px-28 py-8 sm:py-12 md:py-16">
      <h1 className="font-Satoshi text-3xl font-bold leading-7 text-[#1030A4] text-center">
        Our Services
      </h1>
      <h2 className="font-poppins text-2xl md:text-4xl lg:text-5xl font-semibold leading-9 text-center pt-3 text-[#1E1E1E]">
        The Best Medical Care
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-14 gap-4">
        {data?.map((i, index) =>
          i.status === 1 ? (
            <Link
              to="/services"
              key={index}
              className="flex flex-col bg-white shadow-lg pr-16 pb-16 pt-8 pl-8 rounded-[20px] hover:skew-y-[-2deg]"
            >
              <div className="bg-[#307BC4] w-[70px] rounded-full p-2.5 flex items-center justify-center">
                {/* <VscCalendar className="text-[50px] text-[#ffffff]" /> */}
                <img src={i.image} alt={i.name} className="" />
              </div>
              <p className="font-inter text-lg font-bold leading-8 text-left text-[#274760] mt-3">
                {i.name}
              </p>
              <p className="font-poppins text-base font-normal w-2/3 leading-6 text-left text-[#27476085] mt-2">
                {i.text}
              </p>
            </Link>
          ) : null
        )}
      </div>
    </div>
  );
};

export default Section2;
