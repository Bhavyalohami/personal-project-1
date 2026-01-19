import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import BaseUrl from "../../Api/baseurl";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import UserAppointmentModal from "./Viewmodals/userappointmentmodal";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const username = Cookies.get("patient_username");
  const [user, setUser] = useState(username);
  const [data, setData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [documentData, setDocumentData] = useState([]);
  const navigate = useNavigate();
  const getData = async () => {
    const url = `${BaseUrl}clinic/patient-profile/${username}/`;
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Token ${Cookies.get("patient_token")}` },
      });
      setData(response.data);
    } catch (error) {
      console.error(error);
      if (error.code === "ERR_BAD_REQUEST") {
        handleLogout();
        navigate("/");
      }
    }
  };

  const dashboarddata = async () => {
    try {
      const response = await axios.get(
        `${BaseUrl}clinic/dashboard/${username}/`
      );
      setBookingData(response.data.data.upcoming_bookings || []);
      // console.log(response.data, "booking");

      setDocumentData(response.data.data.documents || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    Cookies.remove("is_superuser");
    Cookies.remove("is_staff");
    Cookies.remove("is_vendor");
    Cookies.remove("status");
    Cookies.remove("roles");
    Cookies.remove("subroles");
    // setIsLogin(null);
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
  const handleDelete = async (id) => {
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
        title: "Success!",
        text: "Your document has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.error("Error deleting document:", err);
      Swal.fire({
        title: "Error!",
        text: "There was an error deleting your document.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    getData();
    dashboarddata();
  }, []);
  return (
    <div className="py-8  w-full bg-[#F2F2F2]">
      {/* {data && ( */}
      <div className="w-full container mx-auto px-4 sm:px-8 lg:px-32 xl:px-48  mt-3">
        <div className="w-full flex">
          <div className="flex items-center justify-start w-full gap-6">
            {data.image ? (
              <img
                className="h-24 w-24 rounded-full object-cover"
                src={data.image}
                // src="/assets/Home/images/doctor1.png"
                alt="Profile"
              />
            ) : (
              <FaUserCircle className="text-[85px] text-gray-700" />
            )}
            <div className="flex flex-col">
              <p className="font-nunito text-[24px] lg:text-[34px] font-bold">
                {data.name}
              </p>
              <p className="font-nunito text-indigo-600 text-[18px] lg:text-[26px] font-bold">
                Patient
              </p>
            </div>
          </div>
          <div className="flex items-start justify-end w-1/4">
            <Link
              to={`/userprofile/${username}`}
              className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg font-bold bg-purple-500 text-white"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="mb-4 mt-6">
          <p className="font-open-sans text-[22px] font-semibold leading-[29.96px] tracking-[-0.114px]">
            Personal Info
          </p>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 bg-[#ffffff] p-4 mt-2 gap-4 rounded-xl">
            <div className="flex items-center justify-start gap-2 w-full py-2">
              <p className="font-open-sans text-[18px] font-semibold leading-[24.51px] tracking-[-0.114px]">
                Username:
              </p>
              <p className="font-open-sans text-[18px] font-normal leading-[24.51px] tracking-[-0.114px] ">
                {user}
              </p>
            </div>
            <div className="flex items-center justify-start gap-2 w-full py-2">
              <p className="font-open-sans text-[18px] font-semibold leading-[24.51px] tracking-[-0.114px]">
                Date of Birth:
              </p>
              <p className="font-open-sans text-[18px] font-normal leading-[24.51px] tracking-[-0.114px] ">
                {data.date_of_birth}
              </p>
            </div>
            <div className="flex items-center justify-start gap-2 w-full py-2">
              <p className="font-open-sans text-[18px] font-semibold leading-[24.51px] tracking-[-0.114px]">
                Gender:
              </p>
              <p className="font-open-sans text-[18px] font-normal leading-[24.51px] tracking-[-0.114px] ">
                {data.gender}
              </p>
            </div>
            <div className="flex items-center justifu-start gap-2 w-full py-2">
              <p className="font-open-sans text-[18px] font-semibold leading-[24.51px] tracking-[-0.114px]">
                Age:
              </p>
              <p className="font-open-sans text-[18px] font-normal leading-[24.51px] tracking-[-0.114px] ">
                {data.age}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 mt-6">
          <p className="font-open-sans text-[22px] font-semibold leading-[29.96px] tracking-[-0.114px]">
            Upcoming Bookings
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-3 pt-2">
            {bookingData.length > 0 ? (
              bookingData.map((item, index) => (
                <div
                  key={item.id}
                  className="relative flex flex-col items-start justify-start bg-white rounded-xl p-3"
                >
                  <text className="text-2xl font-medium">{item.doctor}</text>
                  <text className="text-sm font-bold text-indigo-500">
                    {item.department}
                  </text>
                  <p className="mt-3 text-base font-semibold">
                    Date:{" "}
                    <text className="text-sm font-medium">{item.date}</text>
                  </p>
                  <p className="text-base font-semibold">
                    Timing:{" "}
                    <text className="text-sm font-medium">{item.time}</text>
                  </p>
                  <Link
                    onClick={() => handleOpenModal(item)}
                    className="absolute flex items-center justify-center p-2 bg-blue-700 hover:bg-blue-900 rounded-full top-4 right-4"
                  >
                    <FaEye className="text-lg text-white" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-gray-500 font-semibold text-start col-span-full">
                No appointments found.
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 mt-6">
          <p className="font-open-sans text-[22px] font-semibold leading-[29.96px] tracking-[-0.114px]">
            Your Documents
          </p>
          <div className="w-full mt-2">
            {documentData.length > 0 ? (
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-gray-200">Document Name</th>
                    <th className="py-2 px-4 bg-gray-200">Uploaded At</th>
                    <th className="py-2 px-4 bg-gray-200">Download</th>
                    <th className="py-2 px-4 bg-gray-200">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {documentData.map((doc) => (
                    <tr key={doc.id} className="border-b">
                      <td className="py-2 px-4">{doc.document_name}</td>
                      <td className="py-2 px-4">
                        {dayjs(doc.upload_date).format("DD MMM YYYY, hh:mm A")}
                      </td>
                      <td className="py-2 px-4">
                        <a
                          href={doc.document_file}
                          download
                          className="text-blue-500 hover:underline"
                        >
                          Download
                        </a>
                      </td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No documents uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
      {/* )} */}
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

export default Profile;
