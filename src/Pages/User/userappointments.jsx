import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import BaseUrl from "../../Api/baseurl";
import UserAppointmentModal from "./Viewmodals/userappointmentmodal";
import Swal from "sweetalert2";
import {
  FaCalendarCheck,
  FaCircleCheck,
  FaClockRotateLeft,
  FaEye,
  FaHeartPulse,
  FaStar,
  FaTrash,
} from "react-icons/fa6";

const tabs = [
  { id: 1, label: "Upcoming", key: "upcoming", icon: <FaCalendarCheck /> },
  { id: 2, label: "Completed", key: "completed", icon: <FaCircleCheck /> },
  { id: 3, label: "Cancelled", key: "cancelled", icon: <FaClockRotateLeft /> },
];

const UserAppointments = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [data, setData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loadingCancelId, setLoadingCancelId] = useState(null);
  const token = Cookies.get("patient_token");

  const getdata = useCallback(async () => {
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
      setData(response.data.data || {});
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    getdata();
  }, [getdata]);

  const appointmentBuckets = useMemo(() => data?.appointments || {}, [data]);

  const activeAppointments = useMemo(() => {
    const activeKey = tabs.find((tab) => tab.id === activeTab)?.key;
    return appointmentBuckets[activeKey] || [];
  }, [activeTab, appointmentBuckets]);

  const counts = {
    upcoming: appointmentBuckets.upcoming?.length || 0,
    completed: appointmentBuckets.completed?.length || 0,
    cancelled: appointmentBuckets.cancelled?.length || 0,
  };

  const handleOpenModal = (service) => {
    setSelectedAppointment(service);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAppointment(null);
  };

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Cancel appointment?",
      text: "This will move the visit into your cancelled appointments.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Cancel appointment",
      cancelButtonText: "Keep booking",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      setLoadingCancelId(id);
      const currentToken = Cookies.get("patient_token");
      await axios.post(`${BaseUrl}clinic/cancel-booking/${id}/`, id, {
        headers: {
          Authorization: `Token ${currentToken}`,
          "Content-Type": "application/json",
        },
      });
      await getdata();
      Swal.fire({
        title: "Cancelled",
        text: "Your appointment has been cancelled successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: `There was an issue cancelling your appointment: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Failed to cancel appointment:", error);
    } finally {
      setLoadingCancelId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#ECFEFF] text-[#134E4A]">
      <section className="relative overflow-hidden bg-[#134E4A] px-5 py-14 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 care-scan-grid opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#67E8F9]">
            Patient timeline
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
            Keep every visit visible.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-cyan-50/80">
            Review upcoming appointments, leave feedback after completed visits,
            and keep cancelled bookings out of the way.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Upcoming", counts.upcoming, <FaCalendarCheck />],
              ["Completed", counts.completed, <FaCircleCheck />],
              ["Cancelled", counts.cancelled, <FaClockRotateLeft />],
            ].map(([label, value, icon]) => (
              <div
                key={label}
                className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur"
              >
                <div className="text-2xl text-[#67E8F9]">{icon}</div>
                <p className="mt-4 text-3xl font-black">{value}</p>
                <p className="text-sm font-semibold text-cyan-50/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-3 rounded-[2rem] border border-[#67E8F9]/50 bg-white p-3 shadow-xl shadow-teal-900/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-black transition sm:flex-none ${
                  activeTab === tab.id
                    ? "bg-[#0D9488] text-white shadow-lg shadow-teal-900/10"
                    : "bg-[#ECFEFF] text-[#134E4A] hover:bg-[#67E8F9]/40"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {activeAppointments.length > 0 ? (
              activeAppointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-5 shadow-xl shadow-teal-900/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black">
                        {appointment.doctor}
                      </h2>
                      <p className="mt-1 text-sm font-black text-[#0D9488]">
                        {appointment.department}
                      </p>
                    </div>
                    <FaHeartPulse className="text-2xl text-[#67E8F9]" />
                  </div>

                  <div className="mt-5 grid gap-3 rounded-3xl bg-[#ECFEFF]/70 p-4 text-sm font-semibold text-[#134E4A]/75">
                    <div className="flex justify-between gap-4">
                      <span>Date</span>
                      <span className="font-black text-[#134E4A]">
                        {appointment.date}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Time</span>
                      <span className="font-black text-[#134E4A]">
                        {appointment.time}
                      </span>
                    </div>
                    {appointment.location && (
                      <div className="flex justify-between gap-4">
                        <span>Location</span>
                        <span className="font-black text-[#134E4A]">
                          {appointment.location}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(appointment)}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#0D9488] px-4 text-sm font-black text-white transition hover:bg-[#0F766E]"
                    >
                      <FaEye />
                      Details
                    </button>

                    {activeTab === 2 && (
                      <Link
                        to={`/profiledoctor/${appointment.doctor_id}`}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#F59E0B]/50 bg-[#F59E0B]/15 px-4 text-sm font-black text-[#134E4A] transition hover:bg-[#F59E0B]"
                      >
                        <FaStar />
                        Feedback
                      </Link>
                    )}

                    {activeTab === 1 && (
                      <button
                        type="button"
                        disabled={loadingCancelId === appointment.id}
                        onClick={() => handleCancel(appointment.id)}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-4 text-sm font-black text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <FaTrash />
                        {loadingCancelId === appointment.id ? "Cancelling" : "Cancel"}
                      </button>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full rounded-[2rem] border border-dashed border-[#67E8F9]/70 bg-white p-10 text-center shadow-xl shadow-teal-900/10">
                <FaCalendarCheck className="mx-auto text-4xl text-[#0D9488]" />
                <h2 className="mt-4 text-2xl font-black">No appointments found</h2>
                <p className="mt-3 text-sm font-semibold text-[#134E4A]/65">
                  This section will update as soon as appointments match the
                  selected status.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedAppointment && (
        <UserAppointmentModal
          open={openModal}
          onClose={handleCloseModal}
          service={selectedAppointment}
        />
      )}
    </main>
  );
};

export default UserAppointments;
