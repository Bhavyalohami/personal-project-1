import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FaCalendarCheck,
  FaEnvelope,
  FaHeadset,
  FaLocationDot,
  FaPhoneVolume,
  FaShieldHeart,
} from "react-icons/fa6";
import { IoSend, IoSparkles } from "react-icons/io5";
import BaseUrl from "../Api/baseurl";

const initialContactData = {
  name: "",
  email: "",
  subject: "",
  message: "",
  phone: "",
};

const initialErrors = {
  nameError: "",
  emailError: "",
  subjectError: "",
  messageError: "",
  phoneError: "",
  consentError: "",
};

const contactTiles = [
  {
    label: "Patient helpdesk",
    value: "Appointments, follow-ups, and care records",
    icon: <FaHeadset />,
  },
  {
    label: "Booking response",
    value: "Same-day triage for urgent requests",
    icon: <FaCalendarCheck />,
  },
  {
    label: "Secure handling",
    value: "Your details stay inside the care workflow",
    icon: <FaShieldHeart />,
  },
];

const faqs = [
  {
    question: "Can I book without logging in?",
    answer:
      "Yes. You can start as a guest, confirm the appointment, and later log in to keep your care profile ready for follow-ups.",
  },
  {
    question: "How quickly will the clinic respond?",
    answer:
      "Appointment and contact requests are designed for quick triage. The clinic team can follow up by phone or email based on the details you submit.",
  },
  {
    question: "Can I contact a specific doctor?",
    answer:
      "Use the doctor profile or booking flow for doctor-specific requests. General questions can be sent from this page and routed by the care team.",
  },
];

