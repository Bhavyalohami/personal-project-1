import axios from "axios";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import BaseUrl from "../Api/baseurl";

const defaultTermsHtml = `
  <h2>Using CareBridge</h2>
  <p>CareBridge helps patients discover specialists, request appointments, and manage clinic visit details. By using this platform, you agree to provide accurate information and use the service only for lawful healthcare appointment purposes.</p>
  <h2>Appointments</h2>
  <p>Appointment availability is based on clinic and doctor schedules. A booking request may be confirmed, rescheduled, or cancelled if clinic availability changes.</p>
  <h2>Health Information</h2>
  <p>Content on this website is provided for general information. It does not replace professional medical advice, diagnosis, or treatment from a qualified healthcare provider.</p>
  <h2>Accounts and Guest Use</h2>
  <p>You are responsible for the details you submit through guest booking or patient login. Keep account credentials private and notify the clinic team if you suspect unauthorized access.</p>
  <h2>Payments and Clinic Policies</h2>
  <p>Any consultation fees, refunds, cancellations, or follow-up rules are handled according to the clinic policy shown during booking or communicated by the care team.</p>
`;

const getTextValue = (page, fields) =>
  fields
    .map((field) => page?.[field])
    .find((value) => typeof value === "string" && value.trim().length > 0);

const TermsofService = () => {
  const [data, setData] = useState(null);
  const [hasApiError, setHasApiError] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${BaseUrl}clinic/managepages/terms-of-service`, {
          headers: { "Content-Type": "application/json" },
        });
        setData(response.data || null);
      } catch (error) {
        setHasApiError(true);
        console.error("Error fetching terms of service:", error);
      }
    };

    getData();
  }, []);

  const title = getTextValue(data, ["title", "name", "page_title"]) || "Terms of Service";
  const contentHtml =
    getTextValue(data, ["content", "text", "body", "html", "description"]) || defaultTermsHtml;

  return (
    <main className="overflow-hidden bg-[#ECFEFF] text-[#134E4A]">
      <section className="relative px-5 py-16 sm:px-8 lg:px-12">
        <div className="absolute inset-0 care-scan-grid opacity-40" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl rounded-3xl border border-[#67E8F9]/50 bg-white/80 p-8 shadow-2xl shadow-teal-900/10 backdrop-blur lg:p-12">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
            CareBridge legal center
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#134E4A]/70">
            Clear rules for using the CareBridge clinic appointment platform.
          </p>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.34fr_0.66fr]">
          <aside className="h-max rounded-3xl border border-[#67E8F9]/50 bg-[#134E4A] p-6 text-white shadow-xl shadow-teal-900/10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#67E8F9]">
              Snapshot
            </p>
            <div className="mt-6 space-y-4 text-sm leading-7 text-cyan-50/80">
              <p>Last updated: May 4, 2026</p>
              <p>Applies to: patient, guest, doctor, and clinic workflows.</p>
              <p>Firebase content can replace this copy from the admin panel.</p>
            </div>
          </aside>

          <article className="rounded-3xl border border-[#67E8F9]/50 bg-white p-6 shadow-xl shadow-teal-900/10 sm:p-8">
            {hasApiError && (
              <div className="mb-6 rounded-2xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-4 text-sm font-bold text-[#134E4A]">
                Showing standard CareBridge terms while Firebase content is unavailable.
              </div>
            )}
            <div className="space-y-5 text-base leading-8 text-[#134E4A]/75 [&_h2]:pt-3 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-[#134E4A] [&_p]:leading-8">
              {parse(contentHtml)}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
};

export default TermsofService;
