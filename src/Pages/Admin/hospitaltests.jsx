import React, { useCallback, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import AdminSearch from "../../Component/Admin/adminsearch";
import VendorSearch from "../../Component/Vendor/vendorsearch";
import ModernDataGrid from "../../Component/Table/ModernDataGrid";
import { hmsApi } from "../../firebase/hmsService";
import { getActiveHospitalId } from "../../utils/hmsAccess";
import {
  FaCalendarPlus,
  FaClock,
  FaPlus,
  FaVialCircleCheck,
} from "react-icons/fa6";

const HospitalTests = () => {
  const hospitalId = getActiveHospitalId();
  const isSuperuser = Cookies.get("is_superuser") === "true";
  const isVendor = Cookies.get("is_vendor") === "true";
  const [tests, setTests] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState("");

  const fetchData = useCallback(async () => {
    const [testsData, bookingsData] = await Promise.all([
      hmsApi.listHospitalTests(hospitalId),
      hmsApi.listTestBookings(hospitalId).catch(() => []),
    ]);
    const nextTests = Array.isArray(testsData) ? testsData : [];
    setTests(nextTests);
    setSelectedTestId((current) => current || nextTests[0]?.id || "");
    setBookings(Array.isArray(bookingsData) ? bookingsData : []);
  }, [hospitalId]);

  useEffect(() => {
    fetchData().catch(() => {
      setTests([]);
      setBookings([]);
    });
  }, [fetchData]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedTestId) {
        setSlots([]);
        return;
      }
      const data = await hmsApi.listTestSlots(hospitalId, selectedTestId);
      setSlots(Array.isArray(data) ? data : []);
    };
    fetchSlots().catch(() => setSlots([]));
  }, [hospitalId, selectedTestId]);

  const selectedTest = useMemo(
    () => tests.find((test) => test.id === selectedTestId),
    [selectedTestId, tests],
  );
  const selectedTestImage = selectedTest?.image || "/brand/hms/test-booking-lab.png";

  const handleCreateTest = async () => {
    const result = await Swal.fire({
      title: "Add diagnostic test",
      html: `
        <input id="name" class="swal2-input" placeholder="Test name">
        <input id="category" class="swal2-input" placeholder="Category">
        <input id="duration" class="swal2-input" type="number" placeholder="Duration minutes">
        <input id="price" class="swal2-input" type="number" placeholder="Price">
      `,
      showCancelButton: true,
      confirmButtonText: "Create test",
      confirmButtonColor: "#0D9488",
      preConfirm: () => ({
        name: document.getElementById("name").value,
        category: document.getElementById("category").value,
        durationMinutes: Number(document.getElementById("duration").value || 15),
        price: Number(document.getElementById("price").value || 0),
      }),
    });
    if (!result.isConfirmed) return;
    await hmsApi.createHospitalTest(hospitalId, result.value);
    await fetchData();
  };

  const handleCreateSlot = async () => {
    const result = await Swal.fire({
      title: `Add slot${selectedTest ? ` for ${selectedTest.name}` : ""}`,
      html: `
        <input id="date" class="swal2-input" type="date">
        <input id="startTime" class="swal2-input" type="time">
        <input id="capacity" class="swal2-input" type="number" placeholder="Capacity">
      `,
      showCancelButton: true,
      confirmButtonText: "Create slot",
      confirmButtonColor: "#0D9488",
      preConfirm: () => ({
        testId: selectedTestId,
        date: document.getElementById("date").value,
        startTime: document.getElementById("startTime").value,
        capacity: Number(document.getElementById("capacity").value || 1),
      }),
    });
    if (!result.isConfirmed) return;
    await hmsApi.createTestSlot(hospitalId, result.value);
    const data = await hmsApi.listTestSlots(hospitalId, selectedTestId);
    setSlots(Array.isArray(data) ? data : []);
  };

  const bookingColumns = [
    {
      field: "patientName",
      headerName: "Patient",
      minWidth: 220,
      flex: 1,
      renderCell: (params) => params.row.patientName || params.row.userId || "Patient",
    },
    { field: "testName", headerName: "Test", minWidth: 190, flex: 0.9 },
    {
      field: "slot",
      headerName: "Slot",
      minWidth: 190,
      flex: 0.9,
      renderCell: (params) =>
        [params.row.date, params.row.startTime].filter(Boolean).join(" ") || "-",
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.6,
      renderCell: (params) => (
        <span className="rounded-full bg-[#ECFEFF] px-3 py-1 text-xs font-black capitalize text-[#0D9488]">
          {params.row.status || "pending"}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex-1 bg-[#ECFEFF] text-[#134E4A]">
      {isSuperuser ? <AdminSearch /> : isVendor ? <VendorSearch /> : null}
      <main className="p-5 lg:p-8">
        <section className="rounded-[2rem] border border-[#67E8F9]/50 bg-[#134E4A] p-6 text-white shadow-2xl shadow-teal-900/20">
          <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#67E8F9]">
                <FaVialCircleCheck />
                Tests and diagnostic slots
              </p>
              <h1 className="mt-3 text-4xl font-black">Test Management</h1>
              <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-cyan-50/75">
                Manage hospital tests, public slot capacity, and confirmed test bookings.
              </p>
            </div>
            <div className="relative h-52 overflow-hidden rounded-[1.7rem] border border-white/20 bg-white/10">
              <img src={selectedTestImage} alt="Diagnostic management preview" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#134E4A]/75 to-transparent" />
              <span className="absolute bottom-4 left-4 rounded-full bg-[#F59E0B] px-4 py-2 text-xs font-black text-[#134E4A]">
                Slots + capacity
              </span>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
          <aside className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-5 shadow-xl shadow-teal-900/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">Tests</p>
                <h2 className="mt-1 text-2xl font-black">Catalog</h2>
              </div>
              <button
                type="button"
                onClick={handleCreateTest}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#0D9488] text-white"
                aria-label="Add test"
              >
                <FaPlus />
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {tests.map((test) => (
                <button
                  key={test.id}
                  type="button"
                  onClick={() => setSelectedTestId(test.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedTestId === test.id
                      ? "border-[#0D9488] bg-[#ECFEFF]"
                      : "border-[#67E8F9]/45 bg-white hover:bg-[#ECFEFF]/60"
                  }`}
                >
                  <p className="text-sm font-black">{test.name}</p>
                  <p className="mt-1 text-xs font-bold text-[#134E4A]/60">
                    {test.category} / Rs. {test.price || 0}
                  </p>
                </button>
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-5 shadow-xl shadow-teal-900/10">
              <div className="mb-5 h-48 overflow-hidden rounded-[1.5rem] border border-[#67E8F9]/45 bg-[#ECFEFF]">
                <img src={selectedTestImage} alt={selectedTest?.name || "Diagnostic test"} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">Slots</p>
                  <h2 className="mt-1 text-2xl font-black">{selectedTest?.name || "Select a test"}</h2>
                </div>
                <button
                  type="button"
                  onClick={handleCreateSlot}
                  disabled={!selectedTestId}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#F59E0B] px-5 text-sm font-black text-[#134E4A] disabled:opacity-50"
                >
                  <FaCalendarPlus />
                  Add Slot
                </button>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {slots.map((slot) => (
                  <div key={slot.id} className="rounded-2xl border border-[#67E8F9]/45 bg-[#ECFEFF] p-4">
                    <p className="text-sm font-black">{slot.date}</p>
                    <p className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-[#134E4A]/70">
                      <FaClock className="text-[#0D9488]" />
                      {slot.startTime}
                    </p>
                    <p className="mt-3 text-xs font-black uppercase tracking-wide text-[#0D9488]">
                      {slot.availableCapacity}/{slot.capacity} available
                    </p>
                  </div>
                ))}
                {!slots.length && (
                  <div className="rounded-2xl border border-dashed border-[#67E8F9] bg-[#ECFEFF] p-6 text-sm font-black">
                    No slots yet
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-5 shadow-xl shadow-teal-900/10">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">Bookings</p>
              <h2 className="mt-1 text-2xl font-black">Recent test bookings</h2>
              <div className="mt-5">
                <ModernDataGrid
                  rows={bookings}
                  columns={bookingColumns}
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                />
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HospitalTests;
