import React, { useEffect, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import AdminSearch from "../../../Component/Admin/adminsearch";
import DoctorSearch from "../../../Component/Doctor/doctorsearch";
import VendorSearch from "../../../Component/Vendor/vendorsearch";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import BaseUrl from "../../../Api/baseurl";
import Breadcrumbs from "@mui/material/Breadcrumbs";

const EditStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [formData, setFormData] = useState({
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
    introduction: "",
    achievements: "",
  });

  const [formErrors, setFormErrors] = useState({
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
    introduction: "",
    achievements: "",
  });
  const [Staff, setStaff] = useState({
    is_staff: "",
  });
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  // const [existingImage, setExistingImage] = useState("");
  const [locationData, setLocationData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const getData = async () => {
    const apiUrl = `${BaseUrl}clinic/staff-list/${id}/`;

    const token = Cookies.get("token");
    // const token = localStorage.getItem('auth_token');
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setFormData(response.data);
      setStaff(response.data.is_staff);
      setImageSrc(response.data.image);
      // setExistingImage(response.data.image);
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
      console.error(error);
    }
  };
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
      console.error(error);
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
    // getData();
    setIsSuperuser(Cookies.get("is_superuser") === "true");
    setIsStaff(Cookies.get("is_staff") === "true");
    setIsVendor(Cookies.get("is_vendor") === "true");

    getLocationData();
    getDepartmentData();
  }, [id]);

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

  const handleEditorChange = (value) => {
    setFormData({
      ...formData,
      achievements: value,
    });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { ...formErrors };

    if (!formData.fname.trim()) {
      errors.fname = "Please enter the first name.";
      isValid = false;
    }
    if (!formData.gender) {
      errors.gender = "Please select the gender.";
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

    if (!formData.yoe.trim()) {
      errors.yoe = "Please select the year of experience.";
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
    // const codeStr = formData.code?.toString() || '';
    if (!formData.code) {
      errors.code = "Please enter the code.";
      isValid = false;
    } else if (!isvalidPinCode(formData.code)) {
      errors.code = "Please enter a valid Pin Code.";
      isValid = false;
    }

    if (formData.location === "") {
      errors.location = "Please select a location";
      isValid = false;
    }
    if (formData.department === "") {
      errors.department = "Please select a department";
      isValid = false;
    }
    if (!formData.introduction) {
      errors.introduction = "Please enter the introduction.";
      isValid = false;
    }
    if (!formData.achievements) {
      errors.achievements = "Please enter the achievements.";
      isValid = false;
    }
    if (!formData.image) {
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
      if (result?.isConfirmed) {
        try {
          await axios.put(
            `${BaseUrl}clinic/staff-list/${id}/`,
            formDataToSend,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          Swal.fire({
            title: "Success!",
            text: "Staff information has been updated successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
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
            text: `There was an issue updating your Staff information: ${error.message}`,
            icon: "error",
            confirmButtonText: "OK",
          });
        }

        //   setFormData(initialFormData); // Reset form data after successful submission
        //   setFormErrors(initialFormErrors); // Clear form errors after successful submission
        //   setImageSrc(""); // Clear image preview
        //   setFile(null); // Clear file
      }
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const isvalidPinCode = (code) => {
    const pinCodeRegex = /^\d{5}(\d{1,2})?$/;
    return pinCodeRegex.test(code);
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

  useEffect(() => {
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            username: formData.username,
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
      console.error(error);
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
            Edit Staff
          </Link>
          <Link className="hover:underline text-inherit" color="inherit">
            {formData.fname} {formData.lname}
          </Link>
        </Breadcrumbs>
      </div>
      <div className="legacy-panel-surface w-full px-4 py-8 mt-3">
        <div className="flex items-center justify-between">
          <span className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Edit Staff
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
                        readOnly
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

                  <div className="sm:col-span-4">
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
                      htmlFor="role"
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
                        <option value="">Select a role</option>
                        <option value="Eye Specialists">Eye Specialist</option>
                        <option value="Heart specialist">
                          Heart specialist
                        </option>
                        <option value="Orthopedic">Orthopedic</option>
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
                        <option value="1-2">1-2</option>
                        <option value="2-5">2-5</option>
                        <option value="6-10">6-10</option>
                      </select>
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.yoe}
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
                        type="text"
                        autoComplete="street-address"
                        className="block w-full h-24 rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.address}
                    </span>
                  </div>

                  <div className="col-span-3">
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
                        onChange={handleChange}
                        type="text"
                        autoComplete="address-level2"
                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                      htmlFor="code"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      ZIP / Postal code<span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        type="number"
                        autoComplete="code"
                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                              <option key={location.id} value={location.name}>
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
                  {formData && (
                    <div className="col-span-full">
                      <label
                        htmlFor="introduction"
                        className="block text-md font-medium leading-6 text-gray-900"
                      >
                        Introduction
                        {/* <span className="text-red-500">*</span> */}
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="introduction"
                          name="introduction"
                          type="introduction"
                          value={formData.introduction || ""}
                          onChange={handleChange}
                          autoComplete="introduction"
                          className="block w-full h-24 rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <span className="text-red-500 mt-2 text-sm">
                        {formErrors.introduction}
                      </span>
                    </div>
                  )}
                  {formData && (
                    <div className="col-span-full">
                      <label
                        htmlFor="achievements"
                        className="block text-md font-medium leading-6 text-gray-900"
                      >
                        Achievements
                        {/* <span className="text-red-500">*</span> */}
                      </label>
                      <div className="mt-2 bg-white">
                        <ReactQuill
                          id="achievements"
                          name="achievements"
                          value={formData.achievements || ""}
                          onChange={handleEditorChange}
                          theme="snow"
                        />
                        {/* <Editor editorState={editorState} onChange={handleEditorChange} /> */}
                      </div>
                      <span className="text-red-500 mt-2 text-sm">
                        {formErrors.achievements}
                      </span>
                    </div>
                  )}
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
                        <div className="mt-4  text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 "
                          >
                            <div className="mb-2">
                              {imageSrc ? (
                                <img
                                  src={imageSrc}
                                  alt="Preview"
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
                            <span className=" blockflex p-2 justify-center items-center focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
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

            <div className="flex items-center justify-start gap-x-6">
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
                className="text-sm font-semibold leading-6 text-gray-900 px-2.5 py-[5px] border border-2 border-black rounded-md"
              >
                Cancel
              </Link>
            </div>
          </form>
          {Staff ? (
            <>
              <hr className="my-4 border border-2 border-black" />
              <div className="flex flex-col gap-3">
                <p className="text-xl font-bold">Change Password</p>
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
                      value={formData.username}
                      onChange={handleChange}
                      type="text"
                      autoComplete="family-name"
                      readOnly
                      className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <span className="text-red-500 mt-2 text-sm">
                    {formErrors.username}
                  </span>
                </div>

                <div className="flex flex-col w-1/2">
                  <label
                    htmlFor="paswword"
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
                      type="text"
                      autoComplete="family-name"
                      className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <span className="text-red-500 mt-2 text-sm">
                    {passwordError}
                  </span>
                </div>

                <div className="flex items-center justify-start gap-x-6">
                  <button
                    onClick={() => handleChangePassword()}
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
                    className="rounded-md !text-black px-3 py-[7px] text-sm font-semibold text-white shadow-sm border border-1 border-black"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EditStaff;
