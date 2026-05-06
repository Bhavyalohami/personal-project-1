import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaCheck, FaKey, FaShieldHeart, FaXmark } from "react-icons/fa6";

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

const inputClass =
  "h-12 w-full rounded-2xl border border-[#67E8F9]/60 bg-[#ECFEFF]/70 px-4 pr-12 text-sm font-semibold text-[#134E4A] outline-none transition placeholder:text-[#134E4A]/40 focus:border-[#0D9488] focus:bg-white focus:ring-4 focus:ring-[#67E8F9]/30";

const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  error,
  visible,
  onToggle,
}) => (
  <label className="block">
    <span className="mb-2 block text-sm font-black text-[#134E4A]">
      {label}<span className="text-red-600">*</span>
    </span>
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        id={id}
        value={value}
        onChange={onChange}
        className={`${inputClass} ${error ? "border-red-400" : ""}`}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-[#134E4A]/60"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <AiFillEyeInvisible /> : <AiFillEye />}
      </button>
    </div>
    {error && <p className="mt-1 text-xs font-bold text-red-600">{error}</p>}
  </label>
);

const PasswordChange = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [passwordStrength, setPasswordStrength] = useState({
    strength: {},
    score: 0,
  });

  const navigate = useNavigate();

  const requirements = useMemo(
    () => [
      ["length", "At least 8 characters"],
      ["uppercase", "Contains uppercase letter"],
      ["lowercase", "Contains lowercase letter"],
      ["digit", "Contains digit"],
      ["special", "Contains special character"],
    ],
    []
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        title: "Update password?",
        text: "Your account password will be changed after confirmation.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Update password",
        cancelButtonText: "Cancel",
      });

      if (confirmationResult.isConfirmed) {
        const token = Cookies.get("patient_token");
        await axios.put(
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
          title: "Updated",
          text: "Password updated successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        navigate("/userprofile");
      }
    } catch (error) {
      console.error(error);
      if (error.code === "ERR_BAD_REQUEST") {
        Swal.fire({
          icon: "warning",
          title: "Session expired. Please login again.",
        });
        Cookies.remove("patient_token");
        Cookies.remove("patient_username");
        Cookies.remove("patient_status");
        navigate("/user/login");
        return;
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

  const toggleVisibility = (key) => {
    setVisible((current) => ({ ...current, [key]: !current[key] }));
  };

  const progressWidth = `${(passwordStrength.score / 5) * 100}%`;

  return (
    <main className="min-h-screen bg-[#ECFEFF] text-[#134E4A]">
      <section className="relative overflow-hidden bg-[#134E4A] px-5 py-14 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 care-scan-grid opacity-20" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#67E8F9]">
              Account security
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
              Change your password with confidence.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-cyan-50/80">
              Use a strong password that is unique to your CareBridge patient
              portal.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur">
            <FaShieldHeart className="text-4xl text-[#67E8F9]" />
            <h2 className="mt-5 text-3xl font-black">Protected access</h2>
            <p className="mt-3 text-sm leading-7 text-cyan-50/80">
              Password updates require your current password and explicit
              confirmation before submitting.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-6 shadow-xl shadow-teal-900/10"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECFEFF] text-2xl text-[#0D9488]">
              <FaKey />
            </div>
            <h2 className="mt-5 text-3xl font-black">New password</h2>
            <div className="mt-6 grid gap-5">
              <PasswordInput
                id="current-password"
                label="Current Password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                error={errors.currentPassword}
                visible={visible.current}
                onToggle={() => toggleVisibility("current")}
              />

              <PasswordInput
                id="new-password"
                label="New Password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                error={errors.newPassword}
                visible={visible.next}
                onToggle={() => toggleVisibility("next")}
              />

              <PasswordInput
                id="confirm-password"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                error={errors.confirmPassword}
                visible={visible.confirm}
                onToggle={() => toggleVisibility("confirm")}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-[#0D9488] px-6 text-sm font-black text-white shadow-lg shadow-teal-900/10 transition hover:bg-[#0F766E]"
              >
                Change Password
              </button>
              <Link
                to="/userprofile"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-[#67E8F9]/70 bg-white px-6 text-sm font-black text-[#134E4A] transition hover:border-[#F59E0B] hover:text-[#0D9488]"
              >
                Cancel
              </Link>
            </div>
          </form>

          <aside className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-6 shadow-xl shadow-teal-900/10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
              Strength check
            </p>
            <h2 className="mt-2 text-3xl font-black">
              {passwordStrength.score >= 5 ? "Strong password" : "Build strength"}
            </h2>
            <div className="mt-5 overflow-hidden rounded-full bg-[#ECFEFF]">
              <div
                className="h-3 rounded-full bg-[#F59E0B] transition-all"
                style={{ width: progressWidth }}
              />
            </div>

            <div className="mt-6 grid gap-3">
              {requirements.map(([key, label]) => {
                const passed = Boolean(passwordStrength.strength[key]);
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-black ${
                      passed
                        ? "border-[#0D9488]/25 bg-[#ECFEFF] text-[#134E4A]"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full ${
                        passed ? "bg-[#0D9488] text-white" : "bg-white text-slate-400"
                      }`}
                    >
                      {passed ? <FaCheck /> : <FaXmark />}
                    </span>
                    {label}
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default PasswordChange;
