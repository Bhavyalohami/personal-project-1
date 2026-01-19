import React, { useState, useEffect } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import AdminSearch from "../../../Component/Admin/adminsearch";
import DoctorSearch from "../../../Component/Doctor/doctorsearch";
import VendorSearch from "../../../Component/Vendor/vendorsearch";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import BaseUrl from "../../../Api/baseurl";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
const AddBlogCategory = () => {
    const navigate = useNavigate();
    const [isSuperuser, setIsSuperuser] = useState(false);
    const [isStaff, setIsStaff] = useState(false);
    const [isVendor, setIsVendor] = useState(false);
    useEffect(() => {
      setIsSuperuser(Cookies.get("is_superuser") === "true");
      setIsVendor(Cookies.get("is_vendor") === "true");
      setIsStaff(Cookies.get("is_staff") === "true");
    }, []);
    const [formData, setFormData] = useState({
      name: "",
    //   url: "",
    });
    const [formErrors, setFormErrors] = useState({
      name: "",
    //   url: "",
    });
    const [error, setError] = useState("");
    // const [file, setFile] = useState(null);
    // const [imageSrc, setImageSrc] = useState("");
  
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
        errors.name = "Please enter the blog category name.";
        isValid = false;
      }
      setFormErrors(errors);
      return isValid;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const isValid = validateForm();
      if (!isValid) return;
    
    
      try {
        const response = await axios.post(
          `${BaseUrl}clinic/manageblogcategories/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
    
        // Handle response status_code
        if (response.data.status_code === 409) {
          console.log("Blog Category already exists.");
          Swal.fire({
            title: "Error!",
            text: "Blog Category already exists.",
            icon: "error",
            confirmButtonText: "OK",
          });
          return;
        }
    
        // Success Message
        Swal.fire({
          title: "Success!",
          text: "Blog Category has been added successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
    
        // Navigate based on roles
        if (isSuperuser) {
          navigate("/admin/blogcategories");
        } else if (isVendor) {
          navigate("/vendor/blogcategories");
        } else {
          navigate("/doctor/blogcategories");
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
          text: `There was an issue in adding the Blog Category: ${error.message}`,
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
                  ? "/admin/blogcategories"
                  : isVendor
                  ? "/vendor/blogcategories"
                  : "/doctor/blogcategories"
              }
            >
              Manage Blog Categories
            </Link>
            <Link className="hover:underline text-inherit" color="inherit">
              Add Blog Category
            </Link>
          </Breadcrumbs>
        </div>
  
        <div className="w-full bg-[#F2F2F2] px-4 py-8 mt-3">
          <div className="flex items-center justify-between">
            <text className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
              Add Blog Category
            </text>
          </div>
          <div>
            <form id="AddBlog" onSubmit={handleSubmit}>
              <div className="space-y-12">
                <div className="pb-12">
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="title"
                        className="block text-md font-medium leading-6 text-gray-900"
                      >
                        Blog Category Name
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-2">
                        <input
                          id="title"
                          name="name"
                          type="text"
                          value={formData.name}
                          placeholder="Enter blog category name"
                          onChange={handleChange}
                          autoComplete="family-name"
                          className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <span className="text-red-500 mt-2 text-sm">
                        {formErrors.name}
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
                      ? "/admin/blogcategories"
                      : isVendor
                      ? "/vendor/blogcategories"
                      : "/doctor/blogcategories"
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
}

export default AddBlogCategory