import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import AdminSearch from "../../Component/Admin/adminsearch";
import VendorSearch from "../../Component/Vendor/vendorsearch";
import DoctorSearch from "../../Component/Doctor/doctorsearch";
import ModernDataGrid from "../../Component/Table/ModernDataGrid";
import { hmsApi } from "../../firebase/hmsService";
import { getActiveHospitalId } from "../../utils/hmsAccess";
import {
  FaBoxesStacked,
  FaCircleExclamation,
  FaPlus,
} from "react-icons/fa6";
import Cookies from "js-cookie";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const hospitalId = getActiveHospitalId();
  const isSuperuser = Cookies.get("is_superuser") === "true";
  const isVendor = Cookies.get("is_vendor") === "true";

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await hmsApi.listInventory(hospitalId);
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleCreate = async () => {
    const result = await Swal.fire({
      title: "Add medicine",
      html: `
        <input id="medicineName" class="swal2-input" placeholder="Medicine name">
        <input id="batchNo" class="swal2-input" placeholder="Batch number">
        <input id="stock" class="swal2-input" type="number" placeholder="Opening stock">
        <input id="lowStockThreshold" class="swal2-input" type="number" placeholder="Low stock threshold">
        <input id="price" class="swal2-input" type="number" placeholder="Price">
        <input id="expiryDate" class="swal2-input" type="date">
      `,
      showCancelButton: true,
      confirmButtonText: "Create",
      confirmButtonColor: "#0D9488",
      preConfirm: () => ({
        medicineName: document.getElementById("medicineName").value,
        batchNo: document.getElementById("batchNo").value,
        stock: Number(document.getElementById("stock").value || 0),
        lowStockThreshold: Number(document.getElementById("lowStockThreshold").value || 10),
        price: Number(document.getElementById("price").value || 0),
        expiryDate: document.getElementById("expiryDate").value,
      }),
    });

    if (!result.isConfirmed) return;
    await hmsApi.createInventoryItem(hospitalId, result.value);
    await fetchInventory();
  };

  const handleAdjust = async (item) => {
    const result = await Swal.fire({
      title: `Adjust ${item.medicineName}`,
      input: "number",
      inputLabel: "Quantity change. Use negative numbers for dispense.",
      inputPlaceholder: "-5 or 20",
      showCancelButton: true,
      confirmButtonText: "Adjust stock",
      confirmButtonColor: "#0D9488",
    });

    if (!result.isConfirmed) return;
    await hmsApi.adjustStock(hospitalId, item.id, {
      quantity: Number(result.value),
      type: Number(result.value) >= 0 ? "purchase" : "dispense",
    });
    await fetchInventory();
  };

  const columns = [
    {
      field: "medicineName",
      headerName: "Medicine",
      minWidth: 220,
      flex: 1,
      renderCell: (params) => (
        <div>
          <p className="font-black text-[#134E4A]">{params.row.medicineName || "-"}</p>
          <p className="mt-1 text-xs font-bold text-[#134E4A]/55">
            Expires: {params.row.expiryDate || "Not set"}
          </p>
        </div>
      ),
    },
    { field: "batchNo", headerName: "Batch", minWidth: 150, flex: 0.7 },
    {
      field: "stock",
      headerName: "Stock",
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => {
        const low =
          Number(params.row.stock || 0) <= Number(params.row.lowStockThreshold || 0);
        return (
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${
              low
                ? "bg-[#F59E0B]/20 text-amber-700"
                : "bg-[#ECFEFF] text-[#0D9488]"
            }`}
          >
            {low && <FaCircleExclamation />}
            {params.row.stock || 0}
          </span>
        );
      },
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 120,
      flex: 0.55,
      renderCell: (params) => `Rs. ${params.row.price || 0}`,
    },
    {
      field: "actions",
      headerName: "Action",
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <button
          type="button"
          onClick={() => handleAdjust(params.row)}
          className="rounded-full bg-[#ECFEFF] px-4 py-2 text-xs font-black text-[#0D9488] transition hover:bg-[#0D9488] hover:text-white"
        >
          Adjust
        </button>
      ),
    },
  ];

  return (
    <main className="w-full px-4 py-6 md:px-8">
      {isSuperuser ? <AdminSearch /> : isVendor ? <VendorSearch /> : <DoctorSearch />}

      <section className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-5 shadow-xl shadow-teal-900/10">
        <div className="flex flex-col gap-4 border-b border-[#67E8F9]/35 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
              <FaBoxesStacked />
              Hospital Inventory
            </p>
            <h1 className="mt-2 text-3xl font-black text-[#134E4A]">
              Medical store stock control
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#134E4A]/65">
              Stock changes go through Cloud Functions transactions and generate low-stock alerts.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0D9488] px-5 text-sm font-black text-white shadow-xl shadow-teal-900/15"
          >
            <FaPlus />
            Add Medicine
          </button>
        </div>

        <div className="mt-5">
          <ModernDataGrid
            rows={items}
            columns={columns}
            loading={loading}
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          />
        </div>
      </section>
    </main>
  );
};

export default Inventory;
