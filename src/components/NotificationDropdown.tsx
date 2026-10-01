import React from 'react';
import { AppNotification } from '@/data/notifications';
import { Bell, Check, X, ShieldAlert, UserCheck, MessageSquare, ExternalLink, CheckCheck } from 'lucide-react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRequestClick: (notif: AppNotification) => void;
  onOpenInbox?: () => void;
  onRequestBrowserPermission: () => void;
  browserPermissionGranted: boolean;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onRequestClick,
  onOpenInbox,
  onRequestBrowserPermission,
  browserPermissionGranted,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="absolute right-0 top-14 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      
      {/* Dropdown Header */}
      <div className="p-4 px-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-emerald-600" />
          <h4 className="font-bold text-slate-900 text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-emerald-700 font-semibold hover:underline"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Browser Push Permission Banner */}
      {!browserPermissionGranted && (
        <div className="bg-emerald-50 border-b border-emerald-100 p-3 px-4 flex items-center justify-between gap-2">
          <div className="text-[11px] text-emerald-900 leading-tight">
            <strong>Mobile Push Alerts:</strong> App band hone par bhi notification pane ke liye allow karein.
          </div>
          <button
            onClick={onRequestBrowserPermission}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shrink-0 shadow-xs"
          >
            Enable Push
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Filhaal koi notification nahi hai.
          </div>
        ) : (
          notifications.map((notif) => {
            return (
              <div
                key={notif.id}
                onClick={() => {
                  onMarkAsRead(notif.id);
                  if (notif.type === 'connection_request') {
                    onRequestClick(notif);
                  } else if (notif.type === 'chat_message' && onOpenInbox) {
                    onClose();
                    onOpenInbox();
                  }
                }}
                className={`p-3.5 px-4 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                  !notif.read ? 'bg-emerald-50/40' : 'bg-white'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={notif.senderAvatar}
                    alt={notif.senderName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  {notif.type === 'connection_request' && (
                    <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full ring-2 ring-white">
                      <UserCheck size={10} />
                    </span>
                  )}
                  {notif.type === 'chat_message' && (
                    <span className="absolute -bottom-1 -right-1 bg-teal-600 text-white p-0.5 rounded-full ring-2 ring-white">
                      <MessageSquare size={10} />
                    </span>
                  )}
                  {notif.type === 'safety_alert' && (
                    <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full ring-2 ring-white">
                      <ShieldAlert size={10} />
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {notif.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug mt-0.5 line-clamp-2">
                    {notif.message}
                  </p>
                  {notif.type === 'connection_request' && (
                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                      Click to View & Accept Request →
                    </span>
                  )}
                  {notif.type === 'chat_message' && (
                    <span className="inline-block mt-1 text-[10px] font-bold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded-md">
                      Click to Open Inbox & Reply →
                    </span>
                  )}
                </div>

                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 px-4 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
        Real-time instant safety & connection alerts
      </div>

    </div>
  );
};
