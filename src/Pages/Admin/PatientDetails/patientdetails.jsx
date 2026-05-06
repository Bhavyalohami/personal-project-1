import React, { useState, useEffect } from "react";
import AdminSearch from "../../../Component/Admin/adminsearch";
import DoctorSearch from "../../../Component/Doctor/doctorsearch";
import VendorSearch from "../../../Component/Vendor/vendorsearch";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import BaseUrl from "../../../Api/baseurl";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { FaEye } from "react-icons/fa";
import UserAppointmentModal from "../../User/Viewmodals/userappointmentmodal";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    contact: "",
    city: "",
    state: "",
    blood_group: "",
  });
  const [bookings, setBookings] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  useEffect(() => {
    setIsSuperuser(Cookies.get("is_superuser") === "true");
    setIsVendor(Cookies.get("is_vendor") === "true");
    setIsStaff(Cookies.get("is_staff") === "true");
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get(
        `${BaseUrl}clinic/patient-details/${id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setData(response.data.data.patient_info);
      setDocuments(response.data.data.patient_document);
      setBookings(response.data.data.patient_bookings);
    } catch (error) {
      console.error(error);
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
  const handleOpenModal = (service) => {
    setSelectedAppointment(service);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAppointment(null);
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
          <Link
            className="hover:underline text-inherit"
            color="inherit"
            to={
              isSuperuser
                ? "/admin/appointments"
                : isVendor
                ? "/vendor/appointments"
                : "/doctor/appointments"
            }
          >
            Appointments
          </Link>
          <Link className="hover:underline text-inherit" color="inherit">
            Patient Details
          </Link>
          <Link className="hover:underline text-inherit" color="inherit">
            {data.name}
          </Link>
        </Breadcrumbs>
      </div>

      <div className="w-full bg-[#F2F2F2] px-4 py-8 mt-3">
        <div className="flex items-center justify-between">
          <span className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Patient Details
          </span>
        </div>
        <div className="flex flex-col xl:flex-row gap-4 mt-3">
          {/* <div className="flex flex-col bg-white rounded-xl w-full h-screen items-center p-4">
            <p className="text-gray-500 font-bold text-2xl">
              Patient Information
            </p>
            <div className='flex gap-3 w-full mt-3'>
                <div className='flex items-center justify-end w-full'>Name:</div>
                <div className='flex items-center justify-start w-full'>Bhavya Lohami</div>
            </div>
            <div className='flex gap-3 w-full mt-3'>
                <div className='flex items-center justify-end w-full'>Email:</div>
                <div className='flex items-center justify-start w-full'>bhavya.lohami@logicspice.com</div>
            </div>
            <div className='flex gap-3 w-full mt-3'>
                <div className='flex items-center justify-end w-full'>Age:</div>
                <div className='flex items-center justify-start w-full'>21</div>
            </div>
            <div className='flex gap-3 w-full mt-3'>
                <div className='flex items-center justify-end w-full'>Gender:</div>
                <div className='flex items-center justify-start w-full'>Male</div>
            </div>
            <div className='flex gap-3 w-full mt-3'>
                <div className='flex items-center justify-end w-full'>Contact:</div>
                <div className='flex items-center justify-start w-full'>9636548536</div>
            </div>
            <div className='flex gap-3 w-full mt-3'>
                <div className='flex items-center justify-end w-full'>City:</div>
                <div className='flex items-center justify-start w-full'>Kota</div>
            </div>
            <div className='flex gap-3 w-full mt-3'>
                <div className='flex items-center justify-end w-full'>State:</div>
                <div className='flex items-center justify-start w-full'>Rajasthan</div>
            </div>
            <div className='flex gap-3 w-full mt-3'>
                <div className='flex items-center justify-end w-full'>Blood Group:</div>
                <div className='flex items-center justify-start w-full'>B+</div>
            </div>
          </div> */}
          <div className="flex flex-col bg-white rounded-xl w-full max-w-3xl h-fit items-center p-6 shadow-lg">
            <p className="text-gray-500 font-bold text-3xl mb-4">
              Patient Information
            </p>

            <div className="w-full space-y-3">
              <div className="flex justify-center items-center">
                <img
                  className="h-24 w-24 rounded-full object-cover"
                  src={data.image}
                  alt="Patient"
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-gray-700 font-semibold text-lg">Name:</div>
                <div className="text-gray-800 text-lg">{data.name}</div>
              </div>
              <hr className="text-black border-[2px] !my-0.5 rounded-full" />
              <div className="flex justify-between items-center">
                <div className="text-gray-700 font-semibold text-lg">
                  Email:
                </div>
                <div className="text-gray-800 text-lg">{data.email}</div>
              </div>
              <hr className="text-black border-[2px] !my-0.5 rounded-full" />

              <div className="flex justify-between items-center">
                <div className="text-gray-700 font-semibold text-lg">Age:</div>
                <div className="text-gray-800 text-lg">{data.age}</div>
              </div>
              <hr className="text-black border-[2px] !my-0.5 rounded-full" />
              <div className="flex justify-between items-center">
                <div className="text-gray-700 font-semibold text-lg">
                  Gender:
                </div>
                <div className="text-gray-800 text-lg">{data.gender}</div>
              </div>
              <hr className="text-black border-[2px] !my-0.5 rounded-full" />
              <div className="flex justify-between items-center">
                <div className="text-gray-700 font-semibold text-lg">
                  Contact:
                </div>
                <div className="text-gray-800 text-lg">{data.contact}</div>
              </div>
              <hr className="text-black border-[2px] !my-0.5 rounded-full" />
              <div className="flex justify-between items-center">
                <div className="text-gray-700 font-semibold text-lg">City:</div>
                <div className="text-gray-800 text-lg">{data.city}</div>
              </div>
              <hr className="text-black border-[2px] !my-0.5 rounded-full" />
              <div className="flex justify-between items-center">
                <div className="text-gray-700 font-semibold text-lg">
                  State:
                </div>
                <div className="text-gray-800 text-lg">{data.state}</div>
              </div>
              <hr className="text-black border-[2px] !my-0.5 rounded-full" />
              <div className="flex justify-between items-center">
                <div className="text-gray-700 font-semibold text-lg">
                  Blood Group:
                </div>
                <div className="text-gray-800 text-lg">{data.blood_group}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full h-full gap-4">
            <div className="flex flex-col bg-white rounded-xl w-full max-w-3xl h-full items-center p-6 shadow-lg gap-2">
              <p className="text-gray-500 font-bold text-2xl">Medical Files</p>
              <div className="flex gap-4 w-full mt-2">
                <div className="flex w-full justify-center items-center font-semibold">
                  Document Name
                </div>
                <div className="flex w-full justify-center items-center font-semibold">
                  View Link
                </div>
              </div>
              <div className="w-full !h-[100px] overflow-y-auto scrollable">
                {documents.length > 0 ? (
                  documents.map((document, index) => (
                    <div className="w-full">
                      <div key={index} className="flex gap-4 w-full">
                        <div className="flex w-full justify-center items-center font-medium">
                          {document.document_name}
                        </div>
                        <div className="flex w-full justify-center items-center font-medium">
                          <a
                            href={`${BaseUrl}${document.file_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            View
                          </a>
                        </div>
                      </div>
                      <hr className="text-black border-[1px] !my-0.5 rounded-full" />
                    </div>
                  ))
                ) : (
                  <div className="flex w-full justify-center items-center text-gray-500 font-semibold text-center ">
                    No documents found.
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col bg-white rounded-xl w-full max-w-3xl h-full items-center p-6 shadow-lg ">
              <p className="text-gray-500 font-bold text-2xl">
                Previous Bookings
              </p>
              <div className="grid grid-cols-1 2xl:grid-cols-2 w-full mt-2.5 gap-3 h-[220px] overflow-y-auto scrollable">
                {bookings.length > 0 ? (
                  bookings.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="relative flex flex-col items-start justify-start bg-[#F2F2F2] rounded-2xl p-3 w-full"
                    >
                      <span className="text-2xl font-medium">
                        {appointment.doctor}
                      </span>
                      <span className="text-sm font-bold text-indigo-500">
                        {appointment.department}
                      </span>
                      <p className="mt-3 text-base font-semibold">
                        Date:{" "}
                        <span className="text-sm font-medium">
                          {appointment.date}
                        </span>
                      </p>
                      <p className="text-base font-semibold">
                        Timing:{" "}
                        <span className="text-sm font-medium">
                          {appointment.time}
                        </span>
                      </p>
                      {/* {activeTab === 2 && (
                    <Link
                      to={`/profiledoctor/${appointment.doctor_id}`}
                      className="hover:underline text-red-500 font-medium self-end"
                    >
                      Feedback/Rating!
                    </Link>
                  )} */}
                      <Link
                        onClick={() => handleOpenModal(appointment)}
                        className="absolute flex items-center justify-center p-2 bg-blue-700 hover:bg-blue-900 rounded-full top-4 right-4"
                      >
                        <FaEye className="text-lg text-white" />
                      </Link>
                      {/* {activeTab === 1 && (
                    <Link
                      aria-disabled
                      onClick={() => handleCancel(appointment.id)}
                      className={`absolute flex items-center justify-center p-2 bg-red-700 hover:bg-red-900 rounded-full top-4 right-4`}
                    >
                      <MdDelete className="text-lg text-white" />
                    </Link>
                  )} */}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 font-semibold text-center col-span-full">
                    No bookings found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedAppointment && (
        <UserAppointmentModal
          open={openModal}
          onClose={handleCloseModal}
          service={selectedAppointment}
        />
      )}
    </div>
  );
};

export default PatientDetails;
