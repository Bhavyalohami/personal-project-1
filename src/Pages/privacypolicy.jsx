import axios from "axios";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import BaseUrl from "../Api/baseurl";

const defaultPrivacyHtml = `
  <h2>Information We Collect</h2>
  <p>CareBridge may collect appointment details, contact information, profile data, doctor selections, preferred time slots, and messages you submit through the platform.</p>
  <h2>How We Use Information</h2>
  <p>We use this information to help clinics manage appointments, support patient communication, improve booking flows, and keep visit details organized.</p>
  <h2>Firebase and Platform Data</h2>
  <p>When Firebase services are connected, data may be stored in Firebase products such as Firestore, Authentication, Cloud Functions, Hosting, or Storage according to the project configuration.</p>
  <h2>Data Sharing</h2>
  <p>Appointment information may be shared with the clinic team, assigned doctors, and service providers needed to operate the platform. We do not sell patient appointment data.</p>
  <h2>Your Choices</h2>
  <p>You can request updates or corrections to your information by contacting the clinic team. Account users should keep login credentials private and sign out on shared devices.</p>
`;

const getTextValue = (page, fields) =>
  fields
    .map((field) => page?.[field])
    .find((value) => typeof value === "string" && value.trim().length > 0);

const PrivacyPolicy = () => {
  const [data, setData] = useState(null);
  const [hasApiError, setHasApiError] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${BaseUrl}clinic/managepages/privacy-policy`, {
          headers: { "Content-Type": "application/json" },
        });
        setData(response.data || null);
      } catch (error) {
        setHasApiError(true);
        console.error("Error fetching privacy policy:", error);
      }
    };

    getData();
  }, []);

  const title = getTextValue(data, ["title", "name", "page_title"]) || "Privacy Policy";
  const contentHtml =
    getTextValue(data, ["content", "text", "body", "html", "description"]) || defaultPrivacyHtml;

  return (
    <main className="overflow-hidden bg-[#ECFEFF] text-[#134E4A]">
      <section className="relative px-5 py-16 sm:px-8 lg:px-12">
        <div className="absolute inset-0 care-scan-grid opacity-40" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl rounded-3xl border border-[#67E8F9]/50 bg-white/80 p-8 shadow-2xl shadow-teal-900/10 backdrop-blur lg:p-12">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
            CareBridge privacy center
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#134E4A]/70">
            How appointment, account, and clinic workflow information is handled.
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
              <p>Applies to: patient bookings, guest requests, and clinic account flows.</p>
              <p>Firebase content can replace this copy from the admin panel.</p>
            </div>
          </aside>

          <article className="rounded-3xl border border-[#67E8F9]/50 bg-white p-6 shadow-xl shadow-teal-900/10 sm:p-8">
            {hasApiError && (
              <div className="mb-6 rounded-2xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-4 text-sm font-bold text-[#134E4A]">
                Showing standard CareBridge privacy copy while Firebase content is unavailable.
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

export default PrivacyPolicy;
