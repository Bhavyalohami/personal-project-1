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
import ServiceModal from "./Viewmodals/viewcontact";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";
import DoctorSearch from "../../Component/Doctor/doctorsearch";
import VendorSearch from "../../Component/Vendor/vendorsearch";
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
      const response = await axios.patch(
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
          <text className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Manage Staffs
          </text>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-4">
          {staff.map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center justify-center bg-[#ffffff] pt-10 pb-6 rounded-2xl relative"
            >
              <img
                className="w-[140px] h-[140px] rounded-full object-cover"
                src={member.image}
                alt="Staff"
              />
              <text className="font-nunito-sans text-[16px] font-bold leading-[21.82px] text-[#202224] mt-4">
                {member.fname + " " + member.lname}{" "}
              </text>
              <text className="font-nunito-sans text-[14px] font-semi-bold leading-[19px] text-[#202224] mt-2">
                {member.designation}
              </text>
              <text className="font-nunito-sans text-[14px] font-normal leading-[19px] text-[#202224] mt-2">
                {member.email}
              </text>
              <div className="flex space-x-3 items-center content-center justify-center mt-3">
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
                      <MdEdit className="bg-[#0E3A53] p-0.5 text-[25px] text-white rounded" />
                    </Link>
                  </Tooltip>
                )}
                {subRoles.includes(4) && (
                  <Tooltip title="View">
                    <button
                      onClick={() => handleOpenModal(member)}
                      className="text-[25px]  "
                    >
                      <IoMdEye className="bg-[#1030A4] p-0.5 text-white rounded" />
                    </button>
                  </Tooltip>
                )}
                {subRoles.includes(3) && (
                  <Tooltip title="Delete">
                    <button onClick={() => handleDelete(member.id)}>
                      <MdDelete className="bg-[#F16163] p-0.5 text-[25px] text-white rounded" />
                    </button>
                  </Tooltip>
                )}
                {subRoles.includes(7) && (
                  <button
                    onClick={() => handleStatusToggle(member.id, member.status)}
                  >
                    {member.status ? (
                      <Tooltip title="Deactivate Doctor Profile">
                        <Link>
                          <FaCheck className="bg-green-700 p-1 text-[25px] text-white rounded" />
                        </Link>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Activate Doctor Profile">
                        <Link>
                          <FaBan className="bg-red-700 p-1 text-[25px] text-white rounded" />
                        </Link>
                      </Tooltip>
                    )}
                  </button>
                )}
                {subRoles.includes(8) &&
                  (member.is_staff === true ? (
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
                        <FaPlus className="bg-purple-500 p-1 text-[25px] text-white rounded" />
                      </Link>
                    </Tooltip>
                  ) : null)}
                {subRoles.includes(10) &&
                  (member.is_staff === true ? (
                    <button
                      className="absolute top-[10px] right-[10px]"
                      onClick={() =>
                        handleAccountToggle(member.id, member.is_active)
                      }
                    >
                      {member.is_active ? (
                        <Tooltip title="Deactivate Account">
                          <Link>
                            <MdOutlineAccountCircle className="bg-green-500 p-0.5 text-[25px] text-white rounded-full" />
                          </Link>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Activate Account">
                          <Link>
                            <MdOutlineNoAccounts className="bg-red-500 p-0.5 text-[25px] text-white rounded-full" />
                          </Link>
                        </Tooltip>
                      )}
                    </button>
                  ) : null)}
              </div>
            </div>
          ))}
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
