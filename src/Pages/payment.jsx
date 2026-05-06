import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import BaseUrl from "../Api/baseurl";
import CheckoutForm from "../Component/checkout";
import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import {
  FaCalendarCheck,
  FaCreditCard,
  FaHeartPulse,
  FaShieldHeart,
  FaUserDoctor,
} from "react-icons/fa6";

const stripePromise = loadStripe(
  "pk_test_51OJr08SHckEzL7TQ6pF3BxJ6Wi0PG3dpfBxFVvQZlCGyIhb6ySP7f5jfJo2klHGKrthrrdvH9bYbTS6CD2hzuHXi00HJ5f1Hy2"
);

const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { appointmentDetails } = location.state || {};

  useEffect(() => {
    if (!appointmentDetails) return;

    fetch(`${BaseUrl}clinic/PayWithStripe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: appointmentDetails.amount,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.demoMode || !data.clientSecret) {
          setDemoMode(true);
          return;
        }
        setClientSecret(data.clientSecret);
      })
      .catch(() => setDemoMode(true));
  }, [appointmentDetails]);

  const confirmDemoAppointment = async () => {
    setIsSaving(true);
    try {
      await axios.post(`${BaseUrl}clinic/submit-appointment`, {
        ...appointmentDetails,
        payment_status: 1,
      });
      await Swal.fire({
        title: "Appointment Booked",
        text: "Your appointment has been saved in demo mode.",
        icon: "success",
        confirmButtonText: "Done",
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        title: "Booking failed",
        text: "Please try again.",
        icon: "error",
        confirmButtonText: "Close",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#0D9488",
      colorBackground: "#ffffff",
      colorText: "#134E4A",
      borderRadius: "16px",
      fontFamily: "Inter, system-ui, sans-serif",
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  const summary = appointmentDetails
    ? [
        ["Patient", appointmentDetails.name || "Guest patient"],
        ["Doctor", appointmentDetails.doctor || "Not selected"],
        ["Department", appointmentDetails.department || "Not selected"],
        ["Location", appointmentDetails.location || "Not selected"],
        [
          "Date",
          appointmentDetails.date
            ? dayjs(appointmentDetails.date).format("DD MMM YYYY")
            : "Not selected",
        ],
        ["Time", appointmentDetails.time || "Not selected"],
        ["Amount", `$${appointmentDetails.amount || 0}`],
      ]
    : [];

  if (!appointmentDetails) {
    return (
      <main className="min-h-[70vh] bg-[#ECFEFF] px-5 py-16 text-[#134E4A] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#67E8F9]/50 bg-white p-8 text-center shadow-2xl shadow-teal-900/10">
          <FaCreditCard className="mx-auto text-5xl text-[#0D9488]" />
          <h1 className="mt-5 text-4xl font-black">No appointment to review</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#134E4A]/70">
            Payment opens after you select a doctor, date, and appointment time.
          </p>
          <Link
            to="/ourdoctors"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#0D9488] px-7 text-sm font-black text-white transition hover:bg-[#0F766E]"
          >
            Find Doctors
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="overflow-hidden bg-[#ECFEFF] text-[#134E4A]">
      <section className="relative px-5 py-12 sm:px-8 lg:px-12">
        <div className="absolute inset-0 care-scan-grid opacity-40" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-[#67E8F9]/50 bg-white/85 p-6 shadow-2xl shadow-teal-900/10 backdrop-blur lg:grid-cols-[0.92fr_1.08fr] lg:p-10">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#67E8F9]/60 bg-[#ECFEFF] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
              <FaShieldHeart />
              Secure appointment review
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">
              Confirm the visit before it becomes official.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#134E4A]/75">
              Review the care details, then finish payment or confirm the demo
              booking in your Firebase-backed appointment flow.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                [<FaCalendarCheck />, "Slot selected"],
                [<FaUserDoctor />, "Doctor matched"],
                [<FaHeartPulse />, "Care ready"],
              ].map(([icon, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[#67E8F9]/50 bg-white p-4 shadow-sm"
                >
                  <div className="text-xl text-[#0D9488]">{icon}</div>
                  <p className="mt-3 text-sm font-black">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-[#134E4A] p-6 text-white shadow-xl shadow-teal-900/10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#67E8F9]">
              Appointment summary
            </p>
            <div className="mt-6 space-y-3">
              {summary.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 text-sm"
                >
                  <span className="text-cyan-50/65">{label}</span>
                  <span className="max-w-[58%] text-right font-black">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#67E8F9]/50 bg-white p-6 shadow-2xl shadow-teal-900/10 sm:p-8">
          {demoMode && (
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                Demo payment mode
              </p>
              <h2 className="mt-3 text-3xl font-black">Confirm your appointment</h2>
              <p className="mt-4 text-sm leading-7 text-[#134E4A]/70">
                Stripe is not configured in the local Firebase mock, so this
                action saves the appointment as paid in demo mode.
              </p>
              <button
                type="button"
                onClick={confirmDemoAppointment}
                disabled={isSaving}
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#F59E0B] px-7 text-sm font-black text-[#134E4A] shadow-xl shadow-amber-900/10 transition hover:bg-[#67E8F9] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Confirm Appointment"}
              </button>
            </div>
          )}

          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm appointmentDetails={appointmentDetails} />
            </Elements>
          )}

          {!clientSecret && !demoMode && (
            <div className="flex min-h-56 flex-col items-center justify-center text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#67E8F9] border-t-[#0D9488]" />
              <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                Preparing payment
              </p>
              <p className="mt-2 text-sm text-[#134E4A]/70">
                Connecting to the payment provider.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default PaymentPage;
