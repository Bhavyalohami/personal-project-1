import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { FaCalendarCheck, FaHeartPulse } from "react-icons/fa6";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(92vw, 640px)",
  maxHeight: "90vh",
  bgcolor: "#ECFEFF",
  borderRadius: "32px",
  boxShadow: "0 30px 80px rgba(19, 78, 74, 0.28)",
  overflow: "hidden",
};

const UserAppointmentModal = ({ open, onClose, service }) => {
  const fields = [
    { label: "Name", value: service?.name },
    { label: "Email", value: service?.email },
    { label: "Age", value: service?.age },
    { label: "Gender", value: service?.gender },
    { label: "Contact", value: service?.contact },
    { label: "City", value: service?.city },
    { label: "Date", value: service?.date },
    { label: "Time", value: service?.time },
    { label: "Location", value: service?.location },
    { label: "Department", value: service?.department },
    { label: "Doctor", value: service?.doctor },
    { label: "Problem", value: service?.problem },
    { label: "Status", value: service?.status },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStyle}>
        <div className="bg-[#134E4A] p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#67E8F9]">
                Appointment details
              </p>
              <h2 id="modal-title" className="mt-2 text-3xl font-black">
                {service?.doctor || "CareBridge visit"}
              </h2>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-cyan-50/80">
                <FaCalendarCheck className="text-[#67E8F9]" />
                {service?.date || "Date pending"} at {service?.time || "Time pending"}
              </p>
            </div>
            <IconButton
              onClick={onClose}
              aria-label="close"
              sx={{
                color: "#134E4A",
                background: "#ECFEFF",
                "&:hover": { background: "#67E8F9" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </div>

        <div id="modal-description" className="max-h-[62vh] overflow-y-auto p-5">
          <div className="mb-5 flex items-center gap-3 rounded-3xl border border-[#67E8F9]/50 bg-white p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFEFF] text-2xl text-[#0D9488]">
              <FaHeartPulse />
            </div>
            <div>
              <p className="text-sm font-black text-[#134E4A]">
                {service?.department || "Care department"}
              </p>
              <p className="text-xs font-semibold text-[#134E4A]/60">
                Status: {service?.status || "N/A"}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[#67E8F9]/40 bg-white p-4"
              >
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0D9488]">
                  {item.label}
                </p>
                <p className="mt-2 break-words text-sm font-bold text-[#134E4A]">
                  {item.value || "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default UserAppointmentModal;
