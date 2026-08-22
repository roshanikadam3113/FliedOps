import React, { useState } from 'react';
import { 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Users, 
  FileText, 
  IndianRupee,
  Wrench
} from 'lucide-react';

export default function Hero({ onOpenAuthModal }) {
  const [activeJobFilter, setActiveJobFilter] = useState('all');

  const jobs = [
    {
      id: 'JOB-2049',
      service: 'AC Repair',
      customer: 'Rajesh Sharma',
      technician: 'Vikram Singh',
      status: 'On the Way',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: Truck
    },
    {
      id: 'JOB-2050',
      service: 'RO Service',
      customer: 'Priya Verma',
      technician: 'Amit Kumar',
      status: 'In Progress',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: Clock
    },
    {
      id: 'JOB-2051',
      service: 'CCTV Repair',
      customer: 'Apex Logistics',
      technician: 'Suresh Patel',
      status: 'Assigned',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      icon: CheckCircle2
    }
  ];

  return (
    <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 bg-slate-950">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[260px] bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span>Field Service Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Manage Every Service. <br />
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                From Request to Resolution.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              FieldOps helps service businesses manage customers, technicians, jobs, inventory, and billing from one powerful platform.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                onClick={() => onOpenAuthModal('get-started')}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>See How It Works</span>
              </a>
            </div>
          </div>

          {/* Clean Dashboard Preview */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-bold text-white">Today's Overview</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">Live Sync</span>
              </div>

              {/* 4 Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Service Requests</div>
                  <div className="text-lg font-bold text-white mt-1">48</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Technicians</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">16</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Completed Jobs</div>
                  <div className="text-lg font-bold text-indigo-400 mt-1">31</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Revenue</div>
                  <div className="text-lg font-bold text-amber-400 mt-1">₹24,500</div>
                </div>
              </div>

              {/* Active Jobs */}
              <div className="pt-2 space-y-2">
                <div className="text-xs font-semibold text-slate-300">Active Jobs</div>
                <div className="space-y-2">
                  {jobs.map((j) => {
                    const Icon = j.icon;
                    return (
                      <div key={j.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">{j.service}</div>
                          <div className="text-[11px] text-slate-400">{j.customer} • Tech: {j.technician}</div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border flex items-center gap-1 ${j.color}`}>
                          <Icon className="w-3 h-3" />
                          {j.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
