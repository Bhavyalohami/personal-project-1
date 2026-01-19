import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSearch from "../../Component/Admin/adminsearch";
import DoctorSearch from "../../Component/Doctor/doctorsearch";
import VendorSearch from "../../Component/Vendor/vendorsearch";
import { RiNotificationBadgeFill } from "react-icons/ri";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";
import axios from "axios";
import { BiSolidNotificationOff } from "react-icons/bi";
import { PiTimerBold } from "react-icons/pi";
import { FaCalendarCheck, FaRedo, FaBan } from "react-icons/fa"; // Additional icons
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Swal from "sweetalert2";

const Notification = () => {
  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [active, setActive] = useState("recent");
  const [notifications, setNotifications] = useState([]);
  const [info, setInfo] = useState({});

  useEffect(() => {
    const superuser = Cookies.get("is_superuser") === "true";
    const staff = Cookies.get("is_staff") === "true";
    const vendor = Cookies.get("is_vendor") === "true";
    setIsSuperuser(superuser);
    setIsStaff(staff);
    setIsVendor(vendor);
    getData();
  }, []);

  useEffect(() => {
    const username = Cookies.get("username");

    const socket = new WebSocket(
      `ws://127.0.0.1:8001/ws/notifications/${username}/`
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prev) => [...prev, data.message]);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleNotificationClick = async (id) => {
    try {
      // Mark notification as read
      await axios.put(`${BaseUrl}/clinic/notifications/mark-as-read/${id}/`);
      // Update the notification status locally
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
      getData();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getData = async () => {
    const username = Cookies.get("username");
    try {
      const response = await axios.get(
        `${BaseUrl}clinic/get-notification/${username}/`
      );
      setInfo(response.data.notifications);
      // console.log(info, "info");
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
    }
  };
  const getNotificationIcon = (type) => {
    switch (type) {
      case "Booking":
        return (
          <FaCalendarCheck className="text-[40px] bg-[#4CAF50] p-2 rounded-full text-[#ffffff]" />
        ); // Green for booking
      case "rescheduled":
        return (
          <FaRedo className="text-[40px] bg-[#FFC107] p-2 rounded-full text-[#ffffff]" />
        ); // Yellow for rescheduled
      case "cancelled":
        return (
          <FaBan className="text-[40px] bg-[#F44336] p-2 rounded-full text-[#ffffff]" />
        ); // Red for cancelled
      default:
        return (
          <RiNotificationBadgeFill className="text-[40px] bg-[#113C54] p-2 rounded-full text-[#ffffff]" />
        ); // Default icon
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
            Notifications
          </Link>
        </Breadcrumbs>
      </div>
      <div className="w-full min-h-screen bg-[#F2F2F2] px-4 py-6 mt-3">
        {/* <div className="flex w-[0px] sm:w-full gap-4 items-center justify-start scale-[0.7] sm:scale-100">
          <Link
            onClick={() => handleClick("recent")}
            className={`font-nunito-sans text-[28px] px-2 rounded-lg font-bold leading-[43.65px] text-[#202224] ${
              active === "recent" ? "bg-[#ffffff]" : "bg-transparent"
            }`}
          >
            Recent
          </Link>

          <Link
            onClick={() => handleClick("read")}
            className={`font-nunito-sans text-[28px] px-2 rounded-lg font-bold leading-[43.65px] text-[#202224] ${
              active === "read" ? "bg-[#ffffff]" : "bg-transparent"
            }`}
          >
            Read
          </Link>

          <Link
            onClick={() => handleClick("unread")}
            className={`font-nunito-sans text-[28px] px-2 rounded-lg font-bold leading-[43.65px] text-[#202224] ${
              active === "unread" ? "bg-[#ffffff]" : "bg-transparent"
            }`}
          >
            Unread
          </Link>
        </div> */}
        <div className="flex flex-col">
          <text className="font-nunito-sans text-[34px] px-2 py-4 font-extrabold leading-[43.65px] text-[#202224]">
            Notifications
          </text>

          <div className="flex flex-col items-center w-full">
            {info.length > 0 ? (
              info.map((notification, index) => (
                <div className="flex  justify-start w-full mt-3" key={index}>
                  {getNotificationIcon(notification.notification_type)}
                  <div className="flex items-center justify-center gap-2 flex-col ml-5 ">
                    <div
                      key={notification.id}
                      style={{
                        fontWeight: notification.is_read ? "normal" : "bold",
                      }}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      {notification.message}
                      <div className="font-roboto text-[12px] font-normal leading-5 text-[#717171]">
                        {new Date(notification.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="font-roboto text-lg font-normal leading-5 text-[#717171]">
                No notifications available.
              </p>
            )}
            <hr className="w-full my-3 border-[2px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
