import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Rating from "@mui/material/Rating";
import BaseUrl from "../Api/baseurl";
import {
  FaArrowRight,
  FaFilter,
  FaHeartPulse,
  FaLocationDot,
  FaMagnifyingGlass,
  FaSliders,
  FaUserDoctor,
} from "react-icons/fa6";

const DoctorListing = () => {
  const [staffData, setStaffData] = useState([]);
  const [location, setLocation] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const getStaffData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BaseUrl}clinic/allstaff`);
        setStaffData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching staff data:", error);
      } finally {
        setLoading(false);
      }
    };

    const getLocation = async () => {
      try {
        const response = await axios.get(`${BaseUrl}clinic/managelocation/`);
        setLocation(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching locations:", error.message);
      }
    };

    const getDepartments = async () => {
      try {
        const response = await axios.get(`${BaseUrl}clinic/managedepartment`);
        setDepartments(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching departments:", error.message);
      }
    };

    getStaffData();
    getLocation();
    getDepartments();
  }, []);

  const activeDoctors = useMemo(
    () => staffData.filter((staff) => staff.status === 1),
    [staffData]
  );

  const filteredStaffData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const minRating = selectedRating ? Number(selectedRating) : null;

    return activeDoctors.filter((staff) => {
      const isLocationMatch = selectedLocation
        ? staff.location?.toLowerCase() === selectedLocation.toLowerCase()
        : true;

      const isDepartmentMatch = selectedDepartment
        ? staff.department?.toLowerCase() === selectedDepartment.toLowerCase()
        : true;

      const isRatingMatch = minRating
        ? Number(staff.average_rating || 0) >= minRating
        : true;

      const searchableText = [
        staff.fname,
        staff.lname,
        staff.department,
        staff.location,
        staff.role,
        staff.designation,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        isLocationMatch &&
        isDepartmentMatch &&
        isRatingMatch &&
        (query ? searchableText.includes(query) : true)
      );
    });
  }, [
    activeDoctors,
    searchQuery,
    selectedDepartment,
    selectedLocation,
    selectedRating,
  ]);

  const featuredDoctor = activeDoctors[0];
  const metricCards = [
    [activeDoctors.length || "20+", "verified specialists"],
    [departments.filter((item) => item.status === 1).length || "6", "care departments"],
    ["24/7", "booking access"],
  ];

  const clearFilters = () => {
    setSelectedLocation("");
    setSelectedDepartment("");
    setSelectedRating("");
    setSearchQuery("");
  };

  return (
    <main className="overflow-hidden bg-[#ECFEFF] text-[#134E4A]">
      <section className="relative px-5 py-12 sm:px-8 lg:px-12">
        <div className="absolute inset-0 care-scan-grid opacity-40" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-[#67E8F9]/50 bg-white/85 p-6 shadow-2xl shadow-teal-900/10 backdrop-blur lg:grid-cols-[1fr_0.78fr] lg:p-10">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#67E8F9]/60 bg-[#ECFEFF] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
              <FaUserDoctor />
              Specialist network
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
              Find the right doctor without the old waiting-room friction.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#134E4A]/75">
              Search by name, department, city, rating, or care focus, then move
              directly into a live appointment slot.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {metricCards.map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[#67E8F9]/50 bg-white p-4 shadow-sm"
                >
                  <p className="text-2xl font-black text-[#0D9488]">{value}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-wide text-[#134E4A]/65">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-[#67E8F9]/50 bg-[#134E4A] shadow-xl shadow-teal-900/10">
            <img
              src={featuredDoctor?.image || "/brand/team-care-teal.png"}
              alt="Featured doctor"
              className="h-[420px] w-full object-cover opacity-95"
            />
            <div className="absolute inset-x-5 bottom-5 rounded-3xl border border-white/50 bg-white/90 p-5 shadow-xl backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
                Featured care
              </p>
              <h2 className="mt-2 text-2xl font-black">
                {featuredDoctor
                  ? `${featuredDoctor.fname} ${featuredDoctor.lname}`
                  : "CareBridge Doctors"}
              </h2>
              <p className="mt-1 text-sm font-bold text-[#134E4A]/65">
                {featuredDoctor?.department || "Clinic + wellness technology"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#67E8F9]/50 bg-white p-4 shadow-xl shadow-teal-900/10 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
            <div className="relative flex-1">
              <FaMagnifyingGlass className="absolute left-5 top-1/2 -translate-y-1/2 text-[#0D9488]" />
              <input
                className="h-14 w-full rounded-full border border-[#67E8F9]/60 bg-[#ECFEFF]/70 pl-12 pr-5 text-sm font-bold outline-none transition placeholder:text-[#134E4A]/45 focus:border-[#0D9488] focus:bg-white focus:ring-4 focus:ring-[#67E8F9]/30"
                type="text"
                placeholder="Search by name, department, location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#134E4A] px-6 text-sm font-black text-white shadow-lg shadow-teal-900/10 xl:hidden"
            >
              <FaFilter />
              Filters
            </button>

            <div
              className={`grid gap-3 ${
                isFilterOpen ? "grid" : "hidden"
              } xl:grid xl:grid-cols-[220px_240px_170px_auto]`}
            >
              <select
                className="h-14 rounded-full border border-[#67E8F9]/60 bg-[#ECFEFF]/70 px-5 text-sm font-bold outline-none focus:border-[#0D9488] focus:bg-white focus:ring-4 focus:ring-[#67E8F9]/30"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                aria-label="Filter by location"
              >
                <option value="">All locations</option>
                {location.map(
                  (loc) =>
                    loc.status === 1 && (
                      <option key={loc.id} value={loc.name}>
                        {loc.name}
                      </option>
                    )
                )}
              </select>

              <select
                className="h-14 rounded-full border border-[#67E8F9]/60 bg-[#ECFEFF]/70 px-5 text-sm font-bold outline-none focus:border-[#0D9488] focus:bg-white focus:ring-4 focus:ring-[#67E8F9]/30"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                aria-label="Filter by department"
              >
                <option value="">All departments</option>
                {departments.map(
                  (dep) =>
                    dep.status === 1 && (
                      <option key={dep.id} value={dep.name}>
                        {dep.name}
                      </option>
                    )
                )}
              </select>

              <select
                className="h-14 rounded-full border border-[#67E8F9]/60 bg-[#ECFEFF]/70 px-5 text-sm font-bold outline-none focus:border-[#0D9488] focus:bg-white focus:ring-4 focus:ring-[#67E8F9]/30"
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                aria-label="Filter by rating"
              >
                <option value="">Any rating</option>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}+ stars
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-[#67E8F9]/70 px-5 text-sm font-black text-[#134E4A] transition hover:border-[#0D9488] hover:bg-[#ECFEFF]"
              >
                <FaSliders />
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                {filteredStaffData.length} matches
              </p>
              <h2 className="mt-2 text-3xl font-black sm:text-5xl">
                Available specialists
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-[#134E4A]/70">
              Each profile opens into a live slot picker with reviews, clinic
              details, and instant booking.
            </p>
          </div>

          {loading ? (
            <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-10 text-center shadow-xl shadow-teal-900/10">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#67E8F9] border-t-[#0D9488]" />
              <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-[#0D9488]">
                Loading doctors
              </p>
            </div>
          ) : filteredStaffData.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredStaffData.map((staff) => (
                <article
                  key={staff.id}
                  className="group overflow-hidden rounded-[2rem] border border-[#67E8F9]/50 bg-white shadow-xl shadow-teal-900/10 transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <Link to={`/profiledoctor/${staff.id}`} className="block">
                    <div className="relative h-72 overflow-hidden bg-[#134E4A]">
                      <img
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        src={staff.image || "/brand/doctor-avatar-teal.png"}
                        alt={`${staff.fname} ${staff.lname}`}
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-[#F59E0B] px-3 py-1 text-xs font-black text-[#134E4A]">
                        ${staff.amount || 0}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-black">
                            {staff.fname} {staff.lname}
                          </h3>
                          <p className="mt-1 text-sm font-black text-[#0D9488]">
                            {staff.department}
                          </p>
                        </div>
                        <FaArrowRight className="mt-2 text-[#0D9488] transition group-hover:translate-x-1" />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 text-xs font-black">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFEFF] px-3 py-1">
                          <FaLocationDot className="text-[#0D9488]" />
                          {staff.location}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFEFF] px-3 py-1">
                          <FaHeartPulse className="text-[#0D9488]" />
                          {staff.yoe || 0} years
                        </span>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-4">
                        <Rating
                          name={`doctor-rating-${staff.id}`}
                          value={Number(staff.average_rating || 0)}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                        <span className="text-xs font-black uppercase tracking-wide text-[#134E4A]/55">
                          View profile
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-10 text-center shadow-xl shadow-teal-900/10">
              <FaUserDoctor className="mx-auto text-4xl text-[#0D9488]" />
              <h3 className="mt-4 text-2xl font-black">No doctors found</h3>
              <p className="mt-3 text-sm text-[#134E4A]/70">
                Try a different department, location, rating, or search term.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#0D9488] px-7 text-sm font-black text-white transition hover:bg-[#0F766E]"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default DoctorListing;
