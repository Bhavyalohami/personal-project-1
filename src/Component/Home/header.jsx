import { useState, useEffect, useRef } from "react";
import { GrClose } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import AppointmentModal from "./appointmentmodal";
import axios from "axios";
import BaseUrl from "../../Api/baseurl";
import Cookies from "js-cookie";
import { FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { FaSearch } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import Tooltip from "@mui/material/Tooltip";

const Header = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [data, setData] = useState({ new_logo: "" });
  const [isLogin, setIsLogin] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [details, setDetails] = useState({
    image: "",
    name: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");

  // const handleOpenModal = () => {
  //   setIsModalOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  // };

  // const handleSearch = () => {
  //   console.log("Searching for:", searchQuery);
  //   // You can add your search logic here
  //   setIsModalOpen(false); // Close modal after search
  // };

  let Login = Cookies.get("patient_username");
  const handleTabClick = (tab) => {
    setActiveTab(window.location.pathname);
  };

  const active = window.location.pathname;

  const fetchData = async () => {
    const apiUrl = `${BaseUrl}clinic/logochange/`;
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const fetchDetail = async () => {
    const username = Cookies.get("patient_username");
    const url = `${BaseUrl}clinic/patient-profile/${username}/`;
    const response = await axios.get(url);
    setDetails(response.data);
  };
  const handleLogout = () => {
    Cookies.remove("patient_token");
    Cookies.remove("patient_username");
    Cookies.remove("patient_status");
    Cookies.remove("staff");
    Cookies.remove("superuser");
    setIsLogin(null);
  };
  useEffect(() => {
    const patientUsername = Cookies.get("patient_username");
    const token = Cookies.get("patient_token");
    if (patientUsername !== undefined) {
      setIsLogin(token);
      fetchDetail();
    }
  }, [Login]);

  useEffect(() => {
    fetchData();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  setTimeout(() => {
    setDropdownOpen(false);
  }, 10000);

  const handleBookAppointment = () => {
    const token = Cookies.get("patient_token");
    if (!token) {
      Swal.fire({
        title: "You are not logged in!",
        text: "Would you like to continue as a guest or login?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Continue as Guest",
        cancelButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          setModalOpen(true);
        } else if (result.isDismissed) {
          navigate("/user/login");
          setModalOpen(false);
        }
      });
    } else {
      setModalOpen(true);
    }
  };
  const handleSearch = async (e) => {
    setQuery(e.target.value);
    if (e.target.value.length > 1) {
      const response = await axios.get(
        `${BaseUrl}clinic/home-search-staff/?q=${e.target.value}`
      );
      setSuggestions(response.data);
    } else {
      setSuggestions([]);
    }
  };
  return (
    <div className="bg-gray-200">
      <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48">
        <div className="flex items-center justify-between h-24 sm:h-32">
          {data && (
            <div className="!w-2/5 md:!w-1/3 lg:!w-1/6">
              <Link to="/">
                <img src={data.new_logo} alt="Logo" />
              </Link>
            </div>
          )}
          {/* Navigation links hidden on medium screens */}

          <nav className="hidden lg:flex flex-grow justify-center items-center space-x-5">
            <Link
              to="/"
              onClick={() => handleTabClick("home")}
              className={`font-medium ${
                activeTab === "home" || active === "/"
                  ? "text-blue-800"
                  : "text-black"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => handleTabClick("about")}
              className={`font-medium ${
                activeTab === "about" || active === "/about"
                  ? "text-blue-800"
                  : "text-black"
              }`}
            >
              About Us
            </Link>
            <Link
              to="/services"
              onClick={() => handleTabClick("services")}
              className={`font-medium ${
                activeTab === "services" || active === "/services"
                  ? "text-blue-800"
                  : "text-black"
              }`}
            >
              Services
            </Link>
            <Link
              to="/blog"
              onClick={() => handleTabClick("blog")}
              className={`font-medium ${
                activeTab === "blog" || active === "/blog"
                  ? "text-blue-800"
                  : "text-black"
              }`}
            >
              Blog
            </Link>
            <Link
              to="/ourdoctors"
              onClick={() => handleTabClick("ourdoctors")}
              className={`font-medium ${
                activeTab === "ourdoctors" || active === "/ourdoctors"
                  ? "text-blue-800"
                  : "text-black"
              }`}
            >
              Our Doctors
            </Link>
            {/* <button onClick={handleOpenModal} className="text-lg text-gray-700">
              <FaSearch />
            </button> */}
            <div className="flex items-center">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`transition-all duration-300 ease-in-out ${
                  showSearch
                    ? "translate-x-[115px] xl:translate-x-[195px] z-50"
                    : ""
                }`}
              >
                {showSearch === false ? (
                  <Tooltip title="Search">
                    <FaSearch className="text-lg text-gray-700" />
                  </Tooltip>
                ) : (
                  <GiCancel className="text-lg text-gray-700" />
                )}
              </button>

              {showSearch && (
                <div className="transition-all duration-300 ease-in-out transform translate-x-0 relative z-40">
                  <input
                    type="text"
                    placeholder="Search here!"
                    value={query}
                    onChange={handleSearch}
                    className="pl-3 pr-8 py-1 w-[150px] xl:w-[230px] ml-[-25px] border border-gray-300 rounded-full focus:outline-none focus:ring-none "
                  />
                  {suggestions.length > 0 ? (
                    <div className="absolute top-10 ml-[-20px] bg-white w-[230px] rounded-lg !max-h-60 overflow-y-auto scrollable">
                      {suggestions.map((staff) => (
                        <div
                          key={staff.id}
                          className="hover:bg-gray-300 rounded-lg"
                        >
                          <Link
                            to={`/profiledoctor/${staff.id}`}
                            onClick={() => {
                              setShowSearch(false);
                              setQuery("");
                              setSuggestions([]);
                            }}
                          >
                            <div className="p-2 flex items-center gap-2 py-0.5">
                              <img
                                src={`${BaseUrl}${staff.image}`}
                                alt=""
                                className="h-12 w-12 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-bold">
                                  Dr.{staff.fname + " " + staff.lname}
                                </p>
                                {/* <span className="font-bold ml-2">{staff.department}</span> */}
                                <p className="font-medium text-xs">
                                  {staff.location}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    query !== "" && (
                      <div className="absolute top-10 ml-[-20px] bg-white w-[230px] rounded-lg !max-h-60">
                        <p className="w-full text-center font-semibold text-base text-gray-500 py-2">
                          No Results Found!!
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden lg:flex flex-shrink-0">
            <Link
              type="button"
              className="py-2 px-3 bg-[#1030A4] text-white rounded-[5px] hover:bg-blue-700 font-semibold"
              onClick={handleBookAppointment}
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Book Appointment
            </Link>
          </div>

          <div className="flex flex-col relative" ref={dropdownRef}>
            <Link onClick={() => setDropdownOpen(!dropdownOpen)} className="">
              <div className="hidden lg:flex items-center gap-1.5 px-2 bg-white rounded-lg ml-2  py-1.5">
                {isLogin === null ? (
                  <>
                    <FaUserCircle className="text-[35px] text-gray-700" />
                    {/* <text className="font-bold">Guest</text> */}
                  </>
                ) : (
                  <>
                    {!details.image ? (
                      <FaUserCircle className="text-[35px] text-gray-700" />
                    ) : (
                      <img
                        className="h-[35px] w-[35px] rounded-full object-cover"
                        src={details.image}
                        alt=""
                      />
                    )}
                    <text className="hidden xl:flex font-bold text-center w-fit">
                      {details.name === "N/A" ? "Guest" : details.name.split(" ")[0]}
                      {/* {details.name} */}
                    </text>
                  </>
                )}
              </div>
            </Link>
            {dropdownOpen && (
              <div className="mt-1 absolute z-20 right-0 top-[50px] rounded-lg w-48 bg-gray-100 shadow-lg">
                {isLogin === null ? (
                  <Link
                    to="/user/login"
                    className="block px-4 py-2 font-semibold text-[#113C54] text-center rounded-lg hover:bg-gray-300"
                    onClick={() => "myprofile"}
                  >
                    Login/Register
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/userprofile"
                      className="block px-4 py-2 font-semibold text-[#113C54] rounded-t-lg hover:bg-gray-300"
                      onClick={() => "myprofile"}
                    >
                      Profile
                    </Link>
                    <hr className="text-black-800 border-[2px] mx-4" />
                    <Link
                      to="/userappointments"
                      className="block px-4 py-2 font-semibold text-[#113C54] hover:bg-gray-300"
                      onClick={() => "myprofile"}
                    >
                      Appointments
                    </Link>
                    <hr className="text-black-800 border-[2px] mx-4" />
                    <Link
                      to="/userdocuments"
                      className="block px-4 py-2 font-semibold text-[#113C54] hover:bg-gray-300"
                      onClick={() => "myprofile"}
                    >
                      Documents
                    </Link>
                    <hr className="text-black-800 border-[2px] mx-4" />
                    <Link
                      to="/passwordchange"
                      className="block px-4 py-2 font-semibold text-[#113C54] hover:bg-gray-300"
                      onClick={() => "myprofile"}
                    >
                      Change Password
                    </Link>
                    <hr className="text-black-800 border-[2px] mx-4" />
                    <Link
                      to="/user/login"
                      className="block px-4 py-2 font-semibold text-[#113C54] rounded-b-lg hover:bg-gray-300"
                      onClick={() => handleLogout()}
                    >
                      Log Out
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <AppointmentModal modalOpen={modalOpen} setModalOpen={setModalOpen} />

          <div className="lg:hidden flex flex gap-3">
            <div className=" flex items-center">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`${
                  showSearch
                    ? "transition-all duration-300 ease-in-out translate-x-[140px] sm:translate-x-[190px] z-50"
                    : ""
                }`}
              >
                {showSearch === false ? (
                  <FaSearch className="text-lg text-gray-700" />
                ) : (
                  <GiCancel className="text-lg text-gray-700" />
                )}
              </button>

              {showSearch && (
                <div className="transition-all duration-300 ease-in-out transform translate-x-0 relative z-40">
                  <input
                    type="text"
                    placeholder="Search here!"
                    value={query}
                    onChange={handleSearch}
                    className="pl-3 pr-8 py-1 w-[150px] sm:w-[200px] border border-gray-300 rounded-full focus:outline-none focus:ring-none"
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute top-10 ml-[-20px] bg-white w-[230px] rounded-lg">
                      {suggestions.map((staff) => (
                        <div
                          key={staff.id}
                          className="hover:bg-gray-300 rounded-lg"
                        >
                          <Link
                            to={`/profiledoctor/${staff.id}`}
                            onClick={() => {
                              setShowSearch(false);
                              setQuery("");
                              setSuggestions([]);
                            }}
                          >
                            <div className="p-2 flex items-center gap-2 py-0.5">
                              <img
                                src={`https://doctor-appointment-software.logicspice.com${staff.image}`}
                                alt=""
                                className="h-12 w-12 rounded-full"
                              />
                              <div>
                                <p className="font-bold">
                                  Dr.{staff.fname + " " + staff.lname}
                                </p>
                                {/* <span className="font-bold ml-2">{staff.department}</span> */}
                                <p className="font-medium text-xs">
                                  {staff.location}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-xl text-gray-700 hover:text-gray-900 focus:outline-none mr-4"
            >
              {showMenu ? <GrClose /> : <GiHamburgerMenu />}
            </button>
          </div>
        </div>
        {/* Mobile menu dropdown */}
        {showMenu && (
          <div className="lg:hidden bg-gray-200 shadow-md py-2 px-4">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => handleTabClick("home")}
                className={`font-medium ${
                  activeTab === "home" || active === "/"
                    ? "text-blue-800"
                    : "text-black"
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => handleTabClick("about")}
                className={`font-medium ${
                  activeTab === "about" || active === "/about"
                    ? "text-blue-800"
                    : "text-black"
                }`}
              >
                About Us
              </Link>
              <Link
                to="/services"
                onClick={() => handleTabClick("services")}
                className={`font-medium ${
                  activeTab === "services" || active === "/services"
                    ? "text-blue-800"
                    : "text-black"
                }`}
              >
                Services
              </Link>
              <Link
                to="/blog"
                onClick={() => handleTabClick("blog")}
                className={`font-medium ${
                  activeTab === "blog" || active === "/blog"
                    ? "text-blue-800"
                    : "text-black"
                }`}
              >
                Blog
              </Link>
              <Link
                to="/ourdoctors"
                onClick={() => handleTabClick("ourdoctors")}
                className={`font-medium ${
                  activeTab === "ourdoctors" || active === "/ourdoctors"
                    ? "text-blue-800"
                    : "text-black"
                }`}
              >
                Our Doctors
              </Link>
              {isLogin === null ? (
                <Link
                  to="/user/login"
                  className="block px-4 py-2 font-semibold text-[#2c97d1] text-center rounded-lg hover:bg-gray-300"
                  onClick={() => "myprofile"}
                >
                  Login/Register
                </Link>
              ) : (
                <>
                  <p className="text-[#113C54] text-xl font-bold">
                    User Settings
                  </p>
                  <Link
                    to="/userprofile"
                    className="block py-2 font-semibold text-[#2c97d1] rounded-t-lg hover:bg-gray-300"
                    onClick={() => "myprofile"}
                  >
                    Profile
                  </Link>
                  <hr className="text-black-800 border-[2px] mr-8" />
                  <Link
                    to="/userappointments"
                    className="block py-2 font-semibold text-[#2c97d1] hover:bg-gray-300"
                    onClick={() => "myprofile"}
                  >
                    Appointments
                  </Link>
                  <hr className="text-black-800 border-[2px] mr-8" />
                  <Link
                    to="/userdocuments"
                    className="block py-2 font-semibold text-[#2c97d1] hover:bg-gray-300"
                    onClick={() => "myprofile"}
                  >
                    Documents
                  </Link>
                  <hr className="text-black-800 border-[2px] mr-8" />
                  <Link
                    to="/passwordchange"
                    className="block py-2 font-semibold text-[#2c97d1] hover:bg-gray-300"
                    onClick={() => "myprofile"}
                  >
                    Change Password
                  </Link>
                  <hr className="text-black-800 border-[2px] mr-8" />
                  <Link
                    to="/user/login"
                    className="block py-2 font-semibold text-[#2c97d1] rounded-b-lg hover:bg-gray-300"
                    onClick={() => handleLogout()}
                  >
                    Log Out
                  </Link>
                </>
              )}

              <button
                type="button"
                className="py-2 px-3 bg-[#1030A4] text-white rounded-[5px] hover:bg-blue-700 font-semibold text-center"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={handleBookAppointment}
              >
                Book an Appointment
              </button>
            </nav>
          </div>
        )}
      </div>
      {/* {isModalOpen && (
        <div className="fixed inset-0 flex items-baseline justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white px-3 py-[30px] mt-2 rounded-lg  w-auto z-[100]">
            <div className="absolute right-1 top-1">
              <button
                onClick={handleCloseModal}
                className="font-bold text-gray-600 hover:text-gray-800"
              >
                <GiCancel className="text-xl"/>
              </button>
            </div>

            <div className="flex flex space-x-4">
              <input
                type="text"
                placeholder="Enter doctor/department/location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 min-w-[320px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Header;
