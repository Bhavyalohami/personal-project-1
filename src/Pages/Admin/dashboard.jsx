import { IoIosMore } from "react-icons/io";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  TextField,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import CalendarSelect from "../../Component/calenderselect";
import AdminSearch from "../../Component/Admin/adminsearch";
import DoctorSearch from "../../Component/Doctor/doctorsearch";
import VendorSearch from "../../Component/Vendor/vendorsearch";
import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";
import _ from "lodash";
import { Link, useNavigate } from "react-router-dom";
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import ServiceModal from "./Viewmodals/viewcontact";
import Cookies from "js-cookie";
import axios from "axios";
import BaseUrl from "../../Api/baseurl";
import { set } from "date-fns/set";
import Swal from "sweetalert2";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { IoArrowForward } from "react-icons/io5";
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-root": {
    border: "none",
  },
  "& .MuiDataGrid-cell": {
    borderBottom: "1px solid #e0e0e0",
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#f5f5f5",
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: "1px solid #e0e0e0",
  },
}));

const CustomToolbar = () => (
  <GridToolbarContainer>
    <div className=" ">
      {/* <GridToolbarQuickFilter className='pt-2 min-w-[320px]' /> */}
    </div>
    {/* <GridToolbarFilterButton /> */}
    {/* <GridToolbarExport /> */}
  </GridToolbarContainer>
);

