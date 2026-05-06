import React, { useState } from "react";
import ModernDataGrid, { ModernDataGridToolbar } from "../../Component/Table/ModernDataGrid";
import AdminSearch from "../../Component/Admin/adminsearch";
import DoctorSearch from "../../Component/Doctor/doctorsearch";
import VendorSearch from "../../Component/Vendor/vendorsearch";
import { MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import BlogCategoryModal from "./Viewmodals/viewblogcategory";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";
import Tooltip from "@mui/material/Tooltip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { FaBan, FaCheck } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const StyledDataGrid = ModernDataGrid;

const CustomToolbar = ModernDataGridToolbar;
const ManageBlogCategories = () => {
  const [, setBlogCategory] = useState([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);
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
      const role = parsedSubRoles.find((role) => role.roleId === "18");
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
    const apiUrl = `${BaseUrl}clinic/manageblogcategories/`;

    const token = Cookies.get("token");

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setDataWithSerialNumbers(response.data);
      setBlogCategory(response.data);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        await axios.delete(`${BaseUrl}clinic/delete-blogcategories/${id}/`, {
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
          text: "Blog Category has been deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        // Show error message
        Swal.fire({
          title: "Error!",
          text: `There was an issue deleting the Blog Category: ${error.message}`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handletogglestatus = async (id, currentStatus) => {
    const newstatus = currentStatus ? 0 : 1;
    try {
      const apiUrl = `${BaseUrl}clinic/manageblogcategories/${id}/toggle-status/`;
      await axios.patch(apiUrl, {
        status: newstatus,
      });
      getData();
      Swal.fire({
        title: "Success!",
        text: `Blog Category status has been ${
          newstatus === 1
            ? "activated Successfully"
            : "deactivated Successfully"
        }.`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `There was an issue updating the blog category taff status: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const columns = [
    {
      field: "serialNumber",
      headerName: "Sr.No.",
      width: 50,
      renderCell: (params) => <div>{params.row.__serialNumber}</div>,
    },
    { field: "name", headerName: "Blog Category Name", width: 200 },
    // {
    //   field: "text",
    //   headerName: "Description",
    //   width: 200,
    //   renderCell: (params) => <div>{parse(params.row.text)}</div>,
    // },
    // { field: "date", headerName: "Created Date", width: 110 },
    // {
    //   field: "image",
    //   headerName: "Image",
    //   width: 130,
    //   renderCell: (params) => (
    //     <img
    //       src={params.row.image}
    //       alt={params.row.image}
    //       className="w-[100px] h-[60px] "
    //     />
    //   ),
    // },
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
                <IoMdEye className="bg-[#0D9488] p-0.5 text-white rounded" />
              </button>
            </Tooltip>
          )}
          {subRoles.includes(2) && (
            <Tooltip title="Edit">
              <Link
                to={
                  isSuperuser
                    ? `/admin/blogcategories/editblogcategory/${params.row.id}`
                    : isVendor
                    ? `/vendor/blogcategories/editblogcategory/${params.row.id}`
                    : `/doctor/blogcategories/editblogcategory/${params.row.id}`
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
                <MdDelete className="bg-[#0D9488] p-0.5 text-white rounded" />
              </button>
            </Tooltip>
          )}
          {subRoles.includes(7) && (
            <button
              onClick={() =>
                handletogglestatus(params.row.id, params.row.status)
              }
            >
              {params.row.status ? (
                <Tooltip title="Deactivate">
                  <Link className="text-[32px]">
                    <FaCheck className="bg-green-700 p-1 text-white rounded" />
                  </Link>
                </Tooltip>
              ) : (
                <Tooltip title="Activate">
                  <Link className="text-[32px]">
                    <FaBan className="bg-red-700 p-1 text-white rounded" />
                  </Link>
                </Tooltip>
              )}
            </button>
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
            Manage Blog Categories
          </Link>
        </Breadcrumbs>
      </div>
      <div className="w-full bg-[#F2F2F2] px-4 py-4 mt-3">
        <div className="flex items-center justify-between pb-4">
          <span className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Manage Blog Categories
          </span>
          {subRoles.includes(1) && (
            <Link
              to={
                isSuperuser
                  ? "/admin/blogcategories/addblogcategory"
                  : isVendor
                  ? "/vendor/blogcategories/addblogcategory"
                  : "/doctor/blogcategories/addblogcategory"
              }
              className="font-nunito-sans text-14px font-bold leading-27px text-[#ffffff] bg-[#4379EE] py-3 px-4 rounded-lg text-center"
            >
              Add Blog Category
            </Link>
          )}
        </div>
        <div className=" bg-white">
          <div className="w-full">
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
          </div>
        </div>
      </div>

      {selectedService && (
        <BlogCategoryModal
          open={openModal}
          onClose={handleCloseModal}
          service={selectedService}
        />
      )}
    </div>
  );
};

export default ManageBlogCategories;
