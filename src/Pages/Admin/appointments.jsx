import * as React from "react";
import { useState } from "react";
import AppointmentModal from "./Viewmodals/viewappointments";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import AdminSearch from "../../Component/Admin/adminsearch";
import DoctorSearch from "../../Component/Doctor/doctorsearch";
import VendorSearch from "../../Component/Vendor/vendorsearch";
import { MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";
import Tooltip from "@mui/material/Tooltip";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";
import { useEffect } from "react";
import { FaBan } from "react-icons/fa";
import LoaderH from "../../Component/Loader/loader";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { BiSolidUserDetail } from "react-icons/bi";

// Custom styles for DataGrid

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

// Custom Toolbar component
const CustomToolbar = () => (
  <GridToolbarContainer>
    <div className=" ">
      <GridToolbarQuickFilter className="pt-2 min-w-[320px]" />
    </div>
    {/* <GridToolbarFilterButton /> */}
    {/* <GridToolbarExport /> */}
  </GridToolbarContainer>
);

export default function Appointments() {
  const [openModal, setOpenModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rows, setRows] = useState([]);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const navigate = useNavigate();
  const [subRoles, setSubRoles] = useState([]);

  const handleSubRoles = () => {
    const subroles = Cookies.get("subroles");
    if (subroles) {
      const parsedSubRoles = JSON.parse(subroles);
      const role = parsedSubRoles.find((role) => role.roleId === "4");
      if (role) {
        setSubRoles(role.subroles);
      }
    }
  };
  useEffect(() => {
    const superuser = Cookies.get("is_superuser") === "true";
    const staff = Cookies.get("is_staff") === "true";
    const vendor = Cookies.get("is_vendor") === "true";
    setIsSuperuser(superuser);
    setIsStaff(staff);
    setIsVendor(vendor);
    getData();
    handleSubRoles();
  }, [isSuperuser]);

  const getData = async () => {
    const username = Cookies.get("username");
    const apiUrl = `${BaseUrl}clinic/booking`;

    const token = Cookies.get("token");
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setDataWithSerialNumbers(response.data.appointments);
      setAppointments(response.data, "data");
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
      // console.log(error.code);

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

  const setDataWithSerialNumbers = (data) => {
    const dataWithSerialNumbers = data.map((item, index) => ({
      ...item,
      __serialNumber: index + 1,
    }));

    setRows(dataWithSerialNumbers);
  };

  const handleOpenModal = (service) => {
    setSelectedAppointment(service);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAppointment(null);
  };
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const token = Cookies.get("token");
        await axios.delete(`${BaseUrl}clinic/delete-booking/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });
        setLoading(false);
        Swal.fire({
          title: "Success!",
          text: "Your Appointment has been deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        getData();
        // console.log(`Deleted contact with id: ${id}`);
      } catch (error) {
        // Show error message
        Swal.fire({
          title: "Error!",
          text: `There was an issue deleting your Appointment: ${error.message}`,
          icon: "error",
          confirmButtonText: "OK",
        });
        console.log("Failed to delete blog:", error);
      }
    } else {
      console.log("Deletion cancelled.");
    }
  };

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure, you want to cancel the Appointment?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const token = Cookies.get("token");
        await axios.post(`${BaseUrl}clinic/cancel-booking/${id}/`, id, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });
        setLoading(false);
        Swal.fire({
          title: "Success!",
          text: "Your Appointment has been cancelled successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        getData();
      } catch (error) {
        // Show error message
        Swal.fire({
          title: "Error!",
          text: `There was an issue cancelling your Appointment: ${error.message}`,
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Failed to delete blog:", error);
      }
    } else {
      console.log("Deletion cancelled.");
    }
  };

  // const columns = [
  //   {
  //     field: "serialNumber",
  //     headerName: "Sr.No.",
  //     width: 30,
  //     renderCell: (params) => <div>{params.row.__serialNumber}</div>,
  //   },
  //   // { field: "id", headerName: "ID", width: 90 },
  //   { field: "name", headerName: "Patient Name", width: 110 },
  //   { field: "date", headerName: "Appointment Date", width: 130 },
  //   { field: "age", headerName: "Age", width: 80 },
  //   { field: "time", headerName: "Slot", width: 120 },
  //   {
  //     field: "actions",
  //     headerName: "Actions",
  //     width: 180,
  //     renderCell: (params) => (
  //       <div className="flex space-x-4 items-center justify-center mt-2">
  //         {subRoles.includes(4) && (
  //           <Tooltip title="View">
  //             <button
  //               onClick={() => handleOpenModal(params.row)}
  //               className="text-[32px]"
  //             >
  //               <IoMdEye className="bg-[#1030A4] p-0.5 text-white rounded" />
  //             </button>
  //           </Tooltip>
  //         )}
  //         {subRoles.includes(2) && (
  //           <Tooltip title="Edit">
  //             <Link
  //               to={
  //                 isSuperuser
  //                   ? `/admin/appointments/editappointments/${params.row.id}`
  //                   : isVendor
  //                   ? `/vendor/appointments/editappointments/${params.row.id}`
  //                   : `/doctor/appointments/editappointments/${params.row.id}`
  //               }
  //               className={`text-[32px] ${
  //                 params.row.status !== "confirmed"
  //                   ? "cursor-not-allowed opacity-50"
  //                   : ""
  //               }`}
  //               onClick={(e) => {
  //                 if (params.row.status !== "confirmed") {
  //                   e.preventDefault();
  //                 }
  //               }}
  //             >
  //               <MdEdit className="bg-[#0E3A53] p-0.5 text-white rounded" />
  //             </Link>
  //           </Tooltip>
  //         )}
  //         {subRoles.includes(3) && (
  //           <Tooltip title="Delete">
  //             <button
  //               onClick={() => handleDelete(params.row.id)}
  //               className="text-[32px]"
  //             >
  //               <MdDelete className="bg-[#F16163] p-0.5 text-white rounded" />
  //             </button>
  //           </Tooltip>
  //         )}
  //         {subRoles.includes(5) && (
  //           <Tooltip title="Cancel">
  //             <button
  //               onClick={() => handleCancel(params.row.id)}
  //               className={`text-[32px] ${
  //                 params.row.status !== "confirmed"
  //                   ? "cursor-not-allowed opacity-50"
  //                   : ""
  //               }`}
  //               disabled={params.row.status !== "confirmed"}
  //             >
  //               <FaBan className="bg-gray-700 p-1 text-white rounded" />
  //             </button>
  //           </Tooltip>
  //         )}
  //       </div>
  //     ),
  //   },

  //   {subRoles.includes(11) &&

  //     field: "patientdetails",
  //     headerName: "Patient Details",
  //     width: 120,
  //     renderCell: (params) => (
  //       <div className="flex items-center justify-center h-full">

  //           (params.row.is_patient === true ? (
  //             <Tooltip title="Patient Details">
  //               <Link
  //                 to={
  //                   isSuperuser
  //                     ? `/admin/appointments/patientdetails/${params.row.patient}`
  //                     : isVendor
  //                     ? `/vendor/appointments/patientdetails/${params.row.patient}`
  //                     : `/doctor/appointments/patientdetails/${params.row.patient}`
  //                 }
  //                 className="text-[32px]"
  //               >
  //                 <BiSolidUserDetail className="bg-gray-500 p-0.5 text-white rounded" />
  //               </Link>
  //             </Tooltip>
  //           {/* ) : (
  //             <p className="text-gray-500 font-semibold">Guest</p>
  //           ))} */}
  //       </div>
  //     ),
  //   },

  // ];
  const columns = [
    {
      field: "serialNumber",
      headerName: "Sr.No.",
      width: 30,
      renderCell: (params) => <div>{params.row.__serialNumber}</div>,
    },
    // { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Patient Name", width: 110 },
    { field: "date", headerName: "Appointment Date", width: 130 },
    { field: "age", headerName: "Age", width: 80 },
    { field: "time", headerName: "Slot", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <div className="flex space-x-4 items-center justify-center mt-2">
          {subRoles.includes(4) && (
            <Tooltip title="View">
              <button
                onClick={() => handleOpenModal(params.row)}
                className="text-[32px]"
              >
                <IoMdEye className="bg-[#1030A4] p-0.5 text-white rounded" />
              </button>
            </Tooltip>
          )}
          {subRoles.includes(2) && (
            <Tooltip title="Edit">
              <Link
                to={
                  isSuperuser
                    ? `/admin/appointments/editappointments/${params.row.id}`
                    : isVendor
                    ? `/vendor/appointments/editappointments/${params.row.id}`
                    : `/doctor/appointments/editappointments/${params.row.id}`
                }
                className={`text-[32px] ${
                  params.row.status !== "confirmed"
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                onClick={(e) => {
                  if (params.row.status !== "confirmed") {
                    e.preventDefault();
                  }
                }}
              >
                <MdEdit className="bg-[#0E3A53] p-0.5 text-white rounded" />
              </Link>
            </Tooltip>
          )}
          {subRoles.includes(3) && (
            <Tooltip title="Delete">
              <button
                onClick={() => handleDelete(params.row.id)}
                className="text-[32px]"
              >
                <MdDelete className="bg-[#F16163] p-0.5 text-white rounded" />
              </button>
            </Tooltip>
          )}
          {subRoles.includes(5) && (
            <Tooltip title="Cancel">
              <button
                onClick={() => handleCancel(params.row.id)}
                className={`text-[32px] ${
                  params.row.status !== "confirmed"
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                disabled={params.row.status !== "confirmed"}
              >
                <FaBan className="bg-gray-700 p-1 text-white rounded" />
              </button>
            </Tooltip>
          )}
        </div>
      ),
    },

    // Conditionally include the "Patient Details" column based on subRoles
    ...(subRoles.includes(11)
      ? [
          {
            field: "patientdetails",
            headerName: "Patient Details",
            width: 120,
            renderCell: (params) => (
              <div className="flex items-center justify-center h-full">
                {params.row.is_patient ? (
                  <Tooltip title="Patient Details">
                    <Link
                      to={
                        isSuperuser
                          ? `/admin/appointments/patientdetails/${params.row.patient}`
                          : isVendor
                          ? `/vendor/appointments/patientdetails/${params.row.patient}`
                          : `/doctor/appointments/patientdetails/${params.row.patient}`
                      }
                      className="text-[32px]"
                    >
                      <BiSolidUserDetail className="bg-gray-500 p-0.5 text-white rounded" />
                    </Link>
                  </Tooltip>
                ) : (
                  <p className="text-gray-500 font-semibold">Guest</p>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  function handleBreadClick(event) {
    event.preventDefault();
  }
  return (
    <>
      {loading ? (
        <LoaderH />
      ) : (
        <div className="py-8 px-8 w-full md:max-w-[80%] xl:w-full">
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
                Appointments
              </Link>
            </Breadcrumbs>
          </div>
          <div className="w-full min-h-screen bg-[#F2F2F2] px-4 py-4 mt-3 ">
            <div className="flex items-center justify-between pb-4">
              <text className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
                Appointments
              </text>
              {subRoles.includes(1) && (
                <Link
                  to={
                    isSuperuser
                      ? "/admin/appointments/addappointments"
                      : isVendor
                      ? "/vendor/appointments/addappointments"
                      : "/doctor/appointments/addappointments"
                  }
                  className="font-nunito-sans text-14px font-bold leading-27px text-[#ffffff] bg-[#4379EE] py-3 px-4 rounded-lg text-center"
                >
                  Add Appointment
                </Link>
              )}
            </div>
            <div className="bg-white">
              <Box sx={{ width: 1 }}>
                <StyledDataGrid
                  rows={rows}
                  columns={columns}
                  slots={{ toolbar: CustomToolbar }}
                  initialState={{
                    ...appointments.initialState,
                    pagination: { paginationModel: { pageSize: 10 } },
                  }}
                  pageSizeOptions={[5, 10, 25]}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                    },
                  }}
                />
              </Box>
            </div>
          </div>
          {selectedAppointment && (
            <AppointmentModal
              open={openModal}
              onClose={handleCloseModal}
              service={selectedAppointment}
            />
          )}
        </div>
      )}
    </>
  );
}
