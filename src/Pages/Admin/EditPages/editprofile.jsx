// import React, { useState, useEffect } from "react";
// import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";
// import Cookies from "js-cookie";
// import "react-quill/dist/quill.snow.css";
// // import "react-quill/dist/quill.bubble.css";
// import ReactQuill from "react-quill";
// import BaseUrl from "../../../Api/baseurl";
// import AdminSearch from "../../../Component/Admin/adminsearch";
// import DoctorSearch from "../../../Component/Doctor/doctorsearch";
// import VendorSearch from "../../../Component/Vendor/vendorsearch";
// import Breadcrumbs from "@mui/material/Breadcrumbs";

// const EditProfile = () => {
//   const navigate = useNavigate();
//   const [isSuperuser, setIsSuperuser] = useState(false);
//   const [isVendor, setIsVendor] = useState(false);
//   const [isStaff, setIsStaff] = useState(false);
//   const [existingImage, setExistingImage] = useState("");

//   const [formData, setFormData] = useState(() => {
//     const initialFormData = {
//       image: "",
//       username: "",
//       role: "",
//       fname: "",
//       lname: "",
//       email: "",
//       phone: "",
//       address: "",
//       gender: "",
//       city: "",
//       state: "",
//       country: "",
//       code: "",
//       amount: "",
//     };

//     if (
//       (isVendor && isStaff && !isSuperuser) ||
//       (!isSuperuser && isStaff && !isVendor)
//     ) {
//       initialFormData.introduction = "";
//       initialFormData.achievements = "";
//     }

//     return initialFormData;
//   });

//   const [formErrors, setFormErrors] = useState({});
//   const [file, setFile] = useState(null);
//   const [imageSrc, setImageSrc] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//     setFormErrors((prevFormErrors) => ({
//       ...prevFormErrors,
//       [name]: "",
//     }));
//   };

//   const validateForm = () => {
//     const errors = {};
//     const {
//       image,
//       username,
//       role,
//       fname,
//       lname,
//       email,
//       phone,
//       gender,
//       address,
//       country,
//       city,
//       state,
//       code,
//       introduction,
//       achievements,
//       amount,
//     } = formData;

//     if (!image) errors.image = "Please upload an image.";
//     if (!username.trim()) errors.username = "Please enter the username.";
//     if (!role.trim()) errors.role = "Please enter the role.";
//     if (!fname.trim()) errors.fname = "Please enter the first name.";
//     if (!lname.trim()) errors.lname = "Please enter the last name.";
//     if (!email.trim()) errors.email = "Please enter your email address.";
//     else if (!isValidEmail(email.trim()))
//       errors.email = "Please enter a valid email address.";
//     if (!phone.trim()) errors.phone = "Please enter the contact number.";
//     else if (!/^\d{10}$/.test(phone.trim()))
//       errors.phone = "Please enter a valid contact number (10 digits).";
//     if (!gender.trim()) errors.gender = "Please enter a gender.";
//     if (!address.trim()) errors.address = "Please enter the address.";
//     if (country === "") errors.country = "Please select a country.";
//     if (!city.trim()) errors.city = "Please enter the city.";
//     if (!state.trim()) errors.state = "Please enter the state.";

//     if (
//       (isVendor && isStaff && !isSuperuser) ||
//       (!isSuperuser && isStaff && !isVendor)
//     ) {
//       if (!introduction) errors.introduction = "Please enter the introduction.";
//       if (!achievements) errors.achievements = "Please enter the achievements.";
//       if (!amount) errors.amount = "Please enter the amount.";
//     }

//     // Ensure `code` is a string before calling trim
//     const codeStr = String(code || "");
//     if (!codeStr.trim()) errors.code = "Please enter the zipcode.";
//     else if (!isValidPinCode(codeStr.trim()))
//       errors.code = "Please enter a valid zipcode.";

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       const formDataToSend = new FormData();
//       Object.keys(formData).forEach((key) =>
//         formDataToSend.append(key, formData[key])
//       );

//       if (file) {
//         formDataToSend.append("image", file);
//       }

//       try {
//         const confirmationResult = await Swal.fire({
//           title: "Update?",
//           text: "Do you want to update your profile details?",
//           icon: "question",
//           showCancelButton: true,
//           confirmButtonText: "Yes",
//           cancelButtonText: "No",
//         });

