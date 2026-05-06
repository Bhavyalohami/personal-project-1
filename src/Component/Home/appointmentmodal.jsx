import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";
import axios from "axios";
import BaseUrl from "../../Api/baseurl";

const AppointmentModal = ({ modalOpen, setModalOpen }) => {
  const navigate = useNavigate();
  const token = Cookies.get("patient_token");
  const recaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
  const captchaEnabled = Boolean(recaptchaSiteKey);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact: "",
    email: "",
    city: "",
    gender: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    age: "",
    contact: "",
    email: "",
    city: "",
    gender: "",
  });
  const [loginAge, setLoginAge] = useState("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  useEffect(() => {
    if (!modalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";

    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = previousOverflow;
    };
  }, [modalOpen]);

  useEffect(() => {
    const storedData = localStorage.getItem("formData");

    if (token) {
      const username = Cookies.get("patient_username");

      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${BaseUrl}clinic/patient-profile/${username}/`
          );
          setLoginAge(response.data.age)
          setFormData(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchData();
    } else if (storedData) {
      setFormData(JSON.parse(storedData));
    }
  }, [token]);

  useEffect(() => {
    const age = Number(loginAge);
    
    if (age >0 && age < 18) {
      setFormData((prevState) => ({
        ...prevState,
        age: "Under 18",
      }));
    } else if (age >= 18 && age <= 25) {
      setFormData((prevState) => ({
        ...prevState,
        age: "18-25",
      }));
    } else if (age >= 26 && age <= 35) {
      setFormData((prevState) => ({
        ...prevState,
        age: "26-35",
      }));
    } else if (age >= 36 && age <= 45) {
      setFormData((prevState) => ({
        ...prevState,
        age: "36-45",
      }));
    } else if (age >= 46 && age <= 55) {
      setFormData((prevState) => ({
        ...prevState,
        age: "46-55",
      }));
    } else if (age >= 56 && age <= 65) {
      setFormData((prevState) => ({
        ...prevState,
        age: "56-65",
      }));
    } else if (age > 65) {
      setFormData((prevState) => ({
        ...prevState,
        age: "Over 65",
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        age: "",
      }));
    }
  }, [loginAge]);
  
  const ageOptions = [
    "Under 18",
    "18-25",
    "26-35",
    "36-45",
    "46-55",
    "56-65",
    "Over 65",
  ];

  const handleCaptchaChange = (value) => {
    setIsCaptchaVerified(true);
    const captchaError = document.getElementById("captcha-error");
    if (captchaError) captchaError.textContent = "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: "",
      age: "",
      contact: "",
      email: "",
      city: "",
      gender: "",
    };

    if (!formData.name.trim()) {
      errors.name = "Please enter your full name.";
      isValid = false;
    }

    if (!formData.age) {
      errors.age = "Please select your age.";
      isValid = false;
    }

    if (!formData.contact.trim()) {
      errors.contact = "Please enter your phone number.";
      isValid = false;
    } else if (formData.contact.trim().length !== 10) {
      errors.contact = "Please enter a 10-digit phone number.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Please enter your email address.";
      isValid = false;
    } else if (!isValidEmail(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.city.trim()) {
      errors.city = "Please enter your city.";
      isValid = false;
    }

    if (formData.gender === "") {
      errors.gender = "Please select your gender.";
      isValid = false;
    }

    setFormErrors(errors);

    return isValid;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    const captchaError = document.getElementById("captcha-error");
    if (captchaError) captchaError.textContent = "";

    if (captchaEnabled && !isCaptchaVerified) {
      if (captchaError) {
        captchaError.textContent = "Please check the box to proceed";
      }
      return;
    }

    if (isValid) {
      localStorage.setItem("formData", JSON.stringify(formData));
      Cookies.set("name", formData.name);
      setModalOpen(false);
      navigate("/booking");
    }
  };
  const handleClose = () => {
    setModalOpen(false);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      age: "",
      contact: "",
      email: "",
      city: "",
      gender: "",
    });
    setFormErrors({
      name: "",
      age: "",
      contact: "",
      email: "",
      city: "",
      gender: "",
    });
    setIsCaptchaVerified(false);
    const captchaError = document.getElementById("captcha-error");
    if (captchaError) captchaError.textContent = "";
  };

  if (!modalOpen) return null;

  const inputClass =
    "h-12 w-full rounded-lg border border-[#67E8F9]/70 bg-white px-4 text-sm text-[#134E4A] shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#0D9488] focus:ring-4 focus:ring-[#67E8F9]/30";
  const labelClass = "mb-1 block text-sm font-black text-[#134E4A]";

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-[#134E4A]/70 backdrop-blur-sm"
        style={{ zIndex: 1990 }}
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 overflow-y-auto px-4 py-6"
        style={{ zIndex: 2000 }}
        role="presentation"
        onClick={handleClose}
      >
        <div className="mx-auto flex min-h-full w-full max-w-5xl items-start justify-center sm:items-center">
          <div
            className="grid w-full overflow-hidden rounded-2xl border border-white/80 bg-white shadow-2xl md:grid-cols-[0.9fr_1.1fr]"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-modal="true"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <aside className="relative hidden min-h-[620px] overflow-hidden bg-[#134E4A] p-8 text-white md:block">
              <img
                src="/brand/auth-care-teal.png"
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-55"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(19,78,74,0.95),rgba(13,148,136,0.72))]" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#67E8F9]">
                    CareBridge
                  </span>
                  <h2 className="mt-6 text-4xl font-black leading-tight">
                    Book care in a few calm steps.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-cyan-50/85">
                    Share your details once, then pick the right specialist and
                    time slot without losing your place.
                  </p>
                </div>
                <div className="grid gap-3">
                  {[
                    "Verified specialists",
                    "Guest booking supported",
                    "Secure Firebase-ready flow",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold backdrop-blur"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <div className="bg-[#ECFEFF] p-5 sm:p-7">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
                    Appointment
                  </p>
                  <h1
                    className="mt-2 text-2xl font-black leading-tight text-[#134E4A] sm:text-3xl"
                    id="exampleModalLabel"
                  >
                    Book Your Appointment
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Tell us who is visiting and we will carry these details into
                    the booking screen.
                  </p>
                </div>
                <button
                  type="button"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#67E8F9]/70 bg-white text-sm font-black text-[#134E4A] shadow-sm transition hover:border-[#0D9488] hover:text-[#0D9488]"
                  aria-label="Close"
                  onClick={handleClose}
                >
                  X
                </button>
              </div>

              <form id="appointmentForm" onSubmit={handleSubmit} className="grid gap-4">
                <div>
                  <label htmlFor="fullName" className={labelClass}>
                    Full Name<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <span id="name-error" className="mt-1 block text-xs font-semibold text-red-500">
                    {formErrors.name}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-[0.8fr_1.2fr]">
                  <div>
                    <label htmlFor="age" className={labelClass}>
                      Age<span className="text-red-600">*</span>
                    </label>
                    <select
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select Age</option>
                      {ageOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <span id="age-error" className="mt-1 block text-xs font-semibold text-red-500">
                      {formErrors.age}
                    </span>
                  </div>
                  <div>
                    <label htmlFor="contact" className={labelClass}>
                      Phone Number<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      id="contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      className={inputClass}
                    />
                    <span id="phone-error" className="mt-1 block text-xs font-semibold text-red-500">
                      {formErrors.contact}
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email address<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <span id="email-error" className="mt-1 block text-xs font-semibold text-red-500">
                    {formErrors.email}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="city" className={labelClass}>
                      City<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={inputClass}
                    />
                    <span id="city-error" className="mt-1 block text-xs font-semibold text-red-500">
                      {formErrors.city}
                    </span>
                  </div>
                  <div>
                    <label htmlFor="gender" className={labelClass}>
                      Gender<span className="text-red-600">*</span>
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <span id="gender-error" className="mt-1 block text-xs font-semibold text-red-500">
                      {formErrors.gender}
                    </span>
                  </div>
                </div>

                {captchaEnabled && (
                  <div className="origin-left scale-[0.86]">
                    <ReCAPTCHA
                      sitekey={recaptchaSiteKey}
                      onChange={handleCaptchaChange}
                      id="captcha"
                    />
                    <span className="mt-1 block text-sm font-semibold text-red-500" id="captcha-error"></span>
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center rounded-lg bg-[#0D9488] px-6 text-sm font-black text-white shadow-lg shadow-teal-900/15 transition hover:bg-[#0F766E]"
                  >
                    Continue
                  </button>
                  <button
                    type="reset"
                    className="inline-flex h-12 items-center justify-center rounded-lg border border-[#67E8F9]/80 bg-white px-6 text-sm font-black text-[#134E4A] transition hover:border-[#F59E0B] hover:text-[#0D9488]"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>

                <div className="grid gap-2 border-t border-[#67E8F9]/40 pt-4 text-sm font-semibold text-[#134E4A] sm:grid-cols-2">
                  <p>15+ years of surgical experience</p>
                  <p>All insurances accepted</p>
                  <p>0% EMI facility available</p>
                  <p>Free full-body check-up on first booking</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default AppointmentModal;