const ContactUs = () => {
  const [data, setData] = useState({
    email_address: "",
    address: "",
    contact_number: "",
    timings_weekday: "",
    timings_weekend: "",
  });
  const [contactData, setContactData] = useState(initialContactData);
  const [errorData, setErrorData] = useState(initialErrors);
  const [hasConsent, setHasConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const { name, email, subject, message, phone } = contactData;
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const errors = { ...initialErrors };

    if (!name.trim()) {
      errors.nameError = "Please enter your name.";
      isValid = false;
    }

    if (!subject.trim()) {
      errors.subjectError = "Please enter a subject.";
      isValid = false;
    }

    if (!email.trim()) {
      errors.emailError = "Please enter your email address.";
      isValid = false;
    } else if (!email.match(validRegex)) {
      errors.emailError = "Please enter a valid email address.";
      isValid = false;
    }

    if (!message.trim()) {
      errors.messageError = "Please enter your message.";
      isValid = false;
    }

    if (!phone.trim()) {
      errors.phoneError = "Please enter your contact number.";
      isValid = false;
    } else if (phone.length !== 10) {
      errors.phoneError = "Please enter a 10-digit contact number.";
      isValid = false;
    }

    if (!hasConsent) {
      errors.consentError = "Please confirm that the clinic can contact you.";
      isValid = false;
    }

    setErrorData(errors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await axios.post(`${BaseUrl}clinic/submit-contact/`, contactData, {
        headers: { "Content-Type": "application/json" },
      });
      Swal.fire({
        title: "Message sent",
        text: "Your request has been shared with the CareBridge team.",
        icon: "success",
        confirmButtonText: "Done",
      });
      setContactData(initialContactData);
      setErrorData(initialErrors);
      setHasConsent(false);
    } catch (error) {
      Swal.fire({
        title: "Unable to send",
        text: `There was an issue submitting your request: ${error.message}`,
        icon: "error",
        confirmButtonText: "Close",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setContactData((current) => ({ ...current, [name]: nextValue }));
    setErrorData((current) => ({ ...current, [`${name}Error`]: "" }));
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BaseUrl}clinic/address/`, {
        headers: { "Content-Type": "application/json" },
      });
      setData(response.data || {});
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const contactCards = [
    {
      title: "Call",
      value: data.contact_number ? `(+91) ${data.contact_number}` : "+91 98765 43210",
      icon: <FaPhoneVolume />,
      href: `tel:${data.contact_number || "9876543210"}`,
    },
    {
      title: "Email",
      value: data.email_address || "care@carebridge.example",
      icon: <FaEnvelope />,
      href: `mailto:${data.email_address || "care@carebridge.example"}`,
    },
    {
      title: "Visit",
      value: data.address || "22 Wellness Avenue, New Delhi, India",
      icon: <FaLocationDot />,
      href: "https://www.google.com/maps",
    },
  ];

  return (
    <main className="overflow-hidden bg-[#ECFEFF] text-[#134E4A]">
      <section className="relative px-5 py-14 sm:px-8 lg:px-12">
        <div className="absolute inset-0 care-scan-grid opacity-45" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#67E8F9]/70 bg-white/85 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-[#0D9488] shadow-sm backdrop-blur">
              <IoSparkles />
              Contact CareBridge
            </p>
            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-6xl">
              Talk to the care team before your next visit.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#134E4A]/75">
              Send appointment questions, hospital enquiries, or follow-up
              requests into one clean care channel. We will route the message to
              the right team.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {contactTiles.map((tile) => (
                <div
                  key={tile.label}
                  className="rounded-2xl border border-[#67E8F9]/40 bg-white/85 p-4 shadow-sm backdrop-blur"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#CCFBF1] text-lg text-[#0D9488]">
                    {tile.icon}
                  </div>
                  <p className="text-sm font-black">{tile.label}</p>
                  <p className="mt-1 text-xs leading-5 text-[#134E4A]/65">
                    {tile.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="care-float overflow-hidden rounded-[2rem] border border-[#67E8F9]/50 bg-white shadow-2xl shadow-teal-900/10">
              <img
                src="/brand/auth-care-teal.png"
                alt="CareBridge support team"
                className="h-[470px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-6 right-6 rounded-3xl border border-white/75 bg-white/90 p-5 shadow-xl shadow-teal-900/10 backdrop-blur">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                Clinic availability
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <p className="rounded-2xl bg-[#ECFEFF] p-4 text-sm font-bold">
                  Weekdays: {data.timings_weekday || "Available"}
                </p>
                <p className="rounded-2xl bg-[#ECFEFF] p-4 text-sm font-bold">
                  Weekend: {data.timings_weekend || "Available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#67E8F9]/40 bg-[#134E4A] py-4 text-white">
        <div className="care-marquee flex w-max gap-8 text-sm font-black uppercase tracking-[0.18em] text-cyan-50/85">
          {[...Array(2)].map((_, group) => (
            <div key={group} className="flex gap-8">
              {[
                "Appointment support",
                "Hospital enquiries",
                "Doctor routing",
                "Follow-up help",
                "Secure message intake",
                "Patient-first response",
              ].map((item) => (
                <span key={`${group}-${item}`} className="inline-flex items-center gap-2">
                  <FaShieldHeart className="text-[#67E8F9]" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
              Reach us
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
              Choose the quickest channel.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#134E4A]/70">
              For appointments, reports, test bookings, or hospital questions,
              use the details below or send a direct request.
            </p>

            <div className="mt-8 grid gap-4">
              {contactCards.map((card) => (
                <a
                  key={card.title}
                  href={card.href}
                  target={card.title === "Visit" ? "_blank" : undefined}
                  rel={card.title === "Visit" ? "noreferrer" : undefined}
                  className="group flex gap-4 rounded-3xl border border-[#67E8F9]/40 bg-[#ECFEFF] p-5 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-teal-900/10"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white p-4 text-xl text-[#0D9488] shadow-sm group-hover:bg-[#0D9488] group-hover:text-white">
                    {card.icon}
                  </span>
                  <span>
                    <span className="block text-sm font-black uppercase tracking-[0.16em] text-[#0D9488]">
                      {card.title}
                    </span>
                    <span className="mt-1 block text-base font-bold leading-7 text-[#134E4A]">
                      {card.value}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-[#67E8F9]/40 bg-[#ECFEFF] p-5 shadow-2xl shadow-teal-900/10 sm:p-8"
          >
            <div className="flex flex-col justify-between gap-4 border-b border-[#67E8F9]/40 pb-6 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                  Send a request
                </p>
                <h2 className="mt-2 text-3xl font-black">How can we help?</h2>
              </div>
              <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#0D9488] shadow-sm">
                Firebase-ready
              </span>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-black">Full name</span>
                <input
                  onChange={handleChange}
                  value={contactData.name}
                  name="name"
                  placeholder="Your name"
                  className="mt-2 w-full rounded-2xl border border-[#67E8F9]/60 bg-white px-4 py-4 text-sm font-semibold outline-none transition focus:border-[#0D9488] focus:ring-4 focus:ring-[#67E8F9]/25"
                />
                {errorData.nameError && (
                  <span className="mt-2 block text-sm font-semibold text-red-600">
                    {errorData.nameError}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-black">Email address</span>
                <input
                  onChange={handleChange}
                  value={contactData.email}
                  name="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-2xl border border-[#67E8F9]/60 bg-white px-4 py-4 text-sm font-semibold outline-none transition focus:border-[#0D9488] focus:ring-4 focus:ring-[#67E8F9]/25"
                />
                {errorData.emailError && (
                  <span className="mt-2 block text-sm font-semibold text-red-600">
                    {errorData.emailError}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-black">Subject</span>
                <input
                  onChange={handleChange}
                  value={contactData.subject}
                  name="subject"
                  placeholder="Appointment enquiry"
                  className="mt-2 w-full rounded-2xl border border-[#67E8F9]/60 bg-white px-4 py-4 text-sm font-semibold outline-none transition focus:border-[#0D9488] focus:ring-4 focus:ring-[#67E8F9]/25"
                />
                {errorData.subjectError && (
                  <span className="mt-2 block text-sm font-semibold text-red-600">
                    {errorData.subjectError}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-black">Contact number</span>
                <input
                  onChange={handleChange}
                  value={contactData.phone}
                  name="phone"
                  inputMode="numeric"
                  placeholder="9876543210"
                  className="mt-2 w-full rounded-2xl border border-[#67E8F9]/60 bg-white px-4 py-4 text-sm font-semibold outline-none transition focus:border-[#0D9488] focus:ring-4 focus:ring-[#67E8F9]/25"
                />
                {errorData.phoneError && (
                  <span className="mt-2 block text-sm font-semibold text-red-600">
                    {errorData.phoneError}
                  </span>
                )}
              </label>
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-black">Message</span>
              <textarea
                onChange={handleChange}
                name="message"
                value={contactData.message}
                placeholder="Tell us what you need help with."
                className="mt-2 h-36 w-full resize-none rounded-2xl border border-[#67E8F9]/60 bg-white px-4 py-4 text-sm font-semibold outline-none transition focus:border-[#0D9488] focus:ring-4 focus:ring-[#67E8F9]/25"
              />
              {errorData.messageError && (
                <span className="mt-2 block text-sm font-semibold text-red-600">
                  {errorData.messageError}
                </span>
              )}
            </label>

            <label className="mt-5 flex items-start gap-3 rounded-2xl border border-[#67E8F9]/50 bg-white p-4">
              <input
                type="checkbox"
                checked={hasConsent}
                onChange={(event) => {
                  setHasConsent(event.target.checked);
                  setErrorData((current) => ({ ...current, consentError: "" }));
                }}
                className="mt-1 h-5 w-5 rounded border-[#0D9488] accent-[#0D9488]"
              />
              <span className="text-sm font-semibold leading-6 text-[#134E4A]/75">
                I agree that the clinic can contact me about this request by
                phone or email.
                {errorData.consentError && (
                  <span className="mt-1 block font-bold text-red-600">
                    {errorData.consentError}
                  </span>
                )}
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#0D9488] px-6 py-4 text-sm font-black text-white shadow-xl shadow-teal-900/10 transition hover:bg-[#0F766E] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              <IoSend />
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[2rem] border border-[#67E8F9]/40 bg-white shadow-xl shadow-teal-900/10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28474.825843946717!2d75.7683882!3d26.8605163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db501daebe0ab%3A0x9bf33abbdc8d0f98!2sAmar%20Medical%20%26%20Research%20Centre!5e0!3m2!1sen!2sin!4v1721126403454!5m2!1sen!2sin"
              className="h-[420px] w-full"
              title="CareBridge clinic location map"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
              Clear answers before you book.
            </h2>
            <div className="mt-7 space-y-3">
              {faqs.map((faq, index) => (
                <details
                  key={faq.question}
                  open={index === 0}
                  className="group rounded-2xl border border-[#67E8F9]/40 bg-white p-5 shadow-sm"
                >
                  <summary className="cursor-pointer list-none text-base font-black">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-[#134E4A]/70">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactUs;
