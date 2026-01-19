import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";
import LoaderH from "../../Component/Loader/loader";
import axios from "axios";
import Swal from "sweetalert2";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
const UserRegister = () => {
  const navigate = useNavigate();
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cvisible, setCvisible] = useState(false);
  const [username, setUsername] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // useEffect(() => {
  //   getData();
  // }, []);

  const [usernameMessage, setUsernameMessage] = useState(""); // New state for username feedback
  const captchaRef = useRef(null);

  const checkUsernameAvailability = async (username) => {
    const apiUrl = `${BaseUrl}clinic/check-username/`;
    const token = Cookies.get("token");

    try {
      const response = await axios.get(apiUrl, {
        params: { username }, // send username as a parameter
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.data.exists) {
        setUsernameMessage("This username already exists");
      } else {
        setUsernameMessage("Username is available");
      }
    } catch (error) {
      console.error("Error checking username:", error);
    }
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    } else if (password.length < 8) {
      return "Password must be a combination of Captial letters, Small letters, Numbers, and a Special Character and should be of 8 characters in length.";
    } else if (!/[A-Z]/.test(password)) {
      return "Password must be a combination of Captial letters, Small letters, Numbers, and a Special Character and should be of 8 characters in length.";
    } else if (!/[a-z]/.test(password)) {
      return "Password must be a combination of Captial letters, Small letters, Numbers, and a Special Character and should be of 8 characters in length.";
    } else if (!/[0-9]/.test(password)) {
      return "Password must be a combination of Captial letters, Small letters, Numbers, and a Special Character and should be of 8 characters in length.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must be a combination of Captial letters, Small letters, Numbers, and a Special Character and should be of 8 characters in length.";
    }
    return ""; // If all checks pass, return an empty string
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { ...formErrors };
    if (!formData.username) {
      errors.username = "Username is required";
      isValid = false;
    }
    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      errors.password = passwordError;
      isValid = false;
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Password do not match";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const captchaError = document.getElementById("recaptcha-error");
    captchaError.textContent = "";
    validateForm();
    if (!isCaptchaVerified) {
      captchaError.textContent = "Please check the box to proceed";
      return;
    }
    const value = captchaRef.current.getValue(); 
    if (!value) {
      captchaError.textContent = "Please check the box to proceed";
      return;
    }
    if (validateForm()) {
      const apiUrl = `${BaseUrl}clinic/register-patient/`;
      try {
        setLoading(true);
        const response = await axios.post(apiUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setLoading(false);
        Swal.fire({
          title: "Success!",
          text: "Your account has been created successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
    if (name === "username" && value.length > 3) {
      checkUsernameAvailability(value);
    } else {
      setUsernameMessage("");
    }

    if (name === "password") {
      const passwordError = validatePassword(value);
      setFormErrors({
        ...formErrors,
        password: passwordError,
      });
    } else if (name === "confirmPassword") {
      // Check if confirmPassword matches the password
      if (value !== formData.password) {
        setFormErrors({
          ...formErrors,
          confirmPassword: "Passwords do not match",
        });
      } else {
        setFormErrors({
          ...formErrors,
          confirmPassword: "",
        });
      }
    }
  };

  const handleCaptchaChange = (value) => {
    setIsCaptchaVerified(true);
    document.getElementById("recaptcha-error").textContent = "";
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const ctoggleVisibility = () => {
    setCvisible(!cvisible);
  };

  return (
    <>
      {loading ? (
        <LoaderH />
      ) : (
        <div className='min-h-max flex flex-col bg-[url("/public/assets/User/background.jpg")] bg-cover bg-center'>
          <div className="flex flex-col items-center justify-center gap-4 ml-0 md:ml-[50%] py-[8%] bg-white md:!bg-transparent">
            <h1 className="text-black text-3xl font-bold">Register</h1>
            <div className="flex flex-col w-3/4 items-center justify-center gap-2 px-0 xl:!px-16">
              <div className="w-full">
                <div className="flex flex-col w-full mb-1.5">
                  <text className="font-semibold text-gray-700 mb-1 ml-0.5">
                    Username<span className="text-red-500">*</span>
                  </text>
                  <input
                    type="text"
                    className="p-2 rounded border border-2 border-gray-400 focus:outline-none focus:ring-0"
                    placeholder="Please enter username"
                    onChange={handleChange}
                    name="username"
                    value={formData.username}
                  />
                  <span className="text-red-500 mt-0.5 text-sm">
                    {formErrors.username}
                  </span>
                  <span
                    className="text-sm mt-0.5"
                    style={{
                      color:
                        usernameMessage === "This username already exists"
                          ? "red"
                          : "green",
                    }}
                  >
                    {usernameMessage}
                  </span>
                </div>

                <div className="flex flex-col w-full mb-1.5">
                  <text className="font-semibold text-gray-700 mb-1 ml-0.5">
                    Email<span className="text-red-500">*</span>
                  </text>
                  <input
                    type="text"
                    className="p-2 rounded border border-2 border-gray-400 focus:outline-none focus:ring-0"
                    placeholder="Please enter email "
                    onChange={handleChange}
                    name="email"
                    value={formData.email}
                  />
                  <span className="text-red-500 mt-0.5 text-sm">
                    {formErrors.email}
                  </span>
                </div>
                <div className="flex flex-col w-full relative mb-1.5">
                  <text className="font-semibold text-gray-700 mb-1 ml-0.5">
                    Password<span className="text-red-500">*</span>
                  </text>
                  <input
                    type={visible ? "text" : "password"}
                    className="p-2 rounded border border-2 border-gray-400 focus:outline-none focus:ring-0"
                    placeholder="Please enter password"
                    onChange={handleChange}
                    name="password"
                    value={formData.password}
                  />
                  <button
                    onClick={toggleVisibility}
                    className="absolute font-semibold text-[20px] top-[40px] right-[8px]"
                  >
                    {!visible ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </button>
                  <span className="text-red-500 mt-0.5 text-sm">
                    {formErrors.password}
                  </span>
                </div>
                <div className="flex flex-col w-full relative">
                  <text className="font-semibold text-gray-700 mb-1 ml-0.5">
                    Confirm Password<span className="text-red-500">*</span>
                  </text>
                  <input
                    type={cvisible ? "text" : "password"}
                    className="p-2 rounded border border-2 border-gray-400 focus:outline-none focus:ring-0"
                    placeholder="Please re-enter password"
                    onChange={handleChange}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                  />
                  <button
                    onClick={ctoggleVisibility}
                    className="absolute font-semibold text-[20px] top-[40px] right-[8px]"
                  >
                    {!cvisible ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </button>
                  <span className="text-red-500 mt-0.5 text-sm">
                    {formErrors.confirmPassword}
                  </span>
                </div>
                <div className="flex flex-col items-start justify-start w-full">
                  <div className="scale-[0.6] sm:scale-75 flex self-start ml-[-60px] sm:ml-[-37px]">
                    <ReCAPTCHA
                      ref={captchaRef}
                      sitekey="6Lc4RyEqAAAAAKpyye27qavRHxgswURGIuebcTmE"
                      onChange={handleCaptchaChange}
                      id="captcha"
                    />
                  </div>
                  <span
                    className="text-red-500 text-sm mt-[-5px]"
                    id="recaptcha-error"
                  ></span>
                </div>
              </div>
            </div>

            <button
              className="px-3 py-2 rounded bg-indigo-600 text-white font-bold"
              onClick={handleSubmit}
            >
              Register
            </button>
            <div className="flex items-center justify-center w-full justify-end gap-2">
              <p>Already a User?</p>
              <Link
                to="/user/login"
                className="text-indigo-600 font-bold hover:underline"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserRegister;
