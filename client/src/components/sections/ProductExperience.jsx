import React, { useState } from 'react';
import { 
  Building2, 
  Wrench, 
  User, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  FileText, 
  Package, 
  Phone, 
  Receipt,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export default function ProductExperience() {
  const [activeRoleTab, setActiveRoleTab] = useState('ADMIN');

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#company') {
        setActiveRoleTab('ADMIN');
        document.getElementById('product-experience')?.scrollIntoView({ behavior: 'smooth' });
      } else if (hash === '#technicians') {
        setActiveRoleTab('TECHNICIAN');
        document.getElementById('product-experience')?.scrollIntoView({ behavior: 'smooth' });
      } else if (hash === '#customers') {
        setActiveRoleTab('CUSTOMER');
        document.getElementById('product-experience')?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <section id="product-experience" className="py-20 md:py-28 bg-[#F4F6F8] border-b border-[#E2E8F0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
            ONE CONNECTED PLATFORM
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            One platform. Three experiences.
          </h2>

          <p className="text-[#64748B] text-base sm:text-lg leading-relaxed">
            Every role gets the tools they need to manage, perform, and track field service.
          </p>
        </div>

        {/* Role Tabs Switcher */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          
          <button
            onClick={() => setActiveRoleTab('ADMIN')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-[0.08em] transition-all cursor-pointer flex items-center gap-2 ${
              activeRoleTab === 'ADMIN'
                ? 'bg-[#F97316] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#334155] hover:text-[#0F172A] hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            COMPANY ADMIN
          </button>

          <button
            onClick={() => setActiveRoleTab('TECHNICIAN')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-[0.08em] transition-all cursor-pointer flex items-center gap-2 ${
              activeRoleTab === 'TECHNICIAN'
                ? 'bg-[#F97316] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#334155] hover:text-[#0F172A] hover:bg-slate-50'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            TECHNICIAN
          </button>

          <button
            onClick={() => setActiveRoleTab('CUSTOMER')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-[0.08em] transition-all cursor-pointer flex items-center gap-2 ${
              activeRoleTab === 'CUSTOMER'
                ? 'bg-[#F97316] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#334155] hover:text-[#0F172A] hover:bg-slate-50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            CUSTOMER
          </button>

        </div>

        {/* Product UI Preview Showcase Container */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto">
          
          {/* Top Window Bar */}
          <div className="bg-[#0F172A] text-white px-5 py-3.5 flex items-center justify-between text-xs border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 opacity-80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 opacity-80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 opacity-80" />
              </div>
              <span className="text-slate-400">|</span>
              <span className="font-extrabold text-white tracking-wider uppercase text-[11px]">
                FIELDOPS • {activeRoleTab} CONSOLE
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Workspace Active
            </div>
          </div>

          {/* PREVIEW CONTENT FOR COMPANY ADMIN */}
          {activeRoleTab === 'ADMIN' && (
            <div className="p-6 space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-[#0F172A]">Operations Overview</h3>
                  <p className="text-xs text-[#64748B]">Real-time company dispatch and active fleet monitoring.</p>
                </div>
                <span className="text-xs font-bold text-[#0284C7] bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                  Company Admin Portal
                </span>
              </div>

              {/* 4 Admin Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#F4F6F8] border border-[#E2E8F0] p-3.5 rounded-xl">
                  <div className="text-2xl font-extrabold text-[#0F172A]">24</div>
                  <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Active Jobs</div>
                </div>

                <div className="bg-[#F4F6F8] border border-[#E2E8F0] p-3.5 rounded-xl">
                  <div className="text-2xl font-extrabold text-[#0284C7]">12</div>
                  <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Pending Requests</div>
                </div>

                <div className="bg-[#F4F6F8] border border-[#E2E8F0] p-3.5 rounded-xl">
                  <div className="text-2xl font-extrabold text-[#0F172A]">18</div>
                  <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Technicians</div>
                </div>

                <div className="bg-[#F4F6F8] border border-[#E2E8F0] p-3.5 rounded-xl">
                  <div className="text-2xl font-extrabold text-emerald-600">31</div>
                  <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Completed Today</div>
                </div>
              </div>

              {/* Table & Smart Assignment Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Live Operations Table */}
                <div className="lg:col-span-8 space-y-2">
                  <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    Live Operations Table
                  </div>
                  <div className="border border-[#E2E8F0] rounded-xl overflow-hidden text-xs">
                    <div className="grid grid-cols-12 bg-[#F4F6F8] px-3 py-2 border-b border-[#E2E8F0] font-bold text-[#64748B] uppercase tracking-wider text-[10px]">
                      <div className="col-span-4">JOB</div>
                      <div className="col-span-3">TECHNICIAN</div>
                      <div className="col-span-3">LOCATION</div>
                      <div className="col-span-2 text-right">STATUS</div>
                    </div>
                    <div className="divide-y divide-slate-100 bg-white">
                      <div className="grid grid-cols-12 px-3 py-2.5 items-center font-medium">
                        <div className="col-span-4 font-bold text-[#0F172A]">AC Repair</div>
                        <div className="col-span-3 text-[#334155]">Rahul Sharma</div>
                        <div className="col-span-3 text-[#64748B]">Kolhapur</div>
                        <div className="col-span-2 text-right">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0284C7] border border-blue-200">On Way</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-12 px-3 py-2.5 items-center font-medium">
                        <div className="col-span-4 font-bold text-[#0F172A]">RO Service</div>
                        <div className="col-span-3 text-[#334155]">Amit Patil</div>
                        <div className="col-span-3 text-[#64748B]">Kolhapur</div>
                        <div className="col-span-2 text-right">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">In Progress</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-12 px-3 py-2.5 items-center font-medium">
                        <div className="col-span-4 font-bold text-[#0F172A]">CCTV Installation</div>
                        <div className="col-span-3 text-[#334155]">Priya Verma</div>
                        <div className="col-span-3 text-[#64748B]">Ichalkaranji</div>
                        <div className="col-span-2 text-right">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">Scheduled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smart Assignment Card */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    Smart Assignment Indicator
                  </div>
                  <div className="bg-[#F4F6F8] border border-orange-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#64748B]">Recommended Match</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-orange-50 text-[#F97316] border border-orange-200">AI Match</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#0F172A] text-white font-bold text-xs flex items-center justify-center">
                        RS
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-[#0F172A]">Rahul Sharma</div>
                        <div className="text-[10px] text-[#64748B]">HVAC Specialist • 4.2 km</div>
                      </div>
                      <div className="ml-auto text-right">
                        <span className="text-base font-extrabold text-[#F97316]">95%</span>
                        <span className="text-[9px] font-bold text-[#64748B] block">Score</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* PREVIEW CONTENT FOR TECHNICIAN */}
          {activeRoleTab === 'TECHNICIAN' && (
            <div className="p-6 space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-[#0F172A]">Today's Work</h3>
                  <p className="text-xs text-[#64748B]">Mobile workspace for on-site service execution.</p>
                </div>
                <span className="text-xs font-bold text-[#0284C7] bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                  Technician Mobile App
                </span>
              </div>

              {/* 3 Tech Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#F4F6F8] border border-[#E2E8F0] p-3.5 rounded-xl">
                  <div className="text-xl font-extrabold text-[#0F172A]">5</div>
                  <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Today's Jobs</div>
                </div>

                <div className="bg-[#F4F6F8] border border-[#E2E8F0] p-3.5 rounded-xl">
                  <div className="text-xl font-extrabold text-emerald-600">2</div>
                  <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Completed</div>
                </div>

                <div className="bg-[#F4F6F8] border border-[#E2E8F0] p-3.5 rounded-xl">
                  <div className="text-xl font-extrabold text-[#F97316]">3</div>
                  <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Remaining</div>
                </div>
              </div>

              {/* Main Active Job Details */}
              <div className="bg-[#F4F6F8] border border-[#E2E8F0] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-extrabold text-[#0F172A]">Main Job: AC Repair</span>
                    <div className="text-[11px] text-[#64748B]">Customer: <strong>Roshani Kadam</strong> • Kolhapur</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded border border-sky-200 block">On The Way</span>
                    <span className="text-[10px] text-[#64748B] block mt-0.5">Time: 10:30 AM</span>
                  </div>
                </div>

                {/* Progress Pipeline */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-[#64748B] uppercase">Job Progress Pipeline</div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#334155] bg-white p-2.5 rounded-lg border border-[#E2E8F0] overflow-x-auto gap-2">
                    <span className="text-emerald-600">Assigned ✓</span>
                    <span className="text-emerald-600">Accepted ✓</span>
                    <span className="text-[#F97316] font-extrabold">On The Way ★</span>
                    <span className="text-slate-400">Service</span>
                    <span className="text-slate-400">Completed</span>
                  </div>
                </div>

                {/* Supporting Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="bg-white p-3 rounded-lg border border-[#E2E8F0]">
                    <div className="font-bold text-[#0F172A]">Parts Consumed</div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">Capacitor 45uF (1)</div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#E2E8F0]">
                    <div className="font-bold text-[#0F172A]">Service Notes</div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">Check cooling coil pressure</div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#E2E8F0]">
                    <div className="font-bold text-[#0F172A]">Job History</div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">2 jobs completed today</div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* PREVIEW CONTENT FOR CUSTOMER */}
          {activeRoleTab === 'CUSTOMER' && (
            <div className="p-6 space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-[#0F172A]">My Service</h3>
                  <p className="text-xs text-[#64748B]">Client tracking hub for live updates & invoices.</p>
                </div>
                <span className="text-xs font-bold text-[#0284C7] bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                  Customer Portal
                </span>
              </div>

              {/* Active Customer Request Preview Card */}
              <div className="bg-[#F4F6F8] border border-[#E2E8F0] rounded-xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <div className="text-xs font-bold text-[#64748B] uppercase">Service Request</div>
                    <div className="text-base font-extrabold text-[#0F172A]">AC Repair • SR-1024</div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#F97316] bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200 block">
                      Technician On The Way
                    </span>
                    <span className="text-[11px] font-bold text-[#0284C7] block mt-0.5">ETA: 14 minutes</span>
                  </div>
                </div>

                {/* Assigned Technician Profile */}
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0F172A] text-white font-bold text-xs flex items-center justify-center">
                      RS
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-[#0F172A]">Rahul Sharma</div>
                      <div className="text-[11px] text-[#64748B]">Assigned Field Engineer • ★ 4.9 Rating</div>
                    </div>
                  </div>

                  <button className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                    <Phone className="w-3.5 h-3.5" /> Contact Technician
                  </button>
                </div>

                {/* Customer Progress Pipeline */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-[#64748B] uppercase">Service Timeline</div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#334155] bg-white p-2.5 rounded-lg border border-[#E2E8F0] overflow-x-auto gap-2">
                    <span className="text-emerald-600">Requested ✓</span>
                    <span className="text-emerald-600">Assigned ✓</span>
                    <span className="text-[#F97316] font-extrabold">On The Way ★</span>
                    <span className="text-slate-400">Service</span>
                    <span className="text-slate-400">Completed</span>
                  </div>
                </div>

                {/* Action Links Strip */}
                <div className="flex items-center gap-4 text-xs font-bold text-[#0284C7] pt-1">
                  <span className="hover:underline cursor-pointer flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> View Service Details
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="hover:underline cursor-pointer flex items-center gap-1">
                    <Receipt className="w-3.5 h-3.5" /> View Digital Invoice
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
