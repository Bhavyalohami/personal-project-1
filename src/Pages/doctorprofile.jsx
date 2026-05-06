import { useCallback, useEffect, useMemo, useState } from "react";
import Rating from "@mui/material/Rating";
import { useNavigate, useParams } from "react-router-dom";
import BaseUrl from "../Api/baseurl";
import dayjs from "dayjs";
import { format } from "date-fns";
import { BsFillLightningChargeFill } from "react-icons/bs";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import parse from "html-react-parser";
import LoaderH from "../Component/Loader/loader";
import { requestChatWithDoctor } from "../firebase/hmsService";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {
  FaCalendarCheck,
  FaComments,
  FaHeartPulse,
  FaLocationDot,
  FaShieldHeart,
  FaStar,
  FaUserDoctor,
} from "react-icons/fa6";

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const legendItems = [
  ["Available", "bg-emerald-100 border-emerald-300"],
  ["Limited", "bg-amber-100 border-amber-300"],
  ["Unavailable", "bg-rose-100 border-rose-300"],
  ["Holiday", "bg-slate-200 border-slate-300"],
  ["Selected", "bg-[#0D9488] border-[#0D9488]"],
];

const DoctorProfile = () => {
  const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const today = format(new Date(), "yyyy-MM-dd");
  const navigate = useNavigate();
  const { id } = useParams();
  const token = Cookies.get("patient_token");
  const user = Cookies.get("patient_username") || Cookies.get("username");

  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [bookings, setBookings] = useState({});
  const [holidays, setHolidays] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reviewData, setReviewData] = useState([]);
  const [slots, setSlots] = useState({});
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
    yoe: "",
    amount: "",
  });
  const [overallRating, setOverallRating] = useState(0);
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
  });
  const [feedbackData, setFeedbackData] = useState({
    patient: user,
    doctor: id,
    review: "",
    rating: "",
  });

  const doctorName = `${profileData.fname || ""} ${profileData.lname || ""}`.trim();
  const achievementsHtml =
    typeof profileData.achievements === "string" &&
    profileData.achievements.trim() !== "<p><br></p>"
      ? profileData.achievements
      : "";

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

  const visibleSubSlots = useMemo(
    () =>
      subSlots.filter((item) => {
        if (!item.is_active) return false;
        if (selectedDate === today && item.start_time <= currentTime) return false;
        return true;
      }),
    [currentTime, selectedDate, subSlots, today]
  );

  const fetchMonthlySlots = useCallback(
    async (username) => {
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
    },
    [currentMonth]
  );

  const fetchHolidays = useCallback(async (username) => {
    if (!username) return;

    try {
      const response = await axios.get(`${BaseUrl}clinic/manageholiday/${username}`);
      setHolidays(
        (response.data || []).map((item) => ({
          date: item.date,
          comment: item.comment,
        }))
      );
    } catch (error) {
      console.error("Error fetching holiday data:", error);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BaseUrl}clinic/feedback-list/${id}`);
        const doctor = response.data.doctor || {};
        setProfileData(doctor);
        setReviewData(response.data.feedback || []);
        setOverallRating(Number(response.data.overall_rating || doctor.average_rating || 0));
        setFormData({
          location: doctor.location || "",
          department: doctor.department || "",
          doctor: `${doctor.fname || ""} ${doctor.lname || ""}`.trim(),
          username: doctor.username || "",
          amount: doctor.amount || "",
          payment: 0,
          problem: "",
          date: "",
          time: "",
          sub_slot: "",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  useEffect(() => {
    if (profileData.username) {
      fetchMonthlySlots(profileData.username);
      fetchHolidays(profileData.username);
    }
  }, [fetchHolidays, fetchMonthlySlots, profileData.username]);

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

  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}`);
    return format(date, "HH:mm");
  };

  const handleTimeClick = (slotId, start, end) => {
    setSelectedTime(slotId);
    const timeValue = `${formatTime(start)} - ${formatTime(end)}`;
    setFormData((prev) => ({ ...prev, time: timeValue, sub_slot: slotId }));
    setFormErrors((prevErrors) => ({ ...prevErrors, time: "" }));
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

  const validateForm = () => {
    const errors = {
      date: "",
      time: "",
    };
    let isValid = true;

    if (!formData.date) {
      errors.date = "Date is required";
      isValid = false;
    }
    if (!formData.time) {
      errors.time = "Time is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleRedirect = async () => {
    const result = await Swal.fire({
      title: "You need to log in first to book instantly.",
      icon: "warning",
      confirmButtonText: "Log in",
      cancelButtonText: "Stay here",
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: "#0D9488",
    });

    if (result.isConfirmed) {
      navigate("/user/login");
    }
  };

  const handleInstantBooking = async () => {
    if (!validateForm()) return;

    if (!token) {
      handleRedirect();
      return;
    }

    if (!user) {
      Swal.fire({
        title: "Profile missing",
        text: "Please log in again before booking.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await axios.get(`${BaseUrl}clinic/patient-profile/${user}/`);
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
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Could not prepare booking",
        text: "Please try again.",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  const submitFeedback = async () => {
    if (!feedbackData.rating || !feedbackData.review.trim()) {
      Swal.fire({
        title: "Add rating and review",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const confirmationResult = await Swal.fire({
        title: "Submit review?",
        text: "Do you want to submit this review?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (!confirmationResult.isConfirmed) return;

      setLoading(true);
      const response = await axios.post(`${BaseUrl}clinic/feedback`, feedbackData, {
        headers: {
          ...(token ? { Authorization: `Token ${token}` } : {}),
          "Content-Type": "application/json",
        },
      });

      setReviewData((prev) => [
        ...prev,
        {
          ...response.data,
          patient: {
            name: "You",
            image: "/brand/patient-avatar-teal.png",
          },
        },
      ]);
      setFeedbackData({
        patient: user,
        doctor: id,
        rating: "",
        review: "",
      });

      Swal.fire({
        title: "Submitted Successfully",
        text: "Review submitted successfully.",
        icon: "success",
        confirmButtonText: "Okay",
      });
    } catch (error) {
      Swal.fire({
        title: "Can't post a review",
        text: "You cannot leave a review for this doctor unless you have a completed booking.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestChat = async () => {
    if (!token) {
      navigate("/user/login");
      return;
    }

    const result = await Swal.fire({
      title: "Request chat with doctor",
      input: "textarea",
      inputLabel: "Write a short message for the doctor",
      inputPlaceholder: "Hello doctor, I would like to ask about...",
      inputValue: `Hello ${doctorName || "doctor"}, I would like to chat about my care.`,
      showCancelButton: true,
      confirmButtonText: "Send request",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#0D9488",
    });

    if (!result.isConfirmed) return;

    try {
      await requestChatWithDoctor({
        hospitalId: profileData.hospitalId || "default-hospital",
        doctorUid: profileData.uid || profileData.doctorUid || profileData.username || id,
        doctorId: id,
        doctorUsername: profileData.username || id,
        doctorName: doctorName || profileData.name || "Doctor",
        message: result.value,
      });
      const openResult = await Swal.fire({
        title: "Request sent",
        text: "The doctor can accept your chat request from their panel.",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Open messages",
        cancelButtonText: "Stay here",
        confirmButtonColor: "#0D9488",
      });
      if (openResult.isConfirmed) {
        navigate("/messages");
      }
    } catch (error) {
      Swal.fire("Chat request failed", error.message, "error");
    }
  };

  return (
    <>
      {loading ? (
        <LoaderH />
      ) : (
        <main className="overflow-hidden bg-[#ECFEFF] text-[#134E4A]">
          <section className="relative px-5 py-12 sm:px-8 lg:px-12">
            <div className="absolute inset-0 care-scan-grid opacity-40" aria-hidden="true" />
            <div className="relative mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-[#67E8F9]/50 bg-white/85 p-6 shadow-2xl shadow-teal-900/10 backdrop-blur lg:grid-cols-[0.82fr_1.18fr] lg:p-10">
              <div className="relative overflow-hidden rounded-[2rem] border border-[#67E8F9]/50 bg-[#134E4A] shadow-xl shadow-teal-900/10">
                <img
                  className="h-[500px] w-full object-cover"
                  src={profileData.image || "/brand/doctor-avatar-teal.png"}
                  alt={doctorName || "Doctor profile"}
                />
                <div className="absolute left-5 top-5 rounded-full bg-[#F59E0B] px-4 py-2 text-xs font-black text-[#134E4A]">
                  ${profileData.amount || 0}
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <p className="inline-flex w-max items-center gap-2 rounded-full border border-[#67E8F9]/60 bg-[#ECFEFF] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
                  <FaUserDoctor />
                  Specialist profile
                </p>
                <h1 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">
                  {doctorName || "CareBridge Doctor"}
                </h1>
                <p className="mt-3 text-xl font-black text-[#0D9488]">
                  {profileData.department || "Specialist"}
                </p>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[#134E4A]/75">
                  {profileData.introduction && profileData.introduction !== "N/A"
                    ? profileData.introduction
                    : "Select a live appointment slot and continue to a secure payment review."}
                </p>

                <div className="mt-7 flex flex-wrap gap-3 text-sm font-black">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#ECFEFF] px-4 py-2">
                    <FaLocationDot className="text-[#0D9488]" />
                    {profileData.location || "Clinic location"}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#ECFEFF] px-4 py-2">
                    <FaHeartPulse className="text-[#0D9488]" />
                    {profileData.yoe || 0} years experience
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#ECFEFF] px-4 py-2">
                    <FaStar className="text-[#F59E0B]" />
                    {overallRating || 0} rating
                  </span>
                </div>

                <div className="mt-7">
                  <Rating
                    name="doctor-profile-rating"
                    value={overallRating}
                    precision={0.5}
                    readOnly
                    size="large"
                  />
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleRequestChat}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0D9488] px-6 text-sm font-black text-white shadow-xl shadow-teal-900/15 transition hover:bg-[#0F766E]"
                  >
                    <FaComments />
                    Request Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const target = document.querySelector("#book-instantly");
                      target?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#F59E0B] px-6 text-sm font-black text-[#134E4A] shadow-xl shadow-amber-900/10 transition hover:bg-[#67E8F9]"
                  >
                    <FaCalendarCheck />
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section id="book-instantly" className="px-5 pb-16 sm:px-8 lg:px-12">
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.42fr_0.58fr]">
              <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-6 shadow-xl shadow-teal-900/10">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                  Achievements
                </p>
                <h2 className="mt-2 text-3xl font-black">Care credentials</h2>
                <div className="mt-5 space-y-4 text-sm leading-7 text-[#134E4A]/75 [&_p]:leading-7">
                  {achievementsHtml ? (
                    parse(achievementsHtml)
                  ) : (
                    <p>Verified CareBridge specialist with clinic-ready appointment access.</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  [<FaShieldHeart />, "Verified profile", "Clinic-managed specialist data"],
                  [<FaCalendarCheck />, "Live slots", "Monthly availability and holidays"],
                  [<FaHeartPulse />, "Patient reviews", `${reviewData.length} active reviews`],
                ].map(([icon, title, text]) => (
                  <article
                    key={title}
                    className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-5 shadow-xl shadow-teal-900/10"
                  >
                    <div className="text-2xl text-[#0D9488]">{icon}</div>
                    <h3 className="mt-4 text-lg font-black">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#134E4A]/65">{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="px-5 pb-16 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                    Book instantly
                  </p>
                  <h2 className="mt-2 text-3xl font-black sm:text-5xl">
                    Select a live appointment slot.
                  </h2>
                </div>
                <p className="max-w-lg text-sm leading-7 text-[#134E4A]/70">
                  Previous dates and clinic holidays are locked automatically.
                </p>
              </div>

              <div className="grid gap-6 xl:grid-cols-[0.66fr_0.34fr]">
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
                      if (!day) return <div key={index} className="min-h-16 rounded-xl" />;

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
                          aria-label={`${day.format("DD MMM YYYY")} appointment date`}
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
                  {formErrors.date && (
                    <p className="mt-3 text-sm font-bold text-rose-500">
                      {formErrors.date}
                    </p>
                  )}
                </div>

                <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-5 shadow-xl shadow-teal-900/10 sm:p-6">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                    Time slots
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    {selectedDate ? dayjs(selectedDate).format("DD MMMM YYYY") : "Select a date"}
                  </h2>

                  <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-2">
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

                  <button
                    type="button"
                    onClick={handleInstantBooking}
                    className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#F59E0B] px-7 text-sm font-black text-[#134E4A] shadow-xl shadow-amber-900/10 transition hover:bg-[#67E8F9]"
                  >
                    Book Instantly
                    <BsFillLightningChargeFill />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="px-5 pb-20 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                    Patient signal
                  </p>
                  <h2 className="mt-2 text-3xl font-black sm:text-5xl">
                    What patients say.
                  </h2>
                </div>
              </div>

              {reviewData.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {reviewData
                    .filter((item) => item.is_active === true)
                    .map((item, index) => (
                      <article
                        key={item.id || index}
                        className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-5 shadow-xl shadow-teal-900/10"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              className="h-12 w-12 rounded-2xl object-cover"
                              src={item.patient?.image || "/brand/patient-avatar-teal.png"}
                              alt={item.patient?.name || "Patient"}
                            />
                            <div>
                              <p className="font-black">
                                {(item.patient?.name || "Patient").split(" ")[0]}
                              </p>
                              <p className="text-xs font-bold text-[#134E4A]/55">
                                Verified patient
                              </p>
                            </div>
                          </div>
                          <Rating
                            name={`review-rating-${item.id || index}`}
                            value={Number(item.rating || 0)}
                            precision={0.5}
                            size="small"
                            readOnly
                          />
                        </div>
                        <p className="mt-5 text-sm leading-7 text-[#134E4A]/70">
                          {item.review}
                        </p>
                      </article>
                    ))}
                </div>
              ) : (
                <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-10 text-center shadow-xl shadow-teal-900/10">
                  <FaHeartPulse className="mx-auto text-4xl text-[#0D9488]" />
                  <h3 className="mt-4 text-2xl font-black">No reviews yet</h3>
                  <p className="mt-3 text-sm text-[#134E4A]/70">
                    This specialist is ready for the first CareBridge review.
                  </p>
                </div>
              )}

              {token && (
                <div className="mt-8 rounded-[2rem] border border-[#67E8F9]/50 bg-white p-6 shadow-xl shadow-teal-900/10">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                    Give feedback
                  </p>
                  <h3 className="mt-2 text-2xl font-black">Share your visit experience</h3>
                  <div className="mt-5">
                    <Rating
                      name="feedback-rating"
                      value={Number(feedbackData.rating || 0)}
                      precision={0.5}
                      onChange={(event, newValue) => {
                        setFeedbackData({
                          ...feedbackData,
                          rating: newValue,
                        });
                      }}
                      size="large"
                    />
                  </div>
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
                    placeholder="Add a review to your rating."
                    className="mt-4 min-h-32 w-full resize-none rounded-2xl border border-[#67E8F9]/60 bg-[#ECFEFF]/70 px-4 py-4 text-sm font-semibold leading-7 outline-none transition focus:border-[#0D9488] focus:bg-white focus:ring-4 focus:ring-[#67E8F9]/30"
                  />
                  <button
                    type="button"
                    onClick={submitFeedback}
                    className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-[#0D9488] px-7 text-sm font-black text-white transition hover:bg-[#0F766E]"
                  >
                    Submit Review
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>
      )}
    </>
  );
};

export default DoctorProfile;
