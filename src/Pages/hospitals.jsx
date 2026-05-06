import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import {
  FaArrowRight,
  FaHospital,
  FaLocationCrosshairs,
  FaLocationDot,
  FaMapLocationDot,
  FaMagnifyingGlass,
  FaVialCircleCheck,
} from "react-icons/fa6";
import { hmsApi } from "../firebase/hmsService";
import { setActiveHospitalId } from "../utils/hmsAccess";

const LOCATION_KEY = "carebridge-selected-location";

const cityOptions = ["New Delhi", "Noida", "Gurugram"];
const discoveryHeroImage = "/brand/hms/hospital-discovery-hero.png";
const hospitalImageFallbacks = {
  "default-hospital": "/brand/hms/hospital-discovery-hero.png",
  "noida-care-hospital": "/brand/hms/hospital-care-team.png",
  "gurugram-medtech-hospital": "/brand/hms/hospital-diagnostics-suite.png",
};

const defaultLocation = {
  city: "New Delhi",
  area: "Connaught Place",
  lat: 28.6315,
  lng: 77.2167,
};

const hospitalImage = (hospital) =>
  hospital?.heroImage || hospitalImageFallbacks[hospital?.id] || discoveryHeroImage;

const Hospitals = () => {
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCATION_KEY);
    if (stored) {
      try {
        setSelectedLocation({ ...defaultLocation, ...JSON.parse(stored) });
      } catch (error) {
        window.localStorage.removeItem(LOCATION_KEY);
      }
    }
  }, []);

  useEffect(() => {
    const fetchHospitals = async () => {
      setLoading(true);
      try {
        const params = {
          city: selectedLocation.city,
          lat: selectedLocation.lat || "",
          lng: selectedLocation.lng || "",
        };
        const data = await hmsApi.discoverHospitals(params);
        setHospitals(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Hospital discovery failed:", error);
        setHospitals([]);
      } finally {
        setLoading(false);
      }
    };

    window.localStorage.setItem(LOCATION_KEY, JSON.stringify(selectedLocation));
    fetchHospitals();
  }, [selectedLocation]);

  const filteredHospitals = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return hospitals;
    return hospitals.filter((hospital) =>
      [
        hospital.name,
        hospital.summary,
        hospital.location?.city,
        hospital.location?.area,
        hospital.location?.address,
        ...(hospital.specialties || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [hospitals, search]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSelectedLocation((current) => ({
          ...current,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          area: "Current location",
        }));
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const activeHospital = filteredHospitals[0];

  return (
    <main className="overflow-hidden bg-[#ECFEFF] text-[#134E4A]">
      <section className="relative px-5 py-12 sm:px-8 lg:px-12">
        <div className="absolute inset-0 care-scan-grid opacity-40" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-6 rounded-[2rem] border border-[#67E8F9]/50 bg-white/90 p-6 shadow-2xl shadow-teal-900/10 backdrop-blur lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#ECFEFF] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
              <FaMapLocationDot />
              Nearby hospital discovery
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
              Choose care by city, map, service, and live test slots.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#134E4A]/75">
              Find hospitals near you, review doctors and diagnostic services, then book appointments or test slots with hospital context saved.
            </p>

            <div className="mt-8 grid gap-3 rounded-[1.5rem] border border-[#67E8F9]/50 bg-[#ECFEFF]/75 p-4 sm:grid-cols-[1fr_auto]">
              <select
                value={selectedLocation.city}
                onChange={(event) =>
                  setSelectedLocation((current) => ({
                    ...current,
                    city: event.target.value,
                    area: "Manual selection",
                  }))
                }
                className="h-12 rounded-full border border-[#67E8F9]/70 bg-white px-5 text-sm font-black outline-none focus:border-[#0D9488] focus:ring-4 focus:ring-[#67E8F9]/30"
              >
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locating}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#134E4A] px-5 text-sm font-black text-white shadow-lg shadow-teal-900/10 disabled:opacity-60"
              >
                <FaLocationCrosshairs />
                {locating ? "Locating" : "Use GPS"}
              </button>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-[#67E8F9]/50 bg-[#134E4A] shadow-xl shadow-teal-900/10">
            <img
              src={discoveryHeroImage}
              alt="Futuristic hospital discovery dashboard"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#134E4A]/90 via-[#0D9488]/30 to-transparent" />
            <div className="absolute left-5 top-5 rounded-3xl border border-white/25 bg-white/90 p-4 shadow-xl backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">Live region</p>
              <p className="mt-1 text-2xl font-black text-[#134E4A]">{selectedLocation.city}</p>
            </div>
            <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-3">
              {[
                ["Hospitals", filteredHospitals.length || hospitals.length],
                ["Tests", "Live slots"],
                ["Map", activeHospital?.location?.area || "Nearby"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/20 bg-white/90 p-4 shadow-lg backdrop-blur">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#0D9488]">{label}</p>
                  <p className="mt-1 truncate text-lg font-black text-[#134E4A]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 rounded-[2rem] border border-[#67E8F9]/50 bg-white p-4 shadow-xl shadow-teal-900/10 md:flex-row md:items-center">
            <div className="relative flex-1">
              <FaMagnifyingGlass className="absolute left-5 top-1/2 -translate-y-1/2 text-[#0D9488]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search hospitals, services, city, expertise"
                className="h-14 w-full rounded-full border border-[#67E8F9]/60 bg-[#ECFEFF] pl-12 pr-5 text-sm font-bold outline-none focus:border-[#0D9488] focus:bg-white focus:ring-4 focus:ring-[#67E8F9]/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-full bg-[#ECFEFF] p-1">
              {["list", "map"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`rounded-full px-5 py-3 text-sm font-black capitalize transition ${
                    viewMode === mode ? "bg-[#0D9488] text-white" : "text-[#134E4A]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {viewMode === "map" ? (
            <div className="mt-6 overflow-hidden rounded-[2rem] border border-[#67E8F9]/50 bg-white shadow-xl shadow-teal-900/10">
              <iframe
                title="Selected city hospitals"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  `${selectedLocation.city} hospitals`,
                )}&z=12&output=embed`}
                className="h-[620px] w-full border-0"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {loading
                ? [...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="h-72 animate-pulse rounded-[2rem] border border-[#67E8F9]/40 bg-white"
                    />
                  ))
                : filteredHospitals.map((hospital) => (
                    <article
                      key={hospital.id}
                      className="group flex min-h-[420px] flex-col overflow-hidden rounded-[2rem] border border-[#67E8F9]/50 bg-white shadow-xl shadow-teal-900/10 transition hover:-translate-y-1 hover:border-[#0D9488]"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={hospitalImage(hospital)}
                          alt={hospital.name}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#134E4A]/85 via-transparent to-transparent" />
                        <span className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1 text-xs font-black text-[#0D9488]">
                          {hospital.location?.city}
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-4 p-5 pb-0">
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0D9488] text-xl text-white shadow-lg shadow-teal-900/15">
                          <FaHospital />
                        </span>
                        <span className="rounded-full bg-[#F59E0B] px-3 py-1 text-xs font-black text-[#134E4A]">
                          {hospital.distanceKm != null ? `${hospital.distanceKm} km` : hospital.location?.city}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-5 pt-0">
                        <h2 className="mt-5 text-2xl font-black leading-tight">{hospital.name}</h2>
                        <p className="mt-3 line-clamp-3 text-sm font-semibold leading-7 text-[#134E4A]/70">
                          {hospital.summary}
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <Rating value={Number(hospital.rating || 0)} precision={0.1} readOnly size="small" />
                          <span className="text-xs font-black text-[#134E4A]/60">
                            {hospital.rating || "4.5"} ({hospital.reviewCount || 0})
                          </span>
                        </div>
                        <p className="mt-4 flex items-start gap-2 text-sm font-bold text-[#134E4A]/65">
                          <FaLocationDot className="mt-1 shrink-0 text-[#0D9488]" />
                          {hospital.location?.address || hospital.location?.city}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {(hospital.specialties || []).slice(0, 3).map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-[#67E8F9]/50 bg-[#ECFEFF] px-3 py-1 text-[11px] font-black text-[#0D9488]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-auto p-5 pt-0">
                        <Link
                          to={`/hospitals/${hospital.id}`}
                          onClick={() => setActiveHospitalId(hospital.id)}
                          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#134E4A] px-5 text-sm font-black text-white transition hover:bg-[#0D9488]"
                        >
                          View Profile
                          <FaArrowRight />
                        </Link>
                      </div>
                    </article>
                  ))}
            </div>
          )}

          {!loading && !filteredHospitals.length && (
            <div className="mt-6 rounded-[2rem] border border-dashed border-[#67E8F9] bg-white p-10 text-center">
              <FaVialCircleCheck className="mx-auto text-4xl text-[#0D9488]" />
              <h2 className="mt-4 text-2xl font-black">No hospitals found</h2>
              <p className="mt-2 text-sm font-bold text-[#134E4A]/65">
                Try another city or clear your search.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Hospitals;
