import React, { useState, useEffect } from "react";
import AdminSearch from "../../../Component/Admin/adminsearch";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import BaseUrl from "../../../Api/baseurl";
import dayjs from "dayjs";
import DoctorSearch from "../../../Component/Doctor/doctorsearch";
import VendorSearch from "../../../Component/Vendor/vendorsearch";
import { format } from "date-fns";
import LoaderH from "../../../Component/Loader/loader";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {
  getDoctorDisplayName,
  isDoctorPanelFromCookies,
} from "../../../utils/doctorPanelAccess";

const AddAppointment = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact: "",
    email: "",
    city: "",
    location: "",
    date: "",
    time: "",
    gender: "",
    department: "",
    doctor: "",
    problem: "",
    username: "",
    sub_slot: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [slots, setSlots] = useState({});
  const [, setTimeslots] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setError] = useState("");
  const [location, setLocation] = useState("");
  const [departments, setDepartments] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [subSlots, setSubSlots] = useState([]);
  const [currentMonth] = useState(dayjs());

  useEffect(() => {
    getLocation();
    if (selectedDate) {
      getData(selectedDate);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  useEffect(() => {
    if (formData.location) {
      getDepartments(formData.location);
    } else {
      setDepartments([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.location]);

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

  const handleDoctorChange = (user) => {
    const selectedUser = isDoctorPanelFromCookies()
      ? Cookies.get("username")
      : user;
    setSelectedDate(dayjs().format("YYYY-MM-DD"));
    const doctorData = departments.find((doctor) => doctor.username === selectedUser);

    if (doctorData) {
      setFormData((prev) => ({
        ...prev,
        doctor: doctorData.fname + " " + doctorData.lname,
        username: doctorData.username,
      }));
      setDoctor(doctorData.username);
      getSlotData(doctorData.username);
    }
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

  const isValidEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!",
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
          await axios.post(`${BaseUrl}clinic/submit-appointment/`, payload, {
            headers: { "Content-Type": "application/json" },
          });
          setLoading(false);
          navigate("/admin/appointments");
          if (isSuperuser) {
            navigate("/admin/appointments");
          } else if (isVendor) {
            navigate("/vendor/appointments");
          } else {
            navigate("/doctor/appointments");
          }
          Swal.fire({
            title: "Success!",
            text: "Appointment added successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: `There was an issue adding the appointment: ${error.message}`,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
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

  const getDepartments = async (location) => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get(`${BaseUrl}clinic/staff-list/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const currentUsername = Cookies.get("username");
      const staffList = Array.isArray(response.data) ? response.data : [];
      const scopedStaff = isDoctorPanelFromCookies()
        ? staffList.filter((doctor) => doctor.username === currentUsername)
        : staffList;
      setDepartments(scopedStaff);

      if (isDoctorPanelFromCookies() && scopedStaff.length > 0) {
        const doctorData = scopedStaff[0];
        setFormData((prev) => ({
          ...prev,
          location: doctorData.location || prev.location,
          department: doctorData.department || prev.department,
          doctor: `${doctorData.fname || ""} ${doctorData.lname || ""}`.trim(),
          username: doctorData.username,
          doctor_username: doctorData.username,
        }));
        setDoctor(doctorData.username);
        getSlotData(doctorData.username);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const getData = async (slotdate) => {
    const apiUrl = `${BaseUrl}clinic/slots/${doctor}/${slotdate}`;
    const token = Cookies.get("token");
    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Token ${token}` },
      });
      const info = response.data;
      if (info.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Not Available",
          text: "No slots available on this date",
        });
        Cookies.remove("token");
        Cookies.remove("username");
        Cookies.remove("is_superuser");
        Cookies.remove("is_staff");
        Cookies.remove("is_vendor");
        Cookies.remove("status");
        Cookies.remove("roles");
        Cookies.remove("subroles");
        setSlots({});
        setTimeslots([]);
      } else {
        setSlots(info[0]);
        // generateTimeSlots(info[0]);
        // fetchExistingBookings(slotdate);
      }
    } catch (error) {
      setError(error.message);
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
    } finally {
    }
  };

  // const handleDateChange = (e) => {
  //   const formattedDate = e.target.value;
  //   setSelectedDate(formattedDate);
  //   setSelectedTime("");
  //   setFormData((prevData) => ({ ...prevData, date: formattedDate }));
  //   setFormErrors((prevErrors) => ({ ...prevErrors, date: "" }));
  //   fetchExistingBookings(formattedDate);
  // };
  const handleDateClick = (dateValue) => {
    const dateString = dayjs(dateValue).format("YYYY-MM-DD");
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
    setFormErrors((prevErrors) => ({ ...prevErrors, date: "" }));
  };

  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}`);
    return format(date, "HH:mm");
  };

  // const handleTimeClick = (time) => {
  //   if (existingBookings.includes(time)) return;
  //   setSelectedTime(time);
  //   setFormData((prev) => ({ ...prev, time }));
  //   setFormErrors((prevErrors) => ({ ...prevErrors, time: "" }));
  // };

  const handleTimeClick = (id, start, end) => {
    setSelectedTime(id, start, end);
    const timeValue = `${formatTime(start)} - ${formatTime(end)}`;
    setFormData((prev) => ({ ...prev, time: timeValue, sub_slot: id }));
    setFormErrors((prevErrors) => ({ ...prevErrors, time: "" }));
  };

  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  useEffect(() => {
    const superuser = Cookies.get("is_superuser") === "true";
    const staff = Cookies.get("is_staff") === "true";
    const vendor = Cookies.get("is_vendor") === "true";
    setIsSuperuser(superuser);
    setIsStaff(staff);
    setIsVendor(vendor);
  }, []);
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
        <>
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
            <div
              role="presentation"
              onClick={handleBreadClick}
              className="ml-1"
            >
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
                  Add Appointment
                </Link>
              </Breadcrumbs>
            </div>
            <div className="legacy-panel-surface w-full px-4 py-8 mt-3">
              <div className="flex items-center justify-between">
                <span className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
                  Add Appointment
                </span>
              </div>
              <form id="AddAppointment" onSubmit={handleSubmit}>
                <div className="space-y-12">
                  <div className="">
                    <div className="mt-10 grid grid-cols-6 gap-x-6 gap-y-8 ">
                      {[
                        { id: "name", label: "Name", type: "text", span: 3 },
                        { id: "age", label: "Age", type: "text", span: 3 },
                        {
                          id: "contact",
                          label: "Contact",
                          type: "numeric",
                          span: 3,
                        },
                        {
                          id: "email",
                          label: "Email address",
                          type: "text",
                          span: 3,
                        },
                        { id: "city", label: "City", type: "text", span: 3 },
                      ].map(({ id, label, type, span }) => (
                        <div key={id} className={`col-span-full sm:col-span-3`}>
                          <label
                            htmlFor={id}
                            className="block text-md font-medium leading-6 text-gray-900"
                          >
                            {label}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-2">
                            {type === "textarea" ? (
                              <textarea
                                id={id}
                                name={id}
                                value={formData[id]}
                                placeholder={`Enter ${label}`}
                                onChange={handleChange}
                                autoComplete={id}
                                className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#B18D65] sm:text-sm sm:leading-6"
                              />
                            ) : (
                              <input
                                type={type}
                                id={id}
                                name={id}
                                value={formData[id]}
                                placeholder={`Enter ${label}`}
                                onChange={handleChange}
                                autoComplete={id}
                                className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#B18D65] sm:text-sm sm:leading-6"
                              />
                            )}
                            {formErrors[id] && (
                              <p className="mt-2 text-sm text-red-600">
                                {formErrors[id]}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}

                      <div className="col-span-full sm:col-span-3">
                        <label
                          htmlFor="gender"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Gender<span className="text-red-500">*</span>
                        </label>{" "}
                        <div className="mt-2">
                          <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="block w-full rounded-md border-0 bg-white pl-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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

                      <div className="col-span-full sm:col-span-3">
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
                            className="block w-full rounded-md border-0 pl-3 py-2 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            <option value="">Select a location</option>
                            {location.length > 0 ? (
                              location
                                .filter((location) => location.status === 1)
                                .map((location) => (
                                  <option
                                    key={location.id}
                                    value={location.name}
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

                      <div className="col-span-full sm:col-span-3">
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
                            className="block w-full rounded-md border-0 pl-3 py-2 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                              <option disabled>Select Location First...</option>
                            )}
                          </select>

                          {formErrors.department && (
                            <p className="text-red-600">
                              {formErrors.department}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-full sm:col-span-3">
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
                                name="doctor"
                                id="doctor"
                                className="block w-full rounded-md border-0 pl-3 py-2 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={handleChange}
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
                              {formErrors.doctor && (
                                <p className="text-red-600">{formErrors.doctor}</p>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="col-span-full sm:col-span-3">
                        <label
                          htmlFor="date"
                          className="block text-md font-medium leading-6 text-gray-900"
                        >
                          Date
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            type="date"
                            id="date"
                            name="date"
                            min={dayjs().format("YYYY-MM-DD")}
                            value={formData.date}
                            onChange={(e) => handleDateClick(e.target.value)}
                            className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#B18D65] sm:text-sm sm:leading-6"
                          />
                          {formErrors.date && (
                            <p className="mt-2 text-sm text-red-600">
                              {formErrors.date}
                            </p>
                          )}
                        </div>
                      </div>

                      <div key={"problem"} className={`col-span-full`}>
                        <label
                          htmlFor={"problem"}
                          className="block text-md font-medium leading-6 text-gray-900"
                        >
                          Problem Description
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="problem"
                            name="problem"
                            value={formData.problem}
                            placeholder="Enter the problem"
                            onChange={handleChange}
                            autoComplete="problem"
                            rows={4}
                            className="block w-full rounded-md border-0 pl-3 pr-12 py-1.5 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {formErrors.problem && (
                            <p className="mt-2 text-sm text-red-600">
                              {formErrors.problem}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-full sm:col-span-3">
                        <label
                          htmlFor="time"
                          className="block text-md font-medium leading-6 text-gray-900"
                        >
                          Time
                          <span className="text-red-500">*</span>
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
                                item.is_booked
                                  ? "bg-gray-500 text-white font-bold cursor-not-allowed"
                                  : selectedTime === item.id
                                  ? "bg-blue-500 text-white font-bold cursor-pointer"
                                  : "bg-white text-gray-500 font-bold cursor-pointer"
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
                            <p className="mt-2 text-sm text-red-600">
                              {formErrors.time}
                            </p>
                          )}
                          <div className="flex gap-4 mt-5">
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
                  </div>
                  <div className="pt-4 flex items-center justify-start w-full gap-6">
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
        </>
      )}
    </>
  );
};

export default AddAppointment;
