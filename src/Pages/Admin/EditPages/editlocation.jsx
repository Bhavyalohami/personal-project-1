import React, { useEffect, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import AdminSearch from "../../../Component/Admin/adminsearch";
import DoctorSearch from "../../../Component/Doctor/doctorsearch";
import VendorSearch from "../../../Component/Vendor/vendorsearch";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import Cookies from "js-cookie";
import BaseUrl from "../../../Api/baseurl";
import Breadcrumbs from "@mui/material/Breadcrumbs";

const EditLocation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    url: "",
  });

  const getData = async () => {

    const apiUrl = `${BaseUrl}clinic/managelocation/${id}`;
    const token = Cookies.get("token");
    // const token = localStorage.getItem('auth_token');
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      // setFormData({
      //   title: response.data.title,
      //   content: response.data.content || "",
      // });
      setFormData(response.data);
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

  useEffect(() => {
    setIsSuperuser(Cookies.get("is_superuser") === "true");
    setIsVendor(Cookies.get("is_vendor") === "true");
    setIsStaff(Cookies.get("is_staff") === "true");
    getData();
  }, []);

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
    const errors = { ...formErrors };

    if (!formData.name.trim()) {
      errors.name = "Please enter location name.";
      isValid = false;
    }

    if (!formData.url.trim()) {
      errors.url = "Please enter location's Google Map URL.";
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
          const response = await axios.put(
            `${BaseUrl}clinic/managelocation/${id}/`,
            formDataToSend,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          Swal.fire({
            title: "Success!",
            text: "Location has been updated successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
          if (isSuperuser) {
            navigate("/admin/managelocation");
          } else if (isVendor) {
            navigate("/vendor/managelocation");
          } else {
            navigate("/doctor/managelocation");
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: `There was an issue updating the Location: ${error.message}`,
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
  function handleBreadClick(event) {
    event.preventDefault();
  }
  return (
    <>
      {/* {formData.name && ( */}
        <>
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
            <div
              role="presentation"
              onClick={handleBreadClick}
              className="ml-1"
            >
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
                      ? "/admin/managelocation"
                      : isVendor
                      ? "/vendor/managelocation"
                      : "/doctor/managelocation"
                  }
                >
                  Manage Locations
                </Link>
                <Link className="hover:underline text-inherit" color="inherit">
                  Edit Location
                </Link>
              </Breadcrumbs>
            </div>
            <div className="w-full bg-[#F2F2F2] px-4 py-8 mt-3">
              <div className="flex items-center justify-between">
                <text className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
                  Edit Location
                </text>
              </div>
              <div>
                <form id="AddBlog" onSubmit={handleSubmit}>
                  <div className="space-y-12">
                    <div className="pb-12">
                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="name"
                            className="block text-md font-medium leading-6 text-gray-900"
                          >
                            Location Name
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-2">
                            <input
                              id="name"
                              name="name"
                              type="text"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Enter location name"
                              autoComplete="name"
                              className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          <span className="text-red-500 mt-2 text-sm">
                            {formErrors.name}
                          </span>
                        </div>

                        <div className="col-span-4">
                          <label
                            htmlFor="content"
                            className="block text-md font-medium leading-6 text-gray-900"
                          >
                            Location Google Map URL
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-2">
                            <input
                              id="title"
                              name="url"
                              type="text"
                              value={formData.url}
                              placeholder="Enter location google map url"
                              onChange={handleChange}
                              autoComplete="family-name"
                              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          <span className="text-red-500 mt-2 text-sm">
                            {formErrors.url}
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
                          ? "/admin/managelocation"
                          : isVendor
                          ? "/vendor/managelocation"
                          : "/doctor/managelocation"
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
        </>
      {/* )} */}
    </>
  );
};

export default EditLocation;
