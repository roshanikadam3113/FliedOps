import React, { useState, useEffect } from 'react';
import { FileCheck2, Wrench, Clock } from 'lucide-react';

export default function LiveCounterStrip() {
  const [jobsCount, setJobsCount] = useState(48250);

  // Live incrementing counter simulation every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setJobsCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      value: `${jobsCount.toLocaleString()}+`,
      label: 'Jobs Completed',
      icon: FileCheck2,
      color: 'text-[#0F172A]'
    },
    {
      value: '1,200+',
      label: 'Active Technicians',
      icon: Wrench,
      color: 'text-[#0284C7]'
    },
    {
      value: '99.4%',
      label: 'On-Time SLA',
      icon: Clock,
      color: 'text-[#F97316]'
    }
  ];

  return (
    <section className="py-6 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
          {stats.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <div key={idx} className="px-2 space-y-1">
                <div className="inline-flex items-center justify-center p-1.5 rounded-lg bg-slate-50 text-[#0284C7] mb-0.5">
                  <IconComp className="w-4 h-4" />
                </div>
                <div className={`text-xl sm:text-2xl font-extrabold tracking-tight ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-[#64748B]">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
