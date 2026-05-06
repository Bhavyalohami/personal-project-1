// import React, { useEffect, useRef, useState } from "react";
// import { PhotoIcon } from "@heroicons/react/24/solid";
// import AdminSearch from "../../../Component/Admin/adminsearch";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";
// import Cookies from "js-cookie";
// import BaseUrl from "../../../Api/baseurl";
// import Breadcrumbs from "@mui/material/Breadcrumbs";
// import { mockRestCountriesData, mockGeoNamesData } from "../../../Mockdata/countries";
// import { mockStatesData } from "../../../Mockdata/states";
// import { mockCitiesData } from "../../../Mockdata/cities";
// const EditVendor = () => {
//   console.log(mockCitiesData, "mockCitiesData");

//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [isSuperuser, setIsSuperuser] = useState(false);
//   const [isStaff, setIsStaff] = useState(false);
//   const [isVendor, setIsVendor] = useState(false);
//   const [formData, setFormData] = useState({
//     fname: "",
//     lname: "",
//     email: "",
//     phone: "",
//     gender: "",
//     role: "",
//     address: "",
//     city: "",
//     zipcode: "",
//     image: "",
//     state: "",
//     country: "",
//   });
//   const [formErrors, setFormErrors] = useState({
//     fname: "",
//     lname: "",
//     email: "",
//     phone: "",
//     gender: "",
//     role: "",
//     address: "",
//     city: "",
//     zipcode: "",
//     image: "",
//     state: "",
//     country: "",
//   });
//   const [error, setError] = useState("");
//   const [file, setFile] = useState(null);
//   const [imageSrc, setImageSrc] = useState("");
//   const [existingImage, setExistingImage] = useState("");
//   const [username, setUsername] = useState([]);
//   const [password, setPassword] = useState("");
//   const [passwordError, setPasswordError] = useState("");
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const country = useRef();
//   const state = useRef();
//   const city = useRef();
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");

//   useEffect(() => {
//     const fetchCountryData = async () => {
//       try {
//         const restCountriesResponse = await fetch(
//           "https://restcountries.com/v3.1/all"
//         );
//         const restCountriesData = await restCountriesResponse.json();

//         const geoNamesResponse = await axios.get(
//           `${BaseUrl}clinic/proxy/geo-names/`                                                                                         
//         );
//         const geoNamesData = geoNamesResponse.data;

//         const geoNamesMap = [];
//         geoNamesData.geonames.forEach((country) => {
//           geoNamesMap[country.countryName] = country.geonameId;
//         });

//         const combinedData = restCountriesData.map((country) => ({
//           name: country.name.common,
//           geonameId: geoNamesMap[country.name.common] || null,
//         }));

//         combinedData.sort((a, b) => a.name.localeCompare(b.name));

//         setCountries(combinedData);
//       } catch (error) {
//         console.error("Error fetching country data:", error);
//       }
//     };

//     fetchCountryData();
//   }, []);

//   const handleCountryChange = (event) => {
//     const countryy = JSON.parse(event.target.value);
//     const countryName = countryy.name;

//     setFormData({
//       ...formData,
//       country: countryName,
//       state: "",
//       city: "",
//     });
//     setStates([]);
//     fetch(
//       `http://api.geonames.org/childrenJSON?geonameId=${countryy.geonameId}&username=shivamlogicspice`
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         const stateNames = data.geonames.map((state) => state.name);
//         setStates(stateNames);
//       })
//       .catch((error) => console.error("Error fetching states:", error));
//   };

