import React from 'react';
import { ShieldCheck, Users, Zap, CheckCircle2 } from 'lucide-react';

export default function About() {
  const pillars = [
    {
      title: 'OPERATIONAL EFFICIENCY',
      desc: 'Streamlining service dispatch, technician routing, and job execution into one connected platform.',
      icon: Zap
    },
    {
      title: 'TRANSPARENT SERVICE',
      desc: 'Giving customers real-time GPS tracking and live technician arrival ETAs for complete peace of mind.',
      icon: Users
    },
    {
      title: 'ENTERPRISE RELIABILITY',
      desc: 'Designed for field service businesses of all sizes, ensuring 99.9% uptime and instant invoicing.',
      icon: ShieldCheck
    }
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-[#F4F6F8] border-b border-[#E2E8F0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
            ABOUT FIELDOPS
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Connecting the entire field service ecosystem.
          </h2>

          <p className="text-[#64748B] text-base sm:text-lg leading-relaxed">
            FieldOps was built to solve the core challenges of field operations — eliminating coordination chaos, improving technician routing efficiency, and giving customers complete transparency.
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const IconComp = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs hover:border-[#0284C7]/50 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-[#0284C7] flex items-center justify-center group-hover:bg-sky-50 transition-colors">
                  <IconComp className="w-5 h-5" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xs font-extrabold text-[#0F172A] tracking-tight group-hover:text-[#0284C7] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 pt-2 border-t border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>FieldOps Core Guarantee</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
