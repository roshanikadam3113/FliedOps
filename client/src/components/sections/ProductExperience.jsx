import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      let shouldScroll = false;
      
      if (hash === '#company') {
        setActiveRoleTab('ADMIN');
        shouldScroll = true;
      } else if (hash === '#technicians') {
        setActiveRoleTab('TECHNICIAN');
        shouldScroll = true;
      } else if (hash === '#customers') {
        setActiveRoleTab('CUSTOMER');
        shouldScroll = true;
      }

      if (shouldScroll) {
        // Add a small delay to ensure React state update paints before scrolling
        setTimeout(() => {
          const el = document.getElementById('product-experience');
          if (el) {
            // Calculate offset for the floating navbar
            const y = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 10);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Only handle initial hash if it's one of ours to prevent auto-scrolling on random load
    if (['#company', '#technicians', '#customers'].includes(window.location.hash)) {
       handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <section id="product-experience" className="py-20 md:py-28 bg-page-bg border-b border-border-subtle">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary">
            ONE CONNECTED PLATFORM
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            One platform. Three experiences.
          </h2>

          <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
            Every role gets the tools they need to manage, perform, and track field service.
          </p>
        </div>

        {/* Role Tabs Switcher */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          
          <button
            onClick={() => setActiveRoleTab('ADMIN')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-[0.08em] transition-all cursor-pointer flex items-center gap-2 border ${
              activeRoleTab === 'ADMIN'
                ? 'bg-brand-accent border-brand-accent text-white shadow-xs'
                : 'bg-surface-primary border-border-subtle text-slate-custom hover:text-text-primary hover:bg-surface-secondary'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            COMPANY ADMIN
          </button>

          <button
            onClick={() => setActiveRoleTab('TECHNICIAN')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-[0.08em] transition-all cursor-pointer flex items-center gap-2 border ${
              activeRoleTab === 'TECHNICIAN'
                ? 'bg-brand-accent border-brand-accent text-white shadow-xs'
                : 'bg-surface-primary border-border-subtle text-slate-custom hover:text-text-primary hover:bg-surface-secondary'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            TECHNICIAN
          </button>

          <button
            onClick={() => setActiveRoleTab('CUSTOMER')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-[0.08em] transition-all cursor-pointer flex items-center gap-2 border ${
              activeRoleTab === 'CUSTOMER'
                ? 'bg-brand-accent border-brand-accent text-white shadow-xs'
                : 'bg-surface-primary border-border-subtle text-slate-custom hover:text-text-primary hover:bg-surface-secondary'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            CUSTOMER
          </button>

        </div>

        {/* Product UI Preview Showcase Container */}
        <div className="bg-surface-primary border border-border-subtle rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto">
          
          {/* Top Window Bar */}
          <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between text-xs border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 opacity-80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 opacity-80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 opacity-80" />
              </div>
              <span className="text-slate-600">|</span>
              <span className="font-extrabold text-slate-300 tracking-wider uppercase text-[11px]">
                FIELDOPS • {activeRoleTab} CONSOLE
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Product Preview
            </div>
          </div>

          {/* PREVIEW CONTENT FOR COMPANY ADMIN */}
          {activeRoleTab === 'ADMIN' && (
            <div className="p-6 space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <div>
                  <h3 className="text-lg font-extrabold text-text-primary">Operations Overview</h3>
                  <p className="text-xs text-text-secondary">Real-time company dispatch and active fleet monitoring.</p>
                </div>
                <span className="text-xs font-bold text-brand-secondary bg-brand-secondary/10 px-2.5 py-1 rounded-md border border-brand-secondary/20">
                  Company Admin Portal
                </span>
              </div>

              {/* 4 Admin Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-surface-secondary border border-border-subtle p-3.5 rounded-xl">
                  <div className="text-2xl font-extrabold text-text-primary">24</div>
                  <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mt-0.5">Active Jobs</div>
                </div>

                <div className="bg-surface-secondary border border-border-subtle p-3.5 rounded-xl">
                  <div className="text-2xl font-extrabold text-brand-secondary">12</div>
                  <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mt-0.5">Pending Requests</div>
                </div>

                <div className="bg-surface-secondary border border-border-subtle p-3.5 rounded-xl">
                  <div className="text-2xl font-extrabold text-text-primary">18</div>
                  <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mt-0.5">Technicians</div>
                </div>

                <div className="bg-surface-secondary border border-border-subtle p-3.5 rounded-xl">
                  <div className="text-2xl font-extrabold text-brand-success">31</div>
                  <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mt-0.5">Completed Today</div>
                </div>
              </div>

              {/* Table & Smart Assignment Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Live Operations Table */}
                <div className="lg:col-span-8 space-y-2">
                  <div className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    Live Operations Table
                  </div>
                  <div className="border border-border-subtle rounded-xl overflow-hidden text-xs">
                    <div className="grid grid-cols-12 bg-surface-secondary px-3 py-2 border-b border-border-subtle font-bold text-text-secondary uppercase tracking-wider text-[10px]">
                      <div className="col-span-4">JOB</div>
                      <div className="col-span-3">TECHNICIAN</div>
                      <div className="col-span-3">LOCATION</div>
                      <div className="col-span-2 text-right">STATUS</div>
                    </div>
                    <div className="divide-y divide-border-subtle bg-surface-primary">
                      <div className="grid grid-cols-12 px-3 py-2.5 items-center font-medium">
                        <div className="col-span-4 font-bold text-text-primary">AC Repair</div>
                        <div className="col-span-3 text-text-secondary">Rahul Sharma</div>
                        <div className="col-span-3 text-text-secondary">Kolhapur</div>
                        <div className="col-span-2 text-right">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20">On Way</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-12 px-3 py-2.5 items-center font-medium">
                        <div className="col-span-4 font-bold text-text-primary">RO Service</div>
                        <div className="col-span-3 text-text-secondary">Amit Patil</div>
                        <div className="col-span-3 text-text-secondary">Kolhapur</div>
                        <div className="col-span-2 text-right">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-success/10 text-brand-success border border-brand-success/20">In Progress</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-12 px-3 py-2.5 items-center font-medium">
                        <div className="col-span-4 font-bold text-text-primary">CCTV Installation</div>
                        <div className="col-span-3 text-text-secondary">Priya Verma</div>
                        <div className="col-span-3 text-text-secondary">Ichalkaranji</div>
                        <div className="col-span-2 text-right">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-secondary text-slate-custom border border-border-subtle">Scheduled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smart Assignment Card */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    Smart Assignment Indicator
                  </div>
                  <div className="bg-surface-secondary border border-brand-accent/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-text-secondary">Recommended Match</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-brand-accent/10 text-brand-accent border border-brand-accent/20">AI Match</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-custom text-surface-primary font-bold text-xs flex items-center justify-center">
                        RS
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-text-primary">Rahul Sharma</div>
                        <div className="text-[10px] text-text-secondary">HVAC Specialist • 4.2 km</div>
                      </div>
                      <div className="ml-auto text-right">
                        <span className="text-base font-extrabold text-brand-accent">95%</span>
                        <span className="text-[9px] font-bold text-text-secondary block">Score</span>
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
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <div>
                  <h3 className="text-lg font-extrabold text-text-primary">Today's Work</h3>
                  <p className="text-xs text-text-secondary">Mobile workspace for on-site service execution.</p>
                </div>
                <span className="text-xs font-bold text-brand-secondary bg-brand-secondary/10 px-2.5 py-1 rounded-md border border-brand-secondary/20">
                  Technician Mobile App
                </span>
              </div>

              {/* 3 Tech Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface-secondary border border-border-subtle p-3.5 rounded-xl">
                  <div className="text-xl font-extrabold text-text-primary">5</div>
                  <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mt-0.5">Today's Jobs</div>
                </div>

                <div className="bg-surface-secondary border border-border-subtle p-3.5 rounded-xl">
                  <div className="text-xl font-extrabold text-brand-success">2</div>
                  <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mt-0.5">Completed</div>
                </div>

                <div className="bg-surface-secondary border border-border-subtle p-3.5 rounded-xl">
                  <div className="text-xl font-extrabold text-brand-accent">3</div>
                  <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mt-0.5">Remaining</div>
                </div>
              </div>

              {/* Main Active Job Details */}
              <div className="bg-surface-secondary border border-border-subtle rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                  <div>
                    <span className="text-xs font-extrabold text-text-primary">Main Job: AC Repair</span>
                    <div className="text-[11px] text-text-secondary">Customer: <strong>Roshani Kadam</strong> • Kolhapur</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded border border-brand-secondary/20 block">On The Way</span>
                    <span className="text-[10px] text-text-secondary block mt-0.5">Time: 10:30 AM</span>
                  </div>
                </div>

                {/* Progress Pipeline */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-text-secondary uppercase">Job Progress Pipeline</div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-custom bg-surface-primary p-2.5 rounded-lg border border-border-subtle overflow-x-auto gap-2">
                    <span className="text-brand-success">Assigned ✓</span>
                    <span className="text-brand-success">Accepted ✓</span>
                    <span className="text-brand-accent font-extrabold">On The Way ★</span>
                    <span className="text-text-secondary opacity-50">Service</span>
                    <span className="text-text-secondary opacity-50">Completed</span>
                  </div>
                </div>

                {/* Supporting Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="bg-surface-primary p-3 rounded-lg border border-border-subtle">
                    <div className="font-bold text-text-primary">Parts Consumed</div>
                    <div className="text-[11px] text-text-secondary mt-0.5">Capacitor 45uF (1)</div>
                  </div>

                  <div className="bg-surface-primary p-3 rounded-lg border border-border-subtle">
                    <div className="font-bold text-text-primary">Service Notes</div>
                    <div className="text-[11px] text-text-secondary mt-0.5">Check cooling coil pressure</div>
                  </div>

                  <div className="bg-surface-primary p-3 rounded-lg border border-border-subtle">
                    <div className="font-bold text-text-primary">Job History</div>
                    <div className="text-[11px] text-text-secondary mt-0.5">2 jobs completed today</div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* PREVIEW CONTENT FOR CUSTOMER */}
          {activeRoleTab === 'CUSTOMER' && (
            <div className="p-6 space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <div>
                  <h3 className="text-lg font-extrabold text-text-primary">My Service</h3>
                  <p className="text-xs text-text-secondary">Client tracking hub for live updates & invoices.</p>
                </div>
                <span className="text-xs font-bold text-brand-secondary bg-brand-secondary/10 px-2.5 py-1 rounded-md border border-brand-secondary/20">
                  Customer Portal
                </span>
              </div>

              {/* Active Customer Request Preview Card */}
              <div className="bg-surface-secondary border border-border-subtle rounded-xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border-subtle">
                  <div>
                    <div className="text-xs font-bold text-text-secondary uppercase">Service Request</div>
                    <div className="text-base font-extrabold text-text-primary">AC Repair • SR-1024</div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-brand-accent bg-brand-accent/10 px-2.5 py-1 rounded-md border border-brand-accent/20 block">
                      Technician On The Way
                    </span>
                    <span className="text-[11px] font-bold text-brand-secondary block mt-0.5">ETA: 14 minutes</span>
                  </div>
                </div>

                {/* Assigned Technician Profile */}
                <div className="flex items-center justify-between bg-surface-primary p-3 rounded-lg border border-border-subtle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-custom text-surface-primary font-bold text-xs flex items-center justify-center">
                      RS
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-text-primary">Rahul Sharma</div>
                      <div className="text-[11px] text-text-secondary">Assigned Field Engineer • ★ 4.9 Rating</div>
                    </div>
                  </div>

                  <button className="px-3 py-1.5 rounded-lg bg-brand-success/10 text-brand-success border border-brand-success/20 text-xs font-bold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Contact Technician
                  </button>
                </div>

                {/* Customer Progress Pipeline */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-text-secondary uppercase">Service Timeline</div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-custom bg-surface-primary p-2.5 rounded-lg border border-border-subtle overflow-x-auto gap-2">
                    <span className="text-brand-success">Requested ✓</span>
                    <span className="text-brand-success">Assigned ✓</span>
                    <span className="text-brand-accent font-extrabold">On The Way ★</span>
                    <span className="text-text-secondary opacity-50">Service</span>
                    <span className="text-text-secondary opacity-50">Completed</span>
                  </div>
                </div>

                {/* Action Links Strip */}
                <div className="flex items-center gap-4 text-xs font-bold text-brand-secondary pt-1">
                  <span className="hover:underline cursor-pointer flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> View Service Details
                  </span>
                  <span className="text-border-subtle">•</span>
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
