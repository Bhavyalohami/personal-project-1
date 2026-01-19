import React, { useState } from "react";
import { BiSolidDashboard } from "react-icons/bi";
import { FaUser } from "react-icons/fa6";
import { Link, Outlet } from "react-router-dom";
const Userdashboard = () => {
  const [activeTab, setActiveTab] = useState("");
  const active = window.location.pathname;
  const [showMenu, setShowMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleTabClick = (tab) => {
    setActiveTab(window.location.pathname);
  };
  const handleDropdownCLick = (tab) => {
    setDropdownOpen(false);
  };
  return (
    <div className="w-full">
      <div className="flex flex-col w-[300px] h-screen">
        <div className="bg-[#113C54] !rounded-r-[15px] !rounded-l-[0px] hidden md:flex  md:flex-col py-12  pl-8  h-full w-full">
          <nav>
            <Link
              to="/dashboard"
              className={`flex items-center nav-link font-poppins text-[24px] font-bold leading-[33px] text-right p-2 ${
                activeTab === "/dashboard" || active === "/dashboard"
                  ? "text-[#113C54] bg-[#ffffff] !rounded-l-[30px] !rounded-r-[0px]"
                  : "text-[#ffffff] rounded-[0px]"
              }`}
              onClick={() => {
                handleTabClick("/dashboard");
                handleDropdownCLick();
              }}
              role="tab"
              aria-selected={
                activeTab === "/dashboard" || active === "/dashboard"
              }
              on
            >
              <FaUser className="ml-6 mr-2" />
              Profile
            </Link>
          </nav>
        </div>
        {/* <main className="flex-1 p-4">
            <Outlet />
          </main> */}
      </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Userdashboard;
