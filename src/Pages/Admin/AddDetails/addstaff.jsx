import React, { useState, useEffect } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import AdminSearch from "../../../Component/Admin/adminsearch";
import DoctorSearch from "../../../Component/Doctor/doctorsearch";
import VendorSearch from "../../../Component/Vendor/vendorsearch";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import BaseUrl from "../../../Api/baseurl";
import LoaderH from "../../../Component/Loader/loader";
import { useRef } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";

const AddStaff = () => {
  const initialFormData = {
    fname: "",
    lname: "",
    email: "",
    gender: "",
    role: "",
    yoe: "",
    address: "",
    city: "",
    code: "",
    image: "",
    location: "",
    department: "",
    username: "",
    password: "",
    confirmpassword: "",
    is_staff: "",
  };

  const initialFormErrors = {
    fname: "",
    lname: "",
    email: "",
    gender: "",
    role: "",
    yoe: "",
    address: "",
    city: "",
    code: "",
    image: "",
    location: "",
    department: "",
    username: "",
    password: "",
    confirmpassword: "",
    is_staff: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const [locationData, setLocationData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [selectedDays, setSelectedDays] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]);
  const [loading, setLoading] = useState(false);

  const getLocationData = async () => {
    const apiUrl = `${BaseUrl}clinic/managelocation/`;
    const token = Cookies.get("token");

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setLocationData(response.data);
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
    }
  };
  const getDepartmentData = async () => {
    const apiUrl = `${BaseUrl}clinic/managedepartment/`;
    const token = Cookies.get("token");

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setDepartmentData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setIsSuperuser(Cookies.get("is_superuser") === "true");
    setIsStaff(Cookies.get("is_staff") === "true");
    setIsVendor(Cookies.get("is_vendor") === "true");
    getLocationData();
    getDepartmentData();
  }, []);

  const [staff, setStaff] = useState();

  let staffAvl = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "is_staff") {
      setStaff(value);
      staffAvl.current = value;
      // console.log(staffAvl.current, "staff");
    }
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
    const errors = { ...initialFormErrors };

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

    if (!formData.role) {
      errors.role = "Please select the designation.";
      isValid = false;
    }

    if (!formData.gender) {
      errors.gender = "Please select the gender.";
      isValid = false;
    }

    if (!formData.is_staff) {
      errors.is_staff = "Please select the is_doctor.";
      isValid = false;
    }

    if (!formData.yoe) {
      errors.yoe = "Please select the year of experience.";
      isValid = false;
    }

    if (!formData.address) {
      errors.address = "Please enter the address.";
      isValid = false;
    }

    if (!formData.username) {
      errors.username = "Please enter the username.";
      isValid = false;
    }

    if (!formData.city) {
      errors.city = "Please enter the city.";
      isValid = false;
    }

    if (!formData.code) {
      errors.code = "Please enter the code.";
      isValid = false;
    } else if (!isvalidPinCode(formData.code.trim())) {
      errors.code = "Please enter a valid Pin Code.";
      isValid = false;
    }

    if (!formData.location) {
      errors.location = "Please select a location";
      isValid = false;
    }

    if (!formData.department) {
      errors.department = "Please select a department";
      isValid = false;
    }

    if (!formData.image) {
      errors.image = "Please upload an image.";
      isValid = false;
    }

    if (staffAvl.current === "1") {
      if (!formData.password) {
        errors.password = "Password is required";
        isValid = false;
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters long";
        isValid = false;
      }

      if (formData.password !== formData.confirmpassword) {
        errors.confirmpassword = "Password do not match";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      submitStaffDetails();
      if (staffAvl.current === "1") {
        registerStaff();
      }
    }
  };

  const submitStaffDetails = async () => {
    const apiUrl = `${BaseUrl}clinic/submit-staff/`;
    const token = Cookies.get("token");

    const { password, confirmpassword, ...staffData } = formData;

    try {
      setLoading(true);
      window.scrollTo(0, 0);
      const response = await axios.post(apiUrl, staffData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        title: "Success!",
        text: "Your staff details have been submitted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      setLoading(false);
      if (isSuperuser) {
        navigate("/admin/staff");
      } else if (isVendor) {
        navigate("/vendor/staff");
      } else {
        navigate("/doctor/staff");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `There was an issue submitting your staff details: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }

  };

  const registerStaff = async () => {
    const apiUrl = `${BaseUrl}clinic/register-staff/`;
    const token = Cookies.get("token");

    const { username, email, password, is_staff } = formData;

    const registrationData = {
      username,
      email,
      password,
      is_staff,
    };

    try {
      setLoading(true);
      const response = await axios.post(apiUrl, registrationData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      Swal.fire({
        title: "Success!",
        text: "Staff added successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      setLoading(false);
      // if (isSuperuser) {
      //   navigate("/admin/staff");
      // } else if (isVendor) {
      //   navigate("/vendor/staff");
      // } else {
      //   navigate("/doctor/staff");
      // }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `There was an issue adding the staff: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFormErrors(initialFormErrors);
    setImageSrc("");
    setFile(null);
  };
  const isValidEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const isvalidPinCode = (code) => {
    const pinCodeRegex = /^\d{5}(\d{1,2})?$/; // Matches 5 or 6 digits
    return pinCodeRegex.test(code);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError("Please select an image file.");
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
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
      const maxWidth = 2000; // Maximum width in pixels
      const maxHeight = 2000; // Maximum height in pixels

      if (img.width > maxWidth || img.height > maxHeight) {
        setError(`Image dimensions exceed ${maxWidth}x${maxHeight} pixels.`);
        return;
      } else {
        // Clear previous errors and set the new file and image preview
        setError("");
        setFile(file);
        setImageSrc(URL.createObjectURL(file)); // Preview the image
        setFormData({
          ...formData,
          image: file, // Update formData with the file
        });
        setFormErrors({
          ...formErrors,
          image: "", // Clear image-related error
        });
      }
    };

    img.onerror = () => {
      setError("Error loading image.");
    };

    reader.readAsDataURL(file); // Convert the file to a data URL
  };
  function handleBreadClick(event) {
    event.preventDefault();
  }
  return (
    <>
      {!loading ? (
        <div className="py-8 px-8 w-full md:w-[80%] xl:w-full">
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
                    ? "/admin/staff"
                    : isVendor
                    ? "/vendor/staff"
                    : "/doctor/staff"
                }
              >
                Manage Staffs
              </Link>
              <Link className="hover:underline text-inherit" color="inherit">
                Add Staff
              </Link>
            </Breadcrumbs>
          </div>

          <div className="w-full bg-[#F2F2F2] px-4 py-8 mt-3">
            <div className="flex items-center justify-between">
              <text className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
                Add Staff
              </text>
            </div>
            <div>
              <form id="AddBlog" onSubmit={handleSubmit}>
                <div className="space-y-12">
                  <div className="">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="first-name"
                          className="block text-md font-medium leading-6 text-gray-900"
                        >
                          First Name<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            id="fname"
                            name="fname"
                            type="text"
                            value={formData.fname}
                            placeholder="Enter first name"
                            onChange={handleChange}
                            autoComplete="given-name"
                            className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                          Last Name<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            id="lname"
                            name="lname"
                            value={formData.lname}
                            placeholder="Enter last name"
                            onChange={handleChange}
                            type="text"
                            autoComplete="family-name"
                            className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.lname}
                        </span>
                      </div>

                      <div className="sm:col-span-3">
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
                            value={formData.username}
                            placeholder="Enter username"
                            onChange={handleChange}
                            type="text"
                            autoComplete="family-name"
                            className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.username}
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
                            className="block w-full h-9 bg-white rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600  sm:text-sm sm:leading-6"
                          >
                            <option value="">Select Gender </option>
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
                            placeholder="Enter email address"
                            onChange={handleChange}
                            autoComplete="email"
                            className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.email}
                        </span>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="category"
                          className="block text-md font-medium leading-6 text-gray-900"
                        >
                          Role
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            autoComplete="country-name"
                            className="block w-full h-9 bg-white rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600  sm:text-sm sm:leading-6"
                          >
                            <option value="">Select designation</option>
                            <option value="Orthopedics">Orthopedics</option>
                            <option value="Eye Specialists">
                              Eye Specialists
                            </option>
                            <option value="Heart Specialists">
                              Heart Specialists
                            </option>
                            <option value="Brain Surgeon">Brain Surgeon</option>
                          </select>
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.role}
                        </span>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="category"
                          className="block text-md font-medium leading-6 text-gray-900"
                        >
                          Years of Experience
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <select
                            id="yoe"
                            name="yoe"
                            value={formData.yoe}
                            onChange={handleChange}
                            autoComplete="country-name"
                            className="block w-full h-9 bg-white rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600  sm:text-sm sm:leading-6"
                          >
                            <option value="">Select years of experience</option>
                            <option value="1-2">1-2 years</option>
                            <option value="2-5">2-5 years</option>
                            <option value="6-10">6-10 years</option>
                          </select>
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.yoe}
                        </span>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="gender"
                          className="block text-md font-medium leading-6 text-gray-900"
                        >
                          Is Doctor?<span className="text-red-600">*</span>
                        </label>
                        <div className="mt-2">
                          <select
                            id="is_staff"
                            name="is_staff"
                            value={formData.is_staff}
                            onChange={handleChange}
                            className="block w-full h-9 bg-white rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600  sm:text-sm sm:leading-6"
                          >
                            <option value="">
                              Select Staff is doctor or not
                            </option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.is_staff}
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
                            placeholder="Enter address"
                            onChange={handleChange}
                            type="text"
                            autoComplete="street-address"
                            className="block w-full h-24 rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.address}
                        </span>
                      </div>

                      <div className="sm:col-span-3 sm:col-start-1">
                        <label
                          htmlFor="city"
                          className="block text-md font-medium leading-6 text-gray-900"
                        >
                          City<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            id="city"
                            name="city"
                            value={formData.city}
                            placeholder="Enter City"
                            onChange={handleChange}
                            type="text"
                            autoComplete="address-level2"
                            className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.city}
                        </span>
                      </div>

                      {/* <div className="sm:col-span-2">
                                        <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                                            State / Province
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="region"
                                                name="region"
                                                type="text"
                                                autoComplete="address-level1"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div> */}

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="postal-code"
                          className="block text-md font-medium leading-6 text-gray-900"
                        >
                          ZIP / Postal code
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            id="code"
                            name="code"
                            value={formData.code}
                            placeholder="Enter ZIP/Postal code"
                            onChange={handleChange}
                            type="number"
                            autoComplete="postal-code"
                            className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.code}
                        </span>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="postal-code"
                          className="block text-md font-medium leading-6 text-gray-900"
                        >
                          Location<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <select
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="block w-full h-9 bg-white rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600  sm:text-sm sm:leading-6"
                          >
                            <option value="">Select a location</option>
                            {locationData.length > 0 ? (
                              locationData
                                .filter((location) => location.status === 1) // Filter locations by status
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
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.location}
                        </span>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="postal-code"
                          className="block text-md font-medium leading-6 text-gray-900"
                        >
                          Department<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="block w-full h-9 bg-white rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600  sm:text-sm sm:leading-6"
                          >
                            <option value="">Select a department</option>
                            {departmentData.length > 0 ? (
                              departmentData
                                .filter((department) => department.status === 1) // Filter locations by status
                                .map((department) => (
                                  <option
                                    key={department.id}
                                    value={department.name}
                                  >
                                    {department.name}
                                  </option>
                                ))
                            ) : (
                              <option disabled>Loading...</option>
                            )}
                          </select>
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.department}
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
                        <div className="mt-2 flex ">
                          <div className="text-center blockflex justify-center items-center bg-white rounded-lg border border-dashed border-gray-900/25 px-4 py-6">
                            <div className="mt-2 text-sm leading-6 text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 "
                              >
                                <div className="mb-2">
                                  {imageSrc ? (
                                    <img
                                      src={imageSrc}
                                      alt="Image-preview"
                                      style={{
                                        maxWidth: "200px",
                                        maxHeight: "200px",
                                      }}
                                    />
                                  ) : (
                                    <PhotoIcon
                                      aria-hidden="true"
                                      className="mx-auto h-12 w-12 text-gray-300"
                                    />
                                  )}
                                </div>
                                <span className="text-center p-2 blockflex justify-center items-center focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
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
                            <div className="text-xs leading-5 text-gray-600 py-2">
                              PNG, JPEG up to 2MB
                            </div>
                          </div>
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {error}
                        </span>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.image}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {staffAvl.current === "1" && (
                      <div className="mb-4">
                        <div>
                          <h2 className="text-xl font-medium leading-6 text-gray-900">
                            Credentials
                          </h2>
                        </div>
                        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                          <div className="sm:col-span-4">
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
                                value={formData.username}
                                onChange={handleChange}
                                type="text"
                                autoComplete="family-name"
                                className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                            <span className="text-red-500 mt-2 text-sm">
                              {formErrors.username}
                            </span>
                          </div>
                          <div className="sm:col-span-4">
                            <label
                              htmlFor="email"
                              className="block text-md font-medium leading-6 text-gray-900"
                            >
                              Email address
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                              <input
                                id="email"
                                name="email"
                                type="text"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                            <span className="text-red-500 mt-2 text-sm">
                              {formErrors.email}
                            </span>
                          </div>
                          <div className="sm:col-span-4">
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
                                value={formData.password}
                                onChange={handleChange}
                                type="password"
                                autoComplete="new-password"
                                className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                            <span className="text-red-500 mt-2 text-sm">
                              {formErrors.password}
                            </span>
                          </div>

                          <div className="sm:col-span-4">
                            <label
                              htmlFor="confirmpassword"
                              className="block text-md font-medium leading-6 text-gray-900"
                            >
                              Confirm Password
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                              <input
                                id="confirmPassword"
                                name="confirmpassword"
                                value={formData.confirmpassword}
                                onChange={handleChange}
                                type="password"
                                autoComplete="new-password"
                                className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                            <span className="text-red-500 mt-2 text-sm">
                              {formErrors.confirmpassword}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-start gap-x-6 mt-10">
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Save
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
                    className="rounded-md !text-black px-3 py-[7px] text-sm font-semibold text-white shadow-sm border border-1 border-black"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <LoaderH />
      )}
    </>
  );
};

export default AddStaff;
