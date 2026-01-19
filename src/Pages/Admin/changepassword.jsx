import React, { useState, useEffect } from "react";
import AdminSearch from "../../Component/Admin/adminsearch";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";
import DoctorSearch from "../../Component/Doctor/doctorsearch";
import VendorSearch from "../../Component/Vendor/vendorsearch";
import Breadcrumbs from "@mui/material/Breadcrumbs";

// Helper function to check password strength
const checkPasswordStrength = (password) => {
  const strength = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(strength).filter(Boolean).length;

  return { strength, score };
};

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    strength: {},
    score: 0,
  });
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const superuser = Cookies.get("is_superuser") === "true";
    const staff = Cookies.get("is_staff") === "true";
    const vendor = Cookies.get("is_vendor") === "true";
    setIsSuperuser(superuser);
    setIsStaff(staff);
    setIsVendor(vendor);
  }, []);
  // Validate form on submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = {};

    if (!currentPassword) {
      validationErrors.currentPassword = "Current password is required.";
    }

    if (!newPassword) {
      validationErrors.newPassword = "New password is required.";
    } else {
      const { strength } = passwordStrength;

      if (!strength.length) {
        validationErrors.newPassword =
          "New password must be at least 8 characters long.";
      } else if (
        !strength.uppercase ||
        !strength.lowercase ||
        !strength.digit ||
        !strength.special
      ) {
        validationErrors.newPassword =
          "New password must include uppercase, lowercase, digit, and special character.";
      } else if (newPassword === currentPassword) {
        validationErrors.newPassword =
          "New password must be different from the current password.";
      }
    }

    if (newPassword !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }


    try {
      const confirmationResult = await Swal.fire({
        title: "Update?",
        text: "Do you want to update Password?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (confirmationResult.isConfirmed) {
        // const token = localStorage.getItem('auth_token');
        const token = Cookies.get("token");
        const response = await axios.put(
          `${BaseUrl}clinic/changepassword/`,
          {
            old_password: currentPassword,
            new_password: newPassword,
            confirm_new_password: confirmPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );

        Swal.fire({
          title: "Updated Successfully",
          text: "Password Updated Successfully",
          icon: "success",
          confirmButtonText: "Okay",
        });

        // Clear form fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
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
      Swal.fire({
        title: "Error",
        text: "There was a problem updating the password.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  // Update password strength as user types
  useEffect(() => {
    const { strength, score } = checkPasswordStrength(newPassword);
    setPasswordStrength({ strength, score });
  }, [newPassword]);

  const passwordStrengthClasses = [
    passwordStrength.strength.length ? "bg-green-200" : "bg-red-200",
    passwordStrength.strength.uppercase ? "bg-green-200" : "bg-red-200",
    passwordStrength.strength.lowercase ? "bg-green-200" : "bg-red-200",
    passwordStrength.strength.digit ? "bg-green-200" : "bg-red-200",
    passwordStrength.strength.special ? "bg-green-200" : "bg-red-200",
  ];
  const [superuser, setSuperuser] = useState(false);
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
          <Link className="hover:underline text-inherit" color="inherit">
            Change Password
          </Link>
        </Breadcrumbs>
      </div>
      <div className="w-full bg-[#F2F2F2] px-4 py-8 mt-3 h-screen">
        <div className="flex items-center justify-between">
          <text className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Change Password
          </text>
        </div>
        <div className="p-6 mt-3 rounded-lg ">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="current-password"
                className="block text-sm font-medium text-gray-700"
              >
                Current Password<span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                placeholder="Enter current password"
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`mt-1 block w-full md:w-[400px] xl:w-[600px] px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.currentPassword ? "border-red-500" : ""
                }`}
              />
              {errors.currentPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.currentPassword}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password<span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                placeholder="Enter new password"
                onChange={(e) => setNewPassword(e.target.value)}
                className={`mt-1 block w-full md:w-[400px] xl:w-[600px] px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.newPassword ? "border-red-500" : ""
                }`}
              />
              <div className="mt-2">
                <p
                  className={`text-sm ${
                    passwordStrength.strength.length
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {passwordStrength.strength.length
                    ? "✓ At least 8 characters"
                    : "✗ At least 8 characters"}
                </p>
                <p
                  className={`text-sm ${
                    passwordStrength.strength.uppercase
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {passwordStrength.strength.uppercase
                    ? "✓ Contains uppercase letter"
                    : "✗ Contains uppercase letter"}
                </p>
                <p
                  className={`text-sm ${
                    passwordStrength.strength.lowercase
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {passwordStrength.strength.lowercase
                    ? "✓ Contains lowercase letter"
                    : "✗ Contains lowercase letter"}
                </p>
                <p
                  className={`text-sm ${
                    passwordStrength.strength.digit
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {passwordStrength.strength.digit
                    ? "✓ Contains digit"
                    : "✗ Contains digit"}
                </p>
                <p
                  className={`text-sm ${
                    passwordStrength.strength.special
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {passwordStrength.strength.special
                    ? "✓ Contains special character"
                    : "✗ Contains special character"}
                </p>
              </div>
              {errors.newPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password<span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                placeholder="Re-enter new password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`mt-1 block w-full md:w-[400px] xl:w-[600px] px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="mt-10 flex items-center justify-start gap-x-6">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Change Password
              </button>
              <Link
                to={isSuperuser ? "/admin/" : isVendor ? "/vendor" : "/doctor"}
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900 px-2.5 py-[5px] border border-2 border-black rounded-md"
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

export default ChangePassword;
