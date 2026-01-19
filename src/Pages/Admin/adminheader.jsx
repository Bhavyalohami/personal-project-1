import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { GrClose } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiArrowDownSFill } from "react-icons/ri";
import { BiSolidDashboard } from "react-icons/bi";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdMeetingRoom } from "react-icons/md";
import { BiSolidBookContent } from "react-icons/bi";
import { FaBloggerB } from "react-icons/fa";
import { GrServices } from "react-icons/gr";
import { BiSolidContact } from "react-icons/bi";
import { FcDataConfiguration } from "react-icons/fc";
import { AiFillInteraction } from "react-icons/ai";
import { PiSignOutBold } from "react-icons/pi";
import { MdNotificationsActive } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa6";
import { BiSolidShieldPlus } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";
import { BiSolidNavigation } from "react-icons/bi";
import { BsPostcardFill } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";
import { useSnackbar } from "notistack";
import { PiHospitalFill } from "react-icons/pi";
import { FaCommentDots } from "react-icons/fa6";
import { BiSolidCategory } from "react-icons/bi";
import { BiSolidInjection } from "react-icons/bi";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState({
    new_logo: "",
  });
  const [activeTab, setActiveTab] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [vendor, setVendor] = useState();
  const [superuser, setSuperuser] = useState();
  const [staff, setStaff] = useState();
  const active = window.location.pathname;
  const [notifications, setNotifications] = useState([]);
  const roles = Cookies.get("roles")
    ? Cookies.get("roles")
        .split(",")
        .map((role) => parseInt(role, 10))
    : [];
  // console.log(roles);

  const handleDropdownCLick = (tab) => {
    setDropdownOpen(false);
  };
  const handleTabClick = (tab) => {
    // setActiveTab(tab);
    // setDropdownOpen(false);
  };

  const handleLogout = (tab) => {
    Cookies.remove("is_superuser");
    Cookies.remove("is_vendor");
    Cookies.remove("is_staff");
    Cookies.remove("token");
    Cookies.remove("status");
    Cookies.remove("username");
    Cookies.remove("roles");
    Cookies.remove("subroles");

    if (superuser === "true") {
      navigate("/admin/login");
      window.location.href = "/admin/login";
    } else if (vendor === "true") {
      navigate("/vendor/login");
      window.location.href = "/vendor/login";
    } else {
      navigate("/doctor/login");
      window.location.href = "/doctor/login";
    }
  };
  const fetchData = async () => {
    const apiUrl = `${BaseUrl}clinic/logochange/`;
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          // Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      // console.log(response.data);
      setData(response.data, "data");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
    setSuperuser(Cookies.get("is_superuser"));
    setVendor(Cookies.get("is_vendor"));
    setStaff(Cookies.get("is_staff"));

    // console.log(Cookies.get("is_staff"), Cookies.get("is_vendor"), "details");
  }, []);

  useEffect(() => {
    const username = Cookies.get("username");

    const socket = new WebSocket(
      `ws://127.0.0.1:8001/ws/notifications/${username}/`
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prev) => [...prev, data.message]);
      handleClick(data.message);
    };

    socket.onclose = () => {
      // console.log("WebSocket closed");
    };

    return () => {
      socket.close();
    };
  }, []);
  const handleClick = (message) => {
    enqueueSnackbar(message, {
      content: (key, message) => (
        <div
          key={key}
          style={{
            backgroundColor: "#334d4d",
            color: "#ffffff",
            padding: "10px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            fontWeight: 500,
            width: "250px",
          }}
        >
          {message}
        </div>
      ),
    });
  };
  return (
    <div className="w-full  md:w-[350px]">
      <div className="flex align-items-start w-full h-full">
        <div
          className="nav flex-column nav-pills  w-full h-full"
          id="v-pills-tab"
          role="tablist"
          aria-orientation="vertical"
        >
          <div className="flex md:flex-col justify-between md:justify-normal items-center w-full h-full">
            {data && (
              <Link
                to={
                  superuser === "true"
                    ? "/admin/"
                    : vendor === "true"
                    ? "/vendor"
                    : "/doctor"
                }
                onClick={() => {
                  handleTabClick("/admin/");
                  handleDropdownCLick();
                }}
              >
                <img
                  className="w-4/5 md:w-auto self-center py-3 px-4"
                  src={data.new_logo}
                  alt="Logo"
                />
              </Link>
            )}

            <div className="bg-[#113C54] !rounded-r-[15px] !rounded-l-[0px] hidden md:flex  md:flex-col py-12  pl-6 h-full w-full">
              {superuser === "true" ? (
                <>
                  <Link
                    to="/admin/"
                    className={`flex items-center nav-link font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "/admin/" || active === "/admin/"
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("/admin/");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "/admin/" || active === "/admin/"
                    }
                    on
                  >
                    <BiSolidDashboard className="mr-2" />
                    Dashboard
                  </Link>

                  <Link
                    to="#"
                    className={`px-[15px] py-1 font-poppins text-[20px] text-[#ffffff] flex items-center font-normal leading-[33px] text-left `}
                    onClick={() => {
                      setDropdownOpen(!dropdownOpen);
                    }} // Toggle dropdown visibility
                    role="tab"
                  >
                    <FcDataConfiguration className="mr-2" />
                    Configurations{" "}
                    <RiArrowDownSFill className="ml-2 text-[25px]" />
                  </Link>
                  {dropdownOpen && (
                    <div className="mt-1 w-48 w-full bg-white border border-gray-300 !rounded-l-[20px] shadow-lg">
                      <Link
                        to="/admin/logochange"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "logochange" ||
                          active === "/admin/logochange"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("logochange")}
                        aria-selected={
                          activeTab === "logochange" ||
                          active === "/admin/logochange"
                        }
                      >
                        Change Logo
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to="/admin/faviconchange"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "faviconchange" ||
                          active === "/admin/faviconchange"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("faviconchange")}
                        aria-selected={
                          activeTab === "faviconchange" ||
                          active === "/admin/faviconchange"
                        }
                      >
                        Change Favicon
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to="/admin/socialmediaprofiles"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "socialmediaprofiles" ||
                          active === "/admin/socialmediaprofiles"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("socialmediaprofiles")}
                        aria-selected={
                          activeTab === "socialmediaprofiles" ||
                          active === "/admin/socialmediaprofiles"
                        }
                      >
                        Social Media Profiles
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to="/admin/timings"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "timings" || active === "/admin/timings"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("timings")}
                        aria-selected={
                          activeTab === "timings" || active === "/admin/timings"
                        }
                      >
                        Update Timings
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to="/admin/slogantext"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "slogantext" ||
                          active === "/admin/slogantext"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("slogantext")}
                        aria-selected={
                          activeTab === "slogantext" ||
                          active === "/admin/slogantext"
                        }
                      >
                        Update Slogan Text
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to="/admin/address"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "address" || active === "/admin/address"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("address")}
                        aria-selected={
                          activeTab === "address" || active === "/admin/address"
                        }
                      >
                        Update Address
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to="/admin/setupnotification"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "setupnotification" || active === "/admin/setupnotification"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("setupnotification")}
                        aria-selected={
                          activeTab === "setupnotification" || active === "/admin/setupnotification"
                        }
                      >
                        Notification Settings
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to="/admin/currencysettings"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "currencysettings" || active === "/admin/currencusettings"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("currencysettings")}
                        aria-selected={
                          activeTab === "currencysettings" || active === "/admin/currencysettings"
                        }
                      >
                        Currency Settings
                      </Link>
                    </div>
                  )}
                  <Link
                    to="/admin/vendor"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "slots" || active.includes("/admin/vendor")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("vendor");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "slots" || active.includes("/admin/vendor")
                    }
                  >
                    <PiHospitalFill className="mr-2" />
                    Manage Vendor
                  </Link>
                  <Link
                    to="/admin/staff"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "staff" || active.includes("/admin/staff")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("staff");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "staff" || active.includes("/admin/staff")
                    }
                  >
                    <FaPeopleGroup className="mr-2" />
                    Manage Staffs
                  </Link>

                  <Link
                    to="/admin/managepatients"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "managepatients" ||
                      active.includes("/admin/managepatients")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("managepatients");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "managepatients" ||
                      active.includes("/admin/managepatients")
                    }
                  >
                    <BiSolidInjection className="mr-2" />
                    Manage Patients
                  </Link>

                  <Link
                    to="/admin/appointments"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "appointments" ||
                      active.includes("/admin/appointments")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("appointments");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "appointments" ||
                      active.includes("/admin/appointments")
                    }
                  >
                    <MdMeetingRoom className="mr-2" /> Appointments
                  </Link>
                  <Link
                    to="/admin/consultationquery"
                    className={`nav-link flex items-center font-poppins text-[18px] font-normal leading-[33px] text-left ${
                      activeTab === "consultation_queries" ||
                      active.includes("/admin/consultationquery")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("consultation_queries");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "consultation_queries" ||
                      active.includes("/admin/consultationquery")
                    }
                  >
                    <AiFillInteraction className="mr-2" />
                    Consultation Queries
                  </Link>

                  <Link
                    to="/admin/managecontent"
                    className={`nav-link flex items-center font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "manage_content" ||
                      active.includes("/admin/managecontent")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("manage_content");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "manage_content" ||
                      active.includes("/admin/managecontent")
                    }
                  >
                    <BiSolidBookContent className="mr-2" />
                    Manage Content
                  </Link>
                  <Link
                    to="/admin/blogs"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "manage_blogs" ||
                      active.includes("/admin/blogs")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("manage_blogs");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "manage_blogs" ||
                      active.includes("/admin/blogs")
                    }
                  >
                    <FaBloggerB className="mr-2" />
                    Manage Blogs
                  </Link>
                  <Link
                    to="/admin/blogcategories"
                    className={`nav-link flex items-center font-poppins text-[17px] font-normal leading-[33px] text-left ${
                      activeTab === "manage_blogcategories" ||
                      active.includes("/admin/blogcategories")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("manage_blogcategories");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "manage_blogcategories" ||
                      active.includes("/admin/blogcategories")
                    }
                  >
                    <BiSolidCategory className="mr-2" />
                    Manage Blog Categories
                  </Link>
                  <Link
                    to="/admin/services"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "manage_services" ||
                      active.includes("/admin/services")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("manage_services");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "manage_services" ||
                      active.includes("/admin/services")
                    }
                  >
                    <GrServices className="mr-2" />
                    Manage Services
                  </Link>
                  <Link
                    to="/admin/managedepartment"
                    className={`nav-link flex items-center font-poppins text-[18px] font-normal leading-[33px] text-left ${
                      activeTab === "manage_department" ||
                      active.includes("/admin/managedepartment")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("manage_department");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "manage_department" ||
                      active.includes("/admin/managedepartment")
                    }
                  >
                    <BsPostcardFill className="mr-2" />
                    Manage Departments
                  </Link>
                  <Link
                    to="/admin/manageenquiries"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "manage_enquiries" ||
                      active.includes("/admin/manageenquiries")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("manage_enquiries");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "manage_enquiries" ||
                      active.includes("/admin/manageenquiries")
                    }
                  >
                    <BiSolidContact className="mr-2" />
                    Manage Enquiries
                  </Link>
                  <Link
                    to="/admin/managelocation"
                    className={`nav-link font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "managelocation" ||
                      active.includes("/admin/managelocation")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => handleTabClick("managelocation")}
                    role="tab"
                    aria-selected={
                      activeTab === "managelocation" ||
                      active.includes("/admin/managelocation")
                    }
                  >
                    <BiSolidNavigation className="mr-2" />
                    Manage Locations
                  </Link>

                  <Link
                    to="/admin/feedback"
                    className={`nav-link font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "feedback" ||
                      active.includes("/admin/feedback")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => handleTabClick("feedback")}
                    role="tab"
                    aria-selected={
                      activeTab === "feedback" ||
                      active.includes("/admin/feedback")
                    }
                  >
                    <FaCommentDots className="mr-2" />
                    Manage Feedback
                  </Link>
                  <hr className="text-[#ffffff] border-[3px] my-4" />
                  <span className="text-[#ffffff] font-poppins text-[28px] font-[500] leading-[42px] text-left ">
                    Profile
                  </span>
                  <Link
                    to="/admin/myprofile"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left mt-2 ${
                      activeTab === "myprofile" ||
                      active.includes("/admin/myprofile")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("myprofile");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "myprofile" ||
                      active.includes("/admin/myprofile")
                    }
                  >
                    <FaUser className="mr-2" />
                    My Profile
                  </Link>
                  <Link
                    to="/admin/changepassword"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "change-password" ||
                      active === "/admin/changepassword"
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("change-password");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "change-password" ||
                      active.includes("/admin/changepassword")
                    }
                  >
                    <RiLockPasswordFill className="mr-2" />
                    Change Password
                  </Link>

                  <Link
                    to="/admin/notification"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "notification" ||
                      active === "/admin/notification"
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("notification");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "notification" ||
                      active === "/admin/notification"
                    }
                  >
                    <MdNotificationsActive className="mr-2" />
                    Notifications
                  </Link>
                  <Link
                    to="#"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "about"
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("logout");
                      handleDropdownCLick();
                      handleLogout();
                    }}
                    role="tab"
                    aria-selected={activeTab === "logout"}
                  >
                    <PiSignOutBold className="mr-2" />
                    Log Out
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={vendor === "true" ? "/vendor" : "/doctor"}
                    className={`flex items-center nav-link font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      (
                        vendor === "true"
                          ? activeTab === "/vendor" || active === "/vendor"
                          : activeTab === "/doctor" || active === "/doctor"
                      )
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick(vendor === "true" ? "/vendor" : "/doctor");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      vendor === "true"
                        ? activeTab === "/vendor" || active === "/vendor"
                        : activeTab === "/doctor" || active === "/doctor"
                    }
                  >
                    <BiSolidDashboard className="mr-2" />
                    Dashboard
                  </Link>

                  {roles.includes(1) && (
                    <Link
                      to="#"
                      className={`px-[15px] py-1 font-poppins text-[20px] text-[#ffffff] flex items-center font-normal leading-[33px] text-left `}
                      onClick={() => {
                        setDropdownOpen(!dropdownOpen);
                      }} // Toggle dropdown visibility
                      role="tab"
                    >
                      <FcDataConfiguration className="mr-2" />
                      Configurations{" "}
                      <RiArrowDownSFill className="ml-2 text-[25px]" />
                    </Link>
                  )}
                  {dropdownOpen && (
                    <div className="mt-1 w-48 w-full bg-white border border-gray-300 !rounded-l-[20px] shadow-lg">
                      <Link
                        to={
                          vendor === "true"
                            ? "vendor/logochange"
                            : "doctor/logochange"
                        }
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          (
                            vendor === "true"
                              ? activeTab === "logochange" ||
                                active === "/vendor/logochange"
                              : activeTab === "logochange" ||
                                active === "/doctor/logochange"
                          )
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("logochange")}
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "logochange" ||
                              active === "/vendor/logochange"
                            : activeTab === "logochange" ||
                              active === "/doctor/logochange"
                        }
                      >
                        Change Logo
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to={
                          vendor === "true"
                            ? "vendor/faviconchange"
                            : "/doctor/faviconchange"
                        }
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          (
                            vendor === "true"
                              ? activeTab === "faviconchange" ||
                                active === "/vendor/faviconchange"
                              : activeTab === "faviconchange" ||
                                active === "/doctor/faviconchange"
                          )
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("faviconchange")}
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "faviconchange" ||
                              active === "/vendor/faviconchange"
                            : activeTab === "faviconchange" ||
                              active === "/doctor/faviconchange"
                        }
                      >
                        Change Favicon
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to={
                          vendor === "true"
                            ? "/vendor/socialmediaprofiles"
                            : "/doctor/socialmediaprofiles"
                        }
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          (
                            vendor === "true"
                              ? activeTab === "socialmediaprofiles" ||
                                active === "/vendor/socialmediaprofiles"
                              : activeTab === "socialmediaprofiles" ||
                                active === "/doctor/socialmediaprofiles"
                          )
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("socialmediaprofiles")}
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "socialmediaprofiles" ||
                              active === "/vendor/socialmediaprofiles"
                            : activeTab === "socialmediaprofiles" ||
                              active === "/doctor/socialmediaprofiles"
                        }
                      >
                        Social Media Profiles
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to={
                          vendor === "true"
                            ? "/vendor/timings"
                            : "/doctor/timings"
                        }
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          (
                            vendor === "true"
                              ? activeTab === "timings" ||
                                active === "/vendor/timings"
                              : activeTab === "timings" ||
                                active === "/doctor/timings"
                          )
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("timings")}
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "timings" ||
                              active === "/vendor/timings"
                            : activeTab === "timings" ||
                              active === "/doctor/timings"
                        }
                      >
                        Update Timings
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to={
                          vendor === "true"
                            ? "/vendor/slogantext"
                            : "/doctor/slogantext"
                        }
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          (
                            vendor === "true"
                              ? activeTab === "slogantext" ||
                                active === "/vendor/slogantext"
                              : activeTab === "slogantext" ||
                                active === "/doctor/slogantext"
                          )
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("slogantext")}
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "slogantext" ||
                              active === "/vendor/slogantext"
                            : activeTab === "slogantext" ||
                              active === "/doctor/slogantext"
                        }
                      >
                        Update Slogan Text
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to={
                          vendor === "true"
                            ? "/vendor/address"
                            : "/doctor/address"
                        }
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          (
                            vendor === "true"
                              ? activeTab === "address" ||
                                active === "/vendor/address"
                              : activeTab === "address" ||
                                active === "/doctor/address"
                          )
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("address")}
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "address" ||
                              active === "/vendor/address"
                            : activeTab === "address" ||
                              active === "/doctor/address"
                        }
                      >
                        Update Address
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to={
                          vendor === "true"
                            ? "/vendor/currencysettings"
                            : "/doctor/currencysettings"
                        }
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          (
                            vendor === "true"
                              ? activeTab === "currencysettings" ||
                                active === "/vendor/currencysettings"
                              : activeTab === "currencysettings" ||
                                active === "/doctor/currencysettings"
                          )
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("currencysettings")}
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "currencysettings" ||
                              active === "/vendor/currencysettings"
                            : activeTab === "currencysettings" ||
                              active === "/doctor/currencysettings"
                        }
                      >
                        Currency Settings
                      </Link>
                    </div>
                  )}
                  {roles.includes(3) && (
                    <Link
                      to={vendor === "true" ? "/vendor/staff" : "/doctor/staff"}
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        (
                          vendor === "true"
                            ? activeTab === "staff" ||
                              active.includes("/vendor/staff")
                            : activeTab === "staff" ||
                              active.includes("/doctor/staff")
                        )
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("staff");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        vendor === "true"
                          ? activeTab === "staff" ||
                            active.includes("/vendor/staff")
                          : activeTab === "staff" ||
                            active.includes("/doctor/staff")
                      }
                    >
                      <FaPeopleGroup className="mr-2" />
                      Manage Staffs
                    </Link>
                  )}
                  {roles.includes(19) && (
                    <Link
                    to={
                      vendor === "true"
                        ? "/vendor/managepatients"
                        : "/doctor/managepatients"
                    }
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      (
                        vendor === "true"
                          ? activeTab === "managepatients" ||
                            active.includes("/vendor/managepatients")
                          : activeTab === "managepatients" ||
                            active.includes("/doctor/managepatients")
                      )
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                      onClick={() => {
                        handleTabClick("managepatients");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        vendor === "true"
                          ? activeTab === "managepatients" ||
                            active.includes("/vendor/managepatients")
                          : activeTab === "managepatients" ||
                            active.includes("/doctor/managepatients")
                      }
                    >
                      <BiSolidInjection className="mr-2" />
                      Manage Patients
                    </Link>
                  )}
                  {roles.includes(13) && (
                    <Link
                      to={
                        vendor === "true"
                          ? "/vendor/manageslots"
                          : "/doctor/manageslots"
                      }
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        (
                          vendor === "true"
                            ? activeTab === "slots" ||
                              active.includes("/vendor/manageslots")
                            : activeTab === "slots" ||
                              active.includes("/doctor/manageslots")
                        )
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("slots");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        vendor === "true"
                          ? activeTab === "slots" ||
                            active.includes("/vendor/manageslots")
                          : activeTab === "slots" ||
                            active.includes("/doctor/manageslots")
                      }
                    >
                      <BiSolidShieldPlus className="mr-2" />
                      Manage Slots
                    </Link>
                  )}
                  {roles.includes(4) && (
                    <Link
                      to={
                        vendor === "true"
                          ? "/vendor/appointments"
                          : "/doctor/appointments"
                      }
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        (
                          vendor === "true"
                            ? activeTab === "appointments" ||
                              active.includes("/vendor/appointments")
                            : activeTab === "appointments" ||
                              active.includes("/doctor/appointments")
                        )
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("appointments");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        vendor === "true"
                          ? activeTab === "appointments" ||
                            active.includes("/vendor/appointments")
                          : activeTab === "appointments" ||
                            active.includes("/doctor/appointments")
                      }
                    >
                      <MdMeetingRoom className="mr-2" /> Appointments
                    </Link>
                  )}
                  {roles.includes(14) && (
                    <Link
                      to={
                        vendor === "true"
                          ? "/vendor/manageholidays"
                          : "/doctor/manageholidays"
                      }
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        (
                          vendor === "true"
                            ? activeTab === "manageholidays" ||
                              active.includes("/vendor/manageholidays")
                            : activeTab === "manageholidays" ||
                              active.includes("/doctor/manageholidays")
                        )
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manageholidays");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        vendor === "true"
                          ? activeTab === "manageholidays" ||
                            active.includes("/vendor/manageholidays")
                          : activeTab === "manageholidays" ||
                            active.includes("/doctor/manageholidays")
                      }
                    >
                      <FaCalendarAlt className="mr-2" /> Manage Holidays
                    </Link>
                  )}
                  {roles.includes(5) && (
                    <Link
                      to={
                        vendor === "true"
                          ? "/vendor/consultationquery"
                          : "/doctor/consultationquery"
                      }
                      className={`nav-link flex items-center font-poppins text-[18px] font-normal leading-[33px] text-left ${
                        (
                          vendor === "true"
                            ? activeTab === "consultation_queries" ||
                              active.includes("/vendor/consultationquery")
                            : activeTab === "consultation_queries" ||
                              active.includes("/doctor/consultationquery")
                        )
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("consultation_queries");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        vendor === "true"
                          ? activeTab === "consultation_queries" ||
                            active.includes("/vendor/consultationquery")
                          : activeTab === "consultation_queries" ||
                            active.includes("/doctor/consultationquery")
                      }
                    >
                      <AiFillInteraction className="mr-2" />
                      Consultation Queries
                    </Link>
                  )}
                  {roles.includes(6) && (
                    <Link
                      to={
                        vendor === "true"
                          ? "/vendor/managecontent"
                          : "/doctor/managecontent"
                      }
                      className={`nav-link flex items-center font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                        (
                          vendor === "true"
                            ? activeTab === "manage_content" ||
                              active.includes("/vendor/managecontent")
                            : activeTab === "manage_content" ||
                              active.includes("/doctor/managecontent")
                        )
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_content");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        vendor === "true"
                          ? activeTab === "manage_content" ||
                            active.includes("/vendor/managecontent")
                          : activeTab === "manage_content" ||
                            active.includes("/doctor/managecontent")
                      }
                    >
                      <BiSolidBookContent className="mr-2" />
                      Manage Content
                    </Link>
                  )}
                  {roles.includes(7) && (
                    <Link
                      to={vendor === "true" ? "/vendor/blogs" : "/doctor/blogs"}
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        (
                          vendor === "true"
                            ? activeTab === "manage_blogs" ||
                              active.includes("/vendor/blogs")
                            : activeTab === "manage_blogs" ||
                              active.includes("/doctor/blogs")
                        )
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_blogs");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        vendor === "true"
                          ? activeTab === "manage_blogs" ||
                            active.includes("/vendor/blogs")
                          : activeTab === "manage_blogs" ||
                            active.includes("/doctor/blogs")
                      }
                    >
                      <FaBloggerB className="mr-2" />
                      Manage Blogs
                    </Link>
                  )}
                  {roles.includes(18) && (
                    <Link
                      to={
                        vendor === "true"
                          ? "/vendor/blogcategories"
                          : "/doctor/blogcategories"
                      }
                      className={`nav-link flex items-center font-poppins text-[17px] font-normal leading-[33px] text-left ${
                        (
                          vendor === "true"
                            ? activeTab === "manage_blogcategories" ||
                              active.includes("/vendor/blogcategories")
                            : activeTab === "manage_blogcategories" ||
                              active.includes("/doctor/blogcategories")
                        )
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_blogcategories");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        vendor === "true"
                          ? activeTab === "manage_blogcategories" ||
                            active.includes("/vendor/blogcategories")
                          : activeTab === "manage_blogcategories" ||
                            active.includes("/doctor/blogcategories")
                      }
                    >
                      <BiSolidCategory className="mr-2" />
                      Manage Blog Categories
                    </Link>
                  )}
                  {roles.includes(8) && (
                    <Link
                      to={
                        vendor === "true"
                          ? "/vendor/services"
                          : "/doctor/services"
                      }
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        (
                          vendor === "true"
                            ? activeTab === "manage_services" ||
                              active.includes("/vendor/services")
                            : activeTab === "manage_services" ||
                              active.includes("/doctor/services")
                        )
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_services");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        vendor === "true"
                          ? activeTab === "manage_services" ||
                            active.includes("/vendor/services")
                          : activeTab === "manage_services" ||
                            active.includes("/doctor/services")
                      }
                    >
                      <GrServices className="mr-2" />
                      Manage Services
                    </Link>
                  )}
                  {roles.includes(11) && (
                    <Link
                      to={
                        vendor === "true"
                          ? "/vendor/managedepartment"
                          : "/doctor/managedepartment"
                      }
                      className={`nav-link flex items-center font-poppins text-[18px] font-normal leading-[33px] text-left ${
                        (
                          vendor === "true"
                            ? activeTab === "manage_department" ||
                              active.includes("/vendor/managedepartment")
                            : activeTab === "manage_department" ||
                              active.includes("/doctor/managedepartment")
                        )
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_department");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        vendor === "true"
                          ? activeTab === "manage_department" ||
                            active.includes("/vendor/managedepartment")
                          : activeTab === "manage_department" ||
                            active.includes("/doctor/managedepartment")
                      }
                    >
                      <BsPostcardFill className="mr-2" />
                      Manage Departments
                    </Link>
                  )}
                  {roles.includes(9) && (
                    <Link
                      to={
                        vendor === "true"
                          ? "/vendor/manageenquiries"
                          : "/doctor/manageenquiries"
                      }
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        (
                          vendor === "true"
                            ? activeTab === "manage_enquiries" ||
                              active.includes("/vendor/manageenquiries")
                            : activeTab === "manage_enquiries" ||
                              active.includes("/doctor/manageenquiries")
                        )
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_enquiries");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        vendor === "true"
                          ? activeTab === "manage_enquiries" ||
                            active.includes("/vendor/manageenquiries")
                          : activeTab === "manage_enquiries" ||
                            active.includes("/doctor/manageenquiries")
                      }
                    >
                      <BiSolidContact className="mr-2" />
                      Manage Enquiries
                    </Link>
                  )}
                  {roles.includes(10) && (
                    <Link
                      to={
                        vendor === "true"
                          ? "/vendor/managelocation"
                          : "/doctor/managelocation"
                      }
                      className={`nav-link font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                        (
                          vendor === "true"
                            ? activeTab === "managelocation" ||
                              active.includes("/vendor/managelocation")
                            : activeTab === "managelocation" ||
                              active.includes("/doctor/managelocation")
                        )
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => handleTabClick("managelocation")}
                      role="tab"
                      aria-selected={
                        vendor === "true"
                          ? activeTab === "managelocation" ||
                            active.includes("/vendor/managelocation")
                          : activeTab === "managelocation" ||
                            active.includes("/doctor/managelocation")
                      }
                    >
                      <BiSolidNavigation className="mr-2" />
                      Manage Locations
                    </Link>
                  )}
                  {roles.includes(12) && (
                    <Link
                      to={
                        vendor === "true"
                          ? "/vendor/feedback"
                          : "/doctor/feedback"
                      }
                      className={`nav-link font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                        (
                          vendor === "true"
                            ? activeTab === "feedback" ||
                              active.includes("/vendor/feedback")
                            : activeTab === "feedback" ||
                              active.includes("/doctor/feedback")
                        )
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => handleTabClick("feedback")}
                      role="tab"
                      aria-selected={
                        vendor === "true"
                          ? activeTab === "feedback" ||
                            active.includes("/vendor/feedback")
                          : activeTab === "feedback" ||
                            active.includes("/doctor/feedback")
                      }
                    >
                      <FaCommentDots className="mr-2" />
                      Manage Feedback
                    </Link>
                  )}
                  <hr className="text-[#ffffff] border-[3px] my-4" />
                  <span className="text-[#ffffff] font-poppins text-[28px] font-[500] leading-[42px] text-left ">
                    Profile
                  </span>
                  {roles.includes(15) && (
                    <Link
                      to={
                        vendor === "true"
                          ? "/vendor/myprofile"
                          : "/doctor/myprofile"
                      }
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left mt-2 ${
                        (
                          vendor === "true"
                            ? activeTab === "myprofile" ||
                              active.includes("/vendor/myprofile")
                            : activeTab === "myprofile" ||
                              active.includes("/doctor/myprofile")
                        )
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("myprofile");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        vendor === "true"
                          ? activeTab === "myprofile" ||
                            active.includes("/vendor/myprofile")
                          : activeTab === "myprofile" ||
                            active.includes("/doctor/myprofile")
                      }
                    >
                      <FaUser className="mr-2" />
                      My Profile
                    </Link>
                  )}
                  {roles.includes(16) && (
                    <Link
                      to={
                        vendor === "true"
                          ? "/vendor/changepassword"
                          : "/doctor/changepassword"
                      }
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        (
                          vendor === "true"
                            ? activeTab === "change-password" ||
                              active === "/vendor/changepassword"
                            : activeTab === "change-password" ||
                              active === "/doctor/changepassword"
                        )
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("change-password");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        vendor === "true"
                          ? activeTab === "change-password" ||
                            active === "/vendor/changepassword"
                          : activeTab === "change-password" ||
                            active === "/doctor/changepassword"
                      }
                    >
                      <RiLockPasswordFill className="mr-2" />
                      Change Password
                    </Link>
                  )}
                  {roles.includes(17) && (
                    <Link
                      to={
                        vendor === "true"
                          ? "/vendor/notification"
                          : "/doctor/notification"
                      }
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        (
                          vendor === "true"
                            ? activeTab === "notification" ||
                              active === "/vendor/notification"
                            : activeTab === "notification" ||
                              active === "/doctor/notification"
                        )
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("notification");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        vendor === "true"
                          ? activeTab === "notification" ||
                            active === "/vendor/notification"
                          : activeTab === "notification" ||
                            active === "/doctor/notification"
                      }
                    >
                      <MdNotificationsActive className="mr-2" />
                      Notifications
                    </Link>
                  )}
                  <Link
                    to="#"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "about"
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("logout");
                      handleDropdownCLick();
                      handleLogout();
                    }}
                    role="tab"
                    aria-selected={activeTab === "logout"}
                  >
                    <PiSignOutBold className="mr-2" />
                    Log Out
                  </Link>
                </>
              )}

              {/* {vendor === "true" &&
              staff === "false" &&
              superuser === "false" ? (
                <>
                  <Link
                    to="/vendor"
                    className={`flex items-center nav-link font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "/vendor" || active === "/vendor"
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("/vendor");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "/vendor" || active === "/vendor"
                    }
                    on
                  >
                    <BiSolidDashboard className="mr-2" />
                    Dashboard
                  </Link>

                  <Link
                    to="#"
                    className={`px-[15px] py-1 font-poppins text-[20px] text-[#ffffff] flex items-center font-normal leading-[33px] text-left `}
                    onClick={() => {
                      setDropdownOpen(!dropdownOpen);
                    }} // Toggle dropdown visibility
                    role="tab"
                  >
                    <FcDataConfiguration className="mr-2" />
                    Configurations{" "}
                    <RiArrowDownSFill className="ml-2 text-[25px]" />
                  </Link>
                  {dropdownOpen && (
                    <div className="mt-1 w-48 w-full bg-white border border-gray-300 !rounded-l-[20px] shadow-lg">
                      <Link
                        to="vendor/logochange"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "logochange" ||
                          active === "/vendor/logochange"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("logochange")}
                        aria-selected={
                          activeTab === "logochange" ||
                          active === "/vendor/logochange"
                        }
                      >
                        Change Logo
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to="vendor/faviconchange"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "faviconchange" ||
                          active === "/vendor/faviconchange"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("faviconchange")}
                        aria-selected={
                          activeTab === "faviconchange" ||
                          active === "/vendor/faviconchange"
                        }
                      >
                        Change Favicon
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to="vendor/socialmediaprofiles"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "socialmediaprofiles" ||
                          active === "/vendor/socialmediaprofiles"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("socialmediaprofiles")}
                        aria-selected={
                          activeTab === "socialmediaprofiles" ||
                          active === "/vendor/socialmediaprofiles"
                        }
                      >
                        Social Media Profiles
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to="vendor/timings"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "timings" ||
                          active === "/vendor/timings"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("timings")}
                        aria-selected={
                          activeTab === "timings" ||
                          active === "/vendor/timings"
                        }
                      >
                        Update Timings
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to="vendor/slogantext"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "slogantext" ||
                          active === "/vendor/slogantext"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("slogantext")}
                        aria-selected={
                          activeTab === "slogantext" ||
                          active === "/vendor/slogantext"
                        }
                      >
                        Update Slogan Text
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to="vendor/address"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "address" ||
                          active === "/vendor/address"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("address")}
                        aria-selected={
                          activeTab === "address" ||
                          active === "/vendor/address"
                        }
                      >
                        Update Address
                      </Link>
                    </div>
                  )}

                  <Link
                    to="/vendor/staff"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "staff" || active.includes("/vendor/staff")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("staff");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "staff" || active.includes("/vendor/staff")
                    }
                  >
                    <FaPeopleGroup className="mr-2" />
                    Manage Staffs
                  </Link>

                  <Link
                    to="/vendor/appointments"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "appointments" ||
                      active.includes("/vendor/appointments")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("appointments");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "appointments" ||
                      active.includes("/vendor/appointments")
                    }
                  >
                    <MdMeetingRoom className="mr-2" /> Appointments
                  </Link>
                  <Link
                    to="/vendor/consultationquery"
                    className={`nav-link flex items-center font-poppins text-[18px] font-normal leading-[33px] text-left ${
                      activeTab === "consultation_queries" ||
                      active.includes("/vendor/consultationquery")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("consultation_queries");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "consultation_queries" ||
                      active.includes("/vendor/consultationquery")
                    }
                  >
                    <AiFillInteraction className="mr-2" />
                    Consultation Queries
                  </Link>

                  <Link
                    to="/vendor/managecontent"
                    className={`nav-link flex items-center font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "manage_content" ||
                      active.includes("/vendor/managecontent")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("manage_content");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "manage_content" ||
                      active.includes("/vendor/managecontent")
                    }
                  >
                    <BiSolidBookContent className="mr-2" />
                    Manage Content
                  </Link>
                  <Link
                    to="/vendor/blogs"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "manage_blogs" ||
                      active.includes("/vendor/blogs")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("manage_blogs");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "manage_blogs" ||
                      active.includes("/vendor/blogs")
                    }
                  >
                    <FaBloggerB className="mr-2" />
                    Manage Blogs
                  </Link>
                  <Link
                    to="/vendor/services"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "manage_services" ||
                      active.includes("/vendor/services")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("manage_services");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "manage_services" ||
                      active.includes("/vendor/services")
                    }
                  >
                    <GrServices className="mr-2" />
                    Manage Services
                  </Link>
                  <Link
                    to="/vendor/managedepartment"
                    className={`nav-link flex items-center font-poppins text-[18px] font-normal leading-[33px] text-left ${
                      activeTab === "manage_department" ||
                      active.includes("/vendor/managedepartment")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("manage_department");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "manage_department" ||
                      active.includes("/vendor/managedepartment")
                    }
                  >
                    <BsPostcardFill className="mr-2" />
                    Manage Departments
                  </Link>
                  <Link
                    to="/vendor/manageenquiries"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "manage_enquiries" ||
                      active.includes("/vendor/manageenquiries")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("manage_enquiries");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "manage_enquiries" ||
                      active.includes("/vendor/manageenquiries")
                    }
                  >
                    <BiSolidContact className="mr-2" />
                    Manage Enquiries
                  </Link>
                  <Link
                    to="/vendor/managelocation"
                    className={`nav-link font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "managelocation" ||
                      active.includes("/vendor/managelocation")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => handleTabClick("managelocation")}
                    role="tab"
                    aria-selected={
                      activeTab === "managelocation" ||
                      active.includes("/vendor/managelocation")
                    }
                  >
                    <BiSolidNavigation className="mr-2" />
                    Manage Locations
                  </Link>
                  <Link
                    to="/vendor/feedback"
                    className={`nav-link font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "feedback" ||
                      active.includes("/vendor/feedback")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => handleTabClick("feedback")}
                    role="tab"
                    aria-selected={
                      activeTab === "feedback" ||
                      active.includes("/vendor/feedback")
                    }
                  >
                    <FaCommentDots className="mr-2" />
                    Manage Feedback
                  </Link>
                  <hr className="text-[#ffffff] border-[3px] my-4" />
                  <span className="text-[#ffffff] font-poppins text-[28px] font-[500] leading-[42px] text-left ">
                    Profile
                  </span>
                  <Link
                    to="/vendor/myprofile"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left mt-2 ${
                      activeTab === "myprofile" ||
                      active.includes("/vendor/myprofile")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("myprofile");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "myprofile" ||
                      active.includes("/vendor/myprofile")
                    }
                  >
                    <FaUser className="mr-2" />
                    My Profile
                  </Link>
                  <Link
                    to="/vendor/changepassword"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "change-password" ||
                      active === "/vendor/changepassword"
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("change-password");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "change-password" ||
                      active.includes("/vendor/changepassword")
                    }
                  >
                    <RiLockPasswordFill className="mr-2" />
                    Change Password
                  </Link>

                  <Link
                    to="/vendor/notification"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "notification" ||
                      active === "/vendor/notification"
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("notification");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "notification" ||
                      active === "/vendor/notification"
                    }
                  >
                    <MdNotificationsActive className="mr-2" />
                    Notifications
                  </Link>
                  <Link
                    to="#"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "about"
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("logout");
                      handleDropdownCLick();
                      handleLogout();
                    }}
                    role="tab"
                    aria-selected={activeTab === "logout"}
                  >
                    <PiSignOutBold className="mr-2" />
                    Log Out
                  </Link>
                </>
              ) : null} */}
              {/* {vendor === "true" &&
              staff === "true" &&
              superuser === "false" ? (
                <>
                  <Link
                    to="/vendor"
                    className={`flex items-center nav-link font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "/vendor" || active === "/vendor"
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("/vendor");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "/vendor" || active === "/vendor"
                    }
                    on
                  >
                    <BiSolidDashboard className="mr-2" />
                    Dashboard
                  </Link>
                  {roles.includes(1) && (
                    <Link
                      to="#"
                      className={`px-[15px] py-1 font-poppins text-[20px] text-[#ffffff] flex items-center font-normal leading-[33px] text-left `}
                      onClick={() => {
                        setDropdownOpen(!dropdownOpen);
                      }} // Toggle dropdown visibility
                      role="tab"
                    >
                      <FcDataConfiguration className="mr-2" />
                      Configurations{" "}
                      <RiArrowDownSFill className="ml-2 text-[25px]" />
                    </Link>
                  )}
                  {dropdownOpen && (
                    <div className="mt-1 w-48 w-full bg-white border border-gray-300 !rounded-l-[20px] shadow-lg">
                      <Link
                        to="vendor/logochange"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "logochange" ||
                          active === "/vendor/logochange"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("logochange")}
                        aria-selected={
                          activeTab === "logochange" ||
                          active === "/vendor/logochange"
                        }
                      >
                        Change Logo
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to="vendor/faviconchange"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "faviconchange" ||
                          active === "/vendor/faviconchange"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("faviconchange")}
                        aria-selected={
                          activeTab === "faviconchange" ||
                          active === "/vendor/faviconchange"
                        }
                      >
                        Change Favicon
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to="vendor/socialmediaprofiles"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "socialmediaprofiles" ||
                          active === "/vendor/socialmediaprofiles"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("socialmediaprofiles")}
                        aria-selected={
                          activeTab === "socialmediaprofiles" ||
                          active === "/vendor/socialmediaprofiles"
                        }
                      >
                        Social Media Profiles
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to="vendor/timings"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "timings" ||
                          active === "/vendor/timings"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("timings")}
                        aria-selected={
                          activeTab === "timings" ||
                          active === "/vendor/timings"
                        }
                      >
                        Update Timings
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to="vendor/slogantext"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "slogantext" ||
                          active === "/vendor/slogantext"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("slogantext")}
                        aria-selected={
                          activeTab === "slogantext" ||
                          active === "/vendor/slogantext"
                        }
                      >
                        Update Slogan Text
                      </Link>
                      <hr className="text-black-800 border-[2px] mx-4" />
                      <Link
                        to="vendor/address"
                        className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                          activeTab === "address" ||
                          active === "/vendor/address"
                            ? "text-[#ffffff] bg-[#113C54]"
                            : "text-[#113C54]"
                        }`}
                        onClick={() => handleTabClick("address")}
                        aria-selected={
                          activeTab === "address" ||
                          active === "/vendor/address"
                        }
                      >
                        Update Address
                      </Link>
                    </div>
                  )}
                  {roles.includes(3) && (
                    <Link
                      to="/vendor/staff"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "staff" ||
                        active.includes("/vendor/staff")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("staff");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "staff" ||
                        active.includes("/vendor/staff")
                      }
                    >
                      <FaPeopleGroup className="mr-2" />
                      Manage Staffs
                    </Link>
                  )}
                  {roles.includes(13) && (
                    <Link
                      to="/vendor/manageslots"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "slots" ||
                        active.includes("/vendor/manageslots")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("slots");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "slots" ||
                        active.includes("/vendor/manageslots")
                      }
                    >
                      <BiSolidShieldPlus className="mr-2" />
                      Manage Slots
                    </Link>
                  )}
                  {roles.includes(4) && (
                    <Link
                      to="/vendor/appointments"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "appointments" ||
                        active.includes("/vendor/appointments")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("appointments");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "appointments" ||
                        active.includes("/vendor/appointments")
                      }
                    >
                      <MdMeetingRoom className="mr-2" /> Appointments
                    </Link>
                  )}
                  {roles.includes(14) && (
                    <Link
                      to="/vendor/manageholidays"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manageholidays" ||
                        active.includes("/vendor/manageholidays")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manageholidays");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manageholidays" ||
                        active.includes("/vendor/manageholidays")
                      }
                    >
                      <FaCalendarAlt className="mr-2" /> Manage Holidays
                    </Link>
                  )}
                  {roles.includes(5) && (
                    <Link
                      to="/vendor/consultationquery"
                      className={`nav-link flex items-center font-poppins text-[18px] font-normal leading-[33px] text-left ${
                        activeTab === "consultation_queries" ||
                        active.includes("/vendor/consultationquery")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("consultation_queries");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "consultation_queries" ||
                        active.includes("/vendor/consultationquery")
                      }
                    >
                      <AiFillInteraction className="mr-2" />
                      Consultation Queries
                    </Link>
                  )}
                  {roles.includes(6) && (
                    <Link
                      to="/vendor/managecontent"
                      className={`nav-link flex items-center font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_content" ||
                        active.includes("/vendor/managecontent")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_content");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_content" ||
                        active.includes("/vendor/managecontent")
                      }
                    >
                      <BiSolidBookContent className="mr-2" />
                      Manage Content
                    </Link>
                  )}
                  {roles.includes(7) && (
                    <Link
                      to="/vendor/blogs"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_blogs" ||
                        active.includes("/vendor/blogs")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_blogs");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_blogs" ||
                        active.includes("/vendor/blogs")
                      }
                    >
                      <FaBloggerB className="mr-2" />
                      Manage Blogs
                    </Link>
                  )}
                  {roles.includes(8) && (
                    <Link
                      to="/vendor/services"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_services" ||
                        active.includes("/vendor/services")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_services");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_services" ||
                        active.includes("/vendor/services")
                      }
                    >
                      <GrServices className="mr-2" />
                      Manage Services
                    </Link>
                  )}
                  {roles.includes(11) && (
                    <Link
                      to="/vendor/managedepartment"
                      className={`nav-link flex items-center font-poppins text-[18px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_department" ||
                        active.includes("/vendor/managedepartment")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_department");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_department" ||
                        active.includes("/vendor/managedepartment")
                      }
                    >
                      <BsPostcardFill className="mr-2" />
                      Manage Departments
                    </Link>
                  )}
                  {roles.includes(9) && (
                    <Link
                      to="/vendor/manageenquiries"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_enquiries" ||
                        active.includes("/vendor/manageenquiries")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_enquiries");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_enquiries" ||
                        active.includes("/vendor/manageenquiries")
                      }
                    >
                      <BiSolidContact className="mr-2" />
                      Manage Enquiries
                    </Link>
                  )}
                  {roles.includes(10) && (
                    <Link
                      to="/vendor/managelocation"
                      className={`nav-link font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "managelocation" ||
                        active.includes("/vendor/managelocation")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => handleTabClick("managelocation")}
                      role="tab"
                      aria-selected={
                        activeTab === "managelocation" ||
                        active.includes("/vendor/managelocation")
                      }
                    >
                      <BiSolidNavigation className="mr-2" />
                      Manage Locations
                    </Link>
                  )}
                  {roles.includes(12) && (
                    <Link
                      to="/vendor/feedback"
                      className={`nav-link font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "feedback" ||
                        active.includes("/vendor/feedback")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => handleTabClick("feedback")}
                      role="tab"
                      aria-selected={
                        activeTab === "feedback" ||
                        active.includes("/vendor/feedback")
                      }
                    >
                      <FaCommentDots className="mr-2" />
                      Manage Feedback
                    </Link>
                  )}
                  <hr className="text-[#ffffff] border-[3px] my-4" />
                  <span className="text-[#ffffff] font-poppins text-[28px] font-[500] leading-[42px] text-left ">
                    Profile
                  </span>
                  {roles.includes(15) && (
                    <Link
                      to="/vendor/myprofile"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left mt-2 ${
                        activeTab === "myprofile" ||
                        active.includes("/vendor/myprofile")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("myprofile");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "myprofile" ||
                        active.includes("/vendor/myprofile")
                      }
                    >
                      <FaUser className="mr-2" />
                      My Profile
                    </Link>
                  )}
                  {roles.includes(16) && (
                    <Link
                      to="/vendor/changepassword"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "change-password" ||
                        active === "/vendor/changepassword"
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("change-password");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "change-password" ||
                        active.includes("/vendor/changepassword")
                      }
                    >
                      <RiLockPasswordFill className="mr-2" />
                      Change Password
                    </Link>
                  )}
                  {roles.includes(17) &&
                  <Link
                    to="/vendor/notification"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "notification" ||
                      active === "/vendor/notification"
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("notification");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "notification" ||
                      active === "/vendor/notification"
                    }
                  >
                    <MdNotificationsActive className="mr-2" />
                    Notifications
                  </Link>
                  }
                  <Link
                    to="#"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "about"
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("logout");
                      handleDropdownCLick();
                      handleLogout();
                    }}
                    role="tab"
                    aria-selected={activeTab === "logout"}
                  >
                    <PiSignOutBold className="mr-2" />
                    Log Out
                  </Link>
                </>
              ) : null} */}
              {/* {superuser === "false" &&
              staff === "true" &&
              vendor === "false" ? (
                <>
                  <Link
                    to="/doctor"
                    className={`flex items-center nav-link font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "/doctor" || active === "/doctor"
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("/doctor");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "/doctor" || active === "/doctor"
                    }
                    on
                  >
                    <BiSolidDashboard className="mr-2" />
                    Dashboard
                  </Link>

                  <Link
                    to="/doctor/manageslots"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "slots" ||
                      active.includes("/doctor/manageslots")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("slots");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "slots" ||
                      active.includes("/doctor/manageslots")
                    }
                  >
                    <BiSolidShieldPlus className="mr-2" />
                    Manage Slots
                  </Link>
                  <Link
                    to="/doctor/appointments"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "appointments" ||
                      active.includes("/doctor/appointments")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("appointments");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "appointments" ||
                      active.includes("/doctor/appointments")
                    }
                  >
                    <MdMeetingRoom className="mr-2" /> Appointments
                  </Link>
                  <Link
                    to="/doctor/manageholidays"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "manageholidays" ||
                      active.includes("/doctor/manageholidays")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("manageholidays");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "manageholidays" ||
                      active.includes("/doctor/manageholidays")
                    }
                  >
                    <FaCalendarAlt className="mr-2" /> Manage Holidays
                  </Link>
                  <hr className="text-[#ffffff] border-[3px] my-4" />
                  <span className="text-[#ffffff] font-poppins text-[28px] font-[500] leading-[42px] text-left ">
                    Profile
                  </span>
                  <Link
                    to="/doctor/myprofile"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left mt-2 ${
                      activeTab === "myprofile" ||
                      active.includes("/doctor/myprofile")
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("myprofile");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "myprofile" ||
                      active.includes("/doctor/myprofile")
                    }
                  >
                    <FaUser className="mr-2" />
                    My Profile
                  </Link>
                  <Link
                    to="/doctor/changepassword"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "change-password" ||
                      active === "/doctor/changepassword"
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("change-password");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "change-password" ||
                      active.includes("/doctor/changepassword")
                    }
                  >
                    <RiLockPasswordFill className="mr-2" />
                    Change Password
                  </Link>
                  <Link
                    to="/doctor/notification"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "notification" ||
                      active === "/doctor/notification"
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("notification");
                      handleDropdownCLick();
                    }}
                    role="tab"
                    aria-selected={
                      activeTab === "notification" ||
                      active === "/doctor/notification"
                    }
                  >
                    <MdNotificationsActive className="mr-2" />
                    Notifications
                  </Link>
                  <Link
                    to="#"
                    className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                      activeTab === "about"
                        ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                        : "text-[#ffffff] rounded-[0px]"
                    }`}
                    onClick={() => {
                      handleTabClick("logout");
                      handleDropdownCLick();
                      handleLogout();
                    }}
                    role="tab"
                    aria-selected={activeTab === "logout"}
                  >
                    <PiSignOutBold className="mr-2" />
                    Log Out
                  </Link>
                </>
              ) : null} */}
            </div>
            <div className="md:hidden flex-shrink-0">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-xl text-gray-700 hover:text-gray-900 focus:outline-none mr-4"
              >
                {showMenu ? <GrClose /> : <GiHamburgerMenu />}
              </button>
            </div>
          </div>
          {showMenu && (
            <div className="md:hidden bg-[#113C54] shadow-md py-2 px-4">
              <nav className="flex flex-col space-y-2">
                {superuser === "true" ? (
                  <>
                    <Link
                      to="/admin/"
                      className={`flex items-center nav-link font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "/admin/" || active === "/admin/"
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("/admin/");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "/admin/" || active === "/admin/"
                      }
                      on
                    >
                      <BiSolidDashboard className="mr-2" />
                      Dashboard
                    </Link>

                    <Link
                      to="#"
                      className={`px-[15px] py-1 font-poppins text-[20px] text-[#ffffff] flex items-center font-normal leading-[33px] text-left `}
                      onClick={() => {
                        setDropdownOpen(!dropdownOpen);
                      }} // Toggle dropdown visibility
                      role="tab"
                    >
                      <FcDataConfiguration className="mr-2" />
                      Configurations{" "}
                      <RiArrowDownSFill className="ml-2 text-[25px]" />
                    </Link>
                    {dropdownOpen && (
                      <div className="mt-1 w-48 w-full bg-white border border-gray-300 !rounded-l-[20px] shadow-lg">
                        <Link
                          to="admin/logochange"
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            activeTab === "logochange" ||
                            active === "/admin/logochange"
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("logochange")}
                          aria-selected={
                            activeTab === "logochange" ||
                            active === "/admin/logochange"
                          }
                        >
                          Change Logo
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to="admin/faviconchange"
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            activeTab === "faviconchange" ||
                            active === "/admin/faviconchange"
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("faviconchange")}
                          aria-selected={
                            activeTab === "faviconchange" ||
                            active === "/admin/faviconchange"
                          }
                        >
                          Change Favicon
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to="admin/socialmediaprofiles"
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            activeTab === "socialmediaprofiles" ||
                            active === "/admin/socialmediaprofiles"
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("socialmediaprofiles")}
                          aria-selected={
                            activeTab === "socialmediaprofiles" ||
                            active === "/admin/socialmediaprofiles"
                          }
                        >
                          Social Media Profiles
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to="admin/timings"
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            activeTab === "timings" ||
                            active === "/admin/timings"
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("timings")}
                          aria-selected={
                            activeTab === "timings" ||
                            active === "/admin/timings"
                          }
                        >
                          Update Timings
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to="admin/slogantext"
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            activeTab === "slogantext" ||
                            active === "/admin/slogantext"
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("slogantext")}
                          aria-selected={
                            activeTab === "slogantext" ||
                            active === "/admin/slogantext"
                          }
                        >
                          Update Slogan Text
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to="admin/address"
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            activeTab === "address" ||
                            active === "/admin/address"
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("address")}
                          aria-selected={
                            activeTab === "address" ||
                            active === "/admin/address"
                          }
                        >
                          Update Address
                        </Link>
                      </div>
                    )}
                    <Link
                      to="/admin/vendor"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "slots" ||
                        active.includes("/admin/vendor")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("vendor");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "slots" ||
                        active.includes("/admin/vendor")
                      }
                    >
                      <PiHospitalFill className="mr-2" />
                      Manage Vendor
                    </Link>
                    <Link
                      to="/admin/staff"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "staff" || active.includes("/admin/staff")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("staff");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "staff" || active.includes("/admin/staff")
                      }
                    >
                      <FaPeopleGroup className="mr-2" />
                      Manage Staffs
                    </Link>

                    <Link
                      to="/admin/appointments"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "appointments" ||
                        active.includes("/admin/appointments")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("appointments");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "appointments" ||
                        active.includes("/admin/appointments")
                      }
                    >
                      <MdMeetingRoom className="mr-2" /> Appointments
                    </Link>
                    <Link
                      to="/admin/consultationquery"
                      className={`nav-link flex items-center font-poppins text-[18px] font-normal leading-[33px] text-left ${
                        activeTab === "consultation_queries" ||
                        active.includes("/admin/consultationquery")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("consultation_queries");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "consultation_queries" ||
                        active.includes("/admin/consultationquery")
                      }
                    >
                      <AiFillInteraction className="mr-2" />
                      Consultation Queries
                    </Link>

                    <Link
                      to="/admin/managecontent"
                      className={`nav-link flex items-center font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_content" ||
                        active.includes("/admin/managecontent")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_content");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_content" ||
                        active.includes("/admin/managecontent")
                      }
                    >
                      <BiSolidBookContent className="mr-2" />
                      Manage Content
                    </Link>
                    <Link
                      to="/admin/blogs"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_blogs" ||
                        active.includes("/admin/blogs")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_blogs");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_blogs" ||
                        active.includes("/admin/blogs")
                      }
                    >
                      <FaBloggerB className="mr-2" />
                      Manage Blogs
                    </Link>
                    <Link
                      to="/admin/blogcategories"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_blogcategories" ||
                        active.includes("/admin/blogcategories")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_blogcategories");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_blogcategories" ||
                        active.includes("/admin/blogcategories")
                      }
                    >
                      <BiSolidCategory className="mr-2" />
                      Manage Blog Categories
                    </Link>
                    <Link
                      to="/admin/services"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_services" ||
                        active.includes("/admin/services")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_services");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_services" ||
                        active.includes("/admin/services")
                      }
                    >
                      <GrServices className="mr-2" />
                      Manage Services
                    </Link>
                    <Link
                      to="/admin/managedepartment"
                      className={`nav-link flex items-center font-poppins text-[18px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_department" ||
                        active.includes("/admin/managedepartment")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_department");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_department" ||
                        active.includes("/admin/managedepartment")
                      }
                    >
                      <BsPostcardFill className="mr-2" />
                      Manage Departments
                    </Link>
                    <Link
                      to="/admin/manageenquiries"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_enquiries" ||
                        active.includes("/admin/manageenquiries")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_enquiries");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_enquiries" ||
                        active.includes("/admin/manageenquiries")
                      }
                    >
                      <BiSolidContact className="mr-2" />
                      Manage Enquiries
                    </Link>
                    <Link
                      to="/admin/managelocation"
                      className={`nav-link font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "managelocation" ||
                        active.includes("/admin/managelocation")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => handleTabClick("managelocation")}
                      role="tab"
                      aria-selected={
                        activeTab === "managelocation" ||
                        active.includes("/admin/managelocation")
                      }
                    >
                      <BiSolidNavigation className="mr-2" />
                      Manage Locations
                    </Link>
                    <Link
                      to="/admin/feedback"
                      className={`nav-link font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "feedback" ||
                        active.includes("/admin/feedback")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => handleTabClick("feedback")}
                      role="tab"
                      aria-selected={
                        activeTab === "feedback" ||
                        active.includes("/admin/feedback")
                      }
                    >
                      <FaCommentDots className="mr-2" />
                      Manage Feedback
                    </Link>
                    <hr className="text-[#ffffff] border-[3px] my-4" />
                    <span className="text-[#ffffff] font-poppins text-[28px] font-[500] leading-[42px] text-left ">
                      Profile
                    </span>
                    <Link
                      to="/admin/myprofile"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left mt-2 ${
                        activeTab === "myprofile" ||
                        active.includes("/admin/myprofile")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("myprofile");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "myprofile" ||
                        active.includes("/admin/myprofile")
                      }
                    >
                      <FaUser className="mr-2" />
                      My Profile
                    </Link>
                    <Link
                      to="/admin/changepassword"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "change-password" ||
                        active === "/admin/changepassword"
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("change-password");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "change-password" ||
                        active.includes("/admin/changepassword")
                      }
                    >
                      <RiLockPasswordFill className="mr-2" />
                      Change Password
                    </Link>

                    <Link
                      to="/admin/notification"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "notification" ||
                        active === "/admin/notification"
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("notification");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "notification" ||
                        active === "/admin/notification"
                      }
                    >
                      <MdNotificationsActive className="mr-2" />
                      Notifications
                    </Link>
                    <Link
                      to="#"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "about"
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("logout");
                        handleDropdownCLick();
                        handleLogout();
                      }}
                      role="tab"
                      aria-selected={activeTab === "logout"}
                    >
                      <PiSignOutBold className="mr-2" />
                      Log Out
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={vendor === "true" ? "/vendor" : "/doctor"}
                      className={`flex items-center nav-link font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        (
                          vendor === "true"
                            ? activeTab === "/vendor" || active === "/vendor"
                            : activeTab === "/doctor" || active === "/doctor"
                        )
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick(
                          vendor === "true" ? "/vendor" : "/doctor"
                        );
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        vendor === "true"
                          ? activeTab === "/vendor" || active === "/vendor"
                          : activeTab === "/doctor" || active === "/doctor"
                      }
                    >
                      <BiSolidDashboard className="mr-2" />
                      Dashboard
                    </Link>

                    {roles.includes(1) && (
                      <Link
                        to="#"
                        className={`px-[15px] py-1 font-poppins text-[20px] text-[#ffffff] flex items-center font-normal leading-[33px] text-left `}
                        onClick={() => {
                          setDropdownOpen(!dropdownOpen);
                        }} // Toggle dropdown visibility
                        role="tab"
                      >
                        <FcDataConfiguration className="mr-2" />
                        Configurations{" "}
                        <RiArrowDownSFill className="ml-2 text-[25px]" />
                      </Link>
                    )}
                    {dropdownOpen && (
                      <div className="mt-1 w-48 w-full bg-white border border-gray-300 !rounded-l-[20px] shadow-lg">
                        <Link
                          to={
                            vendor === "true"
                              ? "vendor/logochange"
                              : "doctor/logochange"
                          }
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            (
                              vendor === "true"
                                ? activeTab === "logochange" ||
                                  active === "/vendor/logochange"
                                : activeTab === "logochange" ||
                                  active === "/doctor/logochange"
                            )
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("logochange")}
                          aria-selected={
                            vendor === "true"
                              ? activeTab === "logochange" ||
                                active === "/vendor/logochange"
                              : activeTab === "logochange" ||
                                active === "/doctor/logochange"
                          }
                        >
                          Change Logo
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to={
                            vendor === "true"
                              ? "vendor/faviconchange"
                              : "/doctor/faviconchange"
                          }
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            (
                              vendor === "true"
                                ? activeTab === "faviconchange" ||
                                  active === "/vendor/faviconchange"
                                : activeTab === "faviconchange" ||
                                  active === "/doctor/faviconchange"
                            )
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("faviconchange")}
                          aria-selected={
                            vendor === "true"
                              ? activeTab === "faviconchange" ||
                                active === "/vendor/faviconchange"
                              : activeTab === "faviconchange" ||
                                active === "/doctor/faviconchange"
                          }
                        >
                          Change Favicon
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to={
                            vendor === "true"
                              ? "/vendor/socialmediaprofiles"
                              : "/doctor/socialmediaprofiles"
                          }
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            (
                              vendor === "true"
                                ? activeTab === "socialmediaprofiles" ||
                                  active === "/vendor/socialmediaprofiles"
                                : activeTab === "socialmediaprofiles" ||
                                  active === "/doctor/socialmediaprofiles"
                            )
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("socialmediaprofiles")}
                          aria-selected={
                            vendor === "true"
                              ? activeTab === "socialmediaprofiles" ||
                                active === "/vendor/socialmediaprofiles"
                              : activeTab === "socialmediaprofiles" ||
                                active === "/doctor/socialmediaprofiles"
                          }
                        >
                          Social Media Profiles
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to={
                            vendor === "true"
                              ? "/vendor/timings"
                              : "/doctor/timings"
                          }
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            (
                              vendor === "true"
                                ? activeTab === "timings" ||
                                  active === "/vendor/timings"
                                : activeTab === "timings" ||
                                  active === "/doctor/timings"
                            )
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("timings")}
                          aria-selected={
                            vendor === "true"
                              ? activeTab === "timings" ||
                                active === "/vendor/timings"
                              : activeTab === "timings" ||
                                active === "/doctor/timings"
                          }
                        >
                          Update Timings
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to={
                            vendor === "true"
                              ? "/vendor/slogantext"
                              : "/doctor/slogantext"
                          }
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            (
                              vendor === "true"
                                ? activeTab === "slogantext" ||
                                  active === "/vendor/slogantext"
                                : activeTab === "slogantext" ||
                                  active === "/doctor/slogantext"
                            )
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("slogantext")}
                          aria-selected={
                            vendor === "true"
                              ? activeTab === "slogantext" ||
                                active === "/vendor/slogantext"
                              : activeTab === "slogantext" ||
                                active === "/doctor/slogantext"
                          }
                        >
                          Update Slogan Text
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to={
                            vendor === "true"
                              ? "/vendor/address"
                              : "/doctor/address"
                          }
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            (
                              vendor === "true"
                                ? activeTab === "address" ||
                                  active === "/vendor/address"
                                : activeTab === "address" ||
                                  active === "/doctor/address"
                            )
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("address")}
                          aria-selected={
                            vendor === "true"
                              ? activeTab === "address" ||
                                active === "/vendor/address"
                              : activeTab === "address" ||
                                active === "/doctor/address"
                          }
                        >
                          Update Address
                        </Link>
                      </div>
                    )}
                    {roles.includes(3) && (
                      <Link
                        to={
                          vendor === "true" ? "/vendor/staff" : "/doctor/staff"
                        }
                        className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                          (
                            vendor === "true"
                              ? activeTab === "staff" ||
                                active.includes("/vendor/staff")
                              : activeTab === "staff" ||
                                active.includes("/doctor/staff")
                          )
                            ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                            : "text-[#ffffff] rounded-[0px]"
                        }`}
                        onClick={() => {
                          handleTabClick("staff");
                          handleDropdownCLick();
                        }}
                        role="tab"
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "staff" ||
                              active.includes("/vendor/staff")
                            : activeTab === "staff" ||
                              active.includes("/doctor/staff")
                        }
                      >
                        <FaPeopleGroup className="mr-2" />
                        Manage Staffs
                      </Link>
                    )}
                    {roles.includes(13) && (
                      <Link
                        to={
                          vendor === "true"
                            ? "/vendor/manageslots"
                            : "/doctor/manageslots"
                        }
                        className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                          (
                            vendor === "true"
                              ? activeTab === "slots" ||
                                active.includes("/vendor/manageslots")
                              : activeTab === "slots" ||
                                active.includes("/doctor/manageslots")
                          )
                            ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                            : "text-[#ffffff] rounded-[0px]"
                        }`}
                        onClick={() => {
                          handleTabClick("slots");
                          handleDropdownCLick();
                        }}
                        role="tab"
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "slots" ||
                              active.includes("/vendor/manageslots")
                            : activeTab === "slots" ||
                              active.includes("/doctor/manageslots")
                        }
                      >
                        <BiSolidShieldPlus className="mr-2" />
                        Manage Slots
                      </Link>
                    )}
                    {roles.includes(4) && (
                      <Link
                        to={
                          vendor === "true"
                            ? "/vendor/appointments"
                            : "/doctor/appointments"
                        }
                        className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                          (
                            vendor === "true"
                              ? activeTab === "appointments" ||
                                active.includes("/vendor/appointments")
                              : activeTab === "appointments" ||
                                active.includes("/doctor/appointments")
                          )
                            ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                            : "text-[#ffffff] rounded-[0px]"
                        }`}
                        onClick={() => {
                          handleTabClick("appointments");
                          handleDropdownCLick();
                        }}
                        role="tab"
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "appointments" ||
                              active.includes("/vendor/appointments")
                            : activeTab === "appointments" ||
                              active.includes("/doctor/appointments")
                        }
                      >
                        <MdMeetingRoom className="mr-2" /> Appointments
                      </Link>
                    )}
                    {roles.includes(14) && (
                      <Link
                        to={
                          vendor === "true"
                            ? "/vendor/manageholidays"
                            : "/doctor/manageholidays"
                        }
                        className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                          (
                            vendor === "true"
                              ? activeTab === "manageholidays" ||
                                active.includes("/vendor/manageholidays")
                              : activeTab === "manageholidays" ||
                                active.includes("/doctor/manageholidays")
                          )
                            ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                            : "text-[#ffffff] rounded-[0px]"
                        }`}
                        onClick={() => {
                          handleTabClick("manageholidays");
                          handleDropdownCLick();
                        }}
                        role="tab"
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "manageholidays" ||
                              active.includes("/vendor/manageholidays")
                            : activeTab === "manageholidays" ||
                              active.includes("/doctor/manageholidays")
                        }
                      >
                        <FaCalendarAlt className="mr-2" /> Manage Holidays
                      </Link>
                    )}
                    {roles.includes(5) && (
                      <Link
                        to={
                          vendor === "true"
                            ? "/vendor/consultationquery"
                            : "/doctor/consultationquery"
                        }
                        className={`nav-link flex items-center font-poppins text-[18px] font-normal leading-[33px] text-left ${
                          (
                            vendor === "true"
                              ? activeTab === "consultation_queries" ||
                                active.includes("/vendor/consultationquery")
                              : activeTab === "consultation_queries" ||
                                active.includes("/doctor/consultationquery")
                          )
                            ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                            : "text-[#ffffff] rounded-[0px]"
                        }`}
                        onClick={() => {
                          handleTabClick("consultation_queries");
                          handleDropdownCLick();
                        }}
                        role="tab"
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "consultation_queries" ||
                              active.includes("/vendor/consultationquery")
                            : activeTab === "consultation_queries" ||
                              active.includes("/doctor/consultationquery")
                        }
                      >
                        <AiFillInteraction className="mr-2" />
                        Consultation Queries
                      </Link>
                    )}
                    {roles.includes(6) && (
                      <Link
                        to={
                          vendor === "true"
                            ? "/vendor/managecontent"
                            : "/doctor/managecontent"
                        }
                        className={`nav-link flex items-center font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                          (
                            vendor === "true"
                              ? activeTab === "manage_content" ||
                                active.includes("/vendor/managecontent")
                              : activeTab === "manage_content" ||
                                active.includes("/doctor/managecontent")
                          )
                            ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                            : "text-[#ffffff] rounded-[0px]"
                        }`}
                        onClick={() => {
                          handleTabClick("manage_content");
                          handleDropdownCLick();
                        }}
                        role="tab"
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "manage_content" ||
                              active.includes("/vendor/managecontent")
                            : activeTab === "manage_content" ||
                              active.includes("/doctor/managecontent")
                        }
                      >
                        <BiSolidBookContent className="mr-2" />
                        Manage Content
                      </Link>
                    )}
                    {roles.includes(7) && (
                      <Link
                        to={
                          vendor === "true" ? "/vendor/blogs" : "/doctor/blogs"
                        }
                        className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                          (
                            vendor === "true"
                              ? activeTab === "manage_blogs" ||
                                active.includes("/vendor/blogs")
                              : activeTab === "manage_blogs" ||
                                active.includes("/doctor/blogs")
                          )
                            ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                            : "text-[#ffffff] rounded-[0px]"
                        }`}
                        onClick={() => {
                          handleTabClick("manage_blogs");
                          handleDropdownCLick();
                        }}
                        role="tab"
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "manage_blogs" ||
                              active.includes("/vendor/blogs")
                            : activeTab === "manage_blogs" ||
                              active.includes("/doctor/blogs")
                        }
                      >
                        <FaBloggerB className="mr-2" />
                        Manage Blogs
                      </Link>
                    )}
                    {roles.includes(18) && (
                      <Link
                        to={
                          vendor === "true"
                            ? "/vendor/blogcategories"
                            : "/doctor/blogcategories"
                        }
                        className={`nav-link flex items-center font-poppins text-[17px] font-normal leading-[33px] text-left ${
                          (
                            vendor === "true"
                              ? activeTab === "manage_blogcategories" ||
                                active.includes("/vendor/blogcategories")
                              : activeTab === "manage_blogcategories" ||
                                active.includes("/doctor/blogcategories")
                          )
                            ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                            : "text-[#ffffff] rounded-[0px]"
                        }`}
                        onClick={() => {
                          handleTabClick("manage_blogcategories");
                          handleDropdownCLick();
                        }}
                        role="tab"
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "manage_blogcategories" ||
                              active.includes("/vendor/blogcategories")
                            : activeTab === "manage_blogcategories" ||
                              active.includes("/doctor/blogcategories")
                        }
                      >
                        <BiSolidCategory className="mr-2" />
                        Manage Blog Categories
                      </Link>
                    )}
                    {roles.includes(8) && (
                      <Link
                        to={
                          vendor === "true"
                            ? "/vendor/services"
                            : "/doctor/services"
                        }
                        className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                          (
                            vendor === "true"
                              ? activeTab === "manage_services" ||
                                active.includes("/vendor/services")
                              : activeTab === "manage_services" ||
                                active.includes("/doctor/services")
                          )
                            ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                            : "text-[#ffffff] rounded-[0px]"
                        }`}
                        onClick={() => {
                          handleTabClick("manage_services");
                          handleDropdownCLick();
                        }}
                        role="tab"
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "manage_services" ||
                              active.includes("/vendor/services")
                            : activeTab === "manage_services" ||
                              active.includes("/doctor/services")
                        }
                      >
                        <GrServices className="mr-2" />
                        Manage Services
                      </Link>
                    )}
                    {roles.includes(11) && (
                      <Link
                        to={
                          vendor === "true"
                            ? "/vendor/managedepartment"
                            : "/doctor/managedepartment"
                        }
                        className={`nav-link flex items-center font-poppins text-[18px] font-normal leading-[33px] text-left ${
                          (
                            vendor === "true"
                              ? activeTab === "manage_department" ||
                                active.includes("/vendor/managedepartment")
                              : activeTab === "manage_department" ||
                                active.includes("/doctor/managedepartment")
                          )
                            ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                            : "text-[#ffffff] rounded-[0px]"
                        }`}
                        onClick={() => {
                          handleTabClick("manage_department");
                          handleDropdownCLick();
                        }}
                        role="tab"
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "manage_department" ||
                              active.includes("/vendor/managedepartment")
                            : activeTab === "manage_department" ||
                              active.includes("/doctor/managedepartment")
                        }
                      >
                        <BsPostcardFill className="mr-2" />
                        Manage Departments
                      </Link>
                    )}
                    {roles.includes(9) && (
                      <Link
                        to={
                          vendor === "true"
                            ? "/vendor/manageenquiries"
                            : "/doctor/manageenquiries"
                        }
                        className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                          (
                            vendor === "true"
                              ? activeTab === "manage_enquiries" ||
                                active.includes("/vendor/manageenquiries")
                              : activeTab === "manage_enquiries" ||
                                active.includes("/doctor/manageenquiries")
                          )
                            ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                            : "text-[#ffffff] rounded-[0px]"
                        }`}
                        onClick={() => {
                          handleTabClick("manage_enquiries");
                          handleDropdownCLick();
                        }}
                        role="tab"
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "manage_enquiries" ||
                              active.includes("/vendor/manageenquiries")
                            : activeTab === "manage_enquiries" ||
                              active.includes("/doctor/manageenquiries")
                        }
                      >
                        <BiSolidContact className="mr-2" />
                        Manage Enquiries
                      </Link>
                    )}
                    {roles.includes(10) && (
                      <Link
                        to={
                          vendor === "true"
                            ? "/vendor/managelocation"
                            : "/doctor/managelocation"
                        }
                        className={`nav-link font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                          (
                            vendor === "true"
                              ? activeTab === "managelocation" ||
                                active.includes("/vendor/managelocation")
                              : activeTab === "managelocation" ||
                                active.includes("/doctor/managelocation")
                          )
                            ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                            : "text-[#ffffff] rounded-[0px]"
                        }`}
                        onClick={() => handleTabClick("managelocation")}
                        role="tab"
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "managelocation" ||
                              active.includes("/vendor/managelocation")
                            : activeTab === "managelocation" ||
                              active.includes("/doctor/managelocation")
                        }
                      >
                        <BiSolidNavigation className="mr-2" />
                        Manage Locations
                      </Link>
                    )}
                    {roles.includes(12) && (
                      <Link
                        to={
                          vendor === "true"
                            ? "/vendor/feedback"
                            : "/doctor/feedback"
                        }
                        className={`nav-link font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                          (
                            vendor === "true"
                              ? activeTab === "feedback" ||
                                active.includes("/vendor/feedback")
                              : activeTab === "feedback" ||
                                active.includes("/doctor/feedback")
                          )
                            ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                            : "text-[#ffffff] rounded-[0px]"
                        }`}
                        onClick={() => handleTabClick("feedback")}
                        role="tab"
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "feedback" ||
                              active.includes("/vendor/feedback")
                            : activeTab === "feedback" ||
                              active.includes("/doctor/feedback")
                        }
                      >
                        <FaCommentDots className="mr-2" />
                        Manage Feedback
                      </Link>
                    )}
                    <hr className="text-[#ffffff] border-[3px] my-4" />
                    <span className="text-[#ffffff] font-poppins text-[28px] font-[500] leading-[42px] text-left ">
                      Profile
                    </span>
                    {roles.includes(15) && (
                      <Link
                        to={
                          vendor === "true"
                            ? "/vendor/myprofile"
                            : "/doctor/myprofile"
                        }
                        className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left mt-2 ${
                          (
                            vendor === "true"
                              ? activeTab === "myprofile" ||
                                active.includes("/vendor/myprofile")
                              : activeTab === "myprofile" ||
                                active.includes("/doctor/myprofile")
                          )
                            ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                            : "text-[#ffffff] rounded-[0px]"
                        }`}
                        onClick={() => {
                          handleTabClick("myprofile");
                          handleDropdownCLick();
                        }}
                        role="tab"
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "myprofile" ||
                              active.includes("/vendor/myprofile")
                            : activeTab === "myprofile" ||
                              active.includes("/doctor/myprofile")
                        }
                      >
                        <FaUser className="mr-2" />
                        My Profile
                      </Link>
                    )}
                    {roles.includes(16) && (
                      <Link
                        to={
                          vendor === "true"
                            ? "/vendor/changepassword"
                            : "/doctor/changepassword"
                        }
                        className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                          (
                            vendor === "true"
                              ? activeTab === "change-password" ||
                                active === "/vendor/changepassword"
                              : activeTab === "change-password" ||
                                active === "/doctor/changepassword"
                          )
                            ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                            : "text-[#ffffff] rounded-[0px]"
                        }`}
                        onClick={() => {
                          handleTabClick("change-password");
                          handleDropdownCLick();
                        }}
                        role="tab"
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "change-password" ||
                              active === "/vendor/changepassword"
                            : activeTab === "change-password" ||
                              active === "/doctor/changepassword"
                        }
                      >
                        <RiLockPasswordFill className="mr-2" />
                        Change Password
                      </Link>
                    )}
                    {roles.includes(17) && (
                      <Link
                        to={
                          vendor === "true"
                            ? "/vendor/notification"
                            : "/doctor/notification"
                        }
                        className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                          (
                            vendor === "true"
                              ? activeTab === "notification" ||
                                active === "/vendor/notification"
                              : activeTab === "notification" ||
                                active === "/doctor/notification"
                          )
                            ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                            : "text-[#ffffff] rounded-[0px]"
                        }`}
                        onClick={() => {
                          handleTabClick("notification");
                          handleDropdownCLick();
                        }}
                        role="tab"
                        aria-selected={
                          vendor === "true"
                            ? activeTab === "notification" ||
                              active === "/vendor/notification"
                            : activeTab === "notification" ||
                              active === "/doctor/notification"
                        }
                      >
                        <MdNotificationsActive className="mr-2" />
                        Notifications
                      </Link>
                    )}
                    <Link
                      to="#"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "about"
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("logout");
                        handleDropdownCLick();
                        handleLogout();
                      }}
                      role="tab"
                      aria-selected={activeTab === "logout"}
                    >
                      <PiSignOutBold className="mr-2" />
                      Log Out
                    </Link>
                  </>
                )}
                {/* {vendor === "true" &&
                staff === "false" &&
                superuser === "false" ? (
                  <>
                    <Link
                      to="/vendor"
                      className={`flex items-center nav-link font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "/vendor" || active === "/vendor"
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("/vendor");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "/vendor" || active === "/vendor"
                      }
                      on
                    >
                      <BiSolidDashboard className="mr-2" />
                      Dashboard
                    </Link>

                    <Link
                      to="#"
                      className={`px-[15px] py-1 font-poppins text-[20px] text-[#ffffff] flex items-center font-normal leading-[33px] text-left `}
                      onClick={() => {
                        setDropdownOpen(!dropdownOpen);
                      }} // Toggle dropdown visibility
                      role="tab"
                    >
                      <FcDataConfiguration className="mr-2" />
                      Configurations{" "}
                      <RiArrowDownSFill className="ml-2 text-[25px]" />
                    </Link>
                    {dropdownOpen && (
                      <div className="mt-1 w-48 w-full bg-white border border-gray-300 !rounded-l-[20px] shadow-lg">
                        <Link
                          to="vendor/logochange"
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            activeTab === "logochange" ||
                            active === "/vendor/logochange"
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("logochange")}
                          aria-selected={
                            activeTab === "logochange" ||
                            active === "/vendor/logochange"
                          }
                        >
                          Change Logo
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to="vendor/faviconchange"
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            activeTab === "faviconchange" ||
                            active === "/vendor/faviconchange"
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("faviconchange")}
                          aria-selected={
                            activeTab === "faviconchange" ||
                            active === "/vendor/faviconchange"
                          }
                        >
                          Change Favicon
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to="vendor/socialmediaprofiles"
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            activeTab === "socialmediaprofiles" ||
                            active === "/vendor/socialmediaprofiles"
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("socialmediaprofiles")}
                          aria-selected={
                            activeTab === "socialmediaprofiles" ||
                            active === "/vendor/socialmediaprofiles"
                          }
                        >
                          Social Media Profiles
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to="vendor/timings"
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            activeTab === "timings" ||
                            active === "/vendor/timings"
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("timings")}
                          aria-selected={
                            activeTab === "timings" ||
                            active === "/vendor/timings"
                          }
                        >
                          Update Timings
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to="vendor/slogantext"
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            activeTab === "slogantext" ||
                            active === "/vendor/slogantext"
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("slogantext")}
                          aria-selected={
                            activeTab === "slogantext" ||
                            active === "/vendor/slogantext"
                          }
                        >
                          Update Slogan Text
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to="vendor/address"
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            activeTab === "address" ||
                            active === "/vendor/address"
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("address")}
                          aria-selected={
                            activeTab === "address" ||
                            active === "/vendor/address"
                          }
                        >
                          Update Address
                        </Link>
                      </div>
                    )}

                    <Link
                      to="/vendor/staff"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "staff" ||
                        active.includes("/vendor/staff")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("staff");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "staff" ||
                        active.includes("/vendor/staff")
                      }
                    >
                      <FaPeopleGroup className="mr-2" />
                      Manage Staffs
                    </Link>

                    <Link
                      to="/vendor/appointments"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "appointments" ||
                        active.includes("/vendor/appointments")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("appointments");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "appointments" ||
                        active.includes("/vendor/appointments")
                      }
                    >
                      <MdMeetingRoom className="mr-2" /> Appointments
                    </Link>
                    <Link
                      to="/vendor/consultationquery"
                      className={`nav-link flex items-center font-poppins text-[18px] font-normal leading-[33px] text-left ${
                        activeTab === "consultation_queries" ||
                        active.includes("/vendor/consultationquery")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("consultation_queries");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "consultation_queries" ||
                        active.includes("/vendor/consultationquery")
                      }
                    >
                      <AiFillInteraction className="mr-2" />
                      Consultation Queries
                    </Link>

                    <Link
                      to="/vendor/managecontent"
                      className={`nav-link flex items-center font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_content" ||
                        active.includes("/vendor/managecontent")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_content");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_content" ||
                        active.includes("/vendor/managecontent")
                      }
                    >
                      <BiSolidBookContent className="mr-2" />
                      Manage Content
                    </Link>
                    <Link
                      to="/vendor/blogs"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_blogs" ||
                        active.includes("/vendor/blogs")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_blogs");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_blogs" ||
                        active.includes("/vendor/blogs")
                      }
                    >
                      <FaBloggerB className="mr-2" />
                      Manage Blogs
                    </Link>
                    <Link
                      to="/vendor/services"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_services" ||
                        active.includes("/vendor/services")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_services");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_services" ||
                        active.includes("/vendor/services")
                      }
                    >
                      <GrServices className="mr-2" />
                      Manage Services
                    </Link>
                    <Link
                      to="/vendor/managedepartment"
                      className={`nav-link flex items-center font-poppins text-[18px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_department" ||
                        active.includes("/vendor/managedepartment")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_department");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_department" ||
                        active.includes("/vendor/managedepartment")
                      }
                    >
                      <BsPostcardFill className="mr-2" />
                      Manage Departments
                    </Link>
                    <Link
                      to="/vendor/manageenquiries"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_enquiries" ||
                        active.includes("/vendor/manageenquiries")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_enquiries");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_enquiries" ||
                        active.includes("/vendor/manageenquiries")
                      }
                    >
                      <BiSolidContact className="mr-2" />
                      Manage Enquiries
                    </Link>
                    <Link
                      to="/vendor/managelocation"
                      className={`nav-link font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "managelocation" ||
                        active.includes("/vendor/managelocation")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => handleTabClick("managelocation")}
                      role="tab"
                      aria-selected={
                        activeTab === "managelocation" ||
                        active.includes("/vendor/managelocation")
                      }
                    >
                      <BiSolidNavigation className="mr-2" />
                      Manage Locations
                    </Link>
                    <Link
                      to="/vendor/feedback"
                      className={`nav-link font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "feedback" ||
                        active.includes("/vendor/feedback")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => handleTabClick("feedback")}
                      role="tab"
                      aria-selected={
                        activeTab === "feedback" ||
                        active.includes("/vendor/feedback")
                      }
                    >
                      <FaCommentDots className="mr-2" />
                      Manage Feedback
                    </Link>
                    <hr className="text-[#ffffff] border-[3px] my-4" />
                    <span className="text-[#ffffff] font-poppins text-[28px] font-[500] leading-[42px] text-left ">
                      Profile
                    </span>
                    <Link
                      to="/vendor/myprofile"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left mt-2 ${
                        activeTab === "myprofile" ||
                        active.includes("/vendor/myprofile")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("myprofile");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "myprofile" ||
                        active.includes("/vendor/myprofile")
                      }
                    >
                      <FaUser className="mr-2" />
                      My Profile
                    </Link>
                    <Link
                      to="/vendor/changepassword"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "change-password" ||
                        active === "/vendor/changepassword"
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("change-password");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "change-password" ||
                        active.includes("/vendor/changepassword")
                      }
                    >
                      <RiLockPasswordFill className="mr-2" />
                      Change Password
                    </Link>

                    <Link
                      to="/vendor/notification"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "notification" ||
                        active === "/vendor/notification"
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("notification");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "notification" ||
                        active === "/vendor/notification"
                      }
                    >
                      <MdNotificationsActive className="mr-2" />
                      Notifications
                    </Link>
                    <Link
                      to="#"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "about"
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("logout");
                        handleDropdownCLick();
                        handleLogout();
                      }}
                      role="tab"
                      aria-selected={activeTab === "logout"}
                    >
                      <PiSignOutBold className="mr-2" />
                      Log Out
                    </Link>
                  </>
                ) : null} */}
                {/* {vendor === "true" &&
                staff === "true" &&
                superuser === "false" ? (
                  <>
                    <Link
                      to="/vendor"
                      className={`flex items-center nav-link font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "/vendor" || active === "/vendor"
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("/vendor");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "/vendor" || active === "/vendor"
                      }
                      on
                    >
                      <BiSolidDashboard className="mr-2" />
                      Dashboard
                    </Link>

                    <Link
                      to="#"
                      className={`px-[15px] py-1 font-poppins text-[20px] text-[#ffffff] flex items-center font-normal leading-[33px] text-left `}
                      onClick={() => {
                        setDropdownOpen(!dropdownOpen);
                      }} // Toggle dropdown visibility
                      role="tab"
                    >
                      <FcDataConfiguration className="mr-2" />
                      Configurations{" "}
                      <RiArrowDownSFill className="ml-2 text-[25px]" />
                    </Link>
                    {dropdownOpen && (
                      <div className="mt-1 w-48 w-full bg-white border border-gray-300 !rounded-l-[20px] shadow-lg">
                        <Link
                          to="vendor/logochange"
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            activeTab === "logochange" ||
                            active === "/vendor/logochange"
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("logochange")}
                          aria-selected={
                            activeTab === "logochange" ||
                            active === "/vendor/logochange"
                          }
                        >
                          Change Logo
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to="vendor/faviconchange"
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            activeTab === "faviconchange" ||
                            active === "/vendor/faviconchange"
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("faviconchange")}
                          aria-selected={
                            activeTab === "faviconchange" ||
                            active === "/vendor/faviconchange"
                          }
                        >
                          Change Favicon
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to="vendor/socialmediaprofiles"
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            activeTab === "socialmediaprofiles" ||
                            active === "/vendor/socialmediaprofiles"
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("socialmediaprofiles")}
                          aria-selected={
                            activeTab === "socialmediaprofiles" ||
                            active === "/vendor/socialmediaprofiles"
                          }
                        >
                          Social Media Profiles
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to="vendor/timings"
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            activeTab === "timings" ||
                            active === "/vendor/timings"
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("timings")}
                          aria-selected={
                            activeTab === "timings" ||
                            active === "/vendor/timings"
                          }
                        >
                          Update Timings
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to="vendor/slogantext"
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            activeTab === "slogantext" ||
                            active === "/vendor/slogantext"
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("slogantext")}
                          aria-selected={
                            activeTab === "slogantext" ||
                            active === "/vendor/slogantext"
                          }
                        >
                          Update Slogan Text
                        </Link>
                        <hr className="text-black-800 border-[2px] mx-4" />
                        <Link
                          to="vendor/address"
                          className={`block px-4 py-2 text-[#113C54] hover:text-[#ffffff] hover:bg-[#113C54] !rounded-l-[20px]  ${
                            activeTab === "address" ||
                            active === "/vendor/address"
                              ? "text-[#ffffff] bg-[#113C54]"
                              : "text-[#113C54]"
                          }`}
                          onClick={() => handleTabClick("address")}
                          aria-selected={
                            activeTab === "address" ||
                            active === "/vendor/address"
                          }
                        >
                          Update Address
                        </Link>
                      </div>
                    )}

                    <Link
                      to="/vendor/staff"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "staff" ||
                        active.includes("/vendor/staff")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("staff");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "staff" ||
                        active.includes("/vendor/staff")
                      }
                    >
                      <FaPeopleGroup className="mr-2" />
                      Manage Staffs
                    </Link>
                    <Link
                      to="/vendor/manageslots"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "slots" ||
                        active.includes("/vendor/manageslots")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("slots");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "slots" ||
                        active.includes("/vendor/manageslots")
                      }
                    >
                      <BiSolidShieldPlus className="mr-2" />
                      Manage Slots
                    </Link>

                    <Link
                      to="/vendor/appointments"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "appointments" ||
                        active.includes("/vendor/appointments")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("appointments");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "appointments" ||
                        active.includes("/vendor/appointments")
                      }
                    >
                      <MdMeetingRoom className="mr-2" /> Appointments
                    </Link>
                    <Link
                      to="/vendor/manageholidays"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manageholidays" ||
                        active.includes("/vendor/manageholidays")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manageholidays");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manageholidays" ||
                        active.includes("/vendor/manageholidays")
                      }
                    >
                      <FaCalendarAlt className="mr-2" /> Manage Holidays
                    </Link>
                    <Link
                      to="/vendor/consultationquery"
                      className={`nav-link flex items-center font-poppins text-[18px] font-normal leading-[33px] text-left ${
                        activeTab === "consultation_queries" ||
                        active.includes("/vendor/consultationquery")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("consultation_queries");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "consultation_queries" ||
                        active.includes("/vendor/consultationquery")
                      }
                    >
                      <AiFillInteraction className="mr-2" />
                      Consultation Queries
                    </Link>

                    <Link
                      to="/vendor/managecontent"
                      className={`nav-link flex items-center font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_content" ||
                        active.includes("/vendor/managecontent")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_content");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_content" ||
                        active.includes("/vendor/managecontent")
                      }
                    >
                      <BiSolidBookContent className="mr-2" />
                      Manage Content
                    </Link>
                    <Link
                      to="/vendor/blogs"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_blogs" ||
                        active.includes("/vendor/blogs")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_blogs");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_blogs" ||
                        active.includes("/vendor/blogs")
                      }
                    >
                      <FaBloggerB className="mr-2" />
                      Manage Blogs
                    </Link>
                    <Link
                      to="/vendor/services"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_services" ||
                        active.includes("/vendor/services")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_services");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_services" ||
                        active.includes("/vendor/services")
                      }
                    >
                      <GrServices className="mr-2" />
                      Manage Services
                    </Link>
                    <Link
                      to="/vendor/managedepartment"
                      className={`nav-link flex items-center font-poppins text-[18px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_department" ||
                        active.includes("/vendor/managedepartment")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_department");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_department" ||
                        active.includes("/vendor/managedepartment")
                      }
                    >
                      <BsPostcardFill className="mr-2" />
                      Manage Departments
                    </Link>
                    <Link
                      to="/vendor/manageenquiries"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manage_enquiries" ||
                        active.includes("/vendor/manageenquiries")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manage_enquiries");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manage_enquiries" ||
                        active.includes("/vendor/manageenquiries")
                      }
                    >
                      <BiSolidContact className="mr-2" />
                      Manage Enquiries
                    </Link>
                    <Link
                      to="/vendor/managelocation"
                      className={`nav-link font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "managelocation" ||
                        active.includes("/vendor/managelocation")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => handleTabClick("managelocation")}
                      role="tab"
                      aria-selected={
                        activeTab === "managelocation" ||
                        active.includes("/vendor/managelocation")
                      }
                    >
                      <BiSolidNavigation className="mr-2" />
                      Manage Locations
                    </Link>
                    <Link
                      to="/vendor/feedback"
                      className={`nav-link font-poppins flex items-center text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "feedback" ||
                        active.includes("/vendor/feedback")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => handleTabClick("feedback")}
                      role="tab"
                      aria-selected={
                        activeTab === "feedback" ||
                        active.includes("/vendor/feedback")
                      }
                    >
                      <FaCommentDots className="mr-2" />
                      Manage Feedback
                    </Link>
                    <hr className="text-[#ffffff] border-[3px] my-4" />
                    <span className="text-[#ffffff] font-poppins text-[28px] font-[500] leading-[42px] text-left ">
                      Profile
                    </span>
                    <Link
                      to="/vendor/myprofile"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left mt-2 ${
                        activeTab === "myprofile" ||
                        active.includes("/vendor/myprofile")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("myprofile");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "myprofile" ||
                        active.includes("/vendor/myprofile")
                      }
                    >
                      <FaUser className="mr-2" />
                      My Profile
                    </Link>
                    <Link
                      to="/vendor/changepassword"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "change-password" ||
                        active === "/vendor/changepassword"
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("change-password");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "change-password" ||
                        active.includes("/vendor/changepassword")
                      }
                    >
                      <RiLockPasswordFill className="mr-2" />
                      Change Password
                    </Link>

                    <Link
                      to="/vendor/notification"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "notification" ||
                        active === "/vendor/notification"
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("notification");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "notification" ||
                        active === "/vendor/notification"
                      }
                    >
                      <MdNotificationsActive className="mr-2" />
                      Notifications
                    </Link>
                    <Link
                      to="#"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "about"
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("logout");
                        handleDropdownCLick();
                        handleLogout();
                      }}
                      role="tab"
                      aria-selected={activeTab === "logout"}
                    >
                      <PiSignOutBold className="mr-2" />
                      Log Out
                    </Link>
                  </>
                ) : null} */}
                {/* {superuser === "false" &&
                staff === "true" &&
                vendor === "false" ? (
                  <>
                    <Link
                      to="/doctor"
                      className={`flex items-center nav-link font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "/doctor" || active === "/doctor"
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("/doctor");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "/doctor" || active === "/doctor"
                      }
                      on
                    >
                      <BiSolidDashboard className="mr-2" />
                      Dashboard
                    </Link>

                    <Link
                      to="/doctor/manageslots"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "slots" ||
                        active.includes("/doctor/manageslots")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("slots");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "slots" ||
                        active.includes("/doctor/manageslots")
                      }
                    >
                      <BiSolidShieldPlus className="mr-2" />
                      Manage Slots
                    </Link>
                    <Link
                      to="/doctor/appointments"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "appointments" ||
                        active.includes("/doctor/appointments")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("appointments");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "appointments" ||
                        active.includes("/doctor/appointments")
                      }
                    >
                      <MdMeetingRoom className="mr-2" /> Appointments
                    </Link>
                    <Link
                      to="/doctor/manageholidays"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "manageholidays" ||
                        active.includes("/doctor/manageholidays")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("manageholidays");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "manageholidays" ||
                        active.includes("/doctor/manageholidays")
                      }
                    >
                      <FaCalendarAlt className="mr-2" /> Manage Holidays
                    </Link>
                    <hr className="text-[#ffffff] border-[3px] my-4" />
                    <span className="text-[#ffffff] font-poppins text-[28px] font-[500] leading-[42px] text-left ">
                      Profile
                    </span>
                    <Link
                      to="/doctor/myprofile"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left mt-2 ${
                        activeTab === "myprofile" ||
                        active.includes("/doctor/myprofile")
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("myprofile");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "myprofile" ||
                        active.includes("/doctor/myprofile")
                      }
                    >
                      <FaUser className="mr-2" />
                      My Profile
                    </Link>
                    <Link
                      to="/doctor/changepassword"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "change-password" ||
                        active === "/doctor/changepassword"
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("change-password");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "change-password" ||
                        active.includes("/doctor/changepassword")
                      }
                    >
                      <RiLockPasswordFill className="mr-2" />
                      Change Password
                    </Link>
                    <Link
                      to="/doctor/notification"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "notification" ||
                        active === "/doctor/notification"
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("notification");
                        handleDropdownCLick();
                      }}
                      role="tab"
                      aria-selected={
                        activeTab === "notification" ||
                        active === "/doctor/notification"
                      }
                    >
                      <MdNotificationsActive className="mr-2" />
                      Notifications
                    </Link>
                    <Link
                      to="#"
                      className={`nav-link flex items-center font-poppins text-[20px] font-normal leading-[33px] text-left ${
                        activeTab === "about"
                          ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                          : "text-[#ffffff] rounded-[0px]"
                      }`}
                      onClick={() => {
                        handleTabClick("logout");
                        handleDropdownCLick();
                        handleLogout();
                      }}
                      role="tab"
                      aria-selected={activeTab === "logout"}
                    >
                      <PiSignOutBold className="mr-2" />
                      Log Out
                    </Link>
                  </>
                ) : null} */}
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
