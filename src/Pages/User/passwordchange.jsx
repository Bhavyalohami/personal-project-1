import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";
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
const PasswordChange = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    strength: {},
    score: 0,
  });

  const navigate = useNavigate();

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
    // console.log("Form is valid. Proceeding with password change...");
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
        const token = Cookies.get("patient_token");
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
        navigate("/");
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
        Cookies.remove("status");
        navigate("/user/login");
      }
      Swal.fire({
        title: "Error",
        text: "There was a problem updating the password.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

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
  return (
    <div className="py-8 px-8 bg-[#F2F2F2] w-full">
      <div className="w-full container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48  py-8 mt-3">
        <div className="flex items-center justify-center">
          <text className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Change Password
          </text>
        </div>
        <div className="p-6 mt-3 rounded-lg flex w-full items-center justify-center">
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

            <div className="mt-6 flex items-center justify-center gap-x-6">
              <Link
                to="/"
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;
