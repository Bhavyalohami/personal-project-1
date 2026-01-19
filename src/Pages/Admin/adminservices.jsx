import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import AdminSearch from "../../Component/Admin/adminsearch";
import DoctorSearch from "../../Component/Doctor/doctorsearch";
import VendorSearch from "../../Component/Vendor/vendorsearch";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import axios from "axios";
import ServiceModal from "./Viewmodals/viewservice";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { FaBan, FaCheck } from "react-icons/fa";
import BaseUrl from "../../Api/baseurl";
import Tooltip from "@mui/material/Tooltip";
import Breadcrumbs from "@mui/material/Breadcrumbs";

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
    <GridToolbarQuickFilter className="pt-2 min-w-[320px]" />
  </GridToolbarContainer>
);

const AdminServices = () => {
  const [openModal, setOpenModal] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [rows, setRows] = useState([]);
  const [servicee, setServicee] = useState([]);
  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [subRoles, setSubRoles] = useState([]);

  const handleSubRoles = () => {
    const subroles = Cookies.get("subroles");
    if (subroles) {
      const parsedSubRoles = JSON.parse(subroles);
      const role = parsedSubRoles.find((role) => role.roleId === "8");
      if (role) {
        setSubRoles(role.subroles);
      }
    }
  };
  // Example function to set rows with serial numbers
  const setDataWithSerialNumbers = (data) => {
    const dataWithSerialNumbers = data.map((item, index) => ({
      ...item,
      __serialNumber: index + 1, // Serial number starts from 1
    }));
    setRows(dataWithSerialNumbers);
  };

  const getData = async () => {
    const apiUrl = `${BaseUrl}clinic/services-list/`;
    const token = Cookies.get("token");
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setDataWithSerialNumbers(response.data);
      setServices(response.data, "data");
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
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

  useEffect(() => {
    setIsSuperuser(Cookies.get("is_superuser") === "true");
    setIsStaff(Cookies.get("is_staff") === "true");
    setIsVendor(Cookies.get("is_vendor") === "true");
    getData();
    handleSubRoles();
  }, []);

  const handleOpenModal = (service) => {
    setSelectedService(service);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedService(null);
  };

  // Columns definition (without useMemo)
  const columns = [
    {
      field: "serialNumber",
      headerName: "Sr.No.",
      width: 30,
      renderCell: (params) => <div>{params.row.__serialNumber}</div>,
    },
    { field: "name", headerName: "Service Name", width: 180 },
    { field: "text", headerName: "Description", width: 300 },
    { field: "date", headerName: "Created Date", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div className="flex space-x-4 items-center content-center justify-center mt-2">
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
                    ? `/admin/services/editservices/${params.row.id}`
                    : isVendor
                    ? `/vendor/services/editservices/${params.row.id}`
                    : `/doctor/services/editservices/${params.row.id}`
                }
                className="text-[32px]"
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
          {subRoles.includes(7) && (
            <button
              onClick={() =>
                handleStatusToggle(params.row.id, params.row.status)
              }
            >
              {params.row.status ? (
                <Tooltip title="Deactivate">
                  <Link className="text-[32px]">
                    <FaCheck className="bg-green-700 p-1  text-white rounded" />
                  </Link>
                </Tooltip>
              ) : (
                <Tooltip title="Activate">
                  <Link className="text-[32px]">
                    <FaBan className="bg-red-700 p-1  text-white rounded" />
                  </Link>
                </Tooltip>
              )}
            </button>
          )}
        </div>
      ),
    },
  ];

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
        // Perform the delete request
        const token = Cookies.get("token");
        // const token = localStorage.getItem("auth_token");

        await axios.delete(`${BaseUrl}clinic/delete-services/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Fetch updated data
        getData();

        // Show success message
        Swal.fire({
          title: "Success!",
          text: "Service details have been deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });

      } catch (error) {
        // Show error message
        Swal.fire({
          title: "Error!",
          text: `There was an issue deleting your service details: ${error.message}`,
          icon: "error",
          confirmButtonText: "OK",
        });

        console.error("Failed to delete service:", error);
      }
    } else {
      console.log("Deletion cancelled.");
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus ? 0 : 1; // Toggle status
    try {
      await axios.patch(`${BaseUrl}clinic/services-list/${id}/toggle-status/`, {
        status: newStatus,
      });

      // Update the status in the local state
      // setServicee(servicee.map(member =>
      //     member.id === id ? { ...member, status: newStatus } : member
      // ));
      getData();
      Swal.fire({
        title: "Success!",
        text: `Service status has been ${
          newStatus === 1 ? "activated Successfully" : "deactivated Successfully"
        }.`,
        icon: "success",
        confirmButtonText: "OK",
      });
      getData();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `There was an issue updating the service status: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
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
            Manage Services
          </Link>
        </Breadcrumbs>
      </div>
      <div className="w-full bg-[#F2F2F2] px-4 py-4 mt-3">
        <div className="flex items-center justify-between pb-4">
          <text className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Manage Services
          </text>
          {subRoles.includes(1) && (
            <Link
              to={
                isSuperuser
                  ? "/admin/services/addservices"
                  : isVendor
                  ? "/vendor/services/addservices"
                  : "/doctor/services/addservices"
              }
              className="font-nunito-sans text-14px font-bold leading-27px text-[#ffffff] bg-[#4379EE] py-3 px-4 rounded-lg text-center"
            >
              Add Service
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
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[5, 10, 25]}
            />
          </Box>
        </div>
      </div>
      {selectedService && (
        <ServiceModal
          open={openModal}
          onClose={handleCloseModal}
          service={selectedService}
        />
      )}
    </div>
  );
};

export default AdminServices;