//         if (confirmationResult.isConfirmed) {
//           const user = Cookies.get("username");
//           const url = isSuperuser
//             ? `${BaseUrl}clinic/admin/`
//             : `${BaseUrl}clinic/staff-list/${user}/`;

//           const response = await axios.put(url, formDataToSend, {
//             headers: { "Content-Type": "multipart/form-data" },
//           });

//           await fetchData();
//           Swal.fire({
//             title: "Updated Successfully",
//             text: "Profile details updated successfully.",
//             icon: "success",
//             confirmButtonText: "Okay",
//           });

//           if (isSuperuser) {
//             navigate("/admin/myprofile");
//           } else if (isVendor) {
//             navigate("/vendor/myprofile");
//           } else {
//             navigate("/doctor/myprofile");
//           }
//         }
//       } catch (error) {
//         console.error("Error updating profile:", error);
//         Swal.fire({
//           title: "Update Failed",
//           text: "There was an error updating your profile.",
//           icon: "error",
//           confirmButtonText: "Okay",
//         });
//       }
//     }
//   };

//   const handleEditorChange = (value) => {
//     setFormData({
//       ...formData,
//       achievements: value,
//     });
//     setFormErrors({
//       ...formErrors,
//       achievements: "",
//     });
//   };
//   const isValidEmail = (email) =>
//     /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
//   const isValidPinCode = (code) => /^\d{5}(\d{1,2})?$/.test(code);

//   const handleReset = () => {
//     setFormErrors({});

//     setFormData({
//       image: "",
//       username: "",
//       role: "",
//       fname: "",
//       lname: "",
//       email: "",
//       phone: "",
//       address: "",
//       gender: "",
//       city: "",
//       state: "",
//       country: "",
//       zipcode: "",

//       ...((isVendor && isStaff && !isSuperuser) ||
//       (!isSuperuser && isStaff && !isVendor)
//         ? {
//             introduction: "",
//             achievements: "",
//           }
//         : {}),
//     });

//     setFile(null);
//     setImageSrc("");
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImageSrc(e.target.result);
//       };
//       reader.readAsDataURL(file);
//       setFile(file);
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         image: file,
//       }));
//       setFormErrors((prevFormErrors) => ({
//         ...prevFormErrors,
//         image: "",
//       }));
//     }
//   };

//   const fetchData = async (url) => {
//     const user = Cookies.get("username");

//     try {
//       const response = await axios.get(url);
//       setFormData(response.data);
//       setExistingImage(response.data.image);
//     } catch (error) {
//       if (error.code === "ERR_BAD_REQUEST") {
//         Swal.fire({
//           icon: "warning",
//           title: "Session expired. Please login again.",
//         });
//         Cookies.remove("token");
//         Cookies.remove("username");
//         Cookies.remove("is_superuser");
//         Cookies.remove("is_staff");
//         Cookies.remove("is_vendor");
//         Cookies.remove("status");
//         Cookies.remove("roles");
//         Cookies.remove("subroles");
//         if (isSuperuser) {
//           navigate("/admin/login");
//         } else if (isVendor) {
//           navigate("/vendor/login");
//         } else {
//           navigate("/doctor/login");
//         }
//       }
//       console.error("Error fetching data:", error);
//     }
//   };
//   useEffect(() => {
//     const Suser = Cookies.get("is_superuser");
//     const Staff = Cookies.get("is_staff");
//     const Vendor = Cookies.get("is_vendor");
//     setIsSuperuser(Suser === "true");
//     setIsVendor(Cookies.get("is_vendor") === "true");
//     setIsStaff(Cookies.get("is_staff") === "true");
//     if (Suser === "true") {
//       const url = `${BaseUrl}clinic/admin/`;
//       fetchData(url);
//     } else if (Staff === "true" && Vendor === "false") {
//       // If the user is staff (even if also a vendor), treat as staff
//       const username = Cookies.get("username");
//       const url = `${BaseUrl}clinic/staff-list/${username}`;
//       fetchData(url);
//     } else if (Vendor === "true" && Staff === "false") {
//       const user = Cookies.get("username");
//       const apiUrl = `${BaseUrl}clinic/vendor-profile/${user}`;
//       fetchData(apiUrl);
//     } else if (Vendor === "true" && Staff === "true") {
//       const user = Cookies.get("username");
//       const url = `${BaseUrl}clinic/staff-list/${user}`;
//       fetchData(url);
//     } else {
//       console.log("No specific user role detected");
//     }
//   }, []);
//   function handleBreadClick(event) {
//     event.preventDefault();
//   }
//   return (
//     <div className="py-8 px-8 w-full md:w-[80%] xl:w-full">
//       {isSuperuser ? (
//         <AdminSearch />
//       ) : isVendor && !isStaff ? (
//         <VendorSearch />
//       ) : isVendor && isStaff ? (
//         <DoctorSearch />
//       ) : isStaff && !isVendor ? (
//         <DoctorSearch />
//       ) : null}
//       <div role="presentation" onClick={handleBreadClick} className="ml-1">
//             <Breadcrumbs separator="›" aria-label="breadcrumb">
//               <Link
//                 className="hover:underline"
//                 color="inherit"
//                 to={isSuperuser ? "/admin/" : isVendor ? "/vendor" : "/doctor"}
//               >
//                 Dashboard
//               </Link>
//               <Link
//                 className="hover:underline text-inherit"
//                 color="inherit"
//                 to={
//                   isSuperuser
//                     ? "/admin/myprofile"
//                     : isVendor
//                     ? "/vendor/myprofile"
//                     : "/doctor/myprofile"
//                 }
//               >
//                 My Profile
//               </Link>
//               <Link className="hover:underline text-inherit" color="inherit">
//                 Edit Profile
//               </Link>
//             </Breadcrumbs>
//           </div>

