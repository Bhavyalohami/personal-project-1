import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import BaseUrl from "../../../Api/baseurl";
import Cookies from "js-cookie";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import AdminSearch from "../../../Component/Admin/adminsearch";
import VendorSearch from "../../../Component/Vendor/vendorsearch";
import DoctorSearch from "../../../Component/Doctor/doctorsearch";
const CurrencySettings = () => {
  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [formData, setFormData] = useState({
    currency_name: "",
    currency_symbol: "",
  });
  const [formErrors, setFormErrors] = useState({
    currency_name: "",
    currency_symbol: "",
  });


  const currencyOptions = [
    { name: "US Dollar", symbol: "$" },
    { name: "Euro", symbol: "€" },
    { name: "British Pound", symbol: "£" },
    { name: "Indian Rupee", symbol: "₹" },
    { name: "Japanese Yen", symbol: "¥" },
    { name: "Australian Dollar", symbol: "A$" },
    { name: "Canadian Dollar", symbol: "C$" },
    { name: "Custom", symbol: "" }, 
  ];

  const getData = async () => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/currency/`);
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

    
    if (name === "currency_name") {
      const selectedCurrency = currencyOptions.find((opt) => opt.name === value);
      setFormData({
        ...formData,
        currency_name: value,
        currency_symbol: selectedCurrency ? selectedCurrency.symbol : "",
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

  const validateForm = () => {
    let isValid = true;
    const errors = { ...formErrors };

    if (formData.currency_name === "") {
      errors.currency_name = "Please select or enter the currency name.";
      isValid = false;
    }

    if (formData.currency_symbol === "") {
      errors.currency_symbol = "Please enter the currency symbol.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      try {
        const confirmationResult = await Swal.fire({
          title: "Update?",
          text: "Do you want to update the currency settings?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });
        if (confirmationResult.isConfirmed) {
          await axios.put(`${BaseUrl}clinic/currency/`, formData, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          getData();
          Swal.fire({
            title: "Updated Successfully",
            text: "Currency settings updated successfully.",
            icon: "success",
            confirmButtonText: "Okay",
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Something went wrong. Please try again.",
        });
        
      }
    }
  };

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
      <div role="presentation" className="ml-1">
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link
            className="hover:underline"
            to={isSuperuser ? "/admin/" : "/vendor"}
          >
            Dashboard
          </Link>
          <Link className="hover:underline text-inherit">Currency Settings</Link>
        </Breadcrumbs>
      </div>
      <div className="legacy-panel-surface w-full px-4 py-8 mt-3">
        <div className="flex items-center justify-between">
          <h1 className="font-nunito-sans text-[32px] font-bold text-[#202224]">
            Currency Settings
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-12 mt-4">
            <div className="pb-12">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="currency_name"
                    className="block text-md font-medium text-gray-900"
                  >
                    Currency Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <select
                      id="currency_name"
                      name="currency_name"
                      value={formData.currency_name}
                      onChange={handleChange}
                      className="block w-full bg-white rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    >
                      <option value="">Select Currency</option>
                      {currencyOptions.map((currency, index) => (
                        <option key={index} value={currency.name}>
                          {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-red-500 mt-2 text-sm">
                    {formErrors.currency_name}
                  </span>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="currency_symbol"
                    className="block text-md font-medium text-gray-900"
                  >
                    Currency Symbol <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="currency_symbol"
                      name="currency_symbol"
                      type="text"
                      value={formData.currency_symbol}
                      placeholder="Enter currency symbol"
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <span className="text-red-500 mt-2 text-sm">
                    {formErrors.currency_symbol}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-0 flex items-center justify-start gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500"
            >
              Save
            </button>
            <Link
              to={isSuperuser ? "/admin" : "/vendor"}
              className="rounded-md px-3 py-2 text-sm font-semibold text-black border border-black"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CurrencySettings;
