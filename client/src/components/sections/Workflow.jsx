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
      desc: 'FieldOps recommends the right technician.',
      icon: Sparkles
    },
    {
      num: '04',
      title: 'FIELD SERVICE',
      role: 'TECHNICIAN',
      desc: 'Technician accepts the job and performs the service.',
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
    <section id="workflow" className="py-20 md:py-28 bg-[#F4F6F8] border-b border-[#E2E8F0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
            HOW FIELDOPS WORKS
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            From service request to resolution.
          </h2>

          <p className="text-[#64748B] text-base sm:text-lg leading-relaxed">
            FieldOps connects customers, company teams, and technicians through one seamless workflow — keeping every service request visible from start to finish.
          </p>
        </div>

        {/* Desktop Connected Workflow Timeline */}
        <div className="relative pt-4">
          
          {/* Horizontal Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[60px] right-[60px] h-[2px] bg-[#E2E8F0] -z-0" />

          {/* Desktop Grid Layout (Uniform Clean Styling) */}
          <div className="hidden lg:grid grid-cols-6 gap-6 relative z-10">
            {stages.map((stage, idx) => {
              const IconComp = stage.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-3 transition-all duration-300 group cursor-pointer hover:border-[#0284C7] hover:-translate-y-2 hover:shadow-xl hover:shadow-sky-500/10"
                >
                  {/* Number & Icon Container */}
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-[#334155] transition-colors group-hover:bg-[#0284C7] group-hover:text-white">
                      {stage.num}
                    </span>

                    <div className="p-2 rounded-lg bg-slate-50 text-[#0284C7] transition-transform duration-300 group-hover:scale-110">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Role */}
                  <div className="space-y-1">
                    <div className="text-xs font-extrabold tracking-tight text-[#0F172A] group-hover:text-[#0284C7] transition-colors">
                      {stage.title}
                    </div>
                    <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                      {stage.role}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#64748B] leading-snug pt-1 group-hover:text-[#334155] transition-colors">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mobile Vertical Timeline */}
          <div className="lg:hidden space-y-4 relative pl-6 border-l-2 border-[#E2E8F0] ml-3">
            {stages.map((stage, idx) => {
              const IconComp = stage.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-[#E2E8F0] rounded-xl p-4 space-y-2 relative transition-all duration-300 cursor-pointer hover:border-[#0284C7] hover:shadow-md"
                >
                  {/* Timeline Dot Indicator */}
                  <div className="absolute -left-[33px] top-4 w-4 h-4 rounded-full border-2 border-[#0284C7] bg-white flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-slate-100 text-[#334155]">
                      STAGE {stage.num}
                    </span>
                    <IconComp className="w-4 h-4 text-[#0284C7]" />
                  </div>

                  <div>
                    <div className="text-xs font-extrabold text-[#0F172A]">
                      {stage.title}
                    </div>
                    <div className="text-[10px] font-bold text-[#64748B] uppercase">
                      {stage.role}
                    </div>
                  </div>

                  <p className="text-xs text-[#64748B]">
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