//       <form id="" onSubmit={handleSubmit}>
//         <div className="w-full bg-[#F2F2F2] px-4 py-8 mt-3">
//           <text className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
//             Edit Profile
//           </text>

//           <div className="col-span-full">
//             <div className=" relative mt-2 flex items-center gap-x-3">
//               <img
//                 id="profile-image"
//                 src={formData.image}
//                 alt="Profile"
//                 className="h-24 w-24 rounded-full object-cover"
//               />
//               <input
//                 type="file"
//                 id="file-upload"
//                 accept="image/*"
//                 className="absolute inset-0 opacity-0 cursor-pointer"
//                 onChange={handleFileChange}
//               />
//               <button
//                 type="button"
//                 className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
//                 onClick={() => document.getElementById("file-upload").click()}
//               >
//                 Change
//               </button>
//             </div>
//             {formErrors.image && (
//               <p className="text-red-500">{formErrors.image}</p>
//             )}
//           </div>
//           <h3 className="col-span-full font-semibold text-lg mr-2 mt-2">
//             Personal Info
//           </h3>
//           <div>
//             <div className="space-y-12">
//               <div className="pb-12 ">
//                 <div className="px-4 mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="username"
//                       className="block text-sm font-medium leading-6 text-gray-900"
//                     >
//                       User Name:
//                       <span className="text-red-500">*</span>
//                     </label>

//                     <div className="mt-2">
//                       <input
//                         id="username"
//                         name="username"
//                         type="text"
//                         value={formData.username}
//                         onChange={handleChange}
//                         autoComplete="given-name"
//                         className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       />
//                       {formErrors.username && (
//                         <p className="text-red-500">{formErrors.username}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="role"
//                       className="block text-sm font-medium leading-6 text-gray-900"
//                     >
//                       Role:
//                       <span className="text-red-500">*</span>
//                     </label>

//                     <div className="mt-2">
//                       <input
//                         id="role"
//                         name="role"
//                         type="text"
//                         value={formData.role}
//                         onChange={handleChange}
//                         autoComplete="given-name"
//                         className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       />
//                       {formErrors.role && (
//                         <p className="text-red-500">{formErrors.role}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="fname"
//                       className="block text-sm font-medium leading-6 text-gray-900"
//                     >
//                       First Name:
//                       <span className="text-red-500">*</span>
//                     </label>

//                     <div className="mt-2">
//                       <input
//                         id="fname"
//                         name="fname"
//                         type="text"
//                         value={formData.fname}
//                         onChange={handleChange}
//                         autoComplete="given-name"
//                         className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       />
//                       {formErrors.fname && (
//                         <p className="text-red-500">{formErrors.fname}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="lname"
//                       className="block text-sm font-medium leading-6 text-gray-900"
//                     >
//                       Last Name:
//                       <span className="text-red-500">*</span>
//                     </label>