const DashBoard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [rows, setRows] = useState([]);
  const [rowss, setRowss] = useState([]);
  const [count, setCount] = useState("");
  const [info, setInfo] = useState([]);
  const [issuperuser, setIsSuperuser] = useState(false);
  const [isstaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [data, setData] = useState([]);
  const [patient, setPatient] = useState([]);
  const [appointment, setAppointment] = useState([]);
  const [doctor, setDoctor] = useState([]);

  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);
  const [piebooked, setPiebooked] = useState([]);
  const [piecancelled, setPiecancelled] = useState([]);
  const [pieavailable, setPieavailable] = useState([]);
  const [weeklydata, setWeeklydata] = React.useState({
    dates: [],
    booked: [],
    available: [],
    cancelled: [],
  });
  const navigate = useNavigate();
  let infoData = useRef();

  useEffect(() => {
    const getGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        return "Good Morning";
      } else if (currentHour < 16) {
        return "Good Afternoon";
      } else {
        return "Good Evening";
      }
    };
    setGreeting(getGreeting());
    getData();
  }, []);

  useEffect(() => {
    const Suser = Cookies.get("is_superuser");
    const Staff = Cookies.get("is_staff");
    const Vendor = Cookies.get("is_vendor");
    setIsSuperuser(Cookies.get("is_superuser") === "true");
    setIsVendor(Cookies.get("is_vendor") === "true");
    setIsStaff(Cookies.get("is_staff") === "true");
    getgraphdata();
    getweeklydata();

    if (Suser === "true") {
      fetchAdminData();
    } else if (Staff === "true" && Vendor === "false" && Suser === "false") {
      fetchDoctorData();
    } else if (Vendor === "true") {
      fetchVendorData();
    } else {
      console.log("No specific user role detected");
    }
  }, []);

  const getData = async () => {
    const token = Cookies.get("token");

    try {
      let response;

      response = await axios.get(`${BaseUrl}clinic/booking/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setInfo(response.data);
      infoData.current = response.data;
      setDataWithSerialNumbers(response.data.todays_appointments);
      setDataWithSerialNumberss(response.data.cancelled_appointments);
      setCount(response.data.total_appointments);
      setPatient(response.data.total_patients);
      setAppointment(response.data.total_appointments);
      setDoctor(response.data.total_doctors);
      setStaff(response.data.staff);
      setDepartments(response.data.departments);
      setLocations(response.data.locations);
      setServices(response.data.services);
      // console.log(response.data.staff);
    } catch (error) {
      console.error(error);
    }
  };

  const getweeklydata = async () => {
    const token = Cookies.get("token");

    try {
      const response = await axios.get(`${BaseUrl}clinic/weekly-graphs/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setWeeklydata(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getgraphdata = async () => {
    const token = Cookies.get("token");

    try {
      const response = await axios.get(`${BaseUrl}clinic/graphs/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setPiebooked(response.data.confirmed_appointments);
      setPiecancelled(response.data.cancelled_appointments);
      setPieavailable(
        response.data.total_sub_slots - response.data.confirmed_appointments
      );
    } catch (error) {
      console.error(error);
    }
  };
  const fetchAdminData = async () => {
    const token = Cookies.get("token");
    const apiUrl = `${BaseUrl}clinic/admin/`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setData(response.data);
      // console.log(response.data);
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
        if (issuperuser) {
          navigate("/admin/login");
        } else if (isVendor) {
          navigate("/vendor/login");
        } else {
          navigate("/doctor/login");
        }
      }
    }
  };

  const fetchDoctorData = async () => {
    const token = Cookies.get("token");
    const username = Cookies.get("username");
    const apiUrl = `${BaseUrl}clinic/staff-list/${username}`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchVendorData = async () => {
    const token = Cookies.get("token");
    const username = Cookies.get("username");
    const apiUrl = `${BaseUrl}clinic/vendor-profile/${username}`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setData(response.data);
      // console.log(response.data);
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
        if (issuperuser) {
          navigate("/admin/login");
        } else if (isVendor) {
          navigate("/vendor/login");
        } else {
          navigate("/doctor/login");
        }
      }
    }
  };

  const setDataWithSerialNumbers = (data) => {
    const dataWithSerialNumbers = data.map((item, index) => ({
      ...item,
      __serialNumber: index + 1,
    }));
    setRows(dataWithSerialNumbers);
  };

  const setDataWithSerialNumberss = (data) => {
    const sortedData = _.orderBy(data, ["date"], ["asc"]);
    const dataWithSerialNumbers = data.map((item, index) => ({
      ...item,
      __serialNumber: index + 1,
    }));
    setRowss(dataWithSerialNumbers);
  };

  const columns = [
    {
      field: "serialNumber",
      headerName: "Sr. No.",
      width: 70,
      // height: 50,
      renderCell: (params) => <div>{params.row.__serialNumber}</div>,
    },
    // { field: 'id', headerName: 'ID', width: 90 },
    { field: "name", headerName: "Patient Name", width: 130 },
    { field: "date", headerName: "Date", width: 100 },
    { field: "age", headerName: "Age", width: 60 },
    { field: "time", headerName: "Slot", width: 120 },
  ];

  return (
    <div className="py-8 px-8 w-full md:w-[80%] xl:w-full">
      {issuperuser ? (
        <AdminSearch />
      ) : isVendor && !isstaff ? (
        <VendorSearch />
      ) : isVendor && isstaff ? (
        <DoctorSearch />
      ) : isstaff && !isVendor ? (
        <DoctorSearch />
      ) : null}

      <div className="flex flex-col lg:flex-row  px-2 py-6">
        <div className="w-full bg-[#ffffff]  ">
          <div className="relative ">
            <img
              src="/assets/Admin/Dashboard/image1.png"
              className=" w-full h-[240px] lg:h-[380px]"
              alt=""
            />
            {data && (
              <div className="absolute top-[30px] ml-8 font-semibold text-white text-xl lg:text-3xl">
                {greeting}{" "}
                <span className=" text-3xl lg:text-5xl font-bold">
                  {data.fname}
                </span>
              </div>
            )}

            {/* <div className="absolute top-[145px] lg:top-[185px] ml-8 font-bold text-white text-4xl lg:text-6xl">
              {count}
            </div> */}

            <div className="absolute top-[90px] lg:top-[120px] ml-8 font-semibold text-white text-xl lg:text-3xl">
            <span className="text-4xl lg:text-6xl font-bold">{count}{" "}</span>
               Visits for{" "}
              <span className="text-3xl lg:text-5xl font-bold">Today</span>
            </div>
            {/* <div className="absolute top-[145px] lg:top-[185px] ml-8 font-bold text-white text-4xl lg:text-6xl">
              {count}
            </div> */}
            {/* <div className="hidden sm:block  absolute w-[170px] md:w-[150px] lg:w-[170px] h-[90px] md:h-auto lg:h-[100px] bg-[white] opacity-45  top-[140px] ml-32 md:top-[140px] md:ml-24 lg:top-[195px] lg:ml-40 rounded-xl ">
              <div className="!opacity-100 p-2">
                <text className="font-bold text-white-900 !opacity-100 text-lg ">
                  New Patients
                </text>
              </div>
              <div className="text-white-900 font-bold text-2xl pl-2 opacity-100">
                40
              </div>
              <div className="flex px-1.5 items-center font-bold absolute left-[100px] md:left-[55px] lg:left-[100px] top-[45px] md:top-[35px] lg:top-[45px] text-[20px] pl-2 opacity-100 bg-[#DFFDDD] text-green-800 rounded-lg">
                51%
                <HiArrowTrendingUp className="font-bold text-[30px] pl-2 opacity-100" />
              </div>
            </div>

            <div className="hidden sm:block  absolute w-[170px] md:w-[150px] lg:w-[170px] h-[90px] md:h-auto lg:h-[100px] bg-[white] opacity-45  top-[140px] ml-[320px] md:top-[140px] md:ml-[260px] lg:top-[195px] lg:ml-[360px] rounded-xl ">
              <div className="!opacity-100 p-2">
                <text className="font-bold text-white-900 !opacity-100 text-lg ">
                  Old Patients
                </text>
              </div>
              <div className="text-white-900 font-bold text-2xl pl-2 opacity-100">
                64
              </div>
              <div className="flex px-1.5 items-center font-bold absolute left-[100px] md:left-[55px] lg:left-[80px] top-[45px] md:top-[35px] lg:top-[45px] text-[16px] pl-2 opacity-100 bg-[#FBC3C3] text-red-800 rounded-lg">
                20%
                <HiArrowTrendingDown className="font-bold text-[30px] pl-2 opacity-100" />
              </div>
            </div> */}

            {/* <div className="hidden sm:block  absolute w-[170px] md:w-[150px] lg:w-[140px] h-[90px] md:h-auto lg:h-[90px] bg-[white] opacity-45 top-[130px] ml-[320px]  sm:top-[135px] sm:ml-[320px] md:top-[130px] md:ml-[260px] lg:top-[205px] lg:ml-[355px] rounded-xl">
              <div className=" !opacity-100 p-2">
                <text className="font-bold text-white-900 !opacity-100 text-md ">
                  Old Patients
                </text>
              </div>
              <div className="text-white-900 font-bold text-2xl pl-2 opacity-100">
                64
              </div>
              <div className="flex px-1.5 items-center font-bold absolute left-[70px] md:left-[55px] lg:left-[65px] top-[40px] pl-2 opacity-100 bg-[#FBC3C3] text-red-800 text-[15px] rounded-lg">
                20%
                <HiArrowTrendingDown className="font-bold text-[25px] pl-2 opacity-100" />
              </div>
            </div> */}

            {issuperuser || isVendor || isstaff ? (
              <div className=" hidden xl:flex absolute md:top-[20px] md:right-[30px]">
                {/* <CalendarSelect /> */}
                <PieChart
                  series={[
                    {
                      innerRadius: 40,
                      outerRadius: 120,
                      paddingAngle: 4,
                      cornerRadius: 5,
                      startAngle: -45,
                      endAngle: 225,

                      data: [
                        {
                          id: 0,
                          value: piebooked,
                          color: "#b5afae",
                          label: "Booked",
                        },
                        {
                          id: 1,
                          value: pieavailable,
                          color: "#2756f2",
                          label: "Available",
                        },
                        {
                          id: 2,
                          value: piecancelled,
                          color: "#e82b0e",
                          label: "Cancelled",
                        },
                      ],
                    },
                  ]}
                  width={430}
                  height={350}
                  slotProps={{
                    legend: { labelStyle: { fontWeight: 500, fill: "white" } },
                  }}
                />
              </div>
            ) : null}
          </div>
          {issuperuser || isVendor ? (
            <div className="grid grid-cols-3 gap-4 my-4">
              <div className="col-span-full lg:col-span-2 xl:col-span-1 flex flex-col gap-3 max-h-[480px] ">
                <div className="w-full flex items-center justify-start">
                  <p className="text-3xl font-bold">Staff Members</p>
                </div>
                <div className="flex flex-col gap-4 max-h-[480px] overflow-y-auto scrollable">
                  {staff.length > 0
                    ? staff.map((item, intex) => {
                        return (
                          <div
                            key={item.id}
                            className="w-full flex items-center justify-around gap-3 px-3 py-4 bg-gray-400 rounded-xl"
                          >
                            <img
                              className="h-[100px] w-[100px] rounded-full"
                              src={
                                "http://doctor-appointment-software.logicspice.com/Backend/media/"+
                                item.image
                              }
                              alt={`${item.fname} ${item.lname}`}
                            />
                            <div className="flex flex-col items-start justify-start bg-gray-200 p-3 rounded-xl">
                              <p className="text-xl font-bold">
                                {item.fname} {item.lname}
                              </p>
                              <p className="text-md font-medium">{item.role}</p>
                              <p className="text-sm font-bold">
                                {item.location}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    : null}

                  {/* <div className="w-full flex items-center justify-around gap-3 px-3 py-4 bg-gray-400 rounded-xl">
                    <img
                      className="h-[100px] w-[100px] rounded-full"
                      src="/assets/Admin/Staff/staff2.png"
                      alt=""
                    />
                    <div className="flex flex-col items-start justify-start bg-gray-200 p-3 rounded-xl">
                      <p className="text-xl font-bold">Ryan Gouse</p>
                      <p className="text-md font-medium">Heart Specialist</p>
                      <p className="text-sm font-bold">Pratap Nagar</p>
                    </div>
                  </div>

                  <div className="w-full flex items-center justify-around gap-3 px-3 py-4 bg-gray-400 rounded-xl">
                    <img
                      className="h-[100px] w-[100px] rounded-full"
                      src="/assets/Admin/Staff/staff4.png"
                      alt=""
                    />
                    <div className="flex flex-col items-start justify-start bg-gray-200 p-3 rounded-xl">
                      <p className="text-xl font-bold">Leo Arcand</p>
                      <p className="text-base font-medium">Eye Specialist</p>
                      <p className="text-sm font-bold">Mansarovar</p>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="col-span-full lg:col-span-1 flex flex-col gap-3 items-center justify-center">
                <div className="bg-[#1476f7] w-full h-2/5 flex flex-col gap-3 items-center justify-center rounded-lg p-3">
                  <p className="text-3xl font-extrabold text-white">
                    Departments
                  </p>
                  <div className="flex flex-col bg-[#6babff] py-2.5 px-4 xl:px-12 rounded-xl justify-start items-center gap-2 overflow-y-auto min-w-4/5 scrollable">
                    {departments.length > 0
                      ? departments.map((item, index) => {
                          return (
                            <p className="text-base font-bold text-center">
                              {item.name}
                            </p>
                          );
                        })
                      : null}
                  </div>
                </div>
                <div className="bg-[#0ddb3a] w-full h-3/5 flex flex-col gap-3 items-center justify-center rounded-lg p-3">
                  <p className="text-4xl font-extrabold text-white">
                    Locations
                  </p>
                  <div className="flex flex-col bg-[#74fc92] py-4 px-4 xl:px-12  rounded-xl justify-start items-center gap-2 !max-h-[180px] overflow-y-auto min-w-4/5 scrollable">
                    {locations.length > 0
                      ? locations.map((item, index) => {
                          return (
                            <p className="text-base font-bold text-center">
                              {item.name}
                            </p>
                          );
                        })
                      : null}
                  </div>
                </div>
              </div>
              <div className="px-4 col-span-full lg:col-span-2 xl:col-span-1 flex flex-col gap-4 justify-center items-center bg-[#fcc479] py-5 lg:py-0 rounded-xl">
                <p className="text-5xl font-extrabold text-white">Services</p>
                <div className="flex flex-col bg-[#ffead6] justify-start items-start py-4 px-2 xl:px-12 rounded-xl gap-2 !max-h-[340px] overflow-y-auto min-w-4/5 scrollable">
                  {services.length > 0
                    ? services.map((item, index) => {
                        return (
                          <li className="text-base font-bold p-1 !text-start">
                            {item.name}
                          </li>
                        );
                      })
                    : null}
                </div>
              </div>
            </div>
          ) : null}

          <div className=" pt-4 font-semibold text-xl">Appointment Chart</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* <div className="bg-[#0E3A53] h-[162px] rounded-[15px] ">
              <div className="flex flex-row p-3  space-x-2 text-white ">
                <div>
                  <img
                    src="/assets/Admin/Dashboard/ac1.png"
                    alt=""
                    className="bg-[#ffffff] p-1 rounded-[8px] animate-move-up-down"
                  />
                </div>
                <div>
                  Attended
                  <br />
                  <span>45</span>
                </div>
                <div>
                  Remaining
                  <br />
                  <span>05</span>
                </div>
              </div>
              <div className="text-white pl-3 text-lg font-semibold">
                <div>Video Consultation</div>
                <div>Appointment</div>
              </div>
            </div>
            <div className="bg-[#F16163] h-[162px] rounded-[15px]">
              <div className="flex flex-row p-3  space-x-2 text-white">
                <div>
                  <img
                    src="/assets/Admin/Dashboard/ac2.png"
                    alt=""
                    className="bg-[#ffffff] p-1 rounded-[8px] animate-move-up-down"
                  />
                </div>
                <div>
                  Attended
                  <br />
                  <span>49</span>
                </div>
                <div>
                  Remaining
                  <br />
                  <span>01</span>
                </div>
              </div>
              <div className="text-white pl-3 text-lg font-semibold">
                <div>Chat Consultation</div>
                <div>Appointment</div>
              </div>
            </div>
            <div className="bg-[#1030A4] h-[162px] rounded-[15px]">
              <div className="flex flex-row p-3  space-x-2 text-white">
                <div>
                  <img
                    src="/assets/Admin/Dashboard/ac3.png"
                    alt=""
                    className="bg-[#ffffff] p-1 rounded-[8px] animate-move-up-down"
                  />
                </div>
                <div>
                  Attended
                  <br />
                  <span>123</span>
                </div>
                <div>
                  Remaining
                  <br />
                  <span>09</span>
                </div>
              </div>
              <div className="text-white pl-3 text-lg font-semibold">
                <div>Clinic Consultation</div>
                <div>Appointment</div>
              </div>
            </div> */}
            <div className="col-span-full w-[100%]">
              <BarChart
                xAxis={[
                  {
                    barGapRatio: 0.3,
                    scaleType: "band",
                    data: weeklydata.dates,
                    label: "Date",
                    labelStyle: { fontWeight: 600 },
                  },
                ]}
                yAxis={[
                  {
                    label: "No. of appointments",
                    labelStyle: { fontWeight: 600 },
                  },
                ]}
                series={[
                  { data: weeklydata.booked, label: "Booked" },
                  { data: weeklydata.available, label: "Available" },
                  { data: weeklydata.cancelled, label: "Cancelled" },
                ]}
                // slotProps={{
                //   legend: {
                //   },
                // }}
                height={400}
              />
            </div>
          </div>
          <div className="grid grid-rows-2 lg:grid-cols-2 gap-4">
            <div className=" grid grid-cols-1">
              <div className="flex  py-4 font-semibold text-xl place-content-between">
                <div> Today's Appointments </div>
                {/* <div><IoIosMore className="text-3xl text-[#1030A4]" /></div> */}
              </div>

              <div className="bg-white ">
                <Box sx={{ width: 1 }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    localeText={{
                      noRowsLabel: "No record is available.",
                    }}
                    initialState={{
                      // ...data.initialState,
                      pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    sx={{
                      minHeight: 370,
                      "& .MuiDataGrid-columnHeaders": {
                        color: "black",
                        fontSize: "16px",
                        fontWeight: "800",
                      },
                    }}
                    //  pageSizeOptions={[5, 10, 25]}
                    // slotProps={{
                    //     toolbar: {
                    //         showQuickFilter: true,
                    //     },
                    // }}
                  />
                </Box>
              </div>
            </div>
            <div className=" grid grid-cols-1">
              <div className="flex  py-4 font-semibold text-xl place-content-between">
                <div> Cancelled Appointments </div>
                {/* <div><IoIosMore className="text-3xl text-[#1030A4]" /></div> */}
              </div>

              <div className="bg-white ">
                <Box sx={{ width: 1 }}>
                  <DataGrid
                    rows={rowss}
                    columns={columns}
                    localeText={{
                      noRowsLabel: "No record is available.",
                    }}
                    initialState={{
                      // ...data.initialState,
                      pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    sx={{
                      minHeight: 370,
                      "& .MuiDataGrid-columnHeaders": {
                        color: "black",
                        fontSize: "16px",
                        fontWeight: "800",
                      },
                    }}
                    //  pageSizeOptions={[5, 10, 25]}
                    // slotProps={{
                    //     toolbar: {
                    //         showQuickFilter: true,
                    //     },
                    // }}
                  />
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
