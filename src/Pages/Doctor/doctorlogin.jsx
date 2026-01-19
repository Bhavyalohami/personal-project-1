import ReCAPTCHA from "react-google-recaptcha";
import React, { useState, useEffect, useRef } from "react";
import { FiUser } from "react-icons/fi";
import { RiLock2Line } from "react-icons/ri";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import LoaderH from "../../Component/Loader/loader";
import { set } from "date-fns";

const DoctorLogin = () => {
  const navigate = useNavigate();

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    username: "",
    password: "",
    captcha: "",
    credentials: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [visible, setVisible] = useState(false);
  const captchaRef = useRef(null);
  // Check for stored credentials on component mount (for Remember Me functionality)
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    const storedRememberMe = localStorage.getItem("rememberMe");

    if (storedRememberMe === "true") {
      setRememberMe(true);
      setUsername(storedUsername || "");
      setPassword(storedPassword || "");
    }
  }, []);

  const handleCaptchaChange = (value) => {
    setIsCaptchaVerified(true);
    setError({ ...error, captcha: "" });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setError({ ...error, [id]: "" });

    if (id === "username") {
      setUsername(value);
    } else if (id === "password") {
      setPassword(value);
    }
  };

  const handleLogin = async () => {
    const captchaError = document.getElementById("captcha-error");
    const credError = document.getElementById("cred-error");

    setError({ username: "", password: "", captcha: "", credentials: "" });

    if (!username) {
      setError((prev) => ({ ...prev, username: "Username is required" }));
    }
    if (!password) {
      setError((prev) => ({ ...prev, password: "Password is required" }));
    }
    if (!isCaptchaVerified) {
      setError((prev) => ({ ...prev, captcha: "Please verify the captcha" }));
    }

    if (username && password && isCaptchaVerified) {
      const value = captchaRef.current.getValue(); 
      if (!value) {
        captchaError.textContent = "Please check the box to proceed";
        return;
      }
      setLoading(true);

      try {
        const response = await axios.post(`${BaseUrl}clinic/login/`, {
          username,
          password,
        });

        if (response.data.http_status_code === 200) {
          Cookies.set("token", response.data.token, { expires: 200 });
          Cookies.set("is_staff", response.data.is_staff, { expires: 200 });
          Cookies.set("is_vendor", response.data.is_vendor, { expires: 200 });
          Cookies.set("is_superuser", response.data.is_superuser, {
            expires: 200,
          });
          Cookies.set("roles", response.data.roles, { expires: 200 });
          Cookies.set("subroles", JSON.stringify(response.data.subroles), {
            expires: 200,
          });
          Cookies.set("status", response.data.http_status_code, {
            expires: 200,
          });
          Cookies.set("username", response.data.username, { expires: 200 });

          // Save credentials to localStorage if "Remember Me" is checked
          if (rememberMe) {
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
            localStorage.setItem("rememberMe", "true");
          } else {
            localStorage.removeItem("username");
            localStorage.removeItem("password");
            localStorage.removeItem("rememberMe");
          }

          navigate("/doctor");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error;
        setError((prev) => ({
          ...prev,
          credentials: errorMessage,
        }));
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className="flex w-screen h-screen">
      {loading ? (
        LoaderH
      ) : (
        <>
          <div className="flex flex-col items-center w-full h-full">
            <div className="flex flex-col items-center justify-center mt-10 h-full">
              <text className="font-poppins text-[30px] font-bold leading-[45px]">
                DOCTOR LOGIN
              </text>
              <p className="text-[#525252] font-poppins text-[16px] font-normal leading-[24px] mt-1">
                How to get started with Doctor’s Consultation?
              </p>
              <span
                className="text-red-500 font-medium mt-1 w-full text-center"
                id="cred-error"
              >
                {error.credentials}
              </span>
              <div className="mt-4 flex flex-col relative w-full">
                <input
                  onChange={handleInputChange}
                  type="text"
                  id="username"
                  name="username"
                  className="bg-[#F0EDFFCC] !pl-8 px-2 py-2 rounded-lg w-full focus:outline-none focus:ring-0 border border-2 border-gray-400"
                  placeholder="Enter username"
                  value={username}
                />
                <FiUser className="absolute text-[20px] top-[10px] left-[8px]" />
                <span
                  className="text-red-500 font-medium mt-1"
                  id="email-error"
                >
                  {error.username}
                </span>
              </div>
              <div className="mt-3 flex flex-col relative w-full">
                <input
                  onChange={handleInputChange}
                  type={visible ? "text" : "password"}
                  id="password"
                  name="password"
                  className="bg-[#F0EDFFCC] !pl-8 px-2 py-2 rounded-lg w-full focus:outline-none focus:ring-0 border border-2 border-gray-400"
                  placeholder="Enter password"
                  value={password}
                />
                <RiLock2Line className="absolute font-semibold text-[20px] top-[10px] left-[8px]" />
                <button
                  onClick={toggleVisibility}
                  className="absolute font-semibold text-[20px] top-[11px] right-[8px]"
                >
                  {!visible ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
                <span
                  className="text-red-500 font-medium mt-1"
                  id="password-error"
                >
                  {error.password}
                </span>
              </div>

              <div className="scale-[0.75] flex flex-col ml-[-80px] w-full">
                <ReCAPTCHA
                ref={captchaRef}
                  sitekey="6Lc4RyEqAAAAAKpyye27qavRHxgswURGIuebcTmE"
                  onChange={handleCaptchaChange}
                  id="captcha"
                />
                <span
                  className="text-red-500 font-semibold text-[20px] mt-1"
                  id="captcha-error"
                >
                  {error.captcha}
                </span>
              </div>
              <div className="flex items-center justify-start gap-1.5 w-full px-1">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />
                <p className="text-[13px] font-medium">Remember Me!</p>
              </div>
              <button
                onClick={handleLogin}
                className="bg-[#4379EE] text-[#ffffff] px-4 py-2 rounded-lg mt-0 font-poppins text-[16px] font-bold leading-[24px] cursor-pointer"
              >
                Login
              </button>
              <div className="w-full py-4 flex justify-center">
                <Link
                  to="/vendor/login"
                  className="text-[13px] font-medium text-gray-600 underline hover:underline-offset-2"
                >
                  Click here if you are Vendor?
                </Link>
              </div>
            </div>
          </div>

          <div className="container hidden lg:flex flex-col justify-center items-center w-full h-full">
            <img
              className="w-full h-full object-cover"
              src="/assets/Admin/AdminLogin/background.png"
              alt=""
            />
            <div className="w-1/4 h-2/3 absolute rounded-[38px] xl:rounded-[45px] 2xl:rounded-[60px] border-2 border-[#ffffff]">
              <img
                className="h-full w-full absolute rounded-[38px] xl:rounded-[45px] 2xl:rounded-[60px]"
                src="/assets/Admin/AdminLogin/blur.png"
                alt=""
              />
              <img
                className="h-full absolute right-[-40px]"
                src="/assets/Admin/AdminLogin/doc.png"
                alt=""
              />
              <img
                className="w-1/4 absolute bottom-[100px] left-[-40px] 2xl:left-[-60px]"
                src="/assets/Admin/AdminLogin/circle.png"
                alt=""
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorLogin;
