import React, { useState, useEffect } from "react";
import AdminSearch from "../../Component/Admin/adminsearch";
import VendorSearch from "../../Component/Vendor/vendorsearch";
import DoctorSearch from "../../Component/Doctor/doctorsearch";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import BaseUrl from "../../Api/baseurl";
import Cookies from "js-cookie";
import Breadcrumbs from "@mui/material/Breadcrumbs";

const SetupNotification = () => {
  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [formData, setFormData] = useState({
    whatsapp_number: "",
    whatsapp_account_SID: "",
    whatsapp_auth_token: "",
    email: "",
  });

  const [formErrors, setFormErrors] = useState({
    whatsapp_number: "",
    whatsapp_account_SID: "",
    whatsapp_auth_token: "",
    email: "",
  });

  const getData = async () => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/setupnotifications/`);
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

    // if (formData.whatsapp_number === "") {
    //   errors.whatsapp_number = "Please enter the whatsapp number.";
    //   isValid = false;
    // }else if (formData.whatsapp_number.length !== 10) {
    //     errors.whatsapp_number = "Please enter 10-digit whatsapp number.";
    //     isValid = false;
    //   }

    // if (formData.whatsapp_account_SID === "") {
    //   errors.whatsapp_account_SID = "Please enter the whatsapp account SID.";
    //   isValid = false;
    // } 

    // if (formData.whatsapp_auth_token === "") {
    //     errors.whatsapp_auth_token = "Please enter the whatsapp auth token.";
    //     isValid = false;
    // }

    // if (formData.email === "") {
    //   errors.email = "Please enter the email address.";
    //   isValid = false;
    // }

    if (formData.whatsapp_number) {
      if (formData.whatsapp_number.length !== 10) {
        errors.whatsapp_number = "Please enter a 10-digit WhatsApp number.";
        isValid = false;
      }
    } else if (
      formData.whatsapp_account_SID || 
      formData.whatsapp_auth_token
    ) {
      errors.whatsapp_number = "WhatsApp number is required if SID or Auth Token is provided.";
      isValid = false;
    }
  
    // Validate WhatsApp SID
    if (formData.whatsapp_number && formData.whatsapp_account_SID === "") {
      errors.whatsapp_account_SID = "Please enter the WhatsApp account SID.";
      isValid = false;
    }
  
    // Validate WhatsApp Auth Token
    if (formData.whatsapp_number && formData.whatsapp_auth_token === "") {
      errors.whatsapp_auth_token = "Please enter the WhatsApp auth token.";
      isValid = false;
    }
  
    // Validate Email
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address.";
        isValid = false;
      }
    }
  



    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {

      setFormData(formData);
      setFormErrors(formErrors);

      try {
        const confirmationResult = await Swal.fire({
          title: "Update?",
          text: "Do you want to update Notification Settings?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          await axios.put(
            `${BaseUrl}clinic/setupnotifications/`,
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
            text: "Notifications Settings Updated Successfully",
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
            Notification Settings
          </Link>
        </Breadcrumbs>
      </div>

      <div className="w-full bg-[#F2F2F2] px-4 py-8 mt-3">
        <div className="flex items-center justify-between">
          <span className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
          Notification Settings
          </span>
        </div>
        <div>
          <form id="Update Links" onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="pb-12">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="Whatsapp number"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Whatsapp Number
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="whatsapp number"
                        name="whatsapp_number"
                        type="text"
                        value={formData.whatsapp_number}
                        placeholder="Please enter whatsapp number"
                        onChange={handleChange}
                        autoComplete="family-name"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.whatsapp_number}
                    </span>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="whatsapp account SID"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Whatsapp account SID
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="Whatsapp account SID"
                        name="whatsapp_account_SID"
                        value={formData.whatsapp_account_SID}
                        placeholder="Please enter Whatsapp account SID"
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.whatsapp_account_SID}
                    </span>
                  </div>
                  
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="Whatsapp auth token"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Whatsapp auth token
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="Whatsapp auth token"
                        name="whatsapp_auth_token"
                        value={formData.whatsapp_auth_token}
                        placeholder="Please enter whatsapp auth token"
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.whatsapp_auth_token}
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
                        name="email"
                        value={formData.email}
                        placeholder="Please enter email"
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <span className="text-red-500 mt-2 text-sm">
                      {formErrors.email}
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

export default SetupNotification;
