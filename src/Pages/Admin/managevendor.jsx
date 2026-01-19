import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminSearch from "../../Component/Admin/adminsearch";
import { MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaBan, FaPlus } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import VendorModal from "./Viewmodals/viewvendor";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";
import Tooltip from "@mui/material/Tooltip";
import Breadcrumbs from "@mui/material/Breadcrumbs";

const ManageVendor = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [status, setStatus] = useState([]);
  const [member, setMember] = useState([]);
  const [uname, setUname] = useState([]);

  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const getData = async () => {
    const token = Cookies.get("token");
    const apiUrl = `${BaseUrl}clinic/vendor-profile/`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setStatus(response.data.status, "data");
      if (response.data.vendor !== undefined) {
        setMember(response.data.vendor, "data");
        console.log("member", response.data.vendor);
        
      }
      console.log("andar", member);
      setUname(response.data.Uname, "data");
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
        navigate("/admin/login");
      }
    }
  };
  useEffect(() => {
    setIsSuperuser(Cookies.get("is_superuser") === "true");
    setIsStaff(Cookies.get("is_staff") === "true");
    setIsVendor(Cookies.get("is_vendor") === "true");
    getData();
  }, []);

  const handleOpenModal = (service) => {
    setSelectedService(service);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedService(null);
  };



  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus ? 0 : 1;
    try {
      await axios.patch(
        `${BaseUrl}clinic/change-vendor-status/${id}/`,
        { status: newStatus }
        // { headers: { Authorization: `Token ${token}` } }
      );

      setStatus(newStatus);
      Swal.fire({
        title: "Success!",
        text: `Vendor status has been updated to ${newStatus === 1 ? "Active" : "Inactive"
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
  function handleBreadClick(event) {
    event.preventDefault();
  }
  return (
    <div className="py-8 px-8 w-full md:w-[80%] xl:w-full">
      <AdminSearch />
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
            Manage Vendor
          </Link>
        </Breadcrumbs>
      </div>
      <div className="w-full min-h-screen bg-[#F2F2F2] px-4 py-8 mt-3">
        <div className="flex items-center justify-between">
          <text className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Manage Vendor
          </text>
          {member.length === 0 && (
            <Link
              to="/admin/vendor/addvendor"
              className="font-nunito-sans text-14px font-bold leading-27px text-[#ffffff] bg-[#4379EE] py-3 px-3 rounded-lg text-center"
            >
              Add New Vendor
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 mt-4">
          {member.length !== 0 ? (
            <div
              key={member.id}
              className="flex flex-col items-center justify-center bg-[#ffffff] pt-10 pb-6 rounded-2xl"
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
              <div className="flex space-x-4 items-center content-center justify-center mt-3">
                <Tooltip title="Edit">
                  <Link to={`/admin/vendor/editvendor/${member.id}`}>
                    <MdEdit className="bg-[#0E3A53] p-0.5 text-[25px] text-white rounded" />
                  </Link>
                </Tooltip>
                <Tooltip title="View">
                  <button
                    onClick={() => handleOpenModal(member)}
                    className="text-[25px]"
                  >
                    <IoMdEye className="bg-[#1030A4] p-0.5 text-white rounded" />
                  </button>
                </Tooltip>
                {/* <button onClick={() => handleDelete(member.id)}> */}
                {/* <MdDelete className="bg-[#F16163] p-0.5 text-[25px] text-white rounded" /> */}
                {/* </button> */}
                <button onClick={() => handleStatusToggle(member.id, status)}>
                  {status ? (
                    <Tooltip title="Deactivate Vendor Account">
                      <Link>
                        <FaCheck className="bg-green-700 p-1 text-[25px] text-white rounded" />
                      </Link>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Activate Vendor Account">
                      <Link>
                        <FaBan className="bg-red-700 p-1 text-[25px] text-white rounded" />
                      </Link>
                    </Tooltip>
                  )}
                </button>
                <Tooltip title="Manage Roles">
                  <Link
                    to={isSuperuser ? `/admin/vendor/manageroles/${uname}` : ""}
                  >
                    <FaPlus className="bg-purple-500 p-1 text-[25px] text-white rounded" />
                  </Link>
                </Tooltip>
              </div>
            </div>
          ) : (
            <div className="col-span-full flex w-full justify-center pt-6 text-xl text-gray-500 font-semibold">No Vendors Found.</div>
          )}
        </div>
      </div>
      {selectedService && (
        <VendorModal
          open={openModal}
          onClose={handleCloseModal}
          service={selectedService}
        />
      )}
    </div>
  );
};

export default ManageVendor;

