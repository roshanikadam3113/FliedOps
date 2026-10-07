import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/jobService';
import { subscribeToEvent, joinUserRoom } from '../../services/socketService';

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      if (data) {
        setNotifications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    if (user?._id) {
      joinUserRoom(user._id);
    }

    // Subscribe to real-time socket notifications
    const unsubscribe = subscribeToEvent('notificationCreated', (newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
    });

    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [user]);

  const unreadNotifications = notifications.filter(n => !n.read && n.unread !== false);
  const unreadCount = unreadNotifications.length;

  const handleMarkRead = async (id) => {
    setNotifications(prev => prev.map(n => (n._id === id || n.id === id ? { ...n, read: true, unread: false } : n)));
    await markNotificationRead(id);
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true, unread: false })));
    await markAllNotificationsRead();
  };

  return (
    <div className="relative font-sans" ref={popoverRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-[#334155] hover:text-[#0F172A] hover:bg-slate-100 transition-colors relative cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#F97316] ring-2 ring-white animate-pulse" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-4 z-50 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-50 text-[#F97316] border border-orange-200">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs font-semibold text-slate-400 italic">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => {
                const notifId = n._id || n.id;
                const isUnread = !n.read && n.unread !== false;

                return (
                  <div
                    key={notifId}
                    onClick={() => isUnread && handleMarkRead(notifId)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isUnread
                        ? 'bg-orange-50/30 border-orange-200/70 hover:bg-orange-50/60'
                        : 'bg-white border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="text-xs font-extrabold text-[#0F172A] leading-snug">
                          {n.title}
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium leading-relaxed">
                          {n.message || n.description}
                        </div>
                      </div>
                      {isUnread && <span className="w-2 h-2 rounded-full bg-[#F97316] shrink-0 mt-1" />}
                    </div>
                    <div className="text-[9px] text-[#64748B] font-bold flex items-center gap-1 mt-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (n.time || 'Just now')}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
