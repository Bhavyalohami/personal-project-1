import React, { useState, useEffect } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import AdminSearch from "../../../Component/Admin/adminsearch";
import DoctorSearch from "../../../Component/Doctor/doctorsearch";
import VendorSearch from "../../../Component/Vendor/vendorsearch";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import BaseUrl from "../../../Api/baseurl";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";

const EditPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  useEffect(() => {
    setIsSuperuser(Cookies.get("is_superuser") === "true");
    setIsVendor(Cookies.get("is_vendor") === "true");
    setIsStaff(Cookies.get("is_staff") === "true");
    getData();
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact: "",
    email: "",
    date_of_birth: "",
    username: "",
    gender: "",
    blood_group: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    image: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    age: "",
    contact: "",
    email: "",
    date_of_birth: "",
    username: "",
    gender: "",
    blood_group: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth();
    if (
      month < birthDate.getMonth() ||
      (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date_of_birth") {
      setFormData({
        ...formData,
        date_of_birth: value,
        age: calculateAge(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setFormErrors({
      ...formErrors,
      [name]: "",
    });
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

  const getData = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get(
        `${BaseUrl}clinic/patient-list-update/${id}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setFormData(response.data);
      setImageSrc(response.data.image);
    } catch (error) {
      console.error(error);
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
  const validateForm = () => {
    let isValid = true;
    const errors = { ...formErrors };

    if (!formData.name.trim()) {
      errors.name = "Please enter the department name.";
      isValid = false;
    }
    if (!formData.age) {
      errors.age = "Please enter the age.";
      isValid = false;
    }
    if (!formData.contact.trim()) {
      errors.contact = "Please enter the contact.";
      isValid = false;
    }
    if (!formData.email?.trim()) {
      errors.email = "Please enter your email address.";
      isValid = false;
    } else if (!isValidEmail(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }
    if (!formData.date_of_birth.trim()) {
      errors.date_of_birth = "Please enter the date of birth.";
      isValid = false;
    }
    if (!formData.username) {
      errors.username = "Please enter the username.";
      isValid = false;
    }
    if (!formData.gender) {
      errors.gender = "Please enter the gender.";
      isValid = false;
    }
    if (!formData.blood_group.trim()) {
      errors.blood_group = "Please enter the blood group.";
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
    if (!formData.state.trim()) {
      errors.state = "Please enter the state.";
      isValid = false;
    }
    if (!formData.zipcode) {
      errors.zipcode = "Please enter the code.";
      isValid = false;
    } else if (!isvalidPinCode(formData.zipcode)) {
      errors.zipcode = "Please enter a valid Pin Code.";
      isValid = false;
    }
    if (!formData.image.trim()) {
      errors.image = "Please enter the image.";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  //   const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("entered");

  //   // Show SweetAlert confirmation prompt
  //   const result = await Swal.fire({
  //     title: "Are you sure?",
  //     text: "Do you really want to submit the form?",
  //     icon: "question",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, submit it!",
  //     cancelButtonText: "No, cancel",
  //   });

  //   // If the user confirms, proceed with the form submission
  //   if (!result.isConfirmed) {
  //     console.log("Submission canceled");
  //     return; // Exit if the user cancels
  //   }

  //   const isValid = validateForm();
  //   if (!isValid) return;

  //   console.log("entered in if");

  //   try {
  //     const response = await axios.put(
  //       `${BaseUrl}clinic/patient-list-update/${id}/`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     // Success Message
  //     Swal.fire({
  //       title: "Success!",
  //       text: "Patient details have been updated successfully.",
  //       icon: "success",
  //       confirmButtonText: "OK",
  //     });

  //     // Navigate based on roles
  //     if (isSuperuser) {
  //       navigate("/admin/managepatients");
  //     } else if (isVendor) {
  //       navigate("/vendor/managepatients");
  //     } else {
  //       navigate("/doctor/managepatients");
  //     }
  //   } catch (error) {
  //     // Session Expired
  //     if (error.code === "ERR_BAD_REQUEST") {
  //       Swal.fire({
  //         icon: "warning",
  //         title: "Session expired. Please login again.",
  //       });

  //       // Clear Cookies
  //       const cookies = [
  //         "token",
  //         "username",
  //         "is_superuser",
  //         "is_staff",
  //         "is_vendor",
  //         "status",
  //         "roles",
  //         "subroles",
  //       ];
  //       cookies.forEach((cookie) => Cookies.remove(cookie));

  //       // Navigate to login
  //       if (isSuperuser) {
  //         navigate("/admin/login");
  //       } else if (isVendor) {
  //         navigate("/vendor/login");
  //       } else {
  //         navigate("/doctor/login");
  //       }
  //       return;
  //     }

  //     // Other Errors
  //     Swal.fire({
  //       title: "Error!",
  //       text: `There was an issue in adding the Department: ${error.message}`,
  //       icon: "error",
  //       confirmButtonText: "OK",
  //     });
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // Show SweetAlert confirmation prompt
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    // If the user confirms, proceed with the form submission
    if (!result.isConfirmed) {
      return; // Exit if the user cancels
    }

    const isValid = validateForm();
    if (!isValid) return;


    try {
      const response = await axios.put(
        `${BaseUrl}clinic/patient-list-update/${id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Success Message
      Swal.fire({
        title: "Success!",
        text: "Patient details have been updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Navigate based on roles
      if (isSuperuser) {
        navigate("/admin/managepatients");
      } else if (isVendor) {
        navigate("/vendor/managepatients");
      } else {
        navigate("/doctor/managepatients");
      }
    } catch (error) {
      // Session Expired
      if (error.code === "ERR_BAD_REQUEST") {
        Swal.fire({
          icon: "warning",
          title: "Session expired. Please login again.",
        });

        // Clear Cookies
        const cookies = [
          "token",
          "username",
          "is_superuser",
          "is_staff",
          "is_vendor",
          "status",
          "roles",
          "subroles",
        ];
        cookies.forEach((cookie) => Cookies.remove(cookie));

        // Navigate to login
        if (isSuperuser) {
          navigate("/admin/login");
        } else if (isVendor) {
          navigate("/vendor/login");
        } else {
          navigate("/doctor/login");
        }
        return;
      }

      // Other Errors
      Swal.fire({
        title: "Error!",
        text: `There was an issue in adding the Department: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  function handleBreadClick(event) {
    event.preventDefault();
  }
  return (
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
                ? "/admin/managepatients"
                : isVendor
                ? "/vendor/managepatients"
                : "/doctor/managepatients"
            }
          >
            Manage Patients
          </Link>
          <Link className="hover:underline text-inherit" color="inherit">
            Edit Patient
          </Link>
          <Link className="hover:underline text-inherit" color="inherit">
            {formData.name}
          </Link>
        </Breadcrumbs>
      </div>

      <div className="w-full bg-[#F2F2F2] px-4 py-8 mt-3">
        <div className="flex items-center justify-between">
          <text className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Edit Patient
          </text>
        </div>
        <div>
          <form id="AddBlog" onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="pb-2">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="name"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Patient Name
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        placeholder="Enter patient name"
                        onChange={handleChange}
                        autoComplete="family-name"
                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.name}
                    </span>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="username"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Username
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        placeholder="Enter username"
                        onChange={handleChange}
                        readOnly
                        autoComplete="username"
                        className="block w-full rounded-md hover:cursor-not-allowed border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
                        // className="block w-full rounded-md hover:cursor-not-allowed border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.username}
                    </span>
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="date_of_birth"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Date of Birth
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="date_of_birth"
                        name="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        // placeholder="Enter date of birth"
                        onChange={handleChange}
                        autoComplete="date_of_birth"
                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.date_of_birth}
                    </span>
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="age"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Age
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="age"
                        name="age"
                        type="text"
                        value={formData.age}
                        placeholder="Enter age"
                        onChange={handleChange}
                        autoComplete="age"
                        readOnly
                        className="block w-full rounded-md hover:cursor-not-allowed border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
                        // className="block w-full rounded-md hover:cursor-not-allowed border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-none sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.age}
                    </span>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="contact"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Contact No.
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="contact"
                        name="contact"
                        type="text"
                        value={formData.contact}
                        placeholder="Enter contact number"
                        onChange={handleChange}
                        autoComplete="contact"
                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.contact}
                    </span>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Email
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="text"
                        value={formData.email}
                        placeholder="Enter email"
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
                      htmlFor="gender"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Gender
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        placeholder="Enter date of birth"
                        onChange={handleChange}
                        autoComplete="gender"
                        className="block w-full rounded-md bg-white border-0 pl-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Please select a gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.gender}
                    </span>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="blood_group"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Blood Group
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <select
                        id="blood_group"
                        name="blood_group"
                        type="text"
                        value={formData.blood_group}
                        placeholder="Enter blood group"
                        onChange={handleChange}
                        autoComplete="blood_group"
                        className="block w-full bg-white rounded-md border-0 pl-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Please select blood group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.blood_group}
                    </span>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="address"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Address
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        placeholder="Enter address"
                        onChange={handleChange}
                        autoComplete="address"
                        className="block w-full min-h-16 rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.address}
                    </span>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="city"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      City
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        placeholder="Enter city"
                        onChange={handleChange}
                        autoComplete="city"
                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.city}
                    </span>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="state"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      State
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="state"
                        name="state"
                        type="text"
                        value={formData.state}
                        placeholder="Enter state"
                        onChange={handleChange}
                        autoComplete="state"
                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.state}
                    </span>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="zipcode"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Zip Code
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="zipcode"
                        name="zipcode"
                        type="text"
                        value={formData.zipcode}
                        placeholder="Enter zipcode"
                        onChange={handleChange}
                        autoComplete="zipcode"
                        className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.zipcode}
                    </span>
                  </div>

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
                to={
                  isSuperuser
                    ? "/admin/managepatients"
                    : isVendor
                    ? "/vendor/managepatients"
                    : "/doctor/managepatients"
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
  );
};

export default EditPatient;
