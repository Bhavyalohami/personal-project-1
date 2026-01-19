import * as React from "react";
import { useState } from "react";
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
import { MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import BlogModal from "./Viewmodals/viewblog";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";
import Tooltip from "@mui/material/Tooltip";
import parse from "html-react-parser";
import Breadcrumbs from "@mui/material/Breadcrumbs";

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
  </GridToolbarContainer>
);

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [subRoles, setSubRoles] = useState([]);

  const handleSubRoles = () => {
    const subroles = Cookies.get("subroles");
    if (subroles) {
      const parsedSubRoles = JSON.parse(subroles);
      const role = parsedSubRoles.find((role) => role.roleId === "7");
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
    const apiUrl = `${BaseUrl}clinic/blogs-list/`;

    const token = Cookies.get("token");

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setDataWithSerialNumbers(response.data);
      setBlogs(response.data);
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

  React.useEffect(() => {
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
        const token = Cookies.get("token");
        await axios.delete(`${BaseUrl}clinic/delete-blog/${id}/`, {
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
          text: "Blog has been deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        // Show error message
        Swal.fire({
          title: "Error!",
          text: `There was an issue deleting the Blog: ${error.message}`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const columns = [
    {
      field: "serialNumber",
      headerName: "Sr.No.",
      width: 30,
      renderCell: (params) => <div>{params.row.__serialNumber}</div>,
    },
    { field: "name", headerName: "Blog Title", width: 200 },
    {
      field: "text",
      headerName: "Description",
      width: 200,
      renderCell: (params) => <div>{parse(params.row.text)}</div>,
    },
    { field: "date", headerName: "Created Date", width: 110 },
    {
      field: "image",
      headerName: "Image",
      width: 130,
      renderCell: (params) => (
        <img
          src={params.row.image}
          alt={params.row.image}
          className="w-[100px] h-[60px] "
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
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
                    ? `/admin/blogs/editblogs/${params.row.id}`
                    : isVendor
                    ? `/vendor/blogs/editblogs/${params.row.id}`
                    : `/doctor/blogs/editblogs/${params.row.id}`
                }
                className="text-[32px] "
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
        </div>
      ),
    },
  ];
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
            Manage Blogs
          </Link>
        </Breadcrumbs>
      </div>
      <div className="w-full bg-[#F2F2F2] px-4 py-4 mt-3">
        <div className="flex items-center justify-between pb-4">
          <text className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Manage Blogs
          </text>
          {subRoles.includes(1) && (
            <Link
              to={
                isSuperuser
                  ? "/admin/blogs/addblogs"
                  : isVendor
                  ? "/vendor/blogs/addblogs"
                  : "/doctor/blogs/addblogs"
              }
              className="font-nunito-sans text-14px font-bold leading-27px text-[#ffffff] bg-[#4379EE] py-3 px-4 rounded-lg text-center"
            >
              Add Blog
            </Link>
          )}
        </div>
        <div className=" bg-white">
          <Box sx={{ width: 1 }}>
            <StyledDataGrid
              rows={rows}
              columns={columns}
              slots={{ toolbar: CustomToolbar }}
              initialState={{
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

      {selectedService && (
        <BlogModal
          open={openModal}
          onClose={handleCloseModal}
          service={selectedService}
        />
      )}
    </div>
  );
}
