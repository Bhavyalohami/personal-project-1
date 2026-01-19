// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import ReCAPTCHA from "react-google-recaptcha";
// import axios from "axios";
// import BaseUrl from "../../Api/baseurl";
// import Cookies from "js-cookie";
// import { AiFillEye } from "react-icons/ai";
// import { AiFillEyeInvisible } from "react-icons/ai";
// import LoaderH from "../../Component/Loader/loader";
// import { set } from "date-fns";
// const UserLogin = () => {
//   const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
//   const [visible, setVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });

//   const [formErrors, setFormErrors] = useState({
//     username: "",
//     password: "",
//     credentials: "",
//   });
//   const navigate = useNavigate();

//   const validateForm = () => {
//     let isValid = true;
//     const errors = { ...formErrors };
//     if (!formData.username) {
//       errors.username = "Username is required";
//       isValid = false;
//     }
//     if (!formData.password) {
//       errors.password = "Password is required";
//       isValid = false;
//     }
//     setFormErrors(errors);
//     return isValid;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setFormErrors({
//       ...formErrors,
//       [name]: "",
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const captchaError = document.getElementById("recaptcha-error");
//     captchaError.textContent = "";
//     validateForm()
//     if (!isCaptchaVerified) {
//       captchaError.textContent = "Please check the box to proceed";
//       return;
//     }
//     if (validateForm()) {
//       try {
//         setLoading(true);
//         const response = await axios.post(`${BaseUrl}clinic/patient-login/`, {
//           username: formData.username,
//           password: formData.password,
//         });
//         setLoading(false);
//         if (response.data.http_status_code === 200) {
//           Cookies.set("patient_token", response.data.token, { expires: 200 });
//           Cookies.set("staff", response.data.is_staff, { expires: 200 });
//           Cookies.set("superuser", response.data.is_superuser, {
//             expires: 200,
//           });
//           Cookies.set("patient_status", response.data.http_status_code, {
//             expires: 200,
//           });
//           Cookies.set("patient_username", response.data.username, {
//             expires: 200,
//           });

//           // navigate("/userprofile");
//           window.history.back();
//         }
//         console.log(response.data.token, "generated");
//       } catch (error) {
//         setFormErrors((prev) => ({
//           ...prev,
//           credentials: "Credentials don't match!",
//         }));
//       }
//     }
//   };

//   const handleCaptchaChange = (value) => {
//     setIsCaptchaVerified(true);
//     document.getElementById("recaptcha-error").textContent = "";
//   };

//   const toggleVisibility = () => {
//     setVisible(!visible);
//   };

//   return (
//     <>
//       {loading ? (
//         <LoaderH />
//       ) : (
//         <div className='min-h-max flex flex-col bg-[url("/public/assets/User/background.jpg")] bg-cover bg-center'>
//           <div className="flex flex-col items-center justify-center gap-4 ml-0 md:ml-[50%] py-[10%] bg-white md:!bg-transparent">
//             <h1 className="text-black text-3xl font-bold">Login</h1>
//             <div className="flex flex-col w-3/4 items-center justify-center gap-2">
//               <span className="text-red-500 mt-2 text-lg font-semibold">
//                 {formErrors.credentials}
//               </span>
//               <div className="w-full">
//                 <div className="flex flex-col w-full">
//                   <text className="font-semibold text-gray-700">
//                     Username<span className="text-red-500">*</span>
//                   </text>
//                   <input
//                     type="text"
//                     className="p-2 rounded focus:outline-none focus:ring-0 border border-2 border-gray-400"
//                     placeholder="Please enter username"
//                     onChange={handleChange}
//                     name="username"
//                     value={formData.username}
//                   />

//                   <span className="text-red-500 mt-0.5 text-sm">
//                     {formErrors.username}
//                   </span>
//                 </div>
//                 <div className="flex flex-col w-full relative">
//                   <text className="font-semibold text-gray-700">
//                     Password<span className="text-red-500">*</span>
//                   </text>
//                   <input
//                     type={visible ? "text" : "password"}
//                     className="p-2 rounded border border-2 border-gray-400 focus:outline-none focus:ring-0 border border-2 border-gray-400"
//                     placeholder="Please enter password"
//                     onChange={handleChange}
//                     name="password"
//                     value={formData.password}
//                   />
//                   <button
//                     onClick={toggleVisibility}
//                     className="absolute font-semibold text-[20px] top-[35px] right-[8px]"
//                   >
//                     {!visible ? <AiFillEyeInvisible /> : <AiFillEye />}
//                   </button>
//                   <span className="text-red-500 mt-0.5 text-sm">
//                     {formErrors.password}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-start w-full gap-1.5 px-1 mt-[5px]">
//                   <input type="checkbox" className="h-3.5 w-3.5" />
//                   <p className="text-[13px] font-medium">Remember Me!</p>
//                 </div>

