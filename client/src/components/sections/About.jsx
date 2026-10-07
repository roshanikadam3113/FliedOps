import React from 'react';
import { ShieldCheck, Users, Zap, CheckCircle2 } from 'lucide-react';

export default function About() {
  const pillars = [
    {
      title: 'Less Coordination Complexity',
      desc: 'Streamline service dispatch, technician routing, and job execution into one connected platform without endless phone calls.',
      icon: Zap
    },
    {
      title: 'Better Visibility',
      desc: 'Give dispatchers real-time maps and give customers live GPS tracking with accurate technician arrival ETAs.',
      icon: Users
    },
    {
      title: 'Centralized Service History',
      desc: 'Maintain complete operational records, job histories, and instant digital invoicing in one secure hub.',
      icon: ShieldCheck
    }
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-page-bg border-b border-border-subtle">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary">
            WHY FIELDOPS
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Connecting the entire field service ecosystem.
          </h2>

          <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
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
                className="bg-surface-primary border border-border-subtle rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs hover:border-brand-secondary/50 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-surface-secondary text-brand-secondary flex items-center justify-center group-hover:bg-brand-secondary/10 transition-colors">
                  <IconComp className="w-5 h-5" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-extrabold text-text-primary tracking-tight group-hover:text-brand-secondary transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-success pt-2 border-t border-border-subtle">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Operational Benefit</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
