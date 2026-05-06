import React, { useState, useEffect } from "react";
import AdminSearch from "../../../Component/Admin/adminsearch";
import VendorSearch from "../../../Component/Vendor/vendorsearch";
import DoctorSearch from "../../../Component/Doctor/doctorsearch";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import BaseUrl from "../../../Api/baseurl";
import Cookies from "js-cookie";
import Breadcrumbs from "@mui/material/Breadcrumbs";

const Address = () => {
  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [formData, setFormData] = useState({
    email_address: "",
    address: "",
    contact_number: "",
    company_name: "",
  });

  const [formErrors, setFormErrors] = useState({
    email_address: "",
    address: "",
    contact_number: "",
    company_name: "",
  });

  const getData = async () => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/address/`);
      const data = response.data || {};
      setFormData((current) => ({
        ...current,
        email_address: data.email_address ?? "",
        address: data.address ?? "",
        contact_number: data.contact_number ?? "",
        company_name: data.company_name ?? "",
      }));
    } catch (error) {
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
      console.error(error);
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

    if (formData.company_name === "") {
      errors.company_name = "Please enter the company name.";
      isValid = false;
    }

    if (formData.contact_number === "") {
      errors.contact_number = "Please enter the contact number.";
      isValid = false;
    } else if (formData.contact_number.length !== 10) {
      errors.contact_number = "Please enter 10-digit contact number.";
      isValid = false;
    }

    if (formData.email_address === "") {
      errors.email_address = "Please enter the email address.";
      isValid = false;
    }

    if (formData.address === "") {
      errors.address = "Please enter the address.";
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
          text: "Do you want to update Address?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          await axios.put(
            `${BaseUrl}clinic/address/`,
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
            text: "Address Updated Successfully",
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
            Update Address
          </Link>
        </Breadcrumbs>
      </div>

      <div className="legacy-panel-surface w-full px-4 py-8 mt-3">
        <div className="flex items-center justify-between">
          <span className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Update Address
          </span>
        </div>
        <div>
          <form id="Update Links" onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="pb-12">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="companyname"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Company Name
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="companyname"
                        name="company_name"
                        type="text"
                        value={formData.company_name || ""}
                        placeholder="Please enter company name"
                        onChange={handleChange}
                        autoComplete="family-name"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.company_name}
                    </span>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="contactno"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Contact Number
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="contactno"
                        name="contact_number"
                        value={formData.contact_number || ""}
                        placeholder="Please enter contact number"
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.contact_number}
                    </span>
                  </div>
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="emailaddress"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Email Address
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="emailaddress"
                        name="email_address"
                        value={formData.email_address || ""}
                        placeholder="Please enter email"
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.email_address}
                    </span>
                  </div>
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="address"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Address
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="address"
                        name="address"
                        value={formData.address || ""}
                        placeholder="Please enter address"
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-start gap-x-6">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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

export default Address;
