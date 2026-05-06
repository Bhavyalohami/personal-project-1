import React, { useEffect, useState } from "react";
import { IoMdEye } from "react-icons/io";
import { FaBan, FaCheck } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";
import AdminSearch from "../../Component/Admin/adminsearch";
import DoctorSearch from "../../Component/Doctor/doctorsearch";
import VendorSearch from "../../Component/Vendor/vendorsearch";
import PatientModal from "./Viewmodals/viewpatient";
import Tooltip from "@mui/material/Tooltip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import ModernDataGrid, { ModernDataGridToolbar } from "../../Component/Table/ModernDataGrid";
import { Link, useNavigate } from "react-router-dom";

const StyledDataGrid = ModernDataGrid;

const CustomToolbar = ModernDataGridToolbar;

const ManagePatients = () => {
  const [openModal, setOpenModal] = useState(false);
  const [, setQuery] = useState([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [subRoles, setSubRoles] = useState([]);

  const handleSubRoles = () => {
    const subroles = Cookies.get("subroles");
    if (subroles) {
      const parsedSubRoles = JSON.parse(subroles);
      const role = parsedSubRoles.find((role) => role.roleId === "19");
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
    const apiUrl = `${BaseUrl}clinic/patient-list/`;
    const token = Cookies.get("token");
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setDataWithSerialNumbers(response.data);
      setQuery(response.data);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenModal = (service) => {
    setSelectedQuery(service);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedQuery(null);
  };

  const handletogglestatus = async (id, currentStatus) => {
    const newstatus = currentStatus ? 0 : 1;
    try {
      const apiUrl = `${BaseUrl}clinic/patient-list/toggle-status/`;
      await axios.patch(apiUrl, {
        status: newstatus,
        patient_id: id,
      });
      getData();
      Swal.fire({
        title: "Success!",
        text: `Patient's account status has been ${
          newstatus === 1 ? "activated Successfully" : "deactivated Successfully"
        }.`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `There was an issue updating the patient status: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
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
        await axios.delete(`${BaseUrl}clinic/patient-list/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        getData();

        Swal.fire({
          title: "Success!",
          text: "Patient has been deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: `There was an issue deleting the Patient: ${error.message}`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  // Columns definition (without useMemo)
  const columns = [
    {
      field: "serialNumber",
      headerName: "Sr.No.",
      minWidth: 90,
      flex: 0.45,
      renderCell: (params) => <div>{params.row.__serialNumber}</div>,
    },
    { field: "name", headerName: "Patient Name", minWidth: 180, flex: 1.1 },
    { field: "email", headerName: "Email", minWidth: 220, flex: 1.25 },
    { field: "contact", headerName: "Contact No.", minWidth: 160, flex: 0.9 },
    { field: "gender", headerName: "Gender", minWidth: 120, flex: 0.65 },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 190,
      flex: 0.85,
      sortable: false,
      renderCell: (params) => (
        <div className="flex space-x-4 items-center content-center justify-start mt-2">
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
                    ? `/admin/managepatients/editpatient/${params.row.id}/`
                    : isVendor
                    ? `/vendor/managepatients/editpatient/${params.row.id}/`
                    : `/doctor/managepatients/editpatient/${params.row.id}/`
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
                handletogglestatus(params.row.id, params.row.is_active)
              }
            >
              {params.row.is_active ? (
                <Tooltip title="Deactivate Account">
                  <Link className="text-[32px]">
                    <FaCheck className="bg-green-700 p-1 text-white rounded" />
                  </Link>
                </Tooltip>
              ) : (
                <Tooltip title="Activate Account">
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
            Manage Patients
          </Link>
        </Breadcrumbs>
      </div>
      <div className="w-full bg-[#F2F2F2] px-4 py-4 mt-3">
        <div className="flex items-center justify-between pb-4">
          <span className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Manage Patients
          </span>
          {subRoles.includes(1) && (
            <Link
              to={
                isSuperuser
                  ? "/admin/managepatients/addpatient"
                  : isVendor
                  ? "/vendor/managepatients/addpatient"
                  : "/doctor/managepatients/addpatient"
              }
              className="font-nunito-sans text-14px font-bold leading-27px text-[#ffffff] bg-[#4379EE] py-3 px-4 rounded-lg text-center"
            >
              Add Patient
            </Link>
          )}
        </div>
        <div className="bg-white">
          <div className="w-full">
            <StyledDataGrid
              rows={rows}
              columns={columns}
              slots={{ toolbar: CustomToolbar }}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[5, 10, 25]}
            />
          </div>
        </div>
      </div>
      {selectedQuery && (
        <PatientModal
          open={openModal}
          onClose={handleCloseModal}
          service={selectedQuery}
        />
      )}
    </div>
  );
}

export default ManagePatients;
