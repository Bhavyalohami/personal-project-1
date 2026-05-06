import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Rating from "@mui/material/Rating";
import Swal from "sweetalert2";
import {
  FaArrowRight,
  FaCalendarCheck,
  FaClock,
  FaHospital,
  FaLocationDot,
  FaPhone,
  FaStethoscope,
  FaVialCircleCheck,
} from "react-icons/fa6";
import { hmsApi } from "../firebase/hmsService";
import { setActiveHospitalId } from "../utils/hmsAccess";

const imageUrl = (value) => value || "/brand/hms/hospital-diagnostics-suite.png";

const HospitalProfile = () => {
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedExpertise, setSelectedExpertise] = useState("");
  const [selectedTestId, setSelectedTestId] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [slots, setSlots] = useState([]);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await hmsApi.getHospitalProfile(hospitalId);
        setProfile(data);
        setSelectedTestId(data?.tests?.[0]?.id || "");
        setActiveHospitalId(hospitalId);
      } catch (error) {
        console.error("Hospital profile failed:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [hospitalId]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedTestId) {
        setSlots([]);
        return;
      }
      try {
        const data = await hmsApi.listTestSlots(hospitalId, selectedTestId);
        const nextSlots = Array.isArray(data) ? data : [];
        setSlots(nextSlots);
        setSelectedSlotId(nextSlots[0]?.id || "");
      } catch (error) {
        console.error("Test slots failed:", error);
        setSlots([]);
      }
    };
    fetchSlots();
  }, [hospitalId, selectedTestId]);

  const hospital = profile?.hospital;
  const media = useMemo(() => profile?.media || [], [profile]);
  const services = useMemo(() => profile?.services || [], [profile]);
  const doctors = useMemo(() => profile?.doctors || [], [profile]);
  const tests = useMemo(() => profile?.tests || [], [profile]);

  const expertiseOptions = useMemo(
    () =>
      Array.from(
        new Set(
          doctors
            .map((doctor) => doctor.expertise || doctor.department || doctor.designation)
            .filter(Boolean),
        ),
      ),
    [doctors],
  );

  const filteredDoctors = selectedExpertise
    ? doctors.filter((doctor) =>
        [doctor.expertise, doctor.department, doctor.designation]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(selectedExpertise.toLowerCase()),
      )
    : doctors;

  const selectedTest = tests.find((test) => test.id === selectedTestId);
  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);
  const profileHeroImage = imageUrl(media[0]?.url || hospital?.profileImage);
  const testBookingImage = imageUrl(selectedTest?.image || "/brand/hms/test-booking-lab.png");
  const galleryItems = media.slice(0, 2);
  const galleryGridClass =
    galleryItems.length > 1 ? "lg:grid-cols-2" : "lg:grid-cols-1";

  const handleBookTest = async () => {
    if (!selectedTest || !selectedSlot) return;
    const token = Cookies.get("patient_token");
    if (!token) {
      navigate("/user/login", { state: { from: `/hospitals/${hospitalId}` } });
      return;
    }

    setBooking(true);
    try {
      const result = await hmsApi.bookTestSlot(hospitalId, {
        testId: selectedTest.id,
        slotId: selectedSlot.id,
        userId: Cookies.get("patient_uid") || Cookies.get("patient_username"),
        patientName: Cookies.get("patient_username") || "Patient",
      });
      await Swal.fire({
        icon: "success",
        title: "Test slot booked",
        text: `${result.testName || selectedTest.name} is confirmed for ${selectedSlot.date} at ${selectedSlot.startTime}.`,
        confirmButtonColor: "#0D9488",
      });
      const data = await hmsApi.listTestSlots(hospitalId, selectedTestId);
      setSlots(Array.isArray(data) ? data : []);
      setSelectedSlotId("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Could not book slot",
        text: error?.response?.data?.error || error.message || "Please try again.",
        confirmButtonColor: "#0D9488",
      });
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#ECFEFF] px-5 py-20 text-[#134E4A]">
        <div className="mx-auto h-[520px] max-w-7xl animate-pulse rounded-[2rem] border border-[#67E8F9]/50 bg-white" />
      </main>
    );
  }

  if (!hospital) {
    return (
      <main className="min-h-screen bg-[#ECFEFF] px-5 py-20 text-center text-[#134E4A]">
        <FaHospital className="mx-auto text-5xl text-[#0D9488]" />
        <h1 className="mt-4 text-3xl font-black">Hospital not found</h1>
        <Link to="/hospitals" className="mt-6 inline-flex rounded-full bg-[#134E4A] px-6 py-3 font-black text-white">
          Back to hospitals
        </Link>
      </main>
    );
  }

  return (
    <main className="overflow-hidden bg-[#ECFEFF] text-[#134E4A]">
      <section className="px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-6 shadow-2xl shadow-teal-900/10 lg:p-10">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#ECFEFF] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
              <FaHospital />
              Hospital profile
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">{hospital.name}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#134E4A]/75">{hospital.summary}</p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B] px-4 py-2 text-sm font-black text-[#134E4A]">
                <FaLocationDot />
                {hospital.location?.area}, {hospital.location?.city}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#67E8F9]/60 bg-[#ECFEFF] px-4 py-2 text-sm font-black">
                <FaClock />
                {hospital.openingHours || "Open today"}
              </span>
              <span className="inline-flex items-center gap-2">
                <Rating value={Number(hospital.rating || 0)} precision={0.1} readOnly size="small" />
                <span className="text-sm font-black">{hospital.rating}</span>
              </span>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${hospital.contact?.phone || ""}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#67E8F9]/70 px-6 text-sm font-black text-[#134E4A]"
              >
                <FaPhone />
                Call Hospital
              </a>
              <Link
                to={`/booking?hospitalId=${hospital.id || hospital.hospitalId}`}
                onClick={() => setActiveHospitalId(hospital.id || hospital.hospitalId)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#134E4A] px-6 text-sm font-black text-white transition hover:bg-[#0D9488]"
              >
                <FaCalendarCheck />
                Book Appointment
              </Link>
            </div>
          </div>

          <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-[#67E8F9]/50 bg-[#134E4A] shadow-2xl shadow-teal-900/10">
            <img
              src={profileHeroImage}
              alt={media[0]?.title || hospital.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#134E4A]/25 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {galleryItems.length > 0 && (
      <section className="px-5 pb-8 sm:px-8 lg:px-12">
        <div className={`mx-auto grid max-w-7xl gap-5 ${galleryGridClass}`}>
          {galleryItems.map((item) => (
            <img
              key={item.id}
              src={imageUrl(item.url)}
              alt={item.title || "Hospital media"}
              className="h-72 w-full rounded-[2rem] border border-[#67E8F9]/50 object-cover shadow-xl shadow-teal-900/10"
            />
          ))}
        </div>
      </section>
      )}

      <section className="px-5 pb-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.72fr_0.28fr]">
          <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-6 shadow-xl shadow-teal-900/10">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">Doctors</p>
                <h2 className="mt-2 text-3xl font-black">Filter specialists by expertise</h2>
              </div>
              <select
                value={selectedExpertise}
                onChange={(event) => setSelectedExpertise(event.target.value)}
                className="h-12 rounded-full border border-[#67E8F9]/70 bg-[#ECFEFF] px-5 text-sm font-black outline-none focus:border-[#0D9488]"
              >
                <option value="">All expertise</option>
                {expertiseOptions.map((expertise) => (
                  <option key={expertise} value={expertise}>
                    {expertise}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {filteredDoctors.map((doctor) => (
                <article key={doctor.id} className="rounded-[1.5rem] border border-[#67E8F9]/45 bg-[#ECFEFF]/60 p-4">
                  <div className="flex gap-4">
                    <img
                      src={doctor.image || "/brand/doctor-avatar-teal.png"}
                      alt={doctor.name || doctor.fname}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-black">
                        {doctor.name || `${doctor.fname || ""} ${doctor.lname || ""}`}
                      </h3>
                      <p className="mt-1 text-sm font-bold text-[#0D9488]">
                        {doctor.expertise || doctor.department}
                      </p>
                      <p className="mt-1 text-xs font-bold text-[#134E4A]/60">
                        {doctor.yoe || doctor.experience || 8}+ years experience
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/profiledoctor/${doctor.id}`}
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-black text-[#134E4A] transition hover:bg-[#0D9488] hover:text-white"
                  >
                    View Doctor
                    <FaArrowRight />
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-6 shadow-xl shadow-teal-900/10">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">Services</p>
              <div className="mt-4 space-y-3">
                {services.slice(0, 6).map((service) => (
                  <div key={service.id} className="flex items-start gap-3 rounded-2xl bg-[#ECFEFF] p-3">
                    <FaStethoscope className="mt-1 text-[#0D9488]" />
                    <div>
                      <p className="font-black">{service.name}</p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-[#134E4A]/65">{service.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-[#67E8F9]/50 bg-white shadow-xl shadow-teal-900/10">
              <iframe
                title={`${hospital.name} map`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  hospital.location?.address || hospital.name,
                )}&z=14&output=embed`}
                className="h-80 w-full border-0"
                loading="lazy"
              />
            </div>
          </aside>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-[2rem] border border-[#67E8F9]/50 bg-[#134E4A] p-6 text-white shadow-2xl shadow-teal-900/20 lg:grid-cols-[0.62fr_0.38fr] lg:p-8">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[#67E8F9]">
              <FaVialCircleCheck />
              Diagnostic test booking
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-5xl">Book a lab or imaging slot.</h2>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-cyan-50/75">
              Choose a hospital test and live slot. Capacity is reduced when the booking is confirmed.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {tests.map((test) => (
                <button
                  key={test.id}
                  type="button"
                  onClick={() => setSelectedTestId(test.id)}
                  className={`rounded-[1.5rem] border p-4 text-left transition ${
                    selectedTestId === test.id
                      ? "border-[#67E8F9] bg-white text-[#134E4A]"
                      : "border-white/15 bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  <p className="text-lg font-black">{test.name}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-wide opacity-70">
                    {test.category} / {test.durationMinutes} min
                  </p>
                  <p className="mt-3 text-xl font-black text-[#F59E0B]">Rs. {test.price}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.7rem] border border-white/20 bg-white text-[#134E4A] shadow-xl">
            <div className="relative h-44">
              <img
                src={testBookingImage}
                alt={selectedTest?.name || "Diagnostic test booking"}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#134E4A]/75 to-transparent" />
              <span className="absolute bottom-4 left-4 rounded-full bg-[#F59E0B] px-4 py-2 text-xs font-black text-[#134E4A]">
                Capacity-aware slots
              </span>
            </div>
            <div className="p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">Available slots</p>
            <h3 className="mt-2 text-2xl font-black">{selectedTest?.name || "Select a test"}</h3>
            <div className="mt-4 space-y-2">
              {slots.length ? (
                slots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left transition ${
                      selectedSlotId === slot.id
                        ? "border-[#0D9488] bg-[#ECFEFF]"
                        : "border-[#67E8F9]/50 bg-white hover:bg-[#ECFEFF]"
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-black">{slot.date}</span>
                      <span className="text-xs font-bold text-[#134E4A]/60">{slot.startTime}</span>
                    </span>
                    <span className="rounded-full bg-[#F59E0B] px-3 py-1 text-xs font-black">
                      {slot.availableCapacity} left
                    </span>
                  </button>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-[#67E8F9] bg-[#ECFEFF] p-5 text-sm font-bold">
                  No slots available for this test.
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleBookTest}
              disabled={!selectedSlotId || booking}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#F59E0B] px-5 text-sm font-black text-[#134E4A] shadow-lg shadow-amber-900/10 disabled:opacity-50"
            >
              <FaVialCircleCheck />
              {booking ? "Booking" : "Book Test Slot"}
            </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HospitalProfile;