//                     <div className="mt-2">
//                       <input
//                         id="lname"
//                         name="lname"
//                         type="text"
//                         value={formData.lname}
//                         onChange={handleChange}
//                         autoComplete="family-name"
//                         className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       />
//                       {formErrors.lname && (
//                         <p className="text-red-500">{formErrors.lname}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="email"
//                       className="block text-sm font-medium leading-6 text-gray-900"
//                     >
//                       Email Address:
//                       <span className="text-red-500">*</span>
//                     </label>

//                     <div className="mt-2">
//                       <input
//                         id="email"
//                         name="email"
//                         type="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         autoComplete="email"
//                         className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       />
//                       {formErrors.email && (
//                         <p className="text-red-500">{formErrors.email}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="phone"
//                       className="block text-sm font-medium leading-6 text-gray-900"
//                     >
//                       Phone Number:
//                       <span className="text-red-500">*</span>
//                     </label>

//                     <div className="mt-2">
//                       <input
//                         id="phone"
//                         name="phone"
//                         type="text"
//                         value={formData.phone}
//                         // onChange={handleChange}
//                         onChange={(e) => {
//                           const digitsOnly = e.target.value.replace(/\D/g, ""); 
//                           if (digitsOnly.length <= 10) { 
//                             handleChange({ target: { name: "phone", value: digitsOnly } });
//                           }
//                         }}
//                         autoComplete="tel"
//                         className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       />
//                       {formErrors.phone && (
//                         <p className="text-red-500">{formErrors.phone}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="sm:col-span-6">
//                     <label
//                       htmlFor="address"
//                       className="block text-sm font-medium leading-6 text-gray-900"
//                     >
//                       Address:
//                       <span className="text-red-500">*</span>
//                     </label>

//                     <div className="mt-2">
//                       <textarea
//                         id="address"
//                         name="address"
//                         type="text"
//                         value={formData.address}
//                         onChange={handleChange}
//                         autoComplete="street-address"
//                         className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       />
//                       {formErrors.address && (
//                         <p className="text-red-500">{formErrors.address}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="sm:col-span-3">
//                     <label className="block text-sm font-medium leading-6 text-gray-900">
//                       Gender:
//                       <span className="text-red-500">*</span>
//                     </label>

//                     <div className="mt-2 flex gap-x-4">
//                       <div className="flex items-center">
//                         <input
//                           id="male"
//                           name="gender"
//                           type="radio"
//                           value="male"
//                           checked={formData.gender === "male"}
//                           onChange={handleChange}
//                           className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
//                         />
//                         <label
//                           htmlFor="male"
//                           className="ml-3 block text-sm font-medium leading-6 text-gray-900"
//                         >
//                           Male
//                         </label>
//                       </div>

//                       <div className="flex items-center">
//                         <input
//                           id="female"
//                           name="gender"
//                           type="radio"
//                           value="female"
//                           checked={formData.gender === "female"}
//                           onChange={handleChange}
//                           className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
//                         />
//                         <label
//                           htmlFor="female"
//                           className="ml-3 block text-sm font-medium leading-6 text-gray-900"
//                         >
//                           Female
//                         </label>
//                       </div>
//                     </div>
//                     {formErrors.gender && (
//                       <p className="text-red-500">{formErrors.gender}</p>
//                     )}
//                   </div>

//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="country"
//                       className="block text-sm font-medium leading-6 text-gray-900"
//                     >
//                       Country:
//                       <span className="text-red-500">*</span>
//                     </label>
//                     <div className="mt-2">
//                       <select
//                         id="country"
//                         name="country"
//                         value={formData.country}
//                         onChange={handleChange}
//                         autoComplete="country-name"
//                         className="block w-full h-9 bg-white rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600  sm:text-sm sm:leading-6"
//                       >
//                         <option value="">Please Select a Country....</option>
//                         <option value="India">India</option>
//                         <option value="USA">USA</option>
//                         <option value="UK">UK</option>
//                       </select>
//                     </div>
//                     <span className="text-red-500 mt-2 text-sm">
//                       {formErrors.country}
//                     </span>
//                   </div>
//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="state"
//                       className="block text-sm font-medium leading-6 text-gray-900"
//                     >
//                       State/Province:
//                       <span className="text-red-500">*</span>
//                     </label>