//                 <div className="flex flex-col items-start justify-start w-full">
//                   <div className="scale-[0.6] sm:scale-75 flex self-start ml-[-60px] sm:ml-[-37px]">
//                     <ReCAPTCHA
//                       sitekey="6Lc4RyEqAAAAAKpyye27qavRHxgswURGIuebcTmE"
//                       onChange={handleCaptchaChange}
//                       id="captcha"
//                     />
//                   </div>
//                   <span
//                     className="text-red-500 text-sm mt-[-5px]"
//                     id="recaptcha-error"
//                   ></span>
//                 </div>
//               </div>
//             </div>

//             <button
//               className="px-3 py-2 rounded bg-indigo-600 text-white font-bold"
//               onClick={handleSubmit}
//             >
//               Login
//             </button>
//             <div className="flex items-center justify-center w-full justify-end gap-2">
//               <p>Not a User?</p>
//               <Link
//                 to="/user/register"
//                 className="text-indigo-600 font-bold hover:underline"
//               >
//                 Register
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default UserLogin;

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import BaseUrl from "../../Api/baseurl";
import Cookies from "js-cookie";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import LoaderH from "../../Component/Loader/loader";

const UserLogin = () => {
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const captchaRef = useRef(null);
  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
    credentials: "",
  });

  const [rememberMe, setRememberMe] = useState(false); // Track "Remember Me" checkbox
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored credentials in cookies
    const storedUsername = Cookies.get("username");
    const storedPassword = Cookies.get("password");

    if (storedUsername && storedPassword) {
      setFormData({
        username: storedUsername,
        password: storedPassword,
      });
      setRememberMe(true); // If cookies exist, remember the user
    }
  }, []);

  const validateForm = () => {
    let isValid = true;
    const errors = { ...formErrors };

    if (!formData.username) {
      errors.username = "Username is required";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
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
      try {
        setLoading(true);
        const response = await axios.post(`${BaseUrl}clinic/patient-login/`, {
          username: formData.username,
          password: formData.password,
        });
        setLoading(false);

        if (response.data.http_status_code === 200) {
          // Set cookies for a logged-in user
          const expiresIn = rememberMe ? 365 : 1; // Long expiration for "Remember Me"

          Cookies.set("patient_token", response.data.token, {
            expires: expiresIn,
          });
          Cookies.set("patient_username", response.data.username, {
            expires: expiresIn,
          });
          Cookies.set("staff", response.data.is_staff, { expires: expiresIn });
          Cookies.set("superuser", response.data.is_superuser, {
            expires: expiresIn,
          });

          // If "Remember Me" is checked, store the username and password in cookies
          if (rememberMe) {
            Cookies.set("username", formData.username, { expires: expiresIn });
            Cookies.set("password", formData.password, { expires: expiresIn });
          } else {
            // Remove cookies for username and password when not remembered
            Cookies.remove("username");
            Cookies.remove("password");
          }

          // Navigate the user back or to their profile page
          window.history.back();
        }
      } catch (error) {
        setLoading(false);
        setFormErrors((prev) => ({
          ...prev,
          credentials: "Credentials don't match!",
        }));
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

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe); // Toggle "Remember Me" checkbox
  };

  return (
    <>
      {loading ? (
        <LoaderH />
      ) : (
        <div className="min-h-max flex flex-col bg-[url('/public/assets/User/background.jpg')] bg-cover bg-center">
          <div className="flex flex-col items-center justify-center gap-4 ml-0 md:ml-[50%] py-[8%] bg-white md:!bg-transparent">
            <h1 className="text-black text-3xl font-bold">Login</h1>
            <div className="flex flex-col w-3/4 items-center justify-center gap-2 px-0 xl:!px-16">
              <span className="text-red-500 mt-2 text-lg font-semibold">
                {formErrors.credentials}
              </span>
              <div className="w-full">
                <div className="flex flex-col w-full mb-1.5">
                  <text className="font-semibold text-gray-700 ml-0.5">
                    Username<span className="text-red-500">*</span>
                  </text>
                  <input
                    type="text"
                    className="p-2 rounded focus:outline-none focus:ring-0 border border-2 border-gray-400"
                    placeholder="Please enter username"
                    onChange={handleChange}
                    name="username"
                    value={formData.username}
                  />
                  <span className="text-red-500 mt-0.5 text-sm">
                    {formErrors.username}
                  </span>
                </div>
                <div className="flex flex-col w-full relative">
                  <text className="font-semibold text-gray-700 ml-0.5">
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
                    className="absolute font-semibold text-[20px] top-[35px] right-[8px]"
                  >
                    {!visible ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </button>
                  <span className="text-red-500 mt-0.5 text-sm">
                    {formErrors.password}
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

                <div className="flex items-center justify-start w-full gap-1.5 px-1 mt-[5px]">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5"
                    checked={rememberMe}
                    onChange={handleRememberMeChange} // Handle checkbox change
                  />
                  <p className="text-[13px] font-medium">Remember Me!</p>
                </div>
              </div>
            </div>

            <button
              className="px-3 py-2 rounded bg-indigo-600 text-white font-bold"
              onClick={handleSubmit}
            >
              Login
            </button>
            <div className="flex items-center justify-center w-full justify-end gap-2">
              <p>Not a User?</p>
              <Link
                to="/user/register"
                className="text-indigo-600 font-bold hover:underline"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserLogin;
