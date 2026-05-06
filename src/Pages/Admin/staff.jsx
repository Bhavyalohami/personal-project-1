import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminSearch from "../../Component/Admin/adminsearch";
import { MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaBan } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import StaffModal from "./Viewmodals/viewstaff";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";
import DoctorSearch from "../../Component/Doctor/doctorsearch";
import VendorSearch from "../../Component/Vendor/vendorsearch";
import ModernDataGrid from "../../Component/Table/ModernDataGrid";
import Tooltip from "@mui/material/Tooltip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { MdOutlineAccountCircle } from "react-icons/md";
import { MdOutlineNoAccounts } from "react-icons/md";

const Staff = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [staff, setStaff] = useState([]);
  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [subRoles, setSubRoles] = useState([]);

  const handleSubRoles = () => {
    const subroles = Cookies.get("subroles");
    if (subroles) {
      const parsedSubRoles = JSON.parse(subroles);
      const role = parsedSubRoles.find((role) => role.roleId === "3");
      if (role) {
        setSubRoles(role.subroles);
      }
    }
  };

  const getData = async () => {
    const token = Cookies.get("token");
    // console.log(token, "staff");
    const apiUrl = `${BaseUrl}clinic/staff-list/`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      // console.log(response.data);
      setStaff(response.data, "data");
    } catch (error) {
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
    const token = Cookies.get("token");
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
        await axios.delete(`${BaseUrl}clinic/delete-staff/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Fetch updated data
        getData();
        Swal.fire({
          title: "Success!",
          text: "Staff has been deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });

        // console.log(`Deleted contact with id: ${id}`);
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: `There was an issue deleting Satff: ${error.message}`,
          icon: "error",
          confirmButtonText: "OK",
        });

        console.error("Failed to delete Staff:", error);
      }
    } else {
      console.log("Deletion cancelled.");
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus ? 0 : 1;
    try {
      await axios.patch(
        `${BaseUrl}clinic/staff-list/${id}/toggle-status/`,
        { status: newStatus }
        // { headers: { Authorization: `Token ${token}` } }
      );

      setStaff(
        staff.map((member) =>
          member.id === id ? { ...member, status: newStatus } : member
        )
      );

      Swal.fire({
        title: "Success!",
        text: `Staff status updated to ${
          newStatus === 1 ? "Active Doctor Profile" : "Deactive Doctor Profile"
        }.`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `There was an issue updating the staff status: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const handleAccountToggle = async (id, currentStatus) => {
    const token = Cookies.get("token");
    const newStatus = currentStatus ? 0 : 1;
    try {
      await axios.patch(
        `${BaseUrl}clinic/toggle-user-status/`,
        {
          staff_id: id,
          current_status: currentStatus,
        },
        { headers: { Authorization: `Token ${token}` } }
      );

      // console.log("User status updated successfully:", response.data);
      Swal.fire({
        title: "Success!",
        text: `Staff's Account status has been updated to ${
          newStatus === 1 ? "Active" : "Deactive"
        }.`,
        icon: "success",
        confirmButtonText: "OK",
      });
      getData();
    } catch (error) {
      console.error(
        "Error toggling user status:",
        error.response?.data || error.message
      );
      Swal.fire({
        title: "Error!",
        text: `There was an issue updating the Staff's Account status: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  function handleBreadClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }

  const columns = [
    {
      field: "fname",
      headerName: "Staff Member",
      minWidth: 260,
      flex: 1.1,
      renderCell: (params) => (
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={params.row.image || "/brand/doctor-avatar-teal.png"}
            alt={`${params.row.fname || ""} ${params.row.lname || ""}`.trim() || "Staff"}
            className="h-11 w-11 shrink-0 rounded-2xl object-cover"
          />
          <div className="min-w-0">
            <p className="truncate font-black text-[#134E4A]">
              {[params.row.fname, params.row.lname].filter(Boolean).join(" ") ||
                params.row.username ||
                "Staff"}
            </p>
            <p className="mt-1 truncate text-xs font-bold text-[#134E4A]/55">
              {params.row.username || "No username"}
            </p>
          </div>
        </div>
      ),
    },
    { field: "designation", headerName: "Designation", minWidth: 170, flex: 0.8 },
    { field: "email", headerName: "Email", minWidth: 230, flex: 1 },
    {
      field: "status",
      headerName: "Doctor Profile",
      minWidth: 150,
      flex: 0.65,
      renderCell: (params) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${
            params.row.status
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {params.row.status ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 220,
      sortable: false,
      renderCell: (params) => {
        const member = params.row;
        return (
          <div className="flex flex-wrap items-center gap-2">
            {subRoles.includes(2) && (
              <Tooltip title="Edit">
                <Link
                  to={
                    isSuperuser
                      ? `/admin/staff/editstaff/${member.id}/`
                      : isVendor
                      ? `/vendor/staff/editstaff/${member.id}/`
                      : `/doctor/staff/editstaff/${member.id}/`
                  }
                >
                  <MdEdit className="bg-[#0E3A53] text-white" />
                </Link>
              </Tooltip>
            )}
            {subRoles.includes(4) && (
              <Tooltip title="View">
                <button type="button" onClick={() => handleOpenModal(member)}>
                  <IoMdEye className="bg-[#0D9488] text-white" />
                </button>
              </Tooltip>
            )}
            {subRoles.includes(3) && (
              <Tooltip title="Delete">
                <button type="button" onClick={() => handleDelete(member.id)}>
                  <MdDelete className="bg-[#0D9488] text-white" />
                </button>
              </Tooltip>
            )}
            {subRoles.includes(7) && (
              <Tooltip
                title={
                  member.status ? "Deactivate Doctor Profile" : "Activate Doctor Profile"
                }
              >
                <button
                  type="button"
                  onClick={() => handleStatusToggle(member.id, member.status)}
                >
                  {member.status ? (
                    <FaCheck className="bg-emerald-600 text-white" />
                  ) : (
                    <FaBan className="bg-rose-600 text-white" />
                  )}
                </button>
              </Tooltip>
            )}
            {subRoles.includes(8) && member.is_staff === true && (
              <Tooltip title="Manage Roles">
                <Link
                  to={
                    isSuperuser
                      ? `/admin/staff/manageroles/${member.username}`
                      : isVendor
                      ? `/vendor/staff/manageroles/${member.username}`
                      : `/doctor/staff/manageroles/${member.username}`
                  }
                >
                  <FaPlus className="bg-[#F59E0B] text-[#134E4A]" />
                </Link>
              </Tooltip>
            )}
            {subRoles.includes(10) && member.is_staff === true && (
              <Tooltip title={member.is_active ? "Deactivate Account" : "Activate Account"}>
                <button
                  type="button"
                  onClick={() => handleAccountToggle(member.id, member.is_active)}
                >
                  {member.is_active ? (
                    <MdOutlineAccountCircle className="bg-emerald-500 text-white" />
                  ) : (
                    <MdOutlineNoAccounts className="bg-rose-500 text-white" />
                  )}
                </button>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

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
            Manage Staffs
          </Link>
        </Breadcrumbs>
      </div>

      <div className="w-full min-h-screen bg-[#F2F2F2] px-4 py-8 mt-3">
        <div className="flex items-center justify-between">
          <span className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Manage Staffs
          </span>
          {subRoles.includes(1) && (
            <Link
              to={
                isSuperuser
                  ? "/admin/staff/addstaff"
                  : isVendor
                  ? "/vendor/staff/addstaff"
                  : "/doctor/staff/addstaff"
              }
              className="font-nunito-sans text-14px font-bold leading-27px text-[#ffffff] bg-[#4379EE] py-3 px-3 rounded-lg text-center"
            >
              Add New Staff
            </Link>
          )}
        </div>

        <div className="mt-4">
          <ModernDataGrid
            rows={staff}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          />
        </div>
      </div>
      {selectedService && (
        <StaffModal
          open={openModal}
          onClose={handleCloseModal}
          service={selectedService}
        />
      )}
    </div>
  );
};

export default Staff;
