import AdminSearch from "../../../Component/Admin/adminsearch";
import VendorSearch from "../../../Component/Vendor/vendorsearch";
import DoctorSearch from "../../../Component/Doctor/doctorsearch";
import React, { useState, useEffect } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import BaseUrl from "../../../Api/baseurl";

const LogoChange = () => {
  const [formData, setFormData] = useState({
    image: "",
  });

  const [formErrors, setFormErrors] = useState({
    image: "",
  });

  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const validateForm = () => {
    let isValid = true;
    const errors = { ...formErrors };
    if (formData.image === null || formData.image === "") {
      errors.image = "Please upload a logo.";
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
          text: "Do you want to update Logo?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        });

        if (confirmationResult.isConfirmed) {
          const formData = new FormData();
          formData.append("new_logo", file); // Append the file to FormData

          await axios.put(
            `${BaseUrl}clinic/logochange/`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          getData();
          Swal.fire({
            title: "Updated Successfully",
            text: "Logo Updated Successfully",
            icon: "success",
            confirmButtonText: "Okay",
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: "An error occurred while updating the logo.",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
    }
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
  const [logo, setLogo] = useState([]);
  const [, setLoading] = useState(true);
  const [, setError1] = useState(null);

  const getData = async () => {
    //   const apiUrl = 'http://127.0.0.1:8000/clinic/logochange/';
    const apiUrl = `${BaseUrl}clinic/logochange/`;
    const token = Cookies.get("token");
    // const token = localStorage.getItem('token');
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setLogo(response.data.new_logo, "data");
      setLoading(false);
    } catch (error) {
      setError1(error);
      setLoading(false);
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
          <Link className="hover:underline" color="inherit" to={isSuperuser ? "/admin/" : isVendor ? "/vendor" : "/doctor"}>
            Dashboard
          </Link>
          <Link className="hover:underline" color="inherit">
            Change Logo
          </Link>
        </Breadcrumbs>
      </div>

      <div className="legacy-panel-surface w-full px-4 py-8 mt-3">
        <div className="flex items-center justify-between">
          <span className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            {" "}
            Change Logo{" "}
          </span>
        </div>
        {logo && (
          <div className=" mt-10 rounded">
            <span>
              <img
                src={logo}
                alt=""
                className="p-2 bg-white max-w-[200px] max-h-[300px]"
              />
            </span>
          </div>
        )}
        <div>
          <form id="AddBlog" onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="pb-12">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="file-upload"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      New Logo
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2 flex rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center blockflex justify-center items-center ">
                        <div className="mb-4">
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt="Preview"
                              style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                          ) : (
                            <PhotoIcon
                              aria-hidden="true"
                              className="mx-auto h-12 w-12 text-gray-300"
                            />
                          )}
                        </div>
                        <div className="mt-2  text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span className=" ">Upload a file</span>
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
                          Supported File types: PNG, JPEG up to 2MB
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

            <div className="mt-6 flex items-center justify-start gap-4">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Update
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

export default LogoChange;
