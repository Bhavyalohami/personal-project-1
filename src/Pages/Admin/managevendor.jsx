import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminSearch from "../../Component/Admin/adminsearch";
import { MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { FaBan, FaPlus } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import VendorModal from "./Viewmodals/viewvendor";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";
import Tooltip from "@mui/material/Tooltip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import ModernDataGrid from "../../Component/Table/ModernDataGrid";

const ManageVendor = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [status, setStatus] = useState([]);
  const [member, setMember] = useState([]);
  const [uname, setUname] = useState([]);

  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
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
    setIsVendor(Cookies.get("is_vendor") === "true");
    getData();
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
  const vendorRows = Array.isArray(member)
    ? member
    : member?.id
    ? [{ ...member, status }]
    : [];
  const columns = [
    {
      field: "fname",
      headerName: "Vendor",
      minWidth: 260,
      flex: 1.1,
      renderCell: (params) => (
        <div className="flex min-w-0 items-center gap-3">
          <img
            className="h-11 w-11 shrink-0 rounded-2xl object-cover"
            src={params.row.image || "/brand/patient-avatar-teal.png"}
            alt={`${params.row.fname || ""} ${params.row.lname || ""}`.trim() || "Vendor"}
          />
          <div className="min-w-0">
            <p className="truncate font-black text-[#134E4A]">
              {[params.row.fname, params.row.lname].filter(Boolean).join(" ") ||
                params.row.username ||
                "Vendor"}
            </p>
            <p className="mt-1 truncate text-xs font-bold text-[#134E4A]/55">
              {params.row.designation || "Hospital vendor"}
            </p>
          </div>
        </div>
      ),
    },
    { field: "email", headerName: "Email", minWidth: 230, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 140,
      flex: 0.55,
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
      minWidth: 210,
      sortable: false,
      renderCell: (params) => (
        <div className="flex flex-wrap items-center gap-2">
          <Tooltip title="Edit">
            <Link to={`/admin/vendor/editvendor/${params.row.id}`}>
              <MdEdit className="bg-[#0E3A53] text-white" />
            </Link>
          </Tooltip>
          <Tooltip title="View">
            <button type="button" onClick={() => handleOpenModal(params.row)}>
              <IoMdEye className="bg-[#0D9488] text-white" />
            </button>
          </Tooltip>
          <Tooltip
            title={params.row.status ? "Deactivate Vendor Account" : "Activate Vendor Account"}
          >
            <button
              type="button"
              onClick={() => handleStatusToggle(params.row.id, params.row.status)}
            >
              {params.row.status ? (
                <FaCheck className="bg-emerald-600 text-white" />
              ) : (
                <FaBan className="bg-rose-600 text-white" />
              )}
            </button>
          </Tooltip>
          <Tooltip title="Manage Roles">
            <Link to={isSuperuser ? `/admin/vendor/manageroles/${uname}` : ""}>
              <FaPlus className="bg-[#F59E0B] text-[#134E4A]" />
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];
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
          <span className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Manage Vendor
          </span>
          {vendorRows.length === 0 && (
            <Link
              to="/admin/vendor/addvendor"
              className="font-nunito-sans text-14px font-bold leading-27px text-[#ffffff] bg-[#4379EE] py-3 px-3 rounded-lg text-center"
            >
              Add New Vendor
            </Link>
          )}
        </div>

        <div className="mt-4">
          <ModernDataGrid
            rows={vendorRows}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          />
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

