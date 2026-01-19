import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import BaseUrl from "../../Api/baseurl";
import { PhotoIcon } from "@heroicons/react/24/solid";
const EditUserProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact: "",
    gender: "",
    blood_group: "",
    date_of_birth: "",
    email: "",
    address: "",
    image: "",
    zipcode: "",
    state: "",
    city: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    age: "",
    contact: "",
    gender: "",
    blood_group: "",
    date_of_birth: "",
    email: "",
    address: "",
    image: "",
    zipcode: "",
    state: "",
    city: "",
  });
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  // const [existingImage, setExistingImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const username = Cookies.get("patient_username");
    const response = await axios.get(
      `${BaseUrl}clinic/patient-profile/${username}/`
    );
    setFormData(response.data);
    setImageSrc(response.data.image);
  };
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth();
    if (month < birthDate.getMonth() || (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "date_of_birth") {
      setFormData({
        ...formData,
        date_of_birth: value,
        age: calculateAge(value),  
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

    if (!formData.name.trim()) {
      errors.name = "Please enter the name.";
      isValid = false;
    }

    if (!formData.age) {
      errors.age = "Please enter the age.";
      isValid = false;
    }

    if (!formData.contact) {
      errors.contact = "Please enter the contact number.";
      isValid = false;
    } else if (formData.contact.trim().length !== 10) {
      errors.contact = "Please enter a 10-digit contact number.";
      isValid = false;
    }

    if (!formData.gender) {
      errors.gender = "Please select the gender.";
      isValid = false;
    }

    if (!formData.blood_group) {
      errors.blood_group = "Please enter the blood group.";
      isValid = false;
    }

    if (!formData.date_of_birth) {
      errors.date_of_birth = "Please enter the date of birth.";
      isValid = false;
    }

    if (!formData.email?.trim()) {
      errors.email = "Please enter your email address.";
      isValid = false;
    } else if (!isValidEmail(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.address.trim()) {
      errors.address = "Please enter the address.";
      isValid = false;
    }

    if (!formData.city.trim()) {
      errors.city = "Please enter the city.";
      isValid = false;
    }

    if (!formData.state.trim()) {
      errors.state = "Please enter the state.";
      isValid = false;
    }
    // const codeStr = formData.code?.toString() || '';
    if (!formData.zipcode) {
      errors.zipcode = "Please enter the code.";
      isValid = false;
    } else if (!isvalidPinCode(formData.zipcode)) {
      errors.zipcode = "Please enter a valid Pin Code.";
      isValid = false;
    }

    if (!formData.image) {
      errors.image = "Please upload an image.";
      isValid = false;
    }
    // console.log(errors);
    setFormErrors(errors);
    return isValid;
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const isvalidPinCode = (code) => {
    const pinCodeRegex = /^\d{5}(\d{1,2})?$/;
    return pinCodeRegex.test(code);
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    // console.log(isValid, "form data");
    if (isValid) {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      if (file) {
        formDataToSend.append("image", file);
      }
      // console.log(formDataToSend, "forma data to send");
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
        window.scrollTo(0, 0);
        try {
          const token = Cookies.get("patient_token");
          const username = Cookies.get("patient_username");
          const response = await axios.put(
            `${BaseUrl}clinic/patient-profile/${username}/`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Token ${token}`,
              },
            }
          );
          Swal.fire({
            title: "Success!",
            text: "Patient information has been updated successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
          navigate("/userprofile");
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: `There was an issue updating your Patient information: ${error.message}`,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    }
  };

  const handleReset = () => {
    setFormErrors({
      name: "",
      age: "",
      contact: "",
      gender: "",
      blood_group: "",
      date_of_birth: "",
      email: "",
      address: "",
      image: "",
      zipcode: "",
      state: "",
      city: "",
    });
    setError("");
  };

  return (
    <div className="py-8 px-8 bg-[#F2F2F2] w-full">
      <div className="w-full container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 pb-8">
        <div className="flex items-center justify-start">
          <text className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Edit Profile
          </text>
        </div>
        <div>
          <form
            id="EditUserProfile"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="space-y-12">
              <div className="pb-12 ">
                <div className="px-4 mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Name:
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="mt-2">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formErrors.name && (
                        <p className="text-red-500">{formErrors.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email:
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formErrors.email && (
                        <p className="text-red-500">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="date_of_birth"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Date of Birth:
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="mt-2">
                      <input
                        id="date_of_birth"
                        name="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        autoComplete="family-name"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formErrors.lname && (
                        <p className="text-red-500">{formErrors.dob}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="age"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Age:
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="mt-2">
                      <input
                        id="age"
                        name="age"
                        type="text"
                        value={formData.age}
                        onChange={handleChange}
                        autoComplete="age"
                        readOnly
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formErrors.age && (
                        <p className="text-red-500">{formErrors.age}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="contact"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Contact:
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="mt-2">
                      <input
                        id="contact"
                        name="contact"
                        type="text"
                        value={formData.contact}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, "");
                          if (digitsOnly.length <= 10) {
                            handleChange({
                              target: { name: "contact", value: digitsOnly },
                            });
                          }
                        }}
                        autoComplete="tel"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formErrors.contact && (
                        <p className="text-red-500">{formErrors.contact}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Gender:
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="mt-2 flex gap-x-4">
                      <div className="flex items-center">
                        <input
                          id="male"
                          name="gender"
                          type="radio"
                          value="Male"
                          checked={formData.gender === "Male"}
                          onChange={handleChange}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label
                          htmlFor="male"
                          className="ml-1.5 block text-sm font-medium leading-6 text-gray-900"
                        >
                          Male
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="female"
                          name="gender"
                          type="radio"
                          value="Female"
                          checked={formData.gender === "Female"}
                          onChange={handleChange}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label
                          htmlFor="female"
                          className="ml-1.5 block text-sm font-medium leading-6 text-gray-900"
                        >
                          Female
                        </label>
                      </div>
                    </div>
                    {formErrors.gender && (
                      <p className="text-red-500">{formErrors.gender}</p>
                    )}
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Address:
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="mt-2">
                      <textarea
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                        autoComplete="street-address"
                        className="block w-full min-h-16 rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formErrors.address && (
                        <p className="text-red-500">{formErrors.address}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      City:
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="mt-2">
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                        autoComplete="city"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formErrors.city && (
                        <p className="text-red-500">{formErrors.city}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      State:
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="mt-2">
                      <input
                        id="state"
                        name="state"
                        type="text"
                        value={formData.state}
                        onChange={handleChange}
                        autoComplete="state"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formErrors.state && (
                        <p className="text-red-500">{formErrors.state}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="zip"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      ZIP/Postal Code:
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="mt-2">
                      <input
                        id="zipcode"
                        name="zipcode"
                        type="text"
                        value={formData.zipcode}
                        onChange={handleChange}
                        autoComplete="postal-code"
                        className="block w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formErrors.zipcode && (
                        <p className="text-red-500">{formErrors.zipcode}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="blood_group"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Blood Group:
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="mt-2">
                      <select
                        id="bloodgroup"
                        name="blood_group"
                        type="text"
                        value={formData.blood_group}
                        onChange={handleChange}
                        autoComplete="city"
                        className="block w-full bg-white rounded-md border-0 pl-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Please select blood group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                      {formErrors.blood_group && (
                        <p className="text-red-500">{formErrors.blood_group}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-4 mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="file-upload"
                      className="block text-md font-medium leading-6 text-gray-900"
                    >
                      Image
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2 flex ">
                      <div className="text-center blockflex justify-center items-center bg-white rounded-lg border border-dashed border-gray-900/25 px-4 py-6">
                        <div className="mt-2 text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 "
                          >
                            <div className="mb-2">
                              {imageSrc ? (
                                <img
                                  src={imageSrc}
                                  alt="Image-preview"
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
                            <span className="text-center p-2 blockflex justify-center items-center focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
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
                        <div className="text-xs leading-5 text-gray-600 py-2">
                          PNG, JPEG up to 2MB
                        </div>
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

            <div className="mt-6 flex items-center justify-center gap-x-6 px-4">
              <button
                type="submit"
                className="rounded-[10px] w-[150px] bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
              <button
                type="reset"
                onClick={() => handleReset()}
                className="rounded-[10px] w-[150px]  px-3 py-2 text-sm font-semibold text-black shadow-sm border border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserProfile;
