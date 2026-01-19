import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import BaseUrl from "../Api/baseurl";
import LoaderH from "../Component/Loader/loader";
import { Tooltip } from "@mui/material";
import { format } from "date-fns";

import { useMediaQuery } from "@mui/material";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Booking = () => {
  const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const currentDate = new Date();
  const today = format(currentDate, "yyyy-MM-dd");
  // console.log(currentTime);

  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [formData, setFormData] = useState({
    date: selectedDate,
    time: "",
    location: "",
    department: "",
    doctor: "",
    problem: "",
    username: "",
    sub_slot: "",
    amount: "",
    payment: "",
  });
  const [formErrors, setFormErrors] = useState({
    date: "",
    time: "",
    location: "",
    department: "",
    doctor: "",
    problem: "",
    // username:""
  });
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState({});
  const [error, setError] = useState(null);
  // const [timeslots, setTimeslots] = useState([]);
  // const [existingBookings, setExistingBookings] = useState([]);
  const [location, setLocation] = useState("");
  const [departments, setDepartments] = useState([]);
  const [doctor, setDoctor] = useState("");
  // const [name, setName] = useState("");
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [hoveredDate, setHoveredDate] = useState(null);
  const [bookings, setBookings] = useState({});
  const [holidays, setHolidays] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const slotsRef = useRef();
  const generateDaysInMonth = (month) => {
    const startOfMonth = month.startOf("month");
    const endOfMonth = month.endOf("month");

    let startDayOfWeek = startOfMonth.day();
    startDayOfWeek = startDayOfWeek === 0 ? 7 : startDayOfWeek;

    const days = [];
    let currentDay = startOfMonth;

    for (let i = 1; i < startDayOfWeek; i++) {
      days.push(null);
    }

    while (currentDay.isBefore(endOfMonth.add(1, "day"))) {
      days.push(currentDay);
      currentDay = currentDay.add(1, "day");
    }

    return days.slice(0, endOfMonth.date() + startDayOfWeek - 1);
  };
  const daysInMonth = generateDaysInMonth(currentMonth);

  const isHoliday = (date) =>
    date &&
    holidays.some((holiday) => holiday.date === date.format("YYYY-MM-DD"));

  const handleMouseEnter = (day) => {
    if (!holidays.includes(day.format("YYYY-MM-DD"))) {
      setHoveredDate({
        fullDate: day.format("YYYY-MM-DD"),
        dayOfWeek: day.format("dddd"),
        bookingInfo: getBookingInfo(day),
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  const getData = async (username) => {
    try {
      const year = currentMonth.year();
      const month = currentMonth.month() + 1;
      // const token = Cookies.get("token");
      const apiUrl = `${BaseUrl}clinic/monthly/${year}/${month}/`;
      const response = await axios.get(apiUrl, {
        params: {
          username: username,
        },
      });
      setSlots(response.data);
      slotsRef.current = response.data;
      const updatedBookings = {};

      for (const date in response.data) {
        const total = response.data[date].total_count;
        const booked = response.data[date].total_booked;

        let allSubSlots = [];

        response.data[date].slots.forEach((slot) => {
          allSubSlots = allSubSlots.concat(slot.sub_slots);
        });
        updatedBookings[date] = { total, booked, subSlots: allSubSlots };
      }
      setBookings(updatedBookings);
      // handleUpdatedData(selectedDate.fullDate);
    } catch (error) {
      console.error("Error fetching slot data:", error);
    }
  };

  const getBookingInfo = (date) => {
    if (!date) return { total: 0, booked: 0, subSlots: [] };
    const bookingInfo = bookings[date.format("YYYY-MM-DD")];
    return bookingInfo
      ? {
          total: bookingInfo.total,
          booked: bookingInfo.booked,
          subSlots: bookingInfo.subSlots || [],
        }
      : { total: 0, booked: 0, subSlots: [] };
  };

  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}`);
    return format(date, "HH:mm");
  };
  useEffect(() => {
    if (doctor) {
      fetchdata(doctor);
    }
  }, [doctor]);
  useEffect(() => {
    getSlotData(doctor);
  }, [currentMonth]);

  useEffect(() => {
    getLocation();
    if (formData.location) {
      getDepartments(formData.location);
    } else {
      setDepartments([]);
    }
  }, [formData.location]);

  useEffect(() => {
    const name = Cookies.get("name");
    if (!name) {
      navigate("/getdetails");
    }

    const storedData = localStorage.getItem("formData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, [selectedDate]);

  const getDepartments = async (location) => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/staff-list/`, {});
      setDepartments(response.data);
    } catch (error) {
      setError(error.message);
    }
  };
  const getLocation = async () => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/managelocation/`, {});
      setLocation(response.data);
      // console.log(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchdata = async (username) => {
    try {
      const apiUrl = `${BaseUrl}clinic/manageholiday/${username}`;
      const response = await axios.get(apiUrl);
      setHolidays(
        response.data.map((item) => ({
          date: item.date,
          comment: item.comment,
        }))
      );
      // console.log(holidays, "holidays");
    } catch (error) {
      console.error("Error fetching slot data:", error);
    }
  };
  const getProgressColor = (percentage) => {
    if (percentage == 100) {
      return "bg-red-500";
    } else if (percentage >= 75) {
      return "bg-orange-500";
    } else if (percentage > 0) {
      return "bg-green-500";
    }
    return "bg-white";
  };
  const getprogresscolor = (percentage, isBooked) => {
    if (percentage == 100) {
      return "bg-red-100";
    } else if (percentage >= 75) {
      return "bg-orange-100";
    } else if (percentage > 0 || isBooked) {
      return "bg-green-100";
    }
    return "bg-white";
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "location") {
      formData.doctor = "";
      formData.department = "";
      formData.date = "";
      setDoctor("");
    }
    if (name === "department") {
      setDoctor("");
    }
    if (name === "doctor" && value !== "") {
      handleDoctorChange(value);
      formData.date = "";
    }
    if (name === "doctor" && value === "") {
      setDoctor("");
    }
  };
  const handleDoctorChange = (user) => {
    setSelectedDate(dayjs().format("YYYY-MM-DD"));
    const doctorData = departments.find((doctor) => doctor.username === user);
    if (doctorData) {
      setFormData((prev) => ({
        ...prev,
        doctor: doctorData.fname + " " + doctorData.lname,
        username: doctorData.username,
        amount: doctorData.amount,
      }));
      setDoctor(doctorData.username);
      getData(doctorData.username);
    }
    getSlotData(doctorData.username);
    setSelectedDate("");
    setSelectedTime("");
  };

  const getSlotData = async (username) => {
    const year = currentMonth.year();
    const month = currentMonth.month() + 1;
    try {
      const apiUrl = `${BaseUrl}clinic/doctormonthlyslots/${username}/${year}/${month}`;
      const response = await axios.get(apiUrl, {});
      setSlots(response.data);
    } catch (error) {
      console.error("Error fetching slot data:", error);
    }
  };

  const [subSlots, setSubSlots] = useState([]);

  const handleDateClick = (day) => {
    const dateString = day.format("YYYY-MM-DD");
    if (holidays && !holidays.some((holiday) => holiday.date === dateString)) {
      if (selectedDate === dateString) {
        setSelectedDate("");
        setSubSlots([]);
        setSelectedTime("");
        setFormData((prev) => ({ ...prev, date: "", time: "" }));
      } else {
        setSelectedDate(dateString);
        if (slots[dateString] && slots[dateString].slots) {
          const availableSlots = slots[dateString].slots;
          const allSubSlots = availableSlots.flatMap(
            (slot) => slot.sub_slots || []
          );
          setSubSlots(allSubSlots);
          // console.log(allSubSlots);
        } else {
          setSubSlots([]);
        }
        setSelectedTime("");
        setFormData((prev) => ({ ...prev, date: dateString, time: "" }));
      }
    }
    setFormErrors((prevErrors) => ({ ...prevErrors, date: "" }));
  };

  const handleTimeClick = (id, start, end) => {
    setSelectedTime(id, start, end);
    const timeValue = `${formatTime(start)} - ${formatTime(end)}`;
    // console.log(timeValue);
    setFormData((prev) => ({ ...prev, time: timeValue, sub_slot: id }));
    setFormErrors((prevErrors) => ({ ...prevErrors, time: "" }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const errors = {};

  //   if (formData.date === "") errors.date = "Please Select a Date";
  //   if (formData.time === "") errors.time = "Please Select a Time";
  //   if (!formData.location) errors.location = "Please Select a Location";
  //   if (!formData.department) errors.department = "Please Select a Department";
  //   if (!formData.doctor) errors.doctor = "Please Select a Doctor";
  //   if (!formData.problem) errors.problem = "Please describe your Issue";
  //   if (Object.keys(errors).length) {
  //     setFormErrors(errors);
  //     return;
  //   }
  //   const formDatatosend = {
  //     ...data,
  //     ...formData,
  //   };

  //   const token = Cookies.get("patient_token");
  //   const config = {
  //     headers: {
  //       ...(token ? { Authorization: `Token ${token}` } : {}),
  //     },
  //   };
  //   try {
  //     setLoading(true);
  //     window.scrollTo(0, 0);
  //     await axios.post(
  //       `${BaseUrl}clinic/submit-appointment/`,
  //       formDatatosend,

  //     );

  //     setLoading(false);
  //     Cookies.remove("name");
  //     localStorage.removeItem("formData");

  //     Swal.fire({
  //       title: "Success!",
  //       html: `
  //             <div style="text-align:left">
  //               <p style="font-weight:bold color:blue">Your appointment is scheduled for:</p>
  //               <p><strong>Name:</strong> ${formDatatosend.name}</p>
  //               <p><strong>Date:</strong> ${dayjs(formData.date).format(
  //                 "DD MMMM YYYY"
  //               )}</p>
  //               <p><strong>Time:</strong> ${formData.time}</p>
  //               <p><strong>Location:</strong> ${formData.location}</p>
  //               <p><strong>Department:</strong> ${formData.department}</p>
  //               <p><strong>Doctor:</strong> ${formData.doctor}</p>

  //             </div>`,

  //       icon: "success",
  //       confirmButtonText: "OK",
  //     });
  //     navigate("/payment");
  //   } catch (error) {
  //     setLoading(false);
  //     Swal.fire({
  //       title: "Error!",
  //       text: "There was an error submitting your booking.",
  //       icon: "error",
  //       confirmButtonText: "OK",
  //     });
  //   }
  // };

  const handlesubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    // Validation checks
    if (formData.date === "") errors.date = "Please Select a Date";
    if (formData.time === "") errors.time = "Please Select a Time";
    if (!formData.location) errors.location = "Please Select a Location";
    if (!formData.department) errors.department = "Please Select a Department";
    if (!formData.doctor) errors.doctor = "Please Select a Doctor";
    if (!formData.problem) errors.problem = "Please describe your Issue";
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    const formDatatosend = {
      ...data,
      ...formData,
      payment_status: 0,
    };
    // console.log(formData);

    navigate("/payment", {
      state: {
        appointmentDetails: formDatatosend,
      },
    });
  };
  // const handlesubmit = async (e) => {
  //   e.preventDefault();
  //   const errors = {};

  //   // Validation checks
  //   if (formData.date === "") errors.date = "Please Select a Date";
  //   if (formData.time === "") errors.time = "Please Select a Time";
  //   if (!formData.location) errors.location = "Please Select a Location";
  //   if (!formData.department) errors.department = "Please Select a Department";
  //   if (!formData.doctor) errors.doctor = "Please Select a Doctor";
  //   if (!formData.problem) errors.problem = "Please describe your Issue";
  //   if (Object.keys(errors).length) {
  //     setFormErrors(errors);
  //     return;
  //   }

  //   const formDatatosend = {
  //     ...data,
  //     ...formData,
  //     payment_status: 0,
  //   };

  //   const token = Cookies.get("patient_token");
  //   const config = {
  //     headers: {
  //       ...(token ? { Authorization: `Token ${token}` } : {}),
  //     },
  //   };

  //   try {
  //     setLoading(true);
  //     window.scrollTo(0, 0);

  //     await axios.post(
  //       `${BaseUrl}clinic/submit-appointment/`,
  //       formDatatosend,
  //       config
  //     );
  //     setLoading(false);
  //     Cookies.remove("name");
  //     localStorage.removeItem("formData");
  //     Swal.fire({
  //       title: "Success!",
  //       html: `
  //         <div style="text-align:left">
  //           <p style="font-weight:bold color:blue">Your appointment is scheduled for:</p>
  //           <p><strong>Name:</strong> ${formDatatosend.name}</p>
  //           <p><strong>Date:</strong> ${dayjs(formData.date).format(
  //             "DD MMMM YYYY"
  //           )}</p>
  //           <p><strong>Time:</strong> ${formData.time}</p>
  //           <p><strong>Location:</strong> ${formData.location}</p>
  //           <p><strong>Department:</strong> ${formData.department}</p>
  //           <p><strong>Doctor:</strong> ${formData.doctor}</p>
  //         </div>`,
  //       icon: "success",
  //       confirmButtonText: "Proceed to Payment",
  //     }).then(() => {
  //       navigate("/payment", {
  //         state: {
  //           appointmentDetails: formDatatosend,
  //         },
  //       });
  //     });
  //   } catch (error) {
  //     setLoading(false);
  //     Swal.fire({
  //       title: "Error!",
  //       text: "There was an error submitting your booking.",
  //       icon: "error",
  //       confirmButtonText: "OK",
  //     });
  //   }
  // };

  const [value, setValue] = useState(3);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery(
    "(min-width:600px) and (max-width:960px)"
  );
  let ratingSize = "large";

  if (isSmallScreen) {
    ratingSize = "small";
  } else if (isMediumScreen) {
    ratingSize = "medium";
  }
  return (
    <>
      {loading ? (
        <LoaderH />
      ) : (
        <>
          <div>
            <div className="bg-[#F2EFEA] pt-6">
              <div className="container grid grid-cols-2 mx-auto px-4 sm:px-8 lg:px-32 xl:px-48">
                <div className="flex flex-col justify-center items-start text-black font-black text-lg sm:text-xl md:text-3xl lg:text-7xl">
                  Get your Slot
                </div>
                <div className="flex flex-col justify-center items-end">
                  <img src="/assets/Mainabout.png" alt="" />
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 my-16">
              <div className="flex flex-col lg:flex-row mt-16 gap-6">
                <div className="flex flex-col w-full lg:w-3/5">
                  <label className="font-inter text-base font-black leading-6 text-left text-[#585858] mb-2 px-2">
                    Location<span className="text-red-500">*</span>
                  </label>
                  <select
                    name="location"
                    id="location"
                    className="h-[60px] w-full !px-4 !pr-6 rounded-[12px] bg-[#ffffff] border-2 border-gray-300 font-inter text-base font-normal leading-[24.2px] text-left"
                    onChange={handleChange}
                  >
                    <option value="">Select a Location</option>
                    {location.length > 0 ? (
                      location
                        .filter((location) => location.status === 1)
                        .map((location) => (
                          <option key={location.id} value={location.name}>
                            {location.name}
                          </option>
                        ))
                    ) : (
                      <option disabled>Loading...</option>
                    )}
                  </select>
                  <span className="text-red-500 ml-2 mt-0">
                    {formErrors.location}
                  </span>

                  <label className="font-inter text-base font-black leading-6 text-left text-[#585858] mt-3 mb-2 px-2">
                    Department<span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    id="department"
                    className="h-[60px] w-full !px-4 !pr-6 rounded-[12px] bg-[#ffffff] border-2 border-gray-300 font-inter text-base font-normal leading-[24.2px] text-left"
                    onChange={handleChange}
                  >
                    <option value="">Select a Department</option>
                    {departments.length > 0 ? (
                      Array.from(
                        new Set(
                          departments
                            .filter(
                              (department) =>
                                department.location === formData.location
                            )
                            .map((department) => department.department)
                        )
                      ).map((department) => {
                        const departmentData = departments.find(
                          (dep) =>
                            dep.department === department &&
                            dep.location === formData.location
                        );
                        return (
                          <option
                            key={departmentData.id}
                            value={departmentData.department}
                          >
                            {departmentData.department}
                          </option>
                        );
                      })
                    ) : (
                      <option disabled>Select Location First....</option>
                    )}
                  </select>
                  <span className="text-red-500 ml-2 mt-0">
                    {formErrors.department}
                  </span>

                  <label className="font-inter text-base font-black leading-6 text-left text-[#585858] mb-2 mt-3 px-2">
                    Doctor<span className="text-red-500">*</span>
                  </label>
                  <select
                    name="doctor"
                    id="doctor"
                    className="h-[60px] w-full !px-4 rounded-[12px] bg-[#ffffff] border-2 border-gray-300 font-inter text-base font-normal leading-[24.2px] text-left"
                    onChange={handleChange}
                  >
                    <option value="">Select a Doctor</option>
                    {departments.length > 0 ? (
                      Array.from(
                        new Set(
                          departments
                            .filter(
                              (doctor) =>
                                doctor.department === formData.department &&
                                doctor.status === 1
                            )
                            .map((doctor) => doctor.username)
                        )
                      ).map((username) => {
                        const doctorData = departments.find(
                          (doc) =>
                            doc.username === username &&
                            doc.location === formData.location &&
                            doc.department === formData.department
                        );
                        return doctorData ? (
                          <option
                            key={doctorData.id}
                            value={doctorData.username}
                          >
                            {doctorData.fname + " " + doctorData.lname}
                          </option>
                        ) : null;
                      })
                    ) : (
                      <option disabled>
                        Select Location & Department First....
                      </option>
                    )}
                  </select>
                  <span className="text-red-500 ml-2 mt-0">
                    {formErrors.doctor}
                  </span>

                  <label className="font-inter text-base font-black leading-6 text-left text-[#585858] px-2 mt-3 mb-2">
                    Describe Your Issue<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="problem"
                    className="h-[151px] w-full px-4 py-2 rounded-[12px] bg-[#ffffff] border-2 border-gray-300 font-inter text-base font-normal leading-[24.2px]"
                    onChange={handleChange}
                  />
                  <span className="text-red-500 ml-2 mt-0">
                    {formErrors.problem}
                  </span>
                </div>
                {doctor !== "" ? (
                  Array.from(
                    new Set(
                      departments
                        .filter(
                          (doctor) =>
                            doctor.department === formData.department &&
                            doctor.status === 1
                        )
                        .map((doctor) => doctor.username)
                    )
                  ).map((username) => {
                    const doctorData = departments.find(
                      (doc) =>
                        doc.username === username &&
                        doc.location === formData.location &&
                        doc.department === formData.department
                    );
                    return username === formData.username ? (
                      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center gap-2 bg-gray-200 p-4 rounded-xl">
                        <img
                          className="w-[120px] h-[120px] rounded-xl object-cover"
                          src={doctorData.image}
                          alt=""
                        />
                        <p className="text-[#011632] font-inter text-[28px] font-bold">
                          {doctorData.fname} {doctorData.lname}
                        </p>
                        <div className="flex flex-col items-center gap-1 items-start w-full">
                          <text className="font-semibold text-indigo-500 text-[16px]">
                            {doctorData.department}
                          </text>

                          <text className="font-semibold text-[13px]">
                            {doctorData.yoe} Years Of Experience
                          </text>
                        </div>
                        <div className="flex flex-col gap-2 items-center">
                          <text className="text-xl underline font-semibold">
                            About
                          </text>
                          <p className="">{doctorData.introduction}</p>
                        </div>

                        <div className="flex w-full justify-end items-center">
                          {/* <Box sx={{ "& > legend": { mt: 2 } }}>
                            <Rating
                              name="controlled"
                              value={doctorData.rating}
                              precision={0.5}
                              // onChange={(event, newValue) => {
                              //   setValue(newValue);
                              // }}
                              readOnly
                              size={ratingSize}
                            />
                          </Box> */}

                          <p className="text-lg font-bold text-blue-800">
                            $<span className="ml-0.5">{doctorData.amount}</span>
                          </p>
                        </div>
                      </div>
                    ) : null;
                  })
                ) : (
                  <img
                    className="w-2/5 object-conver rounded-xl"
                    src="/assets/Booking/book2.jpg"
                    alt="Booking"
                  />
                )}
              </div>
              {doctor && (
                <div className="flex justify-around mt-16 flex-col md:flex-row  sm:space-x-5 rtl:space-x-reverse">
                  <div className="flex flex-col xl:flex-row w-full h-full bg-white border border-2 !border-gray-300 p-2 rounded-3xl">
                    <div className=" mt-4 grid grid-cols-7 w-full ">
                      <div className=" p-2 col-span-7">
                        <div className="flex justify-between mb-4">
                          <Tooltip title="Previous Month">
                            <button
                              className="bg-blue-500 text-xs lg:text-base text-white px-2 sm:!px-4 py-2 rounded"
                              onClick={() =>
                                setCurrentMonth(
                                  currentMonth.subtract(1, "month")
                                )
                              }
                            >
                              <FaArrowLeft />
                            </button>
                          </Tooltip>
                          <h2 className="flex items-center justify-center text-base text-center sm:text-lg font-bold">
                            {currentMonth.format("MMMM ")}
                            {currentMonth.year()}
                          </h2>
                          <Tooltip title="Next Month">
                            <button
                              className="bg-blue-500 text-xs lg:text-base text-white px-2 sm:!px-4 py-2 rounded"
                              onClick={() =>
                                setCurrentMonth(currentMonth.add(1, "month"))
                              }
                            >
                              <FaArrowRight />
                            </button>
                          </Tooltip>
                        </div>

                        <div className="grid grid-cols-7 gap-2 mb-2">
                          {dayNames.map((day, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-center text-center font-bold border p-2 text-gray-700"
                            >
                              {day}
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                          {daysInMonth.map((day, index) => {
                            if (!day) {
                              return <div key={index} className="p-4"></div>;
                            }
                            const PastDate = dayjs(day).isBefore(
                              dayjs(),
                              "day"
                            );
                            const bookingInfo = getBookingInfo(day);
                            // console.log(bookingInfo, "bookingInfo");
                            const isBooked = bookingInfo.total > 0;

                            const isHolidayDate = isHoliday(day);
                            const percentageBooked = isBooked
                              ? (
                                  (bookingInfo.booked / bookingInfo.total) *
                                  100
                                ).toFixed(2)
                              : 0;
                            const progressColor =
                              getProgressColor(percentageBooked);
                            const progresscolor = getprogresscolor(
                              percentageBooked,
                              isBooked
                            );
                            return (
                              <div
                                key={index}
                                className={`relative p-2 border text-center cursor-pointer ${
                                  isHolidayDate ? "bg-gray-300 " : progresscolor
                                } ${
                                  selectedDate === day.format("YYYY-MM-DD")
                                    ? "border-4 !border-blue-500"
                                    : ""
                                }${
                                  PastDate
                                    ? "cursor-not-allowed cursor-banned text-gray-400 bg-white"
                                    : ""
                                } `}
                                onClick={
                                  !PastDate ? () => handleDateClick(day) : null
                                }
                                onMouseEnter={
                                  !PastDate ? () => handleMouseEnter(day) : null
                                }
                                onMouseLeave={
                                  !PastDate ? handleMouseLeave : null
                                }
                              >
                                {!isHolidayDate ? (
                                  <Tooltip
                                    arrow
                                    aria-label={`Date info for ${day.format(
                                      "MMMM D, YYYY"
                                    )}`}
                                  >
                                    <div className="w-full">
                                      <span className="flex items-center justify-center text-lg font-bolder">
                                        {day.format("D")}
                                      </span>
                                      <div className=" sm:flex relative mt-4 w-full h-2 ">
                                        <div
                                          className={`h-[100%] ${progressColor} rounded-full`}
                                          // style={{
                                          //   width: `${percentageBooked}%`,
                                          // }}
                                        ></div>
                                      </div>
                                    </div>
                                  </Tooltip>
                                ) : (
                                  <Tooltip
                                    title={
                                      <div className="p-2">
                                        <h3 className="text-lg font-bold">
                                          Date Info
                                        </h3>
                                        <p>{`Full Date: ${day.format(
                                          "YYYY-MM-DD"
                                        )}`}</p>
                                        <p>{`Day: ${day.format("dddd")}`}</p>
                                        {holidays.find(
                                          (holiday) =>
                                            holiday.date ===
                                            day.format("YYYY-MM-DD")
                                        )?.comment !== null ? (
                                          <h2 className="text-lg font-bold">
                                            {
                                              holidays.find(
                                                (holiday) =>
                                                  holiday.date ===
                                                  day.format("YYYY-MM-DD")
                                              )?.comment
                                            }
                                          </h2>
                                        ) : (
                                          <h2 className="text-lg font-bold">
                                            No Information
                                          </h2>
                                        )}
                                      </div>
                                    }
                                    arrow
                                    aria-label={`Date info for ${day.format(
                                      "MMMM D, YYYY"
                                    )}`}
                                  >
                                    <div className="w-full">
                                      <span className="flex items-center justify-center text-lg font-bolder">
                                        {day.format("D")}
                                      </span>
                                      <span className="hidden sm:flex w-full items-center justify-center text-center text-xs lg:text-sm font-bold text-gray-900">
                                        Holiday
                                      </span>
                                    </div>
                                  </Tooltip>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className=" mt-4 p-3 border border-gray-300">
                          <div className="flex gap-0 sm:!gap-6">
                            <div className="border border-gray-300 text-[12px] w-full text-center bg-red-200 h-16 flex justify-center items-center">
                              Not Available
                            </div>
                            <div className="border border-gray-300 text-[12px] w-full text-center bg-green-200 h-16 flex justify-center items-center ">
                              Available
                            </div>

                            <div className="border border-gray-300 text-[12px] w-full text-center bg-orange-200 h-16 flex justify-center items-center">
                              Limited Slots
                            </div>
                            <div className="border border-4 !border-blue-600 text-[12px] text-center w-full h-16 flex justify-center items-center">
                              Selected Slot
                            </div>
                            <div className="border border-gray-300 bg-gray-300 text-[12px] text-center w-full h-16 flex justify-center items-center">
                              Holiday
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 w-full flex flex-col gap-2 items-start justify-start">
                          <span className="font-medium ml-2">
                            **You cannot select previous dates.
                          </span>
                          <span className="text-red-500 ml-2">
                            {formErrors.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-2/3 p-4 !ml-0 md:!ml-4 !mt-3 md:!mt-0 border-2 border-gray-300 rounded-3xl">
                    {selectedDate !== "" ? (
                      <h3 className="text-gray-900 text-lg font-medium mb-3 text-center">
                        {dayjs(selectedDate).format("D - MMMM - YYYY")}
                      </h3>
                    ) : (
                      <h3 className="text-gray-900 text-lg font-medium mb-3 text-center">
                        Please Select a Date
                      </h3>
                    )}
                    <text className="flex font-medium  text-gray-500 border-b border-gray-400 !w-full justify-center">
                      Pick a Time
                    </text>
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {subSlots.length > 0 ? (
                        subSlots
                          .filter((item) => {
                            if (!item.is_active) return false;
                            if (
                              selectedDate === today &&
                              item.start_time <= currentTime
                            )
                              return false;
                            return true;
                          })
                          .map((item, index) => {
                            const isBooked = item.is_booked;
                            const isSelected = selectedTime === item.id;

                            // Determine the class for each slot
                            const slotClass = `relative rounded-lg border border-gray-300 h-12 text-[14px] flex justify-center items-center ${
                              isBooked
                                ? "bg-gray-500 text-white font-bold cursor-not-allowed"
                                : isSelected
                                ? "bg-blue-500 text-white font-bold cursor-pointer"
                                : "bg-white text-gray-500 font-bold cursor-pointer"
                            }`;

                            return (
                              <h2
                                key={index}
                                className={slotClass}
                                onClick={() => {
                                  if (!isBooked) {
                                    handleTimeClick(
                                      item.id,
                                      item.start_time,
                                      item.end_time
                                    );
                                  }
                                }}
                              >
                                {`${formatTime(item.start_time)} - ${formatTime(
                                  item.end_time
                                )}`}
                              </h2>
                            );
                          })
                      ) : (
                        <div className="col-span-3 self-center justify-self-center">
                          <p className="text-xl font-medium text-gray-600">
                            No available slots.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 mt-8 mb-4">
                      <div className="flex items-center">
                        <div className="bg-[#ffffff] border-[2px] rounded-lg border-black w-5 h-5 mr-2"></div>{" "}
                        :{" "}
                        <text className="ml-2 font-medium">
                          Available Slots
                        </text>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-[#9ca3af] border-[2px] rounded-lg border-black w-5 h-5 mr-2"></div>{" "}
                        : <text className="ml-2 font-medium">Booked Slots</text>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-blue-500 border-[2px] rounded-lg border-black w-5 h-5 mr-2"></div>{" "}
                        :{" "}
                        <text className="ml-2 font-medium">Selected Slot</text>
                      </div>
                    </div>
                    <span className="text-red-500 ml-2 mt-3">
                      {formErrors.time}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex w-full gap-8 my-12 items-center justify-center container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48">
              <Link
                className="w-1/5 h-[60px] bg-[#1030A4] text-[#ffffff] rounded-[20px] flex items-center justify-center font-inter text-[12px] md:text-[28px] font-medium leading-8 hover:bg-blue-700"
                to="/"
              >
                Back
              </Link>
              <button
                type="button"
                className="w-1/5 h-[60px] bg-[#F16163] text-[#ffffff] rounded-[20px] flex items-center justify-center font-inter text-[12px] md:text-[28px] font-medium leading-8 hover:bg-red-600"
                onClick={handlesubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Booking;
