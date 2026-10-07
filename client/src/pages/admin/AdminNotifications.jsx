import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { Bell, CheckCircle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await apiRequest('/notifications', { method: 'GET' });
      if (data && data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiRequest('/notifications/read-all', { method: 'PATCH' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'dispatch': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'system': return <Bell className="w-5 h-5 text-blue-500" />;
      case 'billing': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">System Notifications</h1>
          <p className="text-sm text-[#64748B] mt-1">Activity log and system alerts.</p>
        </div>
        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] text-[#0F172A] text-sm font-bold rounded-lg shadow-xs hover:bg-gray-50"
        >
          <CheckCircle2 className="w-4 h-4" />
          Mark All Read
        </button>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#64748B]">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-[#64748B]">No notifications found.</div>
        ) : (
          <ul className="divide-y divide-[#E2E8F0]">
            {notifications.map((notif) => (
              <li key={notif._id} className={`p-4 hover:bg-gray-50 flex gap-4 ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                <div className="shrink-0 mt-1">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`text-sm font-bold ${!notif.read ? 'text-[#0F172A]' : 'text-[#334155]'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-sm text-[#64748B] mt-0.5">{notif.message}</p>
                    </div>
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif._id)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 shrink-0 ml-4"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-[#94A3B8]">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(notif.createdAt).toLocaleString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
