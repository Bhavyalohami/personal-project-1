import React, { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import AdminSearch from "../../Component/Admin/adminsearch";
import VendorSearch from "../../Component/Vendor/vendorsearch";
import { hmsApi } from "../../firebase/hmsService";
import { getActiveHospitalId } from "../../utils/hmsAccess";
import {
  FaFloppyDisk,
  FaHospital,
  FaImage,
  FaLocationDot,
} from "react-icons/fa6";

const HospitalManager = () => {
  const hospitalId = getActiveHospitalId();
  const isSuperuser = Cookies.get("is_superuser") === "true";
  const isVendor = Cookies.get("is_vendor") === "true";
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    summary: "",
    city: "",
    area: "",
    address: "",
    lat: "",
    lng: "",
    geoHash: "",
    phone: "",
    email: "",
  });

  const fetchProfile = useCallback(async () => {
    const data = await hmsApi.getHospitalProfile(hospitalId);
    const hospital = data.hospital || {};
    setProfile(data);
    setForm({
      name: hospital.name || "",
      summary: hospital.summary || "",
      city: hospital.location?.city || "",
      area: hospital.location?.area || "",
      address: hospital.location?.address || "",
      lat: hospital.location?.lat || "",
      lng: hospital.location?.lng || "",
      geoHash: hospital.location?.geoHash || "",
      phone: hospital.contact?.phone || "",
      email: hospital.contact?.email || "",
    });
  }, [hospitalId]);

  useEffect(() => {
    fetchProfile().catch(() => setProfile(null));
  }, [fetchProfile]);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    await hmsApi.updateHospitalProfile(hospitalId, {
      name: form.name,
      summary: form.summary,
      location: {
        city: form.city,
        area: form.area,
        address: form.address,
        lat: Number(form.lat || 0),
        lng: Number(form.lng || 0),
        geoHash: form.geoHash,
      },
      contact: {
        phone: form.phone,
        email: form.email,
      },
      public: true,
      status: "active",
    });
    await fetchProfile();
    Swal.fire({
      icon: "success",
      title: "Hospital profile updated",
      confirmButtonColor: "#0D9488",
    });
  };

  const handleAddMedia = async () => {
    const result = await Swal.fire({
      title: "Add hospital media",
      html: `
        <input id="title" class="swal2-input" placeholder="Title">
        <input id="url" class="swal2-input" placeholder="/brand/hms/hospital-discovery-hero.png or Storage URL">
      `,
      showCancelButton: true,
      confirmButtonText: "Add media",
      confirmButtonColor: "#0D9488",
      preConfirm: () => ({
        title: document.getElementById("title").value,
        url: document.getElementById("url").value,
        type: "image",
      }),
    });
    if (!result.isConfirmed) return;
    await hmsApi.addHospitalMedia(hospitalId, result.value);
    await fetchProfile();
  };

  const inputClass =
    "min-h-12 rounded-2xl border border-[#67E8F9]/60 bg-[#ECFEFF]/70 px-4 text-sm font-bold outline-none focus:border-[#0D9488] focus:bg-white focus:ring-4 focus:ring-[#67E8F9]/30";
  const previewImage =
    profile?.media?.[0]?.url ||
    profile?.hospital?.profileImage ||
    "/brand/hms/hospital-discovery-hero.png";

  return (
    <div className="min-h-screen flex-1 bg-[#ECFEFF] text-[#134E4A]">
      {isSuperuser ? <AdminSearch /> : isVendor ? <VendorSearch /> : null}
      <main className="p-5 lg:p-8">
        <section className="rounded-[2rem] border border-[#67E8F9]/50 bg-[#134E4A] p-6 text-white shadow-2xl shadow-teal-900/20">
          <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#67E8F9]">
                <FaHospital />
                Manager workspace
              </p>
              <h1 className="mt-3 text-4xl font-black">Hospital Profile</h1>
              <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-cyan-50/75">
                Update public hospital discovery data, map location, contact details, and media gallery.
              </p>
            </div>
            <div className="relative h-52 overflow-hidden rounded-[1.7rem] border border-white/20 bg-white/10">
              <img src={previewImage} alt="Hospital profile preview" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#134E4A]/70 to-transparent" />
              <span className="absolute bottom-4 left-4 rounded-full bg-[#F59E0B] px-4 py-2 text-xs font-black text-[#134E4A]">
                Public discovery image
              </span>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-5 shadow-xl shadow-teal-900/10">
            <div className="grid gap-4 md:grid-cols-2">
              <input className={inputClass} value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Hospital name" />
              <input className={inputClass} value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="City" />
              <input className={inputClass} value={form.area} onChange={(e) => updateField("area", e.target.value)} placeholder="Area" />
              <input className={inputClass} value={form.geoHash} onChange={(e) => updateField("geoHash", e.target.value)} placeholder="GeoHash prefix" />
              <input className={inputClass} value={form.lat} onChange={(e) => updateField("lat", e.target.value)} placeholder="Latitude" />
              <input className={inputClass} value={form.lng} onChange={(e) => updateField("lng", e.target.value)} placeholder="Longitude" />
              <input className={`${inputClass} md:col-span-2`} value={form.address} onChange={(e) => updateField("address", e.target.value)} placeholder="Full address" />
              <input className={inputClass} value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="Phone" />
              <input className={inputClass} value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="Email" />
              <textarea className={`${inputClass} min-h-36 md:col-span-2`} value={form.summary} onChange={(e) => updateField("summary", e.target.value)} placeholder="About hospital" />
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#F59E0B] px-7 text-sm font-black text-[#134E4A] shadow-lg shadow-amber-900/10"
            >
              <FaFloppyDisk />
              Save Profile
            </button>
          </div>

          <aside className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-5 shadow-xl shadow-teal-900/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
                  Media
                </p>
                <h2 className="mt-1 text-2xl font-black">Gallery</h2>
              </div>
              <button
                type="button"
                onClick={handleAddMedia}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#0D9488] text-white"
                aria-label="Add media"
              >
                <FaImage />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {(profile?.media || []).map((item) => (
                <div key={item.id} className="overflow-hidden rounded-2xl border border-[#67E8F9]/50 bg-[#ECFEFF]">
                  <img src={item.url} alt={item.title || "Hospital media"} className="h-36 w-full object-cover" />
                  <p className="p-3 text-sm font-black">{item.title}</p>
                </div>
              ))}
              {!profile?.media?.length && (
                <div className="rounded-2xl border border-dashed border-[#67E8F9] bg-[#ECFEFF] p-6 text-center">
                  <FaLocationDot className="mx-auto text-2xl text-[#0D9488]" />
                  <p className="mt-2 text-sm font-black">No media yet</p>
                </div>
              )}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default HospitalManager;
