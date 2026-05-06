import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModernDataGrid from "../../Component/Table/ModernDataGrid";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import Cookies from "js-cookie";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaArrowTrendUp,
  FaCalendarCheck,
  FaClock,
  FaHospitalUser,
  FaLocationDot,
  FaRegCircleCheck,
  FaShieldHeart,
  FaUserDoctor,
  FaUsers,
} from "react-icons/fa6";
import BaseUrl from "../../Api/baseurl";

const safeArray = (value) => (Array.isArray(value) ? value : []);
const safeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};
const toCount = (value) => (Array.isArray(value) ? value.length : safeNumber(value));

const clearPanelCookies = () => {
  [
    "is_superuser",
    "is_vendor",
    "is_staff",
    "token",
    "status",
    "username",
    "roles",
    "subroles",
  ].forEach((name) => Cookies.remove(name));
};

const normalizeImage = (src, fallback = "/brand/doctor-avatar-teal.png") => {
  if (!src || src === "N/A") return fallback;
  if (src.startsWith("http") || src.startsWith("/brand/")) return src;
  return src.startsWith("/") ? src : `${BaseUrl}${src}`;
};

const withSerialNumbers = (items, prefix) =>
  safeArray(items).map((item, index) => ({
    ...item,
    id: item.id || item.appointment_id || `${prefix}-${index}`,
    __serialNumber: index + 1,
  }));

const columns = [
  {
    field: "serialNumber",
    headerName: "Sr.",
    width: 70,
    renderCell: (params) => <strong>{params.row.__serialNumber}</strong>,
  },
  {
    field: "name",
    headerName: "Patient",
    flex: 1,
    minWidth: 140,
    renderCell: (params) => params?.row?.name || params?.row?.patient || "Guest patient",
  },
  {
    field: "date",
    headerName: "Date",
    flex: 1,
    minWidth: 120,
    renderCell: (params) => params?.row?.date || "Not set",
  },
  {
    field: "age",
    headerName: "Age",
    width: 90,
    renderCell: (params) => params?.row?.age || "-",
  },
  {
    field: "time",
    headerName: "Slot",
    flex: 1,
    minWidth: 140,
    renderCell: (params) => params?.row?.time || params?.row?.slot || "Not set",
  },
];

