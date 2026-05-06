import { useCallback, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import {
  FaBell,
  FaBoxesStacked,
  FaCalendarCheck,
  FaClipboardCheck,
  FaClockRotateLeft,
  FaShieldHeart,
} from "react-icons/fa6";
import EmptyState from "../../Component/Panel/EmptyState";
import PanelPage from "../../Component/Panel/PanelPage";
import { hmsApi } from "../../firebase/hmsService";
import { getActiveHospitalId } from "../../utils/hmsAccess";

const iconByType = {
  inventory: <FaBoxesStacked />,
  Booking: <FaCalendarCheck />,
  appointment: <FaCalendarCheck />,
  testBooking: <FaClipboardCheck />,
  cancelled: <FaClockRotateLeft />,
};

const severityTone = {
  warning: "bg-amber-100 text-amber-800",
  error: "bg-rose-100 text-rose-700",
  success: "bg-emerald-100 text-emerald-700",
  info: "bg-cyan-100 text-cyan-800",
};

const normalizeNotification = (item, index) => ({
  id: item.id || `notification-${index}`,
  title: item.title || item.notification_type || item.type || "Notification",
  message: item.message || "CareBridge update received.",
  type: item.type || item.notification_type || "info",
  severity: item.severity || "info",
  createdAt: item.createdAt || item.timestamp || new Date().toISOString(),
  isRead: Boolean(item.isRead || item.is_read),
});

const formatDateTime = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Just now" : date.toLocaleString();
};

const Notification = () => {
  const [activeView, setActiveView] = useState("notifications");
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const hospitalId = getActiveHospitalId();
  const basePath =
    Cookies.get("is_superuser") === "true"
      ? "/admin"
      : Cookies.get("is_vendor") === "true"
      ? "/vendor"
      : "/doctor";

  const loadProductionSignals = useCallback(async () => {
    setLoading(true);
    try {
      const notificationData = await hmsApi.listNotifications(hospitalId).catch(() => []);
      const auditData = await hmsApi.listAuditLogs(hospitalId).catch(() => []);
      setNotifications(
        Array.isArray(notificationData)
          ? notificationData.map(normalizeNotification)
          : [],
      );
      setAuditLogs(Array.isArray(auditData) ? auditData : []);
    } catch (error) {
      setNotifications([]);
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    loadProductionSignals();
  }, [loadProductionSignals]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
  };

  return (
    <PanelPage
      eyebrow="Production signals"
      title="Notifications & audit log"
      description="Track booking, messaging, inventory, and system events from one Firebase-ready command center."
      breadcrumbs={[
        { label: "Dashboard", href: basePath },
        { label: "Notifications" },
      ]}
      actions={
        <button
          type="button"
          onClick={loadProductionSignals}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F59E0B] px-5 text-sm font-black text-[#134E4A]"
        >
          Refresh
        </button>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Unread", unreadCount, <FaBell />],
          ["Audit events", auditLogs.length, <FaShieldHeart />],
          ["Hospital", hospitalId, <FaClipboardCheck />],
        ].map(([label, value, icon]) => (
          <div
            key={label}
            className="rounded-[1.75rem] border border-[#67E8F9]/50 bg-white p-5 shadow-xl shadow-teal-900/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFEFF] text-xl text-[#0D9488]">
              {icon}
            </div>
            <p className="mt-4 text-3xl font-black">{value}</p>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#134E4A]/55">
              {label}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-[2rem] border border-[#67E8F9]/50 bg-white p-4 shadow-xl shadow-teal-900/10 sm:p-6">
        <div className="mb-6 flex flex-wrap gap-3">
          {[
            ["notifications", "Notifications", notifications.length],
            ["audit", "Audit log", auditLogs.length],
          ].map(([key, label, count]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveView(key)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-black transition ${
                activeView === key
                  ? "bg-[#0D9488] text-white"
                  : "bg-[#ECFEFF] text-[#134E4A] hover:bg-[#67E8F9]/35"
              }`}
            >
              {label}
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs text-[#134E4A]">
                {count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <EmptyState
            icon={<FaBell />}
            title="Loading signals"
            message="Fetching Firebase notification and audit streams."
          />
        ) : activeView === "notifications" ? (
          notifications.length ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => markAsRead(notification.id)}
                  className={`flex w-full flex-col gap-4 rounded-[1.5rem] border p-4 text-left transition md:flex-row md:items-center ${
                    notification.isRead
                      ? "border-[#67E8F9]/35 bg-[#ECFEFF]/45"
                      : "border-[#0D9488]/35 bg-white shadow-lg shadow-teal-900/8"
                  }`}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ECFEFF] text-xl text-[#0D9488]">
                    {iconByType[notification.type] || <FaBell />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <strong className="text-lg">{notification.title}</strong>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                          severityTone[notification.severity] || severityTone.info
                        }`}
                      >
                        {notification.severity}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm font-semibold leading-6 text-[#134E4A]/65">
                      {notification.message}
                    </span>
                  </span>
                  <span className="text-xs font-black uppercase tracking-[0.12em] text-[#134E4A]/45">
                    {formatDateTime(notification.createdAt)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FaBell />}
              title="No notifications yet"
              message="Booking, chat, inventory, and test-slot alerts will appear here."
            />
          )
        ) : auditLogs.length ? (
          <div className="space-y-3">
            {auditLogs.map((entry) => (
              <article
                key={entry.id}
                className="rounded-[1.5rem] border border-[#67E8F9]/40 bg-[#ECFEFF]/45 p-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-[#0D9488]">
                      {entry.module} / {entry.action}
                    </p>
                    <h3 className="mt-1 text-lg font-black">{entry.summary}</h3>
                    <p className="mt-1 text-sm font-semibold text-[#134E4A]/60">
                      {entry.actorName || "System"} / {entry.actorRole || "system"}
                    </p>
                  </div>
                  <time className="text-xs font-black uppercase tracking-[0.12em] text-[#134E4A]/45">
                    {formatDateTime(entry.createdAt)}
                  </time>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FaShieldHeart />}
            title="No audit records yet"
            message="Role changes, inventory adjustments, bookings, and message lifecycle events should be written here in production."
          />
        )}
      </section>
    </PanelPage>
  );
};

export default Notification;
