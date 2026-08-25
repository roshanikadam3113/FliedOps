import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ADMIN_NAVIGATION, 
  TECHNICIAN_NAVIGATION, 
  CUSTOMER_NAVIGATION 
} from '../../utils/navigation';
import { Activity, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ userRole = 'ADMIN', onCloseMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const getNavigationForRole = () => {
    switch (userRole) {
      case 'ADMIN':
        return { title: 'Company Operations', sections: ADMIN_NAVIGATION, badge: 'Admin Portal' };
      case 'TECHNICIAN':
        return { title: 'Technician Portal', sections: TECHNICIAN_NAVIGATION, badge: 'Field App' };
      case 'CUSTOMER':
        return { title: 'Customer Portal', sections: CUSTOMER_NAVIGATION, badge: 'Client Hub' };
      default:
        return { title: 'Company Operations', sections: ADMIN_NAVIGATION, badge: 'Admin Portal' };
    }
  };

  const currentNav = getNavigationForRole();

  const handleSidebarLogout = () => {
    if (onCloseMobile) onCloseMobile();
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col h-full shrink-0 select-none">
      
      {/* Sidebar Header (Logo & Role Badge) */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#F97316] flex items-center justify-center text-white font-bold shadow-xs">
            <Activity className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-base font-extrabold tracking-tight text-[#0F172A]">
            Field<span className="text-[#F97316]">Ops</span>
          </span>
        </Link>

        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-[#334155] border border-slate-200">
          {userRole}
        </span>
      </div>

      {/* Role Sub-title Banner */}
      <div className="px-4 py-2.5 bg-[#F4F6F8] border-b border-[#E2E8F0]">
        <div className="text-xs font-bold text-[#0F172A]">{currentNav.title}</div>
        <div className="text-[10px] font-medium text-[#64748B]">Operational Navigation</div>
      </div>

      {/* Dynamic Role Navigation Items */}
      <div className="flex-grow overflow-y-auto px-3 py-4 space-y-5">
        {currentNav.sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
              {section.section}
            </div>

            <div className="space-y-0.5 pt-1">
              {section.items.map((item, iIdx) => {
                const IconComp = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={iIdx}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150 relative ${
                      isActive
                        ? 'bg-orange-50/80 text-[#0F172A] border-l-4 border-[#F97316] font-extrabold shadow-2xs pl-2.5'
                        : 'text-[#334155] hover:text-[#0F172A] hover:bg-slate-50 font-semibold'
                    }`}
                  >
                    <IconComp
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-[#F97316]' : 'text-[#64748B]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Profile / Quick Logout Area */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <button
          onClick={handleSidebarLogout}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-[#334155] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <span>Logout</span>
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>

    </aside>
  );
}
