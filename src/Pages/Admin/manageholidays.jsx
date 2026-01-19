import dayjs from "dayjs";
import { format } from "date-fns";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import { Tooltip } from "@mui/material";
import AdminSearch from "../../Component/Admin/adminsearch";
import DoctorSearch from "../../Component/Doctor/doctorsearch";
import VendorSearch from "../../Component/Vendor/vendorsearch";
import Cookies from "js-cookie";
import { isBefore, startOfToday } from "date-fns";
import BaseUrl from "../../Api/baseurl";
import TextField from "@mui/material/TextField";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
let holidays = [];
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ManageHolidays = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDates, setSelectedDates] = useState([]);
  const [comment, setComment] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsData, setSlotsData] = useState({});
  const [bookings, setBookings] = useState({});
  const [data, setData] = useState(null);
  const [selectedHoliday, setSelectedHoliday] = useState([]);
  const [Doctorlist, setDoctorlist] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState([]);
  const name = useRef();
  const doctorlist = useRef([]);
  const username = Cookies.get("username");
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

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
  const handledoctorchange = (e) => {
    const { value } = e.target;
    setSelectedDoctor(value);
    name.current = value;
    getData(name.current);
    fetchData(name.current);
  };
  useEffect(() => {
    setIsVendor(Cookies.get("is_vendor") === "true");
    setIsSuperuser(Cookies.get("is_superuser") === "true");
    setIsStaff(Cookies.get("is_staff") === "true");
    getdoctorlist();
  }, []);

  const slotsRef = useRef();
  const getdoctorlist = async () => {
    try {
      const token = Cookies.get("token");
      const apiUrl = `${BaseUrl}clinic/doctorlist/`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setDoctorlist(response.data);
      doctorlist.current = response.data;
    } catch (error) {
      console.error("Error fetching slot data:", error);
    }
  };

  useEffect(() => {
    if (
      Doctorlist.length > 0 &&
      Doctorlist.some((doctor) => doctor.username === username)
    ) {
      name.current = username;

      getData(name.current);
      fetchData(name.current);
      setSelectedDoctor(name.current);
    }
  }, [Doctorlist, username]);

  const fetchData = async (username) => {
    try {
      const year = currentMonth.year();
      const month = currentMonth.month() + 1;
      const token = Cookies.get("token");
      const apiUrl = `${BaseUrl}clinic/monthly/${year}/${month}/`;
      const response = await axios.get(apiUrl, {
        params: {
          username: username,
        },
        headers: {
          Authorization: `Token ${token}`,
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
      if (error.code === "ERR_BAD_REQUEST") {
        Swal.fire({
          icon: "warning",
          title: "Session expired. Please login again.",
        });
        Cookies.remove("token");
        Cookies.remove("username");
        Cookies.remove("is_superuser");
        Cookies.remove("is_staff");
        Cookies.remove("is_vendor");
        Cookies.remove("status");
        Cookies.remove("roles");
        Cookies.remove("subroles");
        if (isSuperuser) {
          navigate("/admin/login");
        } else if (isVendor) {
          navigate("/vendor/login");
        } else {
          navigate("/doctor/login");
        }
      }
    }
  };
  const getData = async (name) => {
    try {
      const username = name;
      const token = Cookies.get("token");
      const apiUrl = `${BaseUrl}clinic/manageholiday/`;
      const response = await axios.get(apiUrl, {
        params: {
          username: username,
        },
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setData(response.data);
      // holidays = response.data.map((item) => item.date);
      holidays = response.data.map((item) => ({
        date: item.date,
        comment: item.comment,
      }));
    } catch (error) {
      console.error("Error fetching slot data:", error);
      if (error.code === "ERR_BAD_REQUEST") {
        Swal.fire({
          icon: "warning",
          title: "Session expired. Please login again.",
        });
        Cookies.remove("token");
        Cookies.remove("username");
        Cookies.remove("is_superuser");
        Cookies.remove("is_staff");
        Cookies.remove("is_vendor");
        Cookies.remove("status");
        Cookies.remove("roles");
        Cookies.remove("subroles");
        if (isSuperuser) {
          navigate("/admin/login");
        } else if (isVendor) {
          navigate("/vendor/login");
        } else {
          navigate("/doctor/login");
        }
      }
    }
  };

  const daysInMonth = generateDaysInMonth(currentMonth);
  const isHoliday = (date) =>
    date &&
    holidays.some((holiday) => holiday.date === date.format("YYYY-MM-DD"));

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

  const getprogresscolor = (percentage) => {
    if (percentage == 100) {
      return "bg-red-100";
    } else if (percentage >= 75) {
      return "bg-orange-100";
    } else if (percentage > 0) {
      return "bg-green-100";
    }
    return "bg-white";
  };
  const handleDateClick = (day, booking) => {
    const dateString = day.format("YYYY-MM-DD");

    if (booking === 0) {
      const isHolidayDate = holidays.some(
        (holiday) => holiday.date === dateString
      );

      if (!isHolidayDate) {
        if (selectedDates.includes(dateString)) {
          setSelectedDates(selectedDates.filter((date) => date !== dateString));
        } else {
          setSelectedDates([...selectedDates, dateString]);
        }

        if (selectedHoliday.length > 0) {
          setSelectedDates([]);
          Swal.fire({
            icon: "warning",
            html: '<h2 style="font-size: 18px; font-weight: bold;">Holiday and non-holiday dates cannot be selected together. Choose one type of date.</h2>',
          });
        }

        setSlotsData(slots[dateString]?.slots || null);
      } else {
        if (selectedHoliday.includes(dateString)) {
          setSelectedHoliday(
            selectedHoliday.filter((date) => date !== dateString)
          );
        } else {
          if (selectedDates.length === 0) {
            setSelectedHoliday([...selectedHoliday, dateString]);
          } else {
            Swal.fire({
              icon: "warning",
              html: '<h2 style="font-size: 18px; font-weight: bold;">Holiday and non-holiday dates cannot be selected together. Choose one type of date.</h2>',
            });
          }
        }
      }
    } else {
      Swal.fire({
        icon: "error",
        html: '<h2 style="font-size: 18px; font-weight: bold;">There are already some bookings on this date.<br>You cannot mark it as Holiday.</h2>',
      });
    }
  };

  const handleReset = () => {
    setSelectedDates([]);
    setComment(null);
  };
  const handleHolidayReset = () => {
    setSelectedHoliday([]);
  };
  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}`);
    return format(date, "HH:mm");
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setComment(value);
  };

  const handleAddHoliday = async () => {
    const result = await Swal.fire({
      title: "Do you want to add these holidays?",
      // text: "This action will update the holiday list.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0324fc",
      cancelButtonColor: "#fc0303",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      const username = name.current;
      const token = Cookies.get("token");
      const apiUrl = `${BaseUrl}clinic/manageholiday/`;
      const data = {
        username: username,
        dates: selectedDates,
        comments: comment,
      };

      try {
        await axios.post(apiUrl, data, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        Swal.fire({
          icon: "success",
          title: "Holiday Added Successfully!",
        });
        getData(name.current);
        setSelectedDates([]);
        setSelectedHoliday([]);
        setComment(null);
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error Adding Holiday",
          text: "Something went wrong. Please try again.",
        });
      }
    }
    //  else {
    //   Swal.fire({
    //     icon: "info",
    //     title: "Cancelled",
    //     text: "No changes were made.",
    //   });
    // }
  };

  const handleRemoveHoliday = async () => {
    const result = await Swal.fire({
      title: "Do you want to remove these holidays?",
      // text: "This action will update the holiday list.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0324fc",
      cancelButtonColor: "#fc0303",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      console.log(selectedHoliday);
      const token = Cookies.get("token");
      const apiUrl = `${BaseUrl}clinic/manageholiday/`;
      const data = {
        dates: selectedHoliday,
        username: name.current,
      };

      try {
        await axios.delete(apiUrl, {
          data: data,
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        Swal.fire({
          icon: "success",
          title: "Holiday removed Successfully!",
        });
        getData(name.current);
        setSelectedDates([]);
        setSelectedHoliday([]);
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error Removing Holiday",
          text: "Something went wrong. Please try again.",
        });
      }
    } else {
      Swal.fire({
        icon: "info",
        title: "Cancelled",
        text: "No changes were made.",
      });
    }
  };
  function handleBreadClick(event) {
    event.preventDefault();
  }
  return (
    <div className="py-8 px-8 w-full md:w-[80%] xl:w-full">
      {isSuperuser ? (
        <AdminSearch />
      ) : isVendor && !isStaff ? (
        <VendorSearch />
      ) : isVendor && isStaff ? (
        <DoctorSearch />
      ) : isStaff && !isVendor ? (
        <DoctorSearch />
      ) : null}
      <div role="presentation" onClick={handleBreadClick} className="ml-1">
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link
            className="hover:underline"
            color="inherit"
            to={isSuperuser ? "/admin/" : isVendor ? "/vendor" : "/doctor"}
          >
            Dashboard
          </Link>
          <Link className="hover:underline text-inherit" color="inherit">
            Manage Holidays
          </Link>
        </Breadcrumbs>
      </div>
      <div className="w-full min-h-screen bg-[#F2F2F2]  py-4 mt-3">
        <div className="flex items-center justify-between px-2 sm:!px-4">
          <text className="font-nunito-sans text-[22px] sm:text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Manage Holidays
          </text>
        </div>
        <div className="flex flex-col w-full h-full my-4">
          <div className="mb-4 w-full sm:w-1/2 lg:w-1/3 ml-3">
            <label
              htmlFor="doctor"
              className="block text-md font-medium leading-6 text-gray-900"
            >
              Doctor
              <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <select
                id="doctor"
                name="doctor"
                value={selectedDoctor}
                onChange={handledoctorchange}
                disabled={
                  Doctorlist.length > 0 &&
                  Doctorlist.some((doctor) => doctor.username === username)
                    ? true
                    : false
                }
                autoComplete="doctor"
                className={`block w-full h-9 bg-white rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600  sm:text-sm sm:leading-6 ${
                  Doctorlist.length > 0 &&
                  Doctorlist.some((doctor) => doctor.username === username)
                    ? "cursor-not-allowed"
                    : ""
                }`}
              >
                {" "}
                <option value="">Select a doctor</option>
                {Doctorlist.length > 0 &&
                  Doctorlist.map((doctor) => (
                    <>
                      <option value={doctor.username}>
                        {doctor.fname} {doctor.lname}
                      </option>
                    </>
                  ))}
              </select>
            </div>
            <span className="text-red-500 mt-2 text-sm">
              {/* {formErrors.doctor} */}
            </span>
          </div>
          <div className="grid grid-cols-7 w-full bg-white pt-2">
            <div className=" p-2 col-span-7">
              <div className="flex justify-between mb-4">
                <Tooltip title="Previous Month">
                <button
                  className="bg-blue-500 text-xs lg:text-base text-white px-2 sm:!px-4 py-2 rounded"
                  onClick={() =>
                    setCurrentMonth(currentMonth.subtract(1, "month"))
                  }
                >
                  <FaArrowLeft/>
                </button>
                </Tooltip>
                <h2 className="flex items-center justify-center text-base text-center sm:text-lg font-bold">
                  {currentMonth.format("MMMM YYYY")}
                </h2>
                <Tooltip title="Next Month">
                <button
                  className="bg-blue-500 text-xs lg:text-base text-white px-2 sm:!px-4 py-2 rounded"
                  onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
                >
                  <FaArrowRight/>
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
                  const isPastDate = dayjs(day).isBefore(dayjs(), "day");
                  const bookingInfo = getBookingInfo(day);
                  const isBooked = bookingInfo.total > 0;
                  const isHolidayDate = isHoliday(day);
                  const percentageBooked = isBooked
                    ? ((bookingInfo.booked / bookingInfo.total) * 100).toFixed(
                        2
                      )
                    : 0;
                  const progressColor = getProgressColor(percentageBooked);
                  const progresscolor = getprogresscolor(percentageBooked);
                  return (
                    <div
                      key={index}
                      className={`relative p-2 border text-center cursor-pointer ${
                        isHolidayDate
                          ? "bg-gray-300 !cursor-not-allowed"
                          : progresscolor
                      } ${
                        selectedDates.includes(day.format("YYYY-MM-DD"))
                          ? "border-4 !border-blue-500"
                          : selectedHoliday.includes(day.format("YYYY-MM-DD"))
                          ? "border-4 !border-red-500"
                          : ""
                      }${isPastDate ? "cursor-not-allowed " : ""}`}
                      onClick={
                        !isPastDate
                          ? () => handleDateClick(day, bookingInfo.booked)
                          : null
                      }
                      onMouseEnter={
                        !isPastDate ? () => handleMouseEnter(day) : null
                      }
                      onMouseLeave={!isPastDate ? handleMouseLeave : null}
                    >
                      {!isHolidayDate ? (
                        <Tooltip
                          title={
                            <div className="p-2 pb-4">
                              <h3 className="text-lg font-bold">Date Info</h3>
                              <p>{`Full Date: ${day.format("YYYY-MM-DD")}`}</p>
                              <p>{`Day: ${day.format("dddd")}`}</p>
                              <p>{`Total Slots: ${bookingInfo.total}`}</p>
                              <p>{`Booked Slots: ${bookingInfo.booked}`}</p>
                              <div className="grid grid-cols-3 gap-2 mt-3">
                                {bookingInfo.subSlots.length > 0 ? (
                                  bookingInfo.subSlots.map((subSlot, index) => (
                                    <p
                                      key={index}
                                      className={`p-1 border border-1 border-white rounded 
                                      ${
                                        subSlot.is_booked
                                          ? "bg-white text-gray-700"
                                          : "bg-transparent text-white font-bold"
                                      }`}
                                    >
                                      {`${formatTime(
                                        subSlot.start_time
                                      )} - ${formatTime(subSlot.end_time)}`}
                                    </p>
                                  ))
                                ) : (
                                  <p>No slots...</p>
                                )}
                              </div>
                              <div className="w-full flex gap-3 mt-2.5 items-center justify-start">
                                <div className="flex gap-2 items-center justify-center">
                                  <div className="w-3 h-3 bg-white rounded-full border border-1 border-white"></div>
                                  <p>Booked</p>
                                </div>
                                <div className="flex gap-2 items-center justify-center">
                                  <div className="w-3 h-3 bg-transparent rounded-full border border-1 border-white"></div>
                                  <p>Available</p>
                                </div>
                              </div>
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
                            <span className="hidden sm:flex absolute top-2 right-2 text-xs font-bold text-gray-700">
                              {bookingInfo.booked > 0 ? bookingInfo.booked : ""}
                            </span>

                            <div className="hidden sm:flex relative mt-4 w-full h-2 bg-white rounded-full">
                              <div
                                className={`h-[100%] ${progressColor} rounded-full`}
                                style={{ width: `${percentageBooked}%` }}
                              ></div>
                            </div>
                            <div className="hidden sm:flex w-full text-center text-[10px] mt-2 font-normal text-gray-600">
                              {percentageBooked > 0
                                ? `${percentageBooked}% Booked`
                                : ""}
                            </div>
                          </div>
                        </Tooltip>
                      ) : (
                        <Tooltip
                          title={
                            <div className="p-2">
                              <h3 className="text-lg font-bold">Date Info</h3>
                              <p>{`Full Date: ${day.format("YYYY-MM-DD")}`}</p>
                              <p>{`Day: ${day.format("dddd")}`}</p>
                              {holidays.find(
                                (holiday) =>
                                  holiday.date === day.format("YYYY-MM-DD")
                              )?.comment !== null ? (
                                <h2 className="text-lg font-bold mt-3">
                                  {
                                    holidays.find(
                                      (holiday) =>
                                        holiday.date ===
                                        day.format("YYYY-MM-DD")
                                    )?.comment
                                  }
                                </h2>
                              ) : (
                                <h2 className="text-lg font-bold mt-3">
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
                  <div className="border border-gray-300 text-[12px] w-full text-center bg-white h-16 flex justify-center items-center ">
                    Available Date
                  </div>
                  <div className="border border-gray-300 bg-gray-300 text-[12px] text-center w-full h-16 flex justify-center items-center">
                    Holiday
                  </div>
                  <div className="border border-4 !border-red-600 text-[12px] w-full text-center bg-gray-300 h-16 flex justify-center items-center">
                    Selected Holiday
                  </div>
                  <div className="border border-4 !border-blue-600 text-[12px] text-center w-full h-16 flex justify-center items-center">
                    Selected Date
                  </div>
                </div>
              </div>
              <div className="w-full flex items-center justify-start mt-3">
                <p className="font-medium">
                  **You cannot select previous dates.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="my-10">
          {selectedDates.length > 0 && (
            <div className="flex flex-col gap-3 items-center justify-center">
              <p className="text-lg font-bold">
                Mark selected days as Holidays?
              </p>
              <TextField
                label="Comment(Optional)"
                id="outlined-size-small"
                // defaultValue="Small"
                size="small"
                value={comment}
                onChange={handleChange}
              />
              <div className="flex items-center justify-around gap-3">
                <button
                  onClick={() => handleAddHoliday()}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-800 text-white font-bold rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => handleReset()}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-800 text-white font-bold rounded-lg"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
          {selectedHoliday.length > 0 && (
            <div className="flex flex-col gap-3 items-center justify-center mt-3">
              <p className="text-lg font-bold">
                Remove selected days from Holidays?
              </p>

              <div className="flex items-center justify-around gap-3">
                <button
                  onClick={() => handleRemoveHoliday()}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-800 text-white font-bold rounded-lg"
                >
                  Remove
                </button>
                <button
                  onClick={() => handleHolidayReset()}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-800 text-white font-bold rounded-lg"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageHolidays;
