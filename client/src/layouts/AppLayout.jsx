import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import Sidebar from '../components/layout/Sidebar';
import { X } from 'lucide-react';

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Detect current role from URL pathname or fallback to DEV_ROLE
  const detectRoleFromPath = () => {
    if (location.pathname.startsWith('/technician')) return 'TECHNICIAN';
    if (location.pathname.startsWith('/customer')) return 'CUSTOMER';
    return 'ADMIN';
  };

  const userRole = detectRoleFromPath();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#F4F6F8] text-[#0F172A] flex overflow-hidden font-sans antialiased">
      
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar userRole={userRole} />
      </div>

      {/* Mobile Drawer Sidebar Backing & Container */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" 
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative bg-white w-72 h-full z-10 shadow-2xl flex flex-col">
            <div className="p-3 flex justify-end border-b border-slate-100">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar userRole={userRole} onCloseMobile={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Navbar */}
        <DashboardNavbar 
          userRole={userRole} 
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
        />

        {/* Main Operational Workspace Page Outlet */}
        <main className="flex-grow overflow-y-auto p-4 sm:p-6 bg-[#F4F6F8]">
          <Outlet context={{ userRole }} />
        </main>

      </div>

    </div>
  );
}
