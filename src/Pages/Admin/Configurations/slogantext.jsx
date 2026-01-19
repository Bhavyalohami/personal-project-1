import React, { useState, useEffect } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import AdminSearch from "../../../Component/Admin/adminsearch";
import VendorSearch from "../../../Component/Vendor/vendorsearch";
import DoctorSearch from "../../../Component/Doctor/doctorsearch";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import BaseUrl from "../../../Api/baseurl";
import Cookies from "js-cookie";
import Breadcrumbs from "@mui/material/Breadcrumbs";

const SloganText = () => {
  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [formData, setFormData] = useState({
    slogan_title: "",
    slogan_text: "",
  });
  const [formErrors, setFormErrors] = useState({
    slogan_title: "",
    slogan_text: "",
  });

  const getData = async () => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/slogan/`);
      // setData(response.data);
      setFormData(response.data);
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
        Cookies.remove("is_vendor");
        Cookies.remove("is_staff");
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

    if (formData.slogan_title === "") {
      errors.slogan_title = "Please enter the Slogan Title.";
      isValid = false;
    }

    if (formData.slogan_text === "") {
      errors.slogan_text = "Please enter the Slogan Text.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      // Form submission logic here
      setFormData(formData);
      setFormErrors(formErrors);

      try {
        const confirmationResult = await Swal.fire({
          title: "Update?",
          text: "Do you want to update Slogan?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          const response = await axios.put(
            `${BaseUrl}clinic/slogan/`,
            formData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          getData();
          Swal.fire({
            title: "Updated Successfully",
            text: "Slogan Updated Successfully",
            icon: "success",
            confirmButtonText: "Okay",
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  function handleBreadClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
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
          <Link className="hover:underline text-inherit" color="inherit">
            Update Slogan Text
          </Link>
        </Breadcrumbs>
      </div>
      <div className="w-full bg-[#F2F2F2] px-4 py-8 mt-3">
        <div className="flex items-center justify-between">
          <text className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Update Slogan Details
          </text>
        </div>
        <div>
          <form id="Update Links" onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="pb-12">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="slogantitle"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Slogan Title
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="slogantitle"
                        name="slogan_title"
                        type="text"
                        value={formData.slogan_title}
                        placeholder="Please enter slogan title"
                        onChange={handleChange}
                        autoComplete="family-name"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.slogan_title}
                    </span>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="slogantext"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Slogan Text
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="slogantext"
                        name="slogan_text"
                        value={formData.slogan_text}
                        placeholder="Please enter slogan text"
                        onChange={handleChange}
                        rows={4}
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.slogan_text}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-start gap-x-6">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
              <Link
                to={isSuperuser ? "/admin" : "/vendor"}
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

export default SloganText;
