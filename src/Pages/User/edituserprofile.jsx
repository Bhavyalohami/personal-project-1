import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import BaseUrl from "../../Api/baseurl";
import {
  FaCamera,
  FaCircleUser,
  FaFloppyDisk,
  FaIdCard,
  FaRotateLeft,
} from "react-icons/fa6";

const emptyProfile = {
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
};

const emptyErrors = {
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
};

const inputClass =
  "h-12 w-full rounded-2xl border border-[#67E8F9]/60 bg-[#ECFEFF]/70 px-4 text-sm font-semibold text-[#134E4A] outline-none transition placeholder:text-[#134E4A]/40 focus:border-[#0D9488] focus:bg-white focus:ring-4 focus:ring-[#67E8F9]/30";
const labelClass = "mb-2 block text-sm font-black text-[#134E4A]";

const FieldError = ({ children }) =>
  children ? <p className="mt-1 text-xs font-bold text-red-600">{children}</p> : null;

const EditUserProfile = () => {
  const [formData, setFormData] = useState(emptyProfile);
  const [formErrors, setFormErrors] = useState(emptyErrors);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const username = Cookies.get("patient_username");
      const response = await axios.get(
        `${BaseUrl}clinic/patient-profile/${username}/`
      );
      const profile = { ...emptyProfile, ...(response.data || {}) };
      setFormData(profile);
      setImageSrc(profile.image || "");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth();
    if (
      month < birthDate.getMonth() ||
      (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextData =
      name === "date_of_birth"
        ? { ...formData, date_of_birth: value, age: calculateAge(value) }
        : { ...formData, [name]: value };

    setFormData(nextData);
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const isvalidPinCode = (code) => {
    const pinCodeRegex = /^\d{5}(\d{1,2})?$/;
    return pinCodeRegex.test(code);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { ...emptyErrors };
    const value = (key) => String(formData[key] || "").trim();

    if (!value("name")) {
      errors.name = "Please enter the name.";
      isValid = false;
    }
    if (!formData.age) {
      errors.age = "Please enter the age.";
      isValid = false;
    }
    if (!value("contact")) {
      errors.contact = "Please enter the contact number.";
      isValid = false;
    } else if (value("contact").length !== 10) {
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
    if (!value("email")) {
      errors.email = "Please enter your email address.";
      isValid = false;
    } else if (!isValidEmail(value("email"))) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }
    if (!value("address")) {
      errors.address = "Please enter the address.";
      isValid = false;
    }
    if (!value("city")) {
      errors.city = "Please enter the city.";
      isValid = false;
    }
    if (!value("state")) {
      errors.state = "Please enter the state.";
      isValid = false;
    }
    if (!value("zipcode")) {
      errors.zipcode = "Please enter the code.";
      isValid = false;
    } else if (!isvalidPinCode(value("zipcode"))) {
      errors.zipcode = "Please enter a valid Pin Code.";
      isValid = false;
    }
    if (!formData.image && !imageSrc) {
      errors.image = "Please upload an image.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleUpload = (event) => {
    const selected = event.target.files[0];
    if (!selected) {
      setError("Please select an image file.");
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (selected.size > maxSize) {
      setError("File size exceeds 2MB.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(selected.type)) {
      setError("File type is not allowed. Please select a JPEG or PNG image.");
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      img.src = loadEvent.target.result;
    };

    img.onload = () => {
      const maxWidth = 2000;
      const maxHeight = 2000;

      if (img.width > maxWidth || img.height > maxHeight) {
        setError(`Image dimensions exceed ${maxWidth}x${maxHeight} pixels.`);
        return;
      }

      setError("");
      setFile(selected);
      setImageSrc(URL.createObjectURL(selected));
      setFormData({ ...formData, image: selected });
      setFormErrors({ ...formErrors, image: "" });
    };

    img.onerror = () => {
      setError("Error loading image.");
    };

    reader.readAsDataURL(selected);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const result = await Swal.fire({
      title: "Update profile?",
      text: "Your patient profile will be refreshed with these details.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Update profile",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    try {
      const token = Cookies.get("patient_token");
      const username = Cookies.get("patient_username");
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "image" && !file) return;
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value);
        }
      });

      if (file) {
        formDataToSend.set("image", file);
      }

      await axios.put(
        `${BaseUrl}clinic/patient-profile/${username}/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        }
      );

      Swal.fire({
        title: "Updated",
        text: "Patient information has been updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/userprofile");
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: `There was an issue updating your patient information: ${err.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleReset = () => {
    setFormErrors(emptyErrors);
    setError("");
    setFile(null);
    getData();
  };

  return (
    <main className="min-h-screen bg-[#ECFEFF] text-[#134E4A]">
      <section className="relative overflow-hidden bg-[#134E4A] px-5 py-14 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 care-scan-grid opacity-20" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#67E8F9]">
              Profile editor
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
              Keep your patient details appointment-ready.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-cyan-50/80">
              These details help bookings, doctor reviews, and patient records
              stay aligned.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Patient preview"
                className="h-32 w-32 rounded-[2rem] object-cover"
              />
            ) : (
              <FaCircleUser className="h-32 w-32 text-cyan-50/80" />
            )}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:px-12">
        <form
          id="EditUserProfile"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[1fr_0.65fr]"
        >
          <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-6 shadow-xl shadow-teal-900/10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
              Personal information
            </p>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <label>
                <span className={labelClass}>Name *</span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className={inputClass}
                />
                <FieldError>{formErrors.name}</FieldError>
              </label>

              <label>
                <span className={labelClass}>Email *</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className={inputClass}
                />
                <FieldError>{formErrors.email}</FieldError>
              </label>

              <label>
                <span className={labelClass}>Date of birth *</span>
                <input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth || ""}
                  onChange={handleChange}
                  className={inputClass}
                />
                <FieldError>{formErrors.date_of_birth}</FieldError>
              </label>

              <label>
                <span className={labelClass}>Age *</span>
                <input
                  id="age"
                  name="age"
                  type="text"
                  value={formData.age || ""}
                  onChange={handleChange}
                  readOnly
                  className={`${inputClass} cursor-not-allowed opacity-80`}
                />
                <FieldError>{formErrors.age}</FieldError>
              </label>

              <label>
                <span className={labelClass}>Contact *</span>
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  value={formData.contact || ""}
                  onChange={(event) => {
                    const digitsOnly = event.target.value.replace(/\D/g, "");
                    if (digitsOnly.length <= 10) {
                      handleChange({
                        target: { name: "contact", value: digitsOnly },
                      });
                    }
                  }}
                  className={inputClass}
                />
                <FieldError>{formErrors.contact}</FieldError>
              </label>

              <div>
                <span className={labelClass}>Gender *</span>
                <div className="grid grid-cols-2 gap-3">
                  {["Male", "Female"].map((gender) => (
                    <label
                      key={gender}
                      className={`flex h-12 cursor-pointer items-center justify-center rounded-2xl border text-sm font-black transition ${
                        formData.gender === gender
                          ? "border-[#0D9488] bg-[#0D9488] text-white"
                          : "border-[#67E8F9]/60 bg-[#ECFEFF]/70 text-[#134E4A]"
                      }`}
                    >
                      <input
                        name="gender"
                        type="radio"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {gender}
                    </label>
                  ))}
                </div>
                <FieldError>{formErrors.gender}</FieldError>
              </div>

              <label className="md:col-span-2">
                <span className={labelClass}>Address *</span>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className={`${inputClass} min-h-28 py-3`}
                />
                <FieldError>{formErrors.address}</FieldError>
              </label>

              <label>
                <span className={labelClass}>City *</span>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city || ""}
                  onChange={handleChange}
                  className={inputClass}
                />
                <FieldError>{formErrors.city}</FieldError>
              </label>

              <label>
                <span className={labelClass}>State *</span>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state || ""}
                  onChange={handleChange}
                  className={inputClass}
                />
                <FieldError>{formErrors.state}</FieldError>
              </label>

              <label>
                <span className={labelClass}>ZIP / Postal code *</span>
                <input
                  id="zipcode"
                  name="zipcode"
                  type="text"
                  value={formData.zipcode || ""}
                  onChange={handleChange}
                  className={inputClass}
                />
                <FieldError>{formErrors.zipcode}</FieldError>
              </label>

              <label>
                <span className={labelClass}>Blood group *</span>
                <select
                  id="bloodgroup"
                  name="blood_group"
                  value={formData.blood_group || ""}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Please select blood group</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                    (group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    )
                  )}
                </select>
                <FieldError>{formErrors.blood_group}</FieldError>
              </label>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-6 shadow-xl shadow-teal-900/10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECFEFF] text-2xl text-[#0D9488]">
              <FaIdCard />
            </div>
            <h2 className="mt-5 text-3xl font-black">Profile image</h2>
            <p className="mt-3 text-sm leading-7 text-[#134E4A]/70">
              Use a clear JPEG or PNG under 2MB. Images larger than 2000x2000
              pixels are blocked.
            </p>

            <label className="mt-6 flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#67E8F9] bg-[#ECFEFF]/70 p-5 text-center transition hover:border-[#0D9488] hover:bg-white">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Profile preview"
                  className="h-32 w-32 rounded-[2rem] object-cover"
                />
              ) : (
                <FaCamera className="text-4xl text-[#0D9488]" />
              )}
              <span className="mt-4 text-sm font-black">Upload image</span>
              <input
                id="file-upload"
                name="file-upload"
                accept="image/*"
                type="file"
                onChange={handleUpload}
                className="sr-only"
              />
            </label>
            <FieldError>{error || formErrors.image}</FieldError>

            <div className="mt-8 grid gap-3">
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0D9488] px-6 text-sm font-black text-white shadow-lg shadow-teal-900/10 transition hover:bg-[#0F766E]"
              >
                <FaFloppyDisk />
                Save Profile
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#67E8F9]/70 bg-white px-6 text-sm font-black text-[#134E4A] transition hover:border-[#F59E0B] hover:text-[#0D9488]"
              >
                <FaRotateLeft />
                Reset Changes
              </button>
            </div>
          </aside>
        </form>
      </section>
    </main>
  );
};

export default EditUserProfile;