//                     <div className="mt-2">
//                       <input
//                         id="state"
//                         name="state"
//                         type="text"
//                         value={formData.state}
//                         onChange={handleChange}
//                         autoComplete="state"
//                         className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       />
//                       {formErrors.state && (
//                         <p className="text-red-500">{formErrors.state}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="city"
//                       className="block text-sm font-medium leading-6 text-gray-900"
//                     >
//                       City:
//                       <span className="text-red-500">*</span>
//                     </label>

//                     <div className="mt-2">
//                       <input
//                         id="city"
//                         name="city"
//                         type="text"
//                         value={formData.city}
//                         onChange={handleChange}
//                         autoComplete="city"
//                         className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       />
//                       {formErrors.city && (
//                         <p className="text-red-500">{formErrors.city}</p>
//                       )}
//                     </div>
//                   </div>



//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="zipcode"
//                       className="block text-sm font-medium leading-6 text-gray-900"
//                     >
//                       ZIP/Postal Code:
//                       <span className="text-red-500">*</span>
//                     </label>

//                     <div className="mt-2">
//                       <input
//                         id="zipcode"
//                         name="code"
//                         type="text"
//                         value={formData.code}
//                         onChange={handleChange}
//                         autoComplete="zipcode"
//                         className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       />
//                       {formErrors.zipcode && (
//                         <p className="text-red-500">{formErrors.code}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="country"
//                       className="block text-sm font-medium leading-6 text-gray-900"
//                     >
//                       Visiting Charge
//                       <span className="text-red-500">*</span>
//                     </label>
//                     <div className="mt-2">
//                       <input
//                         id="amount"
//                         name="amount"
//                         value={formData.amount}
//                         onChange={handleChange}
//                         autoComplete="country-name"
//                         className="block w-full h-9 bg-white rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600  sm:text-sm sm:leading-6"
//                       />
//                     </div>
//                     <span className="text-red-500 mt-2 text-sm">
//                       {formErrors.amount}
//                     </span>
//                   </div>

//                   {(isVendor && isStaff && !isSuperuser) ||
//                   (!isSuperuser && isStaff && !isVendor) ? (
//                     <>
//                       <div className="col-span-full">
//                         <label
//                           htmlFor="introduction"
//                           className="block text-md font-medium leading-6 text-gray-900"
//                         >
//                           Introduction<span className="text-red-500">*</span>
//                         </label>
//                         <div className="mt-2">
//                           <textarea
//                             id="introduction"
//                             name="introduction"
//                             type="text"
//                             value={formData.introduction}
//                             onChange={handleChange}
//                             autoComplete="introduction"
//                             className="block w-full h-24 rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                           />
//                         </div>
//                         {formErrors.introduction && (
//                           <span className="text-red-500 mt-2 text-sm">
//                             {formErrors.introduction}
//                           </span>
//                         )}
//                       </div>

//                       <div className="col-span-full">
//                         <label
//                           htmlFor="achievements"
//                           className="block text-md font-medium leading-6 text-gray-900"
//                         >
//                           Achievements
//                           <span className="text-red-500">*</span>
//                         </label>
//                         <div className="mt-2">
//                           {/* <textarea
//                                                 id="description"
//                                                 name="text"
//                                                 value={formData.text}
//                                                 onChange={handleChange}
//                                                 rows={4}
//                                                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                                             /> */}
//                           <ReactQuill
//                             id="achievements"
//                             name="achievements"
//                             value={formData.achievements || ""}
//                             onChange={handleEditorChange}
//                             // theme="snow"
//                             className="h-28"
//                           />
//                         </div>
//                         <span className="text-red-500 mt-2 text-sm">
//                           {formErrors.achievements}
//                         </span>
//                       </div>
//                     </>
//                   ) : null}
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 flex items-center justify-start gap-x-6 px-4">
//               <button
//                 type="submit"
//                 className="rounded-[10px] w-[150px] bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 Save
//               </button>
//               <button
//                 type="reset"
//                 onClick={() => handleReset()}
//                 className="rounded-[10px] w-[150px]  px-3 py-2 text-sm font-semibold text-black shadow-sm border border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 Reset
//               </button>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditProfile;


