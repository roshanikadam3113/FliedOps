import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Activity, Clock, CheckCircle2, Shield } from 'lucide-react';

export default function PlaceholderPage({ title, subtitle, category = 'Operations' }) {
  const context = useOutletContext() || {};
  const userRole = context.userRole || 'ADMIN';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
              {userRole} WORKSPACE • {category}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] mt-1">{title}</h1>
          <p className="text-xs text-[#64748B] mt-1">{subtitle}</p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 text-[#F97316] border border-orange-200 text-xs font-bold shrink-0">
          <Activity className="w-3.5 h-3.5" />
          Active Route Placeholder
        </div>
      </div>

      {/* Mock Data Grid Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Operational Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#0F172A]">Connected</div>
          <div className="text-xs text-[#64748B]">Common App Shell active & synced.</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Role Context</span>
            <Shield className="w-4 h-4 text-[#0284C7]" />
          </div>
          <div className="text-2xl font-extrabold text-[#0F172A]">{userRole}</div>
          <div className="text-xs text-[#64748B]">Sidebar navigation adaptively scoped.</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Module Readiness</span>
            <Clock className="w-4 h-4 text-[#F97316]" />
          </div>
          <div className="text-2xl font-extrabold text-[#F97316]">Phase 1 Complete</div>
          <div className="text-xs text-[#64748B]">Layout & Routing verified.</div>
        </div>

      </div>

      {/* Placeholder Details Box */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-[#0F172A]">Module Description</h3>
        <p className="text-xs text-[#64748B] leading-relaxed">
          You are currently viewing the <span className="font-bold text-[#0F172A]">{title}</span> section under the <span className="font-bold text-[#0284C7]">{userRole}</span> navigation profile. Backend API integrations and CRUD forms for this module will be connected in subsequent phases.
        </p>
      </div>

    </div>
  );
}
