import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import LoaderH from "../../../Component/Loader/loader";
import Cookies from "js-cookie";
import AdminSearch from "../../../Component/Admin/adminsearch";
import BaseUrl from "../../../Api/baseurl";
import Breadcrumbs from "@mui/material/Breadcrumbs";

const AddVendor = () => {
  const initialFormData = {
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    confirmpassword: "",
    is_staff: "",
  };

  const initialFormErrors = {
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    confirmpassword: "",
    is_staff: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const navigate = useNavigate();
  const staffAvl = useRef();
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "is_staff") {
      staffAvl.current = value;
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

    // Validation for required fields
    if (!formData.first_name.trim()) {
      errors.first_name = "Please enter the first name.";
      isValid = false;
    }

    if (!formData.last_name.trim()) {
      errors.last_name = "Please enter the last name.";
      isValid = false;
    }

    if (!formData.email?.trim()) {
      errors.email = "Please enter your email address.";
      isValid = false;
    } else if (!isValidEmail(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.username.trim()) {
      errors.username = "Please enter a username.";
      isValid = false;
    }

    if (!formData.is_staff) {
      errors.is_staff = "Please select if the person is a doctor.";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    if (formData.password !== formData.confirmpassword) {
      errors.confirmpassword = "Passwords do not match";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      submitForm();
    }
  };

  const submitForm = async () => {
    const apiUrl = `${BaseUrl}clinic/register-vendor/`;
    const token = Cookies.get("token");

    try {
      setLoading(true);
      window.scrollTo(0, 0);
      await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      Swal.fire({
        title: "Success!",
        text: "Vendor details have been submitted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      setLoading(false);
      navigate("/admin/vendor");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `There was an issue submitting your vendor details: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
      navigate("/admin/login");
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  function handleBreadClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }
  return (
    <>
      {!loading ? (
        <div className="legacy-panel-page py-8 px-8 w-full md:w-[80%] xl:w-full">
          <AdminSearch />
          <div role="presentation" onClick={handleBreadClick} className="ml-1">
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                className="hover:underline"
                color="inherit"
                to="/admin/"
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
                Add Vendor
              </Link>
            </Breadcrumbs>
          </div>
          <div className="legacy-panel-surface w-full px-4 py-8 mt-3">
            <div className="flex items-center justify-between">
              <span className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
                Add Vendor
              </span>
            </div>
            <div>
              <form id="AddVendor" onSubmit={handleSubmit}>
                <div className="space-y-12">
                  <div className="pb-8">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="first_name"
                          className="block text-md font-medium leading-6 text-gray-900"
                        >
                          First Name<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            type="text"
                            autoComplete="given-name"
                            className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.first_name}
                        </span>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="last_name"
                          className="block text-md font-medium leading-6 text-gray-900"
                        >
                          Last Name<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            type="text"
                            autoComplete="family-name"
                            className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.last_name}
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
                            className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.username}
                        </span>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="email"
                          className="block text-md font-medium leading-6 text-gray-900"
                        >
                          Email Address<span className="text-red-500">*</span>
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

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="is_staff"
                          className="block text-md font-medium leading-6 text-gray-900"
                        >
                          Is Doctor<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <select
                            id="is_staff"
                            name="is_staff"
                            value={formData.is_staff}
                            onChange={handleChange}
                            className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            <option value="">Select</option>
                            <option value="True">Yes</option>
                            <option value="False">No</option>
                          </select>
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.is_staff}
                        </span>
                      </div>

                      <div className="col-span-full flex flex-col sm:flex-row gap-3">
                        <div className="w-full sm:w-1/2">
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
                              type="password"
                              value={formData.password}
                              onChange={handleChange}
                              className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          <span className="text-red-500 mt-2 text-sm">
                            {formErrors.password}
                          </span>
                        </div>

                        <div className="w-full sm:w-1/2">
                          <label
                            htmlFor="confirmpassword"
                            className="block text-md font-medium leading-6 text-gray-900"
                          >
                            Confirm Password
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-2">
                            <input
                              id="confirmpassword"
                              name="confirmpassword"
                              type="password"
                              value={formData.confirmpassword}
                              onChange={handleChange}
                              className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          <span className="text-red-500 mt-2 text-sm">
                            {formErrors.confirmpassword}
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
                      className="rounded-md !text-black px-3 py-[7px] text-sm font-semibold text-white shadow-sm border border-1 border-black"
                    >
                      Cancel
                    </Link>
                  </div>
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

export default AddVendor;
