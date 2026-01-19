import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import AdminSearch from "../../../Component/Admin/adminsearch";
import DoctorSearch from "../../../Component/Doctor/doctorsearch";
import VendorSearch from "../../../Component/Vendor/vendorsearch";
import axios from "axios";
import BaseUrl from "../../../Api/baseurl";
import Swal from "sweetalert2";
import Breadcrumbs from "@mui/material/Breadcrumbs";

const ManageRoles = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [rolesData, setRolesData] = useState({});
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const roles = Cookies.get("roles")
    ? Cookies.get("roles")
        .split(",")
        .map((role) => parseInt(role, 10))
    : [];
  const subroles = Cookies.get("subroles")
    ? JSON.parse(Cookies.get("subroles"))
    : [];

  const isVendorPath = window.location.pathname.startsWith("/admin/vendor");

  useEffect(() => {
    const fetchRoles = async (username) => {
      try {
        const response = await axios.get(`${BaseUrl}clinic/roles/${username}/`);
        setRolesData(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
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

    setIsSuperuser(Cookies.get("is_superuser") === "true");
    setIsStaff(Cookies.get("is_staff") === "true");
    setIsVendor(Cookies.get("is_vendor") === "true");
    fetchRoles(username);
  }, [username]);

  useEffect(() => {
    const autoSelectMarkedRoles = () => {
      const initiallySelected = Object.entries(rolesData).reduce(
        (acc, [roleId, roleInfo]) => {
          if (roleInfo.roles.marked) {
            acc.push({ roleId, subroles: [] });
          }
          return acc;
        },
        []
      );

      // Handle subroles marked by default
      Object.entries(rolesData).forEach(([roleId, roleInfo]) => {
        if (roleInfo.subroles) {
          const defaultSubroles = roleInfo.subroles
            .filter((subrole) => subrole.marked)
            .map((subrole) => subrole.id);
          if (defaultSubroles.length > 0) {
            const roleIndex = initiallySelected.findIndex(
              (item) => item.roleId === roleId
            );
            if (roleIndex !== -1) {
              initiallySelected[roleIndex].subroles = defaultSubroles;
            }
          }
        }
      });

      setSelectedRoles(initiallySelected);
    };

    if (Object.keys(rolesData).length > 0) {
      autoSelectMarkedRoles();
    }
  }, [rolesData]);

  const handleRoleSelection = (roleId) => {
    setSelectedRoles((prevSelected) => {
      const exists = prevSelected.some((item) => item.roleId === roleId);
      if (exists) {
        return prevSelected.filter((item) => item.roleId !== roleId);
      } else {
        return [...prevSelected, { roleId, subroles: [] }];
      }
    });
  };

  const handleSubroleSelection = (roleId, subroleId) => {
    setSelectedRoles((prevSelected) => {
      const roleIndex = prevSelected.findIndex(
        (item) => item.roleId === roleId
      );
      if (roleIndex !== -1) {
        const updatedSubroles = prevSelected[roleIndex].subroles.includes(
          subroleId
        )
          ? prevSelected[roleIndex].subroles.filter((id) => id !== subroleId)
          : [...prevSelected[roleIndex].subroles, subroleId];
        const updatedRoles = [...prevSelected];
        updatedRoles[roleIndex].subroles = updatedSubroles;
        return updatedRoles;
      } else {
        return [...prevSelected, { roleId, subroles: [subroleId] }];
      }
    });
  };

  const transformdata = (selectedRoles) => {
    const result = { roles: [], subroles: [] };

    for (let i = 0; i < selectedRoles.length; i++) {
      const role = selectedRoles[i];
      result.roles.push(role.roleId);
      if (role.roleId && role.subroles.length !== 0) {
        result.subroles.push(role);
      }
    }
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedroles = transformdata(selectedRoles);
    if (selectedroles.roles.length === 0) {
      Swal.fire({
        title: "Error!",
        text: "Please select at least one role.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    const payload = {
      roles: selectedroles.roles,
      subroles: selectedroles.subroles,
      user: username,
    };
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        const token = Cookies.get("token");
        const response = await axios.patch(
          `${BaseUrl}clinic/update-roles/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          title: "Success!",
          text: "Roles and Responsibilities updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        if (isSuperuser) {
          if (isVendorPath) {
            navigate("/admin/vendor");
          } else {
            navigate("/admin/staff");
          }
        } else if (isVendor) {
          navigate("/vendor/staff");
        } else {
          navigate("/doctor/staff");
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: `There was an issue updating your Staff information: ${error.message}`,
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error submitting roles:", error);
      }
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
          {isVendorPath ? (
            <Link
              className="hover:underline text-inherit"
              color="inherit"
              to="/admin/vendor"
            >
              Manage Vendor
            </Link>
          ) : (
            <Link
              className="hover:underline text-inherit"
              color="inherit"
              to={isSuperuser ? "/admin/staff" : isVendor ? "/vendor/staff" : "/doctor/staff"}
            >
              Manage Staff
            </Link>
          )}
          <Link className="hover:underline text-inherit" color="inherit">
            Manage Roles
          </Link>
        </Breadcrumbs>
      </div>
      <div className="w-full bg-[#F2F2F2] px-4 pt-8 pb-4 mt-3">
        <div className="flex items-center justify-between">
          <h1 className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Manage Roles
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 bg-white rounded-lg p-4 my-4">
          {Object.keys(rolesData).length === 0 ? (
            <p>Loading roles...</p>
          ) : (
            Object.entries(rolesData).map(
              ([roleId, roleInfo]) =>
                roles.includes(Number(roleInfo.roles.id)) && (
                  <div key={roleId}>
                    <label className="font-bold flex items-center">
                      <input
                        type="checkbox"
                        onChange={() => handleRoleSelection(roleId)}
                        checked={selectedRoles.some(
                          (item) => item.roleId === roleId
                        )}
                        className="mr-2 h-[17px] w-[17px]"
                      />
                      {roleInfo.roles.name}
                    </label>

                    {selectedRoles.some((item) => item.roleId === roleId) && (
                      <div className="ml-[20px] grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-1 mt-1">
                        {roleInfo.subroles.length > 0 ? (
                          roleInfo.subroles.map((subrole) =>
                            subroles.map((ssub) =>
                              ssub.roleId === roleId &&
                              ssub.subroles.includes(subrole.id) ? (
                                <div key={subrole.id}>
                                  <label className="font-medium flex items-center">
                                    <input
                                      type="checkbox"
                                      className="mr-1.5"
                                      onChange={() =>
                                        handleSubroleSelection(
                                          roleId,
                                          subrole.id
                                        )
                                      }
                                      checked={selectedRoles
                                        .find((item) => item.roleId === roleId)
                                        ?.subroles.includes(subrole.id)}
                                    />
                                    {subrole.name}
                                  </label>
                                </div>
                              ) : null
                            )
                          )
                        ) : (
                          <div className="col-span-full">
                            <p>No sub roles available.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
            )
          )}
        </div>
        <div className="my-4 ml-3 flex items-center justify-start gap-6">
          <button
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleSubmit}
          >
            Save
          </button>
          <Link
            to={
              isSuperuser
                ? isVendorPath
                  ? "/admin/vendor"
                  : "/admin/staff"
                : isVendor
                ? "/vendor/staff"
                : "/doctor/staff"
            }
            className="rounded-md !text-black px-3 py-[7px] text-sm font-semibold text-white shadow-sm border border-1 border-black"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManageRoles;
