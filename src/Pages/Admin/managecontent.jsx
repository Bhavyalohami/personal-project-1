import AdminSearch from "../../Component/Admin/adminsearch";
import DoctorSearch from "../../Component/Doctor/doctorsearch";
import VendorSearch from "../../Component/Vendor/vendorsearch";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";
import Swal from "sweetalert2";
import Tooltip from "@mui/material/Tooltip";
import parse from "html-react-parser";
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

const ManageContent = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [subRoles, setSubRoles] = useState([]);
  const handleSubRoles = () => {
    const subroles = Cookies.get("subroles");
    if (subroles) {
      const parsedSubRoles = JSON.parse(subroles);
      const role = parsedSubRoles.find((role) => role.roleId === "6");
      if (role) {
        setSubRoles(role.subroles);
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

  const getData = async () => {
    const apiUrl = `${BaseUrl}clinic/managepages/`;
    const token = Cookies.get("token");
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      // console.log("API Response:", response.data);
      setDataWithSerialNumbers(response.data);
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

  useEffect(() => {
    setIsSuperuser(Cookies.get("is_superuser") === "true");
    setIsStaff(Cookies.get("is_staff") === "true");
    setIsVendor(Cookies.get("is_vendor") === "true");
    getData();
    handleSubRoles();
  }, []);

  // Column definitions outside of useMemo
  const columns = [
    {
      field: "__serialNumber",
      headerName: "Sr.No.",
      width: 70,
      renderCell: (params) => <div>{params.row.__serialNumber}</div>,
    },
    { field: "title", headerName: "Page Name", width: 150 },
    {
      field: "content",
      headerName: "Content",
      width: 350,
      renderCell: (params) => <div>{parse(params.row.content)}</div>,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div className="flex space-x-4 items-center content-center justify-start mt-2">
          {subRoles.includes(2) && (
            <Tooltip title="Edit">
              <Link
                to={
                  isSuperuser
                    ? `/admin/managecontent/editcontent/${params.row.slug}/`
                    : isVendor
                    ? `/vendor/managecontent/editcontent/${params.row.slug}/`
                    : `/doctor/managecontent/editcontent/${params.row.slug}/`
                }
              >
                <MdEdit className="bg-[#0E3A53] p-0.5 text-[25px] text-white rounded" />
              </Link>
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
            Manage Content
          </Link>
        </Breadcrumbs>
      </div>
      <div className="w-full bg-[#F2F2F2] px-4 py-8 mt-3">
        <div className="flex items-center justify-between">
          <text className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Manage Content
          </text>
        </div>

        <div className="bg-white">
          <Box sx={{ width: 1 }}>
            <StyledDataGrid
              rows={rows}
              columns={columns}
              slots={{ toolbar: CustomToolbar }}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10, 25]}
            />
          </Box>
        </div>
      </div>
    </div>
  );
};

export default ManageContent;