//   const handleStateChange = (event) => {
//     const stateName = event.target.value;
//     state.current=stateName
//     setFormData({
//       ...formData,
//       state: state.current,
//       city: "",
//     });
//     fetch(
//       `http://api.geonames.org/searchJSON?name=${stateName}&featureCode=ADM1&username=shivamlogicspice`
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.geonames && data.geonames.length > 0) {
//           const stateGeoId = data.geonames[0].geonameId;
//           fetch(
//             `http://api.geonames.org/childrenJSON?geonameId=${stateGeoId}&username=shivamlogicspice`
//           )
//             .then((response) => response.json())
//             .then((cityData) => {
//               const cityNames = cityData.geonames.map((city) => city.name);
//               setCities(cityNames);
//             })
//             .catch((error) => console.error("Error fetching cities:", error));
//         } else {
//           console.error("State not found in GeoNames data.");
//         }
//       })
//       .catch((error) =>
//         console.error("Error fetching state GeoNameId:", error)
//       );
//   };

//   const getData = async () => {
//     const apiUrl = `${BaseUrl}clinic/vendor-profile-view/${id}/`;

//     const token = Cookies.get("token");
//     try {
//       await axios.get(apiUrl, {
//         headers: {
//           Authorization: `Token ${token}`,
//         },
//       });

//       setFormData(response.data.vendor);
//       // console.log(formData.state,"stateee")  
//       setUsername(response.data.Uname);
//       setImageSrc(response.data.vendor.image);
//       setExistingImage(response.data.vendor.image);
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
//           navigate("/doctor/login")
//         }
//       }
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     setIsSuperuser(Cookies.get("is_superuser") === "true");
//     setIsStaff(Cookies.get("is_staff") === "true");
//     setIsVendor(Cookies.get("is_vendor") === "true");
//     getData();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//     setFormErrors({
//       ...formErrors,
//       [name]: "",
//     });
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPassword(value);
//     setPasswordError("");
//   };

//   const validateForm = () => {
//     let isValid = true;
//     const errors = { ...formErrors };

//     if (!formData.fname.trim()) {
//       errors.fname = "Please enter the first name.";
//       isValid = false;
//     }

//     if (!formData.lname.trim()) {
//       errors.lname = "Please enter the last name.";
//       isValid = false;
//     }

//     if (!formData.email?.trim()) {
//       errors.email = "Please enter your email address.";
//       isValid = false;
//     } else if (!isValidEmail(formData.email.trim())) {
//       errors.email = "Please enter a valid email address.";
//       isValid = false;
//     }

//     if (!formData.role?.trim()) {
//       errors.role = "Please select the designation.";
//       isValid = false;
//     }

//     if (!formData.phone.trim()) {
//       errors.phone = "Please select the contact number.";
//       isValid = false;
//     }

//     if (!formData.address.trim()) {
//       errors.address = "Please enter the address.";
//       isValid = false;
//     }

//     if (!formData.city.trim()) {
//       errors.city = "Please enter the city.";
//       isValid = false;
//     }
//     // const codeStr = formData.code?.toString() || '';
//     if (!formData.zipcode) {
//       errors.zipcode = "Please enter the code.";
//       isValid = false;
//     } else if (!isvalidPinCode(formData.zipcode)) {
//       errors.zipcode = "Please enter a valid Pin Code.";
//       isValid = false;
//     }

//     if (!formData.state.trim()) {
//       errors.state = "Please enter a state";
//       isValid = false;
//     }
//     if (!formData.country.trim()) {
//       errors.country = "Please enter a country";
//       isValid = false;
//     }

//     if (formData.gender === "") {
//       errors.gender = "Please select a gender";
//       isValid = false;
//     }

//     if (!formData.image) {
//       errors.image = "Please upload an image.";
//       isValid = false;
//     }

//     setFormErrors(errors);
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const isValid = validateForm();

//     if (isValid) {
//       const formDataToSend = new FormData();

//       Object.keys(formData).forEach((key) => {
//         formDataToSend.append(key, formData[key]);
//       });

//       if (file) {
//         formDataToSend.append("image", file);
//       }

//       const result = await Swal.fire({
//         title: "Are you sure?",
//         text: "You won't be able to revert this!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes, Update it!",
//         cancelButtonText: "No, cancel!",
//         reverseButtons: true,
//       });
//       if (result?.isConfirmed) {
//         try {
//           await axios.put(
//             `${BaseUrl}clinic/vendor-profile-view/${id}/`,
//             formDataToSend,
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//           Swal.fire({
//             title: "Success!",
//             text: "Vendor information has been updated successfully.",
//             icon: "success",
//             confirmButtonText: "OK",
//           });
//           navigate("/admin/vendor");
//         } catch (error) {
//           Swal.fire({
//             title: "Error!",
//             text: `There was an issue updating vendor information: ${error.message}`,
//             icon: "error",
//             confirmButtonText: "OK",
//           });
//         }
//       }
//     }
//   };

//   const isValidEmail = (email) => {
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     return emailRegex.test(email);
//   };

//   const isvalidPinCode = (zipcode) => {
//     const pinCodeRegex = /^\d{5}(\d{1,2})?$/;
//     return pinCodeRegex.test(zipcode);
//   };

//   const handleUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) {
//       setError("Please select an image file.");
//       return;
//     }

//     const maxSize = 2 * 1024 * 1024;
//     if (file.size > maxSize) {
//       setError("File size exceeds 2MB.");
//       return;
//     }

//     const allowedTypes = ["image/jpeg", "image/png"];
//     if (!allowedTypes.includes(file.type)) {
//       setError("File type is not allowed. Please select a JPEG or PNG image.");
//       return;
//     }

//     const img = new Image();
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       img.src = e.target.result;
//     };

//     img.onload = () => {
//       const maxWidth = 2000;
//       const maxHeight = 2000;

//       if (img.width > maxWidth || img.height > maxHeight) {
//         setError(`Image dimensions exceed ${maxWidth}x${maxHeight} pixels.`);
//         return;
//       } else {
//         setError("");
//         setFile(file);
//         setImageSrc(URL.createObjectURL(file));
//         setFormData({
//           ...formData,
//           image: file,
//         });
//         setFormErrors({
//           ...formErrors,
//           image: "",
//         });
//       }
//     };

//     img.onerror = () => {
//       setError("Error loading image.");
//     };

//     reader.readAsDataURL(file);
//   };

//   const handleChangePassword = async () => {
//     if (password === "") {
//       setPasswordError("Please enter a password.");
//       return;
//     }

//     try {
//       const confirmationResult = await Swal.fire({
//         title: "Update?",
//         text: "Do you want to update Password?",
//         icon: "question",
//         showCancelButton: true,
//         confirmButtonText: "Yes",
//         cancelButtonText: "No",
//       });

//       if (confirmationResult.isConfirmed) {
//         const token = Cookies.get("token");
//         await axios.post(
//           `${BaseUrl}clinic/changepassword/`,
//           {
//             username: username,
//             new_password: password,
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Token ${token}`,
//             },
//           }
//         );

//         Swal.fire({
//           title: "Updated Successfully",
//           text: "Password Updated Successfully",
//           icon: "success",
//           confirmButtonText: "Okay",
//         });
//         if (isSuperuser) {
//           navigate("/admin/staff");
//         } else if (isVendor) {
//           navigate("/vendor/staff");
//         } else {
//           navigate("/doctor/staff");
//         }
//       }
//     } catch (error) {
//       console.error(error);
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
//       Swal.fire({
//         title: "Error",
//         text: "There was a problem updating the password.",
//         icon: "error",
//         confirmButtonText: "Okay",
//       });
//     }
//   };
//   function handleBreadClick(event) {
//     event.preventDefault();
//     // console.info("You clicked a breadcrumb.");
//   }
//   return (
//     <div className="legacy-panel-page py-8 px-8 w-full md:w-[80%] xl:w-full">
//       <AdminSearch />

//       <div role="presentation" onClick={handleBreadClick} className="ml-1">
//         <Breadcrumbs separator="›" aria-label="breadcrumb">
//           <Link
//             className="hover:underline"
//             color="inherit"
//             to={isSuperuser ? "/admin/" : isVendor ? "/vendor" : "/doctor"}
//           >
//             Dashboard
//           </Link>
//           <Link
//             className="hover:underline text-inherit"
//             color="inherit"
//             to="/admin/vendor"
//           >
//             Manage Vendor
//           </Link>
//           <Link className="hover:underline text-inherit" color="inherit">
//             Edit Vendor
//           </Link>
//         </Breadcrumbs>
//       </div>
//       <div className="legacy-panel-surface w-full min-h-screen px-4 py-8 mt-3">
//         <div className="flex items-center justify-between">
//           <span className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
//             Edit Vendor
//           </span>
//         </div>
//         <div>
//           <form
//             id="EditStaff"
//             onSubmit={handleSubmit}
//             encType="multipart/form-data"
//           >
//             <div className="space-y-12">
//               <div className="pb-12">
//                 <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="first-name"
//                       className="block text-md font-medium leading-6 text-gray-900"
//                     >
//                       First name<span className="text-red-500">*</span>
//                     </label>
//                     <div className="mt-2">
//                       <input
//                         id="fname"
//                         name="fname"
//                         type="text"
//                         value={formData.fname}
//                         onChange={handleChange}
//                         autoComplete="given-name"
//                         className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       />
//                     </div>
//                     <span className="text-red-500 mt-2 text-sm">
//                       {formErrors.fname}
//                     </span>
//                   </div>

//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="last-name"
//                       className="block text-md font-medium leading-6 text-gray-900"
//                     >
//                       Last name<span className="text-red-500">*</span>
//                     </label>
//                     <div className="mt-2">
//                       <input
//                         id="lname"
//                         name="lname"
//                         value={formData.lname}
//                         onChange={handleChange}
//                         type="text"
//                         autoComplete="family-name"
//                         className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       />
//                     </div>
//                     <span className="text-red-500 mt-2 text-sm">
//                       {formErrors.lname}
//                     </span>
//                   </div>

//                   {/* <div className="sm:col-span-3">
//                     <label
//                       htmlFor="username"
//                       className="block text-md font-medium leading-6 text-gray-900"
//                     >
//                       Username<span className="text-red-500">*</span>
//                     </label>
//                     <div className="mt-2">
//                       <input
//                         id="username"
//                         name="username"
//                         value={formData.username}
//                         onChange={handleChange}
//                         type="text"
//                         autoComplete="family-name"
//                         readOnly
//                         className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       />
//                     </div>
//                     <span className="text-red-500 mt-2 text-sm">
//                       {formErrors.username}
//                     </span>
//                   </div> */}
//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="gender"
//                       className="block text-md font-medium leading-6 text-gray-900"
//                     >
//                       Gender<span className="text-red-600">*</span>
//                     </label>
//                     <div className="mt-2">
//                       <select
//                         id="gender"
//                         name="gender"
//                         value={formData.gender}
//                         onChange={handleChange}
//                         className="block w-full px-2 rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600  sm:text-sm sm:leading-6"
//                       >
//                         <option value="">Select Gender </option>
//                         <option value="male">Male</option>
//                         <option value="female">Female</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     </div>
//                     <span className="text-red-500 mt-2 text-sm">
//                       {formErrors.gender}
//                     </span>
//                   </div>

//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="email"
//                       className="block text-md font-medium leading-6 text-gray-900"
//                     >
//                       Email address<span className="text-red-500">*</span>
//                     </label>
//                     <div className="mt-2">
//                       <input
//                         id="email"
//                         name="email"
//                         type="text"
//                         value={formData.email}
//                         onChange={handleChange}
//                         autoComplete="email"
//                         className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       />
//                     </div>
//                     <span className="text-red-500 mt-2 text-sm">
//                       {formErrors.email}
//                     </span>
//                   </div>

//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="phone"
//                       className="block text-md font-medium leading-6 text-gray-900"
//                     >
//                       Phone
//                       <span className="text-red-500">*</span>
//                     </label>
//                     <div className="mt-2">
//                       <input
//                         id="phone"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={(e) => {
//                           const digitsOnly = e.target.value.replace(/\D/g, "");
//                           if (digitsOnly.length <= 10) {
//                             handleChange({
//                               target: { name: "phone", value: digitsOnly },
//                             });
//                           }
//                         }}
//                         autoComplete="country-name"
//                         className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       />
//                     </div>
//                     <span className="text-red-500 mt-2 text-sm">
//                       {formErrors.phone}
//                     </span>
//                   </div>

//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="role"
//                       className="block text-md font-medium leading-6 text-gray-900"
//                     >
//                       Role
//                       <span className="text-red-500">*</span>
//                     </label>
//                     <div className="mt-2">
//                       <select
//                         id="role"
//                         name="role"
//                         value={formData.role}
//                         onChange={handleChange}
//                         autoComplete="country-name"
//                         className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       >
//                         <option value="">Select a role</option>
//                         <option value="Eye Specialists">Eye Specialist</option>
//                         <option value="Heart specialist">
//                           Heart specialist
//                         </option>
//                         <option value="Orthopedic">Orthopedic</option>
//                         <option value="Brain Surgeon">Brain Surgeon</option>
//                       </select>
//                     </div>
//                     <span className="text-red-500 mt-2 text-sm">
//                       {formErrors.role}
//                     </span>
//                   </div>

//                   <div className="col-span-full">
//                     <label
//                       htmlFor="street-address"
//                       className="block text-md font-medium leading-6 text-gray-900"
//                     >
//                       Address<span className="text-red-500">*</span>
//                     </label>
//                     <div className="mt-2">
//                       <textarea
//                         id="address"
//                         name="address"
//                         value={formData.address}
//                         onChange={handleChange}
//                         type="text"
//                         autoComplete="street-address"
//                         className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       />
//                     </div>
//                     <span className="text-red-500 mt-2 text-sm">
//                       {formErrors.address}
//                     </span>
//                   </div>

//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="country"
//                       className="block text-md font-medium leading-6 text-gray-900"
//                     >
//                       Country<span className="text-red-500">*</span>
//                     </label>
//                     <div className="mt-2">
//                       <select

//                         name="country"
//                         value={countries.find(country => country.name === formData.country) ? JSON.stringify(countries.find(country => country.name === formData.country)) : ""}
//                         onChange={handleCountryChange}
//                         className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       >
//                         <option value="">Select Country</option>
//                         {countries.map((country, index) => (
//                           <option key={index} value={JSON.stringify(country)}>
//                             {country.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <span className="text-red-500 mt-2 text-sm">
//                       {formErrors.country}
//                     </span>
//                   </div>

//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="state"
//                       className="block text-md font-medium leading-6 text-gray-900"
//                     >
//                       State<span className="text-red-500">*</span>
//                     </label>
//                     <div className="mt-2">
//                       <select
//                         value={formData.state}
//                         onChange={handleStateChange}
//                         className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       >
//                         <option value="">Select State</option>
//                         {states.map((state, index) => (
//                           <option key={index} value={state}>
//                             {state}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <span className="text-red-500 mt-2 text-sm">
//                       {formErrors.state}
//                     </span>
//                   </div>

//                   <div className="col-span-3">
//                     <label
//                       htmlFor="city"
//                       className="block text-md font-medium leading-6 text-gray-900"
//                     >
//                       City<span className="text-red-500">*</span>
//                     </label>
//                     <div className="mt-2">
//                       <select
//                         name="city"
//                         value={formData.city}
//                         onChange={handleChange}
//                         className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       >
//                         <option value="">Select City</option>
//                         {cities.map((city, index) => (
//                           <option key={index} value={city}>
//                             {city}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <span className="text-red-500 mt-2 text-sm">
//                       {formErrors.city}
//                     </span>
//                   </div>

//                   <div className="sm:col-span-3">
//                     <label
//                       htmlFor="postal-code"
//                       className="block text-md font-medium leading-6 text-gray-900"
//                     >
//                       ZIP / Postal code<span className="text-red-500">*</span>
//                     </label>
//                     <div className="mt-2">
//                       <input
//                         id="zipcode"
//                         name="zipcode"
//                         value={formData.zipcode}
//                         onChange={handleChange}
//                         type="number"
//                         autoComplete="postal-code"
//                         className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       />
//                     </div>
//                     <span className="text-red-500 mt-2 text-sm">
//                       {formErrors.zipcode}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
//                   <div className="col-span-full">
//                     <label
//                       htmlFor="file-upload"
//                       className="block text-md font-medium leading-6 text-gray-900"
//                     >
//                       Image
//                       <span className="text-red-500">*</span>
//                     </label>
//                     <div className="mt-2 flex  rounded-lg border border-dashed border-gray-900/25 px-4 py-6">
//                       <div className="text-center blockflex justify-center items-center">
//                         <div className="ml-4">
//                           {imageSrc ? (
//                             <img
//                               src={imageSrc}
//                               alt="Image preview"
//                               style={{ maxWidth: "200px", maxHeight: "200px" }}
//                             />
//                           ) : (
//                             <PhotoIcon
//                               aria-hidden="true"
//                               className="mx-auto h-12 w-12 text-gray-300"
//                             />
//                           )}
//                         </div>

//                         <div className="mt-4  text-sm leading-6 text-gray-600">
//                           <label
//                             htmlFor="file-upload"
//                             className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
//                           >
//                             <span className=" blockflex justify-center items-center">
//                               Upload a file
//                             </span>
//                             <input
//                               id="file-upload"
//                               name="file-upload"
//                               accept="image/*"
//                               type="file"
//                               onChange={handleUpload}
//                               className="sr-only"
//                             />
//                           </label>
//                         </div>
//                         <p className="text-xs leading-5 text-gray-600 py-2">
//                           PNG, JPEG up to 2MB
//                         </p>
//                       </div>
//                     </div>
//                     <span className="text-red-500 mt-2 text-sm">{error}</span>
//                     <span className="text-red-500 mt-2 text-sm">
//                       {formErrors.image}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 flex items-center justify-start gap-x-6">
//               <button
//                 type="submit"
//                 className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 Save
//               </button>
//               <Link
//                 to="/admin/vendor"
//                 type="button"
//                 className="text-sm font-semibold leading-6 text-gray-900 px-2.5 py-[5px] border border-2 border-black rounded-md"
//               >
//                 Cancel
//               </Link>
//             </div>
//           </form>

//           <hr className="my-4 border border-2 border-black" />
//           <div className="flex flex-col gap-3">
//             <p className="text-2xl font-bold">Change Password</p>
//             <div className="flex flex-col w-1/2">
//               <label
//                 htmlFor="username"
//                 className="block text-md font-medium leading-6 text-gray-900"
//               >
//                 Username<span className="text-red-500">*</span>
//               </label>
//               <div className="mt-2">
//                 <input
//                   id="username"
//                   name="username"
//                   value={username}
//                   onChange={handleChange}
//                   type="text"
//                   autoComplete="family-name"
//                   readOnly
//                   className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                 />
//               </div>
//               <span className="text-red-500 mt-2 text-sm">
//                 {formErrors.username}
//               </span>
//             </div>

//             <div className="flex flex-col w-1/2">
//               <label
//                 htmlFor="paswword"
//                 className="block text-md font-medium leading-6 text-gray-900"
//               >
//                 Password<span className="text-red-500">*</span>
//               </label>
//               <div className="mt-2">
//                 <input
//                   id="password"
//                   name="password"
//                   value={password}
//                   onChange={handlePasswordChange}
//                   placeholder="Enter Password"
//                   type="text"
//                   autoComplete="family-name"
//                   className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                 />
//               </div>
//               <span className="text-red-500 mt-2 text-sm">{passwordError}</span>
//             </div>

//             <div className="flex items-center justify-start gap-x-6">
//               <button
//                 onClick={() => handleChangePassword()}
//                 className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 Change Password
//               </button>
//               <Link
//                 to={
//                   isSuperuser
//                     ? "/admin/staff"
//                     : isVendor
//                     ? "/vendor/staff"
//                     : "/doctor/staff"
//                 }
//                 type="button"
//                 className="rounded-md !text-black px-3 py-[7px] text-sm font-semibold text-white shadow-sm border border-1 border-black"
//               >
//                 Cancel
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditVendor;
import React, { useEffect, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import AdminSearch from "../../../Component/Admin/adminsearch";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import BaseUrl from "../../../Api/baseurl";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { mockCountries, mockStates, mockCities } from "../../../Mockdata/locationdata";

const EditVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    gender: "",
    role: "",
    address: "",
    city: "",
    zipcode: "",
    image: "",
    state: "",
    country: "",
  });
  const [formErrors, setFormErrors] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    gender: "",
    role: "",
    address: "",
    city: "",
    zipcode: "",
    image: "",
    state: "",
    country: "",
  });
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const restCountriesResponse = await fetch("https://restcountries.com/v3.1/all");
        if (!restCountriesResponse.ok) throw new Error("REST Countries API failed");
        const restCountriesData = await restCountriesResponse.json();

        const geoNamesResponse = await axios.get(`${BaseUrl}clinic/proxy/geo-names/`);
        const geoNamesData = geoNamesResponse.data;

        const geoNamesMap = {};
        geoNamesData.geonames.forEach((country) => {
          geoNamesMap[country.countryName] = country.geonameId;
        });

        const combinedData = restCountriesData
          .map((country) => ({
            name: country.name.common,
            geonameId: geoNamesMap[country.name.common] || null,
          }))
          .filter((country) => country.geonameId !== null);

        combinedData.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(combinedData);
      } catch (error) {
        console.error("Error fetching country data, using mock data:", error);
        setCountries(mockCountries);
      }
    };

    fetchCountryData();
  }, []);

  const handleCountryChange = async (event) => {
    if (!event.target.value) {
      // Handle the "Select Country" option
      setFormData({
        ...formData,
        country: "",
        state: "",
        city: "",
      });
      setStates([]);
      setCities([]);
      return;
    }

    const country = JSON.parse(event.target.value);
    const countryName = country.name;
    const geonameId = country.geonameId;

    setFormData({
      ...formData,
      country: countryName,
      state: "",
      city: "",
    });
    setStates([]);
    setCities([]);

    try {
      const response = await fetch(
        `http://api.geonames.org/childrenJSON?geonameId=${geonameId}&username=shivamlogicspice`
      );
      if (!response.ok) throw new Error("GeoNames states API failed");
      const data = await response.json();
      const stateData = data.geonames
        ? data.geonames.map((state) => ({
          name: state.name,
          geonameId: state.geonameId,
        }))
        : [];
      stateData.sort((a, b) => a.name.localeCompare(b.name));
      setStates(stateData);
    } catch (error) {
      console.error("Error fetching states, using mock data:", error);
      const mockStateData = mockStates[geonameId] || [];
      setStates(mockStateData);
    }
  };

  const handleStateChange = async (event) => {
    const stateName = event.target.value;
    const selectedState = states.find((s) => s.name === stateName);
    const stateGeonameId = selectedState ? selectedState.geonameId : null;

    setFormData({
      ...formData,
      state: stateName,
      city: "",
    });
    setCities([]);

    if (!stateGeonameId) {
      console.warn("No geonameId for state, using mock cities if available");
      const mockCityData = mockCities[stateName] || [];
      setCities(mockCityData.map((city) => city.name));
      return;
    }

    try {
      const response = await fetch(
        `http://api.geonames.org/childrenJSON?geonameId=${stateGeonameId}&username=shivamlogicspice`
      );
      if (!response.ok) throw new Error("GeoNames cities API failed");
      const data = await response.json();
      const cityData = data.geonames
        ? data.geonames.map((city) => city.name)
        : [];
      cityData.sort((a, b) => a.localeCompare(b));
      setCities(cityData);
    } catch (error) {
      console.error("Error fetching cities, using mock data:", error);
      const mockCityData = mockCities[stateGeonameId] || [];
      setCities(mockCityData.map((city) => city.name));
    }
  };

  const getData = async () => {
    const apiUrl = `${BaseUrl}clinic/vendor-profile-view/${id}/`;
    const token = Cookies.get("token");
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const vendorData = response.data.vendor;
      setFormData(vendorData);
      setUsername(response.data.Uname);
      setImageSrc(vendorData.image);
      setExistingImage(vendorData.image);

      // After setting formData, fetch states and cities for the vendor's country and state
      if (vendorData.country) {
        const selectedCountry = countries.find((c) => c.name === vendorData.country);
        if (selectedCountry) {
          try {
            const response = await fetch(
              `http://api.geonames.org/childrenJSON?geonameId=${selectedCountry.geonameId}&username=shivamlogicspice`
            );
            if (!response.ok) throw new Error("GeoNames states API failed");
            const data = await response.json();
            const stateData = data.geonames
              ? data.geonames.map((state) => ({
                name: state.name,
                geonameId: state.geonameId,
              }))
              : [];
            stateData.sort((a, b) => a.name.localeCompare(b.name));
            setStates(stateData);

            if (vendorData.state && stateData.some((s) => s.name === vendorData.state)) {
              const selectedState = stateData.find((s) => s.name === vendorData.state);
              if (selectedState) {
                try {
                  const cityResponse = await fetch(
                    `http://api.geonames.org/childrenJSON?geonameId=${selectedState.geonameId}&username=shivamlogicspice`
                  );
                  if (!cityResponse.ok) throw new Error("GeoNames cities API failed");
                  const cityData = await cityResponse.json();
                  const cities = cityData.geonames
                    ? cityData.geonames.map((city) => city.name)
                    : [];
                  cities.sort((a, b) => a.localeCompare(b));
                  setCities(cities);
                } catch (error) {
                  console.error("Error fetching cities, using mock data:", error);
                  const mockCityData = mockCities[selectedState.geonameId] || [];
                  setCities(mockCityData.map((city) => city.name));
                }
              }
            }
          } catch (error) {
            console.error("Error fetching states, using mock data:", error);
            const mockStateData = mockStates[selectedCountry.geonameId] || [];
            setStates(mockStateData);
            if (vendorData.state && mockStateData.some((s) => s.name === vendorData.state)) {
              const mockCityData = mockCities[mockStateData.find((s) => s.name === vendorData.state).geonameId] || [];
              setCities(mockCityData.map((city) => city.name));
            }
          }
        } else {
          // If country not found in API data, check mock data
          const mockCountry = mockCountries.find((c) => c.name === vendorData.country);
          if (mockCountry) {
            const mockStateData = mockStates[mockCountry.geonameId] || [];
            setStates(mockStateData);
            if (vendorData.state && mockStateData.some((s) => s.name === vendorData.state)) {
              const mockCityData = mockCities[mockStateData.find((s) => s.name === vendorData.state).geonameId] || [];
              setCities(mockCityData.map((city) => city.name));
            }
          }
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
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
      console.error("Error fetching vendor data:", error);
    }
  };

  useEffect(() => {
    setIsSuperuser(Cookies.get("is_superuser") === "true");
    setIsStaff(Cookies.get("is_staff") === "true");
    setIsVendor(Cookies.get("is_vendor") === "true");
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, countries]);

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

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
    setPasswordError("");
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { ...formErrors };

    if (!formData.fname.trim()) {
      errors.fname = "Please enter the first name.";
      isValid = false;
    }

    if (!formData.lname.trim()) {
      errors.lname = "Please enter the last name.";
      isValid = false;
    }

    if (!formData.email?.trim()) {
      errors.email = "Please enter your email address.";
      isValid = false;
    } else if (!isValidEmail(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.role?.trim()) {
      errors.role = "Please select the designation.";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = "Please select the contact number.";
      isValid = false;
    }

    if (!formData.address.trim()) {
      errors.address = "Please enter the address.";
      isValid = false;
    }

    if (!formData.city.trim()) {
      errors.city = "Please enter the city.";
      isValid = false;
    }

    if (!formData.zipcode) {
      errors.zipcode = "Please enter the code.";
      isValid = false;
    } else if (!isvalidPinCode(formData.zipcode)) {
      errors.zipcode = "Please enter a valid Pin Code.";
      isValid = false;
    }

    if (!formData.state.trim()) {
      errors.state = "Please enter a state";
      isValid = false;
    }

    if (!formData.country.trim()) {
      errors.country = "Please enter a country";
      isValid = false;
    }

    if (formData.gender === "") {
      errors.gender = "Please select a gender";
      isValid = false;
    }

    if (!formData.image && !existingImage) {
      errors.image = "Please upload an image.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      if (file) {
        formDataToSend.append("image", file);
      }

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
          const token = Cookies.get("token");
          await axios.put(
            `${BaseUrl}clinic/vendor-profile-view/${id}/`,
            formDataToSend,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Token ${token}`,
              },
            }
          );
          Swal.fire({
            title: "Success!",
            text: "Vendor information has been updated successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
          navigate("/admin/vendor");
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: `There was an issue updating vendor information: ${error.message}`,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const isvalidPinCode = (zipcode) => {
    const pinCodeRegex = /^\d{5}(\d{1,2})?$/;
    return pinCodeRegex.test(zipcode);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError("Please select an image file.");
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size exceeds 2MB.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setError("File type is not allowed. Please select a JPEG or PNG image.");
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const maxWidth = 2000;
      const maxHeight = 2000;

      if (img.width > maxWidth || img.height > maxHeight) {
        setError(`Image dimensions exceed ${maxWidth}x${maxHeight} pixels.`);
        return;
      } else {
        setError("");
        setFile(file);
        setImageSrc(URL.createObjectURL(file));
        setFormData({
          ...formData,
          image: file,
        });
        setFormErrors({
          ...formErrors,
          image: "",
        });
      }
    };

    img.onerror = () => {
      setError("Error loading image.");
    };

    reader.readAsDataURL(file);
  };

  const handleChangePassword = async () => {
    if (password === "") {
      setPasswordError("Please enter a password.");
      return;
    }

    try {
      const confirmationResult = await Swal.fire({
        title: "Update?",
        text: "Do you want to update Password?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (confirmationResult.isConfirmed) {
        const token = Cookies.get("token");
        await axios.post(
          `${BaseUrl}clinic/changepassword/`,
          {
            username: username,
            new_password: password,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );

        Swal.fire({
          title: "Updated Successfully",
          text: "Password Updated Successfully",
          icon: "success",
          confirmButtonText: "Okay",
        });
        if (isSuperuser) {
          navigate("/admin/staff");
        } else if (isVendor) {
          navigate("/vendor/staff");
        } else {
          navigate("/doctor/staff");
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
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
      Swal.fire({
        title: "Error",
        text: "There was a problem updating the password.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  function handleBreadClick(event) {
    event.preventDefault();
  }

  return (
    <div className="legacy-panel-page py-8 px-8 w-full md:w-[80%] xl:w-full">
      <AdminSearch />

      <div role="presentation" onClick={handleBreadClick} className="ml-1">
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link
            className="hover:underline"
            color="inherit"
            to={isSuperuser ? "/admin" : isVendor ? "/vendor" : "/doctor"}
          >
            Dashboard
          </Link>
          <Link
            className="hover:underline text-inherit"
            color="inherit"
            to="/admin/vendor"
          >
            Manage Vendor
          </Link>
          <Link className="hover:underline text-inherit" color="inherit">
            Edit Vendor
          </Link>
        </Breadcrumbs>
      </div>
      <div className="legacy-panel-surface w-full min-h-screen px-4 py-8 mt-3">
        <div className="flex items-center justify-between">
          <span className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Edit Vendor
          </span>
        </div>
        <div>
          <form
            id="EditStaff"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="space-y-12">
              <div className="pb-12">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="first-name"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      First name<span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="fname"
                        name="fname"
                        type="text"
                        value={formData.fname}
                        onChange={handleChange}
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.fname}
                    </span>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="last-name"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Last name<span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="lname"
                        name="lname"
                        value={formData.lname}
                        onChange={handleChange}
                        type="text"
                        autoComplete="family-name"
                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.lname}
                    </span>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="gender"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Gender<span className="text-red-600">*</span>
                    </label>
                    <div className="mt-2">
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="block w-full px-2 rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.gender}
                    </span>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Email address<span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="text"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.email}
                    </span>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="phone"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Phone<span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, "");
                          if (digitsOnly.length <= 10) {
                            handleChange({
                              target: { name: "phone", value: digitsOnly },
                            });
                          }
                        }}
                        autoComplete="tel"
                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.phone}
                    </span>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="role"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Role<span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Select a role</option>
                        <option value="Eye Specialists">Eye Specialist</option>
                        <option value="Heart specialist">Heart specialist</option>
                        <option value="Orthopedic">Orthopedic</option>
                        <option value="Brain Surgeon">Brain Surgeon</option>
                      </select>
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.role}
                    </span>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="street-address"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Address<span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        autoComplete="street-address"
                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.address}
                    </span>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="country"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Country<span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <select
                        name="country"
                        value={
                          countries.find((country) => country.name === formData.country)
                            ? JSON.stringify(countries.find((country) => country.name === formData.country))
                            : ""
                        }
                        onChange={handleCountryChange}
                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Select Country</option>
                        {countries.map((country, index) => (
                          <option key={index} value={JSON.stringify(country)}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.country}
                    </span>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="state"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      State<span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleStateChange}
                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Select State</option>
                        {states.map((state, index) => (
                          <option key={index} value={state.name}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.state}
                    </span>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="city"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      City<span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Select City</option>
                        {cities.map((city, index) => (
                          <option key={index} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.city}
                    </span>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="postal-code"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      ZIP / Postal code<span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="zipcode"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleChange}
                        type="number"
                        autoComplete="postal-code"
                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.zipcode}
                    </span>
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="file-upload"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Image
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2 flex w-fit bg-white rounded-lg border border-dashed border-gray-900/25 px-4 py-6">
                      <div className="text-center blockflex justify-center items-center">
                        <div className="ml-4">
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt="Preview"
                              style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                          ) : (
                            <PhotoIcon
                              aria-hidden="true"
                              className="mx-auto h-12 w-12 text-gray-300"
                            />
                          )}
                        </div>

                        <div className="mt-4  text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span className=" blockflex justify-center items-center">
                              Upload a file
                            </span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              accept="image/*"
                              type="file"
                              onChange={handleUpload}
                              className="sr-only"
                            />
                          </label>
                        </div>
                        <p className="text-xs leading-5 text-gray-600 py-2">
                          PNG, JPEG up to 2MB
                        </p>
                      </div>
                    </div>
                    <span className="text-red-500 mt-2 text-sm">{error}</span>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.image}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-start gap-x-6">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
              <Link
                to="/admin/vendor"
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900 px-2.5 py-[5px] border border-2 border-black rounded-md"
              >
                Cancel
              </Link>
            </div>
          </form>

          <hr className="my-4 border border-2 border-black" />
          <div className="flex flex-col gap-3">
            <p className="text-2xl font-bold">Change Password</p>
            <div className="flex flex-col w-1/2">
              <label
                htmlFor="username"
                className="block text-md font-medium leading-6 text-gray-900"
              >
                Username<span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  value={username}
                  type="text"
                  readOnly
                  className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="flex flex-col w-1/2">
              <label
                htmlFor="password"
                className="block text-md font-medium leading-6 text-gray-900"
              >
                Password<span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter Password"
                  type="password"
                  className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <span className="text-red-500 mt-2 text-sm">{passwordError}</span>
            </div>

            <div className="flex items-center justify-start gap-x-6">
              <button
                onClick={handleChangePassword}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Change Password
              </button>
              <Link
                to={
                  isSuperuser
                    ? "/admin/staff"
                    : isVendor
                      ? "/vendor/staff"
                      : "/doctor/staff"
                }
                type="button"
                className="rounded-md text-black px-3 py-[7px] text-sm font-semibold shadow-sm border border-1 border-black"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditVendor;
