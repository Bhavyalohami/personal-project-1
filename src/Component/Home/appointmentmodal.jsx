import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";
import axios from "axios";
import BaseUrl from "../../Api/baseurl";

const AppointmentModal = ({ modelOpen, closeModal }) => {
  const navigate = useNavigate();
  const token = Cookies.get("patient_token");

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
  const [modalOpen, setModalOpen] = useState(true);

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
    document.getElementById("captcha-error").textContent = "";
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
    captchaError.textContent = "";

    if (!isCaptchaVerified) {
      captchaError.textContent = "Please check the box to proceed";
      return;
    }

    if (isValid) {
      localStorage.setItem("formData", JSON.stringify(formData));
      Cookies.set("name", formData.name);
      navigate("/booking");
      setModalOpen(false);
      window.location.reload();
    }
  };
  const handleClose = () => {
    setModalOpen(false); // Close the modal when triggered
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
    document.getElementById("captcha-error").textContent = "";
  };

  return (
    <>
      {modalOpen && (
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content border-[#F16163] rounded-t-xl">
              <div className="modal-header bg-[#F16163] text-white flex justify-center items-center rounded-t-xl">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Book Your Appointment With Us
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form
                  id="appointmentForm"
                  onSubmit={handleSubmit}
                  className="modal-body"
                >
                  <div className="mb-[11px]">
                    <label htmlFor="fullName" className="form-label mb-0.5">
                      Full Name<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control h-[45px] mt-0 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <span
                      id="name-error"
                      className="error-message text-red-500 mt-2 text-xs"
                    >
                      {formErrors.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-0">
                    <div>
                      <label htmlFor="age" className="form-label mb-0.5">
                        Age<span className="text-red-600">*</span>
                      </label>
                      <select
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="form-select h-[45px] mt-0 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="" className="text-sm font-medium ">
                          Select Age<span className="text-red-600">*</span>
                        </option>
                        {ageOptions.map((option) => (
                          <option
                            key={option}
                            value={option}
                            className="text-sm font-medium"
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                      <span
                        id="age-error"
                        className="error-message text-red-500 mt-2 text-xs"
                      >
                        {formErrors.age}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="contact" className="form-label mb-0.5">
                        Phone Number<span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        id="contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        className="form-control h-[45px] mt-0 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <span
                        id="phone-error"
                        className="error-message text-red-500 mt-2 text-xs"
                      >
                        {formErrors.contact}
                      </span>
                    </div>
                  </div>
                  <div className=" mt-[11px]">
                    <label htmlFor="email" className="form-label mb-0.5">
                      Email address<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control h-[45px] mt-0 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <span
                      id="email-error"
                      className="error-message text-red-500 mt-2 text-xs"
                    >
                      {formErrors.email}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mb-0 mt-[11px]">
                    <div className="col-span-2">
                      <label htmlFor="city" className="form-label mb-0.5">
                        City<span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="form-control h-[45px] mt-0 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <span
                        id="city-error"
                        className="error-message text-red-500 mt-2 text-xs"
                      >
                        {formErrors.city}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="gender" className="form-label mb-0.5">
                        Gender<span className="text-red-600">*</span>
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="form-control h-[45px] appearance-auto mt-0 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        {/* <option value="Other">Other</option> */}
                      </select>
                      <span
                        id="gender-error"
                        className="error-message text-red-500 mt-2 text-xs"
                      >
                        {formErrors.gender}
                      </span>
                    </div>
                  </div>
                  <div className="scale-[0.8] flex flex-col ml-[-40px] mt-[11px] flex items-start w-full">
                    <ReCAPTCHA
                      sitekey="6Lc4RyEqAAAAAKpyye27qavRHxgswURGIuebcTmE"
                      onChange={handleCaptchaChange}
                      id="captcha"
                    />
                    <span
                      className="text-red-500 font-medium text-[14px] mt-1"
                      id="captcha-error"
                    ></span>
                  </div>
                  <div className="mb-3">
                    <button
                      type="submit"
                      className="w-[130px] mt-3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-[#F16163] text-base font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 md:ml-0 sm:text-sm"
                    >
                      Continue
                    </button>
                    <button
                      type="reset"
                      className="w-[130px] mt-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:text-sm"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                  </div>
                  <div className="modal-footer mt-4 flex flex-col justify-start items-start text-sm font-medium">
                    <p>15+ Years of Surgical Experience.</p>
                    <p>All Insurances Accepted</p>
                    <p>EMI Facility Available at 0% Rate</p>
                    <p>Get a free full-body check-up on your first booking</p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentModal;
