import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import Cookies from "js-cookie";
import BaseUrl from "../Api/baseurl";
import LoaderH from "../Component/Loader/loader";
import { format } from "date-fns";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {
  FaCalendarCheck,
  FaHeartPulse,
  FaLocationDot,
  FaShieldHeart,
  FaUserDoctor,
} from "react-icons/fa6";

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const bookingSteps = [
  ["01", "Details saved"],
  ["02", "Choose specialist"],
  ["03", "Pick date and time"],
  ["04", "Review payment"],
];

const legendItems = [
  ["Available", "bg-emerald-100 border-emerald-300"],
  ["Limited", "bg-amber-100 border-amber-300"],
  ["Unavailable", "bg-rose-100 border-rose-300"],
  ["Holiday", "bg-slate-200 border-slate-300"],
  ["Selected", "bg-[#0D9488] border-[#0D9488]"],
];

const Booking = () => {
  const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const today = format(new Date(), "yyyy-MM-dd");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hospitalIdFromUrl = searchParams.get("hospitalId") || "";
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
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
    hospitalId: hospitalIdFromUrl,
  });
  const [formErrors, setFormErrors] = useState({
    date: "",
    time: "",
    location: "",
    department: "",
    doctor: "",
    problem: "",
  });
  const [loading] = useState(false);
  const [slots, setSlots] = useState({});
  const [error, setError] = useState(null);
  const [location, setLocation] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [bookings, setBookings] = useState({});
  const [holidays, setHolidays] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [subSlots, setSubSlots] = useState([]);

  const generateDaysInMonth = (month) => {
    const startOfMonth = month.startOf("month");
    const endOfMonth = month.endOf("month");
    let startDayOfWeek = startOfMonth.day();
    startDayOfWeek = startDayOfWeek === 0 ? 7 : startDayOfWeek;

    const days = [];
    let currentDay = startOfMonth;

    for (let i = 1; i < startDayOfWeek; i += 1) {
      days.push(null);
    }

    while (currentDay.isBefore(endOfMonth.add(1, "day"))) {
      days.push(currentDay);
      currentDay = currentDay.add(1, "day");
    }

    return days.slice(0, endOfMonth.date() + startDayOfWeek - 1);
  };

  const daysInMonth = generateDaysInMonth(currentMonth);

  const activeLocations = Array.isArray(location)
    ? location.filter((item) => item.status === 1)
    : [];

  const departmentOptions = Array.from(
    new Map(
      departments
        .filter((item) => item.location === formData.location)
        .map((item) => [item.department, item])
    ).values()
  );

  const doctorOptions = Array.from(
    new Map(
      departments
        .filter(
          (item) =>
            item.location === formData.location &&
            item.department === formData.department &&
            item.status === 1
        )
        .map((item) => [item.username, item])
    ).values()
  );

  const selectedDoctor = doctorOptions.find(
    (item) => item.username === formData.username
  );

  const visibleSubSlots = subSlots.filter((item) => {
    if (!item.is_active) return false;
    if (selectedDate === today && item.start_time <= currentTime) return false;
    return true;
  });

  const selectedSummary = [
    ["Location", formData.location || "Not selected"],
    ["Department", formData.department || "Not selected"],
    ["Doctor", formData.doctor || "Not selected"],
    ["Date", formData.date ? dayjs(formData.date).format("DD MMM YYYY") : "Not selected"],
    ["Time", formData.time || "Not selected"],
  ];

  const isHoliday = (date) =>
    date &&
    holidays.some((holiday) => holiday.date === date.format("YYYY-MM-DD"));

  const getData = useCallback(async (username) => {
    if (!username) return;

    try {
      const year = currentMonth.year();
      const month = currentMonth.month() + 1;
      const response = await axios.get(`${BaseUrl}clinic/monthly/${year}/${month}/`, {
        params: { username },
      });
      const monthlyData = response.data || {};
      const updatedBookings = {};

      Object.keys(monthlyData).forEach((date) => {
        const total = monthlyData[date].total_count;
        const booked = monthlyData[date].total_booked;
        const allSubSlots = (monthlyData[date].slots || []).flatMap(
          (slot) => slot.sub_slots || []
        );
        updatedBookings[date] = { total, booked, subSlots: allSubSlots };
      });

      setSlots(monthlyData);
      setBookings(updatedBookings);
    } catch (error) {
      console.error("Error fetching slot data:", error);
    }
  }, [currentMonth]);

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

  const getProgressColor = (percentage) => {
    if (percentage === 100) return "bg-rose-500";
    if (percentage >= 75) return "bg-amber-500";
    if (percentage > 0) return "bg-emerald-500";
    return "bg-[#67E8F9]";
  };

  const getProgressBackground = (percentage, isBooked) => {
    if (percentage === 100) return "bg-rose-100 border-rose-200";
    if (percentage >= 75) return "bg-amber-100 border-amber-200";
    if (percentage > 0 || isBooked) return "bg-emerald-100 border-emerald-200";
    return "bg-white border-[#67E8F9]/40";
  };

  useEffect(() => {
    const name = Cookies.get("name");
    if (!name) {
      navigate(
        hospitalIdFromUrl
          ? `/getdetails?hospitalId=${encodeURIComponent(hospitalIdFromUrl)}`
          : "/getdetails"
      );
      return;
    }

    const storedData = localStorage.getItem("formData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, [hospitalIdFromUrl, navigate]);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const response = await axios.get(`${BaseUrl}clinic/managelocation/`, {});
        setLocation(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError(error.message);
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    const getDepartments = async () => {
      try {
        const response = await axios.get(`${BaseUrl}clinic/staff-list/`, {});
        setDepartments(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError(error.message);
      }
    };

    if (formData.location) {
      getDepartments();
    } else {
      setDepartments([]);
    }
  }, [formData.location]);

  useEffect(() => {
    if (doctor) {
      getData(doctor);
    }
  }, [doctor, getData]);

  useEffect(() => {
    const fetchHolidays = async () => {
      if (!doctor) return;

      try {
        const response = await axios.get(`${BaseUrl}clinic/manageholiday/${doctor}`);
        setHolidays(
          (response.data || []).map((item) => ({
            date: item.date,
            comment: item.comment,
          }))
        );
      } catch (error) {
        console.error("Error fetching holiday data:", error);
      }
    };

    fetchHolidays();
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "location") {
      setFormData((prev) => ({
        ...prev,
        location: value,
        department: "",
        doctor: "",
        username: "",
        date: "",
        time: "",
        sub_slot: "",
        amount: "",
      }));
      setDoctor("");
      setSelectedDate("");
      setSelectedTime("");
      setSubSlots([]);
      setSlots({});
      setBookings({});
      return;
    }

    if (name === "department") {
      setFormData((prev) => ({
        ...prev,
        department: value,
        doctor: "",
        username: "",
        date: "",
        time: "",
        sub_slot: "",
        amount: "",
      }));
      setDoctor("");
      setSelectedDate("");
      setSelectedTime("");
      setSubSlots([]);
      setSlots({});
      setBookings({});
      return;
    }

    if (name === "doctor") {
      if (value) {
        handleDoctorChange(value);
      } else {
        setFormData((prev) => ({
          ...prev,
          doctor: "",
          username: "",
          date: "",
          time: "",
          sub_slot: "",
          amount: "",
        }));
        setDoctor("");
        setSelectedDate("");
        setSelectedTime("");
        setSubSlots([]);
        setSlots({});
        setBookings({});
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDoctorChange = (username) => {
    const doctorData = departments.find((item) => item.username === username);
    if (!doctorData) return;

    setFormData((prev) => ({
      ...prev,
      doctor: `${doctorData.fname} ${doctorData.lname}`,
      username: doctorData.username,
      amount: doctorData.amount,
      date: "",
      time: "",
      sub_slot: "",
    }));
    setDoctor(doctorData.username);
    setSelectedDate("");
    setSelectedTime("");
    setSubSlots([]);
    getData(doctorData.username);
  };

  const handleDateClick = (day) => {
    const dateString = day.format("YYYY-MM-DD");
    if (holidays.some((holiday) => holiday.date === dateString)) return;

    if (selectedDate === dateString) {
      setSelectedDate("");
      setSubSlots([]);
      setSelectedTime("");
      setFormData((prev) => ({ ...prev, date: "", time: "", sub_slot: "" }));
    } else {
      setSelectedDate(dateString);
      if (slots[dateString] && slots[dateString].slots) {
        const allSubSlots = slots[dateString].slots.flatMap(
          (slot) => slot.sub_slots || []
        );
        setSubSlots(allSubSlots);
      } else {
        setSubSlots([]);
      }
      setSelectedTime("");
      setFormData((prev) => ({ ...prev, date: dateString, time: "", sub_slot: "" }));
    }
    setFormErrors((prevErrors) => ({ ...prevErrors, date: "" }));
  };

  const handleTimeClick = (id, start, end) => {
    setSelectedTime(id);
    const timeValue = `${formatTime(start)} - ${formatTime(end)}`;
    setFormData((prev) => ({ ...prev, time: timeValue, sub_slot: id }));
    setFormErrors((prevErrors) => ({ ...prevErrors, time: "" }));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (formData.date === "") errors.date = "Please select a date";
    if (formData.time === "") errors.time = "Please select a time";
    if (!formData.location) errors.location = "Please select a location";
    if (!formData.department) errors.department = "Please select a department";
    if (!formData.doctor) errors.doctor = "Please select a doctor";
    if (!formData.problem) errors.problem = "Please describe your issue";

    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    const formDatatosend = {
      ...data,
      ...formData,
      hospitalId: formData.hospitalId || hospitalIdFromUrl || localStorage.getItem("activeHospitalId") || "",
      locationContext: {
        hospitalId: formData.hospitalId || hospitalIdFromUrl || localStorage.getItem("activeHospitalId") || "",
        selectedLocation: formData.location,
      },
      payment_status: 0,
    };

    navigate("/payment", {
      state: {
        appointmentDetails: formDatatosend,
      },
    });
  };

  return (
    <>
      {loading ? (
        <LoaderH />
      ) : (
        <main className="overflow-hidden bg-[#ECFEFF] text-[#134E4A]">
          <section className="relative px-5 py-12 sm:px-8 lg:px-12">
            <div className="absolute inset-0 care-scan-grid opacity-40" aria-hidden="true" />
            <div className="relative mx-auto grid max-w-7xl items-center gap-8 rounded-[2rem] border border-[#67E8F9]/50 bg-white/80 p-6 shadow-2xl shadow-teal-900/10 backdrop-blur lg:grid-cols-[1fr_0.8fr] lg:p-10">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-[#67E8F9]/60 bg-[#ECFEFF] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
                  <FaCalendarCheck />
                  Appointment console
                </p>
                <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
                  Build your clinic visit in a few precise steps.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[#134E4A]/75">
                  Select the clinic, department, specialist, and live slot. Your
                  saved patient details move forward to payment after review.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-4">
                  {bookingSteps.map(([number, label]) => (
                    <div
                      key={number}
                      className="rounded-2xl border border-[#67E8F9]/50 bg-white p-4 shadow-sm"
                    >
                      <p className="text-xs font-black text-[#0D9488]">{number}</p>
                      <p className="mt-2 text-sm font-black">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="care-float overflow-hidden rounded-[2rem] border border-[#67E8F9]/50 bg-[#134E4A] shadow-xl shadow-teal-900/10">
                  <img
                    src="/brand/consultation-care-teal.png"
                    alt="CareBridge appointment consultation"
                    className="h-[360px] w-full object-cover opacity-95"
                  />
                </div>
                <div className="absolute -bottom-5 left-5 right-5 rounded-3xl border border-white/60 bg-white/90 p-4 shadow-xl shadow-teal-900/10 backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
                    Patient
                  </p>
                  <p className="mt-1 text-xl font-black">
                    {data?.name || Cookies.get("name") || "Guest booking"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="px-5 pb-16 sm:px-8 lg:px-12">
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.68fr_0.32fr]">
              <form
                onSubmit={handlesubmit}
                className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-5 shadow-xl shadow-teal-900/10 sm:p-7"
              >
                <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                      Booking details
                    </p>
                    <h2 className="mt-2 text-3xl font-black">Choose your care path</h2>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFEFF] px-4 py-2 text-sm font-bold text-[#134E4A]">
                    <FaShieldHeart className="text-[#0D9488]" />
                    Firebase-ready flow
                  </div>
                </div>

                {error && (
                  <div className="mb-5 rounded-2xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-4 text-sm font-bold">
                    {error}
                  </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-black">
                      <FaLocationDot className="text-[#0D9488]" />
                      Location <span className="text-rose-500">*</span>
                    </span>
                    <select
                      name="location"
                      id="location"
                      value={formData.location}
                      className="h-14 w-full rounded-2xl border border-[#67E8F9]/60 bg-[#ECFEFF]/70 px-4 text-sm font-bold outline-none transition focus:border-[#0D9488] focus:bg-white focus:ring-4 focus:ring-[#67E8F9]/30"
                      onChange={handleChange}
                    >
                      <option value="">Select a location</option>
                      {activeLocations.length > 0 ? (
                        activeLocations.map((item) => (
                          <option key={item.id} value={item.name}>
                            {item.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading locations...</option>
                      )}
                    </select>
                    {formErrors.location && (
                      <span className="mt-2 block text-sm font-bold text-rose-500">
                        {formErrors.location}
                      </span>
                    )}
                  </label>

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-black">
                      <FaHeartPulse className="text-[#0D9488]" />
                      Department <span className="text-rose-500">*</span>
                    </span>
                    <select
                      name="department"
                      id="department"
                      value={formData.department}
                      className="h-14 w-full rounded-2xl border border-[#67E8F9]/60 bg-[#ECFEFF]/70 px-4 text-sm font-bold outline-none transition focus:border-[#0D9488] focus:bg-white focus:ring-4 focus:ring-[#67E8F9]/30"
                      onChange={handleChange}
                    >
                      <option value="">Select a department</option>
                      {departmentOptions.length > 0 ? (
                        departmentOptions.map((item) => (
                          <option key={item.id} value={item.department}>
                            {item.department}
                          </option>
                        ))
                      ) : (
                        <option disabled>Select location first</option>
                      )}
                    </select>
                    {formErrors.department && (
                      <span className="mt-2 block text-sm font-bold text-rose-500">
                        {formErrors.department}
                      </span>
                    )}
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-2 flex items-center gap-2 text-sm font-black">
                      <FaUserDoctor className="text-[#0D9488]" />
                      Doctor <span className="text-rose-500">*</span>
                    </span>
                    <select
                      name="doctor"
                      id="doctor"
                      value={formData.username}
                      className="h-14 w-full rounded-2xl border border-[#67E8F9]/60 bg-[#ECFEFF]/70 px-4 text-sm font-bold outline-none transition focus:border-[#0D9488] focus:bg-white focus:ring-4 focus:ring-[#67E8F9]/30"
                      onChange={handleChange}
                    >
                      <option value="">Select a doctor</option>
                      {doctorOptions.length > 0 ? (
                        doctorOptions.map((item) => (
                          <option key={item.id} value={item.username}>
                            {item.fname} {item.lname}
                          </option>
                        ))
                      ) : (
                        <option disabled>Select department first</option>
                      )}
                    </select>
                    {formErrors.doctor && (
                      <span className="mt-2 block text-sm font-bold text-rose-500">
                        {formErrors.doctor}
                      </span>
                    )}
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-black">
                      Describe your issue <span className="text-rose-500">*</span>
                    </span>
                    <textarea
                      name="problem"
                      value={formData.problem}
                      className="min-h-[150px] w-full resize-none rounded-2xl border border-[#67E8F9]/60 bg-[#ECFEFF]/70 px-4 py-4 text-sm font-semibold leading-7 outline-none transition focus:border-[#0D9488] focus:bg-white focus:ring-4 focus:ring-[#67E8F9]/30"
                      placeholder="Briefly describe symptoms, concerns, or the reason for this visit."
                      onChange={handleChange}
                    />
                    {formErrors.problem && (
                      <span className="mt-2 block text-sm font-bold text-rose-500">
                        {formErrors.problem}
                      </span>
                    )}
                  </label>
                </div>
              </form>

              <aside className="grid gap-6">
                <div className="overflow-hidden rounded-[2rem] border border-[#67E8F9]/50 bg-white shadow-xl shadow-teal-900/10">
                  {selectedDoctor ? (
                    <>
                      <div className="relative h-64 bg-[#134E4A]">
                        <img
                          src={selectedDoctor.image || "/brand/doctor-avatar-teal.png"}
                          alt={`${selectedDoctor.fname} ${selectedDoctor.lname}`}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute left-4 top-4 rounded-full bg-[#F59E0B] px-3 py-1 text-xs font-black text-[#134E4A]">
                          Selected
                        </span>
                      </div>
                      <div className="p-6">
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                          Specialist
                        </p>
                        <h3 className="mt-2 text-2xl font-black">
                          {selectedDoctor.fname} {selectedDoctor.lname}
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
                          <span className="rounded-full bg-[#ECFEFF] px-3 py-1">
                            {selectedDoctor.department}
                          </span>
                          <span className="rounded-full bg-[#ECFEFF] px-3 py-1">
                            {selectedDoctor.yoe || 0} years
                          </span>
                          <span className="rounded-full bg-[#F59E0B]/20 px-3 py-1">
                            ${selectedDoctor.amount || formData.amount || 0}
                          </span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-[#134E4A]/70">
                          {selectedDoctor.introduction ||
                            "Choose a live appointment slot with this specialist."}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="p-6">
                      <img
                        src="/brand/doctor-avatar-teal.png"
                        alt="Doctor avatar"
                        className="mx-auto h-28 w-28 rounded-3xl object-cover"
                      />
                      <h3 className="mt-5 text-2xl font-black">Doctor preview</h3>
                      <p className="mt-3 text-sm leading-7 text-[#134E4A]/70">
                        Select a location, department, and doctor to reveal the
                        live calendar and available appointment slots.
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-[#134E4A] p-6 text-white shadow-xl shadow-teal-900/10">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#67E8F9]">
                    Review
                  </p>
                  <div className="mt-5 space-y-3">
                    {selectedSummary.map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 text-sm"
                      >
                        <span className="text-cyan-50/65">{label}</span>
                        <span className="max-w-[55%] text-right font-black">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </section>

          {doctor && (
            <section className="px-5 pb-16 sm:px-8 lg:px-12">
              <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[0.66fr_0.34fr]">
                <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-4 shadow-xl shadow-teal-900/10 sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ECFEFF] text-[#0D9488] transition hover:bg-[#0D9488] hover:text-white"
                      onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
                      aria-label="Previous month"
                    >
                      <FaArrowLeft />
                    </button>
                    <div className="text-center">
                      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                        Calendar
                      </p>
                      <h2 className="text-2xl font-black">
                        {currentMonth.format("MMMM")} {currentMonth.year()}
                      </h2>
                    </div>
                    <button
                      type="button"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ECFEFF] text-[#0D9488] transition hover:bg-[#0D9488] hover:text-white"
                      onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
                      aria-label="Next month"
                    >
                      <FaArrowRight />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {dayNames.map((day) => (
                      <div
                        key={day}
                        className="rounded-xl bg-[#ECFEFF] p-2 text-center text-xs font-black uppercase tracking-wide text-[#0D9488]"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 grid grid-cols-7 gap-2">
                    {daysInMonth.map((day, index) => {
                      if (!day) {
                        return <div key={index} className="min-h-16 rounded-xl" />;
                      }

                      const pastDate = dayjs(day).isBefore(dayjs(), "day");
                      const bookingInfo = getBookingInfo(day);
                      const isBooked = bookingInfo.total > 0;
                      const isHolidayDate = isHoliday(day);
                      const percentageBooked = isBooked
                        ? Number(((bookingInfo.booked / bookingInfo.total) * 100).toFixed(2))
                        : 0;
                      const progressColor = getProgressColor(percentageBooked);
                      const progressBackground = getProgressBackground(
                        percentageBooked,
                        isBooked
                      );
                      const isSelected = selectedDate === day.format("YYYY-MM-DD");
                      const holidayComment =
                        holidays.find((holiday) => holiday.date === day.format("YYYY-MM-DD"))
                          ?.comment || "Holiday";

                      return (
                        <button
                          key={day.format("YYYY-MM-DD")}
                          type="button"
                          disabled={pastDate || isHolidayDate}
                          title={
                            isHolidayDate
                              ? holidayComment
                              : `${day.format("DD MMM YYYY")} - ${bookingInfo.booked}/${bookingInfo.total} booked`
                          }
                          className={`group min-h-16 rounded-2xl border p-2 text-left transition ${
                            isHolidayDate ? "bg-slate-200 border-slate-300" : progressBackground
                          } ${
                            isSelected
                              ? "bg-[#0D9488] !text-white ring-4 ring-[#67E8F9]/40"
                              : "text-[#134E4A] hover:-translate-y-0.5 hover:shadow-lg"
                          } ${
                            pastDate
                              ? "cursor-not-allowed opacity-45 hover:translate-y-0 hover:shadow-none"
                              : ""
                          }`}
                          onClick={() => handleDateClick(day)}
                        >
                          <span className="block text-base font-black">{day.format("D")}</span>
                          <span className="mt-1 hidden text-[10px] font-bold uppercase tracking-wide opacity-70 sm:block">
                            {isHolidayDate ? "Holiday" : `${bookingInfo.total || 0} slots`}
                          </span>
                          {!isHolidayDate && !pastDate && (
                            <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-white/70">
                              <span
                                className={`block h-full rounded-full ${progressColor}`}
                                style={{ width: `${Math.max(percentageBooked, isBooked ? 14 : 8)}%` }}
                              />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 grid gap-2 sm:grid-cols-5">
                    {legendItems.map(([label, color]) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 rounded-2xl bg-[#ECFEFF] px-3 py-2 text-xs font-black"
                      >
                        <span className={`h-3 w-3 rounded-full border ${color}`} />
                        {label}
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm font-bold text-[#134E4A]/65">
                    Previous dates and clinic holidays cannot be selected.
                  </p>
                  {formErrors.date && (
                    <p className="mt-2 text-sm font-bold text-rose-500">{formErrors.date}</p>
                  )}
                </div>

                <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-5 shadow-xl shadow-teal-900/10 sm:p-6">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                      Time slots
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      {selectedDate
                        ? dayjs(selectedDate).format("DD MMMM YYYY")
                        : "Select a date"}
                    </h2>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2">
                    {visibleSubSlots.length > 0 ? (
                      visibleSubSlots.map((item) => {
                        const isBooked = item.is_booked;
                        const isSelected = selectedTime === item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            disabled={isBooked}
                            className={`rounded-2xl border px-3 py-4 text-sm font-black transition ${
                              isBooked
                                ? "cursor-not-allowed border-slate-300 bg-slate-200 text-slate-500"
                                : isSelected
                                ? "border-[#0D9488] bg-[#0D9488] text-white shadow-lg shadow-teal-900/10"
                                : "border-[#67E8F9]/60 bg-[#ECFEFF] text-[#134E4A] hover:border-[#0D9488] hover:bg-white"
                            }`}
                            onClick={() =>
                              !isBooked &&
                              handleTimeClick(item.id, item.start_time, item.end_time)
                            }
                          >
                            {`${formatTime(item.start_time)} - ${formatTime(item.end_time)}`}
                          </button>
                        );
                      })
                    ) : (
                      <div className="col-span-full rounded-3xl border border-dashed border-[#67E8F9]/70 bg-[#ECFEFF]/70 p-8 text-center">
                        <FaCalendarCheck className="mx-auto text-3xl text-[#0D9488]" />
                        <p className="mt-3 text-sm font-black">
                          {selectedDate ? "No available slots for this date." : "Pick a date to view slots."}
                        </p>
                      </div>
                    )}
                  </div>

                  {formErrors.time && (
                    <p className="mt-4 text-sm font-bold text-rose-500">{formErrors.time}</p>
                  )}

                  <div className="mt-6 grid gap-3 text-sm font-bold text-[#134E4A]/75">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#ECFEFF] ring-2 ring-[#67E8F9]" />
                      Available slots
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-slate-300 ring-2 ring-slate-400" />
                      Already booked
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#0D9488] ring-2 ring-[#67E8F9]" />
                      Selected time
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="px-5 pb-20 sm:px-8 lg:px-12">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 rounded-[2rem] border border-[#67E8F9]/50 bg-white/90 p-4 shadow-xl shadow-teal-900/10 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                  Final check
                </p>
                <p className="mt-1 text-sm font-bold text-[#134E4A]/70">
                  Review your selected doctor, date, and time before payment.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#67E8F9]/70 px-6 text-sm font-black text-[#134E4A] transition hover:border-[#0D9488] hover:bg-[#ECFEFF]"
                  to="/"
                >
                  Back
                </Link>
                <button
                  type="button"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#F59E0B] px-7 text-sm font-black text-[#134E4A] shadow-xl shadow-amber-900/10 transition hover:bg-[#67E8F9]"
                  onClick={handlesubmit}
                >
                  Continue to Payment
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </section>
        </main>
      )}
    </>
  );
};

export default Booking;
