import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSearch from "../../Component/Admin/adminsearch";
import DoctorSearch from "../../Component/Doctor/doctorsearch";
import axios from "axios";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";
import Swal from "sweetalert2";
import VendorSearch from "../../Component/Vendor/vendorsearch";
import Breadcrumbs from "@mui/material/Breadcrumbs";

const MyProfile = () => {
  const [data, setData] = useState({
    image: "",
    username: "",
    role: "",
    fname: "",
    lname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    code: "",
  });
  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const fallbackName =
    [data.fname, data.lname].filter(Boolean).join(" ") ||
    Cookies.get("username") ||
    "Doctor";
  const fallbackRole =
    data.role || (isStaff && !isVendor ? "Doctor" : isVendor ? "Clinic Vendor" : "Care Team");

  useEffect(() => {
    const Suser = Cookies.get("is_superuser");
    const Staff = Cookies.get("is_staff");
    const Vendor = Cookies.get("is_vendor");
    setIsSuperuser(Cookies.get("is_superuser") === "true");
    setIsStaff(Cookies.get("is_staff") === "true");
    setIsVendor(Cookies.get("is_vendor") === "true");
    if (Suser === "true") {
      const url = `${BaseUrl}clinic/admin/`;
      fetchData(url);
    } else if (Staff === "true" && Vendor === "false") {
      const username = Cookies.get("username");
      const url = `${BaseUrl}clinic/staff-list/${username}`;
      fetchData(url);
    } else if (Vendor === "true" && Staff === "false") {
      const user = Cookies.get("username");
      const apiUrl = `${BaseUrl}clinic/vendor-profile/${user}`;
      fetchData(apiUrl);
    } else if (Vendor === "true" && Staff === "true") {
      const user = Cookies.get("username");
      const url = `${BaseUrl}clinic/staff-list/${user}`;
      fetchData(url);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (apiUrl) => {
    const token = Cookies.get("token");
    if (!token) {
      // Handle error (e.g., redirect to login)
      console.error("Authentication error.");
      return;
    }
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
            My Profile
          </Link>
        </Breadcrumbs>
      </div>
      {data && (
        <div className="w-full bg-[#F2F2F2] px-4 py-4 mt-3">
          <div className="flex items-center justify-between pb-4">
            <p className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
              My Profile
            </p>
            <Link
              to={
                isSuperuser
                  ? "/admin/myprofile/editprofile"
                  : isVendor
                  ? "/vendor/myprofile/editprofile"
                  : "/doctor/myprofile/editprofile"
              }
              className="font-nunito-sans text-14px font-bold leading-27px text-[#ffffff] bg-[#4379EE] py-3 px-4 rounded-lg text-center"
            >
              Edit Profile
            </Link>
          </div>
          <div className="flex w-full">
            <div className="flex items-center w-full">
              <img
                className="mr-5 h-24 w-24 rounded-full object-cover"
                src={data.image || "/brand/doctor-avatar-teal.png"}
                alt="Profile"
              />
              <div className="flex flex-col w-full">
                <p className="font-nunito text-[22px] lg:text-[32px] font-bold leading-[43.65px] tracking-[-0.114px]">
                  {fallbackName}
                </p>
                <p className="font-nunito text-[#113C54] text-[18px] lg:text-[28px] font-bold leading-[43.65px] tracking-[-0.114px]">
                  {fallbackRole}
                </p>
              </div>
              {/* <div className="flex flex-col w-full h-full items-end justify-start">
                <p className="text-[#113C54] font-open-sans text-[13px] lg:text-[18px] font-semibold leading-[24.51px] tracking-[-0.114px]">
                  Last Login 2-hours ago
                </p>
              </div> */}
            </div>
          </div>

          <div className="my-4">
            <p className="font-open-sans text-[22px] font-semibold leading-[29.96px] tracking-[-0.114px]">
              Personal Info
            </p>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 bg-[#ffffff] p-4 mt-2 gap-8 rounded-xl">
              <div className="flex flex-col w-full py-2">
                <p className="font-open-sans text-[18px] font-semibold leading-[24.51px] tracking-[-0.114px]">
                  First Name:
                </p>
                <p className="font-open-sans text-[18px] font-normal leading-[24.51px] tracking-[-0.114px] mt-1">
                  {data.fname}
                </p>
              </div>
              <div className="flex flex-col w-full py-2">
                <p className="font-open-sans text-[18px] font-semibold leading-[24.51px] tracking-[-0.114px]">
                  Last Name:
                </p>
                <p className="font-open-sans text-[18px] font-normal leading-[24.51px] tracking-[-0.114px] mt-1">
                  {data.lname}
                </p>
              </div>
              <div className="flex flex-col w-full py-2">
                <p className="font-open-sans text-[18px] font-semibold leading-[24.51px] tracking-[-0.114px]">
                  Email:
                </p>
                <p className="font-open-sans text-[18px] font-normal leading-[24.51px] tracking-[-0.114px] mt-1">
                  {data.email}
                </p>
              </div>
              <div className="flex flex-col w-full py-2">
                <p className="font-open-sans text-[18px] font-semibold leading-[24.51px] tracking-[-0.114px]">
                  Phone
                </p>
                <p className="font-open-sans text-[18px] font-normal leading-[24.51px] tracking-[-0.114px] mt-1">
                  {data.phone ? `+91 ${data.phone}` : "Not added"}
                </p>
              </div>
            </div>
          </div>
          <div className="my-4">
            <p className="font-open-sans text-[22px] font-semibold leading-[29.96px] tracking-[-0.114px]">
              Location
            </p>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 bg-[#ffffff] p-4 mt-2 gap-8 rounded-xl">
              <div className="col-span-1 md:col-span-2 flex flex-col w-full py-2">
                <p className="font-open-sans text-[18px] font-semibold leading-[24.51px] tracking-[-0.114px]">
                  Address:
                </p>
                <p className="font-open-sans text-[18px] font-normal leading-[24.51px] tracking-[-0.114px] mt-1">
                  {data.address}
                </p>
              </div>
              <div className="flex flex-col w-full py-2">
                <p className="font-open-sans text-[18px] font-semibold leading-[24.51px] tracking-[-0.114px]">
                  City:
                </p>
                <p className="font-open-sans text-[18px] font-normal leading-[24.51px] tracking-[-0.114px] mt-1">
                  {data.city}
                </p>
              </div>
              <div className="flex flex-col w-full py-2">
                <p className="font-open-sans text-[18px] font-semibold leading-[24.51px] tracking-[-0.114px]">
                  State:
                </p>
                <p className="font-open-sans text-[18px] font-normal leading-[24.51px] tracking-[-0.114px] mt-1">
                  {data.state}
                </p>
              </div>
              <div className="flex flex-col w-full py-2">
                <p className="font-open-sans text-[18px] font-semibold leading-[24.51px] tracking-[-0.114px]">
                  Country:
                </p>
                <p className="font-open-sans text-[18px] font-normal leading-[24.51px] tracking-[-0.114px] mt-1">
                  {data.country}
                </p>
              </div>
              <div className="flex flex-col w-full py-2">
                <p className="font-open-sans text-[18px] font-semibold leading-[24.51px] tracking-[-0.114px]">
                  Zip Code
                </p>
                <p className="font-open-sans text-[18px] font-normal leading-[24.51px] tracking-[-0.114px] mt-1">
                  {data.code}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
