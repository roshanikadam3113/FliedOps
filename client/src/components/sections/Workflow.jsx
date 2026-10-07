import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Wrench, 
  CheckSquare, 
  Receipt 
} from 'lucide-react';

export default function Workflow() {
  const stages = [
    {
      num: '01',
      title: 'REQUEST',
      role: 'CUSTOMER',
      desc: 'Customer submits a service request.',
      icon: FileText
    },
    {
      num: '02',
      title: 'REVIEW',
      role: 'COMPANY ADMIN',
      desc: 'Company admin reviews the request.',
      icon: CheckCircle2
    },
    {
      num: '03',
      title: 'SMART ASSIGNMENT',
      role: 'FIELDOPS AI',
      desc: 'FieldOps recommends the right technician based on skills and location.',
      icon: Sparkles,
      highlight: true
    },
    {
      num: '04',
      title: 'FIELD SERVICE',
      role: 'TECHNICIAN',
      desc: 'Technician accepts the job and performs the service on-site.',
      icon: Wrench
    },
    {
      num: '05',
      title: 'COMPLETION',
      role: 'TECHNICIAN',
      desc: 'Technician records work, parts, photos, and completion details.',
      icon: CheckSquare
    },
    {
      num: '06',
      title: 'INVOICE & REVIEW',
      role: 'CUSTOMER & ADMIN',
      desc: 'Invoice is generated and customer provides feedback.',
      icon: Receipt
    }
  ];

  return (
    <section id="workflow" className="py-20 md:py-28 bg-page-bg border-b border-border-subtle">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary">
            HOW FIELDOPS WORKS
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            From service request to resolution.
          </h2>

          <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
            FieldOps connects customers, company teams, and technicians through one seamless workflow — keeping every service request visible from start to finish.
          </p>
        </div>

        {/* Desktop Connected Workflow Timeline */}
        <div className="relative pt-4">
          
          {/* Horizontal Glowing Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[60px] right-[60px] h-[2px] bg-gradient-to-r from-transparent via-brand-secondary/50 to-transparent -z-0" style={{ boxShadow: '0 0 12px rgba(56, 189, 248, 0.4)' }} />

          {/* Desktop Grid Layout */}
          <div className="hidden lg:grid grid-cols-6 gap-6 relative z-10">
            {stages.map((stage, idx) => {
              const IconComp = stage.icon;
              return (
                <div 
                  key={idx} 
                  className={`bg-surface-primary border rounded-xl p-5 space-y-3 transition-all duration-300 group cursor-pointer hover:-translate-y-2 hover:shadow-xl ${stage.highlight ? 'border-brand-accent shadow-brand-accent/5' : 'border-border-subtle hover:border-brand-secondary hover:shadow-brand-secondary/5'}`}
                >
                  {/* Number & Icon Container */}
                  <div className="flex items-center justify-between pb-1">
                    <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full transition-colors ${stage.highlight ? 'bg-brand-accent text-white' : 'bg-surface-secondary text-slate-custom group-hover:bg-brand-secondary group-hover:text-white'}`}>
                      {stage.num}
                    </span>

                    <div className={`p-2 rounded-lg transition-transform duration-300 group-hover:scale-110 ${stage.highlight ? 'bg-brand-accent/10 text-brand-accent' : 'bg-surface-secondary text-brand-secondary'}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Role */}
                  <div className="space-y-1">
                    <div className={`text-xs font-extrabold tracking-tight transition-colors ${stage.highlight ? 'text-brand-accent' : 'text-text-primary group-hover:text-brand-secondary'}`}>
                      {stage.title}
                    </div>
                    <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                      {stage.role}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-text-secondary leading-snug pt-1 group-hover:text-text-primary transition-colors">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mobile Vertical Timeline */}
          <div className="lg:hidden space-y-4 relative pl-6 border-l-2 border-border-subtle ml-3">
            {stages.map((stage, idx) => {
              const IconComp = stage.icon;
              return (
                <div 
                  key={idx}
                  className={`bg-surface-primary border rounded-xl p-4 space-y-2 relative transition-all duration-300 cursor-pointer hover:shadow-md ${stage.highlight ? 'border-brand-accent' : 'border-border-subtle hover:border-brand-secondary'}`}
                >
                  {/* Timeline Dot Indicator */}
                  <div className={`absolute -left-[33px] top-4 w-4 h-4 rounded-full border-2 bg-surface-primary flex items-center justify-center ${stage.highlight ? 'border-brand-accent' : 'border-brand-secondary'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${stage.highlight ? 'bg-brand-accent' : 'bg-brand-secondary'}`} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-extrabold px-2 py-0.5 rounded ${stage.highlight ? 'bg-brand-accent/10 text-brand-accent' : 'bg-surface-secondary text-slate-custom'}`}>
                      STAGE {stage.num}
                    </span>
                    <IconComp className={`w-4 h-4 ${stage.highlight ? 'text-brand-accent' : 'text-brand-secondary'}`} />
                  </div>

                  <div>
                    <div className="text-xs font-extrabold text-text-primary">
                      {stage.title}
                    </div>
                    <div className="text-[10px] font-bold text-text-secondary uppercase">
                      {stage.role}
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
