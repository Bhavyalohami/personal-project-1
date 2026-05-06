import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";
import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import UserAppointmentModal from "./Viewmodals/userappointmentmodal";
import { FaUserCircle } from "react-icons/fa";
import {
  FaCalendarCheck,
  FaDownload,
  FaEye,
  FaFileMedical,
  FaLocationDot,
  FaPenToSquare,
  FaShieldHeart,
  FaTrash,
} from "react-icons/fa6";

const emptyText = "Not added";

const InfoItem = ({ label, value }) => (
  <div className="rounded-2xl border border-[#67E8F9]/40 bg-[#ECFEFF]/70 p-4">
    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0D9488]">
      {label}
    </p>
    <p className="mt-2 break-words text-base font-black text-[#134E4A]">
      {value || emptyText}
    </p>
  </div>
);

const Profile = () => {
  const username = Cookies.get("patient_username");
  const [data, setData] = useState({});
  const [bookingData, setBookingData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [documentData, setDocumentData] = useState([]);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    [
      "patient_token",
      "patient_username",
      "patient_status",
      "token",
      "username",
      "status",
    ].forEach((name) => Cookies.remove(name));
  }, []);

  const getData = useCallback(async () => {
    if (!username) return;
    const url = `${BaseUrl}clinic/patient-profile/${username}/`;
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Token ${Cookies.get("patient_token")}` },
      });
      setData(response.data || {});
    } catch (error) {
      console.error(error);
      if (error.code === "ERR_BAD_REQUEST") {
        handleLogout();
        navigate("/");
      }
    }
  }, [handleLogout, navigate, username]);

  const dashboarddata = useCallback(async () => {
    if (!username) return;
    try {
      const response = await axios.get(
        `${BaseUrl}clinic/dashboard/${username}/`
      );
      const dashboard = response.data?.data || {};
      setBookingData(dashboard.upcoming_bookings || []);
      setDocumentData(dashboard.documents || []);
    } catch (error) {
      console.error(error);
    }
  }, [username]);

  const handleOpenModal = (service) => {
    setSelectedAppointment(service);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAppointment(null);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete document?",
      text: "This removes the file from your patient documents.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Keep it",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      const token = Cookies.get("patient_token");
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };
      await axios.delete(`${BaseUrl}clinic/documents/${id}/`, config);
      dashboarddata();
      Swal.fire({
        title: "Deleted",
        text: "Your document has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.error("Error deleting document:", err);
      Swal.fire({
        title: "Error",
        text: "There was an error deleting your document.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    getData();
    dashboarddata();
  }, [dashboarddata, getData]);

  const firstName = useMemo(() => {
    return data.name ? data.name.split(" ")[0] : username || "Patient";
  }, [data.name, username]);

  const metricCards = [
    [<FaCalendarCheck />, bookingData.length, "Upcoming visits"],
    [<FaFileMedical />, documentData.length, "Documents"],
    [<FaShieldHeart />, data.blood_group || "--", "Blood group"],
  ];

  return (
    <main className="min-h-screen bg-[#ECFEFF] text-[#134E4A]">
      <section className="relative overflow-hidden bg-[#134E4A] px-5 py-14 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 care-scan-grid opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {data.image ? (
                <img
                  className="h-28 w-28 rounded-[2rem] border border-white/20 object-cover shadow-2xl"
                  src={data.image}
                  alt={data.name || "Patient profile"}
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 text-7xl">
                  <FaUserCircle />
                </div>
              )}
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#67E8F9]">
                  Patient profile
                </p>
                <h1 className="mt-2 text-4xl font-black leading-tight sm:text-6xl">
                  Hello, {firstName}
                </h1>
                <p className="mt-3 flex items-center gap-2 text-cyan-50/80">
                  <FaLocationDot className="text-[#67E8F9]" />
                  {data.city || "CareBridge patient portal"}
                </p>
              </div>
            </div>

            <Link
              to={`/userprofile/${username}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#F59E0B] px-6 text-sm font-black text-[#134E4A] shadow-xl shadow-black/10 transition hover:bg-[#67E8F9]"
            >
              <FaPenToSquare />
              Edit Profile
            </Link>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {metricCards.map(([icon, value, label]) => (
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
        <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-6 shadow-xl shadow-teal-900/10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
              Personal details
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoItem label="Username" value={username} />
              <InfoItem label="Email" value={data.email} />
              <InfoItem label="Date of birth" value={data.date_of_birth} />
              <InfoItem label="Gender" value={data.gender} />
              <InfoItem label="Age" value={data.age} />
              <InfoItem label="Contact" value={data.contact} />
              <InfoItem label="City" value={data.city} />
              <InfoItem label="State" value={data.state} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-6 shadow-xl shadow-teal-900/10">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                  Upcoming bookings
                </p>
                <h2 className="mt-2 text-3xl font-black">Your next visits</h2>
              </div>
              <Link
                to="/userappointments"
                className="text-sm font-black text-[#0D9488] hover:text-[#F59E0B]"
              >
                View all
              </Link>
            </div>

            <div className="mt-6 grid gap-4">
              {bookingData.length > 0 ? (
                bookingData.slice(0, 3).map((item) => (
                  <article
                    key={item.id}
                    className="rounded-3xl border border-[#67E8F9]/40 bg-[#ECFEFF]/70 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-black">{item.doctor}</h3>
                        <p className="text-sm font-bold text-[#0D9488]">
                          {item.department}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenModal(item)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0D9488] text-white transition hover:bg-[#0F766E]"
                        aria-label="View appointment details"
                      >
                        <FaEye />
                      </button>
                    </div>
                    <div className="mt-4 grid gap-3 text-sm font-semibold text-[#134E4A]/70 sm:grid-cols-2">
                      <span>{item.date}</span>
                      <span>{item.time}</span>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-[#67E8F9]/70 bg-[#ECFEFF]/70 p-8 text-center">
                  <FaCalendarCheck className="mx-auto text-3xl text-[#0D9488]" />
                  <p className="mt-3 text-sm font-black">
                    No upcoming appointments yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl rounded-[2rem] border border-[#67E8F9]/50 bg-white p-6 shadow-xl shadow-teal-900/10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                Documents
              </p>
              <h2 className="mt-2 text-3xl font-black">Recent files</h2>
            </div>
            <Link
              to="/userdocuments"
              className="text-sm font-black text-[#0D9488] hover:text-[#F59E0B]"
            >
              Manage documents
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {documentData.length > 0 ? (
              documentData.slice(0, 6).map((doc) => (
                <article
                  key={doc.id}
                  className="rounded-3xl border border-[#67E8F9]/40 bg-[#ECFEFF]/70 p-4"
                >
                  <FaFileMedical className="text-2xl text-[#0D9488]" />
                  <h3 className="mt-4 break-words text-lg font-black">
                    {doc.document_name}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-[#134E4A]/60">
                    {dayjs(doc.upload_date).format("DD MMM YYYY, hh:mm A")}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <a
                      href={doc.document_file}
                      download
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#0D9488] px-4 text-sm font-black text-white transition hover:bg-[#0F766E]"
                    >
                      <FaDownload />
                      Download
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(doc.id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-white text-red-600 transition hover:bg-red-50"
                      aria-label="Delete document"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full rounded-3xl border border-dashed border-[#67E8F9]/70 bg-[#ECFEFF]/70 p-8 text-center">
                <FaFileMedical className="mx-auto text-3xl text-[#0D9488]" />
                <p className="mt-3 text-sm font-black">
                  No documents uploaded yet.
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

export default Profile;