const DashBoard = () => {
  const navigate = useNavigate();
  const isSuperuser = Cookies.get("is_superuser") === "true";
  const isVendor = Cookies.get("is_vendor") === "true";
  const isDoctorPanel = !isSuperuser && !isVendor;
  const username = Cookies.get("username") || "care-team";
  const token = Cookies.get("token");

  const [greeting, setGreeting] = useState("");
  const [profile, setProfile] = useState({});
  const [rows, setRows] = useState([]);
  const [cancelledRows, setCancelledRows] = useState([]);
  const [counts, setCounts] = useState({
    appointments: 0,
    patients: 0,
    doctors: 0,
    staff: 0,
    services: 0,
  });
  const [clinicLists, setClinicLists] = useState({
    staff: [],
    departments: [],
    locations: [],
    services: [],
  });
  const [graphCounts, setGraphCounts] = useState({
    booked: 0,
    available: 0,
    cancelled: 0,
  });
  const [weeklyData, setWeeklyData] = useState({
    dates: [],
    booked: [],
    available: [],
    cancelled: [],
  });

  const basePath = isSuperuser ? "/admin" : isVendor ? "/vendor" : "/doctor";
  const panelName = isSuperuser
    ? "Admin command center"
    : isVendor
    ? "Vendor clinic hub"
    : "Doctor workspace";
  const personName =
    profile.fname || profile.name || profile.username || username.replaceAll(".", " ");

  const fallbackWeeklyLabels = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return date.toLocaleDateString("en-US", { weekday: "short" });
    });
  }, []);

  const weeklyLabels = safeArray(weeklyData.dates).length
    ? safeArray(weeklyData.dates)
    : fallbackWeeklyLabels;

  const normalizeSeries = (values) => {
    const cleaned = safeArray(values).map(safeNumber);
    if (!cleaned.length) return weeklyLabels.map(() => 0);
    return weeklyLabels.map((_, index) => safeNumber(cleaned[index]));
  };

  const bookedSeries = normalizeSeries(weeklyData.booked);
  const availableSeries = normalizeSeries(weeklyData.available);
  const cancelledSeries = normalizeSeries(weeklyData.cancelled);
  const hasWeeklyData = [...bookedSeries, ...availableSeries, ...cancelledSeries].some(
    (value) => safeNumber(value) > 0,
  );

  const rawPieData = [
    { id: 0, value: graphCounts.booked, color: "#0D9488", label: "Booked" },
    { id: 1, value: graphCounts.available, color: "#67E8F9", label: "Available" },
    { id: 2, value: graphCounts.cancelled, color: "#F59E0B", label: "Cancelled" },
  ];
  const pieTotal = rawPieData.reduce((total, item) => total + safeNumber(item.value), 0);
  const hasPieData = pieTotal > 0;
  const pieData =
    hasPieData
      ? rawPieData
      : [{ id: 0, value: 1, color: "#67E8F9", label: "No live data" }];

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 16) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      Swal.fire({
        icon: "warning",
        title: "Session expired",
        text: "Please login again.",
        confirmButtonText: "Login",
      });
      clearPanelCookies();
      navigate(isSuperuser ? "/admin/login" : isVendor ? "/vendor/login" : "/doctor/login", {
        replace: true,
      });
    };

    const fetchDashboard = async () => {
      if (!token) return;

      try {
        const response = await axios.get(`${BaseUrl}clinic/booking/`, {
          params: isDoctorPanel ? { username } : undefined,
          headers: { Authorization: `Token ${token}` },
        });
        const payload = response.data || {};
        setRows(withSerialNumbers(payload.todays_appointments, "today"));
        setCancelledRows(withSerialNumbers(payload.cancelled_appointments, "cancelled"));
        setCounts({
          appointments: toCount(payload.total_appointments),
          patients: toCount(payload.total_patients),
          doctors: toCount(payload.total_doctors),
          staff: toCount(payload.staff),
          services: toCount(payload.services),
        });
        setClinicLists({
          staff: safeArray(payload.staff),
          departments: safeArray(payload.departments),
          locations: safeArray(payload.locations),
          services: safeArray(payload.services),
        });
      } catch (error) {
        if (error.response?.status === 401 || error.code === "ERR_BAD_REQUEST") {
          handleSessionExpired();
        } else {
          console.error(error);
        }
      }
    };

    const fetchWeekly = async () => {
      if (!token) return;

      try {
        const response = await axios.get(`${BaseUrl}clinic/weekly-graphs/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const payload = response.data || {};
        setWeeklyData({
          dates: safeArray(payload.dates),
          booked: safeArray(payload.booked),
          available: safeArray(payload.available),
          cancelled: safeArray(payload.cancelled),
        });
      } catch (error) {
        console.error(error);
      }
    };

    const fetchGraph = async () => {
      if (!token) return;

      try {
        const response = await axios.get(`${BaseUrl}clinic/graphs/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const payload = response.data || {};
        const booked = safeNumber(payload.confirmed_appointments);
        const cancelled = safeNumber(payload.cancelled_appointments);
        const available = Math.max(safeNumber(payload.total_sub_slots) - booked, 0);
        setGraphCounts({ booked, available, cancelled });
      } catch (error) {
        console.error(error);
      }
    };

    const fetchProfile = async () => {
      if (!token) return;

      const profileUrl = isSuperuser
        ? `${BaseUrl}clinic/admin/`
        : isVendor
        ? `${BaseUrl}clinic/vendor-profile/${username}`
        : `${BaseUrl}clinic/staff-list/${username}`;

      try {
        const response = await axios.get(profileUrl, {
          headers: { Authorization: `Token ${token}` },
        });
        setProfile(response.data || {});
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboard();
    fetchWeekly();
    fetchGraph();
    fetchProfile();
  }, [isDoctorPanel, isSuperuser, isVendor, navigate, token, username]);

  const statCards = [
    {
      label: "Today visits",
      value: counts.appointments,
      icon: FaCalendarCheck,
      tone: "bg-[#0D9488] text-white",
      href: `${basePath}/appointments`,
    },
    {
      label: "Patients",
      value: counts.patients,
      icon: FaHospitalUser,
      tone: "bg-white text-[#134E4A]",
      href: `${basePath}/managepatients`,
    },
    {
      label: "Doctors",
      value: counts.doctors,
      icon: FaUserDoctor,
      tone: "bg-white text-[#134E4A]",
      href: isSuperuser ? "/admin/staff" : `${basePath}/staff`,
    },
    {
      label: "Team members",
      value: counts.staff,
      icon: FaUsers,
      tone: "bg-white text-[#134E4A]",
      href: `${basePath}/staff`,
    },
    {
      label: "Services",
      value: counts.services,
      icon: FaShieldHeart,
      tone: "bg-white text-[#134E4A]",
      href: `${basePath}/services`,
    },
  ];

  const listCards = [
    {
      title: "Departments",
      items: clinicLists.departments.map((item) => item.name || item.department),
    },
    {
      title: "Locations",
      items: clinicLists.locations.map((item) => item.name || item.location),
    },
    {
      title: "Services",
      items: clinicLists.services.map((item) => item.name || item.service),
    },
  ];

  const nextAppointment = rows[0];
  const doctorStats = [
    {
      label: "Today's patients",
      value: counts.appointments,
      icon: FaCalendarCheck,
      href: "/doctor/appointments",
    },
    {
      label: "Active patients",
      value: counts.patients,
      icon: FaHospitalUser,
      href: "/doctor/managepatients",
    },
    {
      label: "Open slots",
      value: graphCounts.available,
      icon: FaClock,
      href: "/doctor/manageslots",
    },
    {
      label: "Cancelled",
      value: graphCounts.cancelled,
      icon: FaShieldHeart,
      href: "/doctor/appointments",
    },
  ];
  const doctorActions = [
    ["Appointments", "/doctor/appointments", FaCalendarCheck],
    ["Manage Slots", "/doctor/manageslots", FaClock],
    ["Holidays", "/doctor/manageholidays", FaRegCircleCheck],
    ["My Profile", "/doctor/myprofile", FaUserDoctor],
  ];
  const vendorStats = [
    {
      label: "Appointments",
      value: counts.appointments,
      icon: FaCalendarCheck,
      href: "/vendor/appointments",
    },
    {
      label: "Patients",
      value: counts.patients,
      icon: FaHospitalUser,
      href: "/vendor/managepatients",
    },
    {
      label: "Clinic staff",
      value: counts.staff,
      icon: FaUsers,
      href: "/vendor/staff",
    },
    {
      label: "Services",
      value: counts.services,
      icon: FaShieldHeart,
      href: "/vendor/services",
    },
  ];
  const vendorActions = [
    ["Appointments", "/vendor/appointments", FaCalendarCheck],
    ["Clinic Staff", "/vendor/staff", FaUsers],
    ["Manage Slots", "/vendor/manageslots", FaClock],
    ["Services", "/vendor/services", FaShieldHeart],
    ["Content", "/vendor/managecontent", FaRegCircleCheck],
    ["My Profile", "/vendor/myprofile", FaUserDoctor],
  ];
  const careBasePath = isVendor ? "/vendor" : "/doctor";
  const carePanelLabel = isVendor ? "Vendor clinic hub" : "Doctor workspace";
  const carePanelIntro = isVendor
    ? "Clinic operations, care teams, content, slots, and patient movement are grouped for fast daily coordination."
    : "Your clinic queue, slots, and patient follow-ups are grouped for quick daily movement.";
  const careStats = isVendor ? vendorStats : doctorStats;
  const careActions = isVendor ? vendorActions : doctorActions;
  const careAvatarFallback = isVendor
    ? "/brand/logo-mark-generated-teal.png"
    : "/brand/doctor-avatar-teal.png";

  if (isDoctorPanel || isVendor) {
    return (
      <main className="min-h-screen w-full overflow-hidden bg-[#F7FFFF] px-4 py-5 text-[#134E4A] sm:px-6 lg:px-8">
        <div className="w-full">
          <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#67E8F9]/45 bg-white p-6 shadow-xl shadow-teal-900/8 lg:p-7">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-[#67E8F9]/20" />
              <div className="relative">
                <div className="flex items-center gap-4">
                  <img
                    src={normalizeImage(profile.image, careAvatarFallback)}
                    alt={personName}
                    className="h-20 w-20 rounded-[1.5rem] border border-[#67E8F9]/50 object-cover"
                  />
                  <div>
                    <p className="inline-flex items-center gap-2 rounded-full bg-[#ECFEFF] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#0D9488]">
                      <FaRegCircleCheck />
                      {carePanelLabel}
                    </p>
                    <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl xl:text-5xl">
                      {greeting}, {personName}
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#134E4A]/65">
                      {carePanelIntro}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {careActions.map(([label, href, Icon]) => (
                    <Link
                      key={href}
                      to={href}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[#67E8F9]/50 bg-[#ECFEFF] px-4 text-xs font-black text-[#134E4A] transition hover:border-[#0D9488] hover:bg-white hover:text-[#0D9488]"
                    >
                      <Icon className="text-[#0D9488]" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[#67E8F9]/45 bg-[#134E4A] p-6 text-white shadow-xl shadow-teal-900/12">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#67E8F9]">
                {isVendor ? "Next clinic booking" : "Next in queue"}
              </p>
              {nextAppointment ? (
                <div className="mt-5">
                  <p className="text-3xl font-black">
                    {nextAppointment.name || nextAppointment.patient || "Guest patient"}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-white/10 p-3">
                      <p className="text-cyan-50/60">Date</p>
                      <p className="mt-1 font-black">{nextAppointment.date || "Today"}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3">
                      <p className="text-cyan-50/60">Time</p>
                      <p className="mt-1 font-black">{nextAppointment.time || "Not set"}</p>
                    </div>
                  </div>
                  <Link
                    to={`${careBasePath}/appointments`}
                    className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#F59E0B] px-5 text-sm font-black text-[#134E4A]"
                  >
                    Open appointments
                  </Link>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-5">
                  <p className="text-xl font-black">
                    {isVendor ? "No clinic bookings waiting" : "No patient waiting"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-cyan-50/70">
                    {isVendor
                      ? "New clinic appointments will appear here as soon as booking data arrives."
                      : "New appointments will appear here as soon as the queue receives data."}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {careStats.map(({ label, value, icon: Icon, href }) => (
              <Link
                key={label}
                to={href}
                className="group min-h-[170px] rounded-[1.5rem] border border-[#67E8F9]/45 bg-white p-4 shadow-lg shadow-teal-900/8 transition hover:-translate-y-1 hover:border-[#0D9488]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFEFF] text-xl text-[#0D9488]">
                    <Icon />
                  </span>
                  <FaArrowTrendUp className="text-[#F59E0B] opacity-80" />
                </div>
                <p className="mt-4 text-3xl font-black">{value}</p>
                <p className="mt-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#134E4A]/55">
                  {label}
                </p>
              </Link>
            ))}
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[1.75rem] border border-[#67E8F9]/45 bg-white p-5 shadow-xl shadow-teal-900/8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
                    Schedule
                  </p>
                  <h2 className="mt-2 text-2xl font-black">Today's appointment queue</h2>
                </div>
                <Link
                  to={`${careBasePath}/appointments`}
                  className="rounded-full bg-[#ECFEFF] px-4 py-2 text-xs font-black text-[#0D9488]"
                >
                  View all
                </Link>
              </div>

              <div className="mt-5 space-y-3">
                {rows.length ? (
                  rows.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-[#67E8F9]/40 bg-[#ECFEFF]/60 p-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black">
                          {item.name || item.patient || "Guest patient"}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#134E4A]/60">
                          {item.date || "Today"} - {item.time || "Slot not set"}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#0D9488]">
                        Ready
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#67E8F9] bg-[#ECFEFF] p-7 text-center">
                    <p className="text-base font-black">No appointments today</p>
                    <p className="mt-2 text-sm leading-6 text-[#134E4A]/60">
                      {isVendor
                        ? "Your clinic appointment queue will show here."
                        : "Your booked patient queue will show here."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[#67E8F9]/45 bg-white p-5 shadow-xl shadow-teal-900/8">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
                    Weekly rhythm
                  </p>
                  <h2 className="mt-2 text-2xl font-black">Bookings by day</h2>
                </div>
                <span className="rounded-full bg-[#ECFEFF] px-4 py-2 text-xs font-black text-[#134E4A]/65">
                  Empty-data safe
                </span>
              </div>
              <div className="relative">
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: weeklyLabels,
                      tickLabelStyle: { fill: "#134E4A", fontWeight: 700 },
                    },
                  ]}
                  yAxis={[
                    {
                      tickLabelStyle: { fill: "#134E4A", fontWeight: 700 },
                    },
                  ]}
                  series={[
                    { data: bookedSeries, label: "Booked", color: "#0D9488" },
                    { data: availableSeries, label: "Available", color: "#67E8F9" },
                    { data: cancelledSeries, label: "Cancelled", color: "#F59E0B" },
                  ]}
                  height={320}
                  margin={{ top: 35, right: 20, bottom: 60, left: 45 }}
                  slotProps={{
                    legend: {
                      labelStyle: { fill: "#134E4A", fontWeight: 800 },
                    },
                  }}
                />
                {!hasWeeklyData && (
                  <div className="absolute inset-x-4 top-24 rounded-[1.5rem] border border-dashed border-[#67E8F9]/70 bg-white/92 p-5 text-center shadow-xl shadow-teal-900/8">
                    <p className="text-lg font-black text-[#134E4A]">No weekly data yet</p>
                    <p className="mt-1 text-sm font-semibold text-[#134E4A]/60">
                      Bookings, cancellations, and open slots will draw this chart once live activity starts.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[1.75rem] border border-[#67E8F9]/45 bg-white p-5 shadow-xl shadow-teal-900/8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
                Patients
              </p>
              <h2 className="mt-2 text-2xl font-black">Appointment records</h2>
              <div className="mt-4">
                <div className="w-full">
                  <ModernDataGrid
                    rows={rows}
                    columns={columns}
                    disableRowSelectionOnClick
                    localeText={{ noRowsLabel: "No record is available." }}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5, 10]}
                    sx={{
                      minHeight: 360,
                      border: "1px solid rgba(103, 232, 249, 0.45)",
                      borderRadius: "22px",
                      overflow: "hidden",
                      color: "#134E4A",
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#ECFEFF",
                        color: "#134E4A",
                        fontSize: "14px",
                        fontWeight: 900,
                      },
                      "& .MuiDataGrid-cell": {
                        borderColor: "rgba(103, 232, 249, 0.35)",
                      },
                      "& .MuiDataGrid-footerContainer": {
                        borderColor: "rgba(103, 232, 249, 0.35)",
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[#67E8F9]/45 bg-white p-5 shadow-xl shadow-teal-900/8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
                Slot health
              </p>
              <h2 className="mt-2 text-2xl font-black">Availability mix</h2>
              <div className="relative mt-3 flex justify-center">
                <PieChart
                  series={[
                    {
                      data: pieData,
                      innerRadius: 50,
                      outerRadius: 105,
                      paddingAngle: 3,
                      cornerRadius: 6,
                    },
                  ]}
                  width={320}
                  height={250}
                  slotProps={{
                    legend: {
                      labelStyle: { fill: "#134E4A", fontWeight: 800 },
                    },
                  }}
                />
                {!hasPieData && (
                  <div className="absolute inset-x-4 top-28 rounded-[1.5rem] border border-dashed border-[#67E8F9]/70 bg-white/92 p-4 text-center shadow-lg shadow-teal-900/8">
                    <p className="text-sm font-black">No availability data yet</p>
                    <p className="mt-1 text-xs font-semibold text-[#134E4A]/60">
                      Slot mix appears after bookings sync.
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {rawPieData.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-[#ECFEFF] p-3">
                    <p className="text-2xl font-black">{item.value}</p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.1em] text-[#134E4A]/55">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-hidden bg-[#ECFEFF] px-4 py-6 text-[#134E4A] sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#67E8F9]/50 bg-[#134E4A] p-6 text-white shadow-2xl shadow-teal-950/15 lg:p-8">
        <div className="absolute inset-0 care-scan-grid opacity-20" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#67E8F9]">
              <FaRegCircleCheck />
              {panelName}
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">
              {greeting}, {personName}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-cyan-50/75">
              Monitor live appointments, clinic capacity, and patient movement from a
              Firebase-ready operations dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to={`${basePath}/appointments`}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#F59E0B] px-6 text-sm font-black text-[#134E4A] shadow-xl shadow-amber-950/10 transition hover:bg-[#67E8F9]"
            >
              <FaCalendarCheck />
              Appointments
            </Link>
            <Link
              to="/"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/20"
            >
              View site
            </Link>
          </div>
        </div>

        <div className="relative mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {statCards.map(({ label, value, icon: Icon, tone, href }) => (
            <Link
              key={label}
              to={href}
              className={`rounded-[1.5rem] border border-white/15 p-5 shadow-xl shadow-teal-950/10 transition hover:-translate-y-1 ${tone}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ECFEFF] text-xl text-[#0D9488]">
                  <Icon />
                </span>
                <FaArrowTrendUp className="text-[#F59E0B]" />
              </div>
              <p className="mt-5 text-4xl font-black">{value}</p>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] opacity-70">
                {label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-5 shadow-2xl shadow-teal-900/10 lg:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
                Appointment chart
              </p>
              <h2 className="mt-2 text-2xl font-black">Weekly capacity movement</h2>
            </div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#ECFEFF] px-4 py-2 text-xs font-black text-[#134E4A]/70">
              <FaClock className="text-[#0D9488]" />
              Live fallback safe
            </p>
          </div>
          <div className="relative">
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: weeklyLabels,
                  label: "Date",
                  tickLabelStyle: { fill: "#134E4A", fontWeight: 700 },
                },
              ]}
              yAxis={[
                {
                  label: "Appointments",
                  tickLabelStyle: { fill: "#134E4A", fontWeight: 700 },
                },
              ]}
              series={[
                { data: bookedSeries, label: "Booked", color: "#0D9488" },
                { data: availableSeries, label: "Available", color: "#67E8F9" },
                { data: cancelledSeries, label: "Cancelled", color: "#F59E0B" },
              ]}
              height={360}
              margin={{ top: 35, right: 20, bottom: 70, left: 60 }}
              slotProps={{
                legend: {
                  labelStyle: { fill: "#134E4A", fontWeight: 800 },
                },
              }}
            />
            {!hasWeeklyData && (
              <div className="absolute inset-x-4 top-28 rounded-[1.5rem] border border-dashed border-[#67E8F9]/70 bg-white/92 p-6 text-center shadow-xl shadow-teal-900/8">
                <p className="text-xl font-black text-[#134E4A]">No weekly movement yet</p>
                <p className="mt-1 text-sm font-semibold text-[#134E4A]/60">
                  The chart will populate as Firebase receives appointments, test bookings, and cancellations.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-5 shadow-2xl shadow-teal-900/10 lg:p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
            Slot health
          </p>
          <h2 className="mt-2 text-2xl font-black">Availability mix</h2>
          <div className="relative mt-4 flex justify-center">
            <PieChart
              series={[
                {
                  data: pieData,
                  innerRadius: 52,
                  outerRadius: 112,
                  paddingAngle: 3,
                  cornerRadius: 6,
                },
              ]}
              width={330}
              height={260}
              slotProps={{
                legend: {
                  labelStyle: { fill: "#134E4A", fontWeight: 800 },
                },
              }}
            />
            {!hasPieData && (
              <div className="absolute inset-x-4 top-28 rounded-[1.5rem] border border-dashed border-[#67E8F9]/70 bg-white/92 p-4 text-center shadow-lg shadow-teal-900/8">
                <p className="text-sm font-black">No live slot mix yet</p>
                <p className="mt-1 text-xs font-semibold text-[#134E4A]/60">
                  Booked, available, and cancelled counts will appear here automatically.
                </p>
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            {rawPieData.map((item) => (
              <div key={item.label} className="rounded-2xl bg-[#ECFEFF] p-3">
                <p className="text-2xl font-black">{item.value}</p>
                <p className="mt-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#134E4A]/60">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-5 shadow-2xl shadow-teal-900/10 lg:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
                Care team
              </p>
              <h2 className="mt-2 text-2xl font-black">Staff on the system</h2>
            </div>
            <Link
              to={`${basePath}/staff`}
              className="rounded-full bg-[#ECFEFF] px-4 py-2 text-xs font-black text-[#0D9488]"
            >
              Manage
            </Link>
          </div>

          <div className="mt-5 max-h-[360px] space-y-3 overflow-y-auto pr-1">
            {clinicLists.staff.length ? (
              clinicLists.staff.slice(0, 8).map((item, index) => (
                <div
                  key={item.id || item.username || index}
                  className="flex items-center gap-4 rounded-2xl border border-[#67E8F9]/40 bg-[#ECFEFF]/70 p-3"
                >
                  <img
                    src={normalizeImage(item.image)}
                    alt={`${item.fname || "Care"} ${item.lname || "staff"}`}
                    className="h-14 w-14 rounded-2xl object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black">
                      {item.fname || "Care"} {item.lname || "specialist"}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#134E4A]/60">
                      <FaLocationDot className="text-[#0D9488]" />
                      {item.role || item.department || item.location || "Clinic team"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#67E8F9] bg-[#ECFEFF] p-6 text-center">
                <p className="text-sm font-black">No staff data yet</p>
                <p className="mt-2 text-xs leading-6 text-[#134E4A]/60">
                  Staff members will appear here after Firebase/backend data is available.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {listCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-5 shadow-2xl shadow-teal-900/10"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
                {card.title}
              </p>
              <div className="mt-4 max-h-[300px] space-y-2 overflow-y-auto">
                {card.items.length ? (
                  card.items.slice(0, 12).map((item, index) => (
                    <div
                      key={`${card.title}-${item}-${index}`}
                      className="rounded-2xl bg-[#ECFEFF] px-4 py-3 text-sm font-black"
                    >
                      {item || "Untitled"}
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-[#67E8F9] bg-[#ECFEFF] px-4 py-5 text-center text-xs font-bold text-[#134E4A]/60">
                    No data yet
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        {[
          ["Today's Appointments", rows],
          ["Cancelled Appointments", cancelledRows],
        ].map(([title, gridRows]) => (
          <div
            key={title}
            className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-5 shadow-2xl shadow-teal-900/10 lg:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
                  Appointments
                </p>
                <h2 className="mt-2 text-2xl font-black">{title}</h2>
              </div>
            </div>
            <div className="w-full">
              <ModernDataGrid
                rows={gridRows}
                columns={columns}
                disableRowSelectionOnClick
                localeText={{ noRowsLabel: "No record is available." }}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5, 10]}
                sx={{
                  minHeight: 380,
                  border: "1px solid rgba(103, 232, 249, 0.45)",
                  borderRadius: "24px",
                  overflow: "hidden",
                  color: "#134E4A",
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#ECFEFF",
                    color: "#134E4A",
                    fontSize: "14px",
                    fontWeight: 900,
                  },
                  "& .MuiDataGrid-cell": {
                    borderColor: "rgba(103, 232, 249, 0.35)",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    borderColor: "rgba(103, 232, 249, 0.35)",
                  },
                }}
              />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default DashBoard;
