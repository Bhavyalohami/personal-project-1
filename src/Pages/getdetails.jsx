import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";
const GetDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
  const captchaEnabled = Boolean(recaptchaSiteKey);
  const hospitalIdFromUrl = searchParams.get("hospitalId") || "";

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
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

  const ageOptions = [
    "Under 18",
    "18-25",
    "26-35",
    "36-45",
    "46-55",
    "56-65",
    "Over 65",
  ];

  useEffect(() => {
    const storedData = localStorage.getItem("formData");
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
  }, []);

  const handleCaptchaChange = () => {
    const captchaError = document.getElementById("recaptcha-error");
    setIsCaptchaVerified(true);
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

    // Validating full name
    if (!formData.name?.trim()) {
      errors.name = "Please enter your full name.";
      isValid = false;
    }

    // Validating age
    if (!formData.age) {
      errors.age = "Please select your age.";
      isValid = false;
    }

    // Validating phone number
    if (!formData.contact?.trim()) {
      errors.contact = "Please enter your phone number.";
      isValid = false;
    } else if (formData.contact.trim().length !== 10) {
      errors.contact = "Please enter 10-digit phone number.";
      isValid = false;
    }

    // Validating email
    if (!formData.email?.trim()) {
      errors.email = "Please enter your email address.";
      isValid = false;
    } else if (!isValidEmail(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Validating city
    if (!formData.city?.trim()) {
      errors.city = "Please enter your city.";
      isValid = false;
    }

    // Validating service
    if (!formData.gender?.trim()) {
      errors.gender = "Please select the gender.";
      isValid = false;
    }

    setFormErrors(errors); // Set errors state to manage error messages

    return isValid;
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    Cookies.set("name", formData.name);
    const captchaError = document.getElementById("recaptcha-error");
    if (captchaError) captchaError.textContent = "";
    if (captchaEnabled && !isCaptchaVerified) {
      if (captchaError) {
        captchaError.textContent = "Please check the box to proceed";
      }
    }
    const isValid = validateForm();

    if (isValid && (!captchaEnabled || isCaptchaVerified === true)) {
      Cookies.set("name", formData.name);
      localStorage.setItem("formData", JSON.stringify(formData));

      navigate(
        hospitalIdFromUrl
          ? `/booking?hospitalId=${encodeURIComponent(hospitalIdFromUrl)}`
          : "/booking"
      ); // Navigate to booking page
      // window.location.reload();

      //   setModalOpen(false); // Close the modal
      // setFormData(formData); // Reset form data after successful submission
      // setFormErrors(formErrors); // Clear form errors after successful submission
    }
  };

  const isValidEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleReset = () => {
    // console.log("Before reset:", formData); // Check current state
    // setFormData(initialFormData); // Reset form data
    // console.log("After reset:", formData); // Check state after reset
    // setFormErrors(initialFormErrors); // Clear form errors
    const captchaError = document.getElementById("recaptcha-error");
    if (captchaError) captchaError.textContent = "";
    setFormErrors("");
    setFormData({
      name: "",
      age: "",
      contact: "",
      email: "",
      city: "",
      gender: "",
    });
  };
  return (
    <>
      <div className="bg-[#F2EFEA] pt-6">
        <div className="container grid grid-cols-2 mx-auto px-4 sm:px-8 lg:px-32 xl:px-48">
          <div className="flex flex-col justify-center items-start">
            <img src="/brand/hero-care-teal.png" alt="" />
          </div>
          <div className="flex flex-col justify-center items-end text-black font-black text-lg sm:text-xl md:text-3xl lg:text-7xl">
            Enter Details
          </div>
        </div>
      </div>
      {/* <h1 className="modal-title fs-5" id="exampleModalLabel">
        Book Your Appointment With Us
      </h1> */}
      <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 my-16">
        <div className="flex flex-col-reverse lg:flex-row mt-16 gap-4">
          <div className="flex flex-col w-full lg:w-3/5 pr-6">
            <div className="mb-3">
              <label htmlFor="fullName" className="font-inter text-base font-black leading-6 text-left text-[#585858] mb-2 px-2">
                Full Name<span className="text-red-600">*</span>
              </label>
              <input
                //   type="text"
                id="fullName"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="h-[60px] w-full !px-4 !pr-6 rounded-[12px] bg-[#ffffff] border-2 border-gray-300 font-inter text-base font-normal leading-[24.2px] text-left"
              />
              <span
                id="name-error"
                className="error-message text-red-500 mt-2 text-sm"
              >
                {" "}
                {formErrors.name}{" "}
              </span>
            </div>
            <div className=" grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <div className="w-full">
                <label htmlFor="fullName" className="font-inter text-base font-black leading-6 text-left text-[#585858] mb-2 px-2">
                  Age<span className="text-red-600">*</span>
                </label>
                <select
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="h-[60px] !w-full !px-4 !pr-6 rounded-[12px] bg-[#ffffff] border-2 border-gray-300 font-inter text-base font-normal leading-[24.2px] text-left"
                  // className="form-select mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option
                    value=""
                    className="text-sm font-medium border-gray-300 "
                  >
                    Select Age *
                  </option>
                  {ageOptions.map((option) => (
                    <option
                      key={option}
                      value={option}
                      className="text-sm font-medium "
                    >
                      {option}
                    </option>
                  ))}
                </select>
                <span
                  id="age-error"
                  className="error-message text-red-500 mt-2 text-sm"
                >
                  {formErrors.age}
                </span>
              </div>
              <div className="col-span-2">
                <label htmlFor="contact" className="font-inter text-base font-black leading-6 text-left text-[#585858] mb-2 px-2">
                  Phone Number<span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  // className="form-control mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  className="h-[60px] w-full !px-4 !pr-6 rounded-[12px] bg-[#ffffff] border-2 border-gray-300 font-inter text-base font-normal leading-[24.2px] text-left"
                />
                <span
                  id="phone-error"
                  className="error-message text-red-500 mt-2 text-sm"
                >
                  {formErrors.contact}
                </span>
              </div>
            </div>
            <div className="mb-2 mt-3">
              <label htmlFor="email" className="font-inter text-base font-black leading-6 text-left text-[#585858] mb-2 px-2">
                Email address<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                //   className="form-control mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                className="h-[60px] w-full !px-4 !pr-6 rounded-[12px] bg-[#ffffff] border-2 border-gray-300 font-inter text-base font-normal leading-[24.2px] text-left"
              />
              <span
                id="email-error"
                className="error-message text-red-500 mt-2 text-sm"
              >
                {formErrors.email}
              </span>
            </div>
            <div className=" grid grid-cols-1 md:grid-cols-4 gap-4 mb-2 mt-3">
              <div className="col-span-2">
                <label htmlFor="fullName" className="font-inter text-base font-black leading-6 text-left text-[#585858] mb-2 px-2">
                  City<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="h-[60px] w-full !px-4 !pr-6 rounded-[15px] bg-[#ffffff] border-2 border-gray-300 font-inter text-base font-normal leading-[24.2px] text-left"
                  // className="form-control mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <span
                  id="city-error"
                  className="error-message text-red-500 mt-2 text-sm"
                >
                  {formErrors.city}
                </span>
              </div>
              <div className="col-span-2">
                <label htmlFor="gender" className="font-inter text-base font-black leading-6 text-left text-[#585858] mb-2 px-2">
                  Gender<span className="text-red-600">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  // className="form-control mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  className="h-[60px] w-full !px-4 !pr-6 rounded-[15px] bg-[#ffffff] border-2 border-gray-300 font-inter text-base font-normal leading-[24.2px] text-left"
                >
                  <option value="">Select Gender </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <span
                  id="gender-error"
                  className="error-message text-red-500 mt-2 text-sm"
                >
                  {formErrors.gender}
                </span>
              </div>
            </div>

            {captchaEnabled && (
              <div className=" ml-0.5">
                <div className="scale-[0.8] flex flex-col ml-[-40px] md:ml-[-70px] lg:ml-[-50px] xl:ml-[-70px] 2xl:ml-[-85px] mt-3 flex items-start w-full">
                  <ReCAPTCHA
                    sitekey={recaptchaSiteKey}
                    onChange={handleCaptchaChange}
                    id="recaptcha"
                  />
                  <span
                    className="text-red-500 font-medium text-[17px] mt-1"
                    id="recaptcha-error"
                  ></span>
                </div>
              </div>
            )}
          </div>
          <div className="w-full  lg:w-2/5">
            <img
              className="w-full h-5/6"
              src="/brand/hero-care-teal.png"
              alt="Booking"
            />
          </div>
        </div>
        <div className="flex w-full gap-8 mb-4 items-center justify-center container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48">
          <button
            type="submit"
            className="w-1/5 h-[60px] bg-[#0D9488] text-[#ffffff] rounded-[20px] flex items-center justify-center font-inter text-[12px] md:text-[28px] font-medium leading-8 hover:bg-red-600"
            onClick={handleSubmit}
          >
            Continue
          </button>
          <button
            type="reset"
            className="w-1/5 h-[60px] bg-[#0D9488] text-[#ffffff] rounded-[20px] flex items-center justify-center font-inter text-[12px] md:text-[28px] font-medium leading-8 hover:bg-blue-700"
            onClick={() => handleReset()}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
};

export default GetDetails;
