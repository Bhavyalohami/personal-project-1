import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Cookies from "js-cookie";
import axios from "axios";
import BaseUrl from "../../Api/baseurl";
import UserAppointmentModal from "./Viewmodals/userappointmentmodal";
import Swal from "sweetalert2";
const UserAppointments = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [data, setData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const token = Cookies.get("patient_token");
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    getdata();
  }, []);

  const getdata = async () => {
    try {
      const response = await axios.get(
        `${BaseUrl}clinic/patient-booking-history/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      setData(response.data.data);
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (val) => {
    setActiveTab(val);
  };

  const getAppointments = () => {
    if (!data) return [];
    if (activeTab === 1) return data.appointments.upcoming;
    if (activeTab === 2) return data.appointments.completed;
    if (activeTab === 3) return data.appointments.cancelled;
    return [];
  };

  const handleOpenModal = (service) => {
    setSelectedAppointment(service);
    // console.log(service);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAppointment(null);
  };

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure, you want to cancel the Appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const token = Cookies.get("patient_token");
        await axios.post(`${BaseUrl}clinic/cancel-booking/${id}/`, id, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });
        setLoading(false);
        Swal.fire({
          title: "Success!",
          text: "Your Appointment has been cancelled successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        // getData();
      } catch (error) {
        // Show error message
        Swal.fire({
          title: "Error!",
          text: `There was an issue cancelling your Appointment: ${error.message}`,
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Failed to delete blog:", error);
      }
    } else {
      console.log("Deletion cancelled.");
    }
  };

  return (
    <div className="py-8 px-8 min-h-screen bg-[#F2F2F2] w-full">
      <div className="w-full container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48 pb-8">
        <div className="flex items-center justify-start">
          <text className="font-nunito-sans text-[32px] font-bold leading-[43.65px] text-[#202224]">
            Your Appointments
          </text>
        </div>

        <div className="lg:ml-4 flex flex-col self-start w-full my-6">
          <div className="flex mb-4">
            <button
              className={`text-[14px] sm:text-xl font-medium mr-1 text-left w-1/3 lg:w-1/5 border-b-[3px] ${
                activeTab === 1
                  ? "text-blue-900 border-blue-900 bg-blue-100"
                  : "text-gray-400 border-gray-400"
              }`}
              onClick={() => handleClick(1)}
            >
              Upcoming
            </button>
            <button
              className={`text-[14px] sm:text-xl font-medium mr-1 text-left w-1/3 lg:w-1/5 border-b-[3px] ${
                activeTab === 2
                  ? "text-blue-900 border-blue-900 bg-blue-100"
                  : "text-gray-400 border-gray-400"
              }`}
              onClick={() => handleClick(2)}
            >
              Completed
            </button>
            <button
              className={`text-[14px] sm:text-xl font-medium mr-1 text-left w-1/3 lg:w-1/5 border-b-[3px] ${
                activeTab === 3
                  ? "text-blue-900 border-blue-900 bg-blue-100"
                  : "text-gray-400 border-gray-400"
              }`}
              onClick={() => handleClick(3)}
            >
              Cancelled
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {getAppointments().length > 0 ? (
              getAppointments().map((appointment) => (
                <div
                  key={appointment.id}
                  className="relative flex flex-col items-start justify-start bg-white rounded-xl p-3"
                >
                  <text className="text-2xl font-medium">
                    {appointment.doctor}
                  </text>
                  <text className="text-sm font-bold text-indigo-500">
                    {appointment.department}
                  </text>
                  <p className="mt-3 text-base font-semibold">
                    Date:{" "}
                    <text className="text-sm font-medium">
                      {appointment.date}
                    </text>
                  </p>
                  <p className="text-base font-semibold">
                    Timing:{" "}
                    <text className="text-sm font-medium">
                      {appointment.time}
                    </text>
                  </p>
                  {activeTab === 2 && (
                    <Link
                      to={`/profiledoctor/${appointment.doctor_id}`}
                      className="hover:underline text-red-500 font-medium self-end"
                    >
                      Feedback/Rating!
                    </Link>
                  )}
                  <Link
                    onClick={() => handleOpenModal(appointment)}
                    className={`absolute flex items-center justify-center p-2 bg-blue-700 hover:bg-blue-900 rounded-full ${
                      activeTab === 1 ? "top-4 right-14" : "top-4 right-4"
                    }`}
                  >
                    <FaEye className="text-lg text-white" />
                  </Link>
                  {activeTab === 1 && (
                    <Link
                      aria-disabled
                      onClick={() => handleCancel(appointment.id)}
                      className={`absolute flex items-center justify-center p-2 bg-red-700 hover:bg-red-900 rounded-full top-4 right-4`}
                    >
                      <MdDelete className="text-lg text-white" />
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-500 font-semibold text-start col-span-full">
                No appointments found.
              </div>
            )}
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

export default UserAppointments;
