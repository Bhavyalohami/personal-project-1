import { useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import BaseUrl from "../Api/baseurl";
import axios from "axios";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { FaCreditCard, FaLock } from "react-icons/fa6";

const CheckoutForm = ({ appointmentDetails }) => {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message);
      await Swal.fire({
        title: error.message,
        icon: "warning",
        confirmButtonText: "Close",
      });
      setIsLoading(false);
      return;
    }

    try {
      const token = Cookies.get("patient_token");
      const paidAppointment = {
        ...appointmentDetails,
        payment_status: 1,
      };

      await axios.post(`${BaseUrl}clinic/submit-appointment`, paidAppointment, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
      });

      await Swal.fire({
        title: "Success!",
        html: `
          <div style="text-align:left">
            <p><strong>Name:</strong> ${paidAppointment.name}</p>
            <p><strong>Date:</strong> ${dayjs(paidAppointment.date).format("DD MMMM YYYY")}</p>
            <p><strong>Time:</strong> ${paidAppointment.time}</p>
            <p><strong>Location:</strong> ${paidAppointment.location}</p>
            <p><strong>Department:</strong> ${paidAppointment.department}</p>
            <p><strong>Doctor:</strong> ${paidAppointment.doctor}</p>
          </div>`,
        icon: "success",
        confirmButtonText: "Done",
      });

      navigate("/");
    } catch (error) {
      console.error(error);
      setMessage("Payment succeeded, but saving the appointment failed.");
      Swal.fire({
        title: "Booking save failed",
        text: "Payment completed, but the appointment could not be saved. Please contact the clinic.",
        icon: "error",
        confirmButtonText: "Close",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
            Card payment
          </p>
          <h2 className="mt-2 text-3xl font-black text-[#134E4A]">
            Secure checkout
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFEFF] px-4 py-2 text-sm font-bold text-[#134E4A]">
          <FaLock className="text-[#0D9488]" />
          Protected
        </div>
      </div>

      <div className="rounded-3xl border border-[#67E8F9]/50 bg-[#ECFEFF]/60 p-4">
        <PaymentElement id="payment-element" />
      </div>

      {message && (
        <div className="mt-5 rounded-2xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-4 text-sm font-bold text-[#134E4A]">
          {message}
        </div>
      )}

      <button
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0D9488] px-7 text-sm font-black text-white shadow-xl shadow-teal-900/10 transition hover:bg-[#0F766E] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isLoading || !stripe || !elements}
        id="submit"
      >
        <FaCreditCard />
        {isLoading ? "Processing..." : "Pay now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
