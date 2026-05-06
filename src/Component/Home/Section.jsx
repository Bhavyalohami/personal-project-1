import axios from "axios";
import { useEffect, useState } from "react";
import { GoArrowDownRight } from "react-icons/go";
import { FaCalendarCheck, FaShieldHeart, FaUserDoctor } from "react-icons/fa6";
import BaseUrl from "../../Api/baseurl";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import AppointmentModal from "./appointmentmodal";

const Section = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const getData = async () => {
    const apiUrl = `${BaseUrl}clinic/configurations/`;
    try {
      const response = await axios.get(apiUrl);
      setData(response.data || {});
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleBookAppointment = () => {
    const token = Cookies.get("patient_token");
    if (!token) {
      Swal.fire({
        title: "You are not logged in!",
        text: "Would you like to continue as a guest or log in?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Continue as Guest",
        cancelButtonText: "Log In",
      }).then((result) => {
        if (result.isConfirmed) {
          setModalOpen(true);
        } else if (result.isDismissed) {
          navigate("/user/login");
        }
      });
    } else {
      setModalOpen(true);
    }
  };

  const title =
    data.slogan_title || "Expert healthcare, booked around your life";
  const subtitle =
    data.slogan_text ||
    "Find trusted specialists, choose the right time, and manage appointments with a calm, connected care experience.";

  return (
    <section className="relative isolate min-h-[76vh] overflow-hidden bg-[#ECFEFF] text-[#134E4A]">
      <img
        src="/brand/hero-care-teal.png"
        alt=""
        className="absolute inset-0 z-0 h-full w-full object-cover"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(236,254,255,0.16)_0%,rgba(236,254,255,0.74)_46%,rgba(236,254,255,0.98)_100%)]" />
      <div className="relative mx-auto flex min-h-[76vh] max-w-7xl flex-col justify-center px-5 py-20 sm:px-8 lg:px-12">
        <div className="max-w-2xl lg:ml-auto">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#67E8F9]/70 bg-white/80 px-4 py-2 text-sm font-black text-[#134E4A] shadow-sm backdrop-blur">
            <FaShieldHeart className="text-[#67E8F9]" />
            Connected care for every appointment
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-[#134E4A] sm:text-5xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#134E4A]/80 sm:text-lg">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0D9488] px-6 py-3 text-base font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[#0F766E]"
              onClick={handleBookAppointment}
            >
              Book Appointment
              <GoArrowDownRight className="h-5 w-5" />
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#67E8F9]/80 bg-white/80 px-6 py-3 text-base font-bold text-[#134E4A] shadow-sm backdrop-blur transition hover:border-[#0D9488] hover:text-[#0D9488]"
              onClick={() => navigate("/ourdoctors")}
            >
              <FaUserDoctor />
              Find Doctors
            </button>
          </div>
        </div>

        <div className="mt-12 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3 lg:ml-auto">
          <div className="flex items-center gap-3 rounded-xl border border-[#67E8F9]/60 bg-white/80 p-4 shadow-sm backdrop-blur">
            <FaCalendarCheck className="text-2xl text-[#67E8F9]" />
            <div>
              <p className="text-2xl font-black">24/7</p>
              <p className="text-sm text-[#134E4A]/70">Online booking</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[#67E8F9]/60 bg-white/80 p-4 shadow-sm backdrop-blur">
            <FaUserDoctor className="text-2xl text-[#F59E0B]" />
            <div>
              <p className="text-2xl font-black">50+</p>
              <p className="text-sm text-[#134E4A]/70">Specialist doctors</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[#67E8F9]/60 bg-white/80 p-4 shadow-sm backdrop-blur">
            <FaShieldHeart className="text-2xl text-[#67E8F9]" />
            <div>
              <p className="text-2xl font-black">Secure</p>
              <p className="text-sm text-[#134E4A]/70">Patient records</p>
            </div>
          </div>
        </div>
      </div>
      <AppointmentModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </section>
  );
};

export default Section;
