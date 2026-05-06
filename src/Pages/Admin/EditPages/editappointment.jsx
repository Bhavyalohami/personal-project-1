import React, { useEffect, useRef, useState } from "react";
import AdminSearch from "../../../Component/Admin/adminsearch";
import DoctorSearch from "../../../Component/Doctor/doctorsearch";
import VendorSearch from "../../../Component/Vendor/vendorsearch";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import BaseUrl from "../../../Api/baseurl";
import dayjs from "dayjs";
import { format } from "date-fns";
import LoaderH from "../../../Component/Loader/loader";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {
  appointmentBelongsToDoctor,
  getDoctorDisplayName,
  isDoctorPanelFromCookies,
} from "../../../utils/doctorPanelAccess";

const EditAppointment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setError] = useState("");
  const [location, setLocation] = useState("");
  const [departments, setDepartments] = useState([]);
  const [, setDoctor] = useState("");
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [subSlots, setSubSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState();
  const slotss = useRef({});
  const [currentMonth] = useState(dayjs());

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact: "",
    email: "",
    city: "",
    location: "",
    date: dayjs().format("YYYY-MM-DD"),
    time: "",
    gender: "",
    department: "",
    doctor: "",
    problem: "",
    username: "",
    sub_slot: "",
  });
  const [formErrors, setFormErrors] = useState({});
  // const [slots, setSlots] = useState({});
  useEffect(() => {
    if (id) {
      fetchAppointmentData(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (formData.location) {
      getDepartments(formData.location);
    } else {
      setDepartments([]);
    }
  }, [formData.location]);

  useEffect(() => {
    const superuser = Cookies.get("is_superuser") === "true";
    const staff = Cookies.get("is_staff") === "true";
    const vendor = Cookies.get("is_vendor") === "true";
    setIsSuperuser(superuser);
    setIsStaff(staff);
    setIsVendor(vendor);
    getLocation();
  }, []);
  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}`);
    return format(date, "HH:mm");
  };
  const fetchAppointmentData = async (appointmentId) => {
    const year = currentMonth.year();
    const month = currentMonth.month() + 1;
    try {
      const response = await axios.get(
        `${BaseUrl}clinic/bookings-list/${appointmentId}/`
      );
      const data = response.data;
      if (
        isDoctorPanelFromCookies() &&
        !appointmentBelongsToDoctor(data, Cookies.get("username"))
      ) {
        Swal.fire({
          icon: "warning",
          title: "Access restricted",
          text: "Doctors can only update their own appointments.",
        });
        navigate("/doctor/appointments", { replace: true });
        return;
      }
      const appointmentDoctorUsername = data.doctor_username || data.username || "";

      const response2 = await axios.get(
        `${BaseUrl}clinic/doctormonthlyslots/${appointmentDoctorUsername}/${year}/${month}/`
      );
      // setSlots(response2.data);
      slotss.current = response2.data;
      // console.log(slotss.current, "slots");
      if (slotss.current[data.date] && slotss.current[data.date].slots) {
        const availableSlots = slotss.current[data.date].slots;
        const allSubSlots = availableSlots.flatMap(
          (slot) => slot.sub_slots || []
        );
        setSubSlots(allSubSlots);
      } else {
        setSubSlots([]);
      }
      setFormData({
        name: data.name || "",
        age: data.age || "",
        contact: data.contact || "",
        email: data.email || "",
        city: data.city || "",
        location: data.location || "",
        date: data.date || "",
        time: data.time || "",
        gender: data.gender || "",
        department: data.department || "",
        doctor: data.doctor || "",
        problem: data.problem || "",
        username: appointmentDoctorUsername,
        sub_slot: data.sub_slot || "",
      });
      setDoctor(appointmentDoctorUsername);
      setSelectedTime(data.time || "");
      setSelectedSlot(data.sub_slot || "");
    } catch (error) {
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
      } else {
        Swal.fire({
          title: "Error!",
          text: `There was an issue fetching appointment data: ${error.message}`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contact") {
      const numericValue = value.replace(/\D/g, ""); 
      if (numericValue.length <= 10) {
        setFormData((prevData) => ({ ...prevData, [name]: numericValue }));
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    if (name === "doctor") {
      handleDoctorChange(value);
    }
  };

  const handleDoctorChange = (doctorFullName) => {
    if (isDoctorPanelFromCookies()) return;

    const doctorData = departments.find(
      (doctor) => `${doctor.fname} ${doctor.lname}` === doctorFullName
    );

    if (doctorData) {
      setFormData((prev) => ({
        ...prev,
        doctor: `${doctorData.fname} ${doctorData.lname}`,
        username: doctorData.username,
      }));
      setDoctor(doctorData.username);
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      "name",
      "age",
      "contact",
      "email",
      "city",
      "location",
      "department",
      "doctor",
      "date",
      "time",
      "gender",
      "problem",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        errors[field] = `Please enter the ${field}.`;
      }
    });

    if (formData.email && !isValidEmail(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Update it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      });
      if (result.isConfirmed) {
        try {
          setLoading(true);
          window.scrollTo(0, 0);
          const payload = isDoctorPanelFromCookies()
            ? {
                ...formData,
                username: Cookies.get("username"),
                doctor_username: Cookies.get("username"),
              }
            : formData;
          await axios.put(`${BaseUrl}clinic/bookings-list/${id}/`, payload, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          setLoading(false);
          if (isSuperuser) {
            navigate("/admin/appointments");
          } else if (isVendor) {
            navigate("/vendor/appointments");
          } else {
            navigate("/doctor/appointments");
          }
          Swal.fire({
            title: "Success!",
            text: "Appointment updated successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: `There was an issue updating the appointment: ${error.message}`,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    }
  };

  const getDepartments = async (location) => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get(`${BaseUrl}clinic/staff-list/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const staffList = Array.isArray(response.data) ? response.data : [];
      setDepartments(
        isDoctorPanelFromCookies()
          ? staffList.filter((doctor) => doctor.username === Cookies.get("username"))
          : staffList
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const getLocation = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get(`${BaseUrl}clinic/managelocation/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setLocation(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDateChange = (e) => {
    const formattedDate = e.target.value;
    if (slotss.current[formattedDate] && slotss.current[formattedDate].slots) {
      const availableSlots = slotss.current[formattedDate].slots;
      const allSubSlots = availableSlots.flatMap(
        (slot) => slot.sub_slots || []
      );
      setSubSlots(allSubSlots);
    } else {
      setSubSlots([]);
    }
    setSelectedTime("");
    setFormData((prevData) => ({ ...prevData, date: formattedDate }));
    setFormErrors((prevErrors) => ({ ...prevErrors, date: "" }));
  };

  const handleTimeClick = (id, start, end) => {
    setSelectedTime(id, start, end);
    const timeValue = `${formatTime(start)} - ${formatTime(end)}`;
    setFormData((prev) => ({
      ...prev,
      time: timeValue,
      sub_slot: id,
      old_slot: selectedSlot,
    }));
    setFormErrors((prevErrors) => ({ ...prevErrors, time: "" }));
  };
  function handleBreadClick(event) {
    event.preventDefault();
  }
  const doctorOnly = isDoctorPanelFromCookies();
  const doctorDisplayName = getDoctorDisplayName(departments, Cookies.get("username"));

  return (
    <>
      {loading ? (
        <LoaderH />
      ) : (
        <div className="legacy-panel-page py-8 px-8 w-full md:w-[80%] xl:w-full">
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
              <Link
                className="hover:underline text-inherit"
                color="inherit"
                to={
                  isSuperuser
                    ? "/admin/appointments"
                    : isVendor
                    ? "/vendor/appointments"
                    : "/doctor/appointments"
                }
              >
                Appointments
              </Link>
              <Link className="hover:underline text-inherit" color="inherit">
                Edit Appointment
              </Link>
            </Breadcrumbs>
          </div>
          <div className="legacy-panel-surface w-full px-4 py-8 mt-3">
            <div className="flex items-center justify-between">
              <span className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
                Edit Appointment
              </span>
            </div>
            <div>
              <form id="AddBlog" onSubmit={handleSubmit}>
                <div className="space-y-12">
                  <div className="pb-12">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="col-span-3">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Name<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="given-name"
                            value={formData.name}
                            onChange={handleChange}
                            className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {formErrors.name && (
                            <p className="text-red-600">{formErrors.name}</p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-3">
                        <label
                          htmlFor="age"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Age<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="age"
                            id="age"
                            value={formData.age}
                            onChange={handleChange}
                            className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {formErrors.age && (
                            <p className="text-red-600">{formErrors.age}</p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-3">
                        <label
                          htmlFor="contact"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Contact<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="contact"
                            id="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {formErrors.contact && (
                            <p className="text-red-600">{formErrors.contact}</p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-3">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Email<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {formErrors.email && (
                            <p className="text-red-600">{formErrors.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-3">
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          City<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="city"
                            id="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {formErrors.city && (
                            <p className="text-red-600">{formErrors.city}</p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-3">
                        <label
                          htmlFor="location"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Location<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <select
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            <option value="">Select a location</option>
                            {location.length > 0 ? (
                              location
                                .filter((location) => location.status === 1)
                                .map((location) => (
                                  <option
                                    key={location.id}
                                    value={formData.location.name}
                                  >
                                    {location.name}
                                  </option>
                                ))
                            ) : (
                              <option disabled>Loading...</option>
                            )}
                          </select>
                          {formErrors.location && (
                            <p className="text-red-600">
                              {formErrors.location}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-3">
                        <label
                          htmlFor="department"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Department<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            <option value="">Select a department</option>
                            {departments.length > 0 ? (
                              Array.from(
                                new Set(
                                  departments
                                    .filter(
                                      (department) =>
                                        department.location ===
                                        formData.location
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
                              <option disabled>Loading...</option>
                            )}
                          </select>

                          {formErrors.department && (
                            <p className="text-red-600">
                              {formErrors.department}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-3">
                        {doctorOnly ? (
                          <div className="rounded-2xl border border-[#67E8F9]/50 bg-[#ECFEFF] p-4">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
                              Assigned doctor
                            </p>
                            <p className="mt-2 text-lg font-black text-[#134E4A]">
                              {doctorDisplayName}
                            </p>
                          </div>
                        ) : (
                          <>
                            <label
                              htmlFor="doctor"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Doctor<span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                              <select
                                id="doctor"
                                name="doctor"
                                value={formData.doctor}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              >
                                <option value="">Select a Doctor</option>
                                {departments.length > 0 ? (
                                  Array.from(
                                    new Set(
                                      departments
                                        .filter(
                                          (doctor) =>
                                            doctor.department ===
                                            formData.department
                                        )
                                        .map((doctor) => doctor.name)
                                    )
                                  ).map((doctorName) => {
                                    const doctorData = departments.find(
                                      (doc) =>
                                        doc.location === formData.location &&
                                        doc.department === formData.department
                                    );
                                    return doctorData ? (
                                      <option
                                        key={doctorData.id}
                                        value={
                                          doctorData.fname + " " + doctorData.lname
                                        }
                                      >
                                        {doctorData.fname + " " + doctorData.lname}
                                      </option>
                                    ) : null;
                                  })
                                ) : (
                                  <option disabled>Loading...</option>
                                )}
                              </select>
                              {formErrors.doctor && (
                                <p className="text-red-600">{formErrors.doctor}</p>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="col-span-3">
                        <label
                          htmlFor="date"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Date<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            type="date"
                            name="date"
                            id="date"
                            // min={dayjs().format("YYYY-MM-DD")}
                            value={formData.date}
                            onChange={handleDateChange}
                            className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {formErrors.date && (
                            <p className="text-red-600">{formErrors.date}</p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-3">
                        <label
                          htmlFor="gender"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Gender<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          {formErrors.gender && (
                            <p className="text-red-600">{formErrors.gender}</p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label
                          htmlFor="problem"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Problem<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <textarea
                            name="problem"
                            id="problem"
                            rows="3"
                            value={formData.problem}
                            onChange={handleChange}
                            className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {formErrors.problem && (
                            <p className="text-red-600">{formErrors.problem}</p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-3">
                        <label
                          htmlFor="time"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Time<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <div className="grid grid-cols-3 gap-2">
                            {subSlots.length > 0 ? (
                              subSlots.map((item, index) =>
                                item.is_active ? (
                                  <h2
                                    key={index}
                                    className={`relative rounded-lg border border-gray-300 h-12 text-[14px] flex justify-center items-center 
                              ${
                                selectedSlot === item.id && item.is_booked
                                  ? "!bg-green-500 text-white font-bold cursor-not-allowed"
                                  : item.is_booked && selectedSlot !== item.id
                                  ? "!bg-gray-500 text-white font-bold cursor-not-allowed"
                                  : selectedTime === item.id
                                  ? "!bg-blue-500 text-white font-bold cursor-pointer"
                                  : "!bg-white text-gray-500 font-bold cursor-pointer"
                              }`}
                                    onClick={() =>
                                      handleTimeClick(
                                        item.id,
                                        item.start_time,
                                        item.end_time
                                      )
                                    }
                                  >
                                    {`${formatTime(
                                      item.start_time
                                    )} - ${formatTime(item.end_time)}`}
                                  </h2>
                                ) : null
                              )
                            ) : (
                              <p>No available slots.</p>
                            )}
                          </div>
                          {formErrors.time && (
                            <p className="mt-2 text-red-600">
                              {formErrors.time}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-4 mt-5">
                          <div className="flex gap-2">
                            <div className="w-5 h-5 bg-green-500 rounded-full border border-black"></div>
                            <p className="text-md">Current Slot</p>
                          </div>
                          <div className="flex gap-2 ">
                            <div className="w-5 h-5 bg-blue-500 font-bold rounded-full border border-black"></div>
                            <p className="text-md"> Selected Slot</p>
                          </div>
                          <div className="flex gap-2 ">
                            <div className="w-5 h-5 bg-gray-500 font-bold rounded-full border border-black"></div>
                            <p className="text-md"> Booked Slots</p>
                          </div>
                          <div className="flex gap-2">
                            <div className="w-5 h-5 bg-white font-bold rounded-full border border-black"></div>
                            <p className="text-md"> Available Slots</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start items-center gap-6">
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Save
                    </button>
                    <Link
                      to={
                        isSuperuser
                          ? "/admin/appointments"
                          : isVendor
                          ? "/vendor/appointments"
                          : "/doctor/appointments"
                      }
                      type="button"
                      className="rounded-md !text-black px-3 py-[7px] text-sm font-semibold text-white shadow-sm border border-1 border-black"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditAppointment;
