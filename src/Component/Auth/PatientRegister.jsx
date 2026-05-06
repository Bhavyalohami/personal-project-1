import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Swal from "sweetalert2";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import LoaderH from "../Loader/loader";
import AuthShell from "./AuthShell";
import {
  registerPatient,
  setLegacyAuthCookies,
  usernameExists,
} from "../../firebase/authService";

const captchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

const PatientRegister = () => {
  const navigate = useNavigate();
  const captchaRef = useRef(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [usernameMessage, setUsernameMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(!captchaSiteKey);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Use at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Add at least one capital letter";
    if (!/[a-z]/.test(password)) return "Add at least one small letter";
    if (!/[0-9]/.test(password)) return "Add at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Add at least one special character";
    }
    return "";
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.username.trim()) nextErrors.username = "Username is required";
    if (!formData.email.trim()) nextErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = "Email is invalid";
    const passwordError = validatePassword(formData.password);
    if (passwordError) nextErrors.password = passwordError;
    if (!formData.confirmPassword) nextErrors.confirmPassword = "Confirm your password";
    else if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = "Passwords do not match";
    }
    if (captchaSiteKey && !captchaVerified) nextErrors.captcha = "Please verify the captcha";
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const exists = await usernameExists(username);
      setUsernameMessage(exists ? "This username already exists" : "Username is available");
    } catch (error) {
      setUsernameMessage("");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setFormErrors((current) => ({ ...current, [name]: "" }));

    if (name === "username" && value.trim().length > 3) {
      checkUsernameAvailability(value);
    } else if (name === "username") {
      setUsernameMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (captchaSiteKey && !captchaRef.current?.getValue()) {
        throw new Error("Please verify the captcha");
      }

      const { token, profile } = await registerPatient(formData);
      if (token && profile) {
        setLegacyAuthCookies({ token, profile, patient: true, expires: 1 });
      }
      await Swal.fire({
        title: "Success!",
        text: "Your account has been created successfully.",
        icon: "success",
        confirmButtonText: "Continue",
      });
      navigate("/userprofile", { replace: true });
    } catch (error) {
      Swal.fire({
        title: "Registration failed",
        text: error.message || "Please check your details and try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoaderH />;

  return (
    <AuthShell
      eyebrow="Create account"
      title="Patient Register"
      subtitle="Create a patient profile to book faster and manage your appointments."
      footer={
        <p className="text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link className="font-black text-[#0D9488]" to="/user/login">
            Login
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1.5 block text-sm font-black text-slate-700">
            Username
          </span>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            className="w-full rounded-md border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
          />
          {formErrors.username && (
            <span className="mt-1 block text-xs font-semibold text-red-600">
              {formErrors.username}
            </span>
          )}
          {usernameMessage && (
            <span
              className={`mt-1 block text-xs font-semibold ${
                usernameMessage.includes("exists") ? "text-red-600" : "text-[#0D9488]"
              }`}
            >
              {usernameMessage}
            </span>
          )}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-black text-slate-700">
            Email
          </span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full rounded-md border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
          />
          {formErrors.email && (
            <span className="mt-1 block text-xs font-semibold text-red-600">
              {formErrors.email}
            </span>
          )}
        </label>

        {[
          ["password", "Password", visible, setVisible],
          ["confirmPassword", "Confirm Password", confirmVisible, setConfirmVisible],
        ].map(([name, label, isVisible, setIsVisible]) => (
          <label className="block" key={name}>
            <span className="mb-1.5 block text-sm font-black text-slate-700">
              {label}
            </span>
            <div className="relative">
              <input
                type={isVisible ? "text" : "password"}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={name === "password" ? "Use Demo123! style strength" : "Repeat password"}
                className="w-full rounded-md border border-slate-200 px-3 py-3 pr-11 text-sm outline-none transition focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
              />
              <button
                type="button"
                onClick={() => setIsVisible((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-slate-500"
                aria-label={isVisible ? "Hide password" : "Show password"}
              >
                {isVisible ? <AiFillEye /> : <AiFillEyeInvisible />}
              </button>
            </div>
            {formErrors[name] && (
              <span className="mt-1 block text-xs font-semibold text-red-600">
                {formErrors[name]}
              </span>
            )}
          </label>
        ))}

        {captchaSiteKey && (
          <div>
            <ReCAPTCHA
              ref={captchaRef}
              sitekey={captchaSiteKey}
              onChange={() => {
                setCaptchaVerified(true);
                setFormErrors((current) => ({ ...current, captcha: "" }));
              }}
            />
            {formErrors.captcha && (
              <span className="mt-1 block text-xs font-semibold text-red-600">
                {formErrors.captcha}
              </span>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-[#0D9488] px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-200 transition hover:bg-[#0F766E]"
        >
          Create Account
        </button>
      </form>
    </AuthShell>
  );
};

export default PatientRegister;