import React, { useState, useEffect } from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import BaseUrl from "../../../Api/baseurl";
import AdminSearch from "../../../Component/Admin/adminsearch";
import DoctorSearch from "../../../Component/Doctor/doctorsearch";
import VendorSearch from "../../../Component/Vendor/vendorsearch";
import Breadcrumbs from "@mui/material/Breadcrumbs";

const EditProfile = () => {
  const navigate = useNavigate();

  // Role states
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Form data state with initial empty strings for all fields
  const [formData, setFormData] = useState({
    image: "",
    username: "",
    role: "",
    fname: "",
    lname: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    city: "",
    state: "",
    country: "",
    code: "",
    amount: "",
    introduction: "",
    achievements: "",
  });

  // Additional states for image handling and form errors
  const [formErrors, setFormErrors] = useState({});
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState("");

  // Helper function to determine the profile URL based on user roles
  const getProfileUrl = () => {
    const user = Cookies.get("username");
    if (isSuperuser) {
      return `${BaseUrl}clinic/admin/`;
    } else if (isStaff && !isVendor) {
      return `${BaseUrl}clinic/staff-list/${user}/`;
    } else if (isVendor && !isStaff) {
      return `${BaseUrl}clinic/vendor-profile/${user}/`;
    } else if (isVendor && isStaff) {
      return `${BaseUrl}clinic/staff-list/${user}/`;
    }
    return null;
  };
  const putProfileUrl = () => {
    const user = Cookies.get("username");
    if (isSuperuser) {
      return `${BaseUrl}clinic/admin/`;
    } else if (isStaff && !isVendor) {
      return `${BaseUrl}clinic/staff-list/${user}/`;
    } else if (isVendor && !isStaff) {
      return `${BaseUrl}clinic/vendor-profile-view/${formData.id}/`;
    } else if (isVendor && isStaff) {
      return `${BaseUrl}clinic/staff-list/${user}/`;
    }
    return null;
  };

  // Fetch profile data from the server
  const fetchData = async (url) => {
    try {
      setIsLoading(true);
      const response = await axios.get(url);
      console.log("Fetched data:", response.data); // Log for debugging
      // Explicitly map server response to formData keys
      setFormData({
        id: response.data.id || "",
        image: response.data.image || "",
        username: response.data.username || "",
        role: response.data.role || "",
        fname: response.data.fname || response.data.first_name || "",
        lname: response.data.lname || response.data.last_name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        address: response.data.address || "",
        gender: response.data.gender || "",
        city: response.data.city || "",
        state: response.data.state || "",
        country: response.data.country || "",
        code: response.data.code || response.data.postal_code || "",
        amount: response.data.amount || "",
        introduction: response.data.introduction || "",
        achievements: response.data.achievements || "",
      });
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
      }
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize role states and fetch data on mount
  useEffect(() => {
    const Suser = Cookies.get("is_superuser") === "true";
    const Staff = Cookies.get("is_staff") === "true";
    const Vendor = Cookies.get("is_vendor") === "true";
    setIsSuperuser(Suser);
    setIsVendor(Vendor);
    setIsStaff(Staff);
  }, []);

  // Fetch data when roles are set
  useEffect(() => {
    const url = getProfileUrl();
    if (url) {
      fetchData(url);
    } else {
      setIsLoading(false);
      console.log("No specific user role detected");
    }
  }, [isSuperuser, isVendor, isStaff]); // Depend on role states

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: "",
    }));
  };

  // Handle rich text editor changes for achievements
  const handleEditorChange = (value) => {
    setFormData({
      ...formData,
      achievements: value,
    });
    setFormErrors({
      ...formErrors,
      achievements: "",
    });
  };

  // Handle file input changes for image upload
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
      setFormErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  // Validation functions
  const isValidEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const isValidPinCode = (code) => /^\d{5}(\d{1,2})?$/.test(code);

  // Validate form data
  const validateForm = () => {
    const errors = {};
    const {
      image,
      username,
      role,
      fname,
      lname,
      email,
      phone,
      gender,
      address,
      country,
      city,
      state,
      code,
      introduction,
      achievements,
      amount,
    } = formData;

    if (!image && !file) errors.image = "Please upload an image.";
    if (!username) errors.username = "Please enter the username.";
    if (!role.trim()) errors.role = "Please enter the role.";
    if (!fname.trim()) errors.fname = "Please enter the first name.";
    if (!lname.trim()) errors.lname = "Please enter the last name.";
    if (!email.trim()) errors.email = "Please enter your email address.";
    else if (!isValidEmail(email.trim()))
      errors.email = "Please enter a valid email address.";
    if (!phone.trim()) errors.phone = "Please enter the contact number.";
    else if (!/^\d{10}$/.test(phone.trim()))
      errors.phone = "Please enter a valid contact number (10 digits).";
    if (!gender.trim()) errors.gender = "Please enter a gender.";
    if (!address.trim()) errors.address = "Please enter the address.";
    if (country === "") errors.country = "Please select a country.";
    if (!city.trim()) errors.city = "Please enter the city.";
    if (!state.trim()) errors.state = "Please enter the state.";
    if (!code.trim()) errors.code = "Please enter the zipcode.";
    else if (!isValidPinCode(code.trim()))
      errors.code = "Please enter a valid zipcode.";

    if (
      (isVendor && isStaff && !isSuperuser) ||
      (!isSuperuser && isStaff && !isVendor)
    ) {
      if (!introduction) errors.introduction = "Please enter the introduction.";
      if (!achievements) errors.achievements = "Please enter the achievements.";
      if (!amount) errors.amount = "Please enter the amount.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "image") {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (file) {
        formDataToSend.append("image", file);
      }
      try {
        const confirmationResult = await Swal.fire({
          title: "Update?",
          text: "Do you want to update your profile details?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          const url = putProfileUrl();
          if (url) {
            const response = await axios.put(url, formDataToSend, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            await fetchData(url);
            Swal.fire({
              title: "Updated Successfully",
              text: "Profile details updated successfully.",
              icon: "success",
              confirmButtonText: "Okay",
            });
            if (isSuperuser) {
              navigate("/admin/myprofile");
            } else if (isVendor) {
              navigate("/vendor/myprofile");
            } else {
              navigate("/doctor/myprofile");
            }
          }
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        Swal.fire({
          title: "Update Failed",
          text: "There was an error updating your profile.",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormErrors({});
    setFile(null);
    setImageSrc("");
    const url = getProfileUrl();
    if (url) {
      fetchData(url);
    }
  };

  // Breadcrumb click handler
  function handleBreadClick(event) {
    event.preventDefault();
  }

  // Show loading indicator while fetching data
  if (isLoading) {
    return <div className="py-8 px-8">Loading profile data...</div>;
  }

  return (
    <div className="py-8 px-8 w-full md:w-[80%] xl:w-full">
      {/* Render search component based on user role */}
      {isSuperuser ? (
        <AdminSearch />
      ) : isVendor && !isStaff ? (
        <VendorSearch />
      ) : (isVendor && isStaff) || (isStaff && !isVendor) ? (
        <DoctorSearch />
      ) : null}

      {/* Breadcrumbs */}
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
                ? "/admin/myprofile"
                : isVendor
                ? "/vendor/myprofile"
                : "/doctor/myprofile"
            }
          >
            My Profile
          </Link>
          <Link className="hover:underline text-inherit" color="inherit">
            Edit Profile
          </Link>
        </Breadcrumbs>
      </div>

      {/* Form */}
      <form id="edit-profile-form" onSubmit={handleSubmit}>
        <div className="w-full bg-[#F2F2F2] px-4 py-8 mt-3">
          <text className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Edit Profile
          </text>

          {/* Image Upload Section */}
          <div className="col-span-full">
            <div className="relative mt-2 flex items-center gap-x-3">
              <img
                id="profile-image"
                src={imageSrc || formData.image || "/default-avatar.png"}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover"
              />
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => document.getElementById("file-upload").click()}
              >
                Change
              </button>
            </div>
            {formErrors.image && (
              <p className="text-red-500">{formErrors.image}</p>
            )}
          </div>

          {/* Personal Info Section */}
          <h3 className="col-span-full font-semibold text-lg mr-2 mt-2">
            Personal Info
          </h3>
          <div>
            <div className="space-y-12">
              <div className="pb-12">
                <div className="pr-4 mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  {/* Username */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      User Name:
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username || ""}
                        onChange={handleChange}
                        autoComplete="given-name"
                        readOnly
                        className="block w-full cursor-not-allowed rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6"
                      />
                      {formErrors.username && (
                        <p className="text-red-500">{formErrors.username}</p>
                      )}
                    </div>
                  </div>

                  {/* Role */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Role:
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="role"
                        name="role"
                        type="text"
                        value={formData.role || ""}
                        onChange={handleChange}
                        autoComplete="organization-title"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formErrors.role && (
                        <p className="text-red-500">{formErrors.role}</p>
                      )}
                    </div>
                  </div>

                  {/* First Name */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="fname"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      First Name:
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="fname"
                        name="fname"
                        type="text"
                        value={formData.fname || ""}
                        onChange={handleChange}
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formErrors.fname && (
                        <p className="text-red-500">{formErrors.fname}</p>
                      )}
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="lname"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Last Name:
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="lname"
                        name="lname"
                        type="text"
                        value={formData.lname || ""}
                        onChange={handleChange}
                        autoComplete="family-name"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formErrors.lname && (
                        <p className="text-red-500">{formErrors.lname}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email:
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        autoComplete="email"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formErrors.email && (
                        <p className="text-red-500">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Contact Number:
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        autoComplete="tel"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formErrors.phone && (
                        <p className="text-red-500">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Address:
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address || ""}
                        onChange={handleChange}
                        autoComplete="street-address"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formErrors.address && (
                        <p className="text-red-500">{formErrors.address}</p>
                      )}
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Gender:
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender || ""}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {formErrors.gender && (
                        <p className="text-red-500">{formErrors.gender}</p>
                      )}
                    </div>
                  </div>

                  {/* City */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      City:
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city || ""}
                        onChange={handleChange}
                        autoComplete="address-level2"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formErrors.city && (
                        <p className="text-red-500">{formErrors.city}</p>
                      )}
                    </div>
                  </div>

                  {/* State */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      State:
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="state"
                        name="state"
                        type="text"
                        value={formData.state || ""}
                        onChange={handleChange}
                        autoComplete="address-level1"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formErrors.state && (
                        <p className="text-red-500">{formErrors.state}</p>
                      )}
                    </div>
                  </div>

                  {/* Country */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Country:
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <select
                        id="country"
                        name="country"
                        value={formData.country || ""}
                        onChange={handleChange}
                        autoComplete="country-name"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Select Country</option>
                        <option value="India">India</option>
                        {/* Add more countries as needed */}
                      </select>
                      {formErrors.country && (
                        <p className="text-red-500">{formErrors.country}</p>
                      )}
                    </div>
                  </div>

                  {/* ZIP/Postal Code */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="zipcode"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      ZIP/Postal Code:
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="code"
                        name="code"
                        type="text"
                        value={formData.code || ""}
                        onChange={handleChange}
                        autoComplete="postal-code"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formErrors.code && (
                        <p className="text-red-500">{formErrors.code}</p>
                      )}
                    </div>
                  </div>

                  {/* Additional Fields for Staff */}
                  {((isVendor && isStaff && !isSuperuser) ||
                    (!isSuperuser && isStaff && !isVendor)) && (
                    <>
                      {/* Introduction */}
                      <div className="sm:col-span-6">
                        <label
                          htmlFor="introduction"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Introduction:
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            id="introduction"
                            name="introduction"
                            type="text"
                            value={formData.introduction || ""}
                            onChange={handleChange}
                            className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {formErrors.introduction && (
                            <p className="text-red-500">
                              {formErrors.introduction}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Achievements */}
                      <div className="sm:col-span-6">
                        <label
                          htmlFor="achievements"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Achievements:
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <ReactQuill
                            value={formData.achievements || ""}
                            onChange={handleEditorChange}
                            className="h-40"
                          />
                          {formErrors.achievements && (
                            <p className="text-red-500 mt-12">
                              {formErrors.achievements}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="sm:col-span-3 mt-4">
                        <label
                          htmlFor="amount"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Amount:
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            id="amount"
                            name="amount"
                            type="text"
                            value={formData.amount || ""}
                            onChange={handleChange}
                            className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {formErrors.amount && (
                            <p className="text-red-500">{formErrors.amount}</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="mt-6 flex items-center justify-start gap-x-6 px-4">
              <button
                type="submit"
                className="rounded-[10px] w-[150px] bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
              <button
                type="reset"
                onClick={handleReset}
                className="rounded-[10px] w-[150px] px-3 py-2 text-sm font-semibold text-black shadow-sm border border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;