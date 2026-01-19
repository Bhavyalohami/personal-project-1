import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import { format } from "date-fns";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormAddDialog from "../../Component/Admin/addmoremodal";
import { FaBan } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { Tooltip } from "@mui/material";
import AdminSearch from "../../Component/Admin/adminsearch";
import DoctorSearch from "../../Component/Doctor/doctorsearch";
import VendorSearch from "../../Component/Vendor/vendorsearch";
import Cookies from "js-cookie";
import AppointmentModal from "./Viewmodals/viewappointmentinfo";
import BaseUrl from "../../Api/baseurl";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
let holidays = [];
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ManageSlots = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState({});
  const [hoveredDate, setHoveredDate] = useState(null);
  const [bookings, setBookings] = useState({});
  const [slots, setSlots] = useState([]);
  const [slotsData, setSlotsData] = useState({});
  const slotsRef = useRef();
  const [openModal, setOpenModal] = useState(false);
  const [Appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState([]);
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const navigate = useNavigate();
  const [isVendor, setIsVendor] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [subRoles, setSubRoles] = useState([]);
  const [doctorlist, setDoctorlist] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState([]);
  const name = useRef();
  const username = Cookies.get("username");
  const handleSubRoles = () => {
    const subroles = Cookies.get("subroles");
    if (subroles) {
      const parsedSubRoles = JSON.parse(subroles);
      const role = parsedSubRoles.find((role) => role.roleId === "13");
      if (role) {
        setSubRoles(role.subroles);
      }
    }
  };

  const handledoctorchange = (e) => {
    const { value } = e.target;
    setSelectedDoctor(value);
    name.current = value;
    getData(name.current);
    fetchdata(name.current);
  };

  const handleMouseEnterr = (slotId) => {
    setHoveredSlot(slotId);
  };

  const handleMouseLeavee = () => {
    setHoveredSlot(null);
  };

  useEffect(() => {
    if (
      doctorlist.length > 0 &&
      doctorlist.some((doctor) => doctor.username === username)
    ) {
      name.current = username;

      getData(name.current);
      fetchdata(name.current);
      setSelectedDoctor(name.current);
    }
  }, [doctorlist, username]);

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

  useEffect(() => {
    setIsVendor(Cookies.get("is_vendor") === "true");
    setIsSuperuser(Cookies.get("is_superuser") === "true");
    setIsStaff(Cookies.get("is_staff") === "true");
    fetchviewdata();
    handleSubRoles();
  }, []);

  useEffect(() => {
    getDoctorlist();
  }, [currentMonth]);

  const getDoctorlist = async () => {
    const token = Cookies.get("token");
    const apiUrl = `${BaseUrl}clinic/doctorlist/`;
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setDoctorlist(response.data);
    } catch (error) {
      console.error("Error fetching slot data:", error);
    }
  };

  const getData = async (username) => {
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
      handleUpdatedData(selectedDate.fullDate);
    } catch (error) {
      console.error("Error fetching slot data:", error);
    }
  };

  const fetchviewdata = async () => {
    const apiUrl = `${BaseUrl}clinic/booking`;

    const token = Cookies.get("token");
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setAppointments(response.data.appointments, "data");
      // console.log(response.data.appointments, "Appointments details...");
    } catch (error) {
      console.log(error.code);

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

  const handleOpenModal = (service) => {
    const filteredAppointments = Appointments.filter(
      (item) => item.sub_slot === service.id
    );
    setSelectedAppointment(filteredAppointments[0]);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAppointment(null);
  };

  const handleEditClick = (slot_id) => {
    const booking = Appointments.find(
      (booking) => booking.sub_slot === slot_id.id
    );
    // console.log(booking, "booking...");

    if (booking) {
      const booking_id = booking.id;
      navigate(`/doctor/appointments/editappointments/${booking_id}`);
    } else {
      console.log("No booking found for the given slot ID");
    }
  };

  const fetchdata = async (username) => {
    try {
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

      holidays = response.data.map((item) => ({
        date: item.date,
        comment: item.comment,
      }));
      // console.log(holidays, "holidays");
    } catch (error) {
      console.error("Error fetching slot data:", error);
    }
  };

  const daysInMonth = generateDaysInMonth(currentMonth);
  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}`);
    return format(date, "HH:mm");
  };

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

  const getprogresscolor = (percentage,isBooked) => {
    if (percentage == 100) {
      return "bg-red-100";
    } else if (percentage >= 75) {
      return "bg-orange-100";
    } else if (percentage > 0 || isBooked) {
      return "bg-green-100";
    }
    return "bg-white";
  };

  const handleDateClick = (day) => {
    const selectedDateString = day.format("YYYY-MM-DD");

    if (!holidays.some((holiday) => holiday.date === selectedDateString)) {
      if (selectedDate.fullDate === selectedDateString) {
        setSelectedDate({});
      } else {
        setSelectedDate({
          fullDate: day.format("YYYY-MM-DD"),
          dayOfWeek: day.format("dddd"),
        });
        window.scrollTo({
          top: 300,
          behavior: "smooth",
        });
      }

      if (slots[selectedDateString]) {
        setSlotsData(slots[selectedDateString].slots);
      } else {
        setSlotsData(null);
      }
    }
  };

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

  // const [value, setValue] = useState();
  // const [age, setAge] = useState("");

  // const handleChange = (event) => {
  //   setAge(event.target.value);
  // };

  const handleTimeChange = (index, type, newValue) => {
    if (newValue) {
      const formattedTime = dayjs(newValue).format("HH:mm:ss");
      setSlotsData((prev) => {
        const newSlots = [...prev];
        newSlots[index] = {
          ...newSlots[index],
          [type]: formattedTime,
        };
        return newSlots;
      });
    } else {
      setSlotsData((prev) => {
        const newSlots = [...prev];
        newSlots[index] = {
          ...newSlots[index],
          [type]: null,
        };
        return newSlots;
      });
    }
  };

  const handleDurationChange = (event, index, date) => {
    const { value } = event.target;
    setSlotsData((prevSlots) => {
      const updatedSlots = [...prevSlots];

      if (updatedSlots[index]) {
        updatedSlots[index] = {
          ...updatedSlots[index],
          duration: value,
        };
      }

      return updatedSlots;
    });
  };

  const handleSlotDelete = async (slot_id, count) => {
    if (count === 0) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to undo this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0324fc",
        cancelButtonColor: "#fc0303",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        try {
          const token = Cookies.get("token");
          await axios.delete(`${BaseUrl}clinic/dateslot/${slot_id}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          getData(name.current);
          Swal.fire("Deleted!", "Your Slot has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting slot:", error);
          const errorMessage =
            error.response?.data?.detail || "Something went wrong.";
          Swal.fire("Error!", errorMessage, "error");
        }
      }
    } else {
      Swal.fire(
        "Error!",
        "You can't delete this slot. You have bookings for this slot.",
        "error"
      );
    }
  };

  const handleSlotUpdate = async (slotId, count, start, end, duration) => {
    const token = Cookies.get("token");

    if (count === 0) {
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to undo this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0324fc",
        cancelButtonColor: "#fc0303",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });
      // console.log(start, end, duration);
      if (confirmation.isConfirmed) {
        try {
          const response = await axios.put(
            `${BaseUrl}clinic/dateslot/${slotId}/`,
            {
              start_time: start,
              end_time: end,
              duration: duration,
            },
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );

          Swal.fire("Updated!", "Slot has been updated.", "success");
          getData(name.current);
        } catch (error) {
          Swal.fire("Error!", "Failed to Update!", "error");
        }
      }
    } else {
      Swal.fire(
        "Error!",
        "You can't update this slot. You have bookings for this slot.",
        "error"
      );
    }
  };

  const handleToggleActive = async (slotId, isActive, count) => {
    // console.log(slotId.booked_sub_slot_count);
    if (count > 0) {
      return Swal.fire(
        "Error!",
        "You have Bookings for this slot, can't change the Staus .",
        "error"
      );
    } else {
      try {
        const token = Cookies.get("token");
        const response = await axios.patch(
          `${BaseUrl}clinic/dateslot/${slotId}/`,
          {
            is_active: !isActive,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        getData(name.current);
        handleUpdatedData(selectedDate.fullDate);
        Swal.fire("Updated!", "Status has Changed Successfully.", "success");
      } catch (error) {
        Swal.fire("Error!", `${error}`, "error");
      }
    }
  };

  const handleSubSlotDelete = async (id) => {
    const token = Cookies.get("token");
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0324fc",
      cancelButtonColor: "#fc0303",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BaseUrl}clinic/datesubslot/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        getData(name.current);
      } catch (error) {
        console.error(error);
        Swal.fire("Error!", `${error}`, "error");
      }
    }
  };

  const handleUpdatedData = (day) => {
    const selectedDateString = day;
    setSlotsData(slots[selectedDateString].slots);
  };
  const handleSubSlotToggleActive = async (slotId, isActive) => {
    const token = Cookies.get("token");

    try {
      const response = await axios.patch(
        `${BaseUrl}clinic/datesubslot/${slotId}/`,
        {
          is_active: !isActive,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      Swal.fire("Updated!", "Status has Changed Successfully.", "success");
      getData(name.current);
    } catch (error) {
      Swal.fire("Error!", `${error}`, "error");
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
            Manage Slots
          </Link>
        </Breadcrumbs>
      </div>
      <div className="w-full min-h-screen bg-[#F2F2F2]  py-4 mt-3  ">
        <div className="flex items-center justify-between pb-4 px-2 sm:!px-4">
          <text className="font-nunito-sans text-[22px] sm:text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Manage Slots
          </text>
          {subRoles.includes(9) && (
            <Link
              to={
                isVendor
                  ? "/vendor/manageslots/settings"
                  : "/doctor/manageslots/settings"
              }
              className="font-nunito-sans text-14px font-bold leading-27px text-[#ffffff] bg-[#4379EE] py-2 px-2 sm:!px-4 rounded-lg text-center"
            >
              Slot Settings
            </Link>
          )}
        </div>
        <div className="flex flex-col xl:flex-row w-full h-full bg-white">
          <div className=" mt-4 grid grid-cols-7 w-full ">
            <div className=" p-2 col-span-7">
              <div className="flex justify-between mb-4">
                <Tooltip title="Previous Month">
                  <button
                    className="bg-blue-500 text-xs lg:text-base text-white px-2 sm:!px-4 py-2 rounded"
                    onClick={() => {
                      setCurrentMonth(currentMonth.subtract(1, "month"));
                    }}
                  >
                    <FaArrowLeft />
                  </button>
                </Tooltip>
                <h2 className="flex items-center justify-center text-base text-center sm:text-lg font-bold">
                  {currentMonth.format("MMMM ")} {currentMonth.format("YYYY")}
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

                  const bookingInfo = getBookingInfo(day);
                  const isBooked = bookingInfo.total > 0;
                  const isHolidayDate = isHoliday(day);
                  const percentageBooked = isBooked
                    ? ((bookingInfo.booked / bookingInfo.total) * 100).toFixed(
                        2
                      )
                    : 0;
                  const progressColor = getProgressColor(percentageBooked);
                  const progresscolor = getprogresscolor(percentageBooked,isBooked);

                  return (
                    <div
                      key={index}
                      className={`relative p-2 border text-center cursor-pointer ${
                        isHolidayDate
                          ? "bg-gray-300 !cursor-not-allowed"
                          : progresscolor
                      } ${
                        selectedDate &&
                        selectedDate.fullDate === day.format("YYYY-MM-DD")
                          ? "border-3 !border-blue-500"
                          : ""
                      }`}
                      onClick={() => handleDateClick(day)}
                      onMouseEnter={() => handleMouseEnter(day)}
                      onMouseLeave={handleMouseLeave}
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

                            <div className="hidden sm:flex relative mt-2 w-full h-1 bg-white rounded-full">
                              <div
                                className={`h-[100%] ${progressColor} rounded-full`}
                                style={{ width: `${percentageBooked}%` }}
                              ></div>
                            </div>
                            <div className="hidden lg:flex w-full text-center text-[10px] mt-2 font-normal text-gray-600">
                              {percentageBooked > 0
                                ? `${percentageBooked}% Booked`
                                : ""}
                            </div>
                          </div>
                        </Tooltip>
                      ) : (
                        <Tooltip
                          title={
                            <div className="p-2 mt-3">
                              <h3 className="text-lg font-bold">Date Info</h3>
                              <p>{`Full Date: ${day.format("YYYY-MM-DD")}`}</p>
                              <p>{`Day: ${day.format("dddd")}`}</p>
                              {holidays.find(
                                (holiday) =>
                                  holiday.date === day.format("YYYY-MM-DD")
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
                  <div className="border border-gray-300 bg-gray-300 text-[12px] text-center w-full h-16 flex justify-center items-center">
                    Holiday
                  </div>
                  <div className="border border-3 !border-blue-600 text-[12px] text-center w-full h-16 flex justify-center items-center">
                    Selected Slot
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col py-6 mt-2 px-6 w-full xl:w-4/5">
            <div className="mb-4">
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
                    doctorlist.length > 0 &&
                    doctorlist.some((doctor) => doctor.username === username)
                      ? true
                      : false
                  }
                  autoComplete="doctor"
                  className={`block w-full h-9 bg-white rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600  sm:text-sm sm:leading-6 ${
                    doctorlist.length > 0 &&
                    doctorlist.some((doctor) => doctor.username === username)
                      ? "cursor-not-allowed"
                      : ""
                  }`}
                >
                  {" "}
                  <option value="">Select a doctor</option>
                  {doctorlist.length > 0 &&
                    doctorlist.map((doctor) => (
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
            <div className=" col-span-4">
              {selectedDate.fullDate ? (
                <div>
                  <h3 className="text-3xl font-bold">Selected Date</h3>
                  <div className="py-2 text-sm">
                    <p>{`Date: ${selectedDate.fullDate}`}</p>
                    <p>{`Day: ${selectedDate.dayOfWeek}`}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 font-bold text-lg">
                  {!selectedDoctor
                    ? "**Please select a Doctor and Date to see details"
                    : "**Please select a Date to see deatils"}
                </p>
              )}
            </div>
            <div className="">
              {selectedDate.fullDate && (
                <div className="flex flex-col">
                  {slotsData && slotsData.length > 0 ? (
                    slotsData.map((slot, index) => (
                      <div
                        key={slot.id}
                        className="rounded-lg border border-gray-300 p-3 mb-3"
                      >
                        <div className="flex w-full items-center justify-between">
                          <text className="text-[32px] font-bold">
                            Slot {slot.slot_number}:
                          </text>
                          <div className="flex gap-4">
                            {subRoles.includes(3) && (
                              <Tooltip title="Delete">
                                <button
                                  onClick={() =>
                                    handleSlotDelete(
                                      slot.id,
                                      slot.booked_sub_slot_count
                                    )
                                  }
                                  className="flex items-center justify-center rounded-full text-white text-sm font-bold"
                                >
                                  <MdDelete className="text-black text-[25px] text-[#D30E0E]" />
                                </button>
                              </Tooltip>
                            )}
                            {subRoles.includes(7) &&
                              (slot.is_active ? (
                                <Tooltip title="Deactivate">
                                  <button
                                    onClick={() =>
                                      handleToggleActive(
                                        slot.id,
                                        slot.is_active,
                                        slot.booked_sub_slot_count
                                      )
                                    }
                                    className="flex items-center justify-center rounded-full"
                                  >
                                    <FaCheck className="text-green-500 text-[20px] text-[#D30E0E]" />
                                  </button>
                                </Tooltip>
                              ) : (
                                <Tooltip title="Activate">
                                  <button
                                    onClick={() =>
                                      handleToggleActive(
                                        slot.id,
                                        slot.is_active,
                                        slot.booked_sub_slot_count
                                      )
                                    }
                                    className="flex items-center justify-center rounded-full"
                                  >
                                    <FaBan className="text-red text-[20px] text-[#D30E0E]" />
                                  </button>
                                </Tooltip>
                              ))}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-6 py-4">
                          <div className="flex items-center w-full">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <TimePicker
                                label="Start Time"
                                value={
                                  slot.start_time &&
                                  dayjs(slot.start_time, "HH:mm:ss")
                                }
                                ampm={false}
                                onChange={(newValue) =>
                                  handleTimeChange(
                                    index,
                                    "start_time",
                                    newValue
                                  )
                                }
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                                sx={{ width: "100%" }}
                              />
                            </LocalizationProvider>
                          </div>
                          <div className="flex items-center w-full">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <TimePicker
                                label="End Time"
                                value={
                                  slot.end_time &&
                                  dayjs(slot.end_time, "HH:mm:ss")
                                }
                                ampm={false}
                                onChange={(newValue) => {
                                  if (newValue) {
                                    handleTimeChange(
                                      index,
                                      "end_time",
                                      newValue
                                    );
                                  } else {
                                    handleTimeChange(index, "end_time", null);
                                  }
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                                sx={{ width: "100%" }}
                              />
                            </LocalizationProvider>
                          </div>
                          <div className="flex items-center w-full">
                            <FormControl sx={{ width: "100%" }} size="medium">
                              <InputLabel id={`duration-select-${slot.id}`}>
                                Duration
                              </InputLabel>
                              <Select
                                labelId={`duration-select-${slot.id}`}
                                id={`duration-select-${slot.id}`}
                                value={slot.duration}
                                label="Duration"
                                onChange={(event) =>
                                  handleDurationChange(
                                    event,
                                    index,
                                    selectedDate
                                  )
                                }
                              >
                                <MenuItem value={10}>10 mins</MenuItem>
                                <MenuItem value={15}>15 mins</MenuItem>
                                <MenuItem value={20}>20 mins</MenuItem>
                                <MenuItem value={30}>30 mins</MenuItem>
                              </Select>
                            </FormControl>
                          </div>
                        </div>

                        <div className="rounded-lg py-4 px-3 border border-gray-300">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {slot.sub_slots.map((subSlot) => (
                              <div
                                key={subSlot.id}
                                className={`relative rounded-lg border border-gray-300 py-2.5 text-[10px] flex justify-center items-center 
                                ${
                                  subSlot.is_booked
                                    ? "bg-red-500 text-white font-bold"
                                    : subSlot.is_active
                                    ? "bg-blue-500 text-white font-bold"
                                    : "bg-gray-400 text-gray-700 font-bold"
                                }`}
                                onMouseEnter={() =>
                                  handleMouseEnterr(subSlot.id)
                                }
                                onMouseLeave={handleMouseLeavee}
                              >
                                {`${formatTime(
                                  subSlot.start_time
                                )} - ${formatTime(subSlot.end_time)}`}

                                {hoveredSlot === subSlot.id && (
                                  <div
                                    className="absolute top-full left-0  bg-transparent py-1 rounded-lg"
                                    style={{ zIndex: 10 }}
                                  >
                                    {subSlot.is_booked ? (
                                      <div className="flex gap-2">
                                        {subRoles.includes(4) && (
                                          <button
                                            className="rounded-lg bg-blue-500 text-white border !border-blue-500 px-3 py-1"
                                            onClick={() =>
                                              handleOpenModal(subSlot)
                                            }
                                          >
                                            View
                                          </button>
                                        )}
                                        {subRoles.includes(2) && (
                                          <button
                                            className="rounded-lg text-white bg-gray-500 border !border-gray-500 px-3 py-1"
                                            onClick={() =>
                                              handleEditClick(subSlot)
                                            }
                                          >
                                            Edit
                                          </button>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="flex gap-2">
                                        {subRoles.includes(7) &&
                                          (subSlot.is_active ? (
                                            <button
                                              className="rounded-lg text-white bg-purple-500 border !border-purple-500 px-3 py-1"
                                              onClick={() =>
                                                handleSubSlotToggleActive(
                                                  subSlot.id,
                                                  subSlot.is_active
                                                )
                                              }
                                            >
                                              Disable
                                            </button>
                                          ) : (
                                            <button
                                              className="rounded-lg text-white bg-green-500 border !border-green-500 px-3 py-1"
                                              onClick={() =>
                                                handleSubSlotToggleActive(
                                                  subSlot.id,
                                                  subSlot.is_active
                                                )
                                              }
                                            >
                                              Enable
                                            </button>
                                          ))}
                                        {subRoles.includes(3) && (
                                          <button
                                            className="rounded-lg text-white bg-red-500 border !border-red-500 px-3 py-1"
                                            onClick={() =>
                                              handleSubSlotDelete(
                                                subSlot.id,
                                                slot.booked_sub_slot_count
                                              )
                                            }
                                          >
                                            Delete
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-end gap-6 sm:gap-8 mt-3">
                          <div className="flex items-center gap-4 p-1">
                            {subRoles.includes(2) && (
                              <button
                                onClick={() =>
                                  handleSlotUpdate(
                                    slot.id,
                                    slot.booked_sub_slot_count,
                                    slot.start_time,
                                    slot.end_time,
                                    slot.duration
                                  )
                                }
                                className="px-1 py-2 bg-[#6F3AC7] w-[80px] sm:w-[90px] text-white text-base sm:text-sm font-bold rounded-lg"
                              >
                                Update
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xl font-bold text-gray-500">
                      No slots available for the selected date.
                    </div>
                  )}
                </div>
              )}

              {/* Other JSX Elements Below... */}
              {selectedDate.fullDate && (
                <>
                  <div className="flex items-center justify-center sm:justify-end w-full mt-6">
                    {subRoles.includes(1) && (
                      <FormAddDialog
                        dateName={selectedDate.fullDate}
                        username={name.current}
                      />
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-6 mb-4 ml-3">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-red-500 mr-2 rounded-full"></div>
                      <p className="text-md"> Booked</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-blue-500 mr-2 font-bold rounded-full"></div>
                      <p className="text-md"> Available</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-gray-500 mr-2 font-bold rounded-full"></div>
                      <p className="text-md"> Disabled</p>
                    </div>
                  </div>
                </>
              )}

              {/* <div className="flex items-center justify-center md:justify-start gap-8 w-full mt-10">
              <button className="px-4 py-2 bg-[#6F3AC7] text-white font-bold rounded-lg">
                Update
              </button>
              <button className="px-4 py-2 bg-[#D30E0E] text-white font-bold rounded-lg">
                Delete All
              </button>
            </div> */}
            </div>
          </div>
        </div>
      </div>
      {selectedAppointment && (
        <AppointmentModal
          open={openModal}
          onClose={handleCloseModal}
          service={selectedAppointment}
        />
      )}
    </div>
  );
};

export default ManageSlots;
