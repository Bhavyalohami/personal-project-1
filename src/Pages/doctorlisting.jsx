import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { IoIosFunnel } from "react-icons/io";
import BaseUrl from "../Api/baseurl";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { useMediaQuery } from "@mui/material";
import { MdKeyboardArrowDown } from "react-icons/md";

const DoctorListing = () => {
  const [staffData, setStaffData] = useState([]);
  const [location, setLocation] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State to handle the visibility of the filter dropdown on small screens

  useEffect(() => {
    getStaffData();
    getLocation();
    getDepartments();
  }, []);

  const getDepartments = async () => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/managedepartment`);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error.message);
    }
  };

  const getLocation = async () => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/managelocation/`);
      setLocation(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error.message);
    }
  };

  const getStaffData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}clinic/allstaff`);
      setStaffData(response.data);
    } catch (error) {
      console.error("Error fetching staff data:", error);
    } finally {
      setLoading(false);
    }
  };

  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery(
    "(min-width:600px) and (max-width:960px)"
  );
  let ratingSize = "large";

  if (isSmallScreen) {
    ratingSize = "small";
  } else if (isMediumScreen) {
    ratingSize = "medium";
  }

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleRatingChange = (event, newValue) => {
    setSelectedRating(newValue);
    setIsDropdownOpen(false);
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter staff data based on selected filters
  const filteredStaffData = staffData.filter((staff) => {
    const isLocationMatch = selectedLocation
      ? staff.location.toLowerCase() === selectedLocation.toLowerCase()
      : true;

    const isDepartmentMatch = selectedDepartment
      ? staff.department.toLowerCase() === selectedDepartment.toLowerCase()
      : true;

    const isRatingMatch = selectedRating
      ? staff.average_rating >= selectedRating
      : true;

    const isSearchMatch =
      staff.fname.toLowerCase().includes(searchQuery) ||
      staff.lname.toLowerCase().includes(searchQuery) ||
      staff.department.toLowerCase().includes(searchQuery) ||
      staff.location.toLowerCase().includes(searchQuery) ||
      staff.role.toLowerCase().includes(searchQuery);

    return (
      isLocationMatch && isDepartmentMatch && isRatingMatch && isSearchMatch
    );
  });

  return (
    <div>
      <div className="bg-[#F2EFEA] py-6">
        <p className="font-general-sans text-center lg:!text-start text-4xl font-semibold leading-74.4 tracking-tighter text-[#011632] container mb-4 mx-auto px-4 sm:px-8 lg:px-32 xl:px-48">
          Our Doctors
        </p>
        <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48">
          <div className="flex justify-between items-center gap-4 mb-6">
            <div className="relative flex flex-grow md:w-1/2 lg:w-1/3">
              <input
                className="p-2 !pr-8 w-full md:w-3/4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Search by Name, Department, Location"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button className={`  absolute right-[10px] md:right-[165px] lg:right-[235px] xl:right-[135px] 2xl:right-[195px] top-3`}>
                <FaSearch className="text-gray-500 text-lg" />
              </button>
            </div>

            <div
              className={`xl:flex flex-wrap justify-center items-center gap-3 relative`}
            >
              <p className="hidden xl:flex items-center justify-center gap-1 font-medium bg-white py-[11px] px-4 rounded-md shadow-md">
                <IoIosFunnel />
                {/* Filter */}
              </p>
              <div className="w-full flex items-center justify-center xl:hidden ">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)} 
                  className="flex items-center justify-center gap-1 font-medium bg-white py-[11px] px-4 rounded-md shadow-md"
                >
                  <IoIosFunnel />
                  {/* Filter */}
                </button>
              </div>
              <div
                className={`${
                  isFilterOpen ? "flex mt-2" : "hidden"
                } xl:flex flex-col xl:flex-row gap-1 xl:!gap-3 left-[-120px] xl:left-0 absolute xl:!relative z-10`}
              >
                {/* {location.length > 0 && ( */}
                  <select
                    className="bg-white p-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 xl:min-w-[200px]"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    aria-label="Filter by location"
                  >
                    <option value="">Select Location</option>
                    {location.map(
                      (loc) =>
                        loc.status === 1 && (
                          <option key={loc.id} value={loc.name}>
                            {loc.name}
                          </option>
                        )
                    )}
                  </select>
                 {/* )} */}

                {/* {departments.length > 0 && ( */}
                  <select
                    className="bg-white p-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 xl:min-w-[225px]"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    aria-label="Filter by department"
                  >
                    <option value="">Select Department</option>
                    {departments.map(
                      (dep) =>
                        dep.status === 1 && (
                          <option key={dep.id} value={dep.name}>
                            {dep.name}
                          </option>
                        )
                    )}
                  </select>
                {/* )} */}

                {/* Rating Dropdown */}
                <div className="relative">
                  <button
                    className="flex items-center justify-between bg-white p-2 text-start rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full xl:min-w-[190px]"
                    onClick={toggleDropdown}
                  >
                    {selectedRating
                      ? `Rating: ${selectedRating}`
                      : "Select Rating"}

                    <MdKeyboardArrowDown className="absolute top-2.5 right-0 text-black text-xl" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg rounded-md z-20">
                      <div className="py-2 px-2.5">
                        <div
                          className="flex items-center space-x-2 cursor-pointer"
                          onClick={() => {
                            setSelectedRating(null);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <span>Select Rating</span>
                        </div>

                        {[1, 2, 3, 4, 5].map((rating) => (
                          <div
                            key={rating}
                            onClick={() => handleRatingChange(null, rating)}
                            className="flex items-center justify-between space-x-2 cursor-pointer"
                          >
                            <Rating
                              name={`rating-${rating}`}
                              value={rating}
                              size="medium"
                              readOnly
                            />
                            <span>{rating}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 my-12">
        {loading ? (
          <div className="text-center py-4 text-lg text-gray-500">
            Loading doctors...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredStaffData.length > 0 ? (
              filteredStaffData.map(
                (staff, index) =>
                  staff.status === 1 && (
                    <div
                      key={index}
                      className="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 hover:shadow-2xl transform transition-all duration-300"
                    >
                      <Link to={`/profiledoctor/${staff.id}`}>
                        <div className="relative">
                          <img
                            className="w-full h-56 object-cover"
                            src={staff.image}
                            alt={`${staff.fname} ${staff.lname}`}
                          />
                        </div>

                        <div className="px-4 py-2">
                          <p className="text-xl font-semibold text-gray-800">
                            {staff.fname + " " + staff.lname}
                          </p>
                          <p className="text-sm text-gray-600">
                            {staff.department}
                          </p>
                          <p className="text-xs text-gray-500 font-bold mt-1">
                            Years Of Experience:{" "}
                            <span className="font-medium">{staff.yoe}</span>
                          </p>
                          <p className="text-xs text-gray-500 font-bold mt-1">
                            Location:{" "}
                            <span className="font-medium">
                              {staff.location}
                            </span>
                          </p>
                          <div className="flex w-full justify-between items-center mt-3">
                            <div className="flex items-center justify-center">
                              <p className="text-lg font-bold text-blue-800">
                                $<span className="ml-0.5">{staff.amount}</span>
                              </p>
                            </div>
                            <Box sx={{ "& > legend": { mt: 3 } }}>
                              <Rating
                                name="controlled"
                                value={staff.average_rating}
                                precision={0.5}
                                readOnly
                                size={"medium"}
                              />
                            </Box>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
              )
            ) : (
              <div className="text-center py-4 text-lg text-gray-500 col-span-full">
                No doctors found matching the filter criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorListing;
