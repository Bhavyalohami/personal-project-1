import React, { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  FaComments,
  FaPaperPlane,
  FaShieldHeart,
} from "react-icons/fa6";
import {
  listChats,
  sendChatMessage,
  subscribeToChatMessages,
} from "../../firebase/hmsService";
import { getActiveHospitalId } from "../../utils/hmsAccess";

const UserMessages = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const hospitalId = getActiveHospitalId();
  const actorUid = Cookies.get("patient_uid") || Cookies.get("uid") || Cookies.get("patient_username");

  const fetchChats = useCallback(async () => {
    const data = await listChats(hospitalId);
    setChats(Array.isArray(data) ? data : []);
    setSelectedChat((current) => current || data?.[0] || null);
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

  const handleSend = async () => {
    const text = messageText.trim();
    if (!text || !selectedChat || selectedChat.status !== "open") return;
    await sendChatMessage(selectedChat.hospitalId || hospitalId, selectedChat.id, text);
    setMessageText("");
    await fetchChats();
  };

  return (
    <main className="min-h-screen bg-[#ECFEFF] text-[#134E4A]">
      <section className="relative overflow-hidden bg-[#134E4A] px-5 py-14 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 care-scan-grid opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[#67E8F9]">
            <FaShieldHeart />
            Secure care messaging
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
            Chat with your doctor after they accept your request.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-cyan-50/80">
            Start a chat request from any doctor profile. The doctor opens the thread and can close it when the conversation is complete.
          </p>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[360px_1fr]">
          <aside className="rounded-[2rem] border border-[#67E8F9]/50 bg-white p-4 shadow-xl shadow-teal-900/10">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0D9488]">
              Requests
            </p>
            <div className="mt-4 space-y-2">
              {chats.length ? (
                chats.map((chat) => (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selectedChat?.id === chat.id
                        ? "border-[#0D9488] bg-[#ECFEFF]"
                        : "border-[#67E8F9]/35 bg-white hover:bg-[#ECFEFF]/60"
                    }`}
                  >
                    <p className="truncate text-sm font-black">
                      {chat.doctorName || chat.doctorUsername || "Doctor"}
                    </p>
                    <p className="mt-1 text-xs font-bold capitalize text-[#134E4A]/60">
                      {chat.status || "requested"}
                    </p>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#67E8F9] bg-[#ECFEFF] p-6 text-center">
                  <FaComments className="mx-auto text-3xl text-[#0D9488]" />
                  <p className="mt-3 text-sm font-black">No chat requests yet</p>
                </div>
              )}
            </div>
          </aside>

          <section className="flex min-h-[620px] flex-col overflow-hidden rounded-[2rem] border border-[#67E8F9]/50 bg-white shadow-xl shadow-teal-900/10">
            {selectedChat ? (
              <>
                <div className="border-b border-[#67E8F9]/35 p-5">
                  <p className="text-xl font-black">
                    {selectedChat.doctorName || selectedChat.doctorUsername || "Doctor"}
                  </p>
                  <p className="mt-1 text-sm font-bold capitalize text-[#134E4A]/60">
                    Status: {selectedChat.status || "requested"}
                  </p>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto bg-[#ECFEFF]/45 p-4">
                  {messages.map((message) => {
                    const mine = message.senderUid === actorUid;
                    return (
                      <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm font-semibold leading-6 ${
                            mine
                              ? "bg-[#0D9488] text-white"
                              : message.type === "system"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-white text-[#134E4A]"
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
                          : "Waiting for doctor to accept this chat."
                      }
                      className="min-h-12 flex-1 rounded-full border border-[#67E8F9]/70 bg-white px-5 text-sm font-semibold outline-none focus:border-[#0D9488] focus:ring-4 focus:ring-[#67E8F9]/30 disabled:bg-slate-100"
                    />
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={selectedChat.status !== "open" || !messageText.trim()}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F59E0B] text-[#134E4A] disabled:opacity-50"
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-10 text-center">
                <div>
                  <FaComments className="mx-auto text-4xl text-[#0D9488]" />
                  <p className="mt-4 text-lg font-black">Select a chat</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default UserMessages;
