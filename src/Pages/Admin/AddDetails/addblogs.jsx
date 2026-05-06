import React, { useState, useEffect } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import AdminSearch from "../../../Component/Admin/adminsearch";
import DoctorSearch from "../../../Component/Doctor/doctorsearch";
import VendorSearch from "../../../Component/Vendor/vendorsearch";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import Cookies from "js-cookie";
import BaseUrl from "../../../Api/baseurl";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import LoaderH from "../../../Component/Loader/loader";

const AddBlog = () => {
  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  useEffect(() => {
    setIsSuperuser(Cookies.get("is_superuser") === "true");
    setIsVendor(Cookies.get("is_vendor") === "true");
    setIsStaff(Cookies.get("is_staff") === "true");
    getBlogData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    text: "",
    category: "",
    author: "",
    image: null,
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    text: "",
    category: "",
    author: "",
    image: null,
  });
  const [error, setError] = useState("");
  const [, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const [blogCategory, setBlogCategory] = useState([]);

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
  const handleEditorChange = (value) => {
    setFormData({
      ...formData,
      text: value,
    });
  };
  const validateForm = () => {
    let isValid = true;
    const errors = { ...formErrors };

    if (!formData.name.trim()) {
      errors.name = "Please enter the title.";
      isValid = false;
    }

    if (!formData.text.trim()) {
      errors.text = "Please enter the description.";
      isValid = false;
    }

    if (!formData.category) {
      errors.category = "Please select the category.";
      isValid = false;
    }

    if (!formData.author.trim()) {
      errors.author = "Please enter the author title.";
      isValid = false;
    }

    if (!formData.image) {
      errors.image = "Please upload an image.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const getBlogData = async () => {
    const apiUrl = `${BaseUrl}clinic/manageblogcategories/`;

    const token = Cookies.get("token");

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setBlogCategory(response.data);
    } catch (error) {
      setError(error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      const token = Cookies.get("token");
      const apiUrl = `${BaseUrl}clinic/submit-blog/`;
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        await axios.post(apiUrl, formData, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        Swal.fire({
          title: "Success!",
          text: "Blog has been submitted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setLoading(false)
        if (isSuperuser) {
          navigate("/admin/blogs");
        } else if (isVendor) {
          navigate("/vendor/blogs");
        } else {
          navigate("/doctor/blogs");
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: `There was an issue submitting your contact information: ${error.message}`,
          icon: "error",
          confirmButtonText: "OK",
        });
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
      console.log("Form submitted successfully");
      setFormData(formData);
      setFormErrors(formErrors);
      setImageSrc("");
      setFile(null);
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError("Please select an image file.");
      return;
    }

    const maxSize = 2 * 1024 * 1024;
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
      const maxWidth = 2000;
      const maxHeight = 2000;
      if (img.width > maxWidth || img.height > maxHeight) {
        setError(`Image dimensions exceed ${maxWidth}x${maxHeight} pixels.`);
        return;
      } else {
        setError("");
        setFile(file);
        setImageSrc(URL.createObjectURL(file));
        setFormData({
          ...formData,
          image: file,
        });
        setFormErrors({
          ...formErrors,
          image: "",
        });
      }
    };

    img.onerror = () => {
      setError("Error loading image.");
    };

    reader.readAsDataURL(file);
  };
  function handleBreadClick(event) {
    event.preventDefault();
  }
  return (
    <>
      {loading ? (
        <LoaderH />
      ) : (
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
              <Link
                className="hover:underline text-inherit"
                color="inherit"
                to={
                  isSuperuser
                    ? "/admin/blogs"
                    : isVendor
                    ? "/vendor/blogs"
                    : "/doctor/blogs"
                }
              >
                Manage Blogs
              </Link>
              <Link className="hover:underline text-inherit" color="inherit">
                Add Blog
              </Link>
            </Breadcrumbs>
          </div>

          <div className="legacy-panel-surface w-full px-4 py-8 mt-3">
            <div className="flex items-center justify-between">
              <span className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
                Add Blog
              </span>
            </div>
            <div>
              <form id="AddBlog" onSubmit={handleSubmit}>
                <div className="space-y-12">
                  <div className="pb-12">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="title"
                          className="block text-md font-medium leading-6 text-gray-900"
                        >
                          Title
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            id="title"
                            name="name"
                            type="text"
                            value={formData.name}
                            placeholder="Enter title"
                            onChange={handleChange}
                            autoComplete="family-name"
                            className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.name}
                        </span>
                      </div>

                      <div className="col-span-full">
                        <label
                          htmlFor="description"
                          className="block text-md font-medium leading-6 text-gray-900"
                        >
                          Description
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2 ">
                          {/* <textarea
                                                id="description"
                                                name="text"
                                                value={formData.text}
                                                onChange={handleChange}
                                                rows={4}
                                                className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            /> */}
                          <ReactQuill
                            value={formData.text}
                            onChange={handleEditorChange}
                            placeholder="Enter description"
                            theme="snow"
                            className="h-20 mb-4"
                          />
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.text}
                        </span>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="authortitle"
                          className="block text-md font-medium leading-6 text-gray-900"
                        >
                          Author Name
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            id="authortitle"
                            name="author"
                            value={formData.author}
                            placeholder="Enter author name"
                            onChange={handleChange}
                            type="text"
                            autoComplete="given-name"
                            className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.author}
                        </span>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="category"
                          className="block text-md font-medium leading-6 text-gray-900"
                        >
                          Category
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            autoComplete="country-name"
                            className="block w-full rounded-md border-0 bg-white pl-3 py-[9px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            <option value="">Select a category</option>
                            {blogCategory.length > 0 &&
                              blogCategory.map((category) => (
                                <option key={category.id} value={category.name}>
                                  {category.name}
                                </option>
                              ))}
                            {/* <option value="Eye Specialists">Eye Specialists</option>
                        <option value="Heart Specialists">
                          Heart Specialists
                        </option>
                        <option value="Brain Surgeon">Brain Surgeon</option> */}
                          </select>
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {formErrors.category}
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
                        <div className="mt-2 flex  ">
                          <div className="text-center blockflex justify-center items-center bg-white rounded-lg border border-dashed border-gray-900/25 px-24 py-16">
                            <div className="mt-4 text-sm leading-6 text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 "
                              >
                                <div className="mb-2">
                                  {imageSrc ? (
                                    <img
                                      src={imageSrc}
                                      alt="Preview"
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
                                <span className=" text-center p-2 blockflex justify-center items-center focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
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
                            <p className="text-xs leading-5 text-gray-600 py-2">
                              PNG, JPEG up to 2MB
                            </p>
                          </div>
                        </div>
                        <span className="text-red-500 mt-2 text-sm">
                          {error}
                        </span>
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
                        ? "/admin/blogs"
                        : isVendor
                        ? "/vendor/blogs"
                        : "/doctor/blogs"
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
      )}
    </>
  );
};

export default AddBlog;
