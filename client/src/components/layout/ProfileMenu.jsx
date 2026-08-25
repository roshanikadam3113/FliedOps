import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProfileMenu({ userRole = 'ADMIN' }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setOpen(false);
    logout();
    navigate('/login');
  };

  // Safe fallback if user object is loading or not set yet
  const name = user?.name || (userRole === 'ADMIN' ? 'FieldOps Admin' : userRole === 'TECHNICIAN' ? 'Rahul Sharma' : 'Roshani Kadam');
  const roleTitle = user?.role ? (user.role.toUpperCase() === 'ADMIN' ? 'Company Admin' : user.role.toUpperCase() === 'TECHNICIAN' ? 'Field Technician' : 'Customer') : 'User';
  
  // Calculate initials dynamically
  const getInitials = (userName) => {
    if (!userName) return 'FO';
    const parts = userName.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };
  
  const initials = getInitials(name);
  const profilePath = userRole === 'ADMIN' ? '/admin/settings' : userRole === 'TECHNICIAN' ? '/technician/profile' : '/customer/profile';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white font-black text-xs flex items-center justify-center shadow-xs">
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-xs font-bold text-[#0F172A] leading-tight">{name}</div>
          <div className="text-[10px] font-medium text-[#64748B]">{roleTitle}</div>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-2 z-50 animate-in fade-in duration-150">
          <div className="px-3 py-2 border-b border-slate-100 mb-1">
            <div className="text-xs font-bold text-[#0F172A]">{name}</div>
            <div className="text-[11px] text-[#64748B]">{roleTitle}</div>
          </div>

          <div className="space-y-0.5">
            {userRole === 'ADMIN' && (
              <>
                <Link
                  to={profilePath}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#334155] hover:text-[#0F172A] hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 text-[#0284C7]" />
                  My Profile
                </Link>

                <Link
                  to={profilePath}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#334155] hover:text-[#0F172A] hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#334155]" />
                  Settings
                </Link>
              </>
            )}
          </div>

          <div className="border-t border-slate-100 my-1 pt-1">
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
