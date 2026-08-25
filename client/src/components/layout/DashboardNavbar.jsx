import React from 'react';
import { Menu, Bell } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import ProfileMenu from './ProfileMenu';

export default function DashboardNavbar({ 
  userRole = 'ADMIN', 
  onRoleChange, 
  onToggleMobileSidebar 
}) {
  return (
    <header className="h-[68px] bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 sm:px-6 shadow-2xs select-none">
      
      {/* Left Area: Toggle & Search / Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        
        {/* Title for Small screens */}
        <span className="md:hidden font-extrabold text-[#0F172A] text-sm uppercase tracking-wider">
          FieldOps Hub
        </span>
      </div>

      {/* Right Area: Dev Tools, Notifications, Profile */}
      <div className="flex items-center gap-3.5">
        


        {/* Notifications Dropdown */}
        <NotificationCenter />

        <div className="w-[1px] h-6 bg-[#E2E8F0] hidden sm:block" />

        {/* Profile Menu Dropdown */}
        <ProfileMenu userRole={userRole} />

      </div>

    </header>
  );
}
