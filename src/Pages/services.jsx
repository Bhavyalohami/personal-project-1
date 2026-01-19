import { VscCalendar } from "react-icons/vsc";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BaseUrl from "../Api/baseurl";
const Services = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const apiUrl = `${BaseUrl}clinic/services-list/`;
    // const token = localStorage.getItem('auth_token')
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          // Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      // console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className=" bg-[#F2EFEA] pt-6">
        <div className="container grid grid-cols-2 mx-auto px-4 sm:px-8 lg:px-32 xl:px-48">
          <div className="flex flex-col justify-center items-start">
            <img src="/assets/Services/Frame.png" alt="" />
          </div>
          <div className="flex flex-col justify-center items-end font-black text-lg sm:text-xl md:text-3xl lg:text-7xl text-[#274760]">
            We provide the best for your healthy life and lifestyle.
            <div className="w-full">
              <p className="font-inter text-base font-normal leading-7 text-left text-[#274760] text-left">
                Your Partner in Health and Wellness
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 my-24">
        <div className="flex flex-col items-center justify-center">
          <text className="text-[#307BC4] font-inter text-lg font-semibold leading-8 ">
            SERVICES
          </text>
          <text className="text-[#274760] font-inter text-center text-4xl font-bold leading-16 ">
            Provides Our Best Services
          </text>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-14 gap-4">
            {data?.map((i, index) =>
              i.status === 1 ? (
                <div
                  key={index}
                  className="flex flex-col bg-white shadow-md pr-16 pb-16 pt-8 pl-8 rounded-[20px] hover:skew-y-[-2deg]"
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
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>

      <div className="container flex flex-col lg:flex-row gap-4 mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 my-12">
        <div className="w-full lg:w-2/3 flex flex-col">
          <text className="font-inter text-lg font-semibold leading-8 text-left text-[#307BC4]">
            HAVE A LOOK AT
          </text>
          <p className="font-inter text-5xl font-bold leading-none text-left text-[#274760] w-full lg:w-1/2">
            Our Facilities and Latest Activities
          </p>

          <div className="flex flex-col gap-4 mt-12 lg:mt-32">
            <div className="flex gap-2 lg:gap-4 w-[96%] lg:w-full">
              <img
                className="w-1/2"
                src="assets/Services/service1.png"
                alt=""
              />
              <img
                className="w-1/2 "
                src="assets/Services/service2.png"
                alt=""
              />
            </div>
            <img className="" src="assets/Services/service3.png" alt="" />
          </div>
        </div>

        <div className="flex flex-col w-full lg:w-1/3 gap-4">
          <img
            className="h-full object-cover rounded-[20px]"
            src="assets/Services/service4.png"
            alt=""
          />
          <img className="" src="assets/Services/service5.png" alt="" />
        </div>
      </div>

      <div className="container flex flex-col md:flex-row items-center justify-center gap-12 mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 my-12 bg-gradient-to-br from-white to-blue-300 py-8">
        <div className="flex flex-col w-full items-center justify-center">
          <text className="font-inter text-xl md:text-3xl lg:text-5xl font-bold leading-tight text-center text-[#274760]">
            20+
          </text>
          <p className="font-poppins text-base font-normal leading-6 text-center text-[#274760] ">
            Years of experience
          </p>
        </div>

        <div className="flex flex-col w-full items-center justify-center">
          <text className="font-inter text-xl md:text-3xl lg:text-5xl font-bold leading-tight text-center text-[#274760]">
            95%
          </text>
          <p className="font-poppins text-base font-normal leading-6 text-center text-[#274760] ">
            Patient satisfaction rating
          </p>
        </div>

        <div className="flex flex-col w-full items-center justify-center">
          <text className="font-inter text-xl md:text-3xl lg:text-5xl font-bold leading-tight text-center text-[#274760]">
            5000+
          </text>
          <p className="font-poppins text-base font-normal leading-6 text-center text-[#274760] ">
            Patients served annually
          </p>
        </div>

        <div className="flex flex-col w-full items-center justify-center">
          <text className="font-inter text-xl md:text-3xl lg:text-5xl font-bold leading-tight text-center text-[#274760]">
            10+
          </text>
          <p className="font-poppins text-base font-normal leading-6 text-center text-[#274760] ">
            Healthcare providers on staff
          </p>
        </div>

        <div className="flex flex-col w-full items-center justify-center">
          <text className="font-inter text-xl md:text-3xl lg:text-5xl font-bold leading-tight text-center text-[#274760]">
            22+
          </text>
          <p className="font-poppins text-base font-normal leading-6 text-center text-[#274760]">
            Convenient locations in the area
          </p>
        </div>
      </div>

      <div className="container flex flex-col items-center justify-center mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 my-12">
        <text className="font-inter text-[26px] font-semibold leading-7 text-[#307BC4] text-center">
          AWARDS
        </text>
        <p className="text-[#274760] font-inter text-center text-5xl font-bold leading-12 text-center w-full lg:w-2/3 xl:w-1/3 mt-4">
          Winning Awards and Recognition
        </p>
        <p className="w-full lg:w-1/4 text-[#000000B2] text-center mt-4">
          We have been recognized for our commitment toexcellence in healthcare.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-4">
          <div className="flex items-center justify-center shadow-lg rounded-[22px] px-4 py-4 w-full">
            <img
              src="/assets/Services/badge.png"
              alt=""
              className="bg-[#3D83C8] py-2 px-3 rounded-lg"
            />
            <text className="font-inter text-base font-normal leading-[34.06px] w-full text-left ml-2">
              Malcolm Baldrige National Quality Award
            </text>
          </div>

          <div className="flex items-center justify-center shadow-lg rounded-[22px] px-4 py-4 w-full">
            <img
              src="/assets/Services/badge.png"
              alt=""
              className="bg-[#3D83C8] py-2 px-3 rounded-lg"
            />
            <text className="font-inter text-base font-normal leading-[34.06px] w-full text-left ml-2">
              HIMSS Davies Award
            </text>
          </div>

          <div className="flex items-center justify-center shadow-lg rounded-[22px] px-4 py-4 w-full">
            <img
              src="/assets/Services/badge.png"
              alt=""
              className="bg-[#3D83C8] py-2 px-3 rounded-lg"
            />
            <text className="font-inter text-base font-normal leading-[34.06px] w-full text-left ml-2">
              Healthgrades National’s Best Hospital
            </text>
          </div>

          <div className="flex items-center justify-center shadow-lg rounded-[22px] px-4 py-4 w-full">
            <img
              src="/assets/Services/badge.png"
              alt=""
              className="bg-[#3D83C8] py-2 px-3 rounded-lg"
            />
            <text className="font-inter text-base font-normal leading-[34.06px] w-full text-left ml-2">
              Joint Commission Gold Seal of Approval
            </text>
          </div>
        </div>
      </div>

      <div className="container flex flex-col items-center justify-center  mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 2xl:">
        <img
          className="servicespng h-64 md:h-96 lg:h-[400px] 2xl:h-[500px] w-full"
          src="/assets/Services/Group.png"
          alt=""
        />
        <div className="absolute flex flex-col items-center justify-center w-auto">
          <text className="font-inter text-2xl sm:text-3xl lg:text-6xl w-4/5 lg:w-3/5  font-bold leading-76 text-center text-[#ffffff]">
            Don’t Let Your Health Take a Backseat!
          </text>
          <p className="text-[#ffffff] font-poppins w-2/3 lg:w-1/3 text-lg font-normal leading-7 text-center mt-4">
            Schedule an appointment with one of our experienced medical
            professionals today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;
