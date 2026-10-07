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
    <header className="h-[68px] bg-surface-primary border-b border-border-subtle flex items-center justify-between px-4 sm:px-6 shadow-2xs select-none">
      
      {/* Left Area: Toggle & Search / Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        
        {/* Title for Small screens */}
        <span className="md:hidden font-extrabold text-text-primary text-sm uppercase tracking-wider">
          FieldOps Hub
        </span>
      </div>

      {/* Right Area: Dev Tools, Notifications, Profile */}
      <div className="flex items-center gap-3.5">
        


        {/* Notifications Dropdown */}
        <NotificationCenter />

        <div className="w-[1px] h-6 bg-border-subtle hidden sm:block" />

        {/* Profile Menu Dropdown */}
        <ProfileMenu userRole={userRole} />

      </div>

    </header>
  );
}
