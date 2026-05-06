import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import { RiLock2Line } from "react-icons/ri";
import LoaderH from "../Loader/loader";
import AuthShell from "./AuthShell";
import {
  loginWithUsernameOrEmail,
  setLegacyAuthCookies,
} from "../../firebase/authService";

const captchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

const subRole = [
  { roleId: "3", subroles: [1, 2, 3, 4, 7, 8, 10] },
  { roleId: "4", subroles: [1, 2, 3, 4, 5, 11] },
  { roleId: "5", subroles: [3, 4, 6] },
  { roleId: "6", subroles: [2] },
  { roleId: "7", subroles: [1, 2, 3, 4] },
  { roleId: "8", subroles: [1, 2, 3, 4, 7] },
  { roleId: "9", subroles: [3, 4] },
  { roleId: "10", subroles: [1, 2, 3, 4, 7] },
  { roleId: "11", subroles: [1, 2, 3, 4, 7] },
  { roleId: "12", subroles: [4, 7] },
  { roleId: "13", subroles: [1, 2, 3, 4, 7, 9] },
  { roleId: "18", subroles: [1, 2, 3, 4, 7] },
  { roleId: "19", subroles: [1, 2, 3, 4, 7] },
];

const adminRoles = [
  1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
];

const roleCopy = {
  patient: {
    title: "Patient Login",
    eyebrow: "Patient portal",
    subtitle: "Access appointments, documents, profile details, and follow-ups.",
    redirectTo: "/userprofile",
    demo: "demo.patient",
    alternate: (
      <p className="text-center text-sm text-slate-600">
        New patient?{" "}
        <Link className="font-black text-[#0D9488]" to="/user/register">
          Create an account
        </Link>
      </p>
    ),
  },
  admin: {
    title: "Admin Login",
    eyebrow: "Admin workspace",
    subtitle: "Manage doctors, services, content, patients, and appointments.",
    redirectTo: "/admin/",
    demo: "admin",
    alternate: (
      <p className="text-center text-sm text-slate-600">
        Doctor account?{" "}
        <Link className="font-black text-[#0D9488]" to="/doctor/login">
          Go to doctor login
        </Link>
      </p>
    ),
  },
  doctor: {
    title: "Doctor Login",
    eyebrow: "Doctor workspace",
    subtitle: "Review appointments, patients, schedules, content, and feedback.",
    redirectTo: "/doctor",
    demo: "doctor",
    alternate: (
      <p className="text-center text-sm text-slate-600">
        Vendor account?{" "}
        <Link className="font-black text-[#0D9488]" to="/vendor/login">
          Go to vendor login
        </Link>
      </p>
    ),
  },
  vendor: {
    title: "Vendor Login",
    eyebrow: "Vendor workspace",
    subtitle: "Manage assigned operations, appointments, staff, and services.",
    redirectTo: "/vendor",
    demo: "vendor",
    alternate: (
      <p className="text-center text-sm text-slate-600">
        Doctor account?{" "}
        <Link className="font-black text-[#0D9488]" to="/doctor/login">
          Go to doctor login
        </Link>
      </p>
    ),
  },
};

const hasRoleAccess = (role, profile) => {
  const roles = profile?.roles || [];
  if (role === "patient") return roles.includes("patient");
  if (role === "admin") return profile?.is_superuser || roles.includes("admin");
  if (role === "doctor") {
    return profile?.is_staff || roles.includes("doctor") || roles.includes("staff");
  }
  if (role === "vendor") return profile?.is_vendor || roles.includes("vendor");
  return false;
};

const RoleLogin = ({ role }) => {
  const copy = roleCopy[role] || roleCopy.patient;
  const navigate = useNavigate();
  const captchaRef = useRef(null);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [visible, setVisible] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(!captchaSiteKey);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem(`${role}-username`);
    const storedRememberMe = localStorage.getItem(`${role}-rememberMe`);
    if (storedRememberMe === "true") {
      setRememberMe(true);
      setFormData((current) => ({ ...current, username: storedUsername || "" }));
    }
  }, [role]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setFormErrors((current) => ({ ...current, [name]: "", credentials: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.username.trim()) nextErrors.username = "Username or email is required";
    if (!formData.password) nextErrors.password = "Password is required";
    if (captchaSiteKey && !captchaVerified) nextErrors.captcha = "Please verify the captcha";
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (captchaSiteKey && !captchaRef.current?.getValue()) {
        throw new Error("Please verify the captcha");
      }

      const { token, profile } = await loginWithUsernameOrEmail(
        formData.username,
        formData.password,
      );

      if (!hasRoleAccess(role, profile)) {
        throw new Error(`This account does not have ${role} access`);
      }

      const expires = rememberMe ? 365 : 1;
      setLegacyAuthCookies({
        token,
        profile,
        expires,
        patient: role === "patient",
      });

      if (role === "admin") {
        Cookies.set("subroles", JSON.stringify(subRole), { expires });
        Cookies.set("roles", JSON.stringify(adminRoles), { expires });
      }

      if (rememberMe) {
        localStorage.setItem(`${role}-username`, formData.username);
        localStorage.setItem(`${role}-rememberMe`, "true");
      } else {
        localStorage.removeItem(`${role}-username`);
        localStorage.removeItem(`${role}-rememberMe`);
      }

      navigate(copy.redirectTo, { replace: true });
    } catch (error) {
      setFormErrors((current) => ({
        ...current,
        credentials: error.message || "Please enter correct username and password",
      }));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoaderH />;

  return (
    <AuthShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      subtitle={copy.subtitle}
      footer={copy.alternate}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {formErrors.credentials && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {formErrors.credentials}
          </div>
        )}

        <label className="block">
          <span className="mb-1.5 block text-sm font-black text-slate-700">
            Username or email
          </span>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder={`Try ${copy.demo}`}
              className="w-full rounded-md border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
            />
          </div>
          {formErrors.username && (
            <span className="mt-1 block text-xs font-semibold text-red-600">
              {formErrors.username}
            </span>
          )}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-black text-slate-700">
            Password
          </span>
          <div className="relative">
            <RiLock2Line className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={visible ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Demo123!"
              className="w-full rounded-md border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm outline-none transition focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
            />
            <button
              type="button"
              onClick={() => setVisible((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-slate-500"
              aria-label={visible ? "Hide password" : "Show password"}
            >
              {visible ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
          </div>
          {formErrors.password && (
            <span className="mt-1 block text-xs font-semibold text-red-600">
              {formErrors.password}
            </span>
          )}
        </label>

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

        <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe((current) => !current)}
            className="h-4 w-4 rounded border-slate-300 text-[#0D9488]"
          />
          Remember me
        </label>

        <button
          type="submit"
          className="w-full rounded-md bg-[#0D9488] px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-200 transition hover:bg-[#0F766E]"
        >
          Login
        </button>
      </form>
    </AuthShell>
  );
};

export default RoleLogin;
