import React, { useCallback, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import AdminSearch from "../../Component/Admin/adminsearch";
import DoctorSearch from "../../Component/Doctor/doctorsearch";
import VendorSearch from "../../Component/Vendor/vendorsearch";
import {
  acceptChat,
  closeChat,
  listChats,
  sendChatMessage,
  subscribeToChatMessages,
} from "../../firebase/hmsService";
import { getActiveHospitalId } from "../../utils/hmsAccess";
import {
  FaCircle,
  FaComments,
  FaPaperPlane,
  FaRegCircleCheck,
  FaXmark,
} from "react-icons/fa6";

const statusTone = {
  requested: "bg-amber-100 text-amber-700",
  open: "bg-emerald-100 text-emerald-700",
  closed: "bg-slate-100 text-slate-600",
  rejected: "bg-rose-100 text-rose-700",
};

const Messages = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const hospitalId = getActiveHospitalId();
  const isSuperuser = Cookies.get("is_superuser") === "true";
  const isVendor = Cookies.get("is_vendor") === "true";
  const isDoctor = Cookies.get("is_staff") === "true" && !isVendor && !isSuperuser;
  const actorUid = Cookies.get("uid") || Cookies.get("username");

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listChats(hospitalId);
      setChats(Array.isArray(data) ? data : []);
      setSelectedChat((current) => {
        if (!Array.isArray(data) || data.length === 0) return null;
        return data.find((chat) => chat.id === current?.id) || data[0];
      });
    } catch (error) {
      Swal.fire("Messages unavailable", error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (!selectedChat?.id) {
      setMessages([]);
      return undefined;
    }
    return subscribeToChatMessages(
      selectedChat.hospitalId || hospitalId,
      selectedChat.id,
      setMessages,
    );
  }, [hospitalId, selectedChat]);

  const sortedChats = useMemo(
    () =>
      [...chats].sort((a, b) =>
        String(b.lastMessageAt || "").localeCompare(String(a.lastMessageAt || "")),
      ),
    [chats],
  );

  const handleAccept = async () => {
    if (!selectedChat) return;
    await acceptChat(selectedChat.hospitalId || hospitalId, selectedChat.id);
    await fetchChats();
  };

  const handleClose = async () => {
    if (!selectedChat) return;
    const result = await Swal.fire({
      title: "Close chat?",
      text: "The patient will no longer be able to send messages in this thread.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Close chat",
      cancelButtonText: "Keep open",
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    await closeChat(selectedChat.hospitalId || hospitalId, selectedChat.id);
    await fetchChats();
  };

  const handleSend = async () => {
    const text = messageText.trim();
    if (!text || !selectedChat) return;
    await sendChatMessage(selectedChat.hospitalId || hospitalId, selectedChat.id, text);
    setMessageText("");
    await fetchChats();
  };

  return (
    <main className="w-full px-4 py-6 md:px-8">
      {isSuperuser ? <AdminSearch /> : isVendor ? <VendorSearch /> : <DoctorSearch />}

      <section className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-5 shadow-xl shadow-teal-900/10">
        <div className="flex flex-col gap-3 border-b border-[#67E8F9]/35 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
              <FaComments />
              HMS Messaging
            </p>
            <h1 className="mt-2 text-3xl font-black text-[#134E4A]">
              Doctor-patient chat requests
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#134E4A]/65">
              Patients request a conversation, the assigned doctor opens it, and the doctor can close it when care is complete.
            </p>
          </div>
          <span className="rounded-full bg-[#ECFEFF] px-4 py-2 text-xs font-black text-[#0D9488]">
            {hospitalId}
          </span>
        </div>

        <div className="mt-5 grid min-h-[620px] gap-5 xl:grid-cols-[360px_1fr]">
          <aside className="rounded-[1.5rem] border border-[#67E8F9]/45 bg-[#ECFEFF]/55 p-3">
            {loading ? (
              <p className="p-5 text-sm font-black text-[#134E4A]/60">Loading chats...</p>
            ) : sortedChats.length ? (
              <div className="space-y-2">
                {sortedChats.map((chat) => (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selectedChat?.id === chat.id
                        ? "border-[#0D9488] bg-white shadow-lg shadow-teal-900/10"
                        : "border-transparent bg-white/70 hover:border-[#67E8F9]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-black">
                        {chat.patientName || chat.patientUid || "Patient"}
                      </p>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                          statusTone[chat.status] || statusTone.requested
                        }`}
                      >
                        {chat.status || "requested"}
                      </span>
                    </div>
                    <p className="mt-2 truncate text-xs font-semibold text-[#134E4A]/55">
                      {chat.lastMessage || "No messages yet"}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#67E8F9] bg-white p-6 text-center">
                <FaComments className="mx-auto text-3xl text-[#0D9488]" />
                <p className="mt-3 text-sm font-black">No chat requests yet</p>
              </div>
            )}
          </aside>

          <section className="flex min-h-[620px] flex-col rounded-[1.5rem] border border-[#67E8F9]/45 bg-white">
            {selectedChat ? (
              <>
                <div className="flex flex-col gap-3 border-b border-[#67E8F9]/35 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-black">
                      {selectedChat.patientName || selectedChat.patientUid || "Patient"}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-xs font-bold text-[#134E4A]/55">
                      <FaCircle className="text-[8px] text-[#0D9488]" />
                      Doctor: {selectedChat.doctorName || selectedChat.doctorUsername || selectedChat.doctorUid}
                    </p>
                  </div>
                  {isDoctor && (
                    <div className="flex flex-wrap gap-2">
                      {selectedChat.status === "requested" && (
                        <button
                          type="button"
                          onClick={handleAccept}
                          className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#0D9488] px-4 text-xs font-black text-white"
                        >
                          <FaRegCircleCheck />
                          Accept
                        </button>
                      )}
                      {selectedChat.status === "open" && (
                        <button
                          type="button"
                          onClick={handleClose}
                          className="inline-flex min-h-10 items-center gap-2 rounded-full bg-rose-100 px-4 text-xs font-black text-rose-700"
                        >
                          <FaXmark />
                          Close
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto bg-[#ECFEFF]/45 p-4">
                  {messages.map((message) => {
                    const mine = message.senderUid === actorUid;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm font-semibold leading-6 ${
                            mine
                              ? "bg-[#0D9488] text-white"
                              : message.type === "system"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-white text-[#134E4A] shadow-sm"
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-[#67E8F9]/35 p-4">
                  <div className="flex gap-3">
                    <input
                      value={messageText}
                      onChange={(event) => setMessageText(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") handleSend();
                      }}
                      disabled={selectedChat.status !== "open"}
                      placeholder={
                        selectedChat.status === "open"
                          ? "Write a message..."
                          : "Chat must be accepted before messaging."
                      }
                      className="min-h-12 flex-1 rounded-full border border-[#67E8F9]/70 bg-white px-5 text-sm font-semibold outline-none focus:border-[#0D9488] focus:ring-4 focus:ring-[#67E8F9]/30 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={selectedChat.status !== "open" || !messageText.trim()}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F59E0B] text-[#134E4A] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-8 text-center">
                <div>
                  <FaComments className="mx-auto text-4xl text-[#0D9488]" />
                  <p className="mt-4 text-lg font-black">Select a chat request</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default Messages;
