import { useEffect, useRef, useState } from "react";
import { Bell, Check, CheckCheck, X } from "lucide-react";
import { useNotificationStore } from "../../stores/notificationStore";
import type { Notification } from "../../types";

const TYPE_ICONS: Record<string, string> = {
  STATUS_CHANGE: "🔄",
  DEADLINE_WARNING: "⏰",
  BLOCKER_ALERT: "🚧",
  CHECKIN_REMINDER: "📋",
  REPORT_READY: "📊",
  WORKLOAD_ALERT: "⚠️",
  BOTTLENECK: "🔴",
};

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days}d`;
}

export function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-96 rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="font-semibold text-gray-900">Notificaciones</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Leer todas
                </button>
              )}
              <button onClick={() => setOpen(false)} className="rounded p-1 hover:bg-gray-100">
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">Sin notificaciones</p>
              </div>
            ) : (
              notifications.slice(0, 20).map((notif: Notification) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 border-b border-gray-50 px-4 py-3 transition-colors hover:bg-gray-50 ${
                    !notif.read ? "bg-blue-50/50" : ""
                  }`}
                >
                  <span className="mt-0.5 text-lg">{TYPE_ICONS[notif.type] || "🔔"}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notif.read ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                      {notif.title}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{notif.message}</p>
                    <p className="mt-1 text-[10px] text-gray-400">{timeAgo(notif.createdAt)}</p>
                  </div>
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="shrink-0 rounded p-1 hover:bg-gray-200"
                      title="Marcar como leida"
                    >
                      <Check className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
