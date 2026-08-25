import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);
  const { user } = useAuth();
  const [readIds, setReadIds] = useState([]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationsForRole = () => {
    const role = user?.role || 'admin';
    switch (role) {
      case 'customer':
        return [
          {
            id: 1,
            title: 'Technician Rahul Sharma is on the way to your location!',
            time: '5m ago',
            unread: true,
            type: 'dispatch'
          },
          {
            id: 2,
            title: 'Your service request for AC Cooling has been assigned to Rahul Sharma',
            time: '18m ago',
            unread: true,
            type: 'request'
          },
          {
            id: 3,
            title: 'Invoice #INV-demo_2 paid successfully!',
            time: '1h ago',
            unread: false,
            type: 'billing'
          }
        ];
      case 'technician':
        return [
          {
            id: 1,
            title: 'New job assignment: AC Cooling Leakage at Sector 62, Kolhapur',
            time: '5m ago',
            unread: true,
            type: 'dispatch'
          },
          {
            id: 2,
            title: 'Customer Roshani Kadam paid Invoice #INV-demo_2',
            time: '18m ago',
            unread: true,
            type: 'request'
          },
          {
            id: 3,
            title: 'Route dispatch updated for AC servicing job',
            time: '1h ago',
            unread: false,
            type: 'billing'
          }
        ];
      case 'admin':
      default:
        return [
          {
            id: 1,
            title: 'Technician Rahul accepted Job #1024',
            time: '5m ago',
            unread: true,
            type: 'dispatch'
          },
          {
            id: 2,
            title: 'Service request #1025 requires dispatch assignment',
            time: '18m ago',
            unread: true,
            type: 'request'
          },
          {
            id: 3,
            title: 'New customer account registered: Roshani Kadam',
            time: '1h ago',
            unread: false,
            type: 'billing'
          }
        ];
    }
  };

  const notifications = getNotificationsForRole();
  const unreadCount = notifications.filter(n => n.unread && !readIds.includes(n.id)).length;

  const handleMarkAllRead = () => {
    setReadIds(notifications.map(n => n.id));
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-[#334155] hover:text-[#0F172A] hover:bg-slate-100 transition-colors relative cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {/* Unread Red/Orange Badge Dot */}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F97316] ring-2 ring-white" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-3 z-50 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-orange-50 text-[#F97316] border border-orange-200">
                  {unreadCount} New
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {notifications.map((n) => {
              const isUnread = n.unread && !readIds.includes(n.id);
              return (
                <div
                  key={n.id}
                  className={`p-2.5 rounded-lg border transition-colors ${
                    isUnread
                      ? 'bg-slate-50 border-slate-200/80'
                      : 'bg-white border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-semibold text-[#0F172A] leading-snug">
                      {n.title}
                    </div>
                    {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] shrink-0 mt-1" />}
                  </div>
                  <div className="text-[10px] text-[#64748B] flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {n.time}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
