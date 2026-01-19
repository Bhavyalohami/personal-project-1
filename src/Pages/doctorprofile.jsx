import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { useParams, useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import BaseUrl from "../Api/baseurl";
import { useMediaQuery } from "@mui/material";
import dayjs from "dayjs";
import { Tooltip } from "@mui/material";
import { format, set } from "date-fns";
import { BsFillLightningChargeFill } from "react-icons/bs";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import parse from "html-react-parser";
import LoaderH from "../Component/Loader/loader";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DoctorProfile = () => {
  const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Ensures 24-hour format
  });
  const currentDate = new Date();
  const today = format(currentDate, "yyyy-MM-dd");
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("patient_token");
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [bookings, setBookings] = useState({});
  const [holidays, setHolidays] = useState([]);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reviewData, setReviewData] = useState([]);
  const [slots, setSlots] = useState({});
  const [timeslots, setTimeslots] = useState([]);
  const [subSlots, setSubSlots] = useState([]);
  const [profileData, setProfileData] = useState({
    location: "",
    department: "",
    username: "",
    problem: "",
    fname: "",
    lname: "",
    achievements: "",
    introduction: "",
    image: "",
  });

  const [overall_rating, setOverall_Rating] = useState();
  const slotsRef = useRef();
  const [formData, setFormData] = useState({
    date: "",
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
    // location: "",
    // department: "",
    // doctor: "",
    // problem: "",
    // username:""
  });
  const user = Cookies.get("patient_username");

  const validateform = () => {
    const errors = {
      date: "",
      time: "",
    };
    let isValid = true;
    if (formData.date === "" || formData.date === undefined) {
      errors.date = "Date is required";
      isValid = false;
    }
    if (formData.time === "" || formData.time === undefined) {
      errors.time = "Time is required";
      isValid = false;
    }

    setFormErrors(errors);

    return isValid;
  };

  const handleInstantBooking = async () => {
    const valid = validateform();

    if (valid) {
      
      try {
        const response = await axios.get(
          `${BaseUrl}clinic/patient-profile/${user}/`
        );
        const formDatatosend = {
          ...formData,
          name: response.data.name,
          age: response.data.age,
          gender: response.data.gender,
          contact: response.data.contact,
          email: response.data.email,
          city: response.data.city,
          payment_status: 0,
        };
        navigate("/payment", {
          state: {
            appointmentDetails: formDatatosend,
          },
        });
      }
        // try {
        //   setLoading(true);
        //   const response = await axios.post(
        //     `${BaseUrl}clinic/submit-appointment/`,
        //     formDatatosend,
        //     {
        //       headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Token ${token}`,
        //       },
        //     }
        //   );
        //   setLoading(false);
        //   Swal.fire({
        //     title: "Success!",
        //     html: `
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

        //     icon: "success",
        //     confirmButtonText: "OK",
        //   });
        //   navigate("/");
        // } catch (error) {
        //   setLoading(false);
        //   console.error(error);
        // }
       catch (error) {
        console.error(error);
      }
    }
  };
  const fetchdata = async () => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/feedback-list/${id}`);
      setProfileData(response.data.doctor);
      setReviewData(response.data.feedback);
      setFormData({
        location: response.data.doctor.location,
        department: response.data.doctor.department,
        doctor: response.data.doctor.fname + " " + response.data.doctor.lname,
        username: response.data.doctor.username,
        amount: response.data.doctor.amount,
        payment: 0,
      });
      // console.log(response.data.doctor.amount);
      setOverall_Rating(response.data);
      getSlotData(response.data.doctor.username);
      getdata(response.data.doctor.username);
      getdoctordata(response.data.doctor.username);
    } catch (error) {
      console.error(error);
    }
  };

  const getdoctordata = async (username) => {
    try {
      const year = currentMonth.year();
      const month = currentMonth.month() + 1;
      // const token = Cookies.get("token");
      const apiUrl = `${BaseUrl}clinic/monthly/${year}/${month}/`;
      const response = await axios.get(apiUrl, {
        params: {
          username: username,
        },
        // headers: {
        //   Authorization: `Token ${token}`,
        // },
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

  const patient_username = Cookies.get("username");
  const [feedbackData, setFeedbackData] = useState({
    patient: patient_username,
    doctor: id,
    review: "",
    rating: "",
  });

  useEffect(() => {
    fetchdata();
  }, [id]);

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

  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}`);
    return format(date, "HH:mm");
  };

  const handleTimeClick = (id, start, end) => {
    setSelectedTime(id, start, end);
    const timeValue = `${formatTime(start)} - ${formatTime(end)}`;
    setFormData((prev) => ({ ...prev, time: timeValue, sub_slot: id }));
    setFormErrors((prevErrors) => ({ ...prevErrors, time: "" }));
  };
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
        } else {
          setSubSlots([]);
        }
        setSelectedTime("");
        setFormData((prev) => ({ ...prev, date: dateString, time: "" }));
      }
    }
    setFormErrors((prevErrors) => ({ ...prevErrors, date: "" }));
  };

  const getdata = async (username) => {
    try {
      const apiUrl = `${BaseUrl}clinic/manageholiday/${username}`;
      const response = await axios.get(apiUrl);
      setHolidays(
        response.data.map((item) => ({
          date: item.date,
          comment: item.comment,
        }))
      );
    } catch (error) {
      console.error("Error fetching slot data:", error);
    }
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

  const submitFeedback = async () => {
    const token = Cookies.get("patient_token");
    try {
      const confirmationResult = await Swal.fire({
        title: "Submit?",
        text: "Do you want to submit the review?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      if (confirmationResult.isConfirmed) {
        setLoading(true);
        window.scrollTo(0, 0);
        const response = await axios.post(
          `${BaseUrl}clinic/feedback/`,
          feedbackData,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setLoading(false);

        Swal.fire({
          title: "Submitted Successfully",
          text: "Review Submitted Successfully",
          icon: "success",
          confirmButtonText: "Okay",
        });
        setFeedbackData({
          ...feedbackData,
          rating: "",
          review: "",
        });
        fetchdata();
      }
    } catch (error) {
      Swal.fire({
        title: "Can't Post a review",
        text: "You cannot leave a review for this doctor, as you do not have a completed booking.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
    setLoading(false);
  };

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

  const handleRedirect = () => {
    navigate("/user/login");
    Swal.fire({
      title: "You need to Login first to Book Instantly!!",
      icon: "warning",
      confirmButtonText: "OK",
    });
  };

  return (
    <>
      {loading ? (
        <LoaderH />
      ) : (
        <>
          <div>
            <div className=" bg-[#F2EFEA] py-12">
              <div className="container flex mx-auto px-4 sm:px-8 lg:px-32 xl:px-48">
                {/* {profileData && ( */}
                <div className="flex justify-start items-center gap-2 sm:!gap-8 w-2/3">
                  <img
                    className="w-[80px] h-[80px] sm:w-[150px] sm:h-[150px] rounded-full object-cover"
                    src={profileData.image}
                    alt="Profile Img"
                  />
                  <div className="flex flex-col">
                    <text className="text-[#011632] font-inter text-[24px] sm:text-[30px] lg:text-[52px] font-bold">
                      {profileData.fname + " " + profileData.lname}
                    </text>
                    <text className="font-semibold text-indigo-500 text-[12px] sm:text-[16px] lg:text-[20px]">
                      {profileData.department}
                    </text>
                    <text className="font-semibold text-[14px]">
                      {profileData.yoe} Years of Experience
                    </text>
                  </div>
                </div>
                {/* )} */}
                {overall_rating && (
                  <div className="flex flex-col items-end justify-between w-1/3">
                    <Box sx={{ "& > legend": { mt: 2 } }}>
                      <Rating
                        name="controlled"
                        value={overall_rating.overall_rating}
                        precision={0.5}
                        // onChange={(event, newValue) => {
                        //   setValue(newValue);
                        // }}
                        readOnly
                        size={ratingSize}
                      />
                    </Box>
                    <text className="font-medium text-white text-xs sm:text-base lg:text-lg p-2 rounded-lg bg-[#8565cf] text-center">
                      {profileData.location}
                    </text>
                  </div>
                )}
              </div>
            </div>

            <div className="container flex flex-col gap-4 mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 pt-6 pb-16">
              <div>
                {profileData.introduction !== "N/A" && (
                  <div className="flex flex-col gap-3 p-3">
                    <p className="text-2xl font-bold">Introduction</p>
                    <div className="">
                      <p className="font-base">{profileData.introduction}</p>
                    </div>
                  </div>
                )}
                {profileData.achievements !== "<p><br></p>" && (
                  <div className="flex flex-col gap-3 p-3">
                    <p className="text-2xl font-bold">Achievements & Awards</p>
                    <div className="flex flex-col gap-3 items-start justify-center w-full">
                      {parse(profileData.achievements)}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 p-3">
                <p className="text-2xl font-bold">Book Instantly</p>

                <div className="flex justify-around mt-6 flex-col md:flex-row  sm:space-x-5 rtl:space-x-reverse">
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
                                  isHolidayDate
                                    ? "bg-gray-300 text-black"
                                    : progresscolor
                                } ${
                                  selectedDate === day.format("YYYY-MM-DD")
                                    ? "border-4 !border-blue-500"
                                    : ""
                                }${
                                  PastDate
                                    ? "cursor-not-allowed cursor-banned text-gray-400 bg-white"
                                    : ""
                                }`}
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

                                      <div className="hidden sm:flex relative mt-4 w-full h-2 ">
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
                            // Only show active slots and future time slots for today
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

                <button
                  onClick={() => {
                    token ? handleInstantBooking() : handleRedirect();
                  }}
                  className="p-3 my-2 text-white font-bold rounded-xl flex gap-1 self-center items-center bg-[#1030A4]"
                >
                  Book Instantly
                  <BsFillLightningChargeFill />
                </button>
              </div>

              <div className="flex flex-col gap-3 p-3">
                <p className="text-2xl font-bold text-center pb-4">
                  What our patients say?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {reviewData.length > 0 ? (
                    reviewData.map((item, index) => {
                      if (item.is_active === true) {
                        return (
                          <div className="flex flex-col bg-[#f2f2f2] rounded-lg p-3 gap-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center justify-start gap-2">
                                <img
                                  className="w-[50px] h-[50px] rounded-full"
                                  src={
                                    "http://doctor-appointment-software.logicspice.com/Backend/media/" +
                                    // "http://127.0.0.1:8000/" +
                                    item.patient.image
                                  }
                                  alt=""
                                />
                                <p className="text-[#011632] font-inter text-lg font-bold">
                                  {item.patient.name.split(" ")[0]}
                                </p>
                              </div>
                              <Box sx={{ "& > legend": { mt: 2 } }}>
                                <Rating
                                  name="controlled"
                                  value={item.rating}
                                  precision={0.5}
                                  // onChange={(event, newValue) => {
                                  //   setValue(newValue);
                                  // }}
                                  size="small"
                                  readOnly
                                />
                              </Box>
                            </div>
                            <div className="p-3 rounded-lg">
                              <p className="text-sm font-medium">
                                {item.review}
                              </p>
                            </div>
                          </div>
                        );
                      }
                    })
                  ) : (
                    <div className="col-span-full">
                      <p className="text-3xl text-gray-400 text-center font-semibold">
                        No reviews for this doctor yet!!
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {token && (
                <div className="flex flex-col gap-3 p-3 bg-[#eeeeee] rounded-xl">
                  <p className="text-3xl font-bold ">Give Feedback!</p>
                  <div className="flex flex-col gap-2 px-3 rounded-xl">
                    <Box sx={{ "& > legend": { mt: 2 } }}>
                      <Rating
                        name="controlled"
                        value={feedbackData.rating}
                        precision={0.5}
                        onChange={(event, newValue) => {
                          setFeedbackData({
                            ...feedbackData,
                            rating: newValue,
                          });
                        }}
                        size="large"
                      />
                    </Box>

                    <textarea
                      name="review"
                      id="review"
                      value={feedbackData.review}
                      onChange={(e) => {
                        setFeedbackData({
                          ...feedbackData,
                          review: e.target.value,
                        });
                      }}
                      placeholder="Add a review to your Rating!"
                      className="min-h-24 p-2"
                    ></textarea>
                  </div>

                  <button
                    onClick={() => submitFeedback()}
                    className="p-2 w-1/3 md:w-1/5 text-center self-end bg-[#F16163] hover:bg-red-500 rounded-lg cursor-pointer text-white font-semibold"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DoctorProfile;
