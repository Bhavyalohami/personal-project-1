import React, { useState, useEffect } from "react";
import AdminSearch from "../../../Component/Admin/adminsearch";
import VendorSearch from "../../../Component/Vendor/vendorsearch";
import DoctorSearch from "../../../Component/Doctor/doctorsearch";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import BaseUrl from "../../../Api/baseurl";
import Cookies from "js-cookie";
import Breadcrumbs from "@mui/material/Breadcrumbs";

const Timings = () => {
  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [formData, setFormData] = useState({
    timings_weekday: "",
    timings_weekend: "",
  });

  const [formErrors, setFormErrors] = useState({
    timings_weekday: "",
    timings_weekend: "",
  });

  const getData = async () => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/timings/`);
      const data = response.data || {};
      setFormData((current) => ({
        ...current,
        timings_weekday: data.timings_weekday ?? "",
        timings_weekend: data.timings_weekend ?? "",
      }));
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
    }
  };
  useEffect(() => {
    setIsSuperuser(Cookies.get("is_superuser") === "true");
    setIsVendor(Cookies.get("is_vendor") === "true");
    setIsStaff(Cookies.get("is_staff") === "true");
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

    if (formData.timings_weekday === "") {
      errors.timings_weekday = "Please enter the timings.";
      isValid = false;
    }

    if (formData.timings_weekend === "") {
      errors.timings_weekend = "Please enter the timings.";
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
          text: "Do you want to update Timings?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          await axios.put(
            `${BaseUrl}clinic/timings/`,
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
            text: "Timings Updated Successfully",
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
          <Link className="hover:underline text-inherit" color="inherit">
            Update Timings
          </Link>
        </Breadcrumbs>
      </div>
      <div className="legacy-panel-surface w-full px-4 py-8 mt-3">
        <div className="flex items-center justify-between">
          <span className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Update Timings
          </span>
        </div>
        <div>
          <form id="Update Links" onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="pb-12">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="weekdays"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Weekdays
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="weekdays"
                        name="timings_weekday"
                        type="text"
                        value={formData.timings_weekday || ""}
                        placeholder="Enter the timings with AM or PM suffix"
                        onChange={handleChange}
                        autoComplete="family-name"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.timings_weekday}
                    </span>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="weekend"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Weekend
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="weekend"
                        name="timings_weekend"
                        value={formData.timings_weekend || ""}
                        placeholder="Enter the timings with AM or PM suffix"
                        onChange={handleChange}
                        rows={4}
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.timings_weekend}
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

export default Timings;
